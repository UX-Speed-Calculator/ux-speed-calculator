import { createContext, createSignal, onCleanup, onMount, Show, useContext } from 'solid-js';
import * as THREE from 'three';

import type { ParentProps } from 'solid-js';

interface SceneContextValue {
  camera: THREE.PerspectiveCamera;
  // Draws one frame on the next animation frame. The scene isn't redrawn on its own, so
  // call this after changing anything visible.
  requestRender: () => void;
  scene: THREE.Scene;
}

const SceneContext = createContext<SceneContextValue>();

// Owns the renderer, scene and camera, and provides them to the scene components passed
// as children. Children only render in the browser, after the canvas exists, because
// WebGL and texture loading need the DOM.
function SceneCanvas(props: ParentProps) {
  let canvas!: HTMLCanvasElement;
  const [context, setContext] = createSignal<SceneContextValue>();

  onMount(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75);
    camera.position.set(0, 2, 3);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ canvas });

    // Render only when something changes, instead of every frame. Requests made before the
    // next frame are combined into one render.
    let pendingFrame: number | undefined;
    const requestRender = () => {
      pendingFrame ??= requestAnimationFrame(() => {
        pendingFrame = undefined;
        renderer.render(scene, camera);
      });
    };

    // CSS sets the canvas's size on the page; match the drawing resolution and camera to it.
    // `false` stops three.js from overwriting the CSS size with inline styles.
    const resizeObserver = new ResizeObserver(() => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Resizing clears the canvas, so redraw straight away rather than on the next frame
      renderer.render(scene, camera);
    });
    resizeObserver.observe(canvas);

    onCleanup(() => {
      if (pendingFrame !== undefined) {
        cancelAnimationFrame(pendingFrame);
      }
      resizeObserver.disconnect();
      renderer.dispose();
    });

    setContext({ camera, requestRender, scene });
  });

  return (
    <>
      <canvas ref={canvas} />
      <Show when={context()}>
        {(value) => <SceneContext.Provider value={value()}>{props.children}</SceneContext.Provider>}
      </Show>
    </>
  );
}

function useScene() {
  const value = useContext(SceneContext);
  if (!value) {
    throw new Error('useScene must be used inside <SceneCanvas>');
  }
  return value;
}

// Adds an object to the scene for as long as the calling component is mounted
function useSceneObject(object: THREE.Object3D) {
  const { requestRender, scene } = useScene();
  scene.add(object);
  requestRender();
  onCleanup(() => {
    scene.remove(object);
    requestRender();
  });
}

export { SceneCanvas, useScene, useSceneObject };
