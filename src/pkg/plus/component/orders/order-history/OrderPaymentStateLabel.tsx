import React, { useMemo } from "react";

/* Lego Components */
import { ThemedLabel, Theme } from "@ContextLogic/lego";

import { OrderLogicalPaymentState } from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type Props = BaseProps & {
  readonly state: OrderLogicalPaymentState;
};

const OrderPaymentStateLabel: React.FC<Props> = (props: Props) => {
  const { style, className } = props;
  const text = useLabelText(props);
  const theme = useLabelTheme(props);
  if (text == null || theme == null) {
    return null;
  }
  return (
    <ThemedLabel className={css(style, className)} theme={theme}>
      {text}
    </ThemedLabel>
  );
};

const useLabelText = ({ state }: Props): string | null => {
  return useMemo(() => {
    switch (state) {
      case "TO_BE_PAID":
        return i`To be paid`;
      case "HAS_BEEN_PAID":
        return i`Paid`;
      case "FBW_PAID":
        return i`Paid`;
      case "WILL_NOT_BE_PAID":
        return i`Not eligible`;
      case "WITHHELD":
        return i`Withheld`;
      case "UNDER_REVIEW":
        return i`Under Review`;
      case "PENDING_CONFIRMED_SHIP":
      case "PENDING_WISHPOST_SHIPPING":
      case "PENDING_WFP_WITHHOLD":
        return i`Pending`;
      default:
        return null;
    }
  }, [state]);
};

/* eslint-disable local-rules/unwrapped-i18n */
const useLabelTheme = ({ state }: Props): Theme | null => {
  return useMemo((): Theme | null => {
    switch (state) {
      case "TO_BE_PAID":
        return "WishBlue";
      case "HAS_BEEN_PAID":
        return "DarkPalaceBlue";
      case "FBW_PAID":
        return "DarkPalaceBlue";
      case "WILL_NOT_BE_PAID":
        return "Yellow";
      case "WITHHELD":
        return "Red";
      case "UNDER_REVIEW":
      case "PENDING_CONFIRMED_SHIP":
      case "PENDING_WISHPOST_SHIPPING":
      case "PENDING_WFP_WITHHOLD":
        return "Yellow";
      default:
        return null;
    }
  }, [state]);
};

export default OrderPaymentStateLabel;
