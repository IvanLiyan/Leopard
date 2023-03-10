import { observer } from "mobx-react";
import React, { useMemo } from "react";
import { SingleAxisLineChart } from "@performance/components";
import { useTheme } from "src/app/core/stores/ThemeStore";
import { useQuery } from "@apollo/client";
import {
  RATING_PERFORMANCE_PRODUCT_RATING_BREAKDOWN_DATA_QUERY,
  AugmentedProductRatingBreakdown,
  ProductRatingBreakdownResponseData,
  ProductRatingBreakdownArgs,
} from "@performance/toolkit/rating";
import { REQUEST_WEEKS } from "@performance/toolkit/enums";
import { LoadingIndicator } from "@ContextLogic/lego";
import commonStyles from "@performance/styles/common.module.css";

const ProductRatingsBreakdown: React.FC = () => {
  const { primary, cashDarkest, warning, negative, tertiary } = useTheme();

  const { data, loading } = useQuery<
    ProductRatingBreakdownResponseData,
    ProductRatingBreakdownArgs
  >(RATING_PERFORMANCE_PRODUCT_RATING_BREAKDOWN_DATA_QUERY, {
    variables: {
      weeks: REQUEST_WEEKS,
    },
  });

  const ProductRatingBreakdownData:
    | ReadonlyArray<AugmentedProductRatingBreakdown>
    | undefined = useMemo(() => {
    const aggregateRatingData = data?.currentMerchant?.storeStats?.weekly.map(
      (item) => item.rating,
    );
    const chartData = aggregateRatingData?.slice(0, 6)?.reverse();
    return chartData?.map((item) => {
      const { startDate, productRatingsBreakdown } = item;
      return {
        date: startDate.mmddyyyy,
        oneStarRatings: productRatingsBreakdown.oneStarRatings,
        twoStarRatings: productRatingsBreakdown.twoStarRatings,
        threeStarRatings: productRatingsBreakdown.threeStarRatings,
        fourStarRatings: productRatingsBreakdown.fourStarRatings,
        fiveStarRatings: productRatingsBreakdown.fiveStarRatings,
      };
    });
  }, [data?.currentMerchant?.storeStats?.weekly]);

  return (
    <>
      {loading ? (
        <LoadingIndicator className={commonStyles.loading} />
      ) : ProductRatingBreakdownData ? (
        <div style={{ paddingTop: "60px" }}>
          <SingleAxisLineChart
            graphData={[...ProductRatingBreakdownData]}
            dataRange={[0, 400]}
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

export default observer(ProductRatingsBreakdown);
