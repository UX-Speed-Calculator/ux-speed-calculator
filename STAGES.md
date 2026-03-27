# Stages

This doc describes mapping from the data model to each of the stages

## 1. Business Formula ✅
1M users × 4% × $25/order
- Conversion rate displayed is mapped to "Average conversion rate".
- The handle to change the value changes "Max Conversion Rate".
- User can drag the number of users and $ per order to calculate total.

## 2. Compare Conversions ✅
Display two conversion values with labels "Fast site" and "Slow site".
- Let user drag the number of users and $ per order to calculate total.
- Show emoji corresponding to speed.

## 3. Metric value ✅
Conversion rate is displayed value that changes when handle is dragged.
- Handle is to change how fast the website is, e.g. Base Speed, AKA μ.
- Display the P75 value.
- Show thresholds on the axis and add labels like "Good, Needs Improvement, Poor".

## 4. Percentiles ✅
Understanding the tail of your performance distribution.
- Visualize P50, P75, P90, P95 on the distribution curve.
- Show impact on conversion for each percentile.

## 5. Performance Roadmap ✅
How improving Base Speed (μ) affects your LCP P75.
- Chart showing P75 trend over a range of μ values.

## 6. Speed Distribution ✅
Visualizing your audience by performance segments.
- Stacked area chart showing Converted, Non-Converted, Bounced, and Failed users.

## 7. Compare Distributions ✅
Calculate the business value of your performance improvements.
- Dual distribution chart comparing "Baseline" vs "Target" performance.
- Direct calculation of potential revenue improvement.
