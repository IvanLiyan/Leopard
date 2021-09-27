/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

export type CampaignSuggestion =
  | "TURN_ON_EVERGREEN"
  | "ADD_BUDGET"
  | "DUPLICATE_AUTOMATED_CAMPAIGN"
  | "DUPLICATE_CAMPAIGN"
  | "RECHARGE"
  | "ENABLE_AUTOMATED"
  | "ENABLE_EVERGREEN";

export class CampaignSuggestionsHelper {
  minStartDate: Date;
  maxStartDate: Date;

  constructor(params: { minStartDateUnix: number; maxStartDateUnix: number }) {
    this.minStartDate = new Date(params.minStartDateUnix * 1000);
    this.maxStartDate = new Date(params.maxStartDateUnix * 1000);
  }

  displaySuggestion(params: {
    campaign: Campaign;
    suggestion: CampaignSuggestion;
    maxAllowedSpending: number;
  }) {
    const { campaign, suggestion, maxAllowedSpending } = params;
    const { minStartDate, maxStartDate } = this;
    const maxBudget = campaign.oldBudget || 0;
    const budgetDiff = maxBudget - maxAllowedSpending;
    const haveBudget = +budgetDiff.toFixed(2) < 0.01;
    if (!campaign) {
      return false;
    }
    const spendOverGmv =
      campaign.cappedSpend && campaign.gmv > 0
        ? +(campaign.cappedSpend / campaign.gmv).toFixed(2)
        : null;

    switch (suggestion) {
      case "TURN_ON_EVERGREEN":
        if (!minStartDate || !maxStartDate) {
          return false;
        }

        return (
          (campaign.state === "NEW" ||
            campaign.state === "SAVED" ||
            campaign.state === "STARTED") &&
          campaign.campaignSource !== 5 &&
          campaign.campaignSource !== 6 &&
          !campaign.isEvergreen
        );
      case "ADD_BUDGET":
        return (
          campaign.state === "STARTED" &&
          campaign.automatedState === -1 &&
          campaign.campaignSource !== 5 &&
          (campaign.isBudgetDepleted || campaign.isBudgetNearlyDepleted)
        );
      case "DUPLICATE_AUTOMATED_CAMPAIGN":
        if (!minStartDate || !maxStartDate) {
          return false;
        }

        return (
          campaign.state === "ENDED" &&
          (campaign.campaignSource === 5 || campaign.campaignSource === 6) &&
          spendOverGmv &&
          spendOverGmv <= 0.3
        );
      case "DUPLICATE_CAMPAIGN":
        return (
          campaign.state === "ENDED" &&
          campaign.campaignSource !== 5 &&
          campaign.campaignSource !== 6 &&
          spendOverGmv &&
          spendOverGmv <= 0.3
        );
      case "RECHARGE":
        if (maxAllowedSpending == null) {
          return false;
        }

        return (
          campaign.state === "PENDING" &&
          campaign.campaignSource !== 5 &&
          campaign.campaignSource !== 6 &&
          !haveBudget
        );
      case "ENABLE_AUTOMATED":
        if (!minStartDate || !maxStartDate) {
          return false;
        }

        return (
          campaign.state === "PENDING" &&
          (campaign.campaignSource === 5 || campaign.campaignSource === 6)
        );
      case "ENABLE_EVERGREEN":
        if (maxAllowedSpending == null) {
          return false;
        }

        return (
          campaign.state === "PENDING" &&
          campaign.campaignSource !== 5 &&
          campaign.campaignSource !== 6 &&
          haveBudget
        );
      default:
        return false;
    }
  }
}
