# Homeworld alive-signal enhancement

The first Sanctuary page now has a visible connection layer instead of relying on the center signal alone. The orbit map contains twenty staggered gold, cyan, and garden-green twinkle points; four animated connection paths between the AO core and the world nodes; traveling light pulses on those paths; and two expanding live-signal ripples around the center. The existing deep-gold/cyan palette was preserved.

Validation completed: the full Vitest suite passes with 135 tests, the production build succeeds, and the authenticated 1280px homeworld preview visibly shows the stars, connection web, and ripple rings. Existing unrelated TypeScript diagnostics remain in other server/admin files; no new Home.tsx or motion-layer diagnostics were introduced.
