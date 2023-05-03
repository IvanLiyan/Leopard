import React, { forwardRef } from "react";
import MuiStepContent, {
  StepContentProps as MuiStepContentProps,
} from "@mui/material/StepContent";

export type StepContentProps = MuiStepContentProps;

const StepContent: React.FC<StepContentProps> = forwardRef((props, ref) => {
  return <MuiStepContent ref={ref} {...props} />;
});

StepContent.displayName = "StepContent";

export default StepContent;
