import { params, updateParam, distribution } from '../lib/store';
import { createMemo, For } from 'solid-js';

export default function Level4() {
  const formatPercent = (value: number) =>
    (value * 100).toFixed(2) + '%';

  const formatTime = (value: number) =>
    value.toFixed(2) + 's';

  const dist = () => distribution();

  const percentiles = [
    { label: 'P50 (Median)', key: 'p50', color: '#60a5fa' },
    { label: 'P75 (LCP)', key: 'p75', color: '#34d399' },
    { label: 'P90', key: 'p90', color: '#fbbf24' },
    { label: 'P95', key: 'p95', color: '#f87171' },
  ];

  const getCRAtTime = (time: number) => {
    const cr = (params.maxConversionRate - params.conversionPovertyLine) *
        Math.exp(-time * params.conversionDecay) +
      params.conversionPovertyLine;
    return cr / 100;
  };

  const chartData = createMemo(() => {
    const d = dist();
    const maxPop = Math.max(...d.totalPopulation);
    const displayMax = 10;
    
    return d.totalPopulation.map((pop, i) => ({
      x: d.x[i],
      y: pop / maxPop,
    })).filter(p => p.x <= displayMax);
  });

  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 4</h1>
          <section class="mt-5">
            <h2>Percentiles</h2>
            <p>Understanding the tail of your performance distribution.</p>
            <div class="mt-5 space-y-2">
              <For each={percentiles}>
                {(p) => (
                  <div class="p-2 bg-stone-800 rounded flex justify-between items-center border-l-4" style={{ 'border-color': p.color }}>
                    <span class="text-sm">{p.label}</span>
                    <span class="font-bold">{formatTime(dist()[p.key as 'p50' | 'p75' | 'p90' | 'p95'])}</span>
                  </div>
                )}
              </For>
            </div>
          </section>
        </section>
        <div class="future-canvas col-span-3 h-[400px] bg-stone-900/50 p-10 relative">
          <svg viewBox="0 0 1000 400" class="w-full h-full overflow-visible">
            {/* Distribution Curve */}
            <path
              d={`M ${chartData().map(p => `${p.x * 100},${400 - p.y * 300}`).join(' L ')}`}
              fill="none"
              stroke="white"
              stroke-width="2"
              opacity="0.5"
            />

            {/* Percentile Lines */}
            <For each={percentiles}>
              {(p) => {
                const time = dist()[p.key as 'p50' | 'p75' | 'p90' | 'p95'];
                const x = time * 100;
                return (
                  <g>
                    <line x1={x} y1="0" x2={x} y2="400" stroke={p.color} stroke-width="2" />
                    <circle cx={x} cy={400 - getCRAtTime(time) * 400} r="5" fill={p.color} />
                    <text x={x + 5} y={400 - getCRAtTime(time) * 400 - 10} fill={p.color} class="text-[10px] font-bold">
                      {formatPercent(getCRAtTime(time))}
                    </text>
                  </g>
                );
              }}
            </For>

            {/* X-axis */}
            <line x1="0" y1="400" x2="1000" y2="400" stroke="white" stroke-width="2" />
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
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Variability</h3>
          <div class="mb-4">
            <label class="block text-sm mb-1">Variability (σ)</label>
            <input
              type="range"
              min="0.05"
              max="2"
              step="0.01"
              value={params.sigma}
              onInput={(e) => updateParam('sigma', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Conversion Decay</h3>
          <div class="mb-4">
            <label class="block text-sm mb-1">Decay Rate</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.01"
              value={params.conversionDecay}
              onInput={(e) => updateParam('conversionDecay', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
