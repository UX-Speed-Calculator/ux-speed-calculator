import { createEffect, createMemo, Index, onCleanup } from 'solid-js';
import * as THREE from 'three';

import { useSceneObject } from './SceneCanvas.tsx';

import type { SceneColumn } from './sceneSettings.ts';
import type { JSX } from 'solid-js';

type Mood = 'angry' | 'happy' | 'neutral';

interface UserSpheresProps {
  color: string;
  columns: SceneColumn[];
  wireframe: boolean;
}

interface UserSphereProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  x: number;
  y: number;
}

const SPACING = 0.5;

function loadEmojiTexture(loader: THREE.TextureLoader, url: string) {
  const texture = loader.load(url);
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

// Renders nothing to the DOM; only manages its mesh in the scene
function UserSphere(props: UserSphereProps): JSX.Element {
  const mesh = new THREE.Mesh();
  useSceneObject(mesh);

  createEffect(() => {
    mesh.geometry = props.geometry;
    mesh.material = props.material;
  });
  createEffect(() => mesh.position.set(props.x, props.y, 0));

  return undefined;
}

// One emoji sphere per user, stacked in a column per entry in `columns`
function UserSpheres(props: UserSpheresProps) {
  const loader = new THREE.TextureLoader();
  const geometry = new THREE.SphereGeometry(0.25, 16, 16);
  const materials: Record<Mood, THREE.MeshBasicMaterial> = {
    angry: new THREE.MeshBasicMaterial({
      map: loadEmojiTexture(loader, '/angry_emoji_texture.jpg'),
    }),
    happy: new THREE.MeshBasicMaterial({
      map: loadEmojiTexture(loader, '/happy_emoji_texture.jpg'),
    }),
    neutral: new THREE.MeshBasicMaterial({
      map: loadEmojiTexture(loader, '/neutral_emoji_texture.jpg'),
    }),
  };

  createEffect(() => {
    for (const material of Object.values(materials)) {
      material.color.set(props.color);
      material.wireframe = props.wireframe;
    }
  });

  onCleanup(() => {
    geometry.dispose();
    for (const material of Object.values(materials)) {
      material.map?.dispose();
      material.dispose();
    }
  });

  const spheres = createMemo(() => {
    const positions = props.columns.flatMap((column, columnIndex) =>
      Array.from({ length: column.numUsers }, (_, row) => ({
        x: columnIndex * SPACING,
        y: row * SPACING,
      })),
    );
    return positions.map((position, index) => ({
      ...position,
      mood: moodAt(index, positions.length),
    }));
  });

  // <Index> keeps each sphere's mesh and only updates its position and material, instead
  // of rebuilding every mesh whenever a column changes
  return (
    <Index each={spheres()}>
      {(sphere) => (
        <UserSphere
          geometry={geometry}
          material={materials[sphere().mood]}
          x={sphere().x}
          y={sphere().y}
        />
      )}
    </Index>
  );
}

export { UserSpheres };
