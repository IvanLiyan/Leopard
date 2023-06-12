import React, { useState, useMemo } from "react";
import Link from "@core/components/Link";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { ThemedLabel, Alert, LoadingIndicator } from "@ContextLogic/lego";
import { TableColumn } from "src/app/performance-cn/components/Table";
import Image from "@core/components/Image";
import {
  useDecodedProductBreakdownURI,
  useExportCSV,
} from "src/app/performance-cn/toolkit/utils";
import {
  CS_PERFORMANCE_BREAKDOWN_DATA_QUERY,
  AugmentedCustomerServiceBreakdown,
  CustomerServiceProductBreakdownResponseData,
  BreakdownRequestArgs,
} from "src/app/performance-cn/toolkit/csProductBreakdown";
import ProductBreakdownBenchMarksModel from "src/app/performance-cn/components/customer-service/ProductBreakdownBenchmarksModel";
import PageRoot from "@core/components/PageRoot";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { wishURL, contestImageURL } from "@core/toolkit/url";
import {
  addCommas,
  formatPercentage,
  round,
} from "src/app/core/toolkit/stringUtils";
import { Table, Title, Icon } from "src/app/performance-cn/components";
import {
  EXPORT_CSV_STATS_TYPE,
  PER_PAGE_LIMIT,
  EXPORT_CSV_TYPE,
} from "src/app/performance-cn/toolkit/enums";
import commonStyles from "@performance-cn/styles/common.module.css";
import { merchFeUrl } from "@core/toolkit/router";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useTheme } from "@core/stores/ThemeStore";

const ProductView: React.FC = () => {
  const [pageNo, setPageNo] = useState(0);
  const { textBlack } = useTheme();
  const exportCSV = useExportCSV();
  const { weeksFromLatest, startDate, endDate } =
    useDecodedProductBreakdownURI();
  const { data, loading: breakdownReqLoading } = useQuery<
    CustomerServiceProductBreakdownResponseData,
    BreakdownRequestArgs
  >(CS_PERFORMANCE_BREAKDOWN_DATA_QUERY, {
    variables: {
      offset: pageNo * PER_PAGE_LIMIT,
      limit: PER_PAGE_LIMIT,
      sort: { order: "DESC", field: "SALES" },
      weeks_from_the_latest: weeksFromLatest,
    },
    notifyOnNetworkStatusChange: true,
  });

  const currencyCodeForExportCSV = data?.currentMerchant?.primaryCurrency;

  const tableData:
    | ReadonlyArray<AugmentedCustomerServiceBreakdown>
    | undefined = useMemo(() => {
    return data?.productCatalog?.productsV2.map((product) => {
      const { weekly } = product.stats;
      return {
        id: product.id,
        startDate: weekly?.startDate,
        endDate: weekly?.endDate,
        ...weekly?.cs,
      };
    });
  }, [data?.productCatalog?.productsV2]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<AugmentedCustomerServiceBreakdown>> = [
      {
        key: "rangeDate",
        align: "left",
        titleRender: () => <span>Benchmark</span>,
        render: ({ row: { startDate: rowStartDate, endDate: rowEndDate } }) => {
          const displayStartDate = rowStartDate?.mmddyyyy || startDate;
          const displayEndDate = rowEndDate?.mmddyyyy || endDate;
          return (
            <div>
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
        align: "left",
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
        render: ({ row: { gmv } }) =>
          gmv ? formatCurrency(gmv.amount, gmv.currencyCode) : "-",
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
  }, [textBlack, startDate, endDate]);

  const dateRange =
    startDate && endDate ? i` - week of ${startDate} - ${endDate}` : "";

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeUrl("/home") },
          { name: i`Performance`, href: merchFeUrl("/performance-overview") },
          {
            name: i`Customer Service Performance`,
            href: "/performance/customer-service",
          },
          { name: i`Product Breakdown`, href: window.location.href },
        ]}
        title={i`Product Breakdown${dateRange}`}
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
        <div className={commonStyles.toolkit}>
          <Title style={{ margin: 0 }}>Your Product Metrics Breakdown</Title>
          {startDate && (
            <Button
              secondary
              onClick={() => {
                exportCSV({
                  type: EXPORT_CSV_TYPE.PRODUCT,
                  stats_type: EXPORT_CSV_STATS_TYPE.CUSTOMER_SERVICE,
                  currencyCode: currencyCodeForExportCSV,
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
          ) : tableData ? (
            <Table
              data={tableData}
              columns={columns}
              pagination={{
                pageNo,
                totalCount: data?.productCatalog?.productCountV2 || 0,
                pageChange: (pageNo: number) => {
                  setPageNo(pageNo);
                },
              }}
            />
          ) : (
            <div>No data available</div>
          )}
        </div>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(ProductView);
