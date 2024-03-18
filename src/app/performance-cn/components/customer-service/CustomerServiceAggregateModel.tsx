import React, { useMemo } from "react";
import { observer } from "mobx-react";
import Link from "@deprecated/components/Link";
import { useQuery } from "@apollo/client";
import { ThemedLabel, LoadingIndicator, Alert } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { Table, Title, Icon } from "src/app/performance-cn/components";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import {
  CS_PERFORMANCE_AGGREGATE_DATA_QUERY,
  CustomerServiceAggregateResponseData,
  CustomerServiceAggregateArgs,
  PickedCustomerServiceAggregate,
} from "src/app/performance-cn/toolkit/cs";
import {
  REQUEST_WEEKS,
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "src/app/performance-cn/toolkit/enums";
import { TableColumn } from "src/app/performance-cn/components/Table";
import {
  encodeProductBreakdownURI,
  useExportCSV,
} from "src/app/performance-cn/toolkit/utils";
import commonStyles from "@performance-cn/styles/common.module.css";
import { merchFeUrl } from "@core/toolkit/router";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useTheme } from "@core/stores/ThemeStore";
import {
  addCommas,
  formatPercentage,
  round,
} from "src/app/core/toolkit/stringUtils";
import AggregateBenchMarksModel from "src/app/performance-cn/components/customer-service/AggregateBenchmarksModel";
import { ci18n } from "@core/toolkit/i18n";

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

  const currencyCodeForExportCSV = data?.currentMerchant?.primaryCurrency;

  const tableData: ReadonlyArray<PickedCustomerServiceAggregate> | undefined =
    useMemo(() => {
      return data?.currentMerchant?.storeStats?.weekly?.map((week) => week.cs);
    }, [data?.currentMerchant?.storeStats?.weekly]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<PickedCustomerServiceAggregate>> = [
      {
        key: "timePeriod",
        title: ci18n("timePeriod", "Date Range"),
        align: "left",
        render: ({ row: { startDate, endDate }, index }) => {
          return (
            <div className={commonStyles.linkStyle}>
              <Link
                href={`/performance/customer-service/product-breakdown?${encodeProductBreakdownURI(
                  {
                    weeksFromLatest: index,
                    startDate: startDate.mmddyyyy,
                    endDate: endDate.mmddyyyy,
                  },
                )}`}
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
            <span>{ci18n("Gross Merchandise Value", "GMV")}</span>
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
        render: ({ row: { gmv } }) =>
          gmv ? formatCurrency(gmv.amount, gmv.currencyCode) : "-",
      },
      {
        key: "orders",
        titleRender: () => (
          <>
            <span>
              {ci18n(
                "Number of times your products were bought in the date range",
                "Orders",
              )}
            </span>
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
            <span>
              {ci18n(" Number of chargebacks occurred", "Chargebacks")}
            </span>
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
            <span>
              {ci18n(
                " Number of chargebacks divided by number of orders",
                "Chargeback Ratio",
              )}
            </span>
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
            <span>
              {ci18n("Dollar value of the chargebacks", "Chargeback Amount")}
            </span>
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
        render: ({ row: { chargebackAmount } }) =>
          chargebackAmount
            ? formatCurrency(
                chargebackAmount.amount,
                chargebackAmount.currencyCode,
              )
            : "-",
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
            <span>{ci18n("Number of new tickets", "Tickets")}</span>
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
            <span>
              {ci18n(
                " Number of tickets divided by total number of orders",
                "Ticket Ratio",
              )}
            </span>
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
            <span>
              {ci18n(
                "Number of ticket responses rated",
                "Customer Satisfaction",
              )}
            </span>
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
          {
            name: ci18n("customer service creadcrumb home", "Home"),
            href: merchFeUrl("/md/home"),
          },
          {
            name: ci18n(
              "customer service creadcrumb performance",
              "Performance",
            ),
            href: merchFeUrl("/md/performance"),
          },
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
        <div className={commonStyles.toolkit} style={{ alignItems: "center" }}>
          <Title style={{ padding: 0 }} className={commonStyles.title}>
            {ci18n("aggregate benchmarks metrics", "Your Metrics")}
          </Title>

          {tableData && tableData.length > 0 && (
            <Button
              secondary
              onClick={() =>
                exportCSV({
                  type: EXPORT_CSV_TYPE.MERCHANT,
                  stats_type: EXPORT_CSV_STATS_TYPE.CUSTOMER_SERVICE,
                  currencyCode: currencyCodeForExportCSV,
                  target_date:
                    new Date(
                      tableData[tableData.length - 1].startDate.mmddyyyy,
                    ).getTime() / 1000,
                })
              }
            >
              {ci18n("export customer service csv", "Export CSV")}
            </Button>
          )}
        </div>

        {loading ? (
          <LoadingIndicator className={commonStyles.loading} />
        ) : tableData ? (
          <Table data={tableData} columns={columns} />
        ) : (
          <div>No data available</div>
        )}
      </PageGuide>
    </>
  );
};

export default observer(CustomerServiceAggregateModule);
