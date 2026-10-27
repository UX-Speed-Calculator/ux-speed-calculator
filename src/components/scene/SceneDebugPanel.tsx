import GUI from 'lil-gui';
import { createEffect, on, onCleanup, onMount } from 'solid-js';

import type { SceneSettings } from './sceneSettings.ts';
import type { Controller } from 'lil-gui';
import type { JSX } from 'solid-js';

interface SceneDebugPanelProps {
  settings: SceneSettings;
}

// Don't toggle the panel while someone is typing "g" into a field
function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName))
  );
}

// lil-gui panel for tweaking the scene settings. Hidden by default; press "g" to toggle.
function SceneDebugPanel(props: SceneDebugPanelProps): JSX.Element {
  onMount(() => {
    const gui = new GUI();
    gui.hide();

    const materialsFolder = gui.addFolder('Materials');
    materialsFolder.addColor(props.settings, 'sphereColor').name('Sphere Color');
    materialsFolder.add(props.settings, 'wireframe');

    const columnsFolder = gui.addFolder('Columns');
    columnsFolder.add(props.settings, 'columnCount', 1, 50, 1).name('Number of Columns');

    // Rebuild only the per-column controls when the number of columns changes
    let columnControllers: Controller[] = [];
    createEffect(
      on(
        () => props.settings.columnCount,
        (count) => {
          while (props.settings.columns.length < count) {
            props.settings.columns.push({ numUsers: 10 });
          }
          for (const controller of columnControllers) {
            controller.destroy();
          }
          columnControllers = props.settings.columns
            .slice(0, count)
            .map((column, index) =>
              columnsFolder.add(column, 'numUsers', 1, 100, 1).name(`Column ${index + 1} Users`),
            );
        },
      ),
    );

    let visible = false;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'g' || isTypingTarget(event.target)) {
        return;
      }
      visible = !visible;
      gui.show(visible);
    };
    globalThis.addEventListener('keydown', handleKeyDown);

    onCleanup(() => {
      globalThis.removeEventListener('keydown', handleKeyDown);
      gui.destroy();
    });
  });

  return undefined;
}

export { SceneDebugPanel };
