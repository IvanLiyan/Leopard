/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { CurrencyCode } from "@toolkit/currency";
import { ValidationResponse } from "@toolkit/validators";

/* Merchant Model */
import Product from "@merchant/model/product-boost/Product";

/* Toolkit */
import BudgetValidator from "@toolkit/product-boost/validators/BudgetValidator";
import ProductIdValidator from "@toolkit/product-boost/validators/ProductIdValidator";

export default class DailyBudgetCampaignValidator {
  minBudget: number;
  maxAllowedSpending: number;
  currencyCode: CurrencyCode;
  dailyBudgetCampaignLimit: number;
  products: ReadonlyArray<Product>;
  budgets: Map<string, string>;

  constructor({
    minBudget,
    maxAllowedSpending,
    currencyCode,
    dailyBudgetCampaignLimit,
    products,
    budgets,
  }: {
    minBudget: number;
    maxAllowedSpending: number;
    currencyCode: CurrencyCode;
    dailyBudgetCampaignLimit: number;
    products: ReadonlyArray<Product>;
    budgets: Map<string, string>;
  }) {
    this.minBudget = minBudget;
    this.maxAllowedSpending = maxAllowedSpending;
    this.currencyCode = currencyCode;
    this.dailyBudgetCampaignLimit = dailyBudgetCampaignLimit;
    this.products = products;
    this.budgets = budgets;
  }

  async validate() {
    const requirements = [
      () => this.validateBudgets(),
      () => this.validateProductsLength(),
      () => this.validateProductIds(),
    ];

    for (const validationFn of requirements) {
      if (!validationFn) {
        continue;
      }
      const response = await validationFn();
      if (response) {
        return response;
      }
    }
    return null;
  }

  async validateProductsLength(): Promise<ValidationResponse> {
    const { products, dailyBudgetCampaignLimit } = this;
    if (products.length > dailyBudgetCampaignLimit) {
      return ci18n(
        "Cannot promote more than number of products products at once.",
        "Cannot promote more than %1$s products at once.",
        dailyBudgetCampaignLimit
      );
    }
    return null;
  }

  async validateBudgets(): Promise<ValidationResponse> {
    const {
      minBudget,
      maxAllowedSpending,
      currencyCode,
      products,
      budgets,
    } = this;
    const validator = new BudgetValidator({
      oldBudget: 0,
      minBudget,
      maxAllowedSpending,
      currencyCode,
      isNewState: true,
    });

    let totalBudget = 0.0;
    for (const product of products) {
      const budget = budgets.get(product.id);

      // validate if product has budget
      if (budget === undefined || budget.trim().length === 0) {
        return ci18n(
          "Please provide a budget for product: product id.",
          "Please provide a budget for product: %1$s.",
          product.id
        );
      }

      // validate budget
      const error = await validator.validateText(budget);
      if (error) return error;
      totalBudget += parseFloat(budget);
    }

    // validate if total budget is less than max allowed spending
    if (totalBudget > maxAllowedSpending) {
      return i`Total budget must be less than or equal to max amount you can spend.`;
    }

    return null;
  }

  async validateProductIds(): Promise<ValidationResponse> {
    const { products } = this;
    const validator = new ProductIdValidator({
      productIds: products.map((p) => p.id),
    });

    const responses = await Promise.all(
      products.map(async (p) => await validator.validate(p.id))
    );
    return responses.find((resp) => resp !== null) || null;
  }
}
