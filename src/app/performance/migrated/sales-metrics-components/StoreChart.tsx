import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import numeral from "numeral";
import hash from "object-hash";

import { H4, H5, Card, Info } from "@ContextLogic/lego";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  Line,
  YAxis,
  Legend,
  LegendProps,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  TooltipProps as RechartsTooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@core/stores/ThemeStore";
import { useLocalizationStore } from "@core/stores/LocalizationStore";

type LineProps = {
  readonly name: string;
  readonly dataKey: string;
  readonly stroke: string;
  readonly strokeDasharray?: string;
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
  readonly graphData?: ReadonlyArray<GraphData>;
  readonly firstLineProps: LineProps;
  readonly secondLineProps: LineProps;
  readonly firstLegendData: LegendData;
  readonly secondLegendData: LegendData;
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
  } = props;
  const styles = useStylesheet();
  const { locale } = useLocalizationStore();

  const getLegendData = (index: number) => {
    if (index === 0) {
      return firstLegendData;
    } else if (index === 1) {
      return secondLegendData;
    }

    return null;
  };

  // typing required to resolve ts error
  const legendFormatter = (props: Omit<LegendProps, "width" | "height">) => {
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
                <H4>{legendData.totalStat}</H4>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const tooltipFormatter = (
    props: RechartsTooltipProps<ValueType, NameType>,
  ) => {
    const { payload } = props;

    if (payload == null || payload.length === 0) {
      return null;
    }

    const date = payload[0].payload.date;

    return (
      <Card className={css(styles.tooltip)}>
        <div className={css(styles.date)}>{date}</div>
        {payload.map((entry, index) => {
          const {
            name,
            value,
            color,
            strokeDasharray,
            dataKey,
            payload: graphData,
          } = entry;
          let valueDisplay = value;

          if (dataKey === "gmv" && graphData.gmvDisplay != null) {
            valueDisplay = graphData.gmvDisplay;
          } else if (
            dataKey === "avgOrderValue" &&
            graphData.avgOrderValueDisplay != null
          ) {
            valueDisplay = graphData.avgOrderValueDisplay;
          } else if (dataKey === "orders") {
            valueDisplay = graphData.ordersDisplay;
          }
          if (dataKey === "impressions") {
            valueDisplay = graphData.impressionsDisplay;
          }

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
                <H5>{valueDisplay}</H5>
              </div>
            </div>
          );
        })}
      </Card>
    );
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      // TODO: doesn't work on QQ browser
      // maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={css(styles.chart, className, style)}>
      <ResponsiveContainer>
        {/* we have to make a copy of graphData since recharts can't handle readonly */}
        <LineChart data={graphData ? [...graphData] : undefined}>
          <CartesianGrid vertical={false} strokeDasharray="4" horizontal />
          <XAxis dataKey="name" strokeWidth={0} style={{ fontSize: "12px" }} />
          <Legend
            verticalAlign="top"
            align="left"
            wrapperStyle={{ top: -20 }}
            content={legendFormatter}
          />
          <RechartsTooltip
            wrapperClassName={css(styles.tooltipContainer)}
            labelClassName={css(styles.tooltipContainer)}
            content={tooltipFormatter}
          />
          <YAxis
            yAxisId="left"
            dataKey={firstLineProps.dataKey}
            stroke={firstLineProps.stroke}
            orientation="left"
            tickCount={6}
            tickFormatter={(value) =>
              firstLegendData.currencyCode != null
                ? // legacy migrated code
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  formatCurrency(value, firstLegendData.currencyCode)
                : numeral(value).format("0,0")
            }
            domain={[0, "dataMax"]}
            type="number"
            width={100}
            allowDecimals={false}
            strokeWidth={0}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            yAxisId="right"
            dataKey={secondLineProps.dataKey}
            stroke={secondLineProps.stroke}
            orientation="right"
            tickCount={6}
            tickFormatter={(value) =>
              secondLegendData.currencyCode != null
                ? // legacy migrated code
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  formatCurrency(value, secondLegendData.currencyCode)
                : numeral(value).format("0,0")
            }
            domain={[0, "dataMax"]}
            type="number"
            width={100}
            dx={8}
            allowDecimals={false}
            strokeWidth={0}
            style={{ fontSize: "12px" }}
          />
          <Line
            yAxisId="left"
            strokeWidth={3}
            type="monotone"
            {...firstLineProps}
          />
          <Line
            yAxisId="right"
            strokeWidth={3}
            type="monotone"
            {...secondLineProps}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StoreChart;

const useStylesheet = () => {
  const { textDark, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        chart: {
          flex: 1,
          height: 374,
          paddingBottom: 24,
          paddingTop: 59,
        },
        legend: {
          display: "flex",
          paddingLeft: 24,
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
        tooltipContainer: {
          backgroundColor: "yellow",
          border: `solid 2px ${borderPrimary} !important`,
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
    [textDark, borderPrimary],
  );
};
