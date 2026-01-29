import ControlsGrid from '../components/ControlsGrid';

export default function Step7() {
  return (
    <main class="mx-auto p-4 text-center">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 7</h1>
          <section class="mt-5">
            <h2>Compare Distributions</h2>
            <p>...</p>
          </section>
        </section>
        <div class="future-canvas col-span-3">
          <img src="3d_diagram_placeholder.png" class="w-full" />
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
        <div class="bg-stone-800">
          <p>Controls 4</p>
        </div>
        <div class="bg-stone-800">
          <p>Controls 5</p>
        </div>
        <div class="bg-stone-800">
          <p>Controls 6</p>
        </div>
        <div class="bg-stone-800">
          <p>Controls 7</p>
        </div>
      </section>
    </main>
  );
}
