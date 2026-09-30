# Shared cosmic web — session checklist

Implemented a reusable CosmicWeb overlay mounted in the app shell so the visual language follows users across routes instead of being limited to the homeworld. It contains 28 distributed gold, cyan, and garden-green stars with staggered twinkle timing; 8 alternate web lines that drift subtly; and 3 occasional shooting-star trails. The layer is pointer-safe, uses `aria-hidden`, preserves the existing palette, and slows rather than removes motion when reduced-motion is preferred.

Verified the shared layer on the homeworld, personal world profile, Play Worlds, and Mission Hub at 1280px. The full Vitest suite passes with 135 tests and the production build succeeds. Existing unrelated TypeScript diagnostics remain in other server/admin files; no new diagnostics were introduced by CosmicWeb, App.tsx, or the new CSS.
