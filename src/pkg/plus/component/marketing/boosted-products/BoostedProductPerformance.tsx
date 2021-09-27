/*
 *
 * BoostedProductPerformance.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/15/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import numeral from "numeral";
import { TooltipPayload } from "recharts";

import {
  H5,
  Line,
  XAxis,
  YAxis,
  LineChart,
  CartesianGrid,
  LoadingIndicator,
  RechartsTooltip,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { weightMedium } from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import {
  Datetime,
  CurrencyValue,
  ProductPromotionPeriodStats,
  ProductPromotionDailyStats,
  ProductPromotionSchemaPeriodStatsArgs,
} from "@schema/types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type TimeRange = "ONE_WEEK" | "ONE_MONTH" | "ALL";

const GET_PERIOD_STATS = gql`
  query BoostedProductPerformance_GetPeriodStats(
    $productId: ObjectIdType!
    $startTime: DatetimeInput!
    $endTime: DatetimeInput!
    $dateFormat: String!
  ) {
    marketing {
      productPromotion(productId: $productId) {
        periodStats(startTime: $startTime, endTime: $endTime) {
          totalGmv {
            amount
            display
            currencyCode
          }
          totalSales
          totalImpressions
          dailyStats {
            date {
              formatted(fmt: $dateFormat)
            }
            impressions
            gmv {
              amount
              display
            }
            sales
          }
        }
      }
    }
  }
`;

type GetProductStatsRequestType = ProductPromotionSchemaPeriodStatsArgs & {
  readonly productId: string;
  readonly dateFormat: string;
};

type PickedDailyStat = Pick<
  ProductPromotionDailyStats,
  "impressions" | "sales"
> & {
  readonly gmv: Pick<CurrencyValue, "amount" | "display">;
  readonly date: Pick<Datetime, "formatted">;
};

type PickedProductPromotion = {
  readonly periodStats: Pick<
    ProductPromotionPeriodStats,
    "totalSales" | "totalImpressions"
  > & {
    readonly totalGmv: Pick<
      CurrencyValue,
      "amount" | "display" | "currencyCode"
    >;
    readonly dailyStats: ReadonlyArray<PickedDailyStat>;
  };
};

type GetProductStatsResponseType = {
  readonly marketing: {
    readonly productPromotion: PickedProductPromotion | null;
  };
};

type Props = BaseProps & {
  readonly timeRange: TimeRange;
  readonly productId: string;
  readonly productCreationTime: number;
};

const BoostedProductPerformance: React.FC<Props> = (props: Props) => {
  const { style, className, productId, timeRange, productCreationTime } = props;

  const styles = useStylesheet();

  const {
    primary: impressionsColor,
    positive: gmvColor,
    purpleSurface: ordersColor,
  } = useTheme();

  const productIsMoreThanOneYearOld =
    productCreationTime < new Date().getTime() / 1000 - 3.154e7;
  const [startTime, endTime] = useStartAndEndTime(
    timeRange,
    productCreationTime
  );
  const { data, loading: isLoading } = useQuery<
    GetProductStatsResponseType,
    GetProductStatsRequestType
  >(GET_PERIOD_STATS, {
    variables: {
      productId,
      startTime: { unix: startTime },
      endTime: { unix: endTime },
      dateFormat:
        timeRange == "ALL" && productIsMoreThanOneYearOld
          ? "%m/%d/%Y"
          : "%m/%d",
    },
  });

  const productPromotion = data?.marketing.productPromotion;
  const dailyStats =
    data?.marketing.productPromotion?.periodStats.dailyStats || [];
  const ticks = useTicks(dailyStats);

  if (!productPromotion) {
    return <LoadingIndicator />;
  }

  const {
    periodStats: { totalSales, totalImpressions, totalGmv },
  } = productPromotion;

  return (
    <div
      className={css(styles.root, className, style)}
      style={{ opacity: isLoading ? 0.25 : 1 }}
    >
      <div className={css(styles.headerContainer)}>
        <div className={css(styles.headerSection)}>
          <div className={css(styles.title, styles.impressions)}>
            Impressions
          </div>
          <H5 className={css(styles.value)}>
            {numeral(totalImpressions).format("0,0").toString()}
          </H5>
        </div>
        <div className={css(styles.headerSection)}>
          <div className={css(styles.title, styles.orders)}>Orders</div>
          <H5 className={css(styles.value)}>
            {numeral(totalSales).format("0,0").toString()}
          </H5>
        </div>
        <div className={css(styles.headerSection)}>
          <div className={css(styles.title, styles.revenue)}>Revenue</div>
          <H5 className={css(styles.value)}>{totalGmv.display}</H5>
        </div>
      </div>
      <div className={css(styles.chart)}>
        <LineChart data={dailyStats}>
          <CartesianGrid vertical={false} horizontal />
          <XAxis
            dataKey="date.formatted"
            ticks={ticks}
            interval="preserveStartEnd"
          />
          <RechartsTooltip
            // Lint rule disabled to satisfy the recharts API
            // eslint-disable-next-line local-rules/no-large-method-params
            formatter={(
              value: unknown,
              name: unknown,
              entry: TooltipPayload
            ) => {
              if (name === "impressions") {
                return (
                  <div className={css(styles.tooltipContainer)}>
                    <div className={css(styles.tooltipTitle)}>
                      {entry.payload.date.formatted}
                    </div>
                    <table>
                      <tr>
                        <td className={css(styles.tooltipLabel)}>
                          Impressions
                        </td>
                        <td className={css(styles.tooltipValue)}>
                          {numeral(entry.payload.impressions)
                            .format("0,0")
                            .toString()}
                        </td>
                      </tr>
                      <tr>
                        <td className={css(styles.tooltipLabel)}>Orders</td>
                        <td className={css(styles.tooltipValue)}>
                          {numeral(entry.payload.sales)
                            .format("0,0")
                            .toString()}
                        </td>
                      </tr>
                      <tr>
                        <td className={css(styles.tooltipLabel)}>Revenue</td>
                        <td className={css(styles.tooltipValue)}>
                          {entry.payload.gmv.display}
                        </td>
                      </tr>
                    </table>
                  </div>
                );
              }
            }}
          />
          <YAxis
            yAxisId={i`Impressions`}
            dataKey="impressions"
            orientation="left"
            stroke={impressionsColor}
            type="number"
            tickFormatter={(value) => numeral(value).format("0,0").toString()}
            hide={totalImpressions === 0}
          />
          <Line
            yAxisId={i`Impressions`}
            dataKey="impressions"
            strokeWidth={1}
            stroke={impressionsColor}
            dot={false}
            activeDot
          />
          <YAxis
            yAxisId={i`Orders`}
            dataKey="sales"
            orientation="left"
            stroke={ordersColor}
            type="number"
            tickFormatter={(value) => numeral(value).format("0,0").toString()}
            hide={totalSales === 0}
          />
          <Line
            yAxisId={i`Orders`}
            dataKey="sales"
            strokeWidth={1}
            stroke={ordersColor}
            dot={false}
            activeDot
          />
          <YAxis
            yAxisId={i`GMV`}
            dataKey="gmv.amount"
            orientation="right"
            stroke={gmvColor}
            type="number"
            tickFormatter={(value) =>
              formatCurrency(value, totalGmv.currencyCode)
            }
            hide={totalGmv.amount === 0}
          />
          <Line
            yAxisId={i`GMV`}
            dataKey="gmv.amount"
            strokeWidth={1}
            stroke={gmvColor}
            dot={false}
            activeDot
          />
        </LineChart>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const {
    pageBackground,
    primary: impressionsColor,
    positive: gmvColor,
    purpleSurface: ordersColor,
    borderPrimary,
    textBlack,
    textDark,
  } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          transition: "opacity 0.3s linear",
        },
        headerContainer: {
          backgroundColor: pageBackground,
          padding: 15,
          display: "grid",
          alignItems: "center",
          gridGap: 20,
          maxWidth: "100%",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderRadius: 4,
        },
        title: {
          fontSize: 15,
          marginBottom: 7,
        },
        headerSection: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          ":not(:first-child)": {
            borderLeft: `1px dashed ${borderPrimary}`,
          },
          paddingLeft: 15,
        },
        impressions: {
          color: impressionsColor,
        },
        orders: {
          color: ordersColor,
        },
        revenue: {
          color: gmvColor,
        },
        value: {
          fontSize: 15,
        },
        chart: {
          margin: "20px 0px",
          height: 270,
        },
        tooltipContainer: {
          display: "flex",
          flexDirection: "column",
        },
        tooltipTitle: {
          color: textBlack,
          fontWeight: weightMedium,
          fontSize: 14,
        },
        tooltipContent: {
          border: "none",
          width: "100%",
        },
        tooltipLabel: {
          color: textDark,
          fontSize: 14,
          fontWeight: weightMedium,
        },
        tooltipValue: {
          color: textBlack,
          fontSize: 14,
          fontWeight: weightMedium,
          paddingLeft: 30,
        },
      }),
    [
      pageBackground,
      impressionsColor,
      gmvColor,
      ordersColor,
      borderPrimary,
      textBlack,
      textDark,
    ]
  );
};

const useStartAndEndTime = (
  range: TimeRange,
  productCreationTime: number
): [number, number] => {
  return useMemo(() => {
    const now = moment();
    const nowTimestamp = now.toDate().getTime() / 1000;
    const TimestampsByRange: { [period in TimeRange]: [number, number] } = {
      ONE_MONTH: [
        now.clone().subtract(1, "month").toDate().getTime() / 1000,
        nowTimestamp,
      ],
      ONE_WEEK: [
        now.clone().subtract(1, "week").toDate().getTime() / 1000,
        nowTimestamp,
      ],
      ALL: [productCreationTime, nowTimestamp],
    };
    return TimestampsByRange[range];
  }, [range, productCreationTime]);
};

const NUM_DATA_POINTS = 7;
const useTicks = (
  stats: ReadonlyArray<PickedDailyStat>
): ReadonlyArray<string> => {
  return useMemo(() => {
    const interval = Math.floor(stats.length / (NUM_DATA_POINTS - 1));
    let results: ReadonlyArray<string> = [];
    let offset = 0;
    while (offset < stats.length && results.length < NUM_DATA_POINTS - 1) {
      results = [...results, stats[offset].date.formatted];
      offset += interval;
    }
    if (stats.length > 1) {
      results = [...results, stats[stats.length - 1].date.formatted];
    }
    return results;
  }, [stats]);
};

export default observer(BoostedProductPerformance);
