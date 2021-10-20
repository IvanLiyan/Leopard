/*
 * ProductCountGraph.tsx
 *
 * Created by Jonah Dlin on Mon Aug 16 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";
import _ from "lodash";

/* Lego Components */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  Layout,
  Line,
  LineChart,
  RechartsTooltip,
  Text,
  XAxis,
  YAxis,
  ReferenceLine,
} from "@ContextLogic/lego";

import { useTheme } from "@stores/ThemeStore";
import { DotProps, ResponsiveContainer } from "recharts";
import {
  formatProductAmount,
  PickedProductCount,
  DayNameMap,
  MonthNameMap,
} from "@toolkit/products/product-listing-plan";

const DotRadius = 9;
const StrokeWidth = 3;

type Props = BaseProps & {
  readonly data: ReadonlyArray<PickedProductCount>;
};

const ProductCountGraph: React.FC<Props> = ({
  className,
  style,
  data,
}: Props) => {
  const styles = useStylesheet();

  const { secondaryDark, surfaceLightest, textDark } = useTheme();

  const stroke = secondaryDark;

  const monthStarts: ReadonlyArray<number> = useMemo(() => {
    return data
      .filter(({ date: { unix } }) => moment.unix(unix).date() === 1)
      .map(({ date: { unix } }) => unix);
  }, [data]);

  const maxes: ReadonlySet<number> = useMemo(() => {
    const result: Set<number> = new Set();
    const rawMonths: ReadonlyArray<number> = data.reduce(
      (acc, { date: { unix } }) => {
        const month = moment.unix(unix).startOf("month").unix();
        if (acc.includes(month)) {
          return acc;
        }
        const newAcc = [...acc, month];
        return newAcc;
      },
      [] as ReadonlyArray<number>,
    );

    const months =
      rawMonths.length == 3
        ? _.without(rawMonths, _.min(rawMonths) || 0)
        : rawMonths;

    months.forEach((monthUnix) => {
      const maxCount = _.maxBy(
        data.filter(
          ({ date: { unix } }) =>
            moment.unix(unix).startOf("month").unix() == monthUnix,
        ),
        "count",
      );
      if (maxCount != null) {
        result.add(maxCount.date.unix);
      }
    });

    return result;
  }, [data]);

  const renderTooltip = (dailyData: PickedProductCount) => {
    const date = moment.unix(dailyData.date.unix);
    const dayName = DayNameMap[date.get("day")];
    const monthName = MonthNameMap[date.get("month")];
    const isMax = maxes.has(dailyData.date.unix);
    const formattedDate = date.format("M/D/YYYY");
    return (
      <Layout.FlexColumn className={css(styles.tooltip)}>
        <Text style={styles.tooltipHeader} weight="semibold">
          {dayName} {formattedDate}
        </Text>
        <Layout.GridRow
          templateColumns="max-content max-content"
          gap="4px 8px"
          alignItems="center"
        >
          {isMax ? renderDot() : <div className={css(styles.linePreview)} />}
          <Text style={styles.tooltipText}>
            {isMax ? i`Maximum ${monthName} listings` : i`Listings`}
          </Text>
          <Text style={styles.listingsAmount} weight="semibold">
            {dailyData.count == null
              ? "--"
              : formatProductAmount(dailyData.count)}
          </Text>
        </Layout.GridRow>
      </Layout.FlexColumn>
    );
  };

  const renderDot = (props?: { readonly x?: number; readonly y?: number }) => {
    const x = props?.x || 0;
    const y = props?.y || 0;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x={x - DotRadius}
        y={y - DotRadius}
        width={DotRadius * 2}
        height={DotRadius * 2}
        viewBox={`0 0 ${DotRadius * 2} ${DotRadius * 2}`}
        fill="none"
      >
        <circle
          cx={DotRadius}
          cy={DotRadius}
          r={DotRadius - StrokeWidth / 2}
          fill={surfaceLightest}
          stroke={stroke}
          strokeWidth={StrokeWidth}
        />
      </svg>
    );
  };

  const formatXAxisDate = (dateUnix: number) =>
    moment.unix(dateUnix).format("M/D");

  const renderReferenceLabel = ({
    x,
    y,
    text,
  }: {
    readonly x: number;
    readonly y: number;
    readonly text: string;
  }) => {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <text textAnchor="middle" fill={textDark} fontSize={12}>
          {text}
        </text>
      </g>
    );
  };

  return (
    <div className={css(styles.root, className, style)}>
      {data.length == 0 ? (
        <Text>No data</Text>
      ) : (
        <div className={css(styles.chartContainer)}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                right: DotRadius,
                left: DotRadius,
                bottom: 0,
                top: DotRadius,
              }}
            >
              <XAxis
                dataKey="date.unix"
                fontSize={12}
                tickFormatter={formatXAxisDate}
                tickMargin={8}
                axisLine
                interval="preserveStartEnd"
                height={60}
                dy={0}
              />
              <RechartsTooltip
                formatter={
                  // Disabled to satisfy recharts API
                  // eslint-disable-next-line local-rules/no-large-method-params
                  (v, e, entry) => {
                    return renderTooltip(entry.payload);
                  }
                }
              />

              <YAxis
                yAxisId="COUNT"
                label={{
                  position: "insideLeft",
                  value: i`Product listings`,
                  angle: 270,
                  stroke: textDark,
                  fontSize: 14,
                }}
                dataKey="count"
              />
              <Line
                yAxisId="COUNT"
                dataKey="count"
                strokeWidth={StrokeWidth}
                stroke={stroke}
                dot={({
                  cx,
                  cy,
                  payload,
                }: DotProps & { readonly payload: PickedProductCount }) => {
                  if (
                    cx == null ||
                    cy == null ||
                    !maxes.has(payload.date.unix)
                  ) {
                    return null;
                  }
                  return renderDot({ x: cx, y: cy });
                }}
              />

              {monthStarts.map((unix) => {
                const date = moment.unix(unix);
                const yearName = date.get("year");
                const monthName = MonthNameMap[date.get("month")];
                return (
                  <ReferenceLine
                    key={unix}
                    yAxisId="COUNT"
                    x={unix}
                    strokeDasharray="3 3"
                    stroke={textDark}
                    label={({
                      viewBox: { x, y, height },
                    }: {
                      readonly viewBox: {
                        readonly x: number;
                        readonly y: number;
                        readonly height: number;
                        readonly width: number;
                      };
                    }) =>
                      renderReferenceLabel({
                        x,
                        y: y + height + 40,
                        text: i`${`${monthName} ${yearName}`} billing cycle`,
                      })
                    }
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default observer(ProductCountGraph);

const useStylesheet = () => {
  const { textBlack, textDark, secondaryDark } = useTheme();
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
        tooltip: {
          padding: "0px 12px",
        },
        tooltipHeader: {
          fontSize: 14,
          lineHeight: "20px",
          marginBottom: 16,
          color: textDark,
        },
        linePreview: {
          backgroundColor: secondaryDark,
          height: 4,
          width: 24,
          borderRadius: 4,
        },
        tooltipText: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        listingsAmount: {
          gridColumn: 2,
          fontSize: 20,
          lineHeight: "24px",
          color: textBlack,
        },
      }),
    [textBlack, textDark, secondaryDark],
  );
};
