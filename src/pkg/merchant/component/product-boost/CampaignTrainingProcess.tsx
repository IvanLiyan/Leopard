import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import TrainingProgressBar from "@merchant/component/product-boost/TrainingProgressBar";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useProductBoostProperty } from "@merchant/stores/product-boost/ProductBoostContextStore";

export type CampaignTrainingProgressProps = BaseProps & {
  readonly trainingProgress: number;
};

type TooltipKeys = "training_progress";

const CampaignTrainingProcess = (props: CampaignTrainingProgressProps) => {
  const styles = useStyleSheet();
  const { trainingProgress } = props;
  const campaignInfo = useProductBoostProperty();
  if (campaignInfo == null) {
    return null;
  }
  const learningStatusThreshold =
    campaignInfo.campaignProperty.learningStatusThreshold;
  const remainingTrainingDays = Math.round(
    (1 - trainingProgress) * learningStatusThreshold,
  );

  const tooltips: { [key in TooltipKeys]: string } = {
    training_progress:
      i`This campaign is currently in training. In an estimated ${remainingTrainingDays} ` +
      i`more days, we will be able to consistently put your products in front of the ` +
      i`right customers!`,
  };

  const renderToolTip = (key: TooltipKeys) => {
    const tooltip = tooltips[key];
    if (!tooltip) {
      return null;
    }
    return (
      <Info
        className={css(styles.tab)}
        text={tooltip}
        position={"bottom center"}
        popoverMaxWidth={360}
      />
    );
  };

  return (
    <div className={css(styles.valueText)}>
      {`\u223C${(trainingProgress * 100).toFixed()}%`}
      <div className={css(styles.tab)}>
        <TrainingProgressBar progress={trainingProgress} />
      </div>
      {renderToolTip("training_progress")}
    </div>
  );
};

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        tab: {
          marginLeft: 4,
        },
        valueText: {
          verticalAlign: "middle",
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    [],
  );
};
export default observer(CampaignTrainingProcess);
