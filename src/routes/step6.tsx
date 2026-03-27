import { params, updateParam, distribution } from '../lib/store';
import { createMemo, For } from 'solid-js';

export default function Level6() {
  const formatPercent = (value: number) =>
    (value * 100).toFixed(2) + '%';

  const d = () => distribution();

  const chartData = createMemo(() => {
    const dist = d();
    const maxPop = Math.max(...dist.totalPopulation);
    const displayMax = 10;
    const points = dist.x.length;
    
    return dist.totalPopulation.slice(0, points).map((pop, i) => {
      const converted = dist.convertedDistribution[i];
      const bounced = dist.bouncedDistribution[i];
      const errored = dist.erroredDistribution[i];
      const nonConverted = pop - converted - bounced - errored;

      return {
        x: dist.x[i] * 100, // 0-1000 for 10s
        yTotal: (pop / maxPop) * 350,
        yConverted: (converted / maxPop) * 350,
        yBounced: (bounced / maxPop) * 350,
        yErrored: (errored / maxPop) * 350,
        yNonConverted: (nonConverted / maxPop) * 350,
      };
    }).filter(p => p.x <= 1000);
  });

  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 6</h1>
          <section class="mt-5">
            <h2>Speed Distribution</h2>
            <p>Visualizing your audience by performance segments.</p>
            <div class="mt-5 space-y-2 text-xs">
              <div class="flex items-center gap-2"><div class="w-3 h-3 bg-emerald-500"></div> Converted</div>
              <div class="flex items-center gap-2"><div class="w-3 h-3 bg-blue-500"></div> Non-Converted</div>
              <div class="flex items-center gap-2"><div class="w-3 h-3 bg-stone-500"></div> Bounced</div>
              <div class="flex items-center gap-2"><div class="w-3 h-3 bg-rose-500"></div> Failed (Error)</div>
            </div>
          </section>
        </section>
        <div class="future-canvas col-span-3 h-[400px] bg-stone-900/50 p-10 relative">
          <svg viewBox="0 0 1000 400" class="w-full h-full overflow-visible">
            {/* Stacked Chart using Paths */}
            <For each={chartData()}>
              {(p, i) => {
                const next = chartData()[i() + 1];
                if (!next) return null;
                return (
                  <g>
                    {/* Failed */}
                    <path
                      d={`M ${p.x},400 L ${p.x},${400 - p.yErrored} L ${next.x},${400 - next.yErrored} L ${next.x},400 Z`}
                      fill="#f43f5e"
                    />
                    {/* Bounced */}
                    <path
                      d={`M ${p.x},${400 - p.yErrored} L ${p.x},${400 - p.yErrored - p.yBounced} L ${next.x},${400 - next.yErrored - next.yBounced} L ${next.x},${400 - next.yErrored} Z`}
                      fill="#78716c"
                    />
                    {/* Non-Converted */}
                    <path
                      d={`M ${p.x},${400 - p.yErrored - p.yBounced} L ${p.x},${400 - p.yErrored - p.yBounced - p.yNonConverted} L ${next.x},${400 - next.yErrored - next.yBounced - next.yNonConverted} L ${next.x},${400 - next.yErrored - next.yBounced} Z`}
                      fill="#3b82f6"
                    />
                    {/* Converted */}
                    <path
                      d={`M ${p.x},${400 - p.yErrored - p.yBounced - p.yNonConverted} L ${p.x},${400 - p.yTotal} L ${next.x},${400 - next.yTotal} L ${next.x},${400 - next.yErrored - next.yBounced - next.yNonConverted} Z`}
                      fill="#10b981"
                    />
                  </g>
                );
              }}
            </For>

            {/* X-axis */}
            <line x1="0" y1="400" x2="1000" y2="400" stroke="white" stroke-width="2" />
            {[0, 2, 4, 6, 8, 10].map(t => (
              <text x={t * 100} y="420" text-anchor="middle" fill="white" class="text-[10px]">{t}s</text>
            ))}
          </svg>
        </div>
      </section>

      <section class="controls-grid grid grid-cols-3 gap-3 pt-5">
        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Website Speed</h3>
          <div class="mb-4">
            <label class="block text-sm mb-1">Base Speed (μ)</label>
            <input
              type="range"
              min="-1"
              max="3"
              step="0.01"
              value={params.mu}
              onInput={(e) => updateParam('mu', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Error Rate</h3>
          <div class="mb-4">
            <label class="block text-sm mb-1">Max Error Rate (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={params.maxErrorRate}
              onInput={(e) => updateParam('maxErrorRate', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Bounce Rate</h3>
          <div class="mb-4">
            <label class="block text-sm mb-1">Min Bounce (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={params.bounceRateShift}
              onInput={(e) => updateParam('bounceRateShift', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
