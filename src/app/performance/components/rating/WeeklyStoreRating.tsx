import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { SingleAxisLineChart } from "@performance/components";
import { useTheme } from "src/app/core/stores/ThemeStore";
import { useQuery } from "@apollo/client";
import {
  RATING_PERFORMANCE_WEEKLY_STORE_RATING_DATA_QUERY,
  AugmentedWeeklyStoreRating,
  WeeklyStoreRatingResponseData,
  WeeklyStoreRatingArgs,
} from "@performance/toolkit/rating";
import { REQUEST_WEEKS } from "@performance/toolkit/enums";
import { LoadingIndicator } from "@ContextLogic/lego";
import { round } from "src/app/core/toolkit/stringUtils";
import commonStyles from "@performance/styles/common.module.css";

const WeeklyStoreRating: React.FC = () => {
  const { primary } = useTheme();

  const { data, loading } = useQuery<
    WeeklyStoreRatingResponseData,
    WeeklyStoreRatingArgs
  >(RATING_PERFORMANCE_WEEKLY_STORE_RATING_DATA_QUERY, {
    variables: {
      weeks: REQUEST_WEEKS,
    },
  });

  const weeklyStoreRatingData:
    | ReadonlyArray<AugmentedWeeklyStoreRating>
    | undefined = useMemo(() => {
    const aggregateRatingData = data?.currentMerchant?.storeStats?.weekly.map(
      (item) => item.rating,
    );
    const chartData = aggregateRatingData?.slice(0, 6)?.reverse();
    return chartData?.map((item) => {
      const { startDate, averageStoreRating } = item;
      return {
        date: startDate.mmddyyyy,
        averageStoreRating: Number(round(String(averageStoreRating), 2)),
      };
    });
  }, [data?.currentMerchant?.storeStats?.weekly]);

  return (
    <>
      {loading ? (
        <LoadingIndicator className={commonStyles.loading} />
      ) : weeklyStoreRatingData ? (
        <div style={{ paddingTop: "60px" }}>
          <SingleAxisLineChart
            graphData={[...weeklyStoreRatingData]}
            dataRange={[0, 5]}
            lineProps={[
              {
                name: i`Average Store Rating`,
                dataKey: "averageStoreRating",
                stroke: primary,
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

export default observer(WeeklyStoreRating);
