//
// All the explanation texts in this file are migrated from PaidPlacementCampaign.explanation_dict
//   and PaidPlacementCampaignProductFeedback.Type.explanation_dict

export const ProductBoostCampaignExplanations: {
  [field: string]: string;
} = {
  BUDGET:
    i`The maximum amount of money you initially set to spend on this ` +
    i`campaign. You may increase your budget here.`,
  SPEND:
    i`The total cost of paid impressions on your products during ` +
    i`the campaign period. Total spend will not exceed budget.`,
  PAID_IMPRESSIONS:
    i`The number of times your product was viewed through your ` +
    i`ProductBoost campaign during the campaign period.`,
  INTERNAL_SPEND:
    i`The cost of internal impressions on your products during the ` +
    i`campaign period.`,
  INTERNAL_IMPRESSIONS:
    i`The number of times your product was viewed through your ` +
    i`ProductBoost campaign during the campaign period.`,
  EXTERNAL_SPEND:
    i`The cost of MaxBoost impressions on your products during the ` +
    i`campaign period.`,
  EXTERNAL_IMPRESSIONS:
    i`The number of times your product was viewed through external ` +
    i`media during the campaign period.`,
  SALES:
    i`The number of times your products were purchased during your ` +
    i`set campaign period.`,
  GMV:
    i`Gross merchandising value, which indicates a total sales ` +
    i`value for products sold during the campaign period.`,
  BID:
    i`The current amount you will pay per ${1000} impressions during ` +
    i`the campaign period.`,
  CPM:
    i`The amount you will pay per ${1000} impressions during the ` +
    i`campaign period.`,
  TOTAL_IMPRESSIONS:
    i`The total number of times your products were viewed during ` +
    i`the campaign period.`,
  START_DATE: i`The starting date in Pacific Standard Time.`,
  END_DATE: i`The ending date in Pacific Standard Time.`,
  CURRENT_UNPAID: i`The current unpaid amount on this campaign.`,
  IS_AUTOMATED:
    i`Wish has already curated keywords and budget for ` +
    i`this campaign, this campaign cannot be edited.`,
  IS_EVERGREEN:
    i`Continue successful campaigns by choosing ` +
    i`to automatically renew them upon completion.`,
  STATE:
    i`This shows your campaign status. For a detailed explanation, ` +
    i`please refer to our FAQ.`,
  MAX_BOOST:
    i`Products enrolled in MaxBoost will be promoted in external ` +
    i`media as well.`,
  SPEND_OVER_GMV:
    i`The total cost of paid impressions on your products over gross ` +
    i`merchandising value during the campaign period.`,
  BRAND_BOOST:
    i`Products that are associated with a true brand are enrolled in ` +
    i`BrandBoost.`,
};

export const ProductBoostProductFeedbackExplanations: {
  [field: string]: string;
} = {
  REJECTED:
    i`This product has been flagged as a prohibited product ` +
    i`and is therefore not eligible to be used in your campaign.`,
  OUT_OF_STOCK: i`This product ran out of inventory during your campaign period.`,
  DISABLED:
    i`This product was disabled during the campaign and cannot ` +
    i`be used in your campaign.`,
  LOW_BID:
    i`The bid for this product was too low for the chosen ` +
    i`keywords. Try increasing your bid for more impressions.`,
  LOW_BID_HARD_CUT:
    i`The bid for this product was too low for the following ` + i`keywords:`,
  LOW_RATING:
    i`The product promoted has a low rating. We recommend ` +
    i`promoting products with high ratings to improve your ` +
    i`sales performance.`,
  LOW_CONVERSION_PRODUCT:
    i`This product is not receiving paid impressions ` +
    i`because of low conversion rate.`,
};

export const DailyBudgetCampaignExplanations: {
  [field: string]: string;
} = {
  WISHES_LIFETIME:
    i`The number of users who have wished on the product ` +
    i`during product lifetime.`,
  SALES_LIFETIME:
    i`The number of times your products were purchased ` +
    i`during product lifetime.`,
  DAILY_BUDGET:
    i`Your daily budget amounts will be spent on a daily ` +
    i`basis to ensure a steady sales growth throughout your promotion.`,
  GMV_LIFETIME:
    i`Gross merchandising value, which indicates a total sales ` +
    i`value for products sold during product lifetime.`,
  SPEND_LIFETIME:
    i`The total cost of paid impressions on your products during ` +
    i`product lifetime. Total spend will not exceed total budget.`,
  SPEND_OVER_GMV_LIFETIME:
    i`The total cost of paid impressions on your products over gross ` +
    i`merchandising value during product lifetime.`,
  STATE: i`This shows your product current status.`,
  IMPRESSIONS_LIFETIME:
    i`The total number of times your products were viewed during ` +
    i`product lifetime.`,
  INTENSE_BOOST:
    i`Quickly increasing your advertising impressions. ` +
    i`This might require a higher minimal daily budget.`,
};
