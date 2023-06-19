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
import Skeleton from "@core/components/Skeleton";
import { useDeciderKey } from "@core/stores/ExperimentStore";

type PerformanceMetricsProps = BaseProps & {
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

type MetricType = keyof typeof metricsDataMap;

const MetricLinkByType: { readonly [T in MetricType]: string } = {
  userRating: "/performance/wish-standards/user-rating",
  orderFultillmentRate: "/performance/wish-standards/fulfillment-rate",
  validTrackingRate: "/performance/wish-standards/valid-tracking",
  productQualityRefundRate: "/performance/wish-standards/quality-refund",
  productLogisticsRefundRate: "/performance/wish-standards/logistics-refund",
  fulfillmentSpeed: "/performance/wish-standards/fulfillment-speed",
  underperformingProducts:
    "/performance/wish-standards/underperforming-products",
};

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = (props) => {
  const { className, style, wssDetails } = props;
  const stats = wssDetails?.stats;
  const endDateMetricsWindow =
    wssDetails?.endDateForLastMonthlyUpdateCalcWindow;

  const { primary } = useTheme();
  const styles = useStylesheet();
  const learnMore = zendeskURL("4409934726683");

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
      <PerformanceMetricsBody wssDetails={wssDetails} />
    </WssSection>
  );
};

const PerformanceMetricsBody: React.FC<
  Pick<PerformanceMetricsProps, "wssDetails">
> = ({ wssDetails }) => {
  const stats = wssDetails?.stats;
  const monthlyUpdateStats = wssDetails?.monthlyUpdateStats;

  const trendIcon = useTrendIcon();
  const { isVerySmallScreen } = useDeviceStore();
  const styles = useStylesheet();

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

  const {
    decision: wss2p0InTransitionState,
    isLoading: wss2p0InTransitionStateLoading,
  } = useDeciderKey("wss_2_0_transition_state");
  const {
    decision: wss2p0InPostTransitionState,
    isLoading: wss2p0InPostTransitionStateLoading,
  } = useDeciderKey("wss_2_0_post_transition_state");

  if (wss2p0InTransitionStateLoading || wss2p0InPostTransitionStateLoading) {
    return <Skeleton height={434} />;
  }

  return (
    <Layout.GridRow
      style={styles.body}
      templateColumns="repeat(3, 1fr)"
      smallScreenTemplateColumns={isVerySmallScreen ? "1fr" : "1fr 1fr"}
    >
      {!wss2p0InPostTransitionState ? (
        <>
          <PerformanceMetricsCardV2
            title={i`Average user rating`}
            info={i`Average of product ratings on your orders`}
            {...getCardProps("userRating")}
          />
          <PerformanceMetricsCardV2
            title={i`Order fulfillment rate`}
            info={i`Share of orders successfully fulfilled`}
            {...getCardProps("orderFultillmentRate")}
          />
          <PerformanceMetricsCardV2
            title={i`Product quality refund`}
            info={i`Share of orders refunded due to product quality`}
            {...getCardProps("productQualityRefundRate")}
          />
          <PerformanceMetricsCardV2
            title={i`Confirmed fulfillment speed`}
            info={i`Average time for an order to be confirmed fulfilled`}
            {...getCardProps("fulfillmentSpeed")}
          />
          <PerformanceMetricsCardV2
            title={i`Valid tracking rate`}
            info={i`Share of 'marked shipped' orders that are 'confirmed shipped'`}
            {...getCardProps("validTrackingRate")}
          />
          <PerformanceMetricsCardV2
            title={i`Logistics refund`}
            info={i`Share of orders refunded due to fulfillment related reasons`}
            {...getCardProps("productLogisticsRefundRate")}
          />
          {wss2p0InTransitionState && (
            <PerformanceMetricsCardV2
              title={i`Underperforming products`}
              info={i`Share of products in the last 90 days with high product quality refunds and low ratings`}
              {...getCardProps("underperformingProducts")}
              isNew
              showDelayedImpactBanner
            />
          )}
        </>
      ) : (
        <>
          <PerformanceMetricsCardV2
            title={i`Underperforming products`}
            info={i`Share of products in the last 90 days with high product quality refunds and low ratings`}
            {...getCardProps("underperformingProducts")}
            isNew
          />
          <PerformanceMetricsCardV2
            title={i`Product quality refund`}
            info={i`Share of orders refunded due to product quality`}
            {...getCardProps("productQualityRefundRate")}
          />
          <PerformanceMetricsCardV2
            title={i`Confirmed fulfillment speed`}
            info={i`Average time for an order to be confirmed fulfilled`}
            {...getCardProps("fulfillmentSpeed")}
          />
          <PerformanceMetricsCardV2
            title={i`Order fulfillment rate`}
            info={i`Share of orders successfully fulfilled`}
            {...getCardProps("orderFultillmentRate")}
          />
          <PerformanceMetricsCardV2
            title={i`Average user rating`}
            info={i`Average of product ratings on your orders`}
            {...getCardProps("userRating")}
          />
          <PerformanceMetricsCardV2
            title={i`Logistics refund`}
            info={i`Share of orders refunded due to fulfillment related reasons`}
            {...getCardProps("productLogisticsRefundRate")}
          />
        </>
      )}
    </Layout.GridRow>
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
