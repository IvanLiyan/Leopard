/* External Libraries */
import moment from "moment-timezone";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { formatDatetimeLocalized } from "@toolkit/datetime";

// If adding another Timezone, add the timezone to the getTimezoneData method
export const Timezones = ["US/Pacific", "Canada/Eastern", "Etc/UTC"];

export const Timecodes = ["PDT", "EST", "UTC"];

export const OncallDashboardKey = "Disbursement_Oncall_Dashboard:timezone";
export const CronDashboardKey = "Cron_Dashboard:timezone";
export const BEJobDashboardKey = "BE_Job_Dashboard:timezone";

export const getTimezone = (key: string): string => {
  const { persistenceStore } = AppStore.instance();
  return persistenceStore.get(key) || "US/Pacific";
};

export const setTimezone = (key: string, timezone: string): void => {
  const { persistenceStore } = AppStore.instance();
  persistenceStore.set(key, timezone);
};

export const getTimecode = (key: string) => {
  return formatDatetimeLocalized(moment().tz(getTimezone(key)), "z");
};
