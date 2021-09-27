/* Lego Toolkit */
import { Validator } from "@toolkit/validators";
import { ValidationResponse } from "@toolkit/validators";

export default class KeywordsValidator extends Validator {
  maxNumOfKeywords: number;
  maxKeywordLength: number;

  constructor({
    customMessage,
    maxNumOfKeywords,
    maxKeywordLength,
  }: {
    customMessage?: string | null | undefined;
    maxNumOfKeywords?: number | null | undefined;
    maxKeywordLength?: number | null | undefined;
  } = {}) {
    super({ customMessage });
    this.maxNumOfKeywords = 30;
    this.maxKeywordLength = 50;
    if (typeof maxNumOfKeywords === "number") {
      this.maxNumOfKeywords = maxNumOfKeywords;
    }
    if (typeof maxKeywordLength === "number") {
      this.maxKeywordLength = maxKeywordLength;
    }
  }

  async validateText(text: string): Promise<ValidationResponse> {
    const { customMessage } = this;
    const keywords = text.split(",").filter((k) => k.length > 0);
    if (keywords.length !== new Set(keywords).size) {
      if (customMessage) {
        return customMessage;
      }
      return i`Duplicate keywords`;
    }
    if (keywords.length > this.maxNumOfKeywords) {
      if (customMessage) {
        return customMessage;
      }
      return i`At most ${this.maxNumOfKeywords} keywords allowed`;
    }
    for (const keyword of keywords) {
      if (keyword.length > this.maxKeywordLength) {
        if (customMessage) {
          return customMessage;
        }
        return i`${keyword.substring(0, 8)}... must be less than ${
          this.maxKeywordLength
        } characters`;
      }
    }
    return null;
  }
}
