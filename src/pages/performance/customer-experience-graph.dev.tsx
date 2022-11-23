import { NextPage } from "next";
import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import {
  DayRangePickerInput,
  LoadingIndicator,
  Alert,
} from "@ContextLogic/lego";
import PageRoot from "@core/components/PageRoot";
import { SingleAxisLineChart, Title } from "@performance/components";
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import store, {
  PERFORMANCE_CE_GRAPHS_DATA_QUERY,
  CEGraphResponseData,
  CEGraphArgs,
} from "@performance/stores/CustomerExperienceGraphs";
import { getOffsetDays } from "@performance/toolkit/utils";
import styles from "@performance/styles/customer-experience-graph.module.css";
import PageGuide from "@core/components/PageGuide";
import { merchFeURL } from "@core/toolkit/url";
import PageHeader from "@core/components/PageHeader";

const SalesProductBreakdownPage: NextPage<Record<string, never>> = () => {
  const { primary, cashDarkest } = useTheme();
  const toastStore = useToastStore();
  const { data, loading, refetch } = useQuery<CEGraphResponseData, CEGraphArgs>(
    PERFORMANCE_CE_GRAPHS_DATA_QUERY,
    {
      variables: {
        days: 30,
        offsetDays: 0,
        averageFulfillmentTime: true,
        averageShippingTime: true,
        refundRate: true,
        averageShippingDelay: true,
        averageRating: true,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const updateGraphData = (data: CEGraphResponseData) => {
    switch (store.queryModule) {
      case "averageFulfillmentTime":
        store.updateAverageFulfillmentData(data);
        break;
      case "refundRate":
        store.updateRefundRateData(data);
        break;
      case "averageShippingTime":
        store.updateAverageShippingTimeData(data);
        break;
      case "averageShippingDelay":
        store.updateAverageShippingDelayData(data);
        break;
      case "averageRating":
        store.updateAverageRatingData(data);
        break;
      default:
        store.updateGraphsData(data);
        break;
    }
  };
  useEffect(() => {
    data?.currentMerchant?.storeStats?.daily && updateGraphData(data);
  }, [data]);

  const averageFulfillmentTimeDataRange: [number, number] = useMemo(() => {
    const recommendValue =
      store.averageFulfillmentTime.data[0]?.recommendedAverageFulfillmentTime;
    const data = store.averageFulfillmentTime.data.map(
      (item) => item.averageFulfillmentTime,
    );
    const newSortAverageFulfillmentTimeData = [...data, recommendValue].sort(
      (pre: number, next: number) => pre - next,
    );
    const min = newSortAverageFulfillmentTimeData[0];
    const max =
      newSortAverageFulfillmentTimeData[
        newSortAverageFulfillmentTimeData.length - 1
      ];
    return [min, max];
    // looks like a false positive due to mobx
    // if we remove it the memo doesn't re-compute as required
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.averageFulfillmentTime.data]);

  const refundRateDataRange: [number, number] = useMemo(() => {
    const recommendValue = store.refundRate.data[0]?.recommendedRefundRate;
    const data = store.refundRate.data.map((item) => item.refundRate30d);

    const newSortRefundRateData = [...data, recommendValue].sort(
      (pre: number, next: number) => pre - next,
    );
    const min = newSortRefundRateData[0];
    const max = newSortRefundRateData[newSortRefundRateData.length - 1];
    return [min, max];
    // looks like a false positive due to mobx
    // if we remove it the memo doesn't re-compute as required
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.refundRate.data]);

  const averageShippingTimeDataRange: [number, number] = useMemo(() => {
    const recommendValue =
      store.averageShippingTime.data[0]?.recommendedAverageShippingTime;
    const data = store.averageShippingTime.data.map(
      (item) => item.averageShippingTime,
    );
    const newSortAverageShippingTimeData = [...data, recommendValue].sort(
      (pre: number, next: number) => pre - next,
    );
    const min = newSortAverageShippingTimeData[0];
    const max =
      newSortAverageShippingTimeData[newSortAverageShippingTimeData.length - 1];
    return [min, max];
    // looks like a false positive due to mobx
    // if we remove it the memo doesn't re-compute as required
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.averageShippingTime.data]);

  const averageShippingDelayDataRange: [number, number] = useMemo(() => {
    const recommendValue =
      store.averageShippingDelay.data[0]?.recommendedAverageShippingDelay;
    const data = store.averageShippingDelay.data.map(
      (item) => item.averageShippingDelay,
    );
    const newSortAverageShippingDelayData = [...data, recommendValue].sort(
      (pre: number, next: number) => pre - next,
    );
    const min = newSortAverageShippingDelayData[0];
    const max =
      newSortAverageShippingDelayData[
        newSortAverageShippingDelayData.length - 1
      ];
    return [min, max];
    // looks like a false positive due to mobx
    // if we remove it the memo doesn't re-compute as required
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.averageShippingDelay.data]);

  const averageRatingDataRange: [number, number] = useMemo(() => {
    const recommendValue =
      store.averageRating.data[0]?.recommendedAverageRating;
    const data = store.averageRating.data.map((item) => item.averageRating30d);
    const newSortAverageRatingData = [...data, recommendValue].sort(
      (pre: number, next: number) => pre - next,
    );
    const min = newSortAverageRatingData[0];
    const max = newSortAverageRatingData[newSortAverageRatingData.length - 1];
    return [min, max];
    // looks like a false positive due to mobx
    // if we remove it the memo doesn't re-compute as required
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.averageRating.data]);

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeURL("/home") },
          { name: i`Performance`, href: merchFeURL("/performance-overview") },
          { name: i`Customer Experience Graph`, href: window.location.href },
        ]}
        title={i`Customer Experience Graph`}
      />
      <PageGuide relaxed style={{ paddingTop: 15 }}>
        <Alert
          sentiment="info"
          text={i`Please refer to the metrics on the Wish Standards page as the
          definitive source for your performance.`}
        />
        <Title
          className={styles.titleCon}
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
                store.updateQueryModule("averageFulfillmentTime");
                from &&
                  to &&
                  store.updateDate("averageFulfillmentTime", from, to);
                refetch({
                  days: getOffsetDays(from, to),
                  offsetDays: getOffsetDays(to, new Date()),
                  averageFulfillmentTime: true,
                  averageShippingTime: false,
                  refundRate: false,
                  averageShippingDelay: false,
                  averageRating: false,
                }).catch(({ message }: { message: string }) => {
                  toastStore.error(message);
                });
              }}
            />
          </div>
          <SingleAxisLineChart
            graphData={store.averageFulfillmentTime.data}
            dataRange={averageFulfillmentTimeDataRange}
            firstLineProps={{
              name: i`Average Fulfillment Time`,
              dataKey: "averageFulfillmentTime",
              stroke: primary,
              unit: i`days`,
            }}
            secondLineProps={{
              name: i`Recommended`,
              dataKey: "recommendedAverageFulfillmentTime",
              stroke: cashDarkest,
              unit: i`day`,
            }}
          />
        </div>
        <Title
          className={styles.titleCon}
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
                store.updateQueryModule("refundRate");
                from && to && store.updateDate("refundRate", from, to);
                refetch({
                  days: getOffsetDays(from, to),
                  offsetDays: getOffsetDays(to, new Date()),
                  averageFulfillmentTime: false,
                  averageShippingTime: false,
                  refundRate: true,
                  averageShippingDelay: false,
                  averageRating: false,
                }).catch(({ message }: { message: string }) => {
                  toastStore.error(message);
                });
              }}
            />
          </div>
          <SingleAxisLineChart
            graphData={store.refundRate.data}
            dataRange={refundRateDataRange}
            firstLineProps={{
              name: i`Refund Rate`,
              dataKey: "refundRate30d",
              stroke: primary,
            }}
            secondLineProps={{
              name: i`Recommended`,
              dataKey: "recommendedRefundRate",
              stroke: cashDarkest,
            }}
          />
        </div>
        <Title
          className={styles.titleCon}
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
                store.updateQueryModule("averageShippingTime");
                from && to && store.updateDate("averageShippingTime", from, to);
                refetch({
                  days: getOffsetDays(from, to),
                  offsetDays: getOffsetDays(to, new Date()),
                  averageFulfillmentTime: false,
                  averageShippingTime: true,
                  refundRate: false,
                  averageShippingDelay: false,
                  averageRating: false,
                }).catch(({ message }: { message: string }) => {
                  toastStore.error(message);
                });
              }}
            />
          </div>
          <SingleAxisLineChart
            graphData={store.averageShippingTime.data}
            dataRange={averageShippingTimeDataRange}
            firstLineProps={{
              name: i`Average Shipping Time`,
              dataKey: "averageShippingTime",
              stroke: primary,
              unit: i`days`,
            }}
            secondLineProps={{
              name: i`Recommended`,
              dataKey: "recommendedAverageShippingTime",
              stroke: cashDarkest,
              unit: i`days`,
            }}
          />
        </div>
        <Title
          className={styles.titleCon}
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
                store.updateQueryModule("averageShippingDelay");
                from &&
                  to &&
                  store.updateDate("averageShippingDelay", from, to);
                refetch({
                  days: getOffsetDays(from, to),
                  offsetDays: getOffsetDays(to, new Date()),
                  averageFulfillmentTime: false,
                  averageShippingTime: false,
                  refundRate: false,
                  averageShippingDelay: true,
                  averageRating: false,
                }).catch(({ message }: { message: string }) => {
                  toastStore.error(message);
                });
              }}
            />
          </div>
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
        </div>
        <Title
          className={styles.titleCon}
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
                store.updateQueryModule("averageRating");
                from && to && store.updateDate("averageRating", from, to);
                refetch({
                  days: getOffsetDays(from, to),
                  offsetDays: getOffsetDays(to, new Date()),
                  averageFulfillmentTime: false,
                  averageShippingTime: false,
                  refundRate: true,
                  averageShippingDelay: false,
                  averageRating: false,
                }).catch(({ message }: { message: string }) => {
                  toastStore.error(message);
                });
              }}
            />
          </div>

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
        </div>
        {loading && <LoadingIndicator className={styles.loading} />}
      </PageGuide>
    </PageRoot>
  );
};

export default observer(SalesProductBreakdownPage);
