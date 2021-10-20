import React from "react";

/* Lego Components */
import { Label, LabelProps } from "@ContextLogic/lego";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export const daysLeftValueToText = {
  one: i`1 day`,
  two: i`2 days`,
  three_plus: i`3+ days`, // following API convention
};

type VerifyBrandsDaysLeftProps = BaseProps &
  Pick<LabelProps, "width"> & {
    readonly daysLeftValue: number | string | null | undefined;
  };

const VerifyBrandsDaysLeft = ({
  daysLeftValue,
  ...otherProps
}: VerifyBrandsDaysLeftProps) => {
  const {
    textLight,
    surfaceLight,
    negativeLighter,
    negative,
    warningLight,
    warningDark,
  } = useTheme();

  const daysLeftValueToBackgroundColor = {
    one: negativeLighter,
    two: warningLight,
    threePlus: surfaceLight,
  };

  const daysLeftValueToTextColor = {
    one: negative,
    two: warningDark,
    threePlus: textLight,
  };

  let background = daysLeftValueToBackgroundColor.threePlus;
  let text = daysLeftValueToText.three_plus;
  let textColor = daysLeftValueToTextColor.threePlus;
  if (daysLeftValue != null) {
    if (daysLeftValue <= 1 || daysLeftValue === "one") {
      background = daysLeftValueToBackgroundColor.one;
      text = daysLeftValueToText.one;
      textColor = daysLeftValueToTextColor.one;
    } else if (daysLeftValue === 2 || daysLeftValue === "two") {
      background = daysLeftValueToBackgroundColor.two;
      text = daysLeftValueToText.two;
      textColor = daysLeftValueToTextColor.two;
    }
  }

  return (
    <Label
      text={text}
      textColor={textColor}
      backgroundColor={background}
      fontSize={14}
      borderRadius={4}
      {...otherProps}
    />
  );
};

export default VerifyBrandsDaysLeft;
