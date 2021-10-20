import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LineChart } from "@ContextLogic/lego";
import { Line } from "@ContextLogic/lego";
import { XAxis } from "@ContextLogic/lego";
import { YAxis } from "@ContextLogic/lego";
import { CartesianGrid } from "@ContextLogic/lego";
import { RechartsTooltip } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightNormal } from "@toolkit/fonts";
import {
  formatCurrency,
  getCurrencySymbol,
} from "@ContextLogic/lego/toolkit/currency";
import { formatNumeral } from "@ContextLogic/lego/toolkit/string";

/* Toolkit */
import { getLocalizedDateDisplayText } from "@toolkit/brand/branded-products/utils";

/* Relative Imports */
import IllustratedMetric from "./IllustratedMetric";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BrandPerformanceOverviewState from "@merchant/model/brand/branded-products/BrandPerformanceOverviewState";

type BrandPerformanceChartProps = BaseProps & {
  readonly pageState: BrandPerformanceOverviewState;
};

const BrandPerformanceChart = ({
  pageState,
  className,
}: BrandPerformanceChartProps) => {
  const styles = useStylesheet();
  const { borderPrimary, positive, primaryDark, primary } = useTheme();
  const STROKE = {
    gmv: positive,
    orders: primaryDark,
    impressions: primary,
  };
  const stroke = STROKE[pageState.tabKey];
  const axisProps = {
    fontSize: 14,
    fontWeight: weightNormal,
  };

  /*
   * This block is calculating the max & min values of
   * the data in order to determine whether we should
   * customize the tickCount.
   * This is because Recharts seems to enforce the default
   * tickCount of 5 even when the the data can't really
   * be devided into 5 parts
   * e.g. if the data only ranges from 0-1, Rechart would
   * produce 0 - 0 - 1 - 1 - 1 as the ticks.
   */
  const uniqueTicks = [
    ...new Set(pageState.chartData.map((entry) => entry[pageState.tabKey])),
  ];
  const max = Math.max(...uniqueTicks);
  const min = Math.min(...uniqueTicks);
  const tickCount = max - min < 5 ? uniqueTicks.length : undefined;

  return (
    <div className={css(styles.root, className)}>
      <LineChart data={pageState.chartData.slice()}>
        <CartesianGrid
          vertical={false}
          horizontal
          stroke={borderPrimary}
          strokeDasharray="4"
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => getLocalizedDateDisplayText(value, "M/D")}
          {...axisProps}
        />
        <YAxis
          dataKey={pageState.tabKey}
          orientation="left"
          tickFormatter={(value) =>
            (pageState.tabKey === "gmv"
              ? getCurrencySymbol(pageState.currencyCode)
              : "") + formatNumeral(value, "0a").toUpperCase()
          }
          width={40}
          type="number"
          tickCount={tickCount}
          {...axisProps}
        />
        <RechartsTooltip
          formatter={
            // Disabled to satisfy recharts API
            // eslint-disable-next-line local-rules/no-large-method-params
            (v, e, { payload }) => {
              const dateString = getLocalizedDateDisplayText(
                payload.date,
                "dddd MM/DD/YYYY",
              );
              const gmv = formatCurrency(payload.gmv, pageState.currencyCode);
              const orders = formatNumeral(payload.orders);
              const impressions = formatNumeral(payload.impressions);
              return (
                <div className={css(styles.tooltip)}>
                  <div>{dateString}</div>
                  <IllustratedMetric
                    title={i`GMV`}
                    value={gmv}
                    illustration="gmvIcon"
                    className={css(styles.metric)}
                  />
                  <IllustratedMetric
                    title={i`Orders`}
                    value={orders}
                    illustration="ordersIcon"
                    className={css(styles.metric)}
                  />
                  <IllustratedMetric
                    title={i`Impressions`}
                    value={impressions}
                    illustration="impressionsIcon"
                    className={css(styles.metric)}
                  />
                </div>
              );
            }
          }
        />
        <Line dataKey={pageState.tabKey} strokeWidth={2} stroke={stroke} />
      </LineChart>
    </div>
  );
};

export default observer(BrandPerformanceChart);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          height: 300,
        },
        tooltip: {
          padding: 24,
          fontSize: 16,
          fontWeight: weightNormal,
          color: textBlack,
          maxHeight: 236,
        },
        metric: {
          marginTop: 16,
        },
      }),
    [textBlack],
  );
};
