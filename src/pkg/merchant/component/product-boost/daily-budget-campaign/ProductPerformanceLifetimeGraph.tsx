import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";
import numeral from "numeral";

/* Lego Components */
import { LineChart } from "@ContextLogic/lego";
import { Line } from "@ContextLogic/lego";
import { XAxis } from "@ContextLogic/lego";
import { YAxis } from "@ContextLogic/lego";
import { CartesianGrid } from "@ContextLogic/lego";
import { RechartsTooltip } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { CurrencyCode } from "@toolkit/currency";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import {
  impressionIcon,
  orderIcon,
  dollarIcon,
  campaignIcon,
  calendarIcon,
} from "@assets/illustrations";
import { useTheme } from "@stores/ThemeStore";

/* Merchant Components */
import LineChartMetric from "@merchant/component/product-boost/campaign-detail/LineChartMetric";

/* Toolkit */
import { DailyBudgetCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ProductPromotionLifetimeGraphType } from "@merchant/api/product-promotion";
import { TooltipPayload } from "recharts";

type ProductPerformanceLifetimeGraphProps = BaseProps & {
  readonly startTime: Date;
  readonly endTime: Date;
  readonly dailyStats: ReadonlyArray<ProductPromotionLifetimeGraphType>;
  readonly totalImpressions: number;
  readonly totalSales: number;
  readonly totalPromotionSpending: number;
  readonly currencyCode: CurrencyCode;
};

