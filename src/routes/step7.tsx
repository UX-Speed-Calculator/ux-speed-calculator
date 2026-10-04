import { BounceRatePanel } from '../components/BounceRatePanel.tsx';
import { ControlPanel } from '../components/ControlPanel.tsx';
import { InputControl } from '../components/InputControl.tsx';
import { SliderControl } from '../components/SliderControl.tsx';
import { ToggleControl } from '../components/ToggleControl.tsx';

export default function Step7() {
  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 7</h1>
          <section class="mt-5">
            <h2>Compare Distributions</h2>
            <p>...</p>
          </section>
        </section>
        <div class="future-canvas col-span-3" />
      </section>

      <section class="controls-grid grid grid-cols-3 gap-3 pt-5">
        <BounceRatePanel />
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 2"
        >
          <SliderControl defaultValue={50} label="Sample slider" max={100} min={0} unit="%" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 3"
        >
          <InputControl defaultValue={10} label="Sample number" min={0} />
          <InputControl label="Sample text" placeholder="Enter text" type="text" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 4"
        >
          <ToggleControl defaultChecked label="Sample toggle A" />
          <ToggleControl label="Sample toggle B" />
        </ControlPanel>
        <BounceRatePanel />
        <BounceRatePanel />
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 7"
        >
          <SliderControl defaultValue={50} label="Sample slider" max={100} min={0} unit="%" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 8"
        >
          <InputControl defaultValue={10} label="Sample number" min={0} />
          <InputControl label="Sample text" placeholder="Enter text" type="text" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 9"
        >
          <ToggleControl defaultChecked label="Sample toggle A" />
          <ToggleControl label="Sample toggle B" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 10"
        >
          <SliderControl defaultValue={50} label="Sample slider" max={100} min={0} unit="%" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 11"
        >
          <InputControl defaultValue={10} label="Sample number" min={0} />
          <InputControl label="Sample text" placeholder="Enter text" type="text" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 12"
        >
          <ToggleControl defaultChecked label="Sample toggle A" />
          <ToggleControl label="Sample toggle B" />
        </ControlPanel>
      </section>
    </main>
  );
}
