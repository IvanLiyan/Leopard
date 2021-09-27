/* eslint-disable filenames/match-regex */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { DownloadButton } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightBold, weightMedium } from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBSProductStatsTable from "@merchant/component/logistics/fbs/performance/FBSProductStatsTable";

/* Merchant API */
import * as fbsApi from "@merchant/api/fbs";

/* Toolkit */
import { getDateRange } from "@toolkit/fbs";
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbs";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { DateRange, TimePeriod } from "@toolkit/fbs";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

export type FBSTopSellersProps = BaseProps & {
  readonly currency: string;
  readonly timePeriod: TimePeriod;
  readonly title: string;
  readonly subtitle: string | null | undefined;
};

const FBSTopSellers = (props: FBSTopSellersProps) => {
  const { className, style, timePeriod, title, subtitle } = props;
  const styles = useStyleSheet();
  const navigationStore = useNavigationStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set([]));
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));
  const today = moment();
  const dateRange = getDateRange(timePeriod, today);

  const pageSize = 10;
  const request = fbsApi.getProductStats({
    start_date: dateRange.startDate,
    end_date: dateRange.endDate,
  });
  const productVariations = request.response?.data?.results;
  const pageActionLogger = useLogger("FBS_PERFORMANCE_PAGE_ACTION");

  if (productVariations == null) {
    return (
      <div className={css(styles.root, className, style)}>
        <div className={css(styles.header)}>
          <div className={css(styles.titleContent)}>
            <Markdown text={title} className={css(styles.title)} />
          </div>
        </div>
        <LoadingIndicator />
      </div>
    );
  }

  const topProductVariations = productVariations.slice(0, 50);
  const totalItems = topProductVariations.length;
  const rangeStart = currentPage * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize + pageSize, totalItems);
  const displayedRows = topProductVariations.slice(rangeStart - 1, rangeEnd);

  const exportCSV = (dateRange: DateRange) => {
    pageActionLogger.info({
      action: LogActions.CLICK_DOWNLOAD_TOP_SELLERS_REPORT,
      detail: [dateRange.startDate, dateRange.endDate].join(),
    });
    navigationStore.download(
      `/fbs/product-stats/export` +
        `?start_date=${dateRange.startDate}` +
        `&end_date=${dateRange.endDate}`
    );
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.header)}>
        <div className={css(styles.titleContent)}>
          <Markdown text={title} className={css(styles.title)} />
          {subtitle && (
            <Markdown text={`(${subtitle})`} className={css(styles.subtitle)} />
          )}
        </div>
        <div className={css(styles.tableActions)}>
          <PageIndicator
            totalItems={totalItems}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            hasNext={currentPage < totalItems / pageSize - 1}
            hasPrev={currentPage > 0}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              setSelectedRows(new Set());
              setExpandedRows(new Set());
            }}
          />
          <DownloadButton
            style={styles.downloadButton}
            onClick={() => {
              exportCSV(dateRange);
            }}
            popoverContent={null}
          >
            <Markdown
              className={css(styles.downloadText)}
              text={i`Download report`}
            />
          </DownloadButton>
        </div>
      </div>
      <FBSProductStatsTable
        rows={displayedRows}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        expandedRows={expandedRows}
        setExpandedRows={setExpandedRows}
        noDataMessage={
          i`Within the next few days, you will be able to see ` +
          i`your FBS top-selling products' performance insights here.`
        }
      />
    </div>
  );
};

export default observer(FBSTopSellers);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        header: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0px 24px 20px 24px",
        },
        titleContent: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        title: {
          color: palettes.textColors.Ink,
          fontSize: 20,
          fontWeight: weightBold,
          marginRight: 8,
        },
        subtitle: {
          color: palettes.textColors.LightInk,
          fontSize: 16,
          fontWeight: weightMedium,
          verticalAlign: "middle",
        },
        tableActions: {
          display: "flex",
          flexDirection: "row",
        },
        downloadButton: {
          marginLeft: 8,
          padding: "10px 16px",
          color: palettes.textColors.Ink,
        },
        downloadText: {
          color: palettes.textColors.LightInk,
          fontSize: 14,
          fontWeight: weightMedium,
        },
      }),
    []
  );
};
