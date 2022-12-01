import React, { useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import Link from "@core/components/Link";
import { useQuery } from "@apollo/client";
import { ThemedLabel, LoadingIndicator, Alert } from "@ContextLogic/lego";
import { Tooltip } from "@mui/material";
import { Button } from "@ContextLogic/atlas-ui";
import { Table, Title, Icon } from "@performance/components";
import BenchMarksModel from "@performance/components/refund/BenchMarksModel";
import { RefundAggregateResponseData } from "@performance/stores/Refund";
import { TableColumn } from "@performance/components/Table";
import useRefundBaseColumn from "@performance/components/refund/RefundBaseColumn";
import { zendeskURL } from "@core/toolkit/url";
import { MerchantStatsWeeklyArgs } from "@schema";
import { useExportCSV } from "@performance/toolkit/utils";
import { PER_PAGE_LIMIT } from "@performance/toolkit/enums";
import store, {
  PERFORMANCE_AGGREGATE_DATA_QUERY,
  AugmentedRefundAggregate,
} from "@performance/stores/Refund";
import {
  EXPORT_CSV_STATS_TYPE,
  EXPORT_CSV_TYPE,
} from "@performance/toolkit/enums";
import styles from "@performance/styles/refund.module.css";
import commonStyles from "@performance/styles/common.module.css";
import { merchFeURL } from "@core/toolkit/url";
import PageGuide from "@core/components/PageGuide";
import PageHeader from "@core/components/PageHeader";
import { useTheme } from "@core/stores/ThemeStore";
import { addCommas, formatPercentage } from "@core/toolkit/stringUtils";

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
      store.updataAggregateData(data);
    }
  }, [data, loading]);

  const aggregateColumns = useMemo(() => {
    const columns: Array<TableColumn<AugmentedRefundAggregate>> = [
      {
        key: "rangeDate",
        title: i`Time Period`,
        render: ({ row, index }) => {
          return (
            <div
              style={{ textAlign: "left" }}
              className={commonStyles.linkStyle}
            >
              <Link
                href={`/performance/refund/product-breakdown?weeks_from_the_latest=${index}`}
              >
                {`${row.startDate.mmddyyyy}-${row.endDate.mmddyyyy}`}
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
            <span>Refund Rate</span>
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
          { name: i`Home`, href: merchFeURL("/home") },
          { name: i`Performance`, href: merchFeURL("/performance-overview") },
          { name: i` Refund Performance`, href: window.location.href },
        ]}
        title={i`Refund Performance`}
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
            text: i`Learn more`,
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
                Your Metrics
              </Title>
              <span>
                Last week your refund rate was higher than 36% of merchants on
                Wish.
              </span>
              <Link
                href={zendeskURL("204531528")}
                className={commonStyles.linkStyle}
                openInNewTab
              >
                How to improve my Refund Metrics?
              </Link>
            </div>
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
              Export CSV
            </Button>
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
