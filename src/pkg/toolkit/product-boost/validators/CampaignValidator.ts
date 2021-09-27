/* External Libraries */
import moment from "moment/moment";

/* Lego Toolkit */
import { ValidationResponse } from "@toolkit/validators";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";

/* Toolkit */
import CampaignNameValidator from "@toolkit/product-boost/validators/CampaignNameValidator";
import ProductIdValidator from "@toolkit/product-boost/validators/ProductIdValidator";
import KeywordsValidator from "@toolkit/product-boost/validators/KeywordsValidator";
import BudgetValidator from "@toolkit/product-boost/validators/BudgetValidator";

const formatDate = (
  date: Date | null | undefined
): string | null | undefined => {
  if (date) {
    return moment(date).format("YYYY-MM-DD");
  }
};

export default class CampaignValidator {
  campaign: Campaign;
  minBudget: number;
  maxAllowedSpending: number;
  maxNameLength: number;

  constructor({
    campaign,
    minBudget,
    maxAllowedSpending,
    maxNameLength,
  }: {
    readonly campaign: Campaign;
    readonly minBudget: number;
    readonly maxAllowedSpending: number;
    readonly maxNameLength: number;
  }) {
    this.campaign = campaign;
    this.minBudget = minBudget;
    this.maxAllowedSpending = maxAllowedSpending;
    this.maxNameLength = maxNameLength;
  }

  async validate() {
    // validateProductIds at the end because it's the slowest
    // it needs API call to product-boost/verify-product-id
    let requirements = [
      () => this.validateName(),
      () => this.validateBudget(),
      () => this.validateProductsLength(),
      this.campaign.isNewState && (() => this.validateProductIds()),
    ].filter((_) => !!_);
    if (!this.campaign.isV2) {
      requirements = [() => this.validateKeywords(), ...requirements];
    }
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

  async validateName(): Promise<ValidationResponse> {
    if (typeof this.campaign.name === "string") {
      const validator = new CampaignNameValidator({
        maxLength: this.maxNameLength,
      });
      return await validator.validate(this.campaign.name);
    }
  }

  async validateProductsLength(): Promise<ValidationResponse> {
    const { products } = this.campaign;
    if (!products || products.length === 0) {
      return i`Please include at least 1 product`;
    }
    return null;
  }

  async validateProductIds(): Promise<ValidationResponse> {
    if (this.campaign.products) {
      const productIds = this.campaign.products.map((p) => p.id);
      const campaignId = this.campaign.id;
      const startDate = formatDate(this.campaign.startDate);
      const endDate = formatDate(this.campaign.endDate);
      const validator = new ProductIdValidator({
        productIds,
        campaignId,
        startDate,
        endDate,
      });
      const responses = await Promise.all(
        this.campaign.products.map(async (p) => await validator.validate(p.id))
      );
      return responses.find((resp) => resp !== null) || null;
    }
  }

  async validateKeywords(): Promise<ValidationResponse> {
    if (this.campaign.products) {
      const validator = new KeywordsValidator({});
      for (const product of this.campaign.products) {
        const response = await validator.validate(product.keywords || "");
        if (response) {
          return response;
        }
      }
      return null;
    }
  }

  async validateBudget(): Promise<ValidationResponse> {
    const validator = new BudgetValidator({
      minBudget: this.minBudget,
      maxAllowedSpending: this.maxAllowedSpending,
      isNewState: this.campaign.isNewState,
      oldBudget: this.campaign.oldBudget || 0,
      currencyCode: this.campaign.localizedCurrency,
    });
    return await validator.validate(this.campaign.merchantBudget || "");
  }
}
