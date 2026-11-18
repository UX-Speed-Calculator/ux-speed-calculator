import { createEffect, createMemo, For, onCleanup } from 'solid-js';
import * as THREE from 'three';

import { useScene } from './SceneCanvas.tsx';

import type { SceneColumn } from './sceneSettings.ts';
import type { JSX } from 'solid-js';

type Mood = 'angry' | 'happy' | 'neutral';

interface SpherePosition {
  x: number;
  y: number;
}

interface UserSphereChartProps {
  color: string;
  columns: SceneColumn[];
  wireframe: boolean;
}

interface MoodSpheresProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  positions: SpherePosition[];
}

const MOODS: Mood[] = ['angry', 'neutral', 'happy'];
const SPACING = 0.5;

// Textures load in the background, so onLoad redraws the scene once each one arrives
function loadEmojiTexture(loader: THREE.TextureLoader, url: string, onLoad: () => void) {
  const texture = loader.load(url, onLoad);
  texture.colorSpace = THREE.SRGBColorSpace;
  // Rotate the face around the sphere so it looks out of the chart
  texture.center.set(0.5, 0.5);
  texture.offset.x = 0.25;
  return texture;
}

// Users are split into thirds in order: the first third angry, then neutral, then happy
function moodAt(index: number, total: number): Mood {
  if (index < total / 3) {
    return 'angry';
  }
  if (index < (total * 2) / 3) {
    return 'neutral';
  }
  return 'happy';
}

// Smallest power of two that fits `count`, so capacity grows in a few big steps
function capacityFor(count: number) {
  return 2 ** Math.ceil(Math.log2(Math.max(count, 1)));
}

// Draws every sphere of one mood with a single instanced mesh: one draw call however many
// spheres there are. Renders nothing to the DOM; only manages its mesh in the scene.
function MoodSpheres(props: MoodSpheresProps): JSX.Element {
  const { requestRender, scene } = useScene();

  // An instanced mesh's capacity is fixed when it's created, so it only grows, and the
  // mesh is replaced when the spheres no longer fit
  const capacity = createMemo(
    (previous: number) => Math.max(previous, capacityFor(props.positions.length)),
    0,
  );

  const mesh = createMemo(() => {
    const instanced = new THREE.InstancedMesh(props.geometry, props.material, capacity());
    scene.add(instanced);
    onCleanup(() => {
      scene.remove(instanced);
      // Frees the instance data only; the shared geometry and material are left alone
      instanced.dispose();
      requestRender();
    });
    return instanced;
  });

  const matrix = new THREE.Matrix4();
  createEffect(() => {
    const instanced = mesh();
    for (const [index, position] of props.positions.entries()) {
      instanced.setMatrixAt(index, matrix.makeTranslation(position.x, position.y, 0));
    }
    instanced.count = props.positions.length;
    instanced.instanceMatrix.needsUpdate = true;
    // three.js uses this to skip meshes that are off screen, so keep it covering all spheres
    instanced.computeBoundingSphere();
    requestRender();
  });

  return undefined;
}

// The whole chart: one column of spheres per entry in `columns`, one emoji sphere per user
function UserSphereChart(props: UserSphereChartProps) {
  const { requestRender } = useScene();
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.SphereGeometry(0.25, 16, 16);
  const materials: Record<Mood, THREE.MeshBasicMaterial> = {
    angry: new THREE.MeshBasicMaterial({
      map: loadEmojiTexture(loader, '/angry_emoji_texture.jpg', requestRender),
    }),
    happy: new THREE.MeshBasicMaterial({
      map: loadEmojiTexture(loader, '/happy_emoji_texture.jpg', requestRender),
    }),
    neutral: new THREE.MeshBasicMaterial({
      map: loadEmojiTexture(loader, '/neutral_emoji_texture.jpg', requestRender),
    }),
  };

  createEffect(() => {
    for (const material of Object.values(materials)) {
      material.color.set(props.color);
      material.wireframe = props.wireframe;
    }
    requestRender();
  });

  onCleanup(() => {
    geometry.dispose();
    for (const material of Object.values(materials)) {
      material.map?.dispose();
      material.dispose();
    }
  });

  // Every sphere's position, grouped by mood
  const positionsByMood = createMemo(() => {
    const positions = props.columns.flatMap((column, columnIndex) =>
      Array.from({ length: column.numUsers }, (_, row) => ({
        x: columnIndex * SPACING,
        y: row * SPACING,
      })),
    );
    const groups: Record<Mood, SpherePosition[]> = { angry: [], happy: [], neutral: [] };
    for (const [index, position] of positions.entries()) {
      groups[moodAt(index, positions.length)].push(position);
    }
    return groups;
  });

  return (
    <For each={MOODS}>
      {(mood) => (
        <MoodSpheres
          geometry={geometry}
          material={materials[mood]}
          positions={positionsByMood()[mood]}
        />
      )}
    </For>
  );
}

export { UserSphereChart };
