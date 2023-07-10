import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import StoreChart from "./StoreChart";

/* Model */
import {
  PerformanceMetricsProductStatsDailyResponseData,
  PerformanceMetricsProductStatsDailyRequestData,
} from "@performance/migrated/toolkit/stats";

const PRODUCT_STATS_QUERY = gql`
  query ProductCatalogProductStats_ProductChart($id: String!, $days: Int!) {
    productCatalog {
      product(id: $id) {
        stats {
          daily(coreMetricsOnly: true, days: $days) {
            orders
            impressions
            startDate {
              formatted(fmt: "%m/%d")
              fullDateFormatted: formatted(fmt: "%A %m/%d/%Y")
              inTimezone(identifier: "America/Los_Angeles") {
                formatted(fmt: "%m/%d")
                fullDateFormatted: formatted(fmt: "%A %m/%d/%Y")
              }
            }
          }
        }
      }
    }
  }
`;

type Props = BaseProps & {
  readonly productId: string;
  readonly lastNDays: number;
  readonly totalImpressions: string;
  readonly totalOrders: string;
};

const ProductChart = (props: Props) => {
  const {
    className,
    style,
    productId,
    lastNDays,
    totalImpressions,
    totalOrders,
  } = props;
  const { purpleSurface, darkPurpleSurface } = useTheme();
  const styles = useStylesheet();

  const { data, loading } = useQuery<
    PerformanceMetricsProductStatsDailyResponseData,
    PerformanceMetricsProductStatsDailyRequestData
  >(PRODUCT_STATS_QUERY, {
    variables: {
      id: productId,
      days: lastNDays,
    },
  });

  if (data == null || loading) {
    return <LoadingIndicator />;
  }

  if (data.productCatalog == null || data.productCatalog.product == null) {
    return null;
  }

  const graphData = data.productCatalog.product.stats.daily.map((dayStat) => ({
    date: dayStat.startDate.inTimezone.fullDateFormatted,
    name: dayStat.startDate.inTimezone.formatted,
    impressions: dayStat.impressions,
    impressionsDisplay: numeral(dayStat.impressions).format("0,0"),
    orders: dayStat.orders,
    ordersDisplay: numeral(dayStat.orders).format("0,0"),
  }));

  return (
    <StoreChart
      className={css(styles.root, className, style)}
      graphData={graphData}
      firstLineProps={{
        name: i`Impressions`,
        dataKey: "impressions",
        stroke: darkPurpleSurface,
      }}
      secondLineProps={{
        name: i`Orders`,
        dataKey: "orders",
        stroke: purpleSurface,
        strokeDasharray: "4 4",
      }}
      firstLegendData={{
        totalStat: totalImpressions,
      }}
      secondLegendData={{
        totalStat: totalOrders,
      }}
    />
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
      }),
    [],
  );
};

export default observer(ProductChart);
