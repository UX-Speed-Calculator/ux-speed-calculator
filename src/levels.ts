// Ordered list of the calculator's levels. Single source for the top nav links, the
// in-page previous/next arrows and the 3D scene's camera views, so add, remove or reorder
// levels here only.
//
// Each camera view is where the camera sits and the point it looks at, in scene units.
// The views are placeholders to demonstrate camera movement; replace them once each
// level's real view is decided.
const LEVELS = [
  { camera: { position: [0, 2, 3], target: [0, 2, 0] }, href: '/', label: 'Level 1' },
  { camera: { position: [1, 3, 5], target: [1, 2, 0] }, href: '/level2', label: 'Level 2' },
  { camera: { position: [-3, 3, 4], target: [1, 2, 0] }, href: '/level3', label: 'Level 3' },
  { camera: { position: [5, 3, 4], target: [1, 2, 0] }, href: '/level4', label: 'Level 4' },
  { camera: { position: [1, 8, 8], target: [1, 5, 0] }, href: '/level5', label: 'Level 5' },
  { camera: { position: [1, 10, 12], target: [1, 8, 0] }, href: '/level6', label: 'Level 6' },
  { camera: { position: [4, 12, 16], target: [1, 10, 0] }, href: '/level7', label: 'Level 7' },
] as const;

// Index of the level at `pathname`, or -1 on pages that aren't levels (e.g. About, 404)
function levelIndex(pathname: string) {
  // Ignore a trailing slash so "/level2/" still matches "/level2"
  const path = pathname.replace(/(.)\/$/, '$1');

  return LEVELS.findIndex((level) => level.href === path);
}

export { levelIndex, LEVELS };
