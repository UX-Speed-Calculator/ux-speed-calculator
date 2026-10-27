import { onCleanup } from 'solid-js';
import * as THREE from 'three';

import { useSceneObject } from './SceneCanvas.tsx';

import type { JSX } from 'solid-js';

// Axes and floor grid, for orientation while the scene is being built
function SceneHelpers(): JSX.Element {
  const axes = new THREE.AxesHelper(5);
  const grid = new THREE.GridHelper(10, 10);
  useSceneObject(axes);
  useSceneObject(grid);

  onCleanup(() => {
    axes.dispose();
    grid.dispose();
  });

  return undefined;
}

export { SceneHelpers };
