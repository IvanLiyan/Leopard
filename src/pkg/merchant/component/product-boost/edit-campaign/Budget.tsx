import React, { useMemo, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Alert } from "@ContextLogic/lego";
import { CurrencyInput } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import BonusBudgetForm from "@merchant/component/product-boost/BonusBudgetForm";
import BudgetBreakDownTable from "@merchant/component/product-boost/BudgetBreakDownTable";
import ScheduledBudgetCheckbox from "@merchant/component/product-boost/ScheduledBudgetCheckbox";
import ScheduledBudgetForm from "@merchant/component/product-boost/ScheduledBudgetForm";
import FlexibleBudgetCheckbox from "@merchant/component/product-boost/FlexibleBudgetCheckbox";
import FlexibleBudgetForm from "@merchant/component/product-boost/FlexibleBudgetForm";
import WishSubsidyBudgetForm from "@merchant/component/product-boost/WishSubsidyBudgetForm";
import IncreaseBudgetBanner from "@merchant/component/product-boost/edit-campaign/IncreaseBudgetBanner";

/* Merchant Store */
import {
  useProductBoostFlexibleBudgetInfo,
  useProductBoostProperty,
  useProductBoostMerchantInfo,
} from "@merchant/stores/product-boost/ProductBoostContextStore";
import { useProductBoostStore } from "@merchant/stores/product-boost/ProductBoostStore";

/* Toolkit */
import BudgetValidator from "@toolkit/product-boost/validators/BudgetValidator";

/* Type Import */
import { MarketingFlexibleBudgetType } from "@schema/types";

/* Type Imports */
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type BudgetProps = BaseProps & {
  readonly minBudget: number;
  readonly suggestedBudget: number;
  readonly minSpend: number;
  readonly notFocusOnMount?: boolean;
};

