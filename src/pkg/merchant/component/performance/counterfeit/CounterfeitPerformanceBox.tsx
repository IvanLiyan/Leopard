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
import CounterfeitPerformanceTip, {
  PerformanceSentiment,
} from "./CounterfeitPerformanceTip";
import CounterfeitPerformanceBody from "./CounterfeitPerformanceBody";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const CounterfeitPerformanceBox = (props: BaseProps) => {
  const { style, className } = props;
  const styles = useStylesheet();
  const [resp] = useRequest(performanceAPI.getCounterfeitRateData({}));

  const resultData = resp?.data;

  if (resultData == null) {
    return <LoadingDisplay className={className} style={style} />;
  }

  const handleClick = () => window.open("/counterfeit-rate-performance");

  const counterfeitData: performanceAPI.PerformanceData = {
    resultSize: resultData.result_size,
    dateRange: resultData.date_range,
    previousDate: resultData.prev_date_range,
    currentValue: resultData.counterfeit_rate,
    previousValue: resultData.prev_counterfeit_rate,
    correlation: "inverse",
    dataChange: "nochange",
    trend: "up",
  };

  if (counterfeitData.resultSize == 2) {
    const diff =
      Math.round(
        100 * counterfeitData.currentValue - 100 * counterfeitData.previousValue
      ) / 100;
    if (diff < 0) {
      counterfeitData.trend = "down";
      counterfeitData.dataChange = `- ${-1 * diff}%`;
    }
    if (diff > 0) {
      counterfeitData.dataChange = `+ ${diff}%`;
    }
  }

  let sentiment: PerformanceSentiment = "NA";

  if (counterfeitData.resultSize > 0) {
    if (counterfeitData.currentValue >= 0.5) sentiment = "poor";
    else sentiment = "positive";
  }

  const dateText =
    i`Your Counterfeit Rate is based on your store's ` +
    i`recent performance till yesterday.`;

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.hoverable)} onClick={handleClick}>
        <PerformanceTitle title={i`Counterfeit Products`} dateText={dateText}>
          {counterfeitData.dateRange}
        </PerformanceTitle>
        <CounterfeitPerformanceBody performanceData={counterfeitData} />
      </div>
      <CounterfeitPerformanceTip sentiment={sentiment} />
    </div>
  );
};

export default observer(CounterfeitPerformanceBox);

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
