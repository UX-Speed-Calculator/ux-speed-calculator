import { params, updateParam, distribution } from '../lib/store';
import { calculateDistribution, DistributionParams } from '../lib/distribution';
import { createMemo, For } from 'solid-js';

export default function Level5() {
  const formatTime = (value: number) =>
    value.toFixed(2) + 's';

  const muRange = () => {
    const range = [];
    for (let mu = 0.5; mu <= 2.5; mu += 0.1) {
      const p = { ...params, mu };
      const dist = calculateDistribution(p);
      range.push({ mu, p75: dist.p75 });
    }
    return range;
  };

  const chartData = createMemo(() => {
    const data = muRange();
    const maxP75 = Math.max(...data.map(d => d.p75));
    const minMu = 0.5;
    const maxMu = 2.5;
    
    return data.map(d => ({
      x: (d.mu - minMu) / (maxMu - minMu),
      y: d.p75 / maxP75,
      mu: d.mu,
      p75: d.p75
    }));
  });

  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 5</h1>
          <section class="mt-5">
            <h2>Performance Roadmap</h2>
            <p>How improving Base Speed (μ) affects your LCP P75.</p>
            <div class="mt-5 p-4 bg-stone-800 rounded-xl">
              <div class="text-xs text-stone-400 uppercase font-bold">Current μ</div>
              <div class="text-3xl font-bold">{params.mu.toFixed(2)}</div>
              <div class="text-xs text-stone-400 uppercase font-bold mt-2">Current P75</div>
              <div class="text-3xl font-bold text-emerald-400">{formatTime(distribution().p75)}</div>
            </div>
          </section>
        </section>
        <div class="future-canvas col-span-3 h-[400px] bg-stone-900/50 p-10 relative">
          <svg viewBox="0 0 1000 400" class="w-full h-full overflow-visible">
            {/* Guide Text */}
            <text x="0" y="-10" fill="#stone-500" class="text-xs italic">← Faster (Lower μ)</text>
            <text x="1000" y="-10" text-anchor="end" fill="#stone-500" class="text-xs italic">Slower (Higher μ) →</text>
            
            {/* Data Line */}
            <path
              d={`M ${chartData().map(d => `${d.x * 1000},${400 - d.y * 350}`).join(' L ')}`}
              fill="none"
              stroke="#10b981"
              stroke-width="3"
            />

            {/* Current Point */}
            <circle
              cx={((params.mu - 0.5) / 2) * 1000}
              cy={400 - (distribution().p75 / Math.max(...muRange().map(d => d.p75))) * 350}
              r="8"
              fill="white"
              stroke="#10b981"
              stroke-width="2"
            />

            {/* X-axis (μ) */}
            <line x1="0" y1="400" x2="1000" y2="400" stroke="white" stroke-width="2" />
            <text x="500" y="440" text-anchor="middle" fill="white" class="text-sm font-bold">Base Speed (μ)</text>
            
            {/* Y-axis (P75) */}
            <line x1="0" y1="0" x2="0" y2="400" stroke="white" stroke-width="2" />
            <text x="-40" y="200" text-anchor="middle" fill="white" class="text-sm font-bold" style={{ transform: 'rotate(-90deg)', 'transform-origin': 'center' }}>LCP P75</text>
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
              min="0.5"
              max="2.5"
              step="0.01"
              value={params.mu}
              onInput={(e) => updateParam('mu', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
