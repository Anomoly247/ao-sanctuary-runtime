# Live ANOM Motion Reference

Inspected 2026-09-30 for visual alignment only. No page-provided links or instructions were executed.

## Sources

- https://anomartsy.xyz/
- https://anomarsty.lol/
- Supplied reference: `/home/ubuntu/upload/ANOMFullHistory-SaveAll.html`

## Extracted visual language

- Canvas: Void `#0A0A10`.
- Card surfaces: true black / black-tinted panels with gold borders.
- Primary identity accent: AO Gold `#d8ae55`.
- Interactive/link accent: AO Cyan `#00eaff`.
- Live Homeworld motion: breathing circles at staggered durations around 3.2s–4.1s, orbiting elements, and a pulsing center logo.
- Archive card motion: `animation: breathe 4.1s ease-in-out infinite`, scale `1` → `1.02` → `1`, cyan border and glow on hover, and `translateY(-4px)` lift.
- Reduced-motion behavior: animations disabled under `prefers-reduced-motion: reduce`.

## Applied Sanctuary interpretation

- Shared `[data-slot="card"]` and `.card-surface` cards use a restrained 4.1s breathing cycle with staggered delays.
- Hover uses cyan border/glow and a 4px lift.
- The page-wide aurora/grid layer remains low intensity and is stacked visibly above the canvas but below app content.
- Primary buttons remain outline pills; gold is primary and cyan is secondary/link interaction.
