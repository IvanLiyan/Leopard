/* External Libraries */
import moment from "moment/moment";

export const isGMVEstimated = (params: {
  startDateStr: string;
  merchantCurrencyMigrationDate?: number;
  merchantSourceCurrency?: string;
  selectedCurrency?: string;
}): boolean => {
  const {
    startDateStr,
    merchantCurrencyMigrationDate,
    merchantSourceCurrency,
    selectedCurrency,
  } = params;
  if (!merchantCurrencyMigrationDate) {
    return false;
  }
  const merchantCurrencyMigrationDateUTC = moment.utc(
    merchantCurrencyMigrationDate * 1000
  );
  const startDateUTC = moment.utc(startDateStr);
  return (
    merchantSourceCurrency != "USD" &&
    ((selectedCurrency != merchantSourceCurrency &&
      startDateUTC.isAfter(merchantCurrencyMigrationDateUTC)) ||
      (selectedCurrency == merchantSourceCurrency &&
        startDateUTC.isBefore(merchantCurrencyMigrationDateUTC)))
  );
};
