/* Lego Toolkit */
import {
  Validator,
  CurrencyValidator,
  RequiredValidator,
} from "@toolkit/validators";
import { formatCurrency } from "@toolkit/currency";
import { ValidationResponse } from "@toolkit/validators";
import { CurrencyCode } from "@toolkit/currency";

export default class ScheduledBudgetValidator extends Validator {
  currencyCode: CurrencyCode;
  minBudgetToAdd: number;
  maxBudgetToAdd: number;

  constructor({
    customMessage,
    currencyCode,
    minBudgetToAdd,
    maxBudgetToAdd,
  }: {
    customMessage?: string | null | undefined;
    currencyCode?: CurrencyCode;
    minBudgetToAdd?: number | null | undefined;
    maxBudgetToAdd?: number | null | undefined;
  } = {}) {
    super({ customMessage });
    this.currencyCode = currencyCode ? currencyCode : "USD";
    // we shouldn't use minBudgetToAdd and maxBudgetToAdd when there is no value passed in for them.
    this.minBudgetToAdd = minBudgetToAdd ? minBudgetToAdd : 1.0;
    this.maxBudgetToAdd = maxBudgetToAdd ? maxBudgetToAdd : 10000.0;
  }

  getRequirements() {
    return [
      new CurrencyValidator(),
      new RequiredValidator({
        customMessage: i`Scheduled amount cannot be empty`,
      }),
    ];
  }

  async validateText(text: string): Promise<ValidationResponse> {
    const { customMessage } = this;
    const num = parseFloat(text);
    if (num < this.minBudgetToAdd) {
      return customMessage
        ? customMessage
        : i`Amount must be at least ${formatCurrency(
            this.minBudgetToAdd,
            this.currencyCode,
          )}`;
    }
    if (num > this.maxBudgetToAdd) {
      return customMessage
        ? customMessage
        : i`Amount must be at most ${formatCurrency(
            this.maxBudgetToAdd,
            this.currencyCode,
          )}`;
    }
    return null;
  }
}
