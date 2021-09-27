import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import LoadingDisplay from "@merchant/component/performance/LoadingDisplay";
import PerformanceTitle from "@merchant/component/performance/PerformanceTitle";

/* Merchant API */
import * as performanceAPI from "@merchant/api/performance";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Relative Imports */
import FulfillmentPerformanceTip from "./FulfillmentPerformanceTip";
import FulfillmentPerformanceBody from "./FulfillmentPerformanceBody";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PerformanceSentiment } from "@merchant/component/performance/counterfeit/CounterfeitPerformanceTip";

const FulfillmentPerformanceBox = (props: BaseProps) => {
  const { style, className } = props;
  const styles = useStylesheet();
  const [resp] = useRequest(performanceAPI.getFulfillmentTimeData({}));

  const resultData = resp?.data;
  if (resultData == null) {
    return <LoadingDisplay className={className} style={style} />;
  }

  const handleClick = () =>
    window.open("/shipping-dest-performance#tab=weekly");

  const fulfillmentData: performanceAPI.PerformanceData = {
    resultSize: resultData.result_size,
    dateRange: resultData.date_range,
    previousDate: resultData.prev_date_range,
    currentValue: resultData.fulfillment_time,
    previousValue: resultData.prev_fulfillment_time,
    correlation: "inverse",
    dataChange: "nochange",
    trend: "up",
  };

  /* eslint-disable local-rules/unwrapped-i18n */
  if (fulfillmentData.resultSize == 2) {
    const diff =
      Math.round(
        100 * fulfillmentData.currentValue - 100 * fulfillmentData.previousValue
      ) / 100;
    if (diff < 0) {
      fulfillmentData.trend = "down";
      fulfillmentData.dataChange = `- ${-1 * diff}hrs`;
    }
    if (diff > 0) {
      fulfillmentData.dataChange = `+ ${diff}hrs`;
    }
  }

  let sentiment: PerformanceSentiment = "NA";

  if (fulfillmentData.resultSize > 0) {
    if (fulfillmentData.currentValue > 120) sentiment = "poor";
    else if (fulfillmentData.currentValue < 96) sentiment = "positive";
    else sentiment = "neutral";
  }

  const dateText =
    i`Your Confirmed Fulfillment Time is based on your ` +
    i`store's performance over the past ${2}-${3} weeks.`;

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.hoverable)} onClick={handleClick}>
        <PerformanceTitle title={i`Confirmed Fulfillment`} dateText={dateText}>
          {fulfillmentData.dateRange}
        </PerformanceTitle>
        <FulfillmentPerformanceBody performanceData={fulfillmentData} />
      </div>
      <FulfillmentPerformanceTip sentiment={sentiment} />
    </div>
  );
};

export default observer(FulfillmentPerformanceBox);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        hoverable: {
          cursor: "pointer",
          paddingBottom: "6%",
        },
      }),
    []
  );
};
