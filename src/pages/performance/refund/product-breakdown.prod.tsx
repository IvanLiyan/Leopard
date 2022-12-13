import React, { useEffect, useMemo } from "react";
import Link from "@core/components/Link";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Button } from "@ContextLogic/atlas-ui";
import { Tooltip } from "@mui/material";
import { css } from "@core/toolkit/styling";
import { LoadingIndicator, Alert } from "@ContextLogic/lego";
import Image from "@core/components/Image";
import { Table, Icon } from "@performance/components";
import PageRoot from "@core/components/PageRoot";
import {
  wishURL,
  contestImageURL,
  merchFeURL,
  zendeskURL,
} from "@core/toolkit/url";
import { useToastStore } from "@core/stores/ToastStore";
import { useExportCSV } from "@performance/toolkit/utils";
import { TableColumn } from "@performance/components/Table";
import useRefundBaseColumn from "@performance/components/refund/RefundBaseColumn";
import store, {
  PERFORMANCE_BREAKDOWN_DATA_QUERY,
  AugmentedRefundBreakdown,
  BreakdownRequestArgs,
  RefundBreakdownResponseData,
} from "@performance/stores/Refund";
import {
  PER_PAGE_LIMIT,
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import styles from "@performance/styles/refund.module.css";
import commonStyles from "@performance/styles/common.module.css";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";
import { addCommas } from "@core/toolkit/stringUtils";
import { useTheme } from "@core/stores/ThemeStore";

const ProductBreakdownPage = () => {
  const toastStore = useToastStore();

  const refundBaseColumn = useRefundBaseColumn();
  const { textBlack } = useTheme();
  const exportCSV = useExportCSV();
  const router = useRouter();
  const { data, loading, refetch } = useQuery<
    RefundBreakdownResponseData,
    BreakdownRequestArgs
  >(PERFORMANCE_BREAKDOWN_DATA_QUERY, {
    variables: {
      offset: 0,
      limit: 20 || PER_PAGE_LIMIT,
      sort: { order: "DESC", field: "SALES" },
      weeks_from_the_latest: Number(router.query.weeks_from_the_latest) || 0,
    },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data && !loading) {
      store.updateBreakdownData(data);
    }
  }, [data, loading]);

  const breakdownColumns = useMemo(() => {
    const columns: Array<TableColumn<AugmentedRefundBreakdown>> = [
      {
        key: "RangeDate",
        title: i`Time Period`,
        render: ({ row }) => {
          return (
            <div style={{ textAlign: "left" }}>
              {`${row.startDate.mmddyyyy}-${row.endDate.mmddyyyy}`}
            </div>
          );
        },
      },
      {
        key: "id",
        title: i`Product Id`,
        render: ({ row }) => {
          const url = wishURL(`/product/${row.id}?share=web`);
          return (
            <div className={commonStyles.productColumn}>
              <Image
                src={contestImageURL(row.id, "tiny")}
                alt={i`Picture of product`}
              />
              <Link
                href={url}
                openInNewTab
                style={{ marginLeft: "10px" }}
                className={commonStyles.linkStyle}
              >
                {row.id}
              </Link>
            </div>
          );
        },
      },
      {
        key: "refunds",
        titleRender: () => (
          <>
            <span>Refunds</span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  <p>Number of refunds that occurred during the time period</p>
                  <Link
                    href={zendeskURL("204531528")}
                    className={commonStyles.linkStyle}
                    openInNewTab
                  >
                    What is included in the refund rate?
                  </Link>
                </div>
              }
            >
              <Icon name="help" size={20} color={textBlack} />
            </Tooltip>
          </>
        ),
        render: ({ row }) =>
          row.refunds == null ? "-" : addCommas(String(row.refunds)),
      },
      {
        key: "isReturnsEnabled",
        title: i`Returns Enrolled`,
        render: ({ row }) => {
          return row.isReturnsEnabled ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex" }}>
                <span>Yes</span>
                <Icon
                  className={css(styles.burger)}
                  name="checkCircle"
                  size={20}
                  color={textBlack}
                  style={{ paddingLeft: "4px", paddingRight: "6px" }}
                />
                <Link
                  href={merchFeURL(
                    `/product/return-setting/${row.id}#tab=product`,
                  )}
                  className={commonStyles.linkStyle}
                  openInNewTab
                >
                  View
                </Link>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex" }}>
                <span>No</span>
                <Icon
                  className={css(styles.burger)}
                  name="error"
                  size={20}
                  color={textBlack}
                  style={{ paddingLeft: "4px", paddingRight: "6px" }}
                />
                <Link
                  href={merchFeURL(
                    `/product/return-setting/${row.id}#tab=product`,
                  )}
                  className={commonStyles.linkStyle}
                  openInNewTab
                >
                  Enroll
                </Link>
              </div>
            </div>
          );
        },
      },
    ];
    columns.splice(3, 0, ...refundBaseColumn);
    return columns;
  }, [refundBaseColumn, textBlack]);

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
            name: i`Refund Performance`,
            href: "/performance/refund",
          },
          { name: i`Product Breakdown`, href: window.location.href },
        ]}
        title={i`Product Breakdown ${dateRange}`}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          text={i`Please refer to the metrics on the Wish Standards page as the definitive source for your performance.`}
        />
        <div className={styles.metricsModule}>
          <div className={commonStyles.toolkit}>
            <div></div>
            <Button
              secondary
              onClick={() =>
                exportCSV({
                  type: EXPORT_CSV_TYPE.PRODUCT,
                  stats_type: EXPORT_CSV_STATS_TYPE.REFUND_BREAKDOWN,
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
          {loading ? (
            <LoadingIndicator className={commonStyles.loading} />
          ) : (
            store.breakdownData.length > 0 && (
              <Table
                data={store.breakdownData}
                columns={breakdownColumns}
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
            )
          )}
        </div>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(ProductBreakdownPage);
