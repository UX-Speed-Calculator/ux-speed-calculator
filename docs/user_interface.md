# User Interface

How the model is put on screen at each level: which controls are shown, and
which parts of the distribution are drawn. The model being displayed is
documented in [the data model](data_model.md); the reasoning about what each
level is for lives in [the maturity model](maturity/README.md).

## Screens

One route per level:

| Level | Route                                            |
| ----- | ------------------------------------------------ |
| 1     | [`src/routes/index.tsx`](../src/routes/index.tsx) |
| 2     | [`src/routes/step2.tsx`](../src/routes/step2.tsx) |
| 3     | [`src/routes/step3.tsx`](../src/routes/step3.tsx) |
| 4     | [`src/routes/step4.tsx`](../src/routes/step4.tsx) |
| 5     | [`src/routes/step5.tsx`](../src/routes/step5.tsx) |
| 6     | [`src/routes/step6.tsx`](../src/routes/step6.tsx) |
| 7     | [`src/routes/step7.tsx`](../src/routes/step7.tsx) |

## Control groups

Level N exposes N groups of controls, and every control from Level N−1 is still
there and still live. This is already the structure of the routes: Level N
renders N control panels.

The group that matters at the current level stays open; the earlier ones
collapse by default but remain available to tweak, and they keep driving the
model whether or not anyone opens them. Progress is strictly additive — nothing
is taken away as you climb, only folded away.

The two halves do different jobs. Collapsing keeps attention on the idea the
level is introducing. Folding rather than removing keeps the level honest,
since a curious user can always open a panel and confirm that the earlier
parameters are still at work underneath.

## Percentiles on screen

No single percentile runs through the app. Each level draws whichever ones
illustrate its point, and part of what these levels teach is that the choice is
a convention rather than a law:

| Level | Percentiles drawn                                                                             |
| ----- | --------------------------------------------------------------------------------------------- |
| 3     | One duration, not presented as a percentile at all                                              |
| 4     | P75 — the Core Web Vitals convention, introduced as a choice about whom you are willing to fail |
| 5     | P50, P75 and P99 tracked together, so the bands can be seen moving independently                |
| 6     | The whole distribution, with percentiles marked on it as landmarks                              |

The model computes more percentiles than any one level displays, so a level can
change which ones it shows without touching the model. See
[the data model](data_model.md#percentiles) for the full set.

## Chart range and resolution

Two parameters exist only to control drawing, not to change the outcome:
`bucketSize` sets the width of a histogram bucket, and `displayMax` sets how
far along the speed axis the chart is drawn. Both are described in
[the data model](data_model.md#chart-parameters).

## Emoji

The emoji faces belong with the distribution, at Level 6. That is the first
screen with a population to spread them across: the histogram is built out of
faces, happy through neutral to angry, so the shape of the distribution and how
it feels to be in it are the same picture. Shown earlier they would only
decorate a number.
