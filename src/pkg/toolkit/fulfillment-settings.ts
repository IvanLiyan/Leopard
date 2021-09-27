import _ from "lodash";
import {
  Datetime,
  VacationSchema,
  MerchantSchema,
  MerchantFulfillmentExtensionSchema,
} from "@schema/types";
import { zendeskURL } from "@toolkit/url";

type PickedVacationSchema = Pick<
  VacationSchema,
  "isActive" | "vacationStatus"
> & {
  readonly startDate?: Pick<Datetime, "mmddyyyy"> | null;
  readonly endDate?: Pick<Datetime, "mmddyyyy"> | null;
};

type PickedFulfillmentExtension = Pick<
  MerchantFulfillmentExtensionSchema,
  "extensionDays" | "isActive" | "canEdit"
> & {
  readonly extensionDeadlineDate?: Pick<Datetime, "mmddyyyy">;
};

type PickedMerchant = Pick<MerchantSchema, "state" | "isMerchantPlus"> & {
  readonly vacation: PickedVacationSchema;
  readonly fulfillmentExtension: PickedFulfillmentExtension;
};

export type InitialData = {
  readonly currentMerchant: PickedMerchant;
};

export type FulfillmentSetting =
  | "STANDARD"
  | "CNY_EXTENSION_OPTION_1"
  | "CNY_EXTENSION_OPTION_2"
  | "VACATION_MODE"
  | "PRIMARY_WAREHOUSE_ON_VACATION";

const currentYear = new Date().getFullYear();

export const FulfillmentSettingNames: {
  [settings in FulfillmentSetting]: string;
} = {
  STANDARD: i`All warehouse(s) operational`,
  CNY_EXTENSION_OPTION_1: i`CNY ${currentYear} Extension Option 1`,
  CNY_EXTENSION_OPTION_2: i`CNY ${currentYear} Extension Option 2`,
  VACATION_MODE: i`Pause all warehouse(s)`,
  PRIMARY_WAREHOUSE_ON_VACATION: i`Pause Primary warehouse only`,
};

export const FulfillmentSettingDescription: {
  [settings in FulfillmentSetting]: string;
} = {
  STANDARD: i`All active products with inventory are available for sale.`,
  CNY_EXTENSION_OPTION_1:
    i`For orders released between February 4 and February 25, ${currentYear} ` +
    i`Beijing Time, you may designate your own fulfillment extension ` +
    i`between 1 to 7 calendar days in addition to the standard ` +
    i`5-calendar-day fulfillment timeline (confirmed fulfillment ` +
    i`timeline is also affected). By choosing Extension Option 1, ` +
    i`your estimated arrival time that customers see will be moderately ` +
    i`extended; your product impressions and conversion may decrease ` +
    i`moderately as well. [Learn more](${zendeskURL("1260801500190")})`,
  CNY_EXTENSION_OPTION_2:
    i`For orders released between February 4 and February 25, ${currentYear} ` +
    i`Beijing Time, you may mark orders as shipped by March 2, ${currentYear} ` +
    i`Beijing Time (confirmed fulfillment timeline is also affected). ` +
    i`By choosing Extension Option 2, your estimated arrival time that ` +
    i`customers see will be significantly extended; your product ` +
    i`impressions and conversion may decrease significantly as ` +
    i`well. [Learn more](${zendeskURL("1260801500190")})`,
  PRIMARY_WAREHOUSE_ON_VACATION:
    i`You have paused the operations of your Primary warehouse. ` +
    i`Only products in your Secondary warehouses are currently ` +
    i`available for sale. [Learn more](${zendeskURL("1260801500190")})`,
  VACATION_MODE: i`No products will be available for sale.`,
};

export const FulfillmentSettingProductImpressionStrength: {
  [settings in FulfillmentSetting]: number;
} = {
  STANDARD: 1,
  CNY_EXTENSION_OPTION_1: 0.75,
  CNY_EXTENSION_OPTION_2: 0.5,
  PRIMARY_WAREHOUSE_ON_VACATION: 1,
  VACATION_MODE: 0,
};

export const getCurrentFulfillmentSetting = (
  merchant: PickedMerchant
): FulfillmentSetting => {
  const { state, vacation, fulfillmentExtension } = merchant;
  if (vacation.isActive) {
    return state == "WISH_EXPRESS_ONLY"
      ? "PRIMARY_WAREHOUSE_ON_VACATION"
      : "VACATION_MODE";
  }

  if (fulfillmentExtension != null) {
    const {
      isActive,
      extensionDays,
      extensionDeadlineDate,
    } = fulfillmentExtension;
    if (isActive) {
      if (extensionDays != null) {
        return "CNY_EXTENSION_OPTION_1";
      }
      if (extensionDeadlineDate != null) {
        return "CNY_EXTENSION_OPTION_2";
      }
    }
  }

  return "STANDARD";
};

export const getCurrentVacationModeEndDate = (
  merchant: PickedMerchant
): Date | undefined => {
  const { endDate } = merchant.vacation;
  if (endDate != null) {
    const currentDate = new Date(endDate.mmddyyyy);
    return currentDate;
  }
};

export const getScheduledFulfillmentSetting = (
  merchant: PickedMerchant
): FulfillmentSetting | undefined => {
  const { vacation, fulfillmentExtension } = merchant;

  if (!fulfillmentExtension.isActive) {
    const { extensionDays, extensionDeadlineDate } = fulfillmentExtension;
    if (extensionDays != null) {
      return "CNY_EXTENSION_OPTION_1";
    }
    if (extensionDeadlineDate != null) {
      return "CNY_EXTENSION_OPTION_2";
    }
  }

  if (!vacation.isActive) {
    const { endDate, vacationStatus } = vacation;
    if (!endDate) {
      return;
    }
    return vacationStatus == "WISH_EXPRESS_ONLY"
      ? "PRIMARY_WAREHOUSE_ON_VACATION"
      : "VACATION_MODE";
  }

  return;
};

export const getAvailableFulfillmentSettings = (
  merchant: PickedMerchant
): ReadonlyArray<FulfillmentSetting> => {
  const { isMerchantPlus, fulfillmentExtension } = merchant;
  let options: ReadonlyArray<FulfillmentSetting> = ["STANDARD"];

  const canUseFulfillmentExtension = fulfillmentExtension.canEdit;
  if (canUseFulfillmentExtension) {
    options = [...options, "CNY_EXTENSION_OPTION_1", "CNY_EXTENSION_OPTION_2"];
  }

  if (!isMerchantPlus) {
    options = [...options, "PRIMARY_WAREHOUSE_ON_VACATION"];
  }

  options = [...options, "VACATION_MODE"];
  return _.sortBy(
    options,
    (option) => -1 * FulfillmentSettingProductImpressionStrength[option]
  );
};
