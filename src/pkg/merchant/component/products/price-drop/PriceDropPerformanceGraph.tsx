import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";
import moment from "moment-timezone";
import { Moment } from "moment/moment";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { LineChart } from "@ContextLogic/lego";
import { Line } from "@ContextLogic/lego";
import { XAxis } from "@ContextLogic/lego";
import { YAxis } from "@ContextLogic/lego";
import { CartesianGrid } from "@ContextLogic/lego";
import { RechartsTooltip } from "@ContextLogic/lego";
import { ReferenceArea } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import {
  impressionIcon,
  orderIcon,
  dollarIcon,
  calendarIcon,
} from "@assets/illustrations";

/* Merchant Components */
import LineChartMetric from "@merchant/component/products/price-drop/LineChartMetric";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { DropPriceDailyData, ImprBoosterItem } from "@merchant/api/price-drop";
import { TooltipPayload } from "recharts";

const DATE_FORMAT = "MM/DD/YYYY";

export type PriceDropRangeParams = {
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly dropPercentage?: number;
};

type PriceDropPerformanceGraphProps = BaseProps & {
  readonly data: ReadonlyArray<DropPriceDailyData>;
  readonly trialStartDate: Moment | null | undefined;
  readonly trialEndDate: Moment | null | undefined;
  readonly campaignStartDate: Moment | null | undefined;
  readonly campaignEndDate: Moment | null | undefined;
  readonly priceDropItem: ImprBoosterItem;
  readonly renderPriceRange: (params: PriceDropRangeParams) => ReactNode;
};

