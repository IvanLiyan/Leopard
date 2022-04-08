/* External Libraries */
import moment from "moment-timezone";
import { Moment } from "moment/moment";

/* Lego Toolkit */
import { Validator, DateFormatValidator } from "@toolkit/validators";
import { ValidationResponse } from "@toolkit/validators";
import { formatDatetimeLocalized } from "@toolkit/datetime";

export default class DateSanityValidator extends Validator {
  sysDate: Moment | null | undefined;
  trackingModifiedDate: Moment | null | undefined;
  expectedDeadline: Moment | null | undefined;
  requiredDeliveryDate: Moment | null | undefined;
  today: Moment;
  fieldName: string;
  constructor({
    customMessage,
    fieldName,
    sysDate,
    trackingModifiedDate,
    expectedDeadline,
    requiredDeliveryDate,
  }: {
    customMessage?: string | null | undefined;
    fieldName: string;
    sysDate: string;
    trackingModifiedDate: string;
    expectedDeadline?: string | null | undefined;
    requiredDeliveryDate?: string | null | undefined;
  }) {
    super({ customMessage });
    this.sysDate = this.strToDateWithDash(sysDate);
    this.trackingModifiedDate = this.strToDateWithDash(trackingModifiedDate);
    this.expectedDeadline = this.strToDateWithDash(expectedDeadline);
    this.requiredDeliveryDate = this.strToDateWithDash(requiredDeliveryDate);
    this.today = moment.utc();
    this.fieldName = fieldName;
  }

  getRequirements(): ReadonlyArray<Validator> {
    const { customMessage } = this;
    return [
      new DateFormatValidator({
        customMessage,
      }),
    ];
  }

  strToDateWithDash(
    currentDate: string | null | undefined
  ): Moment | null | undefined {
    if (currentDate == null) {
      return null;
    }
    return moment.utc(currentDate, "MM-DD-YYYY");
  }

  strToDateWithSlash(currentDate: string): Moment | null | undefined {
    return moment.utc(currentDate, "MM/DD/YYYY");
  }

  async validateText(text: string): Promise<ValidationResponse> {
    const {
      sysDate,
      trackingModifiedDate,
      today,
      fieldName,
      requiredDeliveryDate,
    } = this;
    const testDate = this.strToDateWithSlash(text);
    if (!testDate) {
      return null;
    }
    if (testDate.isAfter(today)) {
      return i`Please enter a valid date no later than today`;
    } else if (sysDate && testDate.isAfter(sysDate)) {
      return (
        i`Please enter a ${fieldName} earlier than ` +
        i`what is currently in our system: ${formatDatetimeLocalized(
          sysDate,
          "MMM Do YYYY"
        )}`
      );
    } else if (
      trackingModifiedDate &&
      testDate.isBefore(trackingModifiedDate)
    ) {
      return (
        i`Please enter a ${fieldName} later than the date ` +
        i`modified tracking number: ${formatDatetimeLocalized(
          trackingModifiedDate,
          "MMM Do YYYY"
        )}`
      );
    } else if (requiredDeliveryDate && testDate.isAfter(requiredDeliveryDate)) {
      return (
        i`Please enter a ${fieldName} earlier than the required ` +
        i`delivery date: ${formatDatetimeLocalized(
          requiredDeliveryDate,
          "MMM Do YYYY"
        )}`
      );
    }

    return null;
  }

  async deadlineMeetsWarning(
    text: string | null | undefined
  ): Promise<ValidationResponse> {
    if (text == null) {
      return null;
    }
    for (const validator of this.getRequirements()) {
      try {
        const response = await validator.validate(text);
        if (response != null) {
          return null;
        }
      } catch (e) {
        return null;
      }
    }
    const testDate = this.strToDateWithSlash(text);
    if (
      this.expectedDeadline &&
      testDate &&
      testDate.isAfter(this.expectedDeadline)
    ) {
      return (
        i`Since the ${this.fieldName} is later than ${formatDatetimeLocalized(
          this.expectedDeadline,
          "MMM Do YYYY"
        )},` + i` after the dispute is approved, the fine will not be reversed.`
      );
    }
    return null;
  }
}
