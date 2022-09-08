/* External Libraries */
import { Moment } from "moment/moment";
import moment from "moment/moment";

import RelativeTimeFormat from "relative-time-format";
import en from "relative-time-format/locale/en.json";
import zh from "relative-time-format/locale/zh.json";
import pt from "relative-time-format/locale/pt.json";
import es from "relative-time-format/locale/es.json";
import de from "relative-time-format/locale/de.json";
import fr from "relative-time-format/locale/fr.json";
import ko from "relative-time-format/locale/ko.json";

/* Merchant Store */
import LocalizationStore from "@stores/LocalizationStore";

RelativeTimeFormat.addLocale(en);
RelativeTimeFormat.addLocale(zh);
RelativeTimeFormat.addLocale(pt);
RelativeTimeFormat.addLocale(es);
RelativeTimeFormat.addLocale(de);
RelativeTimeFormat.addLocale(fr);
RelativeTimeFormat.addLocale(ko);

export const relativeTimeFormat = (targetDate: Moment): string => {
  const { locale } = LocalizationStore.instance();

  const useExternalIntl =
    !Intl || typeof (Intl as any).RelativeTimeFormat !== "function";

  let rtf;

  if (useExternalIntl) {
    rtf = new RelativeTimeFormat(locale, {
      style: "long",
      numeric: "auto",
    });
  } else {
    rtf = new (Intl as any).RelativeTimeFormat(locale, {
      style: "long",
      numeric: "auto",
    });
  }

  const now = moment();
  const daysLeft = targetDate.diff(now, "days");
  const hoursLeft = targetDate.diff(now, "hours");
  const minutesLeft = targetDate.diff(now, "minutes");
  const secondLeft = targetDate.diff(now, "seconds");

  if (Math.abs(daysLeft) > 0) {
    return rtf.format(daysLeft, "day");
  } else if (Math.abs(hoursLeft) > 0) {
    return rtf.format(hoursLeft, "hour");
  } else if (Math.abs(minutesLeft) > 0) {
    return rtf.format(minutesLeft, "minute");
  }

  return rtf.format(secondLeft, "second");
};

export const formatDatetimeLocalized = (
  targetMoment: Moment,
  format: string
): string => {
  const { localeProper } = LocalizationStore.instance();

  return targetMoment.locale(localeProper).format(format);
};

export const dateToUnix = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

export const dateToUtcUnix = (date: Date): number =>
  moment(date).add(moment().utcOffset(), "minutes").unix();
