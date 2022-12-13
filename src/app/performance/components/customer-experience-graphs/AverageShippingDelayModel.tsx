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
} from "@performance/stores/customer-experience-graphs/AverageShippingDelay";
import { getOffsetDays, useDateRange } from "@performance/toolkit/utils";
import styles from "@performance/styles/customer-experience-graph.module.css";

const AverageShippingDelayModel: NextPage<Record<string, never>> = () => {
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
    loading &&
      data?.currentMerchant?.storeStats?.daily &&
      store.updateAverageShippingDelayData(data);
  }, [data, loading]);

  const averageShippingDelayDataRange = useDateRange({
    recommendValue:
      store.averageShippingDelay.data[0]?.recommendedAverageShippingDelay,
    data: store.averageShippingDelay.data.map(
      (item) => item.averageShippingDelay,
    ),
  });

  return (
    <>
      <Title
        className={commonStyles.title}
        desc={i`average number of days between you shipping an order and its tracking information becoming available`}
      >
        Average Shipment Delay
      </Title>
      <div className={styles.chartCon}>
        <div className={styles.rangeDateCon}>
          <DayRangePickerInput
            noEdit
            fromDate={store.averageShippingDelay.startDate}
            toDate={store.averageShippingDelay.endDate}
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
            graphData={store.averageShippingDelay.data}
            dataRange={averageShippingDelayDataRange}
            firstLineProps={{
              name: i`Average Shipping Delay`,
              dataKey: "averageShippingDelay",
              stroke: primary,
              unit: i`days`,
            }}
            secondLineProps={{
              name: i`Recommended`,
              dataKey: "recommendedAverageShippingDelay",
              stroke: cashDarkest,
              unit: i`day`,
            }}
          />
        )}
      </div>
    </>
  );
};

export default observer(AverageShippingDelayModel);
