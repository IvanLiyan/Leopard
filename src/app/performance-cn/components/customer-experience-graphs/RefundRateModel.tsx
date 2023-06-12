import { NextPage } from "next";
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { DayRangePickerInput, LoadingIndicator } from "@ContextLogic/lego";
import { SingleAxisLineChart, Title } from "src/app/performance-cn/components";
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import commonStyles from "@performance-cn/styles/common.module.css";
import store, {
  PERFORMANCE_CEG_DATA_QUERY,
  CEGraphResponseData,
  CEGraphArgs,
} from "src/app/performance-cn/stores/customer-experience-graphs/RefundRate";
import {
  getOffsetDays,
  useDateRange,
} from "src/app/performance-cn/toolkit/utils";
import styles from "@performance-cn/styles/customer-experience-graph.module.css";

const RefundRateModel: NextPage<Record<string, never>> = () => {
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
      store.updateRefundRateData(data);
  }, [data, loading]);

  const refundRateDataRange = useDateRange({
    recommendValue: store.refundRate.data[0]?.recommendedRefundRate,
    data: store.refundRate.data.map((item) => item.refundRate30d),
  });

  return (
    <>
      <Title
        className={commonStyles.title}
        desc={i`percent of total transactions that were refunded in the previous 30 days`}
      >
        Refund Rate
      </Title>
      <div className={styles.chartCon}>
        <div className={styles.rangeDateCon}>
          <DayRangePickerInput
            fromDate={store.refundRate.startDate}
            toDate={store.refundRate.endDate}
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
            graphData={[...store.refundRate.data]}
            dataRange={refundRateDataRange}
            lineProps={[
              {
                name: i`Refund Rate`,
                dataKey: "refundRate30d",
                stroke: primary,
              },
              {
                name: i`Recommended`,
                dataKey: "recommendedRefundRate",
                stroke: cashDarkest,
              },
            ]}
          />
        )}
      </div>
    </>
  );
};

export default observer(RefundRateModel);
