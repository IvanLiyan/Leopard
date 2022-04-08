import moment from "moment/moment";
import {
  Datetime,
  VacationSchema,
  MerchantSchema,
  MerchantFulfillmentExtensionSchema,
  CnyFulfillmentExtensionConstants,
} from "@schema/types";
import { zendeskURL } from "@toolkit/url";
import sortBy from "lodash/sortBy";

type PickedVacationSchema = Pick<
  VacationSchema,
  "isActive" | "vacationStatus"
> & {
  readonly startDate?: Pick<Datetime, "datetime" | "unix"> | null;
  readonly endDate?: Pick<Datetime, "datetime" | "unix" | "mmddyyyy"> | null;
};

type PickedFulfillmentExtension = Pick<
  MerchantFulfillmentExtensionSchema,
  "extensionDays" | "isActive" | "canEdit"
> & {
  readonly lastUpdated?: Pick<Datetime, "datetime" | "unix">;
};

type PickedMerchant = Pick<MerchantSchema, "state"> & {
  readonly vacation: PickedVacationSchema;
  readonly fulfillmentExtension: PickedFulfillmentExtension;
};

type PickedCNYFulfillmentExtension = Pick<
  CnyFulfillmentExtensionConstants,
  "minExtensionDays" | "maxExtensionDays"
> & {
  readonly editStartDate: Pick<Datetime, "datetime" | "unix">;
  readonly editEndDate: Pick<Datetime, "datetime" | "unix">;
  readonly applyStartDate: Pick<Datetime, "datetime" | "unix">;
  readonly applyEndDate: Pick<Datetime, "datetime" | "unix">;
};

type PickedFulfillment = {
  readonly cnyFulfillmentExtension: PickedCNYFulfillmentExtension;
};

type PickedConstants = {
  readonly fulfillment: PickedFulfillment;
};

export type InitialData = {
  readonly currentMerchant: PickedMerchant;
  readonly platformConstants: PickedConstants;
};

export type FulfillmentSetting =
  | "STANDARD"
  | "CNY_EXTENSION"
  | "VACATION_MODE"
  | "PRIMARY_WAREHOUSE_ON_VACATION";

const currentYear = new Date().getFullYear();

export const FulfillmentSettingNames: {
  [settings in FulfillmentSetting]: string;
} = {
  STANDARD: i`All warehouse(s) operational`,
  CNY_EXTENSION: i`Primary Warehouse Fulfillment Extension - ${currentYear} Chinese New Year`,
  VACATION_MODE: i`Pause all warehouse(s)`,
  PRIMARY_WAREHOUSE_ON_VACATION: i`Pause Primary warehouse only`,
};

export const fulfillmentSettingDescription = ({
  platformConstants: {
    fulfillment: {
      cnyFulfillmentExtension: { minExtensionDays, maxExtensionDays },
    },
  },
}: InitialData): {
  [settings in FulfillmentSetting]: string;
} => {
  const standardFulfillmentDays = 5;

  return {
    STANDARD: i`All active products with inventory are available for sale.`,
    CNY_EXTENSION:
      i`For orders released between January 17 12:00AM Beijing Time and ` +
      i`February 15, ${currentYear} 11:59PM Beijing Time, you may designate your ` +
      i`own fulfillment extension between ${minExtensionDays} to ` +
      i`${maxExtensionDays} calendar days, in addition to the standard ` +
      i`${standardFulfillmentDays}-calendar-day fulfillment timeline ` +
      i`(confirmed fulfillment timeline is also affected). By choosing this ` +
      i`extension option, your estimated arrival time that customers see will ` +
      i`be moderately extended; your product impressions and conversion may ` +
      i`decrease moderately as well. [Learn more](${zendeskURL(
        "4415187659035"
      )})`,
    PRIMARY_WAREHOUSE_ON_VACATION:
      i`You have paused the operations of your Primary warehouse. Only ` +
      i`products in your Secondary warehouses are currently available for ` +
      i`sale. You won’t receive orders if you select this setting. ` +
      i`[Learn more](${zendeskURL("204531318")})`,
    VACATION_MODE:
      i`No products will be available for sale. You won't receive orders if ` +
      i`you select this setting.`,
  };
};

