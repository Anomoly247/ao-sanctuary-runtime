export const libraryWorldAssets = {
  pixel: "/manus-storage/library-pixel_8b3a5225.png",
  dot: "/manus-storage/library-dot_94e0e0f1.png",
  clifford: "/manus-storage/library-clifford-canonical_fcb00d06.png",
  tater: "/manus-storage/library-tater-canonical_d2544178.png",
} as const;

export const libraryWorldGameIds = [
  "library-pixel-dot",
  "library-clifford-patrol",
  "library-tater-shelf-heist",
] as const;

export type LibraryWorldGameId = (typeof libraryWorldGameIds)[number];

export const libraryWorldGameLabels: Record<LibraryWorldGameId, string> = {
  "library-pixel-dot": "Pixel & Dot",
  "library-clifford-patrol": "Clifford Patrol",
  "library-tater-shelf-heist": "Tater Shelf Heist",
};
