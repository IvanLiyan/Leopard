import Link from "@core/components/Link";
import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { LoadingIndicator, Alert } from "@ContextLogic/lego";
import PageHeader from "@core/components/PageHeader";
import { Table, Icon } from "@performance/components";
import { formatCurrency } from "@core/toolkit/currency";
import { MerchantStatsWeeklyArgs } from "@schema";
import store, {
  PERFORMANCE_AGGREGATE_DATA_QUERY,
  AugmentedSalesAggregate,
  SalesAggregateResponseData,
} from "@performance/stores/Sales";
import {
  CURRENCY_CODE,
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

  useEffect(() => {
    // do some checking here to ensure data exist
    if (data) {
      // mutate data if you need to
      store.updateAggregateData(data);
    }
  }, [data]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn<AugmentedSalesAggregate>> = [
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
        render: ({ row: { gmv } }) => {
          const amount =
            store.aggregateCurrencyCode === CURRENCY_CODE.CNY
              ? gmv?.CNY_amount
              : gmv?.USD_amount;
          return amount
            ? formatCurrency(amount, store.aggregateCurrencyCode)
            : "-";
        },
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
          {store.aggregateCNYFlag ? (
            <div className={commonStyles.changeCurrencyCon}>
              <Button
                secondary
                disabled={store.aggregateCurrencyCode === CURRENCY_CODE.USD}
                onClick={() =>
                  store.updateAggregateCurrencyCode(CURRENCY_CODE.USD)
                }
              >
                Display in USD $
              </Button>
              <Button
                secondary
                disabled={store.aggregateCurrencyCode === CURRENCY_CODE.CNY}
                onClick={() =>
                  store.updateAggregateCurrencyCode(CURRENCY_CODE.CNY)
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
          <Button
            secondary
            onClick={() =>
              exportCSV({
                type: EXPORT_CSV_TYPE.PRODUCT,
                stats_type: EXPORT_CSV_STATS_TYPE.PRESALE,
                currencyCode: store.aggregateCurrencyCode,
                target_date:
                  new Date(
                    store.aggregateData[0].startDate.mmddyyyy,
                  ).getTime() / 1000,
              })
            }
          >
            Export CSV
          </Button>
        </div>
        <div className={styles.metricsModule}>
          {aggregateReqLoading ? (
            <LoadingIndicator className={commonStyles.loading} />
          ) : (
            <Table data={store.aggregateData} columns={columns} />
          )}
        </div>
      </PageGuide>
    </>
  );
};

export default observer(SalesAggregateModel);
