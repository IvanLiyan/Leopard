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
import DeliveryPerformanceTip from "./DeliveryPerformanceTip";
import DeliveryPerformanceBody from "./DeliveryPerformanceBody";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PerformanceSentiment } from "@merchant/component/performance/counterfeit/CounterfeitPerformanceTip";

const DeliveryPerformanceBox = (props: BaseProps) => {
  const { style, className } = props;
  const styles = useStylesheet();
  const [resp] = useRequest(performanceAPI.getDeliveryRateData({}));

  const resultData = resp?.data;
  if (resultData == null) {
    return <LoadingDisplay className={className} style={style} />;
  }

  const handleClick = () =>
    window.open("/shipping-dest-performance#tab=delivery-confirmation");

  const deliveryData: performanceAPI.PerformanceData = {
    resultSize: resultData.result_size,
    dateRange: resultData.date_range,
    previousDate: resultData.prev_date_range,
    currentValue: resultData.delivery_rate,
    previousValue: resultData.prev_delivery_rate,
    correlation: "positive",
    dataChange: "nochange",
    trend: "up",
  };

  if (deliveryData.resultSize == 2) {
    const diff =
      Math.round(
        100 * deliveryData.currentValue - 100 * deliveryData.previousValue
      ) / 100;
    if (diff < 0) {
      deliveryData.trend = "down";
      deliveryData.dataChange = `- ${-1 * diff}%`;
    }
    if (diff > 0) {
      deliveryData.dataChange = `+ ${diff}%`;
    }
  }

  let sentiment: PerformanceSentiment = "NA";

  if (deliveryData.resultSize > 0) {
    if (deliveryData.currentValue < 95) sentiment = "poor";
    else sentiment = "positive";
  }

  const dateText =
    i`Your Confirmed Delivery Rate is based on your store's ` +
    i`performance over the past ${4}-${5} weeks.`;

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.hoverable)} onClick={handleClick}>
        <PerformanceTitle title={i`Confirmed Delivery`} dateText={dateText}>
          {deliveryData.dateRange}
        </PerformanceTitle>
        <DeliveryPerformanceBody performanceData={deliveryData} />
      </div>
      <DeliveryPerformanceTip sentiment={sentiment} />
    </div>
  );
};

export default observer(DeliveryPerformanceBox);

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
