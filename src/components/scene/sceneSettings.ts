import { createMutable } from 'solid-js/store';

interface SceneColumn {
  numUsers: number;
}

interface SceneSettings {
  columnCount: number;
  columns: SceneColumn[];
  sphereColor: string;
  wireframe: boolean;
}

// A mutable store rather than createStore, so the lil-gui debug panel can write to it
// directly the way it expects, while the scene components still react to every change
function createSceneSettings(): SceneSettings {
  return createMutable<SceneSettings>({
    columnCount: 5,
    columns: [
      { numUsers: 10 },
      { numUsers: 25 },
      { numUsers: 15 },
      { numUsers: 40 },
      { numUsers: 20 },
    ],
    sphereColor: '#ffffff',
    wireframe: false,
  });
}

export { createSceneSettings };
export type { SceneColumn, SceneSettings };