const Budget = (props: BudgetProps) => {
  const { className, notFocusOnMount, suggestedBudget, minBudget } = props;
  const {
    currentCampaign: campaign,
    campaignRestrictions,
  } = useProductBoostStore();
  const styles = useStyleSheet();
  const flexibleBudgetInfoResult = useProductBoostFlexibleBudgetInfo();
  const productBoostPropertyResult = useProductBoostProperty();
  const productBoostMerchantInfoResult = useProductBoostMerchantInfo();

  // Init params from gql
  const flexibleBudgetSuggestedBudgetFactor =
    productBoostPropertyResult?.campaignProperty
      .flexibleBudgetSuggestedBudgetFactor || 0.0;
  const allowFlexibleBudgetV2 =
    flexibleBudgetInfoResult?.currentUser.gating.allowFlexibleBudgetV2 || false;
  const allowFlexibleBudgetSuggestBudget =
    flexibleBudgetInfoResult?.currentUser.gating
      .allowFlexibleBudgetSuggestBudget || false;
  const defaultFlexibleBudgetTypeParam =
    flexibleBudgetInfoResult?.marketing.currentMerchant
      .defaultFlexibleBudgetType || "DISABLED";
  const wishSubsidyDiscountFactor =
    productBoostMerchantInfoResult?.marketing.currentMerchant
      .wishSubsidyDiscountFactor || 0.0;

  useEffect(() => {
    let allowEnableFlexibleBudgetSuggestedBudget;
    if (
      !campaign ||
      !campaign.products ||
      campaign.products.length === 0 ||
      !suggestedBudget ||
      !flexibleBudgetSuggestedBudgetFactor
    ) {
      allowEnableFlexibleBudgetSuggestedBudget = false;
    } else {
      const newBudget = parseFloat(campaign.merchantBudget || "");
      if (isNaN(newBudget)) {
        allowEnableFlexibleBudgetSuggestedBudget = false;
      } else {
        allowEnableFlexibleBudgetSuggestedBudget =
          newBudget >= suggestedBudget * flexibleBudgetSuggestedBudgetFactor;
      }
    }

    if (
      campaign &&
      !!campaign.flexibleBudgetEnabled &&
      allowEnableFlexibleBudgetSuggestedBudget === false &&
      campaign.isNewState
    ) {
      campaign.flexibleBudgetEnabled = false;
    }
  }, [campaign, suggestedBudget, flexibleBudgetSuggestedBudgetFactor]);

  const flexibleBudgetType = useMemo(() => {
    if (!campaign || campaign.isCampaignEligibleForBonusBudget()) {
      return "DISABLED";
    }
    let defaultFlexibleBudgetType: MarketingFlexibleBudgetType;
    if (allowFlexibleBudgetSuggestBudget) {
      defaultFlexibleBudgetType = "SILVER_TIER";
    } else if (!allowFlexibleBudgetV2) {
      defaultFlexibleBudgetType = "DISABLED";
    } else {
      defaultFlexibleBudgetType = defaultFlexibleBudgetTypeParam;
    }
    const { isNewState } = campaign;

    if (isNewState) {
      return defaultFlexibleBudgetType;
    }
    return campaign.flexibleBudgetType || "DISABLED";
  }, [
    allowFlexibleBudgetSuggestBudget,
    allowFlexibleBudgetV2,
    campaign,
    defaultFlexibleBudgetTypeParam,
  ]);

  const showSuggestedBudget = useMemo(() => {
    if (!campaign || !campaign.products || campaign.products.length === 0) {
      return false;
    }
    const newBudget = parseFloat(campaign.merchantBudget || "");
    if (isNaN(newBudget)) {
      return true;
    }
    return newBudget < suggestedBudget;
  }, [campaign, suggestedBudget]);

  const showFlexibleBudgetSuggestedBudgetAlert = useMemo(() => {
    if (!allowFlexibleBudgetSuggestBudget) {
      return false;
    }
    if (
      !campaign ||
      campaign.isCampaignEligibleForBonusBudget() ||
      !campaign.products ||
      campaign.products.length === 0 ||
      !suggestedBudget
    ) {
      return false;
    }
    const newBudget = parseFloat(campaign.merchantBudget || "");
    if (isNaN(newBudget)) {
      return true;
    }
    return newBudget < suggestedBudget * flexibleBudgetSuggestedBudgetFactor;
  }, [
    allowFlexibleBudgetSuggestBudget,
    campaign,
    flexibleBudgetSuggestedBudgetFactor,
    suggestedBudget,
  ]);

  if (!campaign) {
    return null;
  }

  const {
    localizedCurrency: localizedCurrencyCode = "USD",
    oldBudget,
    isNewState,
  } = campaign;
  const { maxAllowedSpending, isPayable } = campaignRestrictions;

  const budgetValidator =
    typeof oldBudget === "number" && typeof maxAllowedSpending === "number"
      ? new BudgetValidator({
          oldBudget,
          maxAllowedSpending,
          isNewState,
          minBudget,
          currencyCode: localizedCurrencyCode,
        })
      : null;

  const renderFlexibleBudgetForm = () => {
    return (
      <FlexibleBudgetForm
        className={css(styles.topMargin)}
        merchantBudget={campaign.merchantBudget}
        localizedCurrency={campaign.localizedCurrency}
        edit
        flexibleBudgetType={flexibleBudgetType}
      />
    );
  };

  const allowFlexibleBudget =
    (allowFlexibleBudgetV2 || allowFlexibleBudgetSuggestBudget) &&
    !campaign.isCampaignEligibleForBonusBudget();
  const showFlexibleBudgetOption =
    (!campaign.isNewState || allowFlexibleBudget) &&
    flexibleBudgetType != "DISABLED";

  return (
    <div className={css(className, styles.root)}>
      {campaign.showIncreaseCampaignBudget() && (
        <IncreaseBudgetBanner
          title={i`Up your budget to meet increased demand!`}
        />
      )}
      <div className={css(styles.text, styles.topMargin)}>
        Please note that your total budget cannot exceed your maximum budget.
      </div>
      <HorizontalField
        title={() => (
          <>
            <span>How much would you like to set</span>
            {wishSubsidyDiscountFactor > 0.0 && (
              <Info
                text={() => {
                  return (
                    <WishSubsidyBudgetForm
                      merchantBudget={
                        campaign.merchantBudget
                          ? campaign.merchantBudget.toString()
                          : "0.0"
                      }
                      localizedCurrency={campaign.localizedCurrency}
                      wishSubsidyDiscountFactor={wishSubsidyDiscountFactor}
                    />
                  );
                }}
                popoverMaxWidth={200}
                sentiment="success"
                className={css(styles.wishSubsidyBudgetInfo)}
              />
            )}
            {campaign.isCampaignEligibleForBonusBudget() && (
              <Info
                text={() => {
                  return (
                    <BonusBudgetForm
                      merchantBudget={
                        campaign.merchantBudget
                          ? campaign.merchantBudget.toString()
                          : "0.00"
                      }
                      localizedCurrency={campaign.localizedCurrency}
                      bonusBudgetRate={campaign.getBonusBudgetRate()}
                      bonusBudgetType={campaign.getBonusBudgetPromotionType()}
                      showPromoMessage
                      showExample
                      showCalculation
                    />
                  );
                }}
                contentWidth={700}
                sentiment="success"
                className={css(styles.wishSubsidyBudgetInfo)}
              />
            )}
          </>
        )}
        centerTitleVertically
        className={css(styles.topMargin)}
      >
        <CurrencyInput
          currencyCode={localizedCurrencyCode}
          value={campaign.merchantBudget}
          validators={budgetValidator ? [budgetValidator] : []}
          onChange={({ text }: OnTextChangeEvent) => {
            campaign.merchantBudget = text;
          }}
          focusOnMount={!notFocusOnMount}
          placeholder={suggestedBudget.toFixed(2)}
          className={css(styles.input)}
        />
      </HorizontalField>
      <HorizontalField
        title={i`Add budget regularly`}
        centerTitleVertically
        className={css(styles.topMargin)}
      >
        <ScheduledBudgetCheckbox campaign={campaign} />
      </HorizontalField>
      {campaign.scheduledAddBudgetEnabled && (
        <ScheduledBudgetForm campaign={campaign} />
      )}
      {showFlexibleBudgetOption && (
        <HorizontalField
          title={i`Receive Reward Budget`}
          centerTitleVertically
          className={css(styles.topMargin)}
        >
          <FlexibleBudgetCheckbox
            campaign={campaign}
            flexibleBudgetType={flexibleBudgetType}
            disable={false}
          />
        </HorizontalField>
      )}
      {allowFlexibleBudget &&
        campaign.flexibleBudgetEnabled &&
        renderFlexibleBudgetForm()}
      {maxAllowedSpending != null && (
        <HorizontalField
          title={i`Maximum budget available`}
          className={css(styles.topMargin)}
        >
          <div className={css(styles.text, styles.semiboldText)}>
            {formatCurrency(maxAllowedSpending, localizedCurrencyCode)}
          </div>
        </HorizontalField>
      )}
      {showSuggestedBudget && (
        <Alert
          title={i`Increase your budget to ${formatCurrency(
            suggestedBudget,
            localizedCurrencyCode
          )} or above.`}
          text={
            i`Budgets that are below this suggested amount will run out ` +
            i`before your scheduled end date. To ensure the impressions for ` +
            i`this campaign, please increase your budget. Note that if ` +
            i`IntenseBoost is enabled the minimal daily budget might be higher.`
          }
          sentiment="negative"
          className={css(styles.topMargin)}
        />
      )}
      {showFlexibleBudgetSuggestedBudgetAlert && (
        <Alert
          title={i`Increase your budget to ${formatCurrency(
            suggestedBudget * flexibleBudgetSuggestedBudgetFactor,
            localizedCurrencyCode
          )} to enjoy Reward Budget!`}
          text={
            i`If you increase your budget, you will have the option to enable Reward Budget ` +
            i`and enjoy extra free impressions!`
          }
          sentiment="positive"
          className={css(styles.topMargin)}
        />
      )}
      {maxAllowedSpending != null && campaign.maxSpendingBreakdown && (
        <BudgetBreakDownTable
          maxAllowedSpending={maxAllowedSpending}
          maxSpendingBreakdown={campaign.maxSpendingBreakdown}
          isPayable={isPayable}
          className={css(styles.topMargin)}
          expended
        />
      )}
    </div>
  );
};

export default observer(Budget);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        text: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightMedium,
        },
        semiboldText: {
          fontWeight: fonts.weightSemibold,
        },
        topMargin: {
          marginTop: 20,
        },
        input: {
          "@media (max-width: 900px)": {
            width: "100%",
          },
          "@media (min-width: 900px)": {
            width: "60%",
          },
        },
        wishSubsidyBudgetInfo: {
          marginLeft: 5,
        },
      }),
    []
  );
};
