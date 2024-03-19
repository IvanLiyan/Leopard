import React, { useState, useMemo } from "react";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import Image from "@core/components/Image";
import { formatCurrency } from "@core/toolkit/currency";
import { Alert, LoadingIndicator } from "@ContextLogic/lego";
import { wishURL, contestImageURL } from "@core/toolkit/url";
import PageRoot from "@core/components/PageRoot";
import {
  useDecodedProductBreakdownURI,
  useExportCSV,
} from "src/app/performance-cn/toolkit/utils";
import { Table, Icon } from "src/app/performance-cn/components";
import { TableColumn } from "src/app/performance-cn/components/Table";
import useSalesBaseColumn from "src/app/performance-cn/components/sales/SalesBaseColumn";
import {
  PERFORMANCE_BREAKDOWN_DATA_QUERY,
  AugmentedSalesBreakdown,
  SalesProductBreakdownResponseData,
  BreakdownRequestArgs,
} from "src/app/performance-cn/toolkit/salesProductBreakdown";
import {
  PER_PAGE_LIMIT,
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "src/app/performance-cn/toolkit/enums";
import styles from "@performance-cn/styles/sales.module.css";
import commonStyles from "@performance-cn/styles/common.module.css";
import Link from "@deprecated/components/Link";
import { merchFeUrl } from "@core/toolkit/router";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";

const SalesProductBreakdownPage: NextPage<Record<string, never>> = () => {
  const [pageNo, setPageNo] = useState(0);
  const { textBlack } = useTheme();
  const salesBaseColumn = useSalesBaseColumn();
  const exportCSV = useExportCSV();
  const { weeksFromLatest, startDate, endDate } =
    useDecodedProductBreakdownURI();
  const { data, loading: breakdownReqLoading } = useQuery<
    SalesProductBreakdownResponseData,
    BreakdownRequestArgs
  >(PERFORMANCE_BREAKDOWN_DATA_QUERY, {
    variables: {
      offset: pageNo * PER_PAGE_LIMIT,
      limit: PER_PAGE_LIMIT,
      sort: { order: "DESC", field: "SALES" },
      weeks_from_the_latest: weeksFromLatest,
    },
    notifyOnNetworkStatusChange: true,
  });

  const currencyCodeForExportCSV = data?.currentMerchant?.primaryCurrency;

  const tableData: ReadonlyArray<AugmentedSalesBreakdown> | undefined =
    useMemo(() => {
      return data?.productCatalog?.productsV2.map((product) => {
        const { weekly } = product.stats;
        return {
          id: product.id,
          startDate: weekly?.startDate,
          endDate: weekly?.endDate,
          ...weekly?.sales,
        };
      });
    }, [data?.productCatalog?.productsV2]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<AugmentedSalesBreakdown>> = [
      {
        key: "rangeDate",
        title: ci18n("sales range date", "Date Range"),
        align: "left",
        render: ({ row: { startDate: rowStartDate, endDate: rowEndDate } }) => {
          // check if we have data for the row; if not, bail to the overall page's data
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
        title: ci18n("sales product id", "Product Id"),
        align: "left",
        render: ({ row: { id } }) => {
          const url = wishURL(`/product/${id}?share=web`); // "?share=web" keep as old page url
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
            <span>{ci18n("Gross Merchandise Value", "GMV")}</span>
            <Tooltip
              title={
                <div style={{ fontSize: "14px" }}>
                  Gross merchandising value
                </div>
              }
              className={commonStyles.tableTooltip}
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row: { gmv } }) =>
          gmv ? formatCurrency(gmv.amount, gmv.currencyCode) : "-",
      },
    ];
    columns.splice(2, 0, ...salesBaseColumn);
    return columns;
  }, [salesBaseColumn, textBlack, startDate, endDate]);

  const dateRange =
    startDate && endDate ? i` - week of ${startDate} - ${endDate}` : "";

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          {
            name: ci18n("home page", "Home"),
            href: merchFeUrl("/md/home"),
          },
          {
            name: ci18n("performance page", "Performance"),
            href: merchFeUrl("/md/performance"),
          },
          {
            name: ci18n("sales performance page", "Sales Performance"),
            href: merchFeUrl("/md/performance/sales"),
          },
          {
            name: ci18n("sales performance page", "Product Breakdown"),
            href: window.location.href,
          },
        ]}
        title={i`Product Breakdown${dateRange}`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={i`Please refer to the metrics on the Wish Standards page as the definitive source for your performance.`}
        />
        <div className={commonStyles.toolkit}>
          <div />
          {startDate && currencyCodeForExportCSV && (
            <Button
              secondary
              onClick={() => {
                exportCSV({
                  type: EXPORT_CSV_TYPE.PRODUCT,
                  stats_type: EXPORT_CSV_STATS_TYPE.PRESALE,
                  currencyCode: currencyCodeForExportCSV,
                  target_date: new Date(startDate).getTime() / 1000,
                });
              }}
            >
              {ci18n("sales data export csv", "Export CSV")}
            </Button>
          )}
        </div>
        <div className={styles.metricsModule}>
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

export default observer(SalesProductBreakdownPage);
