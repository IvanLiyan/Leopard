import React from "react";

/* Lego Components */
import { ProgressBar } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type TrainingProgressBarProps = BaseProps & {
  readonly progress: number;
};

const TrainingProgressBar = (props: TrainingProgressBarProps) => {
  const { progress, className } = props;
  return (
    <ProgressBar
      className={className}
      color={palettes.greens.CashGreen}
      height={16}
      minWidth={138}
      progress={progress}
      backgroundColor={palettes.greyScaleColors.Grey}
    />
  );
};

export default TrainingProgressBar;
