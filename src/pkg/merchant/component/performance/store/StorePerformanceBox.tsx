import React from "react";
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
import StorePerformanceTip from "./StorePerformanceTip";
import StorePerformanceBody from "./StorePerformanceBody";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PerformanceSentiment } from "@merchant/component/performance/counterfeit/CounterfeitPerformanceTip";

const StorePerformanceBox = (props: BaseProps) => {
  const { style, className } = props;
  const styles = useStylesheet();
  const [resp] = useRequest(performanceAPI.getStoreRatingData({}));
  const resultData = resp?.data;
  if (resultData == null) {
    return <LoadingDisplay className={className} style={style} />;
  }

  const handleClick = () => window.open("/rating-performance");
  const storeData: performanceAPI.PerformanceData = {
    resultSize: resultData.result_size,
    dateRange: resultData.date_range,
    previousDate: resultData.prev_date_range,
    currentValue: resultData.store_rating,
    previousValue: resultData.prev_store_rating,
    correlation: "positive",
    dataChange: "nochange",
    trend: "up",
  };

  if (storeData.resultSize == 2) {
    const diff =
      Math.round(100 * storeData.currentValue - 100 * storeData.previousValue) /
      100;
    if (diff < 0) {
      storeData.trend = "down";
      storeData.dataChange = `- ${-1 * diff}`;
    }
    if (diff > 0) {
      storeData.dataChange = `+ ${diff}`;
    }
  }

  let sentiment: PerformanceSentiment = "NA";

  if (storeData.resultSize > 0) {
    if (storeData.currentValue < 4.0) sentiment = "poor";
    else if (storeData.currentValue > 4.5) sentiment = "positive";
    else sentiment = "neutral";
  }

  const dateText =
    i`Your Average Store Rating is based on your ` +
    i`store's performance over the past ${30} days.`;

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.hoverable)} onClick={handleClick}>
        <PerformanceTitle title={i`Store Rating`} dateText={dateText}>
          {storeData.dateRange}
        </PerformanceTitle>
        <StorePerformanceBody performanceData={storeData} />
      </div>
      <StorePerformanceTip sentiment={sentiment} />
    </div>
  );
};

export default observer(StorePerformanceBox);

const useStylesheet = () => {
  return StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    hoverable: {
      cursor: "pointer",
      paddingBottom: "6%",
    },
  });
};
