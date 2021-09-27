import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { H4Markdown } from "@ContextLogic/lego";
// import { IconButton } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Pager as PagerHeader } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
// import { download } from "@assets/icons";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { formatNumeral } from "@ContextLogic/lego/toolkit/string";
import { useIntEnumQueryParam, useStringEnumQueryParam } from "@toolkit/url";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import {
  getLocalizedDateDisplayText,
  getDateDisplayText,
} from "@toolkit/brand/branded-products/utils";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

/* Relative Imports */
import TitleMetric from "./TitleMetric";
import BrandPerformanceChart from "./BrandPerformanceChart";
import BrandPerformanceTable from "./BrandPerformanceTable";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant API */
import { getBrandPerformanceOverviewMetcis } from "@merchant/api/brand/branded-product-overview";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BrandPerformanceOverviewState, {
  TabKey,
} from "@merchant/model/brand/branded-products/BrandPerformanceOverviewState";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type BrandPerformanceOverviewProps = BaseProps & {
  readonly lastDayUnix: number;
  readonly currencyCode: string;
};

const NUM_WEEKS_OPTIONS = [1, 4, 12] as const;
type NumWeeks = typeof NUM_WEEKS_OPTIONS[number];

const getNWeeksBackDate = (timestamp: number, numWeeks: number) => {
  return moment
    .unix(timestamp)
    .subtract(numWeeks, "weeks")
    .add(1, "day")
    .format("M/D/YY");
};

const getLocalizedNWeeksBackDate = (timestamp: number, numWeeks: number) => {
  return formatDatetimeLocalized(
    moment.unix(timestamp).subtract(numWeeks, "weeks").add(1, "day"),
    "M/D/YY"
  );
};

const getDateRangeOptions = (timestamp: number) => {
  const lastDate = getLocalizedDateDisplayText(timestamp);
  return NUM_WEEKS_OPTIONS.map((n) => {
    const weekOrWeeks = ni18n(n, "Week", "%1$d Weeks");
    return {
      value: n,
      text: `${weekOrWeeks} (${getLocalizedNWeeksBackDate(
        timestamp,
        n
      )} - ${lastDate})`,
    };
  });
};

const BrandPerformanceOverview = ({
  lastDayUnix,
  currencyCode,
  className,
}: BrandPerformanceOverviewProps) => {
  const styles = useStylesheet();
  const { primaryLight } = useTheme();

  const [numWeeks, setNumWeeks] = useIntEnumQueryParam<NumWeeks>(
    "num_weeks",
    1
  );
  const [tabKey, setTabKeyParam] = useStringEnumQueryParam<TabKey>(
    "tab",
    "gmv"
  );
  const [pageState] = useState<BrandPerformanceOverviewState>(
    new BrandPerformanceOverviewState({ currencyCode, tabKey })
  );

  const [response] = useRequest(
    getBrandPerformanceOverviewMetcis({
      start_date: getNWeeksBackDate(lastDayUnix, numWeeks),
      end_date: getDateDisplayText(lastDayUnix, "M/D/YY"),
    })
  );

  useEffect(() => {
    if (!response?.data) {
      pageState.isLoading = true;
    } else {
      pageState.processResponse(response.data);
      pageState.isLoading = false;
    }
  }, [pageState, response]);

  const setTabKey = (tabKey: TabKey) => {
    setTabKeyParam(tabKey);
    pageState.tabKey = tabKey;
  };

  // const downloadReportUrl = "branded-product/overview/download-report";

  const totalGMV = formatCurrency(pageState.totalGMV, pageState.currencyCode);
  const totalOrders = formatNumeral(pageState.totalOrders);
  const totalImpressions = formatNumeral(pageState.totalImpressions);

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.headerContainer)}>
        <H4Markdown text={i`Brand Performance Overview`} />
        {/* Will be implemented in MKL-14335
        {!pageState.isLoading && (
          <IconButton href={downloadReportUrl} icon={download}>
            Download report
          </IconButton>
        )} */}
      </div>
      <Card className={css(styles.card)}>
        <LoadingIndicator loadingComplete={!pageState.isLoading}>
          <div className={css(styles.row)}>
            <PagerHeader
              selectedTabKey={pageState.tabKey}
              onTabChange={setTabKey}
              className={css(styles.pagerHeader)}
              tabItemHoverColor={primaryLight}
              equalSizeTabs
              renderActiveLineAbove
            >
              <PagerHeader.Content
                tabKey="gmv"
                titleValue={() => (
                  <TitleMetric
                    title={i`Total GMV`}
                    illustration="gmvIcon"
                    value={totalGMV}
                  />
                )}
              />
              <PagerHeader.Content
                tabKey="orders"
                titleValue={() => (
                  <TitleMetric
                    title={i`Total Orders`}
                    illustration="ordersIcon"
                    value={totalOrders}
                  />
                )}
              />
              <PagerHeader.Content
                tabKey="impressions"
                titleValue={() => (
                  <TitleMetric
                    title={i`Total Impressions`}
                    illustration="impressionsIcon"
                    value={totalImpressions}
                  />
                )}
              />
            </PagerHeader>
            <div className={css(styles.dateRangeContainer)}>
              <Select
                options={getDateRangeOptions(lastDayUnix)}
                selectedValue={numWeeks}
                onSelected={(v: NumWeeks) => setNumWeeks(v)}
                buttonHeight={40}
              />
            </div>
          </div>
          <BrandPerformanceChart
            pageState={pageState}
            className={css(styles.chart)}
          />
          <BrandPerformanceTable pageState={pageState} />
        </LoadingIndicator>
      </Card>
    </div>
  );
};

export default observer(BrandPerformanceOverview);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {},
        headerContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        },
        card: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: 20,
        },
        row: {
          display: "flex",
          flexDirection: "row",
        },
        dateRangeContainer: {
          width: "25%",
          padding: 24,
        },
        pagerHeader: {
          width: "75%",
        },
        chart: {
          margin: 20,
          marginBottom: 30,
        },
      }),
    []
  );
