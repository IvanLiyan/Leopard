import React, { useMemo, useState } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

/* Lego Components */
import {
  H4,
  Card,
  Info,
  FormSelect,
  Link,
  LoadingIndicator,
  Popover,
  Markdown,
  Layout,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { formatCurrency } from "@toolkit/currency";

/* Merchant Components */
import { DEPRECATEDIcon as Icon, IconName } from "@merchant/component/core";
import StoreChart from "@merchant/component/performance/overview/StoreChart";
import { useDeviceStore } from "@stores/DeviceStore";

/* Model */
import {
  PerformanceMetricsStoreSalesResponseData,
  PerformanceMetricsStoreSalesRequestData,
} from "@toolkit/performance/stats";
import { Page } from "@toolkit/performance/constants";
import logger from "@toolkit/performance/logger";

const STORE_SALES_STATS_QUERY = gql`
  query StoreSalesStats_StoreSalesCharts($days: Int!) {
    currentMerchant {
      storeStats {
        totals(coreMetricsOnly: true, days: $days) {
          gmv {
            amount
            display
            currencyCode
          }
          impressions
          pageViews
          addToCarts
          orders
        }
        daily(coreMetricsOnly: true, days: $days) {
          startDate {
            formatted(fmt: "%m/%d")
            fullDateFormatted: formatted(fmt: "%A %m/%d/%Y")
            inTimezone(identifier: "America/Los_Angeles") {
              formatted(fmt: "%m/%d")
              fullDateFormatted: formatted(fmt: "%A %m/%d/%Y")
            }
          }
          gmv {
            amount
            display
            currencyCode
          }
          impressions
          orders
        }
      }
    }
  }
`;

type StatInfo = {
  readonly metric: string;
  readonly value: string;
  readonly iconName: IconName;
  readonly tooltipText?: string;
};

type Props = BaseProps;

const StoreSalesCharts = (props: Props) => {
  const { className, style } = props;
  const { primary, primaryDark, wishBlue, darkBlueSurface } = useTheme();
  const styles = useStylesheet();
  const DeviceStore = useDeviceStore();
  const [lastNDays, setLastNDays] = useState(7);

  const { data, loading, refetch } = useQuery<
    PerformanceMetricsStoreSalesResponseData,
    PerformanceMetricsStoreSalesRequestData
  >(STORE_SALES_STATS_QUERY, {
    variables: {
      days: lastNDays,
    },
  });

  if (data == null || loading) {
    return <LoadingIndicator />;
  }

  if (data.currentMerchant == null || data.currentMerchant.storeStats == null) {
    return null;
  }

  const storeStatsTotals = data.currentMerchant.storeStats.totals;

  const graphData = data.currentMerchant.storeStats.daily.map((dayStat) => ({
    date: dayStat.startDate.inTimezone.fullDateFormatted,
    name: dayStat.startDate.inTimezone.formatted,
    impressions: dayStat.impressions,
    impressionsDisplay: numeral(dayStat.impressions).format("0,0"),
    gmv: dayStat.gmv.amount,
    gmvDisplay: dayStat.gmv.display,
    orders: dayStat.orders,
    ordersDisplay: numeral(dayStat.orders).format("0,0"),
    avgOrderValue:
      dayStat.orders != 0
        ? parseFloat((dayStat.gmv.amount / dayStat.orders).toFixed(2))
        : 0,
    avgOrderValueDisplay:
      dayStat.orders > 0
        ? formatCurrency(
            dayStat.gmv.amount / dayStat.orders,
            dayStat.gmv.currencyCode,
          )
        : formatCurrency(0, dayStat.gmv.currencyCode),
  }));

  const onSelect = async (value: string) => {
    await logger({
      action: "CLICK_DROPDOWN",
      event_name: "SALES_CHANGE_TIME_FRAME",
      page: Page.salesMetrics,
      old_value: lastNDays,
      new_value: parseInt(value),
    });
    setLastNDays(parseInt(value));
    await refetch();
  };

  const renderAggregates = ({
    metric,
    value,
    iconName,
    tooltipText,
  }: StatInfo) => {
    let alignRule: CSSProperties = { alignItems: "center" };

    // eslint-disable-next-line local-rules/unwrapped-i18n
    if (metric === "Impressions") {
      alignRule = { alignItems: "flex-start" };
      // eslint-disable-next-line local-rules/unwrapped-i18n
    } else if (metric === "Orders") {
      alignRule = { alignItems: "flex-end" };
    }

    if (DeviceStore.isSmallScreen) {
      alignRule = { alignItems: "flex-start" };
    }

    return (
      <div className={css(styles.statData, alignRule)}>
        <Layout.FlexColumn alignItems={alignRule.alignItems}>
          <Layout.FlexRow>
            <span style={{ marginRight: 4 }}>{metric}</span>
            {tooltipText && (
              <Info
                text={tooltipText}
                size={16}
                position="top center"
                sentiment="info"
              />
            )}
          </Layout.FlexRow>
          <H4 style={{ marginTop: 8 }}>{value}</H4>
        </Layout.FlexColumn>
        <Icon className={css(styles.statIcon)} name={iconName} />
      </div>
    );
  };

  const renderPercentPill = (tooltipText: string, percent: string) => (
    <Popover
      popoverContent={() => (
        <Markdown text={tooltipText} className={css(styles.popover)} />
      )}
      position="top center"
      className={css(styles.percentBadge)}
    >
      <Layout.FlexRow>
        <span className={css(styles.percentStat)}>{percent}</span>
        {DeviceStore.isLargeScreen && <Icon name="rightArrowPalaceBlue" />}
      </Layout.FlexRow>
    </Popover>
  );

  return (
    <div className={css(styles.root, className, style)}>
      <Card contentContainerStyle={css(styles.cardContainer)}>
        <div className={css(styles.filter)}>
          <FormSelect
            options={[
              {
                value: "7",
                text: i`Last 7 days`,
              },
              {
                value: "30",
                text: i`Last 30 days`,
              },
              {
                value: "90",
                text: i`Last 90 days`,
              },
            ]}
            selectedValue={lastNDays.toString()}
            onSelected={async (value: string) => onSelect(value)}
          />
          <Link
            href="/performance-table"
            onClick={async () =>
              await logger({
                action: "CLICK",
                event_name: "VIEW_SALES_PERFORMANCE",
                page: Page.salesMetrics,
                to_page_url: "/performance-table",
              })
            }
            openInNewTab
          >
            View Sales Performance
          </Link>
        </div>
        <div className={css(styles.separator)} />
        {storeStatsTotals && (
          <>
            <StoreChart
              graphData={graphData}
              firstLineProps={{ name: i`GMV`, dataKey: "gmv", stroke: primary }}
              secondLineProps={{
                name: i`Average order value`,
                dataKey: "avgOrderValue",
                stroke: wishBlue,
                strokeDasharray: "4 4",
              }}
              firstLegendData={{
                totalStat: storeStatsTotals.gmv.display,
                tooltip:
                  i`Gross merchandising value (i.e. total value of goods sold, including product ` +
                  i`and shipping prices) during the selected time period.`,
                currencyCode: storeStatsTotals.gmv.currencyCode,
              }}
              secondLegendData={{
                totalStat:
                  storeStatsTotals.orders > 0
                    ? formatCurrency(
                        storeStatsTotals.gmv.amount / storeStatsTotals.orders,
                        storeStatsTotals.gmv.currencyCode,
                      )
                    : formatCurrency(0, storeStatsTotals.gmv.currencyCode),
                tooltip: i`Average per-order GMV for all orders received during the selected time period.`,
                currencyCode: storeStatsTotals.gmv.currencyCode,
              }}
              className={css(styles.chart)}
            />
            <div className={css(styles.separator)} />
            <StoreChart
              graphData={graphData}
              firstLineProps={{
                name: i`Impressions`,
                dataKey: "impressions",
                stroke: primaryDark,
              }}
              secondLineProps={{
                name: i`Orders`,
                dataKey: "orders",
                stroke: darkBlueSurface,
                strokeDasharray: "4 4",
              }}
              firstLegendData={{
                totalStat: numeral(storeStatsTotals.impressions).format("0,0"),
                tooltip:
                  i`Number of times your product has been viewed (without click-through) during ` +
                  i`the selected time period.`,
              }}
              secondLegendData={{
                totalStat: numeral(storeStatsTotals.orders).format("0,0"),
                tooltip: i`Number of orders you received during the selected time period.`,
              }}
              className={css(styles.chart)}
            />
          </>
        )}
        <div className={css(styles.separator)} />
        {storeStatsTotals && (
          <div className={css(styles.metricsGroup)}>
            <div className={css(styles.metrics)}>
              {renderAggregates({
                metric: i`Impressions`,
                value: numeral(storeStatsTotals.impressions).format("0,0"),
                iconName: "productImpressions",
              })}
              {renderPercentPill(
                i`Product details page views divided by impressions.`,
                numeral(
                  storeStatsTotals.pageViews / storeStatsTotals.impressions,
                ).format("0.00%"),
              )}
              {renderAggregates({
                metric: i`Product page views`,
                value: numeral(storeStatsTotals.pageViews).format("0,0"),
                iconName: "productPageViews",
                tooltipText:
                  i`Number of times your product details page has been viewed during the selected ` +
                  i`time period.`,
              })}
              {renderPercentPill(
                i`Buy button clicks divided by product details page views.`,
                numeral(
                  storeStatsTotals.addToCarts / storeStatsTotals.pageViews,
                ).format("0.00%"),
              )}
              {renderAggregates({
                metric: i`Buy button clicks`,
                value: numeral(storeStatsTotals.addToCarts).format("0,0"),
                iconName: "productAddToCart",
                tooltipText: i`Number of times the Buy button was clicked during the selected time period.`,
              })}
              {renderPercentPill(
                i`Orders divided by Buy button clicks.`,
                numeral(
                  storeStatsTotals.orders / storeStatsTotals.addToCarts,
                ).format("0.00%"),
              )}
              {renderAggregates({
                metric: i`Orders`,
                value: numeral(storeStatsTotals.orders).format("0,0"),
                iconName: "productOrdersPalaceBlue",
              })}
            </div>
            <div className={css(styles.metricsLine)} />
          </div>
        )}
      </Card>
    </div>
  );
};

const useStylesheet = () => {
  const { borderPrimary, primary, primaryLight, lightBlueSurface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        cardContainer: {
          padding: 24,
        },
        chart: {
          marginBottom: 24,
        },
        separator: {
          borderTop: `1px ${borderPrimary} solid`,
        },
        filter: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          "@media (max-width: 900px)": {
            flexDirection: "column",
            ":first-child > :first-child": {
              marginBottom: 8,
            },
          },
        },
        statData: {
          display: "flex",
          flexDirection: "column",
          zIndex: 2,
          "@media (max-width: 900px)": {
            flexDirection: "row-reverse",
            justifyContent: "center",
            alignSelf: "flex-start",
            alignItems: "flex-start",
            ":nth-child(1n) > *": {
              marginRight: 28,
            },
          },
        },
        statIcon: {
          marginTop: 24,
          "@media (max-width: 900px)": {
            marginTop: 0,
          },
        },
        metricsGroup: {
          position: "relative",
        },
        metrics: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 24,
          "@media (max-width: 900px)": {
            flexDirection: "column",
            ":nth-child(1n) > *": {
              ":not(:last-child)": {
                marginBottom: 32,
              },
            },
          },
        },
        metricsLine: {
          position: "relative",
          borderTop: `1px ${lightBlueSurface} solid`,
          bottom: 23,
          zIndex: 1,
          "@media (max-width: 900px)": {
            position: "absolute",
            left: 24,
            borderTop: 0,
            borderLeft: `1px ${lightBlueSurface} solid`,
            height: 468,
            top: 24,
          },
        },
        percentBadge: {
          display: "flex",
          alignItems: "center",
          alignSelf: "flex-end",
          color: primary,
          fontSize: 14,
          padding: "0px 8px",
          backgroundColor: primaryLight,
          borderRadius: 20,
          height: 28,
          marginBottom: 10,
          zIndex: 2,
          "@media (max-width: 900px)": {
            alignSelf: "flex-start",
          },
        },
        percentStat: {
          marginRight: 6,
          "@media (max-width: 900px)": {
            marginRight: 0,
          },
        },
        popover: {
          padding: 16,
          maxWidth: 200,
        },
      }),
    [borderPrimary, primary, primaryLight, lightBlueSurface],
  );
};

export default observer(StoreSalesCharts);
