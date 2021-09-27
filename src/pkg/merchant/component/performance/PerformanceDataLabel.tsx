import React from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Popover } from "@merchant/component/core";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import PerformanceArrowPopover from "@merchant/component/performance/PerformanceArrowPopover";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { PerformanceData } from "@merchant/api/performance";

type PerformanceDataLabelProps = BaseProps & {
  readonly title: string;
  readonly performanceData: PerformanceData;
};

const PerformanceDataLabel = (props: PerformanceDataLabelProps) => {
  const { title, performanceData } = props;
  const styles = useStyleSheet();
  const { resultSize, trend, dataChange } = performanceData;

  if (resultSize <= 1) {
    return null;
  }

  if (dataChange == "nochange") {
    return <div className={css(styles.noChange)}>No change</div>;
  }

  return (
    <Popover
      className={css(styles.blackArrow)}
      popoverMaxWidth={300}
      popoverContent={() => {
        return (
          <PerformanceArrowPopover
            performanceData={performanceData}
            title={title}
          />
        );
      }}
    >
      <Illustration
        name={trend == "down" ? "blackArrowDown" : "blackArrowUp"}
        animate={false}
        alt={"blackArrow"}
      />
    </Popover>
  );
};

export default PerformanceDataLabel;

const useStyleSheet = () =>
  StyleSheet.create({
    blackArrow: {
      padding: "0px 13px",
    },
    noChange: {
      padding: "0px 13px",
      color: palettes.textColors.LightInk,
      fontSize: 12,
    },
  });
