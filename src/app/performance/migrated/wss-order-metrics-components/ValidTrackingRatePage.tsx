import { Layout, Markdown, Text } from "@ContextLogic/lego";
import { Icon } from "@ContextLogic/zeus";
import { ci18n } from "@core/toolkit/i18n";
import Illustration from "@core/components/Illustration";
import MetricHeaderSection, { MetricHeaderProps } from "./MetricHeaderSection";
import PerformanceScale from "./PerformanceScale";
import PerformanceScaleSection from "./PerformanceScaleSection";
import ValidTrackingRateTable from "./ValidTrackingRateTable";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useTheme } from "@core/stores/ThemeStore";
import {
  formatDateWindow,
  RecentStatsDayCount,
  TimelineDatapoint,
  ValidTrackRatingTicks,
  WSSDeepDiveQuery,
  WSSDeepDiveQueryRequest,
  WSSDeepDiveQueryResponse,
} from "@performance/migrated/toolkit/order-metrics";
import {
  metricsDataMap,
  statsComparator,
  useTierThemes,
  WSS_MISSING_SCORE_INDICATOR,
} from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Skeleton from "@core/components/Skeleton";
import { Card } from "@ContextLogic/atlas-ui";

const ValidTrackingRatePage: React.FC = () => {
  const styles = useStylesheet();
  const tierThemes = useTierThemes();
  const { locale } = useLocalizationStore();

  const formatter = (metric: number) =>
    metricsDataMap.validTrackingRate({ validTrackingRate: metric })
      .currentScoreDisplay ?? WSS_MISSING_SCORE_INDICATOR;
  const compareFn = (lhs: number, rhs: number) =>
    statsComparator.validTrackingRate(lhs.toString(), rhs.toString());

  const { data: queryData, loading } = useQuery<
    WSSDeepDiveQueryResponse,
    WSSDeepDiveQueryRequest
  >(WSSDeepDiveQuery, {
    variables: {
      days: RecentStatsDayCount,
    },
    fetchPolicy: "no-cache",
  });

  const data = queryData?.currentMerchant?.wishSellerStandard;
  const todayData = data?.stats;
  const lastUpdateData = data?.monthlyUpdateStats;
  const imperfectDataCount = data?.deepDive?.orderInvalidTracking.totalCount;

  const [formattedStartDate, formattedEndDate] = formatDateWindow(
    todayData?.date.unix,
    locale,
  );

  const todayScoreData = metricsDataMap.validTrackingRate(todayData);
  const lastUpdatedScoreData = metricsDataMap.validTrackingRate(lastUpdateData);

  const chartData: ReadonlyArray<TimelineDatapoint> =
    data?.recentStats
      ?.reduce<ReadonlyArray<TimelineDatapoint>>((prev, stat) => {
        if (stat.validTrackingRate == null) {
          return [...prev];
        }
        const scoreData = metricsDataMap.validTrackingRate(stat);
        const [calculatedFrom, calculatedTo] = formatDateWindow(
          stat.date.unix,
          locale,
        );
        return [
          ...prev,
          {
            millisecond: stat.date.unix * 1000,
            value: numeral(scoreData.currentScoreDisplay).value(),
            calculatedFrom,
            calculatedTo,
          },
        ];
      }, [])
      .slice()
      .sort((lhs, rhs) => lhs.millisecond - rhs.millisecond) || [];

  const getBannerProps = (): Pick<
    MetricHeaderProps["header"],
    "bannerHeader" | "bannerSentiment" | "bannerText"
  > => {
    if (todayScoreData.currentScoreDisplay == null) {
      return {
        bannerHeader: i`More data needed`,
        bannerSentiment: "info",
        bannerText: (
          <Markdown
            text={i`You don't have enough orders in the past ${90} days to calculate your **Valid Tracking Rate**`}
          />
        ),
      };
    }

    if (imperfectDataCount == 0 && todayScoreData.goalLevel == null) {
      return {
        bannerHeader: ci18n(
          "Text congratulating on perfect score",
          "Congratulations!",
        ),
        bannerSentiment: "success",
        bannerText: (
          <Markdown
            text={
              i`You've achieved the best **Valid Tracking Rate** for ` +
              i`Wish Standards. Keep up the good work!`
            }
          />
        ),
      };
    }

    return {};
  };

  if (loading) {
    return <Skeleton height={720} />;
  }

  if (!data) {
    return null;
  }

  return (
    <Card sx={{ padding: "20px 24px 24px 24px" }}>
      <MetricHeaderSection
        formatter={formatter}
        compare={compareFn}
        higherIsBetter
        chart={{
          data: chartData,
          goal: {
            value: numeral(todayScoreData.goalScoreDisplay).value(),
          },
          lastUpdated: {
            value: numeral(lastUpdatedScoreData.currentScoreDisplay).value(),
          },
        }}
        header={{
          value:
            todayScoreData.currentScoreDisplay ?? WSS_MISSING_SCORE_INDICATOR,
          illustration: tierThemes(todayScoreData.currentLevel).icon,
          subtitle: () => {
            const maturedOrderCount =
              data.deepDive?.validTrackingRateDenominator ??
              WSS_MISSING_SCORE_INDICATOR;
            const invalidTrackingCount =
              imperfectDataCount ?? WSS_MISSING_SCORE_INDICATOR;
            const maturedOrderText = i`Total matured orders: ${maturedOrderCount}`;
            const invalidTrackingText = i`Orders with invalid tracking: ${invalidTrackingCount} of ${maturedOrderCount}`;
            return (
              <Layout.FlexRow style={styles.subtitle}>
                <Text style={styles.subtitleText}>{maturedOrderText}</Text>
                <Text style={styles.subtitleText}>{invalidTrackingText}</Text>
                <Layout.FlexRow>
                  <Icon style={{ marginRight: 8 }} name="calendar" size={24} />
                  <Text style={styles.subtitleText}>
                    {formattedStartDate &&
                      formattedEndDate &&
                      `${formattedStartDate} - ${formattedEndDate}`}
                  </Text>
                </Layout.FlexRow>
              </Layout.FlexRow>
            );
          },
          ...getBannerProps(),
        }}
      />
      <PerformanceScaleSection>
        <PerformanceScale
          getScoreData={(score) =>
            metricsDataMap.validTrackingRate({ validTrackingRate: score })
          }
          ticks={ValidTrackRatingTicks}
          currentValue={numeral(todayScoreData.currentScoreDisplay).value()}
          formatter={formatter}
          compare={compareFn}
          higherIsBetter
        />
      </PerformanceScaleSection>
      {imperfectDataCount == 0 ? (
        <Layout.FlexColumn
          style={styles.noOrders}
          alignItems="center"
          justifyContent="center"
        >
          <Illustration
            name="wssDeepDiveNoTableData"
            alt={i`You don't have any orders with invalid tracking at this time`}
          />
          <Text>
            You don&apos;t have any orders with invalid tracking at this time
          </Text>
        </Layout.FlexColumn>
      ) : (
        <ValidTrackingRateTable style={styles.table} />
      )}
    </Card>
  );
};

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        table: {
          marginTop: 24,
        },
        noOrders: {
          marginTop: 82,
          alignSelf: "stretch",
          gap: 40,
        },
        subtitle: {
          gap: 40,
        },
        subtitleText: {
          fontSize: 16,
          color: textBlack,
        },
      }),
    [textBlack],
  );
};

export default observer(ValidTrackingRatePage);
