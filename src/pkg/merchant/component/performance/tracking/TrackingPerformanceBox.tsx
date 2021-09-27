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
import TrackingPerformanceTip from "./TrackingPerformanceTip";
import TrackingPerformanceBody from "./TrackingPerformanceBody";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PerformanceSentiment } from "@merchant/component/performance/counterfeit/CounterfeitPerformanceTip";
import { PerformanceData } from "@merchant/api/performance";

const TrackingPerformanceBox = (props: BaseProps) => {
  const { style, className } = props;
  const styles = useStylesheet();

  const [resp] = useRequest(performanceAPI.getTrackingRateData({}));

  const resultData = resp?.data;

  const handleClick = () =>
    window.open("/shipping-dest-performance#tab=weekly");

  if (resultData == null) {
    return <LoadingDisplay className={className} style={style} />;
  }

  const trackingData: PerformanceData = {
    resultSize: resultData.result_size,
    dateRange: resultData.date_range,
    previousDate: resultData.prev_date_range,
    currentValue: resultData.tracking_rate,
    previousValue: resultData.prev_tracking_rate,
    correlation: "positive",
    dataChange: "nochange",
    trend: "up",
  };

  if (trackingData.resultSize == 2) {
    const diff =
      Math.round(
        100 * trackingData.currentValue - 100 * trackingData.previousValue
      ) / 100;
    if (diff < 0) {
      trackingData.trend = "down";
      trackingData.dataChange = `- ${-1 * diff}%`;
    }
    if (diff > 0) {
      trackingData.dataChange = `+ ${diff}%`;
    }
  }

  let sentiment: PerformanceSentiment = "NA";

  if (trackingData.resultSize > 0) {
    if (trackingData.currentValue < 80) sentiment = "poor";
    else if (trackingData.currentValue > 95) sentiment = "positive";
    else sentiment = "neutral";
  }

  const dateText =
    i`Your Valid Tracking Rate is based on ` +
    i`your store's performance over the past ${2}-${3} weeks.`;

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.hoverable)} onClick={handleClick}>
        <PerformanceTitle title={i`Valid Tracking Rate`} dateText={dateText}>
          {trackingData.dateRange}
        </PerformanceTitle>
        <TrackingPerformanceBody performanceData={trackingData} />
      </div>
      <TrackingPerformanceTip sentiment={sentiment} />
    </div>
  );
};

export default observer(TrackingPerformanceBox);

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
