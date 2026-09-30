# Facebook + Instagram post collections — session checklist

## Completed

The Admin Hub Publishing Desk now has a curated social constellation editor. Anom can add Facebook posts or Instagram posts, paste a public permalink, set a display title and caption, choose draft or published visibility, and feature the post for Anom's Corner. The editor validates the URL shape before calling it embed-ready.

Anom's Corner now renders published featured posts using Meta's official public embed patterns: Facebook Embedded Posts through the Facebook JavaScript SDK and Instagram posts/reels through Instagram's embed.js. Each post also keeps a direct source link, and invalid or unavailable posts fall back to a calm source card instead of breaking the page.

The collection is intentionally empty until real post permalinks are supplied. The Facebook page URL is already connected as the channel link, but a page URL is not itself a post embed URL. Instagram channel URL remains editable in the Publishing Desk because no Instagram profile URL or post permalinks were supplied yet.

Existing Anom's Corner copy was aligned with the non-neon Sanctuary language. Printful was left as a future commerce connector and was not wired into this social embed pass.

## Source-grounded behavior

Meta's official Facebook Embedded Posts documentation requires public Page/profile posts and a post permalink in `data-href`, plus the Facebook JavaScript SDK. Instagram's official help confirms that public posts, reels, guides, and profiles can be embedded when the account allows embeds; private or embed-disabled content cannot render.

## Validation

`pnpm vitest run server/ao-content.test.ts`: 4 tests passed.

`pnpm test`: 14 test files passed, 139 tests passed.

`pnpm build`: production bundle completed successfully.

No new TypeScript diagnostics were reported in the updated Admin Hub, content registry, Anom's Corner, embed component, or embed tests. The project still reports its existing unrelated server baseline diagnostics in `server/db.ts` and `server/membership.procedures.ts`.

Visual screenshots were captured for Admin Hub and Anom's Corner after the embed surface was added.
