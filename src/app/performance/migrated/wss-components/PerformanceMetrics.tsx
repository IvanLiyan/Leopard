import { Layout, Markdown, Popover, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Icon from "@core/components/Icon";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useTheme } from "@core/stores/ThemeStore";
import { formatDatetimeLocalized } from "@core/toolkit/datetime";
import {
  metricsDataMap,
  PickedMerchantWssDetails,
  statsComparator,
  WSS_MISSING_SCORE_INDICATOR,
} from "@performance/migrated/toolkit/stats";
import { useTrendIcon } from "@performance/migrated/toolkit/themes";
import { zendeskURL } from "@core/toolkit/url";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";
import React, { useMemo } from "react";
import PerformanceMetricsCardV2, {
  PerformanceMetricsCardPropsV2,
} from "./PerformanceMetricsCardV2";
import WssSection from "./WssSection";

type PerformanceMetricsProps = BaseProps & {
  readonly wssDetails?: PickedMerchantWssDetails | null;
  readonly wssInsights?: boolean | null;
};

type MetricType = keyof typeof metricsDataMap;

const MetricLinkByType: { readonly [T in MetricType]: string } = {
  userRating: "/performance/wish-standards/user-rating",
  orderFultillmentRate: "/performance/wish-standards/fulfillment-rate",
  validTrackingRate: "/performance/wish-standards/valid-tracking",
  productQualityRefundRate: "/performance/wish-standards/quality-refund",
  productLogisticsRefundRate: "/performance/wish-standards/logistics-refund",
  fulfillmentSpeed: "/performance/wish-standards/fulfillment-speed",
};

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = (props) => {
  const { className, style, wssDetails, wssInsights } = props;
  const stats = wssDetails?.stats;
  const monthlyUpdateStats = wssDetails?.monthlyUpdateStats;
  const endDateMetricsWindow =
    wssDetails?.endDateForLastMonthlyUpdateCalcWindow;

  const { primary } = useTheme();
  const trendIcon = useTrendIcon();
  const { isVerySmallScreen } = useDeviceStore();
  const styles = useStylesheet();
  const learnMore = zendeskURL("4409934726683");

  const getCardProps = (
    metricName: MetricType,
  ): Omit<PerformanceMetricsCardPropsV2, "icon" | "title" | "info"> => {
    const currentData = metricsDataMap[metricName](stats);
    const lastUpdateData = metricsDataMap[metricName](monthlyUpdateStats);
    const compareResult =
      currentData.currentScoreDisplay == null ||
      lastUpdateData.currentScoreDisplay == null
        ? 0
        : statsComparator[metricName](
            currentData.currentScoreDisplay.replaceAll("<", ""),
            lastUpdateData.currentScoreDisplay.replaceAll("<", ""),
          );

    const delta = metricsDataMap[metricName]({
      ...stats,
      [metricName]: compareResult,
      fulfillmentSpeed: {
        days: compareResult,
      },
    });
    const icon = trendIcon(compareResult);

    return {
      href:
        currentData.currentScoreDisplay == null
          ? undefined
          : MetricLinkByType[metricName],
      compareIcon: () =>
        icon.name && (
          <Icon
            style={styles.icon}
            name={icon.name}
            color={icon.color}
            size={24}
          />
        ),
      deltaText: () =>
        (icon.name == "arrowUp" || icon.name == "arrowDown") && (
          <Text style={{ color: icon.color }}>{delta.currentScoreDisplay}</Text>
        ),
      stats: {
        today: {
          level: currentData.currentLevel ?? "UNASSESSED",
          display:
            currentData.currentScoreDisplay ?? WSS_MISSING_SCORE_INDICATOR,
        },
        lastUpdated: {
          level: lastUpdateData.currentLevel ?? "UNASSESSED",
          display:
            lastUpdateData.currentScoreDisplay ?? WSS_MISSING_SCORE_INDICATOR,
        },
        goal: {
          level: lastUpdateData.goalLevel || "PERFECT",
          display: lastUpdateData.goalScoreDisplay,
        },
      },
    };
  };

  const todayMetricsPopover = stats
    ? `${formatDatetimeLocalized(
        moment.unix(stats.date.unix).subtract(90, "days"),
        "LL",
      )} - ${formatDatetimeLocalized(moment.unix(stats.date.unix), "LL")}`
    : "-";

  const lastUpdateMetricsPopever = endDateMetricsWindow
    ? `${formatDatetimeLocalized(
        moment.unix(endDateMetricsWindow.unix).subtract(90, "days"),
        "LL",
      )} - ${formatDatetimeLocalized(
        moment.unix(endDateMetricsWindow.unix),
        "LL",
      )}`
    : "-";

  return (
    <WssSection
      style={[className, style]}
      title={i`Performance Metrics`}
      subtitle={() => (
        <>
          <Layout.FlexRow>
            <Markdown
              style={styles.subtitleText}
              text={i`Wish calculates your metrics for **Today** on a ${90}-day rolling basis.`}
            />
            <Popover popoverContent={todayMetricsPopover}>
              <Icon
                style={styles.calendarIcon}
                name="calendar"
                size={20}
                color={primary}
              />
            </Popover>
          </Layout.FlexRow>
          <Layout.FlexRow>
            <Markdown
              style={styles.subtitleText}
              text={i`Wish also calculates your metrics for your **Last update** on a ${90}-day basis.`}
            />
            <Popover popoverContent={lastUpdateMetricsPopever}>
              <Icon
                style={styles.calendarIcon}
                name="calendar"
                size={20}
                color={primary}
              />
            </Popover>
            <Markdown
              style={styles.subtitleText}
              text={i`[Learn more](${learnMore})`}
              openLinksInNewTab
            />
          </Layout.FlexRow>
        </>
      )}
    >
      <Layout.GridRow
        style={styles.body}
        templateColumns="repeat(3, 1fr)"
        smallScreenTemplateColumns={isVerySmallScreen ? "1fr" : "1fr 1fr"}
      >
        <PerformanceMetricsCardV2
          icon={wssInsights ? undefined : "halfStar"}
          title={i`Average user rating`}
          info={i`Average of product ratings on your orders`}
          {...getCardProps("userRating")}
        />
        <PerformanceMetricsCardV2
          icon={wssInsights ? undefined : "truck"}
          title={i`Order fulfillment rate`}
          info={i`Share of orders successfully fulfilled`}
          {...getCardProps("orderFultillmentRate")}
        />
        <PerformanceMetricsCardV2
          icon={wssInsights ? undefined : "return"}
          title={i`Product quality refund`}
          info={i`Share of orders refunded due to product quality`}
          {...getCardProps("productQualityRefundRate")}
        />
        <PerformanceMetricsCardV2
          icon={wssInsights ? undefined : "airplane"}
          title={i`Confirmed fulfillment speed`}
          info={i`Average time for an order to be confirmed fulfilled`}
          {...getCardProps("fulfillmentSpeed")}
        />
        <PerformanceMetricsCardV2
          icon={wssInsights ? undefined : "barcode"}
          title={i`Valid tracking rate`}
          info={i`Share of 'marked shipped' orders that are 'confirmed shipped'`}
          {...getCardProps("validTrackingRate")}
        />
        <PerformanceMetricsCardV2
          icon={wssInsights ? undefined : "ship"}
          title={i`Logistics refund`}
          info={i`Share of orders refunded due to fulfillment related reasons`}
          {...getCardProps("productLogisticsRefundRate")}
        />
      </Layout.GridRow>
    </WssSection>
  );
};

export default observer(PerformanceMetrics);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        subtitleText: {
          fontSize: 14,
        },
        calendarIcon: {
          margin: "0px 4px 0px 4px",
        },
        body: {
          gap: 16,
          flexWrap: "wrap",
        },
        icon: {
          marginLeft: 4,
        },
      }),
    [],
  );
};
