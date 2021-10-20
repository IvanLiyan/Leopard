import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Component */
import { BonusBudgetPromotionExplanations } from "@toolkit/product-boost/resources/bonus-budget-tooltip";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MarketingBonusBudgetType } from "@schema/types";

type BonusBudgetFormProps = BaseProps & {
  readonly merchantBudget: string;
  readonly bonusBudgetRate: number;
  readonly bonusBudgetType: MarketingBonusBudgetType;
  readonly localizedCurrency?: string;
  readonly showPromoMessage?: boolean;
  readonly showExample?: boolean;
  readonly showCalculation?: boolean;
};

const BonusBudgetForm = (props: BonusBudgetFormProps) => {
  const {
    merchantBudget,
    bonusBudgetRate,
    bonusBudgetType,
    localizedCurrency,
    showPromoMessage,
    showExample,
    showCalculation,
    className,
    style,
  } = props;

  const styles = useStylesheet();
  const budget = parseFloat(merchantBudget) || 0;
  const bonusBudgetRatePercentage = (bonusBudgetRate * 100).toFixed(2);
  const currency = localizedCurrency || "USD";

  const CNYPromoMessage =
    i`You have been selected to automatically receive bonus ` +
    i`budget from Wish for creating PB campaigns during the month ` +
    i`of February. You will receive ${bonusBudgetRatePercentage}% more additional bonus ` +
    i`budget on your campaign.`;

  const videoProductsPromoMessage =
    i`All products under this campaign have a video. As a reward, you will receive ` +
    i`${bonusBudgetRatePercentage}% more additional bonus budget on this campaign.`;

  const decreasedSpendPromoMessage =
    i`You have been selected to automatically receive bonus ` +
    i`budget from Wish for creating PB campaigns. You will receive ` +
    i`${bonusBudgetRatePercentage}% more additional bonus budget on your campaign.`;

  return (
    <div className={css(styles.bonusBudget, styles.text, className, style)}>
      {showPromoMessage && bonusBudgetType == "CNY_BONUS_BUDGET" && (
        <p>{CNYPromoMessage}</p>
      )}
      {showPromoMessage && bonusBudgetType == "VIDEO_PRODUCTS_BONUS_BUDGET" && (
        <p>{videoProductsPromoMessage}</p>
      )}
      {showPromoMessage &&
        bonusBudgetType == "DECREASED_PB_SPEND_BONUS_BUDGET" && (
          <p>{decreasedSpendPromoMessage}</p>
        )}
      <HorizontalField title={i`Budget you set`} titleWidth={200}>
        {formatCurrency(budget, currency)}
      </HorizontalField>
      <HorizontalField title={i`Bonus Budget`} titleWidth={200}>
        {formatCurrency(budget * bonusBudgetRate, currency)}
      </HorizontalField>
      <HorizontalField title={i`Total Budget`} titleWidth={200}>
        {formatCurrency(budget * (1 + bonusBudgetRate), currency)}
      </HorizontalField>
      {showExample && (
        <p className={css(styles.marginTop)}>
          {BonusBudgetPromotionExplanations.BONUS_BUDGET_EXAMPLE}
        </p>
      )}
      {showCalculation && (
        <p>{BonusBudgetPromotionExplanations.BONUS_BUDGET_DEFINITION}</p>
      )}
    </div>
  );
};

export default observer(BonusBudgetForm);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        bonusBudget: {
          padding: "10px 80px",
          alignSelf: "center",
        },
        text: {
          fontSize: 14,
          color: textBlack,
          lineHeight: 1.4,
        },
        marginTop: {
          marginTop: 16,
        },
      }),
    [textBlack],
  );
};
