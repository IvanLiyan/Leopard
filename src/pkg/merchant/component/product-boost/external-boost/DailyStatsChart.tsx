/*
 * DailyStatsChart.tsx
 *
 * Created by Jonah Dlin on Thu Mar 11 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";

/* Lego Components */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  CartesianGrid,
  Layout,
  Line,
  LineChart,
  RechartsTooltip,
  Text,
  XAxis,
  YAxis,
} from "@ContextLogic/lego";

import { useTheme } from "@stores/ThemeStore";
import {
  DailyStatsDataKeys,
  DailyStatsLineType,
  DailyStatsLineTypes,
  DailyStatsNames,
  PickedExternalBoostDailyStatsType,
  useDailyStatsLineStroke,
} from "@toolkit/product-boost/external-boost/external-boost";
import { formatCurrency } from "@toolkit/currency";
import { ResponsiveContainer } from "recharts";
import LinePreview from "./LinePreview";

type Props = BaseProps & {
  readonly stats: ReadonlyArray<PickedExternalBoostDailyStatsType>;
  readonly shownMetrics: ReadonlySet<DailyStatsLineType>;
};

const DailyStatsChart: React.FC<Props> = ({
  className,
  style,
  stats,
  shownMetrics,
}: Props) => {
  const styles = useStylesheet();

  const stroke = useDailyStatsLineStroke();

  // Need to pick one dataKey for recharts tooltip otherwise it displays once
  // for each line
  const tooltipDataKey: string | undefined = useMemo(() => {
    const oneShownMetric = DailyStatsLineTypes.find((lineType) =>
      shownMetrics.has(lineType),
    );
    return oneShownMetric == null
      ? undefined
      : DailyStatsDataKeys[oneShownMetric];
  }, [shownMetrics]);

  const currency = stats.length > 0 ? stats[0].gmv.currencyCode : "USD";

  const renderTooltipRow = (metric: DailyStatsLineType, data: string) => (
    <Layout.FlexRow
      justifyContent="space-between"
      className={css(styles.tooltipRow)}
    >
      <Layout.FlexRow className={css(styles.tooltipNameContainer)}>
        <LinePreview className={css(styles.linePreview)} metric={metric} />
        <Text className={css(styles.tooltipText)} weight="semibold">
          {DailyStatsNames[metric]}
        </Text>
      </Layout.FlexRow>
      <Text className={css(styles.tooltipText)}>{data}</Text>
    </Layout.FlexRow>
  );

  const renderTooltip = (dayStats: PickedExternalBoostDailyStatsType) => (
    <div className={css(styles.tooltip)}>
      <Text className={css(styles.tooltipHeader)} weight="semibold">
        {dayStats.date.formatted}
      </Text>
      <div className={css(styles.tooltipInfo)}>
        {shownMetrics.has("CLICKS") &&
          renderTooltipRow(
            "CLICKS",
            numeral(dayStats.clicks).format("0,0").toString(),
          )}
        {shownMetrics.has("ORDERS") &&
          renderTooltipRow(
            "ORDERS",
            numeral(dayStats.orders).format("0,0").toString(),
          )}
        {shownMetrics.has("GMV") &&
          renderTooltipRow("GMV", dayStats.gmv.display)}
        {shownMetrics.has("SPEND") &&
          renderTooltipRow("SPEND", dayStats.spend.display)}
        {shownMetrics.has("ATTRIBUTED_GMV") &&
          renderTooltipRow(
            "ATTRIBUTED_GMV",
            dayStats.attributed?.gmv.display || "--",
          )}
        {shownMetrics.has("ATTRIBUTED_ORDERS") &&
          renderTooltipRow(
            "ATTRIBUTED_ORDERS",
            dayStats.attributed == null
              ? "--"
              : numeral(dayStats.attributed?.orders).format("0,0").toString(),
          )}
      </div>
    </div>
  );

  // Recharts has no way of dynamically calculating y axis width, so we need
  // to approximate it to avoid y axis tick labels overlapping or taking up
  // more space than necessary
  const approxLetterWidth = 7.5;
  const axisWidthPadding = 8;
  const ordersAxisWidth =
    stats.reduce((acc, { orders }) => {
      const length = numeral(orders).format("0,0").toString().length;
      const approxWidth = length * approxLetterWidth;
      return Math.max(acc, approxWidth);
    }, 0) + axisWidthPadding;
  const clicksAxisWidth =
    stats.reduce((acc, { clicks }) => {
      const length = numeral(clicks).format("0,0").toString().length;
      const approxWidth = length * approxLetterWidth;
      return Math.max(acc, approxWidth);
    }, 0) + axisWidthPadding;
  const gmvAxisWidth =
    stats.reduce((acc, { gmv: { amount } }) => {
      const length = formatCurrency(amount, currency).length;
      const approxWidth = length * approxLetterWidth;
      return Math.max(acc, approxWidth);
    }, 0) + axisWidthPadding;
  const spendAxisWidth =
    stats.reduce((acc, { spend: { amount } }) => {
      const length = formatCurrency(amount, currency).length;
      const approxWidth = length * approxLetterWidth;
      return Math.max(acc, approxWidth);
    }, 0) + axisWidthPadding;
  const attributedOrdersAxisWidth =
    stats.reduce((acc, { attributed }) => {
      if (attributed == null) {
        return Math.max(0, acc);
      }
      const length = numeral(attributed.orders).format("0,0").toString().length;
      const approxWidth = length * approxLetterWidth;
      return Math.max(acc, approxWidth);
    }, 0) + axisWidthPadding;
  const attributedGmvAxisWidth =
    stats.reduce((acc, { attributed }) => {
      if (attributed == null) {
        return Math.max(0, acc);
      }
      const length = formatCurrency(attributed?.gmv.amount, currency).length;
      const approxWidth = length * approxLetterWidth;
      return Math.max(acc, approxWidth);
    }, 0) + axisWidthPadding;

  return (
    <div className={css(styles.root, className, style)}>
      {stats.length == 0 ? (
        <Text>No data</Text>
      ) : (
        <div className={css(styles.chartContainer)}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats}>
              <CartesianGrid vertical={false} horizontal />
              <XAxis dataKey="date.formatted" fontSize={12} />
              <RechartsTooltip
                formatter={
                  // Disabled to satisfy recharts API
                  // eslint-disable-next-line local-rules/no-large-method-params
                  (v, e, entry) => {
                    if (entry.dataKey === tooltipDataKey) {
                      return renderTooltip(entry.payload);
                    }
                  }
                }
              />

              <YAxis
                dx={2}
                yAxisId="ORDERS"
                dataKey="orders"
                orientation="left"
                stroke={stroke.ORDERS}
                type="number"
                tickFormatter={(value) =>
                  numeral(value).format("0,0").toString()
                }
                hide={!shownMetrics.has("ORDERS")}
                width={ordersAxisWidth}
              />
              <Line
                name={i`Orders`}
                yAxisId="ORDERS"
                dataKey="orders"
                strokeWidth={2}
                stroke={stroke.ORDERS}
                hide={!shownMetrics.has("ORDERS")}
              />

              <YAxis
                dx={2}
                yAxisId="CLICKS"
                dataKey="clicks"
                orientation="left"
                stroke={stroke.CLICKS}
                type="number"
                tickFormatter={(value) =>
                  numeral(value).format("0,0").toString()
                }
                hide={!shownMetrics.has("CLICKS")}
                width={clicksAxisWidth}
              />
              <Line
                name={i`Clicks`}
                yAxisId="CLICKS"
                dataKey="clicks"
                strokeWidth={2}
                stroke={stroke.CLICKS}
                hide={!shownMetrics.has("CLICKS")}
              />

              <YAxis
                dx={2}
                yAxisId="ATTRIBUTED_ORDERS"
                dataKey="attributed.orders"
                orientation="left"
                stroke={stroke.ATTRIBUTED_ORDERS}
                type="number"
                tickFormatter={(value) =>
                  numeral(value).format("0,0").toString()
                }
                hide={!shownMetrics.has("ATTRIBUTED_ORDERS")}
                width={attributedOrdersAxisWidth}
              />
              <Line
                name={i`Attributed Orders`}
                yAxisId="ATTRIBUTED_ORDERS"
                dataKey="attributed.orders"
                strokeWidth={2}
                stroke={stroke.ATTRIBUTED_ORDERS}
                hide={!shownMetrics.has("ATTRIBUTED_ORDERS")}
              />

              <YAxis
                yAxisId="GMV"
                dataKey="gmv.amount"
                orientation="right"
                stroke={stroke.GMV}
                type="number"
                tickFormatter={(amount) => formatCurrency(amount, currency)}
                hide={!shownMetrics.has("GMV")}
                width={gmvAxisWidth}
                dx={2}
              />
              <Line
                name={i`GMV`}
                yAxisId="GMV"
                dataKey="gmv.amount"
                strokeWidth={2}
                stroke={stroke.GMV}
                hide={!shownMetrics.has("GMV")}
              />

              <YAxis
                yAxisId="ATTRIBUTED_GMV"
                dataKey="attributed.gmv.amount"
                orientation="right"
                stroke={stroke.ATTRIBUTED_GMV}
                type="number"
                tickFormatter={(amount) => formatCurrency(amount, currency)}
                hide={!shownMetrics.has("ATTRIBUTED_GMV")}
                width={attributedGmvAxisWidth}
              />
              <Line
                name={i`Attributed GMV`}
                yAxisId="ATTRIBUTED_GMV"
                dataKey="attributed.gmv.amount"
                strokeWidth={2}
                stroke={stroke.ATTRIBUTED_GMV}
                hide={!shownMetrics.has("ATTRIBUTED_GMV")}
              />

              <YAxis
                yAxisId="SPEND"
                dataKey="spend.amount"
                orientation="right"
                stroke={stroke.SPEND}
                type="number"
                tickFormatter={(amount) => formatCurrency(amount, currency)}
                hide={!shownMetrics.has("SPEND")}
                width={spendAxisWidth}
              />
              <Line
                name={i`Spend`}
                yAxisId="SPEND"
                dataKey="spend.amount"
                strokeWidth={2}
                stroke={stroke.SPEND}
                hide={!shownMetrics.has("SPEND")}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default observer(DailyStatsChart);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          height: 350,
        },
        chartContainer: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          maxWidth: "100%",
        },
        linePreview: {
          marginRight: 4,
        },
        tooltip: {
          padding: "0px 12px",
          fontSize: 14,
          color: textBlack,
          display: "flex",
          flexDirection: "column",
        },
        tooltipHeader: {
          fontSize: 14,
          color: textBlack,
        },
        tooltipInfo: {
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
        },
        tooltipRow: {
          ":not(:last-child)": {
            marginBottom: 4,
          },
        },
        tooltipNameContainer: {
          marginRight: 12,
        },
        tooltipText: {
          fontSize: 14,
          lineHeight: 1.5,
          color: textBlack,
        },
      }),
    [textBlack],
  );
};
