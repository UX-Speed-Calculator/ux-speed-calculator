import { createMutable } from 'solid-js/store';
import { isServer } from 'solid-js/web';

interface SceneColumn {
  numUsers: number;
}

interface SceneSettings {
  // Smooths jagged edges. Fixed once the page loads, since the renderer can't change it.
  antialias: boolean;
  columnCount: number;
  columns: SceneColumn[];
  // Highest number of drawn pixels per CSS pixel. Matching the screen's ratio keeps the
  // scene sharp on high-resolution screens, but each step up costs the square in pixels
  // drawn (2 is 4×, 3 is 9×), so it's capped.
  maxPixelRatio: number;
  sphereColor: string;
  wireframe: boolean;
}

// Quality settings can be overridden in the URL to compare them, for example
// ?antialias=off&pixelRatio=1. Read once on load; the server always uses the defaults.
function readQualityOverrides(): Partial<SceneSettings> {
  if (isServer) {
    return {};
  }
  const parameters = new URLSearchParams(globalThis.location.search);
  const overrides: Partial<SceneSettings> = {};

  const antialias = parameters.get('antialias');
  if (antialias !== null) {
    overrides.antialias = !['0', 'false', 'off'].includes(antialias);
  }
  const pixelRatio = Number(parameters.get('pixelRatio'));
  if (pixelRatio > 0) {
    overrides.maxPixelRatio = pixelRatio;
  }
  return overrides;
}

// A mutable store rather than createStore, so the lil-gui debug panel can write to it
// directly the way it expects, while the scene components still react to every change
function createSceneSettings(): SceneSettings {
  return createMutable<SceneSettings>({
    antialias: true,
    columnCount: 5,
    columns: [
      { numUsers: 10 },
      { numUsers: 25 },
      { numUsers: 15 },
      { numUsers: 40 },
      { numUsers: 20 },
    ],
    maxPixelRatio: 2,
    sphereColor: '#ffffff',
    wireframe: false,
    ...readQualityOverrides(),
  });
}

export { createSceneSettings };
export type { SceneColumn, SceneSettings };
