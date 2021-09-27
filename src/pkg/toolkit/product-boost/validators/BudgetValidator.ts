/* Lego Toolkit */
import {
  Validator,
  RequiredValidator,
  CurrencyValidator,
} from "@toolkit/validators";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { ValidationResponse } from "@toolkit/validators";
import { CurrencyCode } from "@toolkit/currency";

export default class BudgetValidator extends Validator {
  minBudget: number;
  oldBudget: number;
  maxAllowedSpending: number;
  isNewState: boolean | null | undefined;
  currencyCode: CurrencyCode;
  minBudgetToAdd: number;
  maxBudgetToAdd: number;

  constructor({
    customMessage,
    minBudget,
    oldBudget,
    maxAllowedSpending,
    isNewState,
    currencyCode,
    minBudgetToAdd,
    maxBudgetToAdd,
  }: {
    customMessage?: string | null | undefined;
    minBudget: number;
    oldBudget: number;
    maxAllowedSpending: number;
    isNewState: boolean | null | undefined;
    currencyCode?: CurrencyCode;
    minBudgetToAdd?: number | null | undefined;
    maxBudgetToAdd?: number | null | undefined;
  }) {
    super({ customMessage });
    this.minBudget = minBudget;
    this.oldBudget = oldBudget;
    this.maxAllowedSpending = maxAllowedSpending;
    this.isNewState = isNewState;
    this.currencyCode = currencyCode ? currencyCode : "USD";
    // we shouldn't use minBudgetToAdd and maxBudgetToAdd when there is no value passed in for them.
    this.minBudgetToAdd = minBudgetToAdd ? minBudgetToAdd : 1.0;
    this.maxBudgetToAdd = maxBudgetToAdd ? maxBudgetToAdd : 10000.0;
  }

  getRequirements() {
    return [
      new RequiredValidator({
        customMessage: i`Budget cannot be empty`,
      }),
      new CurrencyValidator(),
    ];
  }

  async validateText(text: string): Promise<ValidationResponse> {
    if (text.length && text[0] === "$") {
      text = text.substring(1);
    }
    const budget = parseFloat(text);
    if (
      Math.round((this.minBudget - this.maxAllowedSpending) * 100) / 100 >=
      0.01
    ) {
      return i`Max amount you can spend does not meet minimum budget(${formatCurrency(
        this.minBudget,
        this.currencyCode
      )}), please shorten the duration or remove products and try again.`;
    }

    if (budget < this.minBudget) {
      return i`Budget must be greater than or equal to ${formatCurrency(
        this.minBudget,
        this.currencyCode
      )}`;
    }

    if (this.isNewState) {
      let diff = budget - this.maxAllowedSpending;
      diff = Math.round(diff * 100) / 100;
      if (diff >= 0.01) {
        return i`Campaign budget must be less than or equal to max amount you can spend`;
      }
    } else {
      if (Math.round((this.oldBudget - budget) * 100) / 100 >= 0.01) {
        return i`Budget cannot be decreased at this stage`;
      }

      const budgetDelta = budget - this.oldBudget;
      if (budgetDelta !== 0 && budgetDelta < this.minBudgetToAdd) {
        return i`Amount of added budget must be greater than ${formatCurrency(
          this.minBudgetToAdd,
          this.currencyCode
        )}`;
      }
      if (budgetDelta !== 0 && budgetDelta > this.maxBudgetToAdd) {
        return i`Amount of added budget must be less than ${formatCurrency(
          this.maxBudgetToAdd,
          this.currencyCode
        )}`;
      }

      let diff = budget - this.oldBudget - this.maxAllowedSpending;
      diff = Math.round(diff * 100) / 100;
      if (diff >= 0.01) {
        return i`Amount of added budget cannot exceed max amount you can spend`;
      }
    }

    return null;
  }
}
