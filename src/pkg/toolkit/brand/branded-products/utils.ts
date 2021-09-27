/* External Libraries */
import moment from "moment/moment";
import { formatDatetimeLocalized } from "@toolkit/datetime";

export const getDateDisplayText = (
  timestamp: number,
  format = "MM/DD/YYYY"
) => {
  return moment.unix(timestamp).utc().format(format);
};

export const getLocalizedDateDisplayText = (
  timestamp: number,
  format = "MM/DD/YYYY"
) => {
  return formatDatetimeLocalized(moment.unix(timestamp).utc(), format);
};
