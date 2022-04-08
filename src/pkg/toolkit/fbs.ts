/* External Libraries */
import moment, { Moment } from "moment/moment";

/* Lego Toolkit */
import { getStateName } from "@ContextLogic/lego/toolkit/states";
import { getCountryName, CountryCode } from "@toolkit/countries";

export type TimePeriod =
  | "last_7_days"
  | "last_90_days"
  | "this_year"
  | "all_time";

export type ProductVariation = {
  readonly product_name: string;
  readonly product_id: string;
  readonly variation_size: string;
  readonly variation_color: string;
  readonly warehouses: ReadonlyArray<string>;
};

export type DateRange = {
  readonly startDate: string;
  readonly endDate: string;
};

export const getLastWeekRange = (
  baseDate: Moment,
  format = "MM/DD/YYYY"
): DateRange => {
  const lastWeek = moment(baseDate).subtract(7, "days");
  const yesterday = moment(baseDate).subtract(1, "days");
  return {
    startDate: `${lastWeek.format(format)}`,
    endDate: `${yesterday.format(format)}`,
  };
};

export const getLast90Range = (
  baseDate: Moment,
  format = "MM/DD/YYYY"
): DateRange => {
  const quarterStart = moment(baseDate)
    .subtract(3, "months")
    .date(Math.floor(baseDate.date() / 16) * 15 + 1);
  const quarterEnd = moment(baseDate).subtract(
    (baseDate.date() % 16) + Math.floor(baseDate.date() / 16),
    "days"
  );
  return {
    startDate: `${quarterStart.format(format)}`,
    endDate: `${quarterEnd.format(format)}`,
  };
};

export const getThisYearRange = (
  baseDate: Moment,
  format = "MM/DD/YYYY"
): DateRange => {
  const yearBegin = moment([baseDate.year(), 0, 1]);
  const lastMonthEnd = moment(baseDate).subtract(1, "months").endOf("month");
  return {
    startDate: `${yearBegin.format(format)}`,
    endDate: `${lastMonthEnd.format(format)}`,
  };
};

export const getAllTimeRange = (
  baseDate: Moment,
  format = "MM/DD/YYYY"
): DateRange => {
  const allTimeBegin = moment([2019, 9, 1]);
  const lastMonthEnd = moment(baseDate).subtract(1, "months").endOf("month");
  return {
    startDate: `${allTimeBegin.format(format)}`,
    endDate: `${lastMonthEnd.format(format)}`,
  };
};

export const getDateRange = (timePeriod: TimePeriod, today: Moment) => {
  if (timePeriod === "last_7_days") {
    return getLastWeekRange(today, "YYYY-MM-DD");
  } else if (timePeriod === "last_90_days") {
    return getLast90Range(today, "YYYY-MM-DD");
  } else if (timePeriod === "this_year") {
    return getThisYearRange(today, "YYYY-MM-DD");
  }
  return getAllTimeRange(today, "YYYY-MM-DD");
};

export const getUSStateNameSafe = (stateCode: string) =>
  getStateName("US", stateCode) || stateCode;
export const getCountryNameSafe = (countryCode: CountryCode) =>
  getCountryName(countryCode) || countryCode;

export const LogActions = {
  CLICK_DOWNLOAD_CASE_STUDY: "CLICK_DOWNLOAD_CASE_STUDY",
  CLICK_RESTOCK_PRODUCT_VARIATION: "CLICK_RESTOCK_PRODUCT_VARIATION",
  CLICK_DOWNLOAD_TOP_SELLERS_REPORT: "CLICK_DOWNLOAD_TOP_SELLERS_REPORT",
  CLICK_FILTER_REGION_PRODUCTS: "CLICK_FILTER_REGION_PRODUCTS",
};
