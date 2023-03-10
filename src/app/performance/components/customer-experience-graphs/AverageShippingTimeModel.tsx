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
} from "@performance/stores/customer-experience-graphs/AverageShippingTime";
import { getOffsetDays, useDateRange } from "@performance/toolkit/utils";
import styles from "@performance/styles/customer-experience-graph.module.css";

const AverageShippingTimeModel: NextPage<Record<string, never>> = () => {
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
      store.updateAverageShippingTimeData(data);
  }, [data, loading]);

  const averageShippingTimeDataRange = useDateRange({
    recommendValue:
      store.averageShippingTime.data[0]?.recommendedAverageShippingTime,
    data: store.averageShippingTime.data.map(
      (item) => item.averageShippingTime,
    ),
  });

  return (
    <>
      <Title
        className={commonStyles.title}
        desc={i`average time elapsed between an order is marked shipped and it arrived at customer`}
      >
        Average Shipping Time
      </Title>
      <div className={styles.chartCon}>
        <div className={styles.rangeDateCon}>
          <DayRangePickerInput
            noEdit
            fromDate={store.averageShippingTime.startDate}
            toDate={store.averageShippingTime.endDate}
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
            graphData={[...store.averageShippingTime.data]}
            dataRange={averageShippingTimeDataRange}
            lineProps={[
              {
                name: i`Average Shipping Time`,
                dataKey: "averageShippingTime",
                stroke: primary,
                unit: i`days`,
              },
              {
                name: i`Recommended`,
                dataKey: "recommendedAverageShippingTime",
                stroke: cashDarkest,
                unit: i`days`,
              },
            ]}
          />
        )}
      </div>
    </>
  );
};

export default observer(AverageShippingTimeModel);
