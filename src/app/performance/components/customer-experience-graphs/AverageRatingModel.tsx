import { NextPage } from "next";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { DayRangePickerInput, LoadingIndicator } from "@ContextLogic/lego";
import { SingleAxisLineChart, Title } from "@performance/components";
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import commonStyles from "@performance/styles/common.module.css";
import store, {
  PERFORMANCE_CEG_DATA_QUERY,
  CEGraphResponseData,
  CEGraphArgs,
} from "@performance/stores/customer-experience-graphs/AverageRating";
import { getOffsetDays, useDateRange } from "@performance/toolkit/utils";
import styles from "@performance/styles/customer-experience-graph.module.css";

const AverageRatingModel: NextPage<Record<string, never>> = () => {
  const { primary, cashDarkest } = useTheme();
  const toastStore = useToastStore();
  const { data, loading, refetch } = useQuery<CEGraphResponseData, CEGraphArgs>(
    PERFORMANCE_CEG_DATA_QUERY,
    {
      variables: {
        days: 30,
        offsetDays: 0,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    !loading &&
      data?.currentMerchant?.storeStats?.daily &&
      store.updateAverageRatingData(data);
  }, [data, loading]);

  const averageRatingDataRange = useDateRange({
    recommendValue: store.averageRating.data[0]?.recommendedAverageRating,
    data: store.averageRating.data.map((item) => item.averageRating30d),
  });

  return (
    <>
      <Title
        className={commonStyles.title}
        desc={i`your average rating from the past 30 days`}
      >
        Average Rating
      </Title>
      <div className={styles.chartCon}>
        <div className={styles.rangeDateCon}>
          <DayRangePickerInput
            noEdit
            fromDate={store.averageRating.startDate}
            toDate={store.averageRating.endDate}
            cannotSelectFuture={true}
            onDayRangeChange={(from, to) => {
              refetch({
                days: getOffsetDays(from, to) + 1,
                offsetDays: getOffsetDays(
                  to,
                  new Date(store.lastUpdateDataDate || new Date()),
                ),
              }).catch(({ message }: { message: string }) => {
                toastStore.error(message);
              });
            }}
          />
        </div>
        {loading ? (
          <LoadingIndicator className={commonStyles.loading} />
        ) : (
          <SingleAxisLineChart
            graphData={store.averageRating.data}
            dataRange={averageRatingDataRange}
            firstLineProps={{
              name: i`Average Rating`,
              dataKey: "averageRating30d",
              stroke: primary,
            }}
            secondLineProps={{
              name: i`Recommended`,
              dataKey: "recommendedAverageRating",
              stroke: cashDarkest,
            }}
          />
        )}
      </div>
    </>
  );
};

export default observer(AverageRatingModel);
