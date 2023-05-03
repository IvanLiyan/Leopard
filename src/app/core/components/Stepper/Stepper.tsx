import React, { forwardRef } from "react";
import { Components, Theme } from "@mui/material";
import MuiStepper, {
  StepperProps as MuiStepperProps,
} from "@mui/material/Stepper";
import { MERCHANT_THEME } from "@core/stores/ThemeStore";

export type StepperProps = MuiStepperProps;

export const StepperTheme: Components<Omit<Theme, "components">>["MuiStepper"] =
  {
    styleOverrides: {
      root: ({ ownerState }) => ({
        ...(ownerState.orientation === "vertical" && {
          [".MuiStepContent-root"]: {
            marginLeft: "14px",
            borderLeft: `1px solid ${MERCHANT_THEME.textDark}`,
          },
          [".MuiStepContent-last"]: {
            borderLeft: "none",
          },
          [".MuiStepConnector-root"]: {
            marginLeft: "14px",
            [".MuiStepConnector-line"]: {
              borderLeft: `1px solid ${MERCHANT_THEME.textDark}`,
            },
          },
        }),
        ...(ownerState.orientation === "horizontal" && {
          [".MuiStepContent-root"]: {
            border: "none",
          },
          [".MuiStepConnector-root"]: {
            [".MuiStepConnector-line"]: {
              marginBottom: "16px",
              borderColor: MERCHANT_THEME.textDark,
            },
          },
        }),
      }),
    },
  };

const Stepper: React.FC<StepperProps> = forwardRef((props, ref) => {
  return <MuiStepper ref={ref} {...props} />;
});

Stepper.displayName = "Stepper";

export default Stepper;