const ProductPerformanceLifetimeGraph = (
  props: ProductPerformanceLifetimeGraphProps,
) => {
  const styles = useStylesheet();
  const {
    startTime,
    endTime,
    dailyStats,
    totalImpressions,
    totalSales,
    totalPromotionSpending,
    currencyCode,
    className,
  } = props;
  const startDate = moment(startTime);
  const endDate = moment(endTime);
  const { orangeSurface, primary, positive, purpleSurface } = useTheme();

  const formatTickThousandCurrency = (value: string | number) => {
    if (typeof value === "number") {
      return formatCurrency(value, currencyCode);
    }
    return value;
  };

  const renderGraphMetrics = () => {
    return (
      <div
        className={css(styles.graphMetrics, styles.graphTopControl, className)}
      >
        <LineChartMetric
          className={css(styles.graphMetric)}
          popoverContent={DailyBudgetCampaignExplanations.IMPRESSIONS_LIFETIME}
          icon="impressionIcon"
          color={primary}
          title={i`Impressions`}
        >
          {formatTickThousand(totalImpressions)}
        </LineChartMetric>
        <LineChartMetric
          className={css(styles.graphMetric)}
          popoverContent={DailyBudgetCampaignExplanations.SALES_LIFETIME}
          color={purpleSurface}
          strokeDasharray="4"
          icon="orderIcon"
          title={i`Orders`}
        >
          {formatTickThousand(totalSales)}
        </LineChartMetric>
        <LineChartMetric
          className={css(styles.graphMetric)}
          popoverContent={DailyBudgetCampaignExplanations.SPEND_LIFETIME}
          color={positive}
          strokeDasharray="1"
          icon="dollarIcon"
          title={i`Spending`}
        >
          {formatTickThousandCurrency(totalPromotionSpending)}
        </LineChartMetric>
      </div>
    );
  };

  const verticalHighlight = useMemo(() => {
    const oneDayBeforeEndDate = endDate.clone().subtract(1, "days");
    return dailyStats
      .map((stats) => moment(stats.date, "YYYY-MM-DD"))
      .map(
        (date) =>
          startDate.isSameOrBefore(date) && oneDayBeforeEndDate.isAfter(date),
      );
  }, [startDate, endDate, dailyStats]);

  const renderGraph = () => {
    return (
      <div className={css(styles.graph)}>
        <LineChart
          data={dailyStats}
          margin={{ top: 10, right: 25, left: 10, bottom: 10 }}
        >
          <CartesianGrid vertical horizontal verticalFill={verticalHighlight} />
          <XAxis dataKey="date" />
          <RechartsTooltip
            payloadFormatter={(payload) => {
              if (payload && payload.length && payload[0]) {
                return [
                  {
                    name: "date",
                    value: payload[0].payload.date,
                    color: orangeSurface,
                  },
                  {
                    name: "promotionStatus",
                    value: payload[0].payload.promotionStatus,
                  },
                  ...payload,
                ];
              }
              return [
                {
                  name: "message",
                  value: i`Inactive`,
                },
              ];
            }}
            imageFormatter={tooltipImageFormatter}
            // Disabled to satisfy recharts API
            // eslint-disable-next-line local-rules/no-large-method-params
            formatter={(
              value: string | number | Array<string | number>,
              name: string,
              entry: TooltipPayload,
              index: number,
            ): React.ReactNode => {
              if (typeof value !== "string" && typeof value !== "number") {
                return null;
              } else if (name === "date" && typeof value === "string") {
                return typeof value === "string" ? value : null;
              } else if (name === "impressions") {
                return numeral(value).format("0,0");
              } else if (name === "sales") {
                return numeral(value).format("0,0");
              } else if (name === "promotionSpending") {
                return formatTickThousandCurrency(value);
              } else if (name === "promotionStatus") {
                return typeof value === "string" ? value : null;
              } else if (name === "message") {
                return typeof value === "string" ? value : null;
              }
              return null;
            }}
            contentStyle={{
              visibility: "visible",
            }}
          />
          <YAxis
            yAxisId={i`Impressions`}
            dataKey="impressions"
            orientation="left"
            tickCount={10}
            tickFormatter={formatTickThousand}
            type="number"
            stroke={primary}
          />
          <Line
            yAxisId={i`Impressions`}
            dataKey="impressions"
            strokeWidth={4}
            stroke={primary}
          />
          <YAxis
            yAxisId={i`Orders`}
            dataKey="sales"
            orientation="right"
            dx={25}
            tickCount={10}
            tickFormatter={formatTickThousand}
            type="number"
            stroke={purpleSurface}
          />
          <Line
            yAxisId={i`Orders`}
            dataKey="sales"
            strokeWidth={4}
            type="linear"
            strokeDasharray="4 4"
            stroke={purpleSurface}
          />
          <YAxis
            yAxisId={i`Spending`}
            dataKey="promotionSpending"
            orientation="right"
            tickCount={10}
            tickFormatter={formatTickThousandCurrency}
            type="number"
            stroke={positive}
          />
          <Line
            yAxisId={i`Spending`}
            dataKey="promotionSpending"
            strokeWidth={4}
            strokeDasharray="1 1"
            stroke={positive}
          />
        </LineChart>
      </div>
    );
  };

  return (
    <div className={css(styles.root)}>
      {renderGraphMetrics()}
      {renderGraph()}
    </div>
  );
};

const formatTickThousand = (value: string | number) => {
  return numeral(value).format("0a");
};

const tooltipImageFormatter = (name: string | number) => {
  switch (name) {
    case "date":
      return calendarIcon;
    case "impressions":
      return impressionIcon;
    case "sales":
      return orderIcon;
    case "promotionSpending":
      return dollarIcon;
    case "promotionStatus":
      return campaignIcon;
    default:
      return null;
  }
};

const useStylesheet = () => {
  const { textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        graphTopControl: {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          justifyContent: "space-between",
          margin: "25px 25px 10px 25px",
          backgroundColor: textWhite,
        },
        graph: {
          height: "350px",
          margin: "30px 0px 30px 0px",
        },
        graphMetrics: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: "30px 30px 10px 30px",
        },
        graphMetric: {
          margin: "0px 25px 0px 0px",
          flex: 1,
        },
      }),
    [textWhite],
  );
};

export default observer(ProductPerformanceLifetimeGraph);
