import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ENV } from "./_core/env";
import { protectedProcedure, router } from "./_core/trpc";

const postInput = z.object({ id: z.string(), platform: z.enum(["facebook", "instagram"]), url: z.string().url() });

type NativeMetric = { reach: number | null; likes: number | null; comments: number | null; fetchedAt: number; source: "meta" | "instagram" };

function assertAdmin(user: { role?: string | null }) {
  if (user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
}

function graphConfig() {
  return {
    token: process.env.META_GRAPH_ACCESS_TOKEN || "",
    pageId: process.env.META_FACEBOOK_PAGE_ID || "",
    instagramId: process.env.META_INSTAGRAM_BUSINESS_ACCOUNT_ID || "",
    version: process.env.META_GRAPH_API_VERSION || "v23.0",
  };
}

async function graphGet(path: string, params: Record<string, string>) {
  const { token, version } = graphConfig();
  const search = new URLSearchParams({ ...params, access_token: token });
  const response = await fetch(`https://graph.facebook.com/${version}/${path}?${search}`);
  const body = await response.json() as { error?: { message?: string }; [key: string]: unknown };
  if (!response.ok || body.error) throw new Error(body.error?.message || `Meta Graph request failed (${response.status})`);
  return body;
}

function configured() {
  const config = graphConfig();
  return Boolean(config.token && config.pageId && config.instagramId);
}

export function getMetaConfigStatus() {
  const config = graphConfig();
  return {
    configured: configured(),
    facebook: Boolean(config.token && config.pageId),
    instagram: Boolean(config.token && config.instagramId),
  };
}

async function resolveMediaId(platform: "facebook" | "instagram", url: string) {
  const config = graphConfig();
  const edge = platform === "instagram" ? `${config.instagramId}/media` : `${config.pageId}/posts`;
  const fields = platform === "instagram" ? "id,permalink" : "id,permalink_url";
  const result = await graphGet(edge, { fields, limit: "100" });
  const normalized = url.replace(/\/$/, "");
  const found = (result.data as Array<Record<string, string>> | undefined)?.find((item) => (item.permalink || item.permalink_url || "").replace(/\/$/, "") === normalized);
  return found?.id || "";
}

async function readNativeMetric(platform: "facebook" | "instagram", mediaId: string): Promise<NativeMetric> {
  const result = platform === "instagram"
    ? await graphGet(`${mediaId}/insights`, { metric: "reach,likes,comments" })
    : await graphGet(mediaId, { fields: "insights.metric(post_impressions_unique),likes.limit(0).summary(true),comments.limit(0).summary(true)" });
  if (platform === "instagram") {
    const values = Object.fromEntries((result.data as Array<{ name: string; values?: Array<{ value?: number }> }> | undefined || []).map((item) => [item.name, item.values?.[0]?.value ?? null]));
    return { reach: values.reach ?? null, likes: values.likes ?? null, comments: values.comments ?? null, fetchedAt: Date.now(), source: "instagram" };
  }
  const insights = (result.insights as { data?: Array<{ name: string; values?: Array<{ value?: number }> }> } | undefined)?.data || [];
  const reach = insights.find((item) => item.name === "post_impressions_unique")?.values?.[0]?.value ?? null;
  const likesNode = result.likes as unknown as { summary?: { total_count?: number } } | undefined;
  const commentsNode = result.comments as unknown as { summary?: { total_count?: number } } | undefined;
  const likes = likesNode?.summary?.total_count ?? null;
  const comments = commentsNode?.summary?.total_count ?? null;
  return { reach, likes, comments, fetchedAt: Date.now(), source: "meta" };
}

export const metaRouter = router({
  status: protectedProcedure.query(async ({ ctx }) => {
    assertAdmin(ctx.user);
    const config = graphConfig();
    return { configured: configured(), facebook: Boolean(config.token && config.pageId), instagram: Boolean(config.token && config.instagramId), message: configured() ? "Meta native insights are ready to sync." : "Add the server-side Meta Graph credentials to enable native insights." };
  }),
  syncNative: protectedProcedure.input(z.object({ posts: z.array(postInput).max(100) })).mutation(async ({ ctx, input }) => {
    assertAdmin(ctx.user);
    if (!configured()) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Meta Graph credentials are not configured on the server." });
    const results: Record<string, NativeMetric | { error: string }> = {};
    for (const post of input.posts) {
      try {
        const mediaId = await resolveMediaId(post.platform, post.url);
        results[post.id] = mediaId ? await readNativeMetric(post.platform, mediaId) : { error: "Post URL was not found in the connected account." };
      } catch (error) {
        results[post.id] = { error: error instanceof Error ? error.message : "Native insight request failed." };
      }
    }
    return results;
  }),
});
