/* Lego Toolkit */
import {
  Validator,
  RequiredValidator,
  CurrencyValidator,
} from "@toolkit/validators";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { ValidationResponse } from "@toolkit/validators";
import { CurrencyCode } from "@toolkit/currency";

export default class AddBudgetValidator extends Validator {
  minAmount: number;
  maxAllowedSpending: number;
  currencyCode: CurrencyCode;

  constructor({
    customMessage,
    minAmount,
    maxAllowedSpending,
    currencyCode,
  }: {
    customMessage?: string | null | undefined;
    minAmount: number;
    maxAllowedSpending: number;
    currencyCode?: CurrencyCode;
  }) {
    super({ customMessage });
    this.minAmount = minAmount;
    this.maxAllowedSpending = maxAllowedSpending;
    this.currencyCode = currencyCode ? currencyCode : "USD";
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
    const budgetToAdd = parseFloat(text);

    if (budgetToAdd !== 0 && budgetToAdd < this.minAmount) {
      return i`Cannot add less than ${formatCurrency(
        this.minAmount,
        this.currencyCode,
      )} to your budget`;
    }

    if (budgetToAdd > this.maxAllowedSpending) {
      return i`Your maximum allowed spending is ${formatCurrency(
        this.maxAllowedSpending,
        this.currencyCode,
      )}`;
    }

    return null;
  }
}
