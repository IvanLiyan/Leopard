/* Toolkit */
import { MerchantAPIRequest } from "@toolkit/api";

/*
 * WARNING:
 * Please only add add your table name to this list below AFTER whitelisting it
 * in `sweeper/merchant_dashboard/api/monitor.py` to ensure that logs make
 * their away to Prometheus in production.
 */
type WhitelistedPrometheusMonitor = "MerchantPaymentEarlyPaymentPromMon";

/*
 * WARNING:
 * Please only add add your table name to this list above AFTER whitelisting it
 * in `sweeper/merchant_dashboard/api/monitor.py` to ensure that logs make
 * their away to TD in production.
 */

/* This type is used by counter/gauge methods */
export type SimpleMetricLogParams = {
  readonly monitor: WhitelistedPrometheusMonitor;
  readonly metric: string;
  readonly labelDict?:
    | {
        [key: string]: string;
      }
    | null
    | undefined;
  readonly value?: number | null | undefined;
};

export const counterInc = (
  args: SimpleMetricLogParams
): MerchantAPIRequest<SimpleMetricLogParams, {}> =>
  new MerchantAPIRequest<SimpleMetricLogParams, {}>(
    "monitor-js/counter_inc",
    args
  ).setOptions({
    failSilently: true,
  });

export const gaugeInc = (
  args: SimpleMetricLogParams
): MerchantAPIRequest<SimpleMetricLogParams, {}> =>
  new MerchantAPIRequest<SimpleMetricLogParams, {}>(
    "monitor-js/gauge_inc",
    args
  ).setOptions({
    failSilently: true,
  });

export const gaugeSet = (
  args: SimpleMetricLogParams
): MerchantAPIRequest<SimpleMetricLogParams, {}> =>
  new MerchantAPIRequest<SimpleMetricLogParams, {}>(
    "monitor-js/gauge_set",
    args
  ).setOptions({
    failSilently: true,
  });
