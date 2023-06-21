import { H4, Layout, Markdown } from "@ContextLogic/lego";
import { Text, Card } from "@ContextLogic/atlas-ui";
import { Icon } from "@ContextLogic/zeus";
import { ci18n } from "@core/toolkit/i18n";
import MetricHeaderSection, { MetricHeaderProps } from "./MetricHeaderSection";
import PerformanceScale from "./PerformanceScale";
import PerformanceScaleSection from "./PerformanceScaleSection";
import UserRatingTable from "./UserRatingTable";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useTheme } from "@core/stores/ThemeStore";
import {
  formatDateWindow,
  RecentStatsDayCount,
  TimelineDatapoint,
  UserRatingTicks,
  WSSDeepDiveQuery,
  WSSDeepDiveQueryRequest,
  WSSDeepDiveQueryResponse,
} from "@performance/migrated/toolkit/order-metrics";
import {
  metricsDataMap,
  statsComparator,
  WSS_MISSING_SCORE_INDICATOR,
  useTierThemes,
} from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Skeleton from "@core/components/Skeleton";
import TierPreviewBanner from "@performance/components/wish-standards/TierPreviewBanner";

const UserRatingPage: React.FC = () => {
  const styles = useStylesheet();
  const tierThemes = useTierThemes();
  const { locale } = useLocalizationStore();

  const formatter = (metric: number) =>
    metricsDataMap.userRating({ userRating: metric }).currentScoreDisplay ??
    WSS_MISSING_SCORE_INDICATOR;
  const compareFn = (lhs: number, rhs: number) =>
    statsComparator.userRating(lhs.toString(), rhs.toString());

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

  const [formattedStartDate, formattedEndDate] = formatDateWindow(
    todayData?.date.unix,
    locale,
  );

  const todayScoreData = metricsDataMap.userRating(todayData);
  const lastUpdatedScoreData = metricsDataMap.userRating(lastUpdateData);

  const chartData: ReadonlyArray<TimelineDatapoint> =
    data?.recentStats
      ?.reduce<ReadonlyArray<TimelineDatapoint>>((prev, stat) => {
        if (stat.userRating == null) {
          return [...prev];
        }
        const scoreData = metricsDataMap.userRating(stat);
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
            text={i`You don't have enough product ratings in the past ${90} days to calculate your **Average User Rating**`}
          />
        ),
      };
    }

    if (todayScoreData?.goalLevel == null) {
      return {
        bannerHeader: ci18n(
          "Text congratulating on perfect score",
          "Congratulations!",
        ),
        bannerSentiment: "success",
        bannerText: (
          <Markdown
            text={
              i`You've achieved the best **Average User Rating** for ` +
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
      <TierPreviewBanner sx={{ margin: "4px 0px 24px 0px" }} />
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
              data.deepDive?.totalRatingsReceived ?? "-";
            const matureOrderText = i`Total matured orders rated: ${maturedOrderCount}`;
            return (
              <Layout.FlexRow style={styles.subtitle}>
                <Text style={styles.subtitleText}>{matureOrderText}</Text>
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
            metricsDataMap.userRating({ userRating: score })
          }
          ticks={UserRatingTicks}
          currentValue={numeral(todayScoreData.currentScoreDisplay).value()}
          formatter={formatter}
          compare={compareFn}
          higherIsBetter
        />
      </PerformanceScaleSection>
      <Layout.FlexColumn style={styles.table}>
        <H4>All rated products</H4>
        <UserRatingTable formatter={formatter} />
      </Layout.FlexColumn>
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

export default observer(UserRatingPage);
