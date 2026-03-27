export function lognormalPDF(x: number, mu: number, sigma: number): number {
  if (x <= 0) return 0;
  const lnXMinusMu = Math.log(x) - mu;
  return (
    (1 / (x * sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp(-(lnXMinusMu * lnXMinusMu) / (2 * sigma * sigma))
  );
}

export interface DistributionParams {
  maxTime: number;
  bucketSize: number;
  volume: number;
  mu: number;
  sigma: number;
  maxErrorRate: number;
  errorRateDecay: number;
  conversionDecay: number;
  averageValue: number;
  maxConversionRate: number;
  conversionPovertyLine: number;
  bounceRateShift: number;
  bounceRateScale: number;
  bounceTimeCompression: number;
}

export function calculateDistribution(params: DistributionParams) {
  const x: number[] = [];
  for (let i = 0; i < params.maxTime; i += params.bucketSize) {
    x.push(i);
  }

  const dist = x.map((val) => lognormalPDF(val, params.mu, params.sigma));

  const distTotal = dist.reduce((total, value) => total + value, 0);

  const totalPopulation = dist.map((value) =>
    Math.floor((value / distTotal) * params.volume)
  );

  const errorRateDistribution = x.map(
    (time) => params.maxErrorRate * Math.exp(-time * params.errorRateDecay)
  );

  const erroredDistribution = totalPopulation.map((value, index) =>
    Math.ceil((value * errorRateDistribution[index]) / 100)
  );

  const bounceRateDistribution = x.map((time) => {
    let bounceRate =
      Math.log10(time * params.bounceTimeCompression + 1) *
        params.bounceRateScale +
      params.bounceRateShift;

    if (bounceRate > 100) bounceRate = 100;
    if (bounceRate < 0) bounceRate = 0;

    return bounceRate;
  });

  const bouncedDistribution = totalPopulation.map((value, index) =>
    Math.ceil(
      ((value - erroredDistribution[index]) * bounceRateDistribution[index]) /
        100
    )
  );

  const effectiveBounceRateDistribution = totalPopulation.map((value, index) =>
    value
      ? ((erroredDistribution[index] + bouncedDistribution[index]) / value) *
        100
      : NaN
  );

  const conversionRateDistribution = x.map(
    (time) =>
      (params.maxConversionRate - params.conversionPovertyLine) *
        Math.exp(-time * params.conversionDecay) +
      params.conversionPovertyLine
  );

  const convertedDistribution = totalPopulation.map((value, index) =>
    Math.floor(
      ((value - erroredDistribution[index] - bouncedDistribution[index]) *
        conversionRateDistribution[index]) /
        100
    )
  );

  const effectiveConversionRateDistribution = totalPopulation.map(
    (value, index) => {
      const remainingUsers =
        value - erroredDistribution[index] - bouncedDistribution[index];
      return remainingUsers > 0
        ? (convertedDistribution[index] / remainingUsers) * 100
        : NaN;
    }
  );

  const nonConvertedDistribution = totalPopulation.map(
    (population, index) =>
      population -
      erroredDistribution[index] -
      bouncedDistribution[index] -
      convertedDistribution[index]
  );

  const totalBounced = bouncedDistribution.reduce(
    (total, value) => total + value,
    0
  );

  const totalConverted = convertedDistribution.reduce(
    (total, value) => total + value,
    0
  );

  const totalNonConverted = nonConvertedDistribution.reduce(
    (total, value) => total + value,
    0
  );

  const averageSpeed =
    totalPopulation.reduce(
      (total, amountOfUsers, index) => total + amountOfUsers * x[index],
      0
    ) / params.volume;

  const averageConversionRate = totalConverted
    ? totalConverted / (totalConverted + totalNonConverted + totalBounced)
    : 0;

  const averageNonBouncedConversionRate = totalConverted
    ? totalConverted / (totalConverted + totalNonConverted)
    : 0;

  let p50 = 0;
  let p75 = 0;
  let p90 = 0;
  let p95 = 0;

  let cumulativeUsers = 0;
  for (let i = 0; i < x.length; i++) {
    cumulativeUsers += totalPopulation[i];
    const fraction = cumulativeUsers / params.volume;
    if (!p50 && fraction >= 0.5) p50 = x[i];
    if (!p75 && fraction >= 0.75) p75 = x[i];
    if (!p90 && fraction >= 0.9) p90 = x[i];
    if (!p95 && fraction >= 0.95) p95 = x[i];
  }

  return {
    x,
    totalPopulation,
    errorRateDistribution,
    effectiveBounceRateDistribution,
    bounceRateDistribution,
    conversionRateDistribution,
    effectiveConversionRateDistribution,
    convertedDistribution,
    erroredDistribution,
    bouncedDistribution,
    nonConvertedDistribution,
    totalBounced,
    totalConverted,
    totalNonConverted,
    averageConversionRate,
    averageNonBouncedConversionRate,
    averageSpeed,
    p50,
    p75,
    p90,
    p95,
  };
}
