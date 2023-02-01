import { NextPage } from "next";
import { observer } from "mobx-react";
import React, { useEffect, useMemo } from "react";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { ThemedLabel, Alert } from "@ContextLogic/lego";
import PageRoot from "@core/components/PageRoot";
import store, {
  SHIPPING_PERFORMANCE_DATA,
  ShippingDataQueryResponse,
  ShippingDataQueryArguments,
  AugmentedShipping,
} from "@performance/stores/shipping";
import BenchMarksModel from "@performance/components/shipping/BenchMarksModel";
import { useQuery } from "@apollo/client";
import { LoadingIndicator } from "@ContextLogic/lego";
import { useExportCSV } from "@performance/toolkit/utils";
import {
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import {
  round,
  addCommas,
  formatPercentage,
} from "src/app/core/toolkit/stringUtils";
import { Table, Title, Icon } from "@performance/components";
import { TableColumn } from "@performance/components/Table";
import commonStyles from "@performance/styles/common.module.css";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";
import { merchFeURL } from "@core/toolkit/router";
import { useTheme } from "@core/stores/ThemeStore";

const PerformanceShippingPage: NextPage<Record<string, never>> = () => {
  const { textBlack, textLight } = useTheme();
  const exportCSV = useExportCSV();
  const { data, loading } = useQuery<
    ShippingDataQueryResponse,
    ShippingDataQueryArguments
  >(SHIPPING_PERFORMANCE_DATA, {
    variables: {
      weeks: 20,
    },
  });

  useEffect(() => {
    if (data) {
      store.updateShippingData(data);
    }
  }, [data]);

  const columns = useMemo(() => {
    const columns: ReadonlyArray<TableColumn<AugmentedShipping>> = [
      {
        title: i`Time Period`,
        key: "timePeriod",
        align: "left",
        render: ({ row: { startDate, endDate } }) => (
          <div>{`${startDate.mmddyyyy}-${endDate.mmddyyyy}`}</div>
        ),
      },
      {
        key: "ordersFulfilled",
        titleRender: () => (
          <>
            <span>Orders Fulfilled</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders marked shipped
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { ordersFulfilled } }) =>
          addCommas(String(ordersFulfilled)),
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
        render: ({ row: { averageClaimedFulfillmentTime } }) => {
          return averageClaimedFulfillmentTime == null ||
            averageClaimedFulfillmentTime.hours == 0 ? (
            "-"
          ) : averageClaimedFulfillmentTime.hours > 72 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {round(String(averageClaimedFulfillmentTime.hours), 2)}
            </ThemedLabel>
          ) : (
            round(String(averageClaimedFulfillmentTime.hours), 2)
          );
        },
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
        render: ({ row: { averageFulfillmentTime }, index }) => {
          // The data in the last two weeks of this column need to display Not Available Yet
          return index < 2 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : averageFulfillmentTime == null ||
            averageFulfillmentTime.hours == 0 ? (
            "-"
          ) : averageFulfillmentTime.hours > 120 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {round(String(averageFulfillmentTime.hours), 2)}
            </ThemedLabel>
          ) : (
            round(String(averageFulfillmentTime.hours), 2)
          );
        },
      },
      {
        key: "ordersWithValidTracking",
        titleRender: () => (
          <>
            <span>Orders with Valid Tracking</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of fulfilled orders confirmed shipped by the carrier
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { ordersWithValidTracking }, index }) =>
          // The data in the last two weeks of this column need to display Not Available Yet
          index < 2 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : ordersWithValidTracking == null ||
            ordersWithValidTracking == 0 ? (
            "-"
          ) : (
            addCommas(String(ordersWithValidTracking))
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
        render: ({ row: { validTrackingRate }, index }) => {
          // The data in the last two weeks of this column need to display Not Available Yet
          return index < 2 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : validTrackingRate == null || validTrackingRate == 0 ? (
            "-"
          ) : validTrackingRate < 0.99 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(validTrackingRate), "1", 2)}
            </ThemedLabel>
          ) : validTrackingRate > 1 ? (
            formatPercentage(String(1), "1", 2)
          ) : (
            formatPercentage(String(validTrackingRate), "1", 2)
          );
        },
      },
      {
        key: "preFulfillmentCancellations",
        titleRender: () => (
          <>
            <span>Pre-fulfillment Cancellations</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders that are refunded due to the merchant being
                  unable to fulfill the order
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { preFulfillmentCancellations }, index }) => {
          // The data in the last two weeks of this column need to display Not Available Yet
          return index < 2 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : preFulfillmentCancellations == 0 ||
            preFulfillmentCancellations == null ? (
            "-"
          ) : (
            String(preFulfillmentCancellations)
          );
        },
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
        render: ({ row: { preFulfillmentCancellationRate }, index }) => {
          // The data in the last two weeks of this column need to display Not Available Yet
          return index < 2 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : preFulfillmentCancellationRate == null ||
            preFulfillmentCancellationRate == 0 ? (
            "-"
          ) : preFulfillmentCancellationRate > 0.03 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(preFulfillmentCancellationRate), "1", 2)}
            </ThemedLabel>
          ) : (
            formatPercentage(String(preFulfillmentCancellationRate), "1", 2)
          );
        },
      },
      {
        key: "lateConfirmedFulfillment",
        titleRender: () => (
          <>
            <span>Orders Confirmed Fulfilled Late</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders with valid tracking where the period between
                  order released time and first recorded carrier scan is longer
                  than 168 hours for orders with (merchant price + shipping
                  price) per item less than $100, or longer than 336 hours for
                  orders with (merchant price + shipping price) per item greater
                  than or equal to $100
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { lateConfirmedFulfillment }, index }) =>
          // The data in the last two weeks of this column need to display Not Available Yet
          index < 2 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : lateConfirmedFulfillment == 0 ||
            lateConfirmedFulfillment == null ? (
            "-"
          ) : (
            String(lateConfirmedFulfillment)
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
        render: ({ row: { lateConfirmedFulfillmentRate }, index }) =>
          // The data in the last two weeks of this column need to display Not Available Yet
          index < 2 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : lateConfirmedFulfillmentRate == null ||
            lateConfirmedFulfillmentRate == 0 ? (
            "-"
          ) : lateConfirmedFulfillmentRate > 0.01 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(lateConfirmedFulfillmentRate), "1", 2)}
            </ThemedLabel>
          ) : lateConfirmedFulfillmentRate > 0 ? (
            formatPercentage(String(lateConfirmedFulfillmentRate), "1", 2)
          ) : (
            "-"
          ),
      },
      {
        key: "ordersConfirmedDelivered",
        titleRender: () => (
          <>
            <span>Orders Delivered</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders confirmed delivered by the carrier
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { ordersConfirmedDelivered }, index }) =>
          // The data in the last six weeks of this column need to display Not Available Yet
          index < 6 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : ordersConfirmedDelivered == null ||
            ordersConfirmedDelivered == 0 ? (
            "-"
          ) : (
            addCommas(String(ordersConfirmedDelivered))
          ),
      },
      {
        key: "ordersConfirmedDeliveredRate",
        titleRender: () => (
          <>
            <span>Confirmed Delivery Rate</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Percentage of orders confirmed delivered by the carrier
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { ordersConfirmedDeliveredRate }, index }) =>
          // The data in the last six weeks of this column need to display Not Available Yet
          index < 6 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : ordersConfirmedDeliveredRate == null ||
            ordersConfirmedDeliveredRate == 0 ? (
            "-"
          ) : ordersConfirmedDeliveredRate > 1 ? (
            formatPercentage(String(1), "1", 2)
          ) : (
            formatPercentage(String(ordersConfirmedDeliveredRate), "1", 2)
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
        render: ({ row: { shippingTime }, index }) => {
          // The data in the last six weeks of this column need to display Not Available Yet
          return index < 6 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : shippingTime == null || shippingTime.days == 0 ? (
            "-"
          ) : shippingTime.days > 21 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {round(String(shippingTime.days), 2)}
            </ThemedLabel>
          ) : (
            round(String(shippingTime.days), 2)
          );
        },
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
        render: ({ row: { timeToDoor }, index }) => {
          // The data in the last six weeks of this column need to display Not Available Yet
          return index < 6 ? (
            <span style={{ color: textLight }}>Not Available Yet</span>
          ) : timeToDoor == null || timeToDoor.days == 0 ? (
            "-"
          ) : timeToDoor.days > 24 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {round(String(timeToDoor.days), 2)}
            </ThemedLabel>
          ) : (
            round(String(timeToDoor.days), 2)
          );
        },
      },
    ];
    return columns;
  }, [textBlack, textLight]);

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeURL("/home") },
          { name: i`Performance`, href: merchFeURL("/performance-overview") },
          { name: i`Shipping Performance`, href: window.location.href },
        ]}
        title={i`Shipping Performance`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={
            i`Please refer to the metrics on the Wish Standards page as the ` +
            i`definitive source for your performance.`
          }
        />
        <BenchMarksModel />
        <div className={commonStyles.toolkit}>
          <Title className={commonStyles.title} style={{ padding: 0 }}>
            Your Metrics
          </Title>
          <Button
            secondary
            onClick={() =>
              exportCSV({
                type: EXPORT_CSV_TYPE.MERCHANT,
                stats_type: EXPORT_CSV_STATS_TYPE.FULFILLMENT_SHIPPING,
                target_date:
                  new Date(
                    store.shippingData[
                      store.shippingData.length - 1
                    ].startDate.mmddyyyy,
                  ).getTime() / 1000,
              })
            }
          >
            Export CSV
          </Button>
        </div>
        {loading ? (
          <LoadingIndicator className={commonStyles.loading} />
        ) : (
          <Table data={store.shippingData} columns={columns} />
        )}
      </PageGuide>
    </PageRoot>
  );
};

export default observer(PerformanceShippingPage);
