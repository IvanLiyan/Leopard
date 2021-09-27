import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

export const BonusBudgetPromotionExplanations: {
  [field: string]: string;
} = {
  BONUS_BUDGET_PROMOTION:
    i`You have been selected to automatically receive bonus ` +
    i`budget from Wish for creating PB campaigns during the month ` +
    i`of February. You will receive ${20}% more additional bonus ` +
    i`budget on your campaign. `,
  BONUS_BUDGET_EXAMPLE:
    i`For example: You set a ${formatCurrency(
      100,
      "USD"
    )} budget for the PB campaign. ` +
    i`An additional ${formatCurrency(
      20,
      "USD"
    )} bonus budget is added to the campaign. ` +
    i`The PB campaign will then have a total of ${formatCurrency(
      120,
      "USD"
    )} available ` +
    i`budget to spend on the campaign. After the campaign runs and ` +
    i`${formatCurrency(
      90,
      "USD"
    )} spend was used, merchant will only be charged ${formatCurrency(
      75,
      "USD"
    )} ` +
    i`for this campaign as the bonus budget was applied to the final spend amount.`,
  BONUS_BUDGET_DEFINITION:
    i`The final used bonus budget is equal to ` +
    i`bonus budget * ( actual spend / campaign budget ).`,
  BONUS_BUDGET_COLUMN:
    i`The maximum amount of money to spend on this campaign. The ` +
    i`total budget may represent the initial merchant set budget ` +
    i`and the Wish granted additional bonus budget for select campaigns. ` +
    i`You may increase your budget here.`,
  BONUS_BUDGET_BREAKDOWN:
    i`The initial budget you set is ${formatCurrency(
      10,
      "USD"
    )}, and Wish granted you ` +
    i`additional ${formatCurrency(2, "USD")} as bonus budget.`,
};
