# Publishing Desk live preview — session checklist

## Completed

- Added a `Preview embed` control to each Facebook/Instagram post card.
- Preview renders the same official Facebook or Instagram embed markup used by the public Anom's Corner surface.
- Preview is explicitly draft-only and does not change post visibility or save/publish anything.
- Added an editable unavailable-post message per social post.
- Unavailable-post cards now direct visitors to configured Facebook, Instagram, and YouTube profile links, plus the original post URL when present.
- Older local drafts without the new fallback field are migrated to the default AO recovery message.
- Preserved the no-code authoring boundary: all changes happen through simple Admin Hub fields and choices.

## Validation

- `pnpm vitest run server/ao-content.test.ts`: 4 passed.
- `pnpm test`: 14 files and 139 tests passed.
- `pnpm build`: completed successfully.
- TypeScript diagnostics remain limited to the existing unrelated server baseline; no new diagnostics were found in AdminHub, ExternalContentSpots, aoContent, or the updated test file.
- Browser verification was limited by the preview browser not carrying the authenticated admin session; the public code path and production build are verified.
