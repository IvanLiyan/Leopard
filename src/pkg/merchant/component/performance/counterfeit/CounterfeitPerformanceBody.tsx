import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import PerformanceDataLabel from "@merchant/component/performance/PerformanceDataLabel";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PerformanceData } from "@merchant/api/performance";

type CounterfeitPerformanceBodyProps = BaseProps & {
  readonly performanceData: PerformanceData;
};

const CounterfeitPerformanceBody = (props: CounterfeitPerformanceBodyProps) => {
  const { performanceData } = props;
  const styles = useStyleSheet();
  const { currentValue, resultSize } = performanceData;
  let displayedRate: string | null = null;

  if (resultSize == 0) {
    displayedRate = i`N/A`;
  } else {
    displayedRate = `${currentValue.toFixed(2)}%`;
  }

  return (
    <>
      <div className={css(styles.dataContainer)}>
        <div className={css(resultSize == 0 ? styles.noValue : styles.rate)}>
          {displayedRate}
          <div className={css(styles.arrowLocation)}>
            <PerformanceDataLabel
              title={i`Counterfeit Rate`}
              performanceData={performanceData}
            />
          </div>
        </div>
        <div className={css(styles.thresholdLabels)}>Goal</div>
        <div className={css(styles.thresholdValue)}>{`< 0.5%`}</div>
      </div>
      <div className={css(styles.dataContainer)}>
        <div className={css(styles.policyLabel)}>Counterfeit Rate</div>
        <div className={css(styles.thresholdLabels)}>Warning</div>
        <div className={css(styles.thresholdValue)}>≥0.5%</div>
      </div>
    </>
  );
};

export default CounterfeitPerformanceBody;

const useStyleSheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        thresholdLabels: {
          fontSize: 12,
          color: palettes.textColors.LightInk,
          textAlign: "right",
          width: "19%",
          height: 30,
          padding: "1px 0px",
        },
        thresholdValue: {
          fontSize: 14,
          color: palettes.textColors.DarkInk,
          textAlign: "right",
          width: "19%",
          height: 30,
          padding: "1px 0px",
        },
        policyLabel: {
          fontSize: 14,
          color: palettes.textColors.DarkInk,
          width: "62%",
          height: 30,
        },
        dataContainer: {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          marginLeft: "7%",
          marginRight: "7%",
        },
        rate: {
          fontSize: 24,
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          width: "62%",
          height: 30,
          display: "flex",
          flexDirection: "row",
        },
        noValue: {
          fontSize: 24,
          fontWeight: fonts.weightSemibold,
          color: palettes.textColors.LightInk,
          width: "62%",
          height: 30,
        },
        arrowLocation: {
          marginTop: 2,
        },
      }),
    []
  );