const PriceDropPerformanceGraph = (props: PriceDropPerformanceGraphProps) => {
  const styles = useStylesheet();
  const {
    data,
    trialStartDate,
    trialEndDate,
    campaignStartDate,
    campaignEndDate,
    priceDropItem,
    renderPriceRange,
    style,
    className,
  } = props;

  const currencyCode = priceDropItem.currency_code;

  const totalImpressions = numeral(priceDropItem.total_impressions).format(
    "0,0"
  );
  const totalOrders = numeral(priceDropItem.sales).format("0,0");
  const totalGMV = formatCurrency(priceDropItem.gmv, currencyCode);
  const trialDropPercentage = priceDropItem.trial_drop_percentage
    ? priceDropItem.trial_drop_percentage
    : 0;

  let endDate = "";
  if (campaignEndDate) {
    endDate = campaignEndDate.format(DATE_FORMAT);
  } else if (trialEndDate) {
    endDate = trialEndDate.format(DATE_FORMAT);
  }

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.graphMetrics)}>
        <LineChartMetric
          className={css(styles.graphMetric)}
          icon="impressionIcon"
          color={palettes.coreColors.WishBlue}
          title={i`Impressions`}
        >
          {totalImpressions}
        </LineChartMetric>
        <LineChartMetric
          className={css(styles.graphMetric)}
          color={palettes.purples.DarkPurple}
          strokeDasharray="4"
          icon="orderIcon"
          title={i`Orders`}
        >
          {totalOrders}
        </LineChartMetric>
        <LineChartMetric
          className={css(styles.graphMetric)}
          color={palettes.cyans.Cyan}
          strokeDasharray="1"
          icon="dollarIcon"
          title={i`GMV`}
        >
          {totalGMV}
        </LineChartMetric>
      </div>
      <div className={css(styles.graph)}>
        <LineChart data={data}>
          <CartesianGrid vertical horizontal />
          {trialStartDate != null && (
            <ReferenceArea
              x2={trialStartDate.format(DATE_FORMAT)}
              fill="#afc7d1"
              fillOpacity={0.1}
              xAxisId={0}
              yAxisId={i`Impressions`}
            />
          )}
          {campaignStartDate != null && (
            <ReferenceArea
              x1={
                trialEndDate != null
                  ? trialEndDate.format(DATE_FORMAT)
                  : undefined
              }
              x2={campaignStartDate.format(DATE_FORMAT)}
              fill="#afc7d1"
              fillOpacity={0.1}
              xAxisId={0}
              yAxisId={i`Impressions`}
            />
          )}
          <ReferenceArea
            x1={endDate}
            fill="#afc7d1"
            fillOpacity={0.1}
            xAxisId={0}
            yAxisId={i`Impressions`}
          />
          <XAxis dataKey="date" />
          <RechartsTooltip
            imageFormatter={tooltipImageFormatter}
            // Disabled to satisfy reacharts API
            // eslint-disable-next-line local-rules/no-large-method-params
            formatter={(
              value: string | number | Array<string | number>,
              name: string,
              entry: TooltipPayload,
              index: number
            ): React.ReactNode => {
              if (name === "gmv" && typeof value === "number") {
                return formatCurrency(value, currencyCode);
              } else if (name === "date" || name === "priceDrop") {
                return value;
              }
              return numeral(value).format("0,0");
            }}
            payloadFormatter={(payload) => {
              if (payload && payload.length && payload[0]) {
                const value = payload[0].payload.date;
                const date = moment(value, DATE_FORMAT);
                const isTrialPeriod =
                  trialStartDate &&
                  trialEndDate &&
                  trialStartDate.isSameOrBefore(date) &&
                  trialEndDate.isAfter(date);
                const isCampaignPeriod =
                  campaignStartDate &&
                  campaignEndDate &&
                  campaignStartDate.isSameOrBefore(date) &&
                  campaignEndDate.isAfter(date);

                let priceDropStatement = i`Original Price: ${renderPriceRange({
                  minPrice: priceDropItem.original_localized_price_min,
                  maxPrice: priceDropItem.original_localized_price_max,
                })}`;
                if (isTrialPeriod) {
                  const trialDropPercentageText = ci18n(
                    "placeholder is a sale/discount",
                    "%1$s OFF",
                    numeral(trialDropPercentage / 100).format("0%")
                  );
                  priceDropStatement = i`Wish Subsidy: ${renderPriceRange({
                    minPrice: priceDropItem.original_localized_price_min,
                    maxPrice: priceDropItem.original_localized_price_max,
                    dropPercentage: trialDropPercentage,
                  })} (${trialDropPercentageText})`;
                } else if (isCampaignPeriod) {
                  const merchantDropPercentage = ci18n(
                    "placeholder is a sale/discount",
                    "%1$s OFF",
                    numeral(priceDropItem.drop_percentage / 100).format("0%")
                  );
                  priceDropStatement = i`Merchant dropped to: ${renderPriceRange(
                    {
                      minPrice: priceDropItem.new_localized_price_min,
                      maxPrice: priceDropItem.new_localized_price_max,
                    }
                  )} (${merchantDropPercentage})`;
                }

                return [
                  {
                    name: "priceDrop",
                    value: priceDropStatement,
                  },
                  {
                    name: "date",
                    value,
                    color: "#EF8D2E",
                  },
                  ...payload,
                ];
              }
              return payload;
            }}
          />
          <YAxis
            yAxisId={i`Impressions`}
            dataKey="impressions"
            orientation="left"
            tickCount={10}
            tickFormatter={formatTickThousand}
            type="number"
            stroke={palettes.coreColors.WishBlue}
          />
          <Line
            yAxisId={i`Impressions`}
            dataKey="impressions"
            strokeWidth={4}
            stroke={palettes.coreColors.WishBlue}
          />
          <YAxis
            yAxisId={i`Orders`}
            dataKey="sales"
            orientation="right"
            dx={25}
            tickCount={10}
            tickFormatter={formatTickThousand}
            type="number"
            stroke={palettes.purples.DarkPurple}
          />
          <Line
            yAxisId={i`Orders`}
            dataKey="sales"
            strokeWidth={4}
            type="linear"
            strokeDasharray="4 4"
            stroke={palettes.purples.DarkPurple}
          />
          <YAxis
            yAxisId={i`GMV`}
            dataKey="gmv"
            orientation="right"
            tickCount={10}
            tickFormatter={(value: string | number) => {
              if (typeof value === "number") {
                return formatCurrency(value, currencyCode);
              }
              return value;
            }}
            type="number"
            stroke={palettes.cyans.Cyan}
            width={100}
          />
          <Line
            yAxisId={i`GMV`}
            dataKey="gmv"
            strokeWidth={4}
            strokeDasharray="1 1"
            stroke={palettes.cyans.Cyan}
          />
        </LineChart>
      </div>
    </div>
  );
};

const formatTickThousand = (value: string | number) => {
  return numeral(value).format("0a");
};

const tooltipImageFormatter = (name: string | number) => {
  switch (name) {
    case "impressions":
      return impressionIcon;
    case "sales":
      return orderIcon;
    case "gmv":
      return dollarIcon;
    case "date":
      return calendarIcon;
    default:
      return null;
  }
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        graphMetrics: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          margin: "25px 0px 25px 25px",
        },
        graphMetric: {
          margin: "0px 25px 0px 0px",
          flex: 1,
        },
        graph: {
          height: "350px",
        },
        root: {
          display: "flex",
          flexDirection: "column",
          paddingBottom: 30,
        },
      }),
    []
  );
};

export default observer(PriceDropPerformanceGraph);
