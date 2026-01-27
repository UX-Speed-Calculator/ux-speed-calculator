import ControlsGrid from '../components/ControlsGrid';

export default function Step1() {
  return (
    <main class="mx-auto p-4 text-center">
      <h1 class="max-6-xs text-6xl uppercase">Step 1</h1>
      <section class="mt-5">
        <h2>What Matters to My Business?</h2>
        <p>Conversion Rate origins: performance, presentation quality, SEO, availability, etc.</p>
      </section>

      <ControlsGrid />
    </main>
  );
}
