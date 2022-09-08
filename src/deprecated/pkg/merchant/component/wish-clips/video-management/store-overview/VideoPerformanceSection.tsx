/*
 * VideoPerformanceSection.tsx
 *
 * Created by Jonah Dlin on Tue Mar 15 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import moment from "moment/moment";

/* Lego Components */
import { Card, FormSelect, H4, Layout, Pager, Text, LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import Metric from "./Metric";
import { zendeskURL } from "@toolkit/url";
import Illustration from "@merchant/component/core/Illustration";
import {
  OverallVideoPerformanceResponse,
  OverallVideoPerformanceRequest,
  OVERALL_VIDEO_PERFORMANCE_QUERY,
  VideoPerformanceMetricType,
  formatVideoPerformanceMetric,
} from "@toolkit/wish-clips/video-management";
import VideoPerformanceGraph from "./VideoPerformanceGraph";

import Link from "@next-toolkit/Link";

type Props = BaseProps & {
  readonly noVideos: boolean;
  readonly loadingNoVideos: boolean;
};

const PeriodOptionsOrder = [
  "SEVEN_DAYS",
  "THIRTY_DAYS",
  "NINETY_DAYS",
] as const;
type PeriodOptionType = typeof PeriodOptionsOrder[number];

const PeriodOptionData: {
  readonly [T in PeriodOptionType]: {
    readonly name: string;
    readonly numberOfDays: number;
  };
} = {
  SEVEN_DAYS: {
    name: i`Past ${7} days`,
    numberOfDays: 7,
  },
  THIRTY_DAYS: {
    name: i`Past ${30} days`,
    numberOfDays: 30,
  },
  NINETY_DAYS: {
    name: i`Past ${90} days`,
    numberOfDays: 90,
  },
};

const MetricTypeName: { readonly [T in VideoPerformanceMetricType]: string } = {
  VIEWS: i`Total Views`,
  LIKES: i`Total Likes`,
  WATCH_TIME: i`Total Watch Time`,
};

const VideoPerformanceSection: React.FC<Props> = ({
  className,
  style,
  noVideos,
  loadingNoVideos,
}) => {
  const styles = useStylesheet();
  const [period, setPeriod] = useState<PeriodOptionType>("THIRTY_DAYS");
  const [selectedMetric, setSelectedMetric] =
    useState<VideoPerformanceMetricType>("VIEWS");

  const learnMoreLink = zendeskURL("360056495994");

  const { surfaceDarker } = useTheme();

  const { startDateUnix, endDateUnix } = useMemo(() => {
    const endMoment = moment();
    const startMoment = moment(endMoment).subtract(
      PeriodOptionData[period].numberOfDays,
      "days"
    );

    return {
      endDateUnix: endMoment.unix(),
      startDateUnix: startMoment.unix(),
    };
  }, [period]);

  const { data: performanceData, loading: loadingPerformance } = useQuery<
    OverallVideoPerformanceResponse,
    OverallVideoPerformanceRequest
  >(OVERALL_VIDEO_PERFORMANCE_QUERY, {
    variables: {
      startDate: {
        unix: startDateUnix,
      },
      endDate: {
        unix: endDateUnix,
      },
    },
  });

  const renderMetricTab = ({
    title,
    amount,
    selected,
  }: {
    readonly title: string;
    readonly amount: string;
    readonly selected: boolean;
  }) => {
    return (
      <Layout.FlexColumn
        style={styles.pagerTabTitleWrapper}
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Text
          style={[
            styles.pagerTabTitle,
            !selected && {
              color: surfaceDarker,
            },
          ]}
        >
          {title}
        </Text>
        <H4
          style={
            !selected && {
              color: surfaceDarker,
            }
          }
        >
          {amount}
        </H4>
      </Layout.FlexColumn>
    );
  };

  const performance =
    performanceData?.productCatalog?.videoService.performance || undefined;
  const dailyStats = performance?.dailyStats || undefined;

  const isLoading = loadingPerformance || loadingNoVideos;

  const {
    totalViews,
    totalLikes,
    totalWatchTime,
  }: {
    readonly totalViews: string;
    readonly totalLikes: string;
    readonly totalWatchTime: string;
  } = useMemo(() => {
    const { totalViewsAmount, totalLikesAmount, totalWatchTimeAmount } = (
      dailyStats || []
    ).reduce(
      (acc, { likes, views, watchTime }) => {
        return {
          totalViewsAmount: acc.totalViewsAmount + (likes || 0),
          totalLikesAmount: acc.totalLikesAmount + (views || 0),
          totalWatchTimeAmount: acc.totalWatchTimeAmount + (watchTime || 0),
        };
      },
      { totalViewsAmount: 0, totalLikesAmount: 0, totalWatchTimeAmount: 0 }
    );

    return {
      totalViews: formatVideoPerformanceMetric({
        amount: totalViewsAmount,
        metric: "VIEWS",
      }),
      totalLikes: formatVideoPerformanceMetric({
        amount: totalLikesAmount,
        metric: "LIKES",
      }),
      totalWatchTime: formatVideoPerformanceMetric({
        amount: totalWatchTimeAmount,
        metric: "WATCH_TIME",
      }),
    };
  }, [dailyStats]);

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      <Layout.FlexRow alignItems="center" justifyContent="space-between">
        <H4>Video Performance</H4>
        {!noVideos && (
          <FormSelect
            style={styles.periodInput}
            selectedValue={period}
            options={PeriodOptionsOrder.map((option) => ({
              value: option,
              text: PeriodOptionData[option].name,
            }))}
            onSelected={(value: PeriodOptionType) => setPeriod(value)}
            disabled={loadingPerformance}
          />
        )}
      </Layout.FlexRow>
      {noVideos ? (
        <Card style={styles.noVideosCard}>
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <Layout.FlexColumn
              style={styles.noVideosContent}
              alignItems="center"
            >
              <Illustration
                style={styles.noVideosIllustration}
                name="videoAnalyticsMissing"
                alt={i`No metrics`}
              />
              <Text style={styles.noVideosText}>
                Looks like you haven't uploaded any videos. Unlock the
                analytical tool by uploading your first video!
              </Text>
              <Link href={learnMoreLink}>Learn how to create a video</Link>
            </Layout.FlexColumn>
          )}
        </Card>
      ) : (
        <>
          <Card>
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <Layout.FlexRow
                style={styles.metricsContainer}
                justifyContent="space-between"
              >
                <Metric
                  icon="eyeOn"
                  name={MetricTypeName.VIEWS}
                  amount={totalViews}
                  change={performance?.totalViewsPercentChange}
                  description={
                    i`This includes total views for any active or inactive videos ` +
                    i`uploaded to your Video Catalog in the ` +
                    i`past ${PeriodOptionData[period].numberOfDays} days`
                  }
                />
                <Metric
                  icon="thumbsUp"
                  name={MetricTypeName.LIKES}
                  amount={totalLikes}
                  change={performance?.totalLikesPercentChange}
                  description={
                    i`This includes total likes for any active or inactive videos ` +
                    i`uploaded to your Video Catalog in the ` +
                    i`past ${PeriodOptionData[period].numberOfDays} days`
                  }
                />
                <Metric
                  icon="history"
                  name={MetricTypeName.WATCH_TIME}
                  amount={totalWatchTime}
                  change={performance?.totalWatchTimePercentChange}
                  description={
                    i`This includes total watch time for any active or inactive ` +
                    i`videos uploaded to your Video Catalog in the ` +
                    i`past ${PeriodOptionData[period].numberOfDays} days`
                  }
                />
              </Layout.FlexRow>
            )}
          </Card>
          {!noVideos && dailyStats != null && !isLoading && (
            <Card>
              <Layout.FlexColumn>
                <Pager
                  selectedTabKey={selectedMetric}
                  onTabChange={(tabKey: VideoPerformanceMetricType) =>
                    setSelectedMetric(tabKey)
                  }
                  renderActiveLineAbove
                >
                  <Pager.Content
                    tabKey="VIEWS"
                    titleValue={() =>
                      renderMetricTab({
                        title: MetricTypeName.VIEWS,
                        amount: totalViews,
                        selected: selectedMetric == "VIEWS",
                      })
                    }
                  />
                  <Pager.Content
                    tabKey="LIKES"
                    titleValue={() =>
                      renderMetricTab({
                        title: MetricTypeName.LIKES,
                        amount: totalLikes,
                        selected: selectedMetric == "LIKES",
                      })
                    }
                  />
                  <Pager.Content
                    tabKey="WATCH_TIME"
                    titleValue={() =>
                      renderMetricTab({
                        title: MetricTypeName.WATCH_TIME,
                        amount: totalWatchTime,
                        selected: selectedMetric == "WATCH_TIME",
                      })
                    }
                  />
                </Pager>
                <VideoPerformanceGraph
                  style={styles.graph}
                  data={dailyStats}
                  metric={selectedMetric}
                />
              </Layout.FlexColumn>
            </Card>
          )}
        </>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 32,
        },
        metricsContainer: {
          padding: "40px 64px",
          gap: 16,
          flexWrap: "wrap",
        },
        periodInput: {
          paddingLeft: 12,
          paddingRight: 12,
          maxWidth: 238,
          flex: 1,
        },
        pagerTabTitleWrapper: {
          gap: 8,
          padding: 24,
          minWidth: 150,
        },
        pagerTabTitle: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        noVideosCard: {
          padding: 40,
        },
        noVideosContent: {
          gap: 16,
        },
        noVideosIllustration: {
          maxWidth: 240,
        },
        noVideosText: {
          maxWidth: 345,
          textAlign: "center",
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        graph: {
          margin: 24,
        },
      }),
    [textDark]
  );
};

export default observer(VideoPerformanceSection);
