/* Lego Toolkit */
import { Validator, CurrencyValidator } from "@toolkit/validators";
import { ValidationResponse } from "@toolkit/validators";

export default class BidValidator extends Validator {
  maxBid: number;
  minBid: number;

  constructor({
    customMessage,
    minBid,
    maxBid,
  }: {
    customMessage?: string | null | undefined;
    maxBid?: number | null | undefined;
    minBid?: number | null | undefined;
  } = {}) {
    super({ customMessage });
    this.minBid = 0.3;
    this.maxBid = 10;
    if (typeof minBid === "number") this.minBid = minBid;
    if (typeof maxBid === "number") this.maxBid = maxBid;
  }

  getRequirements() {
    return [new CurrencyValidator()];
  }

  async validateText(text: string): Promise<ValidationResponse> {
    const { customMessage } = this;
    if (!text || !parseFloat(text)) {
      return null;
    }
    const num = parseFloat(text);
    if (num < this.minBid) {
      return customMessage ? customMessage : i`Min Bid is ${this.minBid}`;
    }
    if (num > this.maxBid) {
      return customMessage ? customMessage : i`Max Bid is ${this.maxBid}`;
    }
    return null;
  }
}
