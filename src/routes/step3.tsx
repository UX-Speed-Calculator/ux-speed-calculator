import { ControlPanel } from '../components/ControlPanel.tsx';
import { InputControl } from '../components/InputControl.tsx';
import { SliderControl } from '../components/SliderControl.tsx';
import { ToggleControl } from '../components/ToggleControl.tsx';

export default function Step3() {
  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 3</h1>
          <section class="mt-5">
            <h2>How Fast is My Site?</h2>
            <p>3.4 Seconds, the time it takes to do 1 important thing.</p>
          </section>
        </section>
        <div class="future-canvas col-span-3" />
      </section>

      <section class="controls-grid grid grid-cols-3 gap-3 pt-5">
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 1"
        >
          <SliderControl defaultValue={50} label="Sample slider" max={100} min={0} unit="%" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 2"
        >
          <InputControl defaultValue={10} label="Sample number" min={0} />
          <InputControl label="Sample text" placeholder="Enter text" type="text" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 3"
        >
          <ToggleControl defaultChecked label="Sample toggle A" />
          <ToggleControl label="Sample toggle B" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 4"
        >
          <SliderControl defaultValue={50} label="Sample slider" max={100} min={0} unit="%" />
        </ControlPanel>
        <ControlPanel
          description="Placeholder controls. Replace with this step's real inputs."
          title="Controls 5"
        >
          <InputControl defaultValue={10} label="Sample number" min={0} />
          <InputControl label="Sample text" placeholder="Enter text" type="text" />
        </ControlPanel>
      </section>
    </main>
  );
}
