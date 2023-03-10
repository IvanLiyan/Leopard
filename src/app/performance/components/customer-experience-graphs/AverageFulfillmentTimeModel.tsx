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
} from "@performance/stores/customer-experience-graphs/AverageFulfillmentTime";
import { getOffsetDays, useDateRange } from "@performance/toolkit/utils";
import styles from "@performance/styles/customer-experience-graph.module.css";

const AverageFulfillmentTimeModel: NextPage<Record<string, never>> = () => {
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
      store.updateAverageFulfillmentData(data);
  }, [data, loading]);

  const averageFulfillmentTimeDataRange = useDateRange({
    recommendValue:
      store.averageFulfillmentTime.data[0]?.recommendedAverageFulfillmentTime,
    data: store.averageFulfillmentTime.data.map(
      (item) => item.averageFulfillmentTime,
    ),
  });

  return (
    <>
      <Title
        className={commonStyles.title}
        desc={i`average number of days it takes you to fulfill orders`}
      >
        Average Fulfillment Time
      </Title>
      <div className={styles.chartCon}>
        <div className={styles.rangeDateCon}>
          <DayRangePickerInput
            fromDate={store.averageFulfillmentTime.startDate}
            toDate={store.averageFulfillmentTime.endDate}
            noEdit
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
            graphData={[...store.averageFulfillmentTime.data]}
            dataRange={averageFulfillmentTimeDataRange}
            lineProps={[
              {
                name: i`Average Fulfillment Time`,
                dataKey: "averageFulfillmentTime",
                stroke: primary,
                unit: i`days`,
              },
              {
                name: i`Recommended`,
                dataKey: "recommendedAverageFulfillmentTime",
                stroke: cashDarkest,
                unit: i`day`,
              },
            ]}
          />
        )}
      </div>
    </>
  );
};

export default observer(AverageFulfillmentTimeModel);
