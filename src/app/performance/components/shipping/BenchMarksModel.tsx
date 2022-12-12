import React, { useMemo } from "react";
import { Table, Title, Icon } from "@performance/components";
import { TableColumn } from "@performance/components/Table";
import { ShippingBenchMark } from "@performance/stores/shipping";
import commonStyles from "@performance/styles/common.module.css";
import { useTheme } from "@core/stores/ThemeStore";
import { ThemedLabel } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";

const benchMarksData: ReadonlyArray<ShippingBenchMark> = [
  {
    timePeriod: i`Warning`,
    averageClaimedFulfillmentTime: i`> 72 Hours (3 Days)`,
    averageFulfillmentTime: i`> 120 Hours (5 Days)`,
    validTrackingRate: i`< 99%`,
    preFulfillmentCancellationRate: i`> 3%`,
    lateConfirmedFulfillmentRate: i`> 1%`,
    shippingTime: i`> 21 Days`,
    timeToDoor: i`> 24 Days`,
  },
];

const BenchMarksModel: React.FC = () => {
  const { textBlack } = useTheme();
  const columns = useMemo(() => {
    const columns: ReadonlyArray<TableColumn<ShippingBenchMark>> = [
      {
        titleRender: () => <span>Benchmark</span>,
        key: "timePeriod",
        render: ({ row: { timePeriod } }) => {
          return (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {timePeriod}
            </ThemedLabel>
          );
        },
      },
      {
        key: "averageClaimedFulfillmentTime",
        titleRender: () => (
          <>
            <span>Avg Claimed Fulfillment Time (Hours)</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Average time from order placed to the time that you marked the
                  order shipped
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averageClaimedFulfillmentTime } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {averageClaimedFulfillmentTime}
          </ThemedLabel>
        ),
      },
      {
        key: "averageFulfillmentTime",
        titleRender: () => (
          <>
            <span>Avg Confirmed Fulfillment Time (Hours)</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Average time from order placed to the time our system
                  confirmed the tracking number
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averageFulfillmentTime } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {averageFulfillmentTime}
          </ThemedLabel>
        ),
      },

      {
        key: "validTrackingRate",
        titleRender: () => (
          <>
            <span>Valid Tracking Rate</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Percentage of orders confirmed shipped by the carrier
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { validTrackingRate } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {validTrackingRate}
          </ThemedLabel>
        ),
      },
      {
        key: "preFulfillmentCancellationRate",
        titleRender: () => (
          <>
            <span>Pre-fulfillment Cancellation Rate</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Percentage of orders that are refunded due to the merchant
                  being unable to fulfill the order
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { preFulfillmentCancellationRate } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {preFulfillmentCancellationRate}
          </ThemedLabel>
        ),
      },

      {
        key: "lateConfirmedFulfillmentRate",
        titleRender: () => (
          <>
            <span>Late Confirmed Fulfillment Rate</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Percentage of orders with valid tracking where the period
                  between order released time and first recorded carrier scan is
                  longer than 168 hours for orders with (merchant price +
                  shipping price) per item less than $100, or longer than 336
                  hours for orders with (merchant price + shipping price) per
                  item greater than or equal to $100
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { lateConfirmedFulfillmentRate } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {lateConfirmedFulfillmentRate}
          </ThemedLabel>
        ),
      },

      {
        key: "shippingTime",
        titleRender: () => (
          <>
            <span>Average Shipping Time (Days)</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Average time elapsed between an order is marked shipped and it
                  arrived at customer
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { shippingTime } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {shippingTime}
          </ThemedLabel>
        ),
      },
      {
        key: "timeToDoor",
        titleRender: () => (
          <>
            <span>Average Time to Door (Days)</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Average time from when orders were placed to when the shipping
                  carrier confirmed orders as delivered
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { timeToDoor } }) => (
          <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
            {timeToDoor}
          </ThemedLabel>
        ),
      },
    ];
    return columns;
  }, [textBlack]);

  return (
    <>
      <Title className={commonStyles.title}>
        Wish Shipping Performance Benchmarks
      </Title>
      <Table data={benchMarksData} columns={columns} />
    </>
  );
};

export default BenchMarksModel;
