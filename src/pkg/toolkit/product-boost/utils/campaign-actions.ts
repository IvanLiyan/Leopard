/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

export type CampaignAction =
  | "ENABLE_AUTOMATED"
  | "DUPLICATE_AUTOMATED_CAMPAIGN"
  | "ADD_BUDGET"
  | "ENABLE_EVERGREEN"
  | "RECHARGE_EVERGREEN"
  | "EDIT"
  | "CANCEL"
  | "STOP"
  | "DUPLICATE_CAMPAIGN"
  | "VIEW";

export class CampaignActionsHelper {
  minStartDate: Date;
  maxStartDate: Date;

  constructor(params: { minStartDateUnix: number; maxStartDateUnix: number }) {
    this.minStartDate = new Date(params.minStartDateUnix * 1000);
    this.maxStartDate = new Date(params.maxStartDateUnix * 1000);
  }

  canApply(params: {
    campaign: Campaign;
    action: CampaignAction;
    maxAllowedSpending: number;
  }) {
    const { campaign, action, maxAllowedSpending } = params;
    const { minStartDate, maxStartDate } = this;
    const maxBudget = campaign.oldBudget || 0;
    const budgetDiff = maxBudget - maxAllowedSpending;
    const haveBudget = +budgetDiff.toFixed(2) < 0.01;
    if (!campaign) {
      return false;
    }
    switch (action) {
      case "ENABLE_AUTOMATED":
        if (!minStartDate || !maxStartDate) {
          return false;
        }

        return (
          campaign.state === "PENDING" &&
          (campaign.campaignSource === 5 || campaign.campaignSource === 6)
        );
      case "DUPLICATE_AUTOMATED_CAMPAIGN":
        if (!minStartDate || !maxStartDate) {
          return false;
        }

        return (
          (campaign.state === "STARTED" || campaign.state === "ENDED") &&
          (campaign.campaignSource === 5 || campaign.campaignSource === 6)
        );
      case "ADD_BUDGET":
        return (
          (campaign.state === "STARTED" || campaign.state === "SAVED") &&
          campaign.campaignSource !== 5
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
      case "RECHARGE_EVERGREEN":
        if (maxAllowedSpending == null) {
          return false;
        }

        return (
          campaign.state === "PENDING" &&
          campaign.campaignSource !== 5 &&
          campaign.campaignSource !== 6 &&
          !haveBudget
        );
      case "EDIT":
        if (campaign.campaignSource === 5 || campaign.campaignSource === 6) {
          return false;
        }

        return (
          campaign.state === "NEW" ||
          campaign.state === "SAVED" ||
          campaign.state === "STARTED" ||
          campaign.state === "PENDING"
        );
      case "CANCEL":
        return (
          campaign.state === "NEW" ||
          campaign.state === "PENDING" ||
          (campaign.state === "SAVED" && campaign.createdFromEvergreen === true)
        );
      case "STOP":
        return campaign.state === "STARTED";
      case "DUPLICATE_CAMPAIGN":
        return (
          (campaign.state === "STARTED" || campaign.state === "ENDED") &&
          campaign.campaignSource !== 5 &&
          campaign.campaignSource !== 6
        );
      case "VIEW":
        return true;
    }
    return false;
  }
}
