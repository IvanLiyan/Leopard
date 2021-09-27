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
import RefundPerformanceTip from "./RefundPerformanceTip";
import RefundPerformanceBody from "./RefundPerformanceBody";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PerformanceSentiment } from "@merchant/component/performance/counterfeit/CounterfeitPerformanceTip";

const RefundPerformanceBox = (props: BaseProps) => {
  const { style, className } = props;
  const styles = useStylesheet();
  const [resp] = useRequest(performanceAPI.getRefundRateData({}));
  const resultData = resp?.data;
  if (resultData == null) {
    return <LoadingDisplay className={className} style={style} key="loading" />;
  }

  const handleClick = () => window.open("/cs-performance-table");

  const refundData: performanceAPI.PerformanceData = {
    resultSize: resultData.result_size,
    dateRange: resultData.date_range,
    previousDate: resultData.prev_date_range,
    currentValue: resultData.refund_rate,
    previousValue: resultData.prev_refund_rate,
    correlation: "inverse",
    dataChange: "nochange",
    trend: "up",
  };

  if (refundData.resultSize == 2) {
    const diff =
      Math.round(
        100 * refundData.currentValue - 100 * refundData.previousValue
      ) / 100;
    if (diff < 0) {
      refundData.trend = "down";
      refundData.dataChange = `- ${-1 * diff}%`;
    }
    if (diff > 0) {
      refundData.dataChange = `+ ${diff}%`;
    }
  }

  let sentiment: PerformanceSentiment = "NA";

  if (refundData.resultSize > 0) {
    if (refundData.currentValue > 10) sentiment = "poor";
    else if (refundData.currentValue < 5) sentiment = "positive";
    else sentiment = "neutral";
  }

  const dateText =
    i`Your Refund Rate is based on your store's ` +
    i`performance over the past ${63}-${93} days`;

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.hoverable)} onClick={handleClick}>
        <PerformanceTitle title={i`Refunds`} dateText={dateText}>
          {refundData.dateRange}
        </PerformanceTitle>
        <RefundPerformanceBody performanceData={refundData} />
      </div>
      <RefundPerformanceTip sentiment={sentiment} />
    </div>
  );
};

export default observer(RefundPerformanceBox);

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
