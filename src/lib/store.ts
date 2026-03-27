import { createStore } from 'solid-js/store';
import { createMemo } from 'solid-js';
import { calculateDistribution, DistributionParams } from './distribution';

export const initialParams: DistributionParams = {
  maxTime: 100,
  bucketSize: 0.1,
  volume: 1000000,
  mu: 1.5,
  sigma: 0.6,
  maxErrorRate: 100,
  errorRateDecay: 3,
  conversionDecay: 0.85,
  averageValue: 25,
  maxConversionRate: 5.6, // Adjusted to get roughly 4% average conversion rate with default mu/sigma
  conversionPovertyLine: 1.2,
  bounceRateShift: 20,
  bounceRateScale: 50,
  bounceTimeCompression: 4,
};

const [params, setParams] = createStore<DistributionParams>({ ...initialParams });

export { params, setParams };

export const distribution = createMemo(() => calculateDistribution(params));

export const updateParam = (name: keyof DistributionParams, value: number) => {
  setParams(name, value);
};
