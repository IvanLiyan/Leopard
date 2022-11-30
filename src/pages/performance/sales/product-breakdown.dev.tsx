import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import Image from "@core/components/Image";
import Icon from "@core/components/Icon";
import { formatCurrency } from "@core/toolkit/currency";
import { Alert, LoadingIndicator } from "@ContextLogic/lego";
import { useUserStore } from "@core/stores/UserStore";
import { useToastStore } from "@core/stores/ToastStore";
import { wishURL, contestImageURL } from "@core/toolkit/url";
import PageRoot from "@core/components/PageRoot";
import { exportCSV, isBD } from "@performance/toolkit/utils";
import { Table } from "@performance/components";
import { TableColumn, useSalesBaseColumn } from "@performance/components/Table";
import store, {
  PERFORMANCE_BREAKDOWN_DATA_QUERY,
  AugmentedSalesBreakdown,
  SalesProductBreakdownResponseData,
  BreakdownRequestArgs,
} from "@performance/stores/Sales";
import {
  CURRENCY_CODE,
  PER_PAGE_LIMIT,
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import styles from "@performance/styles/sales.module.css";
import commonStyles from "@performance/styles/common.module.css";
import Link from "@core/components/Link";
import { merchFeURL } from "@core/toolkit/url";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useTheme } from "@core/stores/ThemeStore";

const SalesProductBreakdownPage: NextPage<Record<string, never>> = () => {
  const toastStore = useToastStore();
  const { textBlack } = useTheme();
  const salesBaseColumn = useSalesBaseColumn();
  const { loggedInMerchantUser } = useUserStore();
  const { merchantId, id, roles } = loggedInMerchantUser || {};
  const isBDUser = isBD(roles || []);
  const exportId = isBDUser ? id : merchantId;
  const router = useRouter();
  const {
    data: breakdownData,
    loading: breakdownReqLoading,
    refetch,
  } = useQuery<SalesProductBreakdownResponseData, BreakdownRequestArgs>(
    PERFORMANCE_BREAKDOWN_DATA_QUERY,
    {
      variables: {
        offset: 0,
        limit: 20 || PER_PAGE_LIMIT,
        sort: { order: "DESC", field: "SALES" },
        weeks_from_the_latest: Number(router.query.weeks_from_the_latest) || 0,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    if (breakdownData && !breakdownReqLoading) {
      store.updataBreakdownData(breakdownData);
    }
  }, [breakdownData, breakdownReqLoading]);

  const columns = useMemo(() => {
    const columns: Array<TableColumn> = [
      {
        key: "rangeDate",
        title: i`Date Range`,
        render: ({ row: { startDate, endDate } }) => (
          <div style={{ textAlign: "left" }}>
            {`${startDate.mmddyyyy}-${endDate.mmddyyyy}`}
          </div>
        ),
      },
      {
        key: "id",
        title: i`Product Id`,
        render: ({ value }) => {
          const valueCast = value as AugmentedSalesBreakdown["id"];
          const url = wishURL(`/product/${valueCast}?share=web`); // "?share=web" keep as old page url
          return (
            <div className={commonStyles.productColumn}>
              <Image
                src={contestImageURL(valueCast, "tiny")}
                alt={i`Picture of product`}
                style={{
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  marginRight: "10px",
                }}
              />
              <Link href={url} openInNewTab>
                {valueCast}
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
        render: ({ value }) => {
          const valueCast = value as AugmentedSalesBreakdown["gmv"];
          const amount =
            store.breakdownCurrencyCode === CURRENCY_CODE.CNY
              ? valueCast?.CNY_amount
              : valueCast?.USD_amount;
          return amount
            ? formatCurrency(amount, store.breakdownCurrencyCode)
            : "-";
        },
      },
    ];
    columns.splice(2, 0, ...salesBaseColumn);
    return columns;
  }, [salesBaseColumn, textBlack]);

  const dateRange =
    store.breakdownData.length > 0
      ? i`- week of ${store.breakdownData[0].startDate.mmddyyyy} - ${store.breakdownData[0].endDate.mmddyyyy}`
      : "";

  return (
    <PageRoot>
      <PageHeader
        relaxed
        breadcrumbs={[
          { name: i`Home`, href: merchFeURL("/home") },
          { name: i`Performance`, href: merchFeURL("/performance-overview") },
          {
            name: i`Sales Performance`,
            href: "/performance/sales",
          },
          { name: i`Product Breakdown`, href: window.location.href },
        ]}
        title={i`Product Breakdown ${dateRange}`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={i`Please refer to the metrics on the Wish Standards page as the
          definitive source for your performance.`}
        />
        <div className={commonStyles.toolkit} style={{ height: "45px" }}>
          {store.productCNYFlag && (
            <div>
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
          <Button
            secondary
            onClick={() =>
              exportCSV({
                type: EXPORT_CSV_TYPE.PRODUCT,
                stats_type: EXPORT_CSV_STATS_TYPE.PRESALE,
                id: exportId,
                isBDUser,
                currencyCode: store.breakdownCurrencyCode,
                target_date:
                  new Date(
                    store.breakdownData[0].startDate.mmddyyyy,
                  ).getTime() / 1000,
              })
            }
          >
            Export CSV
          </Button>
        </div>
        <div className={styles.metricsModule}>
          {breakdownReqLoading ? (
            <LoadingIndicator className={styles.loading} />
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

export default observer(SalesProductBreakdownPage);
