/* External Libraries */
import numeral from "numeral";

/* Type Import */
import { MarketingFlexibleBudgetType } from "@schema/types";

export const FlexibleBudgetConstant = {
  FIRST_TIER_PERCENTAGE: 0.3,
  FIRST_TIER_DISCOUNT: 0.5,
  SECOND_TIER_PERCENTAGE: 0.2,
  SECOND_TIER_DISCOUNT: 0.8,
};

export class CampaignFlexibleBudgetHelper {
  budgetSet: number;
  canUseAllTier = true;

  constructor(
    budgetSet: number,
    flexibleBudgetType?: MarketingFlexibleBudgetType
  ) {
    this.budgetSet = budgetSet;
    this.canUseAllTier = flexibleBudgetType == "ALL_TIER"; // All tier
  }

  getMerchantBudget() {
    return this.budgetSet ? Math.round(this.budgetSet * 100) / 100 : 0;
  }

  getFirstTierBudget(applyDiscount: boolean) {
    const merchantBudget = this.getMerchantBudget();
    if (merchantBudget < 1) {
      return 0.0;
    }
    const amount =
      merchantBudget * FlexibleBudgetConstant.FIRST_TIER_PERCENTAGE;
    return applyDiscount
      ? (1.0 - FlexibleBudgetConstant.FIRST_TIER_DISCOUNT) * amount
      : amount;
  }

  getSecondTierBudget(applyDiscount: boolean) {
    const merchantBudget = this.getMerchantBudget();
    if (merchantBudget < 1) {
      return 0.0;
    }
    const amount =
      merchantBudget * FlexibleBudgetConstant.SECOND_TIER_PERCENTAGE;
    return applyDiscount
      ? (1.0 - FlexibleBudgetConstant.SECOND_TIER_DISCOUNT) * amount
      : amount;
  }

  getFirstTierDiscount(): string {
    return i`${numeral(FlexibleBudgetConstant.FIRST_TIER_DISCOUNT).format(
      "0%"
    )} OFF`;
  }

  getSecondTierDiscount(): string {
    return i`${numeral(FlexibleBudgetConstant.SECOND_TIER_DISCOUNT).format(
      "0%"
    )} OFF`;
  }

  getFinalSpend(applyDiscount: boolean) {
    const merchantBudget = this.getMerchantBudget();
    if (merchantBudget < 1) {
      return merchantBudget;
    }
    if (!this.canUseAllTier) {
      return merchantBudget + this.getFirstTierBudget(applyDiscount);
    }
    return (
      merchantBudget +
      this.getFirstTierBudget(applyDiscount) +
      this.getSecondTierBudget(applyDiscount)
    );
  }

  getTotalDiscount() {
    const amount = this.getFinalSpend(false) - this.getFinalSpend(true);
    return amount >= 0.01 ? amount : 0.0;
  }

  canUseAllTierDiscount() {
    return this.canUseAllTier;
  }
}
