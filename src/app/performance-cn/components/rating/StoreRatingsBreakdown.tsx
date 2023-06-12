import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { SingleAxisLineChart } from "src/app/performance-cn/components";
import { useTheme } from "src/app/core/stores/ThemeStore";
import { useQuery } from "@apollo/client";
import {
  RATING_PERFORMANCE_STORE_RATING_BREAKDOWN_DATA_QUERY,
  AugmentedStoreRatingBreakdown,
  StoreRatingBreakdownResponseData,
  StoreRatingBreakdownArgs,
} from "src/app/performance-cn/toolkit/rating";
import { REQUEST_WEEKS } from "src/app/performance-cn/toolkit/enums";
import { LoadingIndicator } from "@ContextLogic/lego";
import commonStyles from "@performance-cn/styles/common.module.css";

const StoreRatingsBreakdown: React.FC = () => {
  const { primary, cashDarkest, warning, negative, tertiary } = useTheme();
  const { data, loading } = useQuery<
    StoreRatingBreakdownResponseData,
    StoreRatingBreakdownArgs
  >(RATING_PERFORMANCE_STORE_RATING_BREAKDOWN_DATA_QUERY, {
    variables: {
      weeks: REQUEST_WEEKS,
    },
  });

  const StoreRatingBreakdownData:
    | ReadonlyArray<AugmentedStoreRatingBreakdown>
    | undefined = useMemo(() => {
    const aggregateRatingData = data?.currentMerchant?.storeStats?.weekly.map(
      (item) => item.rating,
    );
    const chartData = aggregateRatingData?.slice(0, 6)?.reverse();
    return chartData?.map((item) => {
      const { startDate, storeRatingsBreakdown } = item;
      return {
        date: startDate.mmddyyyy,
        oneStarRatings: storeRatingsBreakdown.oneStarRatings,
        twoStarRatings: storeRatingsBreakdown.twoStarRatings,
        threeStarRatings: storeRatingsBreakdown.threeStarRatings,
        fourStarRatings: storeRatingsBreakdown.fourStarRatings,
        fiveStarRatings: storeRatingsBreakdown.fiveStarRatings,
      };
    });
  }, [data?.currentMerchant?.storeStats?.weekly]);

  return (
    <>
      {loading ? (
        <LoadingIndicator className={commonStyles.loading} />
      ) : StoreRatingBreakdownData ? (
        <div style={{ paddingTop: "60px" }}>
          <SingleAxisLineChart
            graphData={[...StoreRatingBreakdownData]}
            dataRange={[0, 500]}
            lineProps={[
              {
                name: i`1-Star`,
                dataKey: "oneStarRatings",
                stroke: negative,
              },
              {
                name: i`2-Star`,
                dataKey: "twoStarRatings",
                stroke: warning,
              },
              {
                name: i`3-Star`,
                dataKey: "threeStarRatings",
                stroke: tertiary,
              },
              {
                name: i`4-Star`,
                dataKey: "fourStarRatings",
                stroke: primary,
              },
              {
                name: i`5-Star`,
                dataKey: "fiveStarRatings",
                stroke: cashDarkest,
              },
            ]}
          />
        </div>
      ) : (
        <div>No data available</div>
      )}
    </>
  );
};

export default observer(StoreRatingsBreakdown);
