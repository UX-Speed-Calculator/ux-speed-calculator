import ControlsGrid from '../components/ControlsGrid';

export default function Step6() {
  return (
    <main class="mx-auto p-4 text-center">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Step 1</h1>
          <section class="mt-5">
            <h2>What Matters to My Business?</h2>
            <p>
              Conversion Rate origins: performance, presentation quality, SEO, availability, etc.
            </p>
          </section>
        </section>
        <div class="future-canvas col-span-3">
          <img src="3d_diagram_placeholder.png" class="w-full" />
        </div>
      </section>
      <ControlsGrid />
    </main>
  );
}
