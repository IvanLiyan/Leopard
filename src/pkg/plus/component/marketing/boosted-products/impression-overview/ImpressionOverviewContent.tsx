import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import { TooltipPayload } from "recharts";

import {
  H5,
  Line,
  XAxis,
  LineChart,
  RechartsTooltip,
} from "@ContextLogic/lego";

import { ImpressionOverviewStatsResponseType } from "@toolkit/marketing/boosted-products";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightMedium } from "@toolkit/fonts";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PickedImpressionStats } from "@toolkit/marketing/boosted-products";

type Props = BaseProps & {
  readonly data: ImpressionOverviewStatsResponseType;
};

const ImpressionOverviewContent: React.FC<Props> = (props: Props) => {
  const { className, style, data } = props;
  const styles = useStylesheet();

  const {
    marketing: {
      impressionStats: { totalImpressions, impressionDailyStats },
    },
  } = data;

  const { primary } = useTheme();
  const ticks = useTicks(impressionDailyStats);

  if (impressionDailyStats.length == 0) {
    return (
      <div className={css(styles.loading, className, style)}>No data yet</div>
    );
  }

  return (
    <div className={css(styles.root, className, style)}>
      <H5 className={css(styles.totalImpressions)}>
        {numeral(totalImpressions).format("0,0").toString()}
      </H5>

      <div className={css(styles.chart)}>
        <LineChart data={impressionDailyStats}>
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
              entry: TooltipPayload,
            ) => {
              return (
                <div className={css(styles.tooltipContainer)}>
                  <div className={css(styles.tooltipTitle)}>
                    {entry.payload.date.formatted}
                  </div>
                  <table>
                    <tr>
                      <td className={css(styles.tooltipLabel)}>Impressions</td>
                      <td className={css(styles.tooltipValue)}>
                        {numeral(value).format("0,0").toString()}
                      </td>
                    </tr>
                  </table>
                </div>
              );
            }}
          />
          <Line
            yAxisId="left"
            dataKey="impressions"
            strokeWidth={1}
            stroke={primary}
            dot={false}
            activeDot
          />
        </LineChart>
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
        },
        totalImpressions: {
          margin: "10px 0px",
          fontSize: 16,
        },
        chart: {
          flex: 1,
          height: 100,
        },
        loading: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
    [textBlack, textDark],
  );
};

const NUM_DATA_POINTS = 7;
const useTicks = (
  stats: ReadonlyArray<PickedImpressionStats>,
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

export default observer(ImpressionOverviewContent);
