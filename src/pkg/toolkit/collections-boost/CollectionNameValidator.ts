/* Lego Toolkit */
import {
  Validator,
  RequiredValidator,
  CharacterLength,
} from "@toolkit/validators";

export default class CollectionNameValidator extends Validator {
  maxLength: number | null | undefined;

  constructor({
    customMessage,
    maxLength,
  }: {
    customMessage?: string | null | undefined;
    maxLength?: number | null | undefined;
  } = {}) {
    super({ customMessage });
    this.maxLength = maxLength;
  }

  getRequirements() {
    const requirements = [
      new RequiredValidator({
        customMessage: i`Collection Name cannot be empty`,
      }),
    ];
    if (this.maxLength) {
      requirements.push(
        new CharacterLength({
          maximum: this.maxLength,
          customMessage: i`Collection Name cannot be longer than ${this.maxLength} characters`,
        }),
      );
    }
    return requirements;
  }
}
