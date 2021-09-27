import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type WishSubsidyBudgetFormProps = BaseProps & {
  readonly merchantBudget: string;
  readonly wishSubsidyDiscountFactor: number;
  readonly localizedCurrency?: string;
};

const WishSubsidyBudgetForm = (props: WishSubsidyBudgetFormProps) => {
  const {
    merchantBudget,
    wishSubsidyDiscountFactor,
    localizedCurrency,
    className,
  } = props;

  const styles = useStylesheet();
  const budget = parseFloat(merchantBudget) || 0;

  const currency = localizedCurrency || "USD";
  const discount =
    wishSubsidyDiscountFactor > 0
      ? wishSubsidyDiscountFactor / (1 + wishSubsidyDiscountFactor)
      : 0.0;
  const promoMessage = i`Enjoy ${numeral(discount).format(
    "0%",
  )} OFF on your spend on this campaign!`;
  return (
    <Card className={css(styles.wishSubsidyBudget, className)}>
      <div className={css(styles.promoText)}>{promoMessage}</div>
      <HorizontalField
        className={css(styles.text)}
        title={i`Budget you set`}
        titleWidth={200}
      >
        {formatCurrency(budget, currency)}
      </HorizontalField>
      <HorizontalField
        className={css(styles.text)}
        title={i`Total Budget`}
        titleWidth={200}
      >
        {formatCurrency(budget * (1 + wishSubsidyDiscountFactor), currency)}
      </HorizontalField>
    </Card>
  );
};

export default observer(WishSubsidyBudgetForm);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        wishSubsidyBudget: {
          padding: "10px 80px 10px 50px",
          alignSelf: "center",
        },
        text: {
          fontSize: 14,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          margin: "10px 20px 0px 0px",
        },
        subtext: {
          fontSize: 14,
          color: palettes.greens.CashGreen,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          margin: "5px 20px 0px 0px",
        },
        promoText: {
          fontSize: 14,
          color: palettes.cyans.LightCyan,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          margin: "10px 20px 0px 40px",
        },
        errorText: {
          fontSize: 12,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.33,
          color: palettes.reds.DarkRed,
          marginTop: 7,
          marginLeft: 130,
        },
      }),
    [],
  );
};
