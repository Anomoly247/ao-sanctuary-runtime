export type AOPitchPhase = {
  id: string;
  label: string;
  horizon: string;
  objective: string;
  targets: readonly string[];
  status: "planning" | "gated" | "in-progress";
};

export const AO_PITCH_PHASES: readonly AOPitchPhase[] = [
  { id: "bootstrap", label: "Bootstrap", horizon: "2026", objective: "Prove the connected creative-service flywheel.", targets: ["Validate the AO destination registry", "Ship truthful non-cash GP/AC ledger foundations", "Protect child-facing IP and provenance"], status: "in-progress" },
  { id: "seed", label: "Seed readiness", horizon: "Q4 2026", objective: "Prepare a safe, SFW, community-first seed narrative.", targets: ["Separate pitch metrics from user telemetry", "Document technology, safety, team, marketing, and legal/reserve needs", "Demonstrate one complete contribution-to-identity loop"], status: "planning" },
  { id: "arr", label: "ARR milestone", horizon: "2027", objective: "Scale validated divisions without weakening Sanctuary safety.", targets: ["Pilot owner-reviewed AI tools", "Grow permissioned Lounges", "Expand controlled content and merchandise operations"], status: "planning" },
  { id: "series-a", label: "Series A expansion", horizon: "2028", objective: "Build enterprise-grade identity, security, and operations.", targets: ["Formalize Security Team controls", "Evaluate Payment Infra as a separate product", "Prepare international and licensing review"], status: "gated" },
  { id: "global", label: "Global vision", horizon: "2029+", objective: "Protect and extend the AO universe through carefully governed partnerships.", targets: ["International readiness review", "Character and brand licensing safeguards", "Strategic partnerships only after IP and child-safety review"], status: "gated" },
] as const;

export const AO_PITCH_GUARDRAILS = [
  "Planning targets are not live user analytics.",
  "No real-money conversion or spendable payment flow is enabled.",
  "No private identity-passport material is collected by this report.",
  "Every character, asset, route, and source remains provenance-tracked.",
] as const;
