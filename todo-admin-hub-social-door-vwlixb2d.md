# Admin Hub + guest-first social door — session checklist

## Completed

- Added `/admin-hub` for owner-only content, publishing, and offer controls.
- Added Content Studio entries for Library World and Anom's Corner with placement, platform, age tier, status, featured state, and source URL editing.
- Added Publishing Desk channel map with the provided destinations:
  - YouTube: https://www.youtube.com/@anomoriginals
  - Facebook: https://www.facebook.com/anomoriginals
  - Substack: https://anomorig.substack.com/
- Added Shop & Offerings for Spreadshop and creative-service destinations.
- Added shared connected-content spots to Library World and Anom's Corner.
- Removed the public sign-up card from the landing page and replaced it with a guest-first external web door.
- Kept authentication available for saving identity and rewards, but no longer made it the first public experience.
- Preserved the deep-gold/cyan Sanctuary palette, Georgia-like typography, cosmic web, and ambient sound controls.

## Validation

- `pnpm test`: 14 test files passed, 138 tests passed.
- `pnpm build`: production bundle completed successfully.
- Added `server/ao-content.test.ts` coverage for generalized platform links and YouTube embed parsing.
- Visual screenshots captured for `/`, `/admin-hub`, `/library`, and `/anoms-corner`.

## Deferred by design

- Facebook and Instagram live-feed APIs are not called directly from the browser. The Admin Hub stores generalized public links and the public surfaces render safe link cards. Platform API/connector wiring can be added later without redesigning the control surface.
- Admin content is currently saved to browser local storage because no new schema tables were requested. A later persistence pass can move the same registry shape to the existing server layer.
