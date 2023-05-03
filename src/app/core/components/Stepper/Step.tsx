import React, { forwardRef } from "react";
import MuiStep, { StepProps as MuiStepProps } from "@mui/material/Step";

export type StepProps = MuiStepProps;

const Step: React.FC<StepProps> = forwardRef((props, ref) => {
  return <MuiStep ref={ref} {...props} />;
});

Step.displayName = "Step";

export default Step;
