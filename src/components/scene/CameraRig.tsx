import { useLocation } from '@solidjs/router';
import { createEffect, createMemo, on, onCleanup } from 'solid-js';
import * as THREE from 'three';

import { levelIndex, LEVELS } from '../../levels.ts';
import { useScene } from './SceneCanvas.tsx';

import type { JSX } from 'solid-js';

const MOVE_DURATION_MS = 1_000;

// Starts and stops gently instead of moving at a constant speed
function easeInOutCubic(progress: number) {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

// Points the camera at the current level's view (see LEVELS). It jumps there on first load
// and moves smoothly on later level changes. Pages that aren't levels leave it where it is.
function CameraRig(): JSX.Element {
  const { camera, requestRender } = useScene();
  const location = useLocation();

  // Undefined on pages that aren't levels, where levelIndex is -1
  const view = createMemo(() => LEVELS[levelIndex(location.pathname)]?.camera);

  // The point the camera is looking at, kept so a move can start from it
  const target = new THREE.Vector3();
  let frame: number | undefined;
  let placed = false;

  const stopMoving = () => {
    if (frame !== undefined) {
      cancelAnimationFrame(frame);
      frame = undefined;
    }
  };

  createEffect(
    on(view, (next) => {
      if (!next) {
        return;
      }
      // A level change during a move starts the new move from wherever the camera is now
      stopMoving();

      const startPosition = camera.position.clone();
      const startTarget = target.clone();
      const endPosition = new THREE.Vector3(...next.position);
      const endTarget = new THREE.Vector3(...next.target);
      const reduceMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = placed && !reduceMotion ? MOVE_DURATION_MS : 0;
      const startTime = performance.now();
      placed = true;

      // Renders a frame for every step of the move, then stops so the scene goes idle
      const step = (now: number) => {
        const progress = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
        const eased = easeInOutCubic(progress);
        camera.position.lerpVectors(startPosition, endPosition, eased);
        target.lerpVectors(startTarget, endTarget, eased);
        camera.lookAt(target);
        requestRender();
        frame = progress < 1 ? requestAnimationFrame(step) : undefined;
      };
      step(startTime);
    }),
  );

  onCleanup(stopMoving);

  return undefined;
}

export { CameraRig };
