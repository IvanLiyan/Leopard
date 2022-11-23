import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import hash from "object-hash";

import {
  H4,
  H5,
  Card,
  LineChart,
  CartesianGrid,
  XAxis,
  RechartsTooltip,
  Line,
  YAxis,
  Legend,
  Info,
  LegendProps,
  RechartsTooltipProps,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "src/app/core/stores/ThemeStore";

type CustomRechartsToolTipProps = Omit<RechartsTooltipProps, "payload"> & {
  readonly payload: ReadonlyArray<
    unknown & {
      readonly name: string;
      readonly value: string;
      readonly color: string;
      readonly dataKey: string;
      readonly strokeDasharray: string | undefined;
      readonly payload: GraphData;
      readonly unit?: string;
    }
  >;
};

type LineProps = {
  readonly name: string;
  readonly dataKey: string;
  readonly stroke: string;
  readonly strokeDasharray?: string;
  readonly unit?: string;
};

type GraphData = {
  readonly date: string;
  readonly name: string;
  readonly impressions: number;
  readonly impressionsDisplay: string;
  readonly gmv?: number;
  readonly gmvDisplay?: string;
  readonly orders: number;
  readonly ordersDisplay: string;
  readonly avgOrderValue?: number;
  readonly avgOrderValueDisplay?: string;
};

type LegendData = {
  readonly totalStat: string;
  readonly tooltip?: string;
  readonly currencyCode?: string;
};

type Props = BaseProps & {
  // legacy any usage copied from clroot
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly graphData?: ReadonlyArray<any>;
  readonly firstLineProps: LineProps;
  readonly secondLineProps?: LineProps;
  readonly firstLegendData?: LegendData;
  readonly secondLegendData?: LegendData;
  readonly dataRange?: [number, number];
};

const StoreChart = (props: Props) => {
  const {
    className,
    style,
    graphData,
    firstLineProps,
    secondLineProps,
    firstLegendData,
    secondLegendData,
    dataRange,
  } = props;
  const styles = useStylesheet();

  const getLegendData = (index: number) => {
    if (index === 0) {
      return firstLegendData;
    } else if (secondLineProps != null && index === 1) {
      return secondLegendData;
    }

    return null;
  };

  const legendFormatter = (props: LegendProps) => {
    const { payload } = props;

    if (payload == null) {
      return null;
    }
    return (
      <div className={css(styles.legend)}>
        {payload.map((entry, index) => {
          const { value, color, payload } = entry;
          const legendData = getLegendData(index);
          const borderStyle = payload?.strokeDasharray ? "dashed" : "solid";

          if (legendData == null) {
            return null;
          }

          return (
            <div
              key={hash(`${index}-${value}`)}
              className={css(styles.legendData)}
            >
              <div
                className={css(styles.legendLine)}
                style={{
                  borderTop: `4px ${color} ${borderStyle}`,
                }}
              />
              <div>
                <div className={css(styles.legendValue)}>
                  <span style={{ marginRight: 4 }}>{value}</span>
                  {legendData.tooltip && (
                    <Info
                      text={legendData.tooltip}
                      size={16}
                      position="top center"
                      sentiment="info"
                    />
                  )}
                </div>
                <H4>{legendData?.totalStat}</H4>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const tooltipFormatter = (props: CustomRechartsToolTipProps) => {
    const { payload } = props;

    if (payload == null || payload.length === 0) {
      return null;
    }

    const date = payload[0].payload.date;

    return (
      <Card className={css(styles.tooltip)}>
        <div className={css(styles.date)}>{date}</div>
        {payload.map((entry, index) => {
          const { name, value, color, strokeDasharray, unit } = entry;
          const valueDisplay = value;

          const borderStyle = strokeDasharray ? "dashed" : "solid";
          return (
            <div
              key={hash(`${index}-${value}`)}
              className={css(styles.tooltipItem)}
            >
              <div
                className={css(styles.legendLine)}
                style={{
                  borderTop: `4px ${color} ${borderStyle}`,
                }}
              />
              <div>
                <span style={{ marginRight: 4 }}>{name}</span>
                <H5>
                  {valueDisplay}
                  &nbsp;
                  <span style={{ fontSize: "14px", fontWeight: "normal" }}>
                    {unit}
                  </span>
                </H5>
              </div>
            </div>
          );
        })}
      </Card>
    );
  };

  const { textDark } = useTheme();
  return (
    <div className={css(styles.chart, className, style)}>
      <LineChart data={graphData}>
        <CartesianGrid vertical={false} strokeDasharray="4" horizontal />
        <XAxis dataKey="date" />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ top: -30, width: "auto" }}
          content={legendFormatter}
        />
        <RechartsTooltip
          imageFormatter={() => null}
          content={tooltipFormatter}
        />
        <YAxis
          yAxisId="left"
          dataKey={firstLineProps.dataKey}
          stroke={textDark}
          tickCount={11}
          domain={dataRange || ["dataMin", "dataMax"]}
          type="number"
        />
        <Line yAxisId="left" strokeWidth={3} {...firstLineProps} />
        {secondLineProps && (
          <Line yAxisId="left" strokeWidth={3} {...secondLineProps} />
        )}
      </LineChart>
    </div>
  );
};

export default StoreChart;

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        chart: {
          flex: 1,
          height: 374,
          paddingBottom: 20,
          paddingTop: 0,
        },
        legend: {
          display: "flex",
          paddingLeft: 0,
          "@media (max-width: 900px)": {
            flexDirection: "column",
            ":first-child > :first-child": {
              marginBottom: 8,
            },
          },
        },
        legendData: {
          display: "flex",
          alignItems: "flex-start",
          marginRight: 42,
        },
        legendValue: {
          display: "flex",
          alignItems: "center",
          marginBottom: 8,
        },
        legendLine: {
          borderRadius: 4,
          width: 32,
          marginTop: 8,
          marginRight: 16,
        },
        tooltip: {
          display: "flex",
          flexDirection: "column",
          padding: "24px 24px 8px 24px",
        },
        tooltipItem: {
          display: "flex",
          alignItems: "flex-start",
          marginBottom: 16,
        },
        date: {
          fontSize: 14,
          color: textDark,
          lineHeight: "20px",
          letterSpacing: "0.01em",
          marginBottom: 16,
        },
      }),
    [textDark],
  );
};
