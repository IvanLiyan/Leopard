import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import Link from "@deprecated/components/Link";
import { useQuery } from "@apollo/client";
import { ThemedLabel, LoadingIndicator, Alert } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { Table, Title, Icon } from "src/app/performance-cn/components";
import BenchMarksModel from "src/app/performance-cn/components/refund/BenchMarksModel";
import { RefundAggregateResponseData } from "src/app/performance-cn/stores/Refund";
import { TableColumn } from "src/app/performance-cn/components/Table";
import useRefundBaseColumn from "src/app/performance-cn/components/refund/RefundBaseColumn";
import { zendeskURL } from "@core/toolkit/url";
import { MerchantStatsWeeklyArgs } from "@schema";
import {
  encodeProductBreakdownURI,
  useExportCSV,
} from "src/app/performance-cn/toolkit/utils";
import { PER_PAGE_LIMIT } from "src/app/performance-cn/toolkit/enums";
import store, {
  PERFORMANCE_AGGREGATE_DATA_QUERY,
  AugmentedRefundAggregate,
} from "src/app/performance-cn/stores/Refund";
import {
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "src/app/performance-cn/toolkit/enums";
import styles from "@performance-cn/styles/refund.module.css";
import commonStyles from "@performance-cn/styles/common.module.css";
import { merchFeUrl } from "@core/toolkit/router";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useTheme } from "@core/stores/ThemeStore";
import { addCommas, formatPercentage } from "@core/toolkit/stringUtils";
import { ci18n } from "@core/toolkit/i18n";

const RefundAggregateModule: React.FC = () => {
  const refundBaseColumn = useRefundBaseColumn();
  const { textBlack } = useTheme();
  const exportCSV = useExportCSV();
  const { data, loading } = useQuery<
    RefundAggregateResponseData,
    MerchantStatsWeeklyArgs
  >(PERFORMANCE_AGGREGATE_DATA_QUERY, {
    variables: {
      weeks: PER_PAGE_LIMIT,
    },
  });
  useEffect(() => {
    if (data && !loading) {
      store.updateAggregateData(data);
    }
  }, [data, loading]);

  const aggregateColumns = useMemo(() => {
    const columns: Array<TableColumn<AugmentedRefundAggregate>> = [
      {
        key: "rangeDate",
        title: ci18n("rangeDate", "Time Period"),
        align: "left",
        render: ({ row: { startDate, endDate }, index }) => {
          return (
            <div className={commonStyles.linkStyle}>
              <Link
                href={`/performance/refund/product-breakdown?${encodeProductBreakdownURI(
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
        key: "refunds",
        titleRender: () => (
          <>
            <span>
              {ci18n(
                "Number of refunds that occurred during the time period",
                "Refunds",
              )}
            </span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  <p>Number of refunds that occurred during the time period</p>
                  <Link href={zendeskURL("204531528")} light openInNewTab>
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
        key: "refundRate",
        titleRender: () => (
          <>
            <span>
              {ci18n(
                "Percent of total transactions that were refunded",
                "Refund Rate",
              )}
            </span>
            <Tooltip
              className={commonStyles.tableTooltip}
              title={
                <div style={{ fontSize: "14px" }}>
                  <p>Percent of total transactions that were refunded</p>
                  <Link href={zendeskURL("204531528")} light openInNewTab>
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
          row.refundRate == null ? (
            "-"
          ) : row.refundRate > 0.1 ? (
            <ThemedLabel theme={"Red"} className={commonStyles.themedLabel}>
              {formatPercentage(String(row.refundRate), "1", 2)}
            </ThemedLabel>
          ) : (
            formatPercentage(String(row.refundRate), "1", 2)
          ),
      },
    ];
    columns.push(...refundBaseColumn);
    return columns;
  }, [refundBaseColumn, textBlack]);

  return (
    <>
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
            name: ci18n("refund performance page", "Refund Performance"),
            href: window.location.href,
          },
        ]}
        title={ci18n(
          "its a page title for refund performance page",
          "Refund Performance",
        )}
      />
      <PageGuide relaxed style={{ paddingTop: 20 }}>
        <Alert
          sentiment="info"
          style={{ "margin-bottom": "10px" }}
          text={i`Please refer to the metrics on the Wish Standards page as the definitive source for your performance.`}
        />
        <Alert
          sentiment="warning"
          title={i`Enroll in the Wish Returns Program`}
          text={i`Customers have to ship products back to your warehouse before receiving a refund.`}
          link={{
            url: zendeskURL("360050732014"),
            text: ci18n("Enroll in the Wish Returns Program", "Learn more"),
          }}
        />
        <BenchMarksModel />

        <div className={styles.metricsModule}>
          <div
            className={commonStyles.toolkit}
            style={{ alignItems: "flex-end", paddingTop: 0 }}
          >
            <div className={styles.desc}>
              <Title
                className={commonStyles.title}
                style={{ marginTop: "2px" }}
              >
                {ci18n("refund breakdown metrics", "Your Metrics")}
              </Title>
              {store.aggregateData[0]?.refundRatePercentile && (
                <span>
                  {i`Last week your refund rate was higher than ${store.aggregateData[0]?.refundRatePercentile}% of merchants on Wish.`}
                </span>
              )}

              <Link
                href={zendeskURL("204531528")}
                className={commonStyles.linkStyle}
                openInNewTab
              >
                How to improve my Refund Metrics?
              </Link>
            </div>
            {store.aggregateData && store.aggregateData.length > 0 && (
              <Button
                secondary
                onClick={() =>
                  exportCSV({
                    type: EXPORT_CSV_TYPE.MERCHANT,
                    stats_type: EXPORT_CSV_STATS_TYPE.REFUND_BREAKDOWN,
                    target_date:
                      new Date(
                        store.aggregateData[
                          store.aggregateData.length - 1
                        ].startDate.mmddyyyy,
                      ).getTime() / 1000,
                  })
                }
              >
                {ci18n("export refunde breakdown csv", "Export CSV")}
              </Button>
            )}
          </div>
          {loading ? (
            <LoadingIndicator className={commonStyles.loading} />
          ) : (
            <Table data={store.aggregateData} columns={aggregateColumns} />
          )}
        </div>
      </PageGuide>
    </>
  );
};

export default observer(RefundAggregateModule);
