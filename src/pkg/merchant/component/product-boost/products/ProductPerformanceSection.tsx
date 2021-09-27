import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { LoadingIndicator } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { CurrencyCode } from "@toolkit/currency";

/* Merchant Components */
import ProductLifetimeGraph from "@merchant/component/product-boost/products/ProductLifetimeGraph";

/* Merchant API */
import * as productBoostApi from "@merchant/api/product-boost";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TimeRange = "7d" | "30d" | "3mo" | "6mo" | "1y";
const timeOffsetDict: {
  [timeRange in TimeRange]: {
    amount: moment.DurationInputArg1;
    units: moment.DurationInputArg2;
  };
} = {
  "7d": { amount: 7, units: "days" },
  "30d": { amount: 30, units: "days" },
  "3mo": { amount: 3, units: "months" },
  "6mo": { amount: 6, units: "months" },
  "1y": { amount: 1, units: "years" },
};

type ProductPerformanceSectionProps = BaseProps & {
  readonly productId: string;
  readonly currencyCode: CurrencyCode;
};

const ProductPerformanceSection = (props: ProductPerformanceSectionProps) => {
  const styles = useStylesheet();
  const { productId, currencyCode, className, style } = props;
  const [timeRange, setTimeRange] = useState<TimeRange>("3mo");

  const endDate = moment().format("YYYY-MM-DD");

  const startDate = useMemo(() => {
    const { amount, units } = timeOffsetDict[timeRange];
    return moment().subtract(amount, units).format("YYYY-MM-DD");
  }, [timeRange]);

  const dateSelectProps = useMemo(() => {
    return {
      options: [
        {
          value: "7d",
          text: i`Last 7 Days`,
        },
        {
          value: "30d",
          text: i`Last 30 Days`,
        },
        {
          value: "3mo",
          text: i`Last 3 Months`,
        },
        {
          value: "6mo",
          text: i`Last 6 Months`,
        },
        {
          value: "1y",
          text: i`Last 1 Year`,
        },
      ],
      onSelected: (value: TimeRange) => {
        setTimeRange(value);
      },
      selectedValue: timeRange,
      minWidth: 120,
      hideBorder: false,
      filterName: i`Period`,
    };
  }, [timeRange]);

  const productPerformanceParams = {
    product_id: productId,
    start_date: startDate,
    end_date: endDate,
  };

  const request = productBoostApi.getProductBoostProductLifetimePerformance(
    productPerformanceParams
  );
  const stats = request.response?.data?.results;

  const renderProductLifetimeGraph = () => {
    if (stats === undefined) {
      return <LoadingIndicator />;
    }
    return (
      <ProductLifetimeGraph
        className={css(className, style)}
        startTime={new Date(stats.start_time)}
        endTime={new Date(stats.end_time)}
        dailyStats={stats.daily_stats}
        totalImpressions={stats.total_impressions}
        totalSales={stats.total_orders}
        totalGmv={stats.total_gmv}
        currencyCode={currencyCode}
      />
    );
  };

  return (
    <div>
      <div className={css(styles.selectContainer)}>
        <Select {...dateSelectProps} />
      </div>
      {renderProductLifetimeGraph()}
    </div>
  );
};

export default observer(ProductPerformanceSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        selectContainer: {
          display: "flex",
          flexDirection: "row",
          margin: "25px 25px 0px 25px",
          alignItems: "center",
        },
      }),
    []
  );
};
