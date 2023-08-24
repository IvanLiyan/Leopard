/* eslint-disable react/forbid-dom-props */
import { H6, Layout, Text } from "@ContextLogic/lego";
import { Line, LineChart, XAxis, ResponsiveContainer } from "recharts";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import Illustration from "@core/components/Illustration";
import { useTheme } from "@core/stores/ThemeStore";
import { MetricScaleDisplayedTiers } from "@performance/migrated/toolkit/order-metrics";
import { ScoreData, useTierThemes } from "@performance/migrated/toolkit/stats";
import { css } from "@core/toolkit/styling";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type ScaleDatapoint = {
  readonly x: number;
} & Partial<{
  readonly [k in typeof MetricScaleDisplayedTiers[number]]: number;
}>;

type Props = BaseProps & {
  readonly getScoreData: (score: number | null) => ScoreData;
  readonly ticks: readonly [number, number, number, number, number, number];
  readonly currentValue: number | null;
  readonly compare: (lhs: number, rhs: number) => number;
  readonly higherIsBetter: boolean;
  readonly formatter: (metric: number) => string;
};

type ChartProps = {
  readonly payload: { readonly value: number };
  readonly x: number;
  readonly y: number;
  readonly dy: number;
};

const PerformanceScale: React.FC<Props> = ({
  style,
  className,
  getScoreData,
  ticks,
  currentValue,
  compare,
  higherIsBetter,
  formatter,
}) => {
  const styles = useStylesheet();
  const tierThemes = useTierThemes();

  const bestTick = ticks.reduce<number>(
    (prev, cur) => (compare(prev, cur) >= 0 ? prev : cur),
    ticks[0],
  );

  const worstTick = ticks.reduce<number>(
    (prev, cur) => (compare(prev, cur) >= 0 ? cur : prev),
    ticks[0],
  );

  const clampedCurrentValue = useMemo(() => {
    if (currentValue == null) {
      return null;
    }
    const thresholds = ticks.slice(1);
    const atRiskTick = thresholds.reduce<number>(
      (prev, cur) => (compare(prev, cur) >= 0 ? cur : prev),
      thresholds[0],
    );
    if (compare(currentValue, bestTick) >= 0) {
      return bestTick;
    }
    if (compare(currentValue, atRiskTick) >= 0) {
      return currentValue;
    }
    return (worstTick + atRiskTick) / 2.0;
  }, [bestTick, compare, currentValue, ticks, worstTick]);

  const chartData: ReadonlyArray<ScaleDatapoint> = [
    ...ticks.slice(1).reduce<ReadonlyArray<ScaleDatapoint>>(
      // disabled because calculating data points to draw performance scale line
      // eslint-disable-next-line local-rules/no-large-method-params
      (prev, tick, index) => {
        return [
          ...prev,
          {
            x: ticks[index],
            [MetricScaleDisplayedTiers[index]]: 0,
          },
          {
            x: tick,
            [MetricScaleDisplayedTiers[index]]: 0,
          },
        ];
      },
      [],
    ),
  ];

  const atRiskTickLabel = (props: {
    readonly payload: { readonly value: number };
    readonly x: number;
    readonly y: number;
    readonly dy: number;
  }) => {
    const scoreData = getScoreData(props.payload.value);

    return (
      <foreignObject
        x={props.x}
        y={props.y}
        style={{ width: 100, height: 100 }}
      >
        <Layout.FlexRow>
          <Illustration
            style={styles.tickBadge}
            name={tierThemes(scoreData.currentLevel).icon}
            alt={tierThemes(scoreData.currentLevel).icon}
          />
          <H6>
            {ci18n(
              "Means merchant's WSS metric score is below the lowest threshold",
              "At Risk",
            )}
          </H6>
        </Layout.FlexRow>
      </foreignObject>
    );
  };

  const normalTickLabel = (props: {
    readonly payload: { readonly value: number };
    readonly x: number;
    readonly y: number;
    readonly dy: number;
  }) => {
    const scoreData = getScoreData(props.payload.value);
    return (
      <foreignObject
        x={props.x}
        y={props.y}
        style={{ width: 100, height: 100, overflow: "visible" }}
      >
        <Layout.FlexRow>
          <Illustration
            style={[styles.tickBadge, styles.nudge]}
            name={tierThemes(scoreData.currentLevel).icon}
            alt={tierThemes(scoreData.currentLevel).icon}
          />
          <Text style={styles.tickText}>{formatter(props.payload.value)}</Text>
        </Layout.FlexRow>
      </foreignObject>
    );
  };

  const currentScoreTickLabel = (props: ChartProps) => {
    const scoreData = getScoreData(currentValue);
    return (
      <foreignObject
        x={props.x}
        y={props.y - 5 * props.dy}
        style={{ width: 100, height: 100, overflow: "visible" }}
      >
        <Layout.FlexRow>
          <Layout.FlexColumn>
            <Layout.FlexRow>
              <Illustration
                style={[styles.tickBadge, styles.nudge]}
                name={tierThemes(scoreData.currentLevel).icon}
                alt={tierThemes(scoreData.currentLevel).icon}
              />
              <Text style={styles.currentValueTickText} weight="semibold">
                {scoreData.currentScoreDisplay}
              </Text>
            </Layout.FlexRow>
            <Layout.GridRow
              templateColumns={"auto 1px auto"}
              smallScreenTemplateColumns={"auto 1px auto"}
            >
              <div className={css(styles.tickLine)} />
              <div />
              <div />
            </Layout.GridRow>
          </Layout.FlexColumn>
        </Layout.FlexRow>
      </foreignObject>
    );
  };

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <ResponsiveContainer>
        <LineChart
          data={[...chartData]}
          margin={{ left: 20, right: 100, top: 10, bottom: 10 }}
        >
          {MetricScaleDisplayedTiers.map((level) => (
            <Line
              key={level}
              id={level}
              dataKey={level}
              stroke={tierThemes(level).scale}
              dot={false}
              strokeWidth={4}
            />
          ))}
          <XAxis
            reversed={!higherIsBetter}
            height={80}
            dataKey="x"
            type="number"
            ticks={
              clampedCurrentValue != null
                ? ([...ticks, clampedCurrentValue] as Array<number>)
                : (ticks as unknown as Array<number>)
            }
            domain={[Math.min(...ticks), Math.max(...ticks)]}
            interval={0}
            tick={(props: ChartProps) => {
              return (
                <>
                  {props.payload.value === clampedCurrentValue &&
                    currentScoreTickLabel(props)}
                  {props.payload.value === worstTick && atRiskTickLabel(props)}
                  {props.payload.value !== worstTick &&
                    props.payload.value !== bestTick &&
                    ticks.includes(props.payload.value) &&
                    normalTickLabel(props)}
                </>
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: 160,
        },
        tickText: {
          fontSize: 16,
        },
        currentValueTickText: {
          fontSize: 24,
        },
        tickLine: {
          backgroundColor: textDark,
          width: 1,
          height: 20,
        },
        tickBadge: {
          height: 20,
          width: 20,
        },
        nudge: {
          marginLeft: -10,
        },
      }),
    [textDark],
  );
};

export default observer(PerformanceScale);
