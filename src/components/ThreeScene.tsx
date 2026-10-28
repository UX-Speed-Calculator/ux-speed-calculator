import { SceneCanvas } from './scene/SceneCanvas.tsx';
import { SceneDebugPanel } from './scene/SceneDebugPanel.tsx';
import { SceneHelpers } from './scene/SceneHelpers.tsx';
import { createSceneSettings } from './scene/sceneSettings.ts';
import { UserSphereChart } from './scene/UserSphereChart.tsx';

// The persistent 3D chart shown on every level. Each child adds its own objects to the
// scene and reacts to `settings`, so changing a setting updates the scene automatically.
export function ThreeScene() {
  const settings = createSceneSettings();

  return (
    <SceneCanvas>
      <UserSphereChart
        color={settings.sphereColor}
        columns={settings.columns.slice(0, settings.columnCount)}
        wireframe={settings.wireframe}
      />
      <SceneHelpers />
      <SceneDebugPanel settings={settings} />
    </SceneCanvas>
  );
}
