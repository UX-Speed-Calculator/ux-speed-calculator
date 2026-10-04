import { ControlPanel } from '../components/ControlPanel.tsx';
import { InputControl } from '../components/InputControl.tsx';
import { SliderControl } from '../components/SliderControl.tsx';

export default function Step1() {
  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 1</h1>
          <section class="mt-5">
            <h2>What Matters to My Business?</h2>
            <p>
              Conversion Rate origins: performance, presentation quality, SEO, availability, etc.
            </p>
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
      </section>
    </main>
  );
}
