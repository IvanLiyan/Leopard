/*
 * VideoPerformanceSection.tsx
 *
 * Created by Jonah Dlin on Tue Mar 15 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";
import numeral from "numeral";

/* Lego Components */
import {
  Layout,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  RechartsTooltip,
  RechartsTooltipProps,
  Text,
  Card,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  formatVideoPerformanceMetric,
  PickedVideoPerformanceDailyStats,
  VideoPerformanceMetricType,
} from "@toolkit/wish-clips/video-management";
import { formatDatetimeLocalized } from "@toolkit/datetime";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly data: ReadonlyArray<PickedVideoPerformanceDailyStats>;
  readonly metric: VideoPerformanceMetricType;
};

const MetricTypeName: { readonly [T in VideoPerformanceMetricType]: string } = {
  VIEWS: i`Views`,
  LIKES: i`Likes`,
  WATCH_TIME: i`Watch Time`,
};

const VideoPerformanceSection: React.FC<Props> = ({
  className,
  style,
  metric,
  data,
}) => {
  const styles = useStylesheet();

  const { primary, surfaceDarker } = useTheme();

  const graphData = useMemo(
    () =>
      data.map((row) => {
        const dateTick = formatDatetimeLocalized(
          moment.unix(row.date.unix),
          "M/D"
        );
        const fullDate = formatDatetimeLocalized(
          moment.unix(row.date.unix),
          "dddd M/DD/YYYY"
        );

        if (metric == "LIKES") {
          return {
            dateTick,
            fullDate,
            metric: row.likes,
          };
        }
        if (metric == "VIEWS") {
          return {
            dateTick,
            fullDate,
            metric: row.views,
          };
        }

        return {
          dateTick,
          fullDate,
          metric: row.watchTime,
        };
      }),
    [data, metric]
  );

  // Disabled to satisfy recharts API
  // eslint-disable-next-line local-rules/no-large-method-params
  const tooltipFormatter = (props: RechartsTooltipProps) => {
    const { payload } = props;

    if (payload == null || payload.length === 0) {
      return null;
    }

    const fullDate: string = payload[0].payload.fullDate;
    const amount: number = payload[0].payload.metric;

    const metricFormatted = formatVideoPerformanceMetric({
      amount,
      metric,
    });

    return (
      <Card style={styles.tooltip}>
        <Layout.FlexColumn>
          <Text style={styles.tooltipDate} weight="semibold">
            {fullDate}
          </Text>
          <Text style={styles.tooltipMetricName}>{MetricTypeName[metric]}</Text>
          <Text style={styles.tooltipMetricAmount} weight="semibold">
            {metricFormatted}
          </Text>
        </Layout.FlexColumn>
      </Card>
    );
  };

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <LineChart data={graphData}>
        <CartesianGrid vertical={false} strokeDasharray="2" horizontal />
        <RechartsTooltip
          imageFormatter={() => null}
          content={tooltipFormatter}
        />
        <XAxis dataKey="dateTick" />
        <YAxis
          yAxisId="metric"
          dataKey="metric"
          stroke={surfaceDarker}
          orientation="left"
          tickCount={6}
          tickFormatter={(value: number) => numeral(value).format("0,0")}
          domain={["dataMin", "dataMax"]}
          type="number"
          allowDecimals={false}
        />
        <Line
          yAxisId="metric"
          dataKey="metric"
          strokeWidth={2}
          stroke={primary}
        />
      </LineChart>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: 256,
        },
        tooltip: {
          padding: 24,
        },
        tooltipDate: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        tooltipMetricName: {
          marginTop: 16,
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        tooltipMetricAmount: {
          fontSize: 24,
          lineHeight: "28px",
          color: textBlack,
        },
      }),
    [textDark, textBlack]
  );
};

export default observer(VideoPerformanceSection);
