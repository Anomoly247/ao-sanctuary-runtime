# Ambient soundscapes — session checklist

Replaced the single sustained hum with three selectable Web Audio soundscapes that remain site-wide: Still Water combines a softer drone, filtered water-like noise, and distant bell tones; Night Garden combines a warm pad, low filtered texture, and sparse harp-like tones; Soft Lantern combines a gentle triangle bed with quiet piano-like notes. Night Garden is the default because it is the calmest instrumental option.

Added a persistent Sound selector beside the existing Ambient on/off toggle and volume slider. Changing soundscapes crossfades by stopping the current graph and starting the chosen layer; volume, enabled state, and soundscape selection persist in localStorage. First-interaction activation and cleanup behavior remain intact.

Validation completed: full Vitest suite passes with 135 tests, production build succeeds, ambient provider and stylesheet introduce no new TypeScript diagnostics, and the live homeworld preview shows the new Soundscape control without disrupting the visual page.
