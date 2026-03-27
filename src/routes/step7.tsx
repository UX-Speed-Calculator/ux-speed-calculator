import { params, updateParam, distribution } from '../lib/store';
import { calculateDistribution } from '../lib/distribution';
import { createMemo, createSignal, For } from 'solid-js';

export default function Level7() {
  const [targetMu, setTargetMu] = createSignal(1.0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const baselineDist = () => distribution();
  const targetDist = createMemo(() => calculateDistribution({ ...params, mu: targetMu() }));

  const chartData = createMemo(() => {
    const b = baselineDist();
    const t = targetDist();
    const maxPop = Math.max(...b.totalPopulation, ...t.totalPopulation);
    
    return b.x.map((x, i) => ({
      x: x * 100,
      baselineY: (b.totalPopulation[i] / maxPop) * 350,
      targetY: (t.totalPopulation[i] / maxPop) * 350,
    })).filter(p => p.x <= 1000);
  });

  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 7</h1>
          <section class="mt-5">
            <h2>Compare Distributions</h2>
            <p>Calculate the business value of your performance improvements.</p>
            <div class="mt-5 space-y-4">
              <div class="p-4 bg-stone-800 rounded border-l-4 border-stone-500">
                <div class="text-xs uppercase text-stone-400">Baseline Value</div>
                <div class="text-2xl font-bold">{formatCurrency(baselineDist().totalConverted * params.averageValue)}</div>
              </div>
              <div class="p-4 bg-stone-800 rounded border-l-4 border-emerald-500">
                <div class="text-xs uppercase text-stone-400">Target Value</div>
                <div class="text-2xl font-bold text-emerald-400">{formatCurrency(targetDist().totalConverted * params.averageValue)}</div>
              </div>
              <div class="p-4 bg-emerald-900/50 rounded border-2 border-emerald-500">
                <div class="text-xs uppercase text-emerald-400 font-bold">Improvement</div>
                <div class="text-3xl font-bold text-emerald-400">
                  +{formatCurrency((targetDist().totalConverted - baselineDist().totalConverted) * params.averageValue)}
                </div>
              </div>
            </div>
          </section>
        </section>
        <div class="future-canvas col-span-3 h-[400px] bg-stone-900/50 p-10 relative">
          <svg viewBox="0 0 1000 400" class="w-full h-full overflow-visible">
            {/* Baseline Curve */}
            <path
              d={`M ${chartData().map(p => `${p.x},${400 - p.baselineY}`).join(' L ')}`}
              fill="none"
              stroke="#78716c"
              stroke-width="2"
              stroke-dasharray="5,5"
            />
            {/* Target Curve */}
            <path
              d={`M ${chartData().map(p => `${p.x},${400 - p.targetY}`).join(' L ')}`}
              fill="#10b981"
              fill-opacity="0.2"
              stroke="#10b981"
              stroke-width="3"
            />

            {/* X-axis */}
            <line x1="0" y1="400" x2="1000" y2="400" stroke="white" stroke-width="2" />
          </svg>
        </div>
      </section>

      <section class="controls-grid grid grid-cols-3 gap-3 pt-5">
        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Baseline Speed (μ)</h3>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.01"
            value={params.mu}
            onInput={(e) => updateParam('mu', parseFloat(e.currentTarget.value))}
            class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-500"
          />
          <div class="text-center mt-2">{params.mu.toFixed(2)}</div>
        </div>
        <div class="bg-stone-800 p-4 rounded shadow border-2 border-emerald-500">
          <h3 class="text-lg font-bold mb-3 uppercase text-emerald-400">Target Speed (μ)</h3>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.01"
            value={targetMu()}
            onInput={(e) => setTargetMu(parseFloat(e.currentTarget.value))}
            class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div class="text-center mt-2 text-emerald-400 font-bold">{targetMu().toFixed(2)}</div>
        </div>
      </section>
    </main>
  );
}
