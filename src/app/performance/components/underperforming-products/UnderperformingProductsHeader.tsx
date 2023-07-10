import React from "react";
import { observer } from "mobx-react";
import numeral from "numeral";
import { useQuery } from "@apollo/client";
import { Stack, Text, Icon } from "@ContextLogic/atlas-ui";
import Skeleton from "@core/components/Skeleton";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import MetricHeaderSection from "@performance/migrated/wss-order-metrics-components/MetricHeaderSection";
import {
  TimelineDatapoint,
  formatDateWindow,
} from "@performance/migrated/toolkit/order-metrics";
import {
  metricsDataMap,
  useTierThemes,
  WSS_MISSING_SCORE_INDICATOR,
} from "@performance/migrated/toolkit/stats";
import {
  UNDERPERFORMING_PRODUCTS_HEADER_QUERY,
  UnderperformingProductsHeaderQueryResponse,
} from "@performance/api/underperformingProductsHeaderQuery";
import {
  compare,
  formatter,
} from "@performance/toolkit/underperforming-products";

const UnderperformingProductsHeader: React.FC = () => {
  const tierThemes = useTierThemes();
  const { locale } = useLocalizationStore();

  const { data, loading } =
    useQuery<UnderperformingProductsHeaderQueryResponse>(
      UNDERPERFORMING_PRODUCTS_HEADER_QUERY,
      {
        fetchPolicy: "no-cache",
      },
    );

  if (loading) {
    return <Skeleton height={265} />;
  }

  const wssData = data?.currentMerchant?.wishSellerStandard;

  if (!wssData) {
    return null;
  }

  const currentData = wssData.stats;
  const lastUpdateData = wssData.monthlyUpdateStats;
  const currentScoreData = metricsDataMap.underperformingProducts(currentData);
  const lastUpdatedScoreData =
    metricsDataMap.underperformingProducts(lastUpdateData);

  const chartData: ReadonlyArray<TimelineDatapoint> =
    wssData.recentStats
      ?.reduce<ReadonlyArray<TimelineDatapoint>>((prev, stat) => {
        if (stat.badProductRate == null) {
          return [...prev];
        }
        const scoreData = metricsDataMap.underperformingProducts(stat);
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

  const [formattedStartDate, formattedEndDate] = formatDateWindow(
    currentData?.date.unix,
    locale,
  );

  // TODO [lliepert]: re-enable this
  // const getBannerProps = (): Pick<
  //   MetricHeaderProps["header"],
  //   "bannerHeader" | "bannerSentiment" | "bannerText"
  // > => {
  //   if (todayScoreData.currentScoreDisplay == null) {
  //     return {
  //       bannerHeader: i`More data needed`,
  //       bannerSentiment: "info",
  //       bannerText: (
  //         <Markdown
  //           text={i`You don't have enough orders in the past 90 days to calculate your **Underperforming Products Rate**`}
  //         />
  //       ),
  //     };
  //   }

  //   if (underperformingProductCount == 0 && todayScoreData.goalLevel == null) {
  //     return {
  //       bannerHeader: ci18n(
  //         "Text congratulating on perfect score",
  //         "Congratulations!",
  //       ),
  //       bannerSentiment: "success",
  //       bannerText: (
  //         <Markdown
  //           text={
  //             i`You've achieved the best **Underperforming Products Rate** for ` +
  //             i`Wish Standards. Keep up the good work!`
  //           }
  //         />
  //       ),
  //     };
  //   }

  //   return {};
  // };

  return (
    <MetricHeaderSection
      compare={compare}
      formatter={formatter}
      higherIsBetter={false}
      chart={{
        data: chartData,
        goal: {
          value: numeral(currentScoreData.goalScoreDisplay).value(),
        },
        lastUpdated: {
          value: numeral(lastUpdatedScoreData.currentScoreDisplay).value(),
        },
      }}
      header={{
        value:
          currentScoreData.currentScoreDisplay ?? WSS_MISSING_SCORE_INDICATOR,
        illustration: tierThemes(currentScoreData.currentLevel).icon,
        subtitle: () => (
          <Stack direction="row" gap="40px" alignItems="center">
            <Text>
              Total products with orders:&nbsp;
              {currentData?.productWithOrdersCount ?? "-"}
            </Text>
            <Text>
              Underperforming products:&nbsp;
              {currentData?.badProductCount ?? "-"} of&nbsp;
              {currentData?.productWithOrdersCount ?? "-"}
            </Text>
            <Stack direction="row" alignItems="center">
              <Icon sx={{ marginRight: "8px" }} name="calendar" size="medium" />
              <Text>
                {formattedStartDate &&
                  formattedEndDate &&
                  `${formattedStartDate} - ${formattedEndDate}`}
              </Text>
            </Stack>
          </Stack>
        ),
        // ...getBannerProps(),
      }}
    />
  );
};

export default observer(UnderperformingProductsHeader);
