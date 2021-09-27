import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Label } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CaseStatus } from "@merchant/api/brand/merchant-tro";

export type MerchantInjunctionCaseLabelProps = BaseProps & {
  readonly status: CaseStatus;
};

const MerchantInjunctionCaseLabel = (
  props: MerchantInjunctionCaseLabelProps
) => {
  const styles = useStylesheet(props);
  const { status } = props;
  const {
    negativeLighter,
    negativeDarker,
    secondaryLighter,
    secondaryDarker,
    positiveLighter,
    positiveDark,
    warningLighter,
    warningDarkest,
  } = useTheme();

  let backgroundColor: string;
  let textColor: string;
  let text: string;

  switch (status) {
    case "ONGOING":
      backgroundColor = negativeLighter;
      textColor = negativeDarker;
      text = i`Ongoing`;
      break;
    case "SETTLED":
      backgroundColor = secondaryLighter;
      textColor = secondaryDarker;
      text = i`Settled`;
      break;
    case "DISMISSED":
      backgroundColor = positiveLighter;
      textColor = positiveDark;
      text = i`Dismissed`;
      break;
    default:
      backgroundColor = warningLighter;
      textColor = warningDarkest;
      text = i`Defaulted`;
  }

  return (
    <Label
      backgroundColor={backgroundColor}
      textColor={textColor}
      borderRadius={36}
      className={css(styles.root)}
    >
      {text}
    </Label>
  );
};
export default MerchantInjunctionCaseLabel;

const useStylesheet = (props: MerchantInjunctionCaseLabelProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 10,
        },
      }),
    []
  );
};
