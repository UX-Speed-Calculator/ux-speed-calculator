# Calculator Data Model

The calculator is one model: a population of users spread across a speed axis,
and three outcome curves that decide what happens to them at each speed. Every
level of the [maturity model](maturity/README.md) is a view onto this same
model with different terms collapsed — no level introduces different maths.

Parameter names below are the ones used in the implementation
([`params.js`](../../ux-speed-calculator-react/src/params.js),
[`distribution.js`](../../ux-speed-calculator-react/src/distribution.js)).

## The one equation

Revenue is computed by walking the speed axis bucket by bucket:

```
Revenue = averageValue × Σ  P(t) · (1 − e(t)) · (1 − b(t)) · c(t)
                         t
```

where, over time `t` in seconds:

- `P(t)` — how many users experienced speed `t`
  — `volume` users spread over a lognormal distribution with `mu` and `sigma`
- `e(t)` — the fraction who hit an error, decaying exponentially
  — `maxErrorRate · exp(−t · errorRateDecay)`
- `b(t)` — the fraction of survivors who bounce, growing logarithmically
  — `log10(t · bounceTimeCompression + 1) · bounceRateScale + bounceRateShift`
- `c(t)` — the fraction of the remainder who convert, decaying exponentially to a floor
  — `(maxConversionRate − conversionPovertyLine) · exp(−t · conversionDecay) + conversionPovertyLine`

The losses are sequential: users must survive errors before they can bounce,
and survive bouncing before they can convert. Bounce rate is clamped to the
0–100% range, since the logarithm is unbounded above.

## Parameters

### Business

| Parameter | Label | Meaning | Default | Range |
|-----------|-------|---------|---------|-------|
| `volume` | Number of Users | Total number of users | 1,000,000 | 10,000 – 1,000,000,000 |
| `averageValue` | Average Value of a Converted User | What one conversion is worth | 10 | 0.01 – 1,000 |

### Speed distribution

| Parameter | Label | Meaning | Default | Range |
|-----------|-------|---------|---------|-------|
| `mu` | Base Speed (μ) | Location of the lognormal speed distribution | 1.5 | −3 – 3 |
| `sigma` | Variability (σ) | Scale of the lognormal speed distribution | 0.6 | 0.05 – 3 |

`mu` moves the whole population faster or slower; `sigma` controls how spread
out the experiences are. Together they are the only description of *who your
users are*, speed-wise.

### Error rate

| Parameter | Label | Meaning | Default | Range |
|-----------|-------|---------|---------|-------|
| `maxErrorRate` | Max error rate | Error rate at a theoretical 0 seconds | 100% | 0 – 100% |
| `errorRateDecay` | Error Rate Decay | Power of the exponential decay | 3 | 0 – 5 |

### Bounce rate

| Parameter | Label | Meaning | Default | Range |
|-----------|-------|---------|---------|-------|
| `bounceRateShift` | Min bounce rate | Bounce rate at a theoretical 0 | 20% | 0 – 100% |
| `bounceRateScale` | Bounce rate scale | How high bounce rate climbs on this site | 50% | 0 – 100% |
| `bounceTimeCompression` | Bounce time compression | How quickly slowness starts driving users away | 4 | 0 – |

### Conversion rate

| Parameter | Label | Meaning | Default | Range |
|-----------|-------|---------|---------|-------|
| `maxConversionRate` | Max Conversion | Theoretical maximum conversion at 0 seconds | 50% | 0 – 100% |
| `conversionPovertyLine` | Conversion Poverty Line | Conversion floor for infinitely slow experiences | 1.2% | 0 – `maxConversionRate` |
| `conversionDecay` | Conversion Decay | Power of the exponential decay | 0.85 | 0 – 5 |

`conversionPovertyLine` is the load-bearing one for the argument the calculator
makes: a slow site does not fall to zero conversion. Some users are determined,
captive, or without an alternative. Slowness taxes a business rather than
destroying it, which is exactly why it survives unaddressed for so long.

### Chart parameters

| Parameter | Label | Meaning | Default | Range |
|-----------|-------|---------|---------|-------|
| `maxTime` | — | Time range the distribution is calculated over. Read-only | 100s | — |
| `bucketSize` | bucket size on the histogram | Width of one bucket on the speed axis | 0.1 | 0.05 – 1 |
| `displayMax` | Display Max | Furthest speed drawn on the chart. Display only | 9.99s | 2 – `maxTime` |

### Dependent bounds

Two parameters constrain the range of another, rather than feeding the
equation directly:

- `maxConversionRate` sets the maximum of `conversionPovertyLine` — the floor
  can never rise above the ceiling.
- `maxTime` sets the maximum of `displayMax` — you cannot chart further than
  you calculated.

## Derived series

From the parameters, the model computes a value per speed bucket:

| Series | What it holds |
|--------|---------------|
| `x` | The speed axis itself, in `bucketSize` steps up to `maxTime` |
| `totalPopulation` | Users at each speed |
| `errorRateDistribution` | `e(t)`, as a percentage |
| `bounceRateDistribution` | `b(t)`, as a percentage, clamped to 0–100 |
| `conversionRateDistribution` | `c(t)`, as a percentage |
| `erroredDistribution` | Users who hit an error |
| `bouncedDistribution` | Users who bounced, of those who did not error |
| `convertedDistribution` | Users who converted, of those who neither errored nor bounced |
| `nonConvertedDistribution` | Users who stayed and did not convert |
| `effectiveBounceRateDistribution` | Bounced plus errored, as a share of everyone at that speed |
| `effectiveConversionRateDistribution` | Converted, as a share of those who got the chance |

The *effective* rates are what analytics would actually report, since real
reporting cannot separate a user who errored from one who left. They are the
bridge between the model's clean funnel and the messier numbers a business
sees.

Summing across buckets gives `totalBounced`, `totalConverted` and
`totalNonConverted`, and from those `averageSpeed`, `averageConversionRate`
(over everyone) and `averageNonBouncedConversionRate` (over those who stayed).

## Percentiles

Percentiles are found by walking `totalPopulation` and accumulating users until
a share of `volume` is passed.

The model computes the full set — P50, P75, P90, P95 and P99 — while each level
displays only the ones it needs. Computing more than is displayed is
deliberate: it keeps the display decision open, so a level can change which
percentiles it shows without touching the model.

Implementation note: `distribution.js` currently produces `percentile50`,
`percentile90` and `percentile95`. P75 and P99 still need to be added.

## How each level uses the model

The [maturity model](maturity/README.md) describes seven stages of
organizational understanding. The calculator represents each of them with this
same equation, holding different terms constant — no level introduces different
maths, it only reveals terms the previous level was keeping still:

| Level | What happens to the equation                                                             |
| ----- | ---------------------------------------------------------------------------------------- |
| 1     | `t` does not appear. Conversion is a constant. `Revenue = volume × c̄ × averageValue`     |
| 2     | `t` takes two values: "fast" and "slow". `c(t)` is sampled twice                         |
| 3     | `t` is one scalar. `c(t)` is read at a single point                                      |
| 4     | `t` is located in a population — `sigma` appears, and the number gets a percentile label |
| 5     | `mu` and `sigma` become functions of calendar time                                       |
| 6     | The full sum is evaluated. `e(t)` and `b(t)` become visible                              |
| 7     | The sum is evaluated twice and subtracted                                                |
