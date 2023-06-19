import {
  lt,
  metricsDataMap,
  WSS_MISSING_SCORE_INDICATOR,
} from "@performance/migrated/toolkit/stats";

export const formatter = (metric: number) =>
  metricsDataMap.underperformingProducts({
    badProductRate: metric,
  }).currentScoreDisplay ?? WSS_MISSING_SCORE_INDICATOR;

export const compare = (lhs: number, rhs: number) =>
  lt(lhs.toString(), rhs.toString());
