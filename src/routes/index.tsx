import { params, updateParam, distribution } from '../lib/store';

export default function Level1() {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US').format(value);

  const formatPercent = (value: number) =>
    (value * 100).toFixed(2) + '%';

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
        <div class="future-canvas col-span-3 h-[400px] bg-stone-900/50 flex items-center justify-center">
          <div class="text-center text-4xl font-bold">
            <div class="mb-4">
              {formatNumber(params.volume)} users × {formatPercent(distribution().averageConversionRate)} conversion × {formatCurrency(params.averageValue)}/order
            </div>
            <div class="text-6xl text-emerald-400">
              = {formatCurrency(distribution().totalConverted * params.averageValue)}
            </div>
          </div>
        </div>
      </section>

      <section class="controls-grid grid grid-cols-3 gap-3 pt-5">
        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Audience</h3>
          <div class="mb-4">
            <label class="block text-sm mb-1">Number of Users (Yearly)</label>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={params.volume}
              onInput={(e) => updateParam('volume', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <input
              type="number"
              value={params.volume}
              onInput={(e) => updateParam('volume', parseFloat(e.currentTarget.value))}
              class="mt-2 w-full bg-stone-900 border border-stone-700 rounded p-1 text-right"
            />
          </div>
        </div>

        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Conversion</h3>
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
            <div class="flex justify-between mt-2">
              <span class="text-xs text-stone-500 italic">Effective CR: {formatPercent(distribution().averageConversionRate)}</span>
              <input
                type="number"
                value={params.maxConversionRate}
                onInput={(e) => updateParam('maxConversionRate', parseFloat(e.currentTarget.value))}
                class="w-24 bg-stone-900 border border-stone-700 rounded p-1 text-right"
              />
            </div>
          </div>
        </div>

        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Value</h3>
          <div class="mb-4">
            <label class="block text-sm mb-1">Average Order Value ($)</label>
            <input
              type="range"
              min="1"
              max="1000"
              step="1"
              value={params.averageValue}
              onInput={(e) => updateParam('averageValue', parseFloat(e.currentTarget.value))}
              class="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <input
              type="number"
              value={params.averageValue}
              onInput={(e) => updateParam('averageValue', parseFloat(e.currentTarget.value))}
              class="mt-2 w-full bg-stone-900 border border-stone-700 rounded p-1 text-right"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
