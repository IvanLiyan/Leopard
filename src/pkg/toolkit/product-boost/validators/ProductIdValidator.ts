/* Lego Toolkit */
import { Validator, ObjectIdValidator } from "@toolkit/validators";

/* Toolkit */
import DuplicateProductIdValidator from "@toolkit/product-boost/validators/DuplicateProductIdValidator";
import VerifyProductIdValidator from "@toolkit/product-boost/validators/VerifyProductIdValidator";

export default class ProductIdValidator extends Validator {
  productIds: ReadonlyArray<string> | null | undefined;
  campaignId: string | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;

  constructor({
    customMessage,
    productIds,
    campaignId,
    startDate,
    endDate,
  }: {
    customMessage?: string | null | undefined;
    productIds?: ReadonlyArray<string> | null | undefined;
    campaignId?: string | null | undefined;
    startDate?: string | null | undefined;
    endDate?: string | null | undefined;
  } = {}) {
    super({ customMessage });
    this.productIds = productIds;
    this.campaignId = campaignId;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  getRequirements() {
    const requirements = [
      new ObjectIdValidator({
        customMessage: i`Please enter a valid product ID`,
      }),
      new DuplicateProductIdValidator({ productIds: this.productIds }),
    ];
    requirements.push(
      new VerifyProductIdValidator({
        campaignId: this.campaignId,
        startDate: this.startDate,
        endDate: this.endDate,
      }),
    );
    return requirements;
  }
}
