import { params, updateParam, distribution } from '../lib/store';
import { createMemo } from 'solid-js';

export default function Level3() {
  const formatPercent = (value: number) =>
    (value * 100).toFixed(2) + '%';

  const formatTime = (value: number) =>
    value.toFixed(2) + 's';

  const p75 = () => distribution().p75;

  const thresholds = [
    { label: 'Good', value: 2.5, color: '#10b981' },
    { label: 'Needs Improvement', value: 4, color: '#f59e0b' },
    { label: 'Poor', value: 10, color: '#f43f5e' },
  ];

  const chartData = createMemo(() => {
    const dist = distribution();
    const maxPop = Math.max(...dist.totalPopulation);
    const displayMax = 10; // Show up to 10s
    const points = dist.x.length;
    
    return dist.totalPopulation.slice(0, points).map((pop, i) => ({
      x: dist.x[i],
      y: pop / maxPop,
      pop,
    })).filter(p => p.x <= displayMax);
  });

  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 3</h1>
          <section class="mt-5">
            <h2>Website Speed Metric</h2>
            <p>How fast is your website? Use LCP P75 as a key metric.</p>
            <div class="mt-10 p-4 bg-stone-800 rounded-xl">
              <div class="text-sm text-stone-400 uppercase font-bold">LCP P75</div>
              <div class="text-5xl font-bold" classList={{
                'text-emerald-400': p75() <= 2.5,
                'text-amber-400': p75() > 2.5 && p75() <= 4,
                'text-rose-400': p75() > 4,
              }}>
                {formatTime(p75())}
              </div>
              <div class="text-sm mt-2">
                Conversion: <span class="font-bold">{formatPercent(distribution().averageConversionRate)}</span>
              </div>
            </div>
          </section>
        </section>
        <div class="future-canvas col-span-3 h-[400px] bg-stone-900/50 p-10 relative">
          <svg viewBox="0 0 1000 400" class="w-full h-full overflow-visible">
            {/* Threshold backgrounds */}
            <rect x="0" y="0" width="250" height="400" fill="#10b981" fill-opacity="0.1" />
            <rect x="250" y="0" width="150" height="400" fill="#f59e0b" fill-opacity="0.1" />
            <rect x="400" y="0" width="600" height="400" fill="#f43f5e" fill-opacity="0.1" />
            
            {/* Threshold labels */}
            <text x="125" y="30" text-anchor="middle" fill="#10b981" class="text-xs font-bold uppercase">Good</text>
            <text x="325" y="30" text-anchor="middle" fill="#f59e0b" class="text-xs font-bold uppercase">Needs Imp.</text>
            <text x="700" y="30" text-anchor="middle" fill="#f43f5e" class="text-xs font-bold uppercase">Poor</text>

            {/* Distribution Curve */}
            <path
              d={`M ${chartData().map(p => `${p.x * 100},${400 - p.y * 300}`).join(' L ')}`}
              fill="none"
              stroke="white"
              stroke-width="3"
            />

            {/* P75 Line */}
            <line
              x1={p75() * 100}
              y1="0"
              x2={p75() * 100}
              y2="400"
              stroke="white"
              stroke-dasharray="5,5"
              stroke-width="2"
            />
            <text x={p75() * 100 + 5} y="100" fill="white" class="text-xs">P75: {formatTime(p75())}</text>

            {/* X-axis */}
            <line x1="0" y1="400" x2="1000" y2="400" stroke="white" stroke-width="2" />
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(t => (
              <>
                <line x1={t * 100} y1="400" x2={t * 100} y2="410" stroke="white" stroke-width="1" />
                <text x={t * 100} y="430" text-anchor="middle" fill="white" class="text-[10px]">{t}s</text>
              </>
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
            <input
              type="number"
              value={params.mu}
              onInput={(e) => updateParam('mu', parseFloat(e.currentTarget.value))}
              class="mt-2 w-full bg-stone-900 border border-stone-700 rounded p-1 text-right"
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
            <input
              type="number"
              value={params.sigma}
              onInput={(e) => updateParam('sigma', parseFloat(e.currentTarget.value))}
              class="mt-2 w-full bg-stone-900 border border-stone-700 rounded p-1 text-right"
            />
          </div>
        </div>

        <div class="bg-stone-800 p-4 rounded shadow opacity-50">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Conversion Max</h3>
          <div class="mb-4">
            <label class="block text-sm mb-1">Max Conversion Rate (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={params.maxConversionRate}
              onInput={(e) => updateParam('maxConversionRate', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <input
              type="number"
              value={params.maxConversionRate}
              onInput={(e) => updateParam('maxConversionRate', parseFloat(e.currentTarget.value))}
              class="mt-2 w-full bg-stone-900 border border-stone-700 rounded p-1 text-right"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
