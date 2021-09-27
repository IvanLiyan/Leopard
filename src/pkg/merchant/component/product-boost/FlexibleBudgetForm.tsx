import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Toolkit */
import { CampaignFlexibleBudgetHelper } from "@toolkit/product-boost/utils/campaign-flexible-budget";

/* Type Import */
import { MarketingFlexibleBudgetType } from "@schema/types";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FlexibleBudgetFormProps = BaseProps & {
  readonly merchantBudget: string | null | undefined;
  readonly localizedCurrency?: string;
  readonly edit: boolean;
  readonly flexibleBudgetType?: MarketingFlexibleBudgetType;
};

const FlexibleBudgetForm = (props: FlexibleBudgetFormProps) => {
  const {
    merchantBudget,
    localizedCurrency,
    className,
    flexibleBudgetType,
  } = props;
  const styles = useStylesheet();

  if (!flexibleBudgetType || flexibleBudgetType === "DISABLED") {
    return null;
  }

  const budgetSet = merchantBudget || "0";

  const budget = parseFloat(budgetSet) || 0;
  const flexibleBudget = new CampaignFlexibleBudgetHelper(
    budget,
    flexibleBudgetType
  );

  if (parseFloat(budgetSet) <= 0.0) {
    return (
      <section className={css(styles.errorText)}>
        Enter a valid budget amount above.
      </section>
    );
  }

  const currency = localizedCurrency || "USD";
  const discountedAmount = flexibleBudget.getTotalDiscount();
  const promoMessage = ci18n(
    "Enjoy up to money amount worth of impressions for free",
    "Enjoy up to %1$s worth of impressions for FREE!",
    formatCurrency(discountedAmount, currency)
  );

  const firstTierDiscount = ci18n(
    "Flexible budget, at discount rate",
    "at %1$s",
    flexibleBudget.getFirstTierDiscount()
  );
  const secondTierDiscount = ci18n(
    "Flexible budget, at discount rate",
    "at %1$s",
    flexibleBudget.getSecondTierDiscount()
  );
  const silverTierRowName = flexibleBudget.canUseAllTierDiscount()
    ? i`Silver Tier Reward Budget`
    : i`Reward Budget`;

  const goldTierRowName = i`Gold Tier Reward Budget`;
  const totalBudgetRowName = i`Total budget`;
  return (
    <Card className={css(styles.flexibleBudget, className)}>
      <div className={css(styles.promoText)}>{promoMessage}</div>
      <HorizontalField
        className={css(styles.text)}
        title={i`Budget you set`}
        titleWidth={205}
      >
        <div className={css(styles.textRow)}>
          {formatCurrency(budget, currency)}
        </div>
      </HorizontalField>
      <HorizontalField
        className={css(styles.text)}
        title={`+ ${silverTierRowName}`}
        titleWidth={205}
      >
        <div className={css(styles.textRow)}>
          <p>
            {formatCurrency(flexibleBudget.getFirstTierBudget(false), currency)}
          </p>
          <p className={css(styles.subtext)}>{firstTierDiscount}</p>
        </div>
      </HorizontalField>
      {flexibleBudget.canUseAllTierDiscount() && (
        <HorizontalField
          className={css(styles.text)}
          title={`+ ${goldTierRowName}`}
          titleWidth={205}
        >
          <div className={css(styles.textRow)}>
            <p>
              {formatCurrency(
                flexibleBudget.getSecondTierBudget(false),
                currency
              )}
            </p>
            <p className={css(styles.subtext)}>{secondTierDiscount}</p>
          </div>
        </HorizontalField>
      )}
      <HorizontalField
        className={css(styles.text)}
        title={`= ${totalBudgetRowName}`}
        titleWidth={205}
      >
        <div className={css(styles.textRow)}>
          {formatCurrency(flexibleBudget.getFinalSpend(false), currency)}
        </div>
      </HorizontalField>
    </Card>
  );
};

export default observer(FlexibleBudgetForm);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        flexibleBudget: {
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
        textRow: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 2,
        },
        subtext: {
          fontSize: 14,
          color: palettes.greens.CashGreen,
          fontWeight: fonts.weightBold,
          lineHeight: 1.4,
          marginLeft: 5,
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
    []
  );
};
