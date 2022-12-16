import React, { useEffect, useMemo } from "react";
import Link from "@core/components/Link";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { ThemedLabel, Alert, LoadingIndicator } from "@ContextLogic/lego";
import { TableColumn } from "@performance/components/Table";
import Image from "@core/components/Image";
import { useExportCSV } from "@performance/toolkit/utils";
import store, {
  CS_PERFORMANCE_BREAKDOWN_DATA_QUERY,
  AugmentedCustomerServiceBreakdown,
  CustomerServiceProductBreakdownResponseData,
  BreakdownRequestArgs,
} from "@performance/stores/CustomerService";
import ProductBreakdownBenchMarksModel from "@performance/components/customer-service/ProductBreakdownBenchmarksModel";
import PageRoot from "@core/components/PageRoot";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { useToastStore } from "@core/stores/ToastStore";
import { wishURL, contestImageURL } from "@core/toolkit/url";
import {
  addCommas,
  formatPercentage,
  round,
} from "src/app/core/toolkit/stringUtils";
import { Table, Title, Icon } from "@performance/components";
import {
  CURRENCY_CODE,
  EXPORT_CSV_STATS_TYPE,
  PER_PAGE_LIMIT,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import commonStyles from "@performance/styles/common.module.css";
import { merchFeURL } from "@core/toolkit/url";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useTheme } from "@core/stores/ThemeStore";

const ProductView: React.FC = () => {
  const toastStore = useToastStore();
  const { textBlack } = useTheme();
  const exportCSV = useExportCSV();
  const router = useRouter();
  const {
    data: breakdownData,
    loading: breakdownReqLoading,
    refetch,
  } = useQuery<
    CustomerServiceProductBreakdownResponseData,
    BreakdownRequestArgs
  >(CS_PERFORMANCE_BREAKDOWN_DATA_QUERY, {
    variables: {
      offset: 0,
      limit: 20 || PER_PAGE_LIMIT,
      sort: { order: "DESC", field: "SALES" },
      weeks_from_the_latest: Number(router.query.weeks_from_the_latest) || 0,
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (breakdownData && !breakdownReqLoading) {
      store.updataBreakdownData(breakdownData);
    }
  }, [breakdownData, breakdownReqLoading]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<AugmentedCustomerServiceBreakdown>> = [
      {
        key: "rangeDate",
        titleRender: () => <span>Benchmark</span>,
        render: ({ row: { startDate, endDate } }) => {
          const displayStartDate =
            startDate?.mmddyyyy || router.query.start_date;
          const displayEndDate = endDate?.mmddyyyy || router.query.end_date;
          return (
            <div style={{ textAlign: "left" }}>
              {displayStartDate && displayEndDate
                ? `${displayStartDate}-${displayEndDate}`
                : "-"}
            </div>
          );
        },
      },
      {
        key: "id",
        title: i`Product Id`,
        render: ({ row: { id } }) => {
          const url = wishURL(`/product/${id}`);
          return (
            <div className={commonStyles.productColumn}>
              <Image
                src={contestImageURL(id, "tiny")}
                alt={i`Picture of product`}
              />
              <Link
                href={url}
                openInNewTab
                style={{ marginLeft: "10px" }}
                className={commonStyles.linkStyle}
              >
                {id}
              </Link>
            </div>
          );
        },
      },
      {
        key: "gmv",
        titleRender: () => (
          <>
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
          </>
        ),
        render: ({ row: { gmv } }) => {
          const amount =
            store.breakdownCurrencyCode === CURRENCY_CODE.CNY
              ? gmv?.CNY_amount
              : gmv?.USD_amount;
          return amount
            ? formatCurrency(amount, store.breakdownCurrencyCode)
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
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { orders } }) =>
          orders == null || orders == 0 ? "-" : addCommas(String(orders)),
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
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { orders30d } }) =>
          orders30d == null || orders30d == 0
            ? "-"
            : addCommas(String(orders30d)),
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
        render: ({ row: { refund30d } }) =>
          refund30d == null || refund30d == 0 ? "-" : String(refund30d),
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
        render: ({ row: { orders93d } }) =>
          orders93d == null || orders93d == 0
            ? "-"
            : addCommas(String(orders93d)),
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
        render: ({ row: { refund93d } }) =>
          refund93d == null || refund93d == 0 ? "-" : String(refund93d),
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
        key: "averageRating30d",
        titleRender: () => (
          <>
            <span>Average Rating</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  Average rating for the product
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { averageRating30d } }) =>
          averageRating30d == null
            ? "-"
            : averageRating30d == 0
            ? "0"
            : round(String(averageRating30d), 1),
      },
    ];
    return columns;
  }, [textBlack, router.query.start_date, router.query.end_date]);

  const dateRange =
    store.breakdownData.length > 0
      ? i`- week of ${router.query.start_date || ""} - ${
          router.query.end_date || ""
        }`
      : "";

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeURL("/home") },
          { name: i`Performance`, href: merchFeURL("/performance-overview") },
          {
            name: i`Customer Service Performance`,
            href: "/performance/customer-service",
          },
          { name: i`Product Breakdown`, href: window.location.href },
        ]}
        title={i`Product Breakdown ${dateRange}`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={
            i`Please refer to the metrics on the Wish Standards page as the ` +
            i`definitive source for your performance.`
          }
        />
        <ProductBreakdownBenchMarksModel />
        <div className={commonStyles.toolkit} style={{ paddingBottom: "0px" }}>
          <div className={commonStyles.toolkitLeft}>
            <Title
              className={commonStyles.title}
              desc={i`There are only stats for products with at least one action in the week`}
            >
              Your Product Metrics Breakdown
            </Title>
          </div>
        </div>
        <div className={commonStyles.toolkit} style={{ paddingTop: "0px" }}>
          {store.productCNYFlag && (
            <div className={commonStyles.changeCurrencyCon}>
              <Button
                secondary
                disabled={store.breakdownCurrencyCode === CURRENCY_CODE.USD}
                onClick={() =>
                  store.updateBreakdownCurrencyCode(CURRENCY_CODE.USD)
                }
              >
                Display in USD $
              </Button>
              <Button
                secondary
                disabled={store.breakdownCurrencyCode === CURRENCY_CODE.CNY}
                onClick={() =>
                  store.updateBreakdownCurrencyCode(CURRENCY_CODE.CNY)
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
          )}
          {store.breakdownData[0]?.startDate?.mmddyyyy && (
            <Button
              secondary
              onClick={() => {
                // above assertion confirms this will not be null
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const startDate = store.breakdownData[0]!.startDate!.mmddyyyy;
                exportCSV({
                  type: EXPORT_CSV_TYPE.PRODUCT,
                  stats_type: EXPORT_CSV_STATS_TYPE.CUSTOMER_SERVICE,
                  currencyCode: store.breakdownCurrencyCode,
                  target_date: new Date(startDate).getTime() / 1000,
                });
              }}
            >
              Export CSV
            </Button>
          )}
        </div>
        <div>
          {breakdownReqLoading ? (
            <LoadingIndicator className={commonStyles.loading} />
          ) : (
            <Table
              data={store.breakdownData}
              columns={columns}
              pagination={{
                pageNo: store.pageNo,
                totalCount: store.breakdownDataTotalCount,
                pageChange: (pageNo: number) => {
                  refetch({ offset: pageNo * PER_PAGE_LIMIT })
                    .then(() => {
                      store.updatePageNo(pageNo);
                    })
                    .catch(({ message }: { message: string }) => {
                      toastStore.error(message);
                    });
                },
              }}
            />
          )}
        </div>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(ProductView);
