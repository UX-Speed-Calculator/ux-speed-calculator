import ControlsGrid from '../components/ControlsGrid';

export default function Step2() {
  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 2</h1>
          <section class="mt-5">
            <h2>Is My Site Fast or Slow?</h2>
            <p>Compare conversion rates.</p>
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
          <fieldset>
            <legend>Bounce Rate</legend>
            <div class="field">
              <label title="Minimum bounce rate at theoretical 0">
                Min bounce rate: <input type="number" min="0" max="100" step="0.5" value="20" />%
              </label>
              <input type="range" min="0" max="100" step="0.5" value="20" />
            </div>
            <div class="field">
              <label title="How fast does bounce rate affect the users">
                Bounce time compression: <input type="number" min="0" step="0.05" value="4" />
              </label>
              <input type="range" min="0" step="0.05" value="4" />
            </div>
            <div class="field">
              <label title="How high is the bounce rate on the site">
                Bounce rate scale: <input type="number" min="0" max="100" step="0.5" value="50" />%
              </label>
              <input type="range" min="0" max="100" step="0.5" value="50" />
            </div>
          </fieldset>
        </div>
      </section>
    </main>
  );
}