export const FulfillmentSettingWarning: {
  [settings in FulfillmentSetting]: string | null;
} = {
  STANDARD: null,
  CNY_EXTENSION:
    i`Please note that updates made to the number of extension days will ` +
    i`apply only to orders released after the time you make the update.`,
  PRIMARY_WAREHOUSE_ON_VACATION: null,
  VACATION_MODE: null,
};

export const FulfillmentSettingProductImpressionStrength: {
  [settings in FulfillmentSetting]: number;
} = {
  STANDARD: 1,
  CNY_EXTENSION: 0.75,
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
    const { isActive } = fulfillmentExtension;
    if (isActive) {
      return "CNY_EXTENSION";
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

// getScheduledFulfillmentSettings returns an array of the vacation settings
// being used by the merchant; this can have at most two values, "CNY_EXTENSION"
// and one of "VACATION_MODE" or "PRIMARY_WAREHOUSE_ON_VACATION"
export const getScheduledFulfillmentSettings = (
  merchant: PickedMerchant
): ReadonlyArray<FulfillmentSetting> => {
  let settings: ReadonlyArray<FulfillmentSetting> = [];
  const { vacation, fulfillmentExtension } = merchant;

  const { isActive, extensionDays } = fulfillmentExtension;

  if (extensionDays != null && !isActive) {
    settings = ["CNY_EXTENSION"];
  }

  if (!vacation.isActive) {
    const { endDate, vacationStatus } = vacation;
    if (endDate) {
      const status =
        vacationStatus == "WISH_EXPRESS_ONLY"
          ? "PRIMARY_WAREHOUSE_ON_VACATION"
          : "VACATION_MODE";
      settings = [...settings, status];
    }
  }

  return settings;
};

export const getScheduledVacationSetting = (
  merchant: PickedMerchant
): FulfillmentSetting | null => {
  const scheduledSettings = getScheduledFulfillmentSettings(merchant);

  if (scheduledSettings.includes("VACATION_MODE")) {
    return "VACATION_MODE";
  } else if (scheduledSettings.includes("PRIMARY_WAREHOUSE_ON_VACATION")) {
    return "PRIMARY_WAREHOUSE_ON_VACATION";
  }
  return null;
};

export const getAvailableFulfillmentSettings = (
  merchant: PickedMerchant
): ReadonlyArray<FulfillmentSetting> => {
  const { fulfillmentExtension } = merchant;
  let options: ReadonlyArray<FulfillmentSetting> = ["STANDARD"];

  const canUseFulfillmentExtension = fulfillmentExtension.canEdit;
  if (canUseFulfillmentExtension) {
    options = [...options, "CNY_EXTENSION"];
  }

  options = [...options, "PRIMARY_WAREHOUSE_ON_VACATION", "VACATION_MODE"];

  return sortBy(
    options,
    (option) => -1 * FulfillmentSettingProductImpressionStrength[option]
  );
};

export const getFulfillmentExtensionStartDate = ({
  currentMerchant: {
    fulfillmentExtension: { lastUpdated },
  },
  platformConstants: {
    fulfillment: {
      cnyFulfillmentExtension: {
        applyStartDate: { datetime: applyDateFormatted, unix: applyDateUnix },
      },
    },
  },
}: InitialData): { formatted: string; unix: number } => {
  if (lastUpdated == null) {
    return { formatted: applyDateFormatted, unix: applyDateUnix };
  }

  const { datetime: lastUpdatedFormatted, unix: lastUpdatedUnix } = lastUpdated;

  // if the user has updated it after the application period began, then the
  // last updated date is the date it's active as of
  if (applyDateUnix < lastUpdatedUnix) {
    return { formatted: lastUpdatedFormatted, unix: lastUpdatedUnix };
  }

  // otherwise, the extension will only be active beginning on the first day of
  // the application period
  return { formatted: applyDateFormatted, unix: applyDateUnix };
};

export const getFulfillmentExtensionEndDate = ({
  platformConstants: {
    fulfillment: {
      cnyFulfillmentExtension: {
        applyEndDate: { datetime: formatted, unix },
      },
    },
  },
}: InitialData): { formatted: string; unix: number } => {
  return { formatted, unix };
};

// getBothAreActive returns true if a vacation mode and the CNY fulfillment
// extension are both currently active, and false otherwise
export const getBothAreActive = (initialData: InitialData): boolean => {
  const {
    currentMerchant: { vacation },
  } = initialData;

  // all vacations must have an end date: a null end date represents a no
  // vacation state, and thus no overlap
  if (vacation == null || vacation.endDate == null) {
    return false;
  }

  const { unix: fulfillmentStartDateUnix } =
    getFulfillmentExtensionStartDate(initialData);
  const fulfillmentStartDate = moment.unix(fulfillmentStartDateUnix);
  const { unix: fulfillmentEndDateUnix } =
    getFulfillmentExtensionEndDate(initialData);
  const fulfillmentEndDate = moment.unix(fulfillmentEndDateUnix);
  const vacationStartDate = vacation.startDate
    ? moment.unix(vacation.startDate.unix)
    : moment().subtract(1, "minute"); // if there is no vacation start date, the vacation has already started
  const vacationEndDate = moment.unix(vacation.endDate.unix);
  const now = moment();

  return (
    now.isBetween(fulfillmentStartDate, fulfillmentEndDate) &&
    now.isBetween(vacationStartDate, vacationEndDate)
  );
};

// getOverlap calculates the overlap between the vacation mode and the
// fulfillment exemption date ranges.
// if there is no overlap, or no vacation exists, it returns 0.
// the direction of the overlap does not matter (the answer is always positive)
export const getOverlap = (initialData: InitialData): number => {
  const {
    currentMerchant: { vacation },
  } = initialData;

  // all vacations must have an end date: a null end date represents a no
  // vacation state
  if (vacation == null || vacation.endDate == null) {
    return 0;
  }

  const { unix: fulfillmentStartDateUnix } =
    getFulfillmentExtensionStartDate(initialData);
  const fulfillmentStartDate = moment.unix(fulfillmentStartDateUnix);
  const { unix: fulfillmentEndDateUnix } =
    getFulfillmentExtensionEndDate(initialData);
  const fulfillmentEndDate = moment.unix(fulfillmentEndDateUnix);

  const vacationStartDate = vacation.startDate
    ? moment.unix(vacation.startDate.unix)
    : moment(); // if there is no vacation start date, the vacation has already started
  const vacationEndDate = moment.unix(vacation.endDate.unix);

  if (fulfillmentStartDate.isBetween(vacationStartDate, vacationEndDate)) {
    if (fulfillmentEndDate.isBefore(vacationEndDate)) {
      return Math.ceil(
        fulfillmentEndDate.diff(fulfillmentStartDate, "days", true)
      );
    }
    return Math.ceil(vacationEndDate.diff(fulfillmentStartDate, "days", true));
  } else if (
    vacationStartDate.isBetween(fulfillmentStartDate, fulfillmentEndDate)
  ) {
    if (fulfillmentEndDate.isBefore(vacationEndDate)) {
      return Math.ceil(
        fulfillmentEndDate.diff(vacationStartDate, "days", true)
      );
    }
    return Math.ceil(vacationEndDate.diff(vacationStartDate, "days", true));
  }

  return 0;
};

export const getOverlapUnitTests = () => {
  const mockInitialData = ({
    fStartDate,
    fEndDate,
    vStartDate,
    vEndDate,
  }: {
    readonly fStartDate: moment.Moment;
    readonly fEndDate: moment.Moment;
    readonly vStartDate: moment.Moment | null;
    readonly vEndDate: moment.Moment | null;
  }): InitialData => {
    return {
      currentMerchant: {
        state: "APPROVED",
        vacation: {
          isActive: true,
          startDate: vStartDate
            ? {
                unix: vStartDate.unix(),
                datetime: "",
              }
            : null,
          endDate: vEndDate
            ? {
                unix: vEndDate.unix(),
                datetime: "",
                mmddyyyy: "",
              }
            : null,
        },
        fulfillmentExtension: {
          isActive: true,
          canEdit: true,
        },
      },
      platformConstants: {
        fulfillment: {
          cnyFulfillmentExtension: {
            minExtensionDays: 0,
            maxExtensionDays: 0,
            editStartDate: {
              unix: 1,
              datetime: "",
            },
            editEndDate: {
              unix: 1,
              datetime: "",
            },
            applyStartDate: {
              unix: fStartDate.unix(),
              datetime: "",
            },
            applyEndDate: {
              unix: fEndDate.unix(),
              datetime: "",
            },
          },
        },
      },
    };
  };

  /* eslint-disable no-console */
  {
    const fStartDate = moment("2022-01-17 CST");
    const fEndDate = moment("2022-02-15 CST");
    const vStartDate = moment("2022-01-01 UTC");
    const vEndDate = moment("2022-01-20 UTC");

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 3;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST A2...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${vStartDate.toString()}\nvEndDate: ${vEndDate.toString()}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }

  {
    const fStartDate = moment("2022-01-17 CST");
    const fEndDate = moment("2022-02-15 CST");
    const vStartDate = moment("2022-02-10 UTC");
    const vEndDate = moment("2022-02-20 UTC");

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 6;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST B1...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${vStartDate.toString()}\nvEndDate: ${vEndDate.toString()}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }

  {
    const fStartDate = moment("2022-01-17 CST");
    const fEndDate = moment("2022-02-15 CST");
    const vStartDate = moment("2022-02-05 UTC");
    const vEndDate = moment("2022-02-09 UTC");

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 4;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST B2...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${vStartDate.toString()}\nvEndDate: ${vEndDate.toString()}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }

  {
    const fStartDate = moment("2022-01-17 CST");
    const fEndDate = moment("2022-02-15 CST");
    const vStartDate = moment("2022-01-05 UTC");
    const vEndDate = moment("2022-02-21 UTC");

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 29;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST A1...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${vStartDate.toString()}\nvEndDate: ${vEndDate.toString()}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }

  {
    const fStartDate = moment("2022-01-17 00:00:00 UTC");
    const fEndDate = moment("2022-02-15 23:59:59 UTC");
    const vStartDate = moment("2022-01-05 00:00:00 UTC");
    const vEndDate = moment("2022-01-17 23:59:59 UTC");

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 1;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST C1...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${vStartDate.toString()}\nvEndDate: ${vEndDate.toString()}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }

  {
    const fStartDate = moment("2022-01-17 00:00:00 UTC");
    const fEndDate = moment("2022-02-15 23:59:59 UTC");
    const vStartDate = moment("2022-02-15 00:00:00 UTC");
    const vEndDate = moment("2022-03-17 23:59:59 UTC");

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 1;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST C2...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${vStartDate.toString()}\nvEndDate: ${vEndDate.toString()}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }

  {
    const fStartDate = moment("2022-01-17 00:00:00 UTC");
    const fEndDate = moment("2022-02-15 23:59:59 UTC");
    const vStartDate = moment("2022-01-05 00:00:00 UTC");
    const vEndDate = moment("2022-01-16 23:59:59 UTC");

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 0;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST C3...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${vStartDate.toString()}\nvEndDate: ${vEndDate.toString()}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }

  {
    const fStartDate = moment("2022-01-17 00:00:00 UTC");
    const fEndDate = moment("2022-02-15 23:59:59 UTC");
    const vStartDate = moment("2022-02-16 00:00:00 UTC");
    const vEndDate = moment("2022-03-17 23:59:59 UTC");

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 0;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST C4...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${vStartDate.toString()}\nvEndDate: ${vEndDate.toString()}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }

  {
    const fStartDate = moment("2022-01-17 00:00:00 UTC");
    const fEndDate = moment("2022-02-15 23:59:59 UTC");
    const vStartDate = null;
    const vEndDate = null;

    const initialData = mockInitialData({
      fStartDate,
      fEndDate,
      vStartDate,
      vEndDate,
    });
    const expectedOverlap = 0;
    const overlap = getOverlap(initialData);
    console.log(
      `TEST C5...\nfStartDate: ${fStartDate.toString()}\nfEndDate: ${fEndDate.toString()}\nvStartDate: ${"null"}\nvEndDate: ${"null"}\nexpectedOverlap: ${expectedOverlap}, overlap: ${overlap}, status: ${
        expectedOverlap == overlap ? "TRUE" : "FALSE"
      }`
    );
  }
  /* eslint-enable no-console */
};
