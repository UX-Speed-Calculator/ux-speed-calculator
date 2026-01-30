import ControlsGrid from '../components/ControlsGrid';

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
        <div class="future-canvas col-span-3">
          <img src="3d_diagram_placeholder.png" class="diagram" />
        </div>
      </section>

      <section class="controls-grid grid grid-cols-3 gap-3 pt-5">
        <div class="bg-stone-800">
          <p>Controls 1</p>
        </div>
        <div class="bg-stone-800">
          <p>Controls 2</p>
        </div>
        <div class="bg-stone-800">
          <p>Controls 3</p>
        </div>
      </section>
    </main>
  );
}
