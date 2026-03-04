import ControlsGrid from '../components/ControlsGrid';

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
        <div class="future-canvas col-span-3"></div>
      </section>

      <section class="controls-grid grid grid-cols-3 gap-3 pt-5">
        <div class="bg-stone-800">
          <p>Controls 1</p>
        </div>
      </section>
    </main>
  );
}
