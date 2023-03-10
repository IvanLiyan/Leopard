import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import hash from "object-hash";
import { H5, Card } from "@ContextLogic/lego";
/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "src/app/core/stores/ThemeStore";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type LineProps = {
  readonly name: string;
  readonly dataKey: string;
  readonly stroke: string;
  readonly strokeDasharray?: string;
  readonly unit?: string;
};

type LegendData = {
  readonly totalStat: string;
  readonly tooltip?: string;
  readonly currencyCode?: string;
};

type Props<dataType> = BaseProps & {
  readonly graphData?: Array<dataType>;
  readonly lineProps: ReadonlyArray<LineProps>;
  readonly legendData?: ReadonlyArray<LegendData>;
  readonly dataRange?: [number, number];
};

const StoreChart = <dataType,>(props: Props<dataType>) => {
  const { className, style, graphData, lineProps, dataRange } = props;
  const styles = useStylesheet();
  const tooltipFormatter = (props: TooltipProps<ValueType, NameType>) => {
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

  const CustomizedAxisTick: React.ComponentProps<typeof XAxis>["tick"] = (
    props,
  ) => {
    const { x, y, payload } = props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={32} y={0} dy={20} textAnchor="end" fill="#666" fontSize={12}>
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomizedYxisTick: React.ComponentProps<typeof YAxis>["tick"] = (
    props,
  ) => {
    const { x, y, payload } = props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-4} y={-16} dy={20} textAnchor="end" fill="#666" fontSize={12}>
          {payload.value}
        </text>
      </g>
    );
  };

  const { textDark } = useTheme();
  return (
    <div className={css(styles.chart, className, style)}>
      <ResponsiveContainer>
        <LineChart data={graphData}>
          <CartesianGrid vertical={false} strokeDasharray="4" horizontal />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ top: -30, width: "auto" }}
          />
          <Tooltip content={tooltipFormatter} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            height={60}
            tick={CustomizedAxisTick}
          />
          <YAxis
            yAxisId="left"
            dataKey={lineProps[0].dataKey}
            stroke={textDark}
            tickCount={11}
            domain={dataRange || ["dataMin", "dataMax"]}
            type="number"
            axisLine={false}
            tickLine={false}
            tick={CustomizedYxisTick}
          />
          {lineProps.map((lineProp) => (
            <Line
              yAxisId="left"
              key={lineProp.name}
              strokeWidth={3}
              {...lineProp}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
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
