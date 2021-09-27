/* Lego Toolkit */
import { Validator } from "@toolkit/validators";
import { ValidationResponse } from "@toolkit/validators";

export default class DuplicateProductIdValidator extends Validator {
  productIds: ReadonlyArray<string> | null | undefined;

  constructor({
    customMessage,
    productIds,
  }: {
    customMessage?: string | null | undefined;
    productIds?: ReadonlyArray<string> | null | undefined;
  } = {}) {
    super({ customMessage });
    this.productIds = productIds;
  }

  async validateText(text: string): Promise<ValidationResponse> {
    const { customMessage } = this;
    let counter = 0;
    if (this.productIds) {
      for (const pid of this.productIds) {
        if (pid === text) counter++;
        if (counter > 1) {
          if (customMessage) {
            return customMessage;
          }
          return i`Duplicate product ID`;
        }
      }
    }
    return null;
  }
}
