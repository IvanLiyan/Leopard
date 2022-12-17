import Link from "@core/components/Link";
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { LoadingIndicator, Alert } from "@ContextLogic/lego";
import PageHeader from "@core/components/PageHeader";
import { Table, Icon } from "@performance/components";
import { formatCurrency } from "@core/toolkit/currency";
import { MerchantStatsWeeklyArgs } from "@schema";
import {
  PERFORMANCE_AGGREGATE_DATA_QUERY,
  PickedSales,
  SalesAggregateResponseData,
} from "@performance/toolkit/sales";
import {
  REQUEST_WEEKS,
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import { TableColumn } from "@performance/components/Table";
import useSalesBaseColumn from "@performance/components/sales/SalesBaseColumn";
import {
  encodeProductBreakdownURI,
  useExportCSV,
} from "@performance/toolkit/utils";
import commonStyles from "@performance/styles/common.module.css";
import styles from "@performance/styles/sales.module.css";
import { merchFeURL } from "@core/toolkit/url";
import PageGuide from "@core/components/PageGuide";
import { useTheme } from "@core/stores/ThemeStore";

const SalesAggregateModel: React.FC = () => {
  const { textBlack } = useTheme();
  const exportCSV = useExportCSV();
  const salesBaseColumn = useSalesBaseColumn();
  const { data, loading: aggregateReqLoading } = useQuery<
    SalesAggregateResponseData,
    MerchantStatsWeeklyArgs
  >(PERFORMANCE_AGGREGATE_DATA_QUERY, {
    variables: {
      weeks: REQUEST_WEEKS,
    },
  });

  const currencyCodeForExportCSV = data?.currentMerchant?.primaryCurrency;

  const tableData: ReadonlyArray<PickedSales> | undefined = useMemo(() => {
    return data?.currentMerchant?.storeStats?.weekly?.map((week) => week.sales);
  }, [data?.currentMerchant?.storeStats?.weekly]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<PickedSales>> = [
      {
        key: "rangeDate",
        title: i`Date Range`,
        render: ({ row: { startDate, endDate }, index }) => {
          return (
            <div
              style={{ textAlign: "left" }}
              className={commonStyles.linkStyle}
            >
              <Link
                href={`/performance/sales/product-breakdown?${encodeProductBreakdownURI(
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
          <>
            <span>GMV</span>
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

    columns.splice(1, 0, ...salesBaseColumn);
    return columns;
  }, [salesBaseColumn, textBlack]);

  return (
    <>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeURL("/home") },
          { name: i`Performance`, href: merchFeURL("/performance-overview") },
          { name: i`Sales Performance`, href: window.location.href },
        ]}
        title={i`Sales Performance`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={i`Please refer to the metrics on the Wish Standards page as the definitive source for your performance.`}
        />
        <div className={commonStyles.toolkit}>
          <div />
          {tableData && tableData.length > 0 && (
            <Button
              secondary
              onClick={() =>
                exportCSV({
                  type: EXPORT_CSV_TYPE.MERCHANT,
                  stats_type: EXPORT_CSV_STATS_TYPE.PRESALE,
                  currencyCode: currencyCodeForExportCSV,
                  target_date:
                    new Date(tableData[0].startDate.mmddyyyy).getTime() / 1000,
                })
              }
            >
              Export CSV
            </Button>
          )}
        </div>
        <div className={styles.metricsModule}>
          {aggregateReqLoading ? (
            <LoadingIndicator className={commonStyles.loading} />
          ) : tableData ? (
            <Table data={tableData} columns={columns} />
          ) : (
            <div>No data available</div>
          )}
        </div>
      </PageGuide>
    </>
  );
};

export default observer(SalesAggregateModel);
