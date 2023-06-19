import { Layout } from "@ContextLogic/lego";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  TooltipProps as RechartsTooltipProps,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  Alert,
  AlertProps,
  AlertTitle,
  AlertTitleProps,
  Card,
  Text,
} from "@ContextLogic/atlas-ui";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import Illustration, { IllustrationName } from "@core/components/Illustration";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useTheme } from "@core/stores/ThemeStore";
import {
  nameOf,
  TimelineDatapoint,
} from "@performance/migrated/toolkit/order-metrics";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { ReactNode, useMemo } from "react";

const MetricHeaderSection: React.FC<MetricHeaderProps> = (props) => {
  return (
    <Layout.FlexColumn style={{ gap: 24 }}>
      <MetricHeader {...props} />
      <MetricLineChart {...props} />
    </Layout.FlexColumn>
  );
};
export type MetricHeaderProps = BaseProps & {
  readonly formatter: (metric: number) => string;
  readonly compare: (lhs: number, rhs: number) => number;
  readonly higherIsBetter: boolean;
  readonly header: {
    readonly value: string;
    readonly illustration: IllustrationName;
    readonly subtitle: () => ReactNode;
    readonly bannerHeader?: AlertTitleProps["title"];
    readonly bannerText?: AlertProps["children"];
    readonly bannerSentiment?: AlertProps["severity"];
  };
  readonly chart: {
    readonly data: ReadonlyArray<TimelineDatapoint>;
    readonly lastUpdated: Pick<TimelineDatapoint, "value">;
    readonly goal: Pick<TimelineDatapoint, "value">;
  };
};

const MetricHeader: React.FC<MetricHeaderProps> = ({ header }) => {
  const styles = useStylesheet();

  const { bannerHeader, bannerText, bannerSentiment } = header;

  return (
    <Layout.FlexColumn>
      <Layout.FlexColumn>
        <Layout.FlexRow>
          <Text fontSize={"60px"} fontWeight={"bold"} lineHeight={"60px"}>
            {header.value}
          </Text>
          <Illustration
            style={styles.badge}
            name={header.illustration}
            alt={header.illustration}
          />
        </Layout.FlexRow>
        {header.subtitle()}
        {bannerText != null && (
          <Alert
            sx={{
              margin: "24px 0px",
            }}
            severity={bannerSentiment ?? "info"}
          >
            <AlertTitle>{bannerHeader}</AlertTitle>
            {bannerText}
          </Alert>
        )}
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const MetricLineChart: React.FC<MetricHeaderProps> = ({
  higherIsBetter,
  formatter,
  compare,
  chart,
}) => {
  const styles = useStylesheet();
  const { positiveDark, vermillion, primary } = useTheme();
  const { locale } = useLocalizationStore();

  if (chart.data.length == 0) {
    return null;
  }

  const todayDatapoint = chart.data[chart.data.length - 1];

  const lineStrokeColor = () => {
    if (chart.lastUpdated.value == null || todayDatapoint.value == null) {
      return primary;
    }

    const result = compare(todayDatapoint.value, chart.lastUpdated.value);
    if (result == 0) {
      return primary;
    }
    if (result > 0) {
      return positiveDark;
    }
    return vermillion;
  };

  const tooltipFormatter = (
    props: RechartsTooltipProps<ValueType, NameType>,
  ) => {
    const {
      payload,
    }: {
      readonly payload?: ReadonlyArray<{
        readonly payload?: TimelineDatapoint;
      }>;
    } = props;

    if (!payload?.length || payload[0].payload?.value == null) {
      return null;
    }

    const formattedDate = new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(payload[0].payload.millisecond));

    const formattedMetric = formatter(payload[0].payload.value);
    const fromDate = payload[0].payload.calculatedFrom;
    const toDate = payload[0].payload.calculatedTo;
    const formattedDescription =
      fromDate && toDate
        ? i`Wish calculated this value using data from ${fromDate} - ${toDate}`
        : undefined;

    return (
      <Card
        sx={{
          width: "250px",
          padding: "8px 16px",
        }}
      >
        <Text component="div" variant="bodySStrong">
          {formattedDate}
        </Text>
        <Text
          component="div"
          fontWeight="bold"
          fontSize="34px"
          lineHeight="40px"
        >
          {formattedMetric}
        </Text>
        {formattedDescription && (
          <Text component="div" variant="bodyS">
            {formattedDescription}
          </Text>
        )}
      </Card>
    );
  };

  return (
    <Layout.FlexColumn style={styles.chartContainer}>
      <ResponsiveContainer>
        <LineChart data={[...chart.data]}>
          <CartesianGrid vertical={false} strokeDasharray="4 3" horizontal />
          <RechartsTooltip content={tooltipFormatter} />
          <XAxis
            dataKey={nameOf<TimelineDatapoint>("millisecond")}
            tickFormatter={(tick: TimelineDatapoint["millisecond"]) => {
              if (tick == chart.data[chart.data.length - 1].millisecond) {
                return ci18n("XAxis label meaning today's date", "Today");
              }
              return new Intl.DateTimeFormat(locale, {
                month: "short",
                day: "numeric",
              }).format(new Date(tick));
            }}
            strokeWidth={0}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            reversed={!higherIsBetter}
            width={200}
            dataKey={nameOf<TimelineDatapoint>("value")}
            yAxisId={nameOf<TimelineDatapoint>("value")}
            ticks={[chart.goal.value, chart.lastUpdated.value]}
            tickCount={6}
            interval={0}
            tickFormatter={(tick: number) => {
              const formattedMetricValue = formatter(tick);
              if (tick == chart.lastUpdated.value) {
                return ci18n(
                  "The value of the WSS metric that was calculated during last tier update",
                  "Last update: {%1=formattedMetricValue}",
                  formattedMetricValue,
                );
              } else if (tick == chart.goal.value) {
                return ci18n(
                  "The minimum required value of the WSS metric to advance to next tier",
                  "Goal: {%1=formattedMetricValue}",
                  formattedMetricValue,
                );
              }
              return "";
            }}
            domain={[
              (dataMin: number) =>
                Math.min(
                  chart.goal.value ?? dataMin,
                  chart.lastUpdated.value ?? dataMin,
                  dataMin,
                ),
              (dataMax: number) =>
                Math.max(
                  chart.goal.value ?? dataMax,
                  chart.lastUpdated.value ?? dataMax,
                  dataMax,
                ),
            ]}
            type="number"
            strokeWidth={0}
            style={{ fontSize: "12px" }}
          />
          <Line
            yAxisId="value"
            dataKey="value"
            strokeWidth={2}
            stroke={lineStrokeColor()}
          />
        </LineChart>
      </ResponsiveContainer>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        badge: {
          marginLeft: 8,
          height: 36,
          width: 36,
        },
        chartContainer: {
          height: 157,
        },
      }),
    [],
  );
};

export default observer(MetricHeaderSection);
