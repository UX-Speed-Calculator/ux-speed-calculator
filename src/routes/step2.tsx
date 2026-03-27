import { params, updateParam, distribution } from '../lib/store';

export default function Level2() {
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

  // For comparison, we'll pick two points: "Fast" (e.g. 1s) and "Slow" (e.g. 3s)
  // We need to calculate conversion rate at these points based on the formula:
  // (maxConversionRate - conversionPovertyLine) * Math.exp(-time * conversionDecay) + conversionPovertyLine

  const getCRAtTime = (time: number) => {
    const cr = (params.maxConversionRate - params.conversionPovertyLine) *
        Math.exp(-time * params.conversionDecay) +
      params.conversionPovertyLine;
    return cr / 100;
  };

  const fastTime = 1; // 1 second
  const slowTime = 3; // 3 seconds

  const fastCR = getCRAtTime(fastTime);
  const slowCR = getCRAtTime(slowTime);

  const getEmoji = (time: number) => {
    if (time <= 1) return '🚀';
    if (time <= 2.5) return '🐢';
    return '🐌';
  };

  return (
    <main class="mx-auto p-4">
      <section class="info-and-canvas grid grid-cols-4 gap-1">
        <section class="col-span-1 flex flex-col">
          <h1 class="text-[2rem] uppercase">Level 2</h1>
          <section class="mt-5">
            <h2>Is My Site Fast or Slow?</h2>
            <p>Compare conversion rates at different speeds.</p>
          </section>
        </section>
        <div class="future-canvas col-span-3 h-[400px] bg-stone-900/50 flex items-center justify-center">
          <div class="grid grid-cols-2 gap-10 w-full px-10">
            <div class="bg-stone-800 p-6 rounded-xl border-2 border-emerald-500 text-center">
              <div class="text-6xl mb-4">{getEmoji(fastTime)}</div>
              <h3 class="text-2xl font-bold text-emerald-400">Fast Site</h3>
              <p class="text-stone-400">Load time: {fastTime}s</p>
              <div class="text-4xl font-bold mt-4">{formatPercent(fastCR)}</div>
              <p class="text-sm text-stone-500 mt-2 italic">Potential Value: {formatCurrency(params.volume * fastCR * params.averageValue)}</p>
            </div>
            <div class="bg-stone-800 p-6 rounded-xl border-2 border-rose-500 text-center opacity-75">
              <div class="text-6xl mb-4">{getEmoji(slowTime)}</div>
              <h3 class="text-2xl font-bold text-rose-400">Slow Site</h3>
              <p class="text-stone-400">Load time: {slowTime}s</p>
              <div class="text-4xl font-bold mt-4">{formatPercent(slowCR)}</div>
              <p class="text-sm text-stone-500 mt-2 italic">Potential Value: {formatCurrency(params.volume * slowCR * params.averageValue)}</p>
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

        <div class="bg-stone-800 p-4 rounded shadow">
          <h3 class="text-lg font-bold mb-3 uppercase text-stone-400">Market Baseline</h3>
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
