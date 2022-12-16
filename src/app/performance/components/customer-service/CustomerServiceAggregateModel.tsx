import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import Link from "@core/components/Link";
import { useQuery } from "@apollo/client";
import { ThemedLabel, LoadingIndicator, Alert } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { Table, Title, Icon } from "@performance/components";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import store, {
  CS_PERFORMANCE_AGGREGATE_DATA_QUERY,
  AugmentedCustomerServiceAggregate,
  CustomerServiceAggregateResponseData,
  CustomerServiceAggregateArgs,
} from "@performance/stores/CustomerService";
import {
  CURRENCY_CODE,
  REQUEST_WEEKS,
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import { TableColumn } from "@performance/components/Table";
import { useExportCSV } from "@performance/toolkit/utils";
import commonStyles from "@performance/styles/common.module.css";
import { merchFeURL } from "@core/toolkit/url";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useTheme } from "@core/stores/ThemeStore";
import {
  addCommas,
  formatPercentage,
  round,
} from "src/app/core/toolkit/stringUtils";
import AggregateBenchMarksModel from "@performance/components/customer-service/AggregateBenchmarksModel";

const CustomerServiceAggregateModule: React.FC = () => {
  const { textBlack } = useTheme();
  const exportCSV = useExportCSV();
  const { data, loading } = useQuery<
    CustomerServiceAggregateResponseData,
    CustomerServiceAggregateArgs
  >(CS_PERFORMANCE_AGGREGATE_DATA_QUERY, {
    variables: {
      weeks: REQUEST_WEEKS,
    },
  });

  useEffect(() => {
    if (data) {
      store.updataAggregateData(data);
    }
  }, [data]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<AugmentedCustomerServiceAggregate>> = [
      {
        key: "timePeriod",
        title: i`Date Range`,
        render: ({ row: { startDate, endDate }, index }) => {
          return (
            <div
              style={{ textAlign: "left" }}
              className={commonStyles.linkStyle}
            >
              <Link
                href={`/performance/customer-service/product-breakdown?weeks_from_the_latest=${index}&start_date=${startDate.mmddyyyy}&end_date=${endDate.mmddyyyy}`}
              >
                {`${startDate.mmddyyyy}-${endDate.mmddyyyy}`}
              </Link>
            </div>
          );
        },
      },
      {
        key: "gmv",
        titleRender: () => (
          <div>
            <span>GMV</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Gross merchandising value
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </div>
        ),
        render: ({ row: { gmv } }) => {
          const amount =
            store.aggreagateCurrencyCode === CURRENCY_CODE.CNY
              ? gmv?.CNY_amount
              : gmv?.USD_amount;
          return amount
            ? formatCurrency(amount, store.aggreagateCurrencyCode)
            : "-";
        },
      },
      {
        key: "orders",
        titleRender: () => (
          <>
            <span>Orders</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of times your products were bought in the date range
                </div>
              }
            >
              <Icon name="help" size={20} color={"#000"} />
            </Tooltip>
          </>
        ),
        render: ({ row: { orders } }) => addCommas(String(orders)),
      },
      {
        key: "orders30d",
        titleRender: () => (
          <>
            <span>Orders 30 Day</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders received between 0 to 30 days ago
                </div>
              }
            >
              <Icon name="help" size={20} color={"#000"} />
            </Tooltip>
          </>
        ),
        render: ({ row: { orders30d } }) => addCommas(String(orders30d)),
      },
      {
        key: "refund30d",
        titleRender: () => (
          <>
            <span>Refunds 30 Day</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of eligible refunds for orders made 0 to 30 days ago
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
      },
      {
        key: "refundRatio30d",
        titleRender: () => (
          <>
            <span>Refund Ratio 30 Day</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders refunded divided by the number of orders made
                  0 to 30 days ago
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { refundRatio30d } }) =>
          refundRatio30d == null || refundRatio30d == 0 ? (
            "-"
          ) : refundRatio30d > 0 && refundRatio30d <= 0.08 ? (
            formatPercentage(String(refundRatio30d), "1", 2)
          ) : (
            <ThemedLabel
              theme={refundRatio30d > 0.1 ? "Red" : "Yellow"}
              className={commonStyles.themedLabel}
            >
              {formatPercentage(String(refundRatio30d), "1", 2)}
            </ThemedLabel>
          ),
      },
      {
        key: "orders93d",
        titleRender: () => (
          <>
            <span>Orders 93 Day</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders received between 63 to 93 days ago
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { orders93d } }) => addCommas(String(orders93d)),
      },
      {
        key: "refund93d",
        titleRender: () => (
          <>
            <span>Refunds 93 Day</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of eligible refunds for orders made 63 to 93 days ago
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
      },
      {
        key: "refundRatio93d",
        titleRender: () => (
          <>
            <span>Refund Ratio 93 Day</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of orders refunded divided by the number of orders made
                  63 to 93 days ago
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { refundRatio93d } }) =>
          refundRatio93d == null || refundRatio93d == 0 ? (
            "-"
          ) : refundRatio93d > 0 && refundRatio93d <= 0.08 ? (
            formatPercentage(String(refundRatio93d), "1", 2)
          ) : (
            <ThemedLabel
              theme={refundRatio93d > 0.1 ? "Red" : "Yellow"}
              className={commonStyles.themedLabel}
            >
              {formatPercentage(String(refundRatio93d), "1", 2)}
            </ThemedLabel>
          ),
      },
      {
        key: "chargeback",
        titleRender: () => (
          <>
            <span>Chargebacks</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of chargebacks occurred
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
      },
      {
        key: "chargebackRatio",
        titleRender: () => (
          <>
            <span>Chargeback Ratio</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of chargebacks divided by number of orders
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { chargebackRatio } }) =>
          chargebackRatio == null || chargebackRatio == 0 ? (
            "-"
          ) : chargebackRatio > 0 && chargebackRatio <= 0.005 ? (
            formatPercentage(String(chargebackRatio), "1", 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(chargebackRatio), "1", 2)}
            </ThemedLabel>
          ),
      },
      {
        key: "chargebackAmount",
        titleRender: () => (
          <>
            <span>Chargeback Amount</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Dollar value of the chargebacks
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { chargebackAmount } }) => {
          const amount =
            store.aggreagateCurrencyCode === CURRENCY_CODE.CNY
              ? chargebackAmount?.CNY_amount
              : chargebackAmount?.USD_amount;
          return amount
            ? formatCurrency(amount, store.aggreagateCurrencyCode)
            : "-";
        },
      },
      {
        key: "chargebackAmountRatio",
        titleRender: () => (
          <>
            <span>Chargeback Amount Ratio</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Chargeback amount divided by GMV
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { chargebackAmountRatio } }) =>
          chargebackAmountRatio == null || chargebackAmountRatio == 0 ? (
            "-"
          ) : chargebackAmountRatio > 0 && chargebackAmountRatio <= 0.005 ? (
            formatPercentage(String(chargebackAmountRatio), "1", 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(chargebackAmountRatio), "1", 2)}
            </ThemedLabel>
          ),
      },
      {
        key: "tickets",
        titleRender: () => (
          <>
            <span>Tickets</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>Number of new tickets</div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
      },
      {
        key: "ticketRatio",
        titleRender: () => (
          <>
            <span>Ticket Ratio</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of tickets divided by total number of orders
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { ticketRatio } }) =>
          ticketRatio == null || ticketRatio == 0 ? (
            "-"
          ) : ticketRatio > 0 && ticketRatio <= 0.3 ? (
            formatPercentage(String(ticketRatio), "1", 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(ticketRatio), "1", 2)}
            </ThemedLabel>
          ),
      },
      {
        key: "lateResponseRate30d",
        titleRender: () => (
          <>
            <span>Late Response Rate (30 day)</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Late response rate is the percentage of tickets you responded
                  to after 48 hours
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { lateResponseRate30d } }) =>
          lateResponseRate30d == null || lateResponseRate30d == 0 ? (
            "-"
          ) : lateResponseRate30d > 0 && lateResponseRate30d <= 0.15 ? (
            formatPercentage(String(lateResponseRate30d), "1", 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(lateResponseRate30d), "1", 2)}
            </ThemedLabel>
          ),
      },
      {
        key: "averageTicketResponseTime",
        titleRender: () => (
          <>
            <span>Average Ticket Response Time (Hours)</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Average time of a ticket staying in awaiting merchant status
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averageTicketResponseTime } }) =>
          averageTicketResponseTime && averageTicketResponseTime.hours
            ? `${round(String(averageTicketResponseTime.hours), 2)}`
            : "-",
      },
      {
        key: "customerSatisfaction",
        titleRender: () => (
          <>
            <span>Customer Satisfaction</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Number of ticket responses rated helpful divided by the total
                  number of ticket responses rated by customers
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { customerSatisfaction } }) =>
          customerSatisfaction == null || customerSatisfaction == 0 ? (
            "-"
          ) : customerSatisfaction >= 80 ? (
            formatPercentage(String(customerSatisfaction), "1", 2)
          ) : (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(customerSatisfaction), "1", 2)}
            </ThemedLabel>
          ),
      },
    ];
    return columns;
  }, [textBlack]);

  return (
    <>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeURL("/home") },
          { name: i`Performance`, href: merchFeURL("/performance-overview") },
          { name: i`Customer Service Performance`, href: window.location.href },
        ]}
        title={i`Customer Service Performance`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={
            i`Please refer to the metrics on the Wish Standards page as the ` +
            i`definitive source for your performance.`
          }
        />
        <AggregateBenchMarksModel />
        <div
          className={commonStyles.toolkit}
          style={{ alignItems: "center", padding: 0 }}
        >
          <div
            className={commonStyles.toolkit}
            style={{ alignItems: "center" }}
          >
            <Title
              style={{ marginRight: "20px", padding: 0 }}
              className={commonStyles.title}
            >
              Your Metrics
            </Title>
            {store.aggregateCNYFlag ? (
              <div className={commonStyles.changeCurrencyCon}>
                <Button
                  secondary
                  disabled={store.aggreagateCurrencyCode === CURRENCY_CODE.USD}
                  onClick={() =>
                    store.updateAggreagateCurrencyCode(CURRENCY_CODE.USD)
                  }
                >
                  Display in USD $
                </Button>
                <Button
                  secondary
                  disabled={store.aggreagateCurrencyCode === CURRENCY_CODE.CNY}
                  onClick={() =>
                    store.updateAggreagateCurrencyCode(CURRENCY_CODE.CNY)
                  }
                >
                  Display in CNY ¥
                </Button>
                <Tooltip
                  className={commonStyles.tableTooltip}
                  title={
                    <div style={{ fontSize: "14px" }}>
                      USD values recorded prior to your CNY migration date are
                      being calculated at 1 USD = 7.0 CNY, in order to view full
                      performance data in CNY
                    </div>
                  }
                >
                  <span className={commonStyles.calculateText}>
                    How are currency values calculated?
                  </span>
                </Tooltip>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <Button
            secondary
            onClick={() =>
              exportCSV({
                type: EXPORT_CSV_TYPE.MERCHANT,
                stats_type: EXPORT_CSV_STATS_TYPE.CUSTOMER_SERVICE,
                currencyCode: store.aggreagateCurrencyCode,
                target_date:
                  new Date(
                    store.aggregateData[
                      store.aggregateData.length - 1
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
          <Table data={store.aggregateData} columns={columns} />
        )}
      </PageGuide>
    </>
  );
};

export default observer(CustomerServiceAggregateModule);
