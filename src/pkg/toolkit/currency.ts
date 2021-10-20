/* External Libraries */
import { formatCurrency as _formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { getCountryName } from "@toolkit/countries";
import { PaymentCurrencyCode, CountryCode } from "@schema/types";

import LocalizationStore from "@stores/LocalizationStore";

export const formatCurrency = (
  amount: number,
  currencyCode: CurrencyCode | string | undefined = "USD",
): string => {
  const { preferredProperLocale } = LocalizationStore.instance();

  return _formatCurrency(amount, currencyCode, {
    locale: preferredProperLocale,
  });
};

export type CurrencyCode = PaymentCurrencyCode;

type CurrencyInfo = {
  readonly currencyName: string;
  readonly countryName: string;
  readonly countryCode: CountryCode | "EU" | "CN";
};

export const CurrencyInfo: { [currencyCode in CurrencyCode]: CurrencyInfo } = {
  EUR: {
    currencyName: i`Euro`,
    countryName: getCountryName("EU"),
    countryCode: "EU",
  },
  USD: {
    currencyName: i`United States dollar`,
    countryName: getCountryName("US"),
    countryCode: "US",
  },
  GBP: {
    currencyName: i`British pound`,
    countryName: getCountryName("GB"),
    countryCode: "GB",
  },
  CNY: {
    currencyName: i`Chinese Yuan`,
    countryName: getCountryName("CN"),
    countryCode: "CN",
  },
  BRL: {
    currencyName: i`Brazilian Real`,
    countryName: getCountryName("BR"),
    countryCode: "BR",
  },
  AUD: {
    currencyName: i`Australian Dollar`,
    countryName: getCountryName("AU"),
    countryCode: "AU",
  },
  CAD: {
    currencyName: i`Canadian Dollar`,
    countryName: getCountryName("CA"),
    countryCode: "CA",
  },
  CHF: {
    currencyName: i`Swiss Franc`,
    countryName: getCountryName("CH"),
    countryCode: "CH",
  },
  CZK: {
    currencyName: i`Czech Koruna`,
    countryName: getCountryName("CZ"),
    countryCode: "CZ",
  },
  DKK: {
    currencyName: i`Danish krone`,
    countryName: getCountryName("DK"),
    countryCode: "DK",
  },
  SEK: {
    currencyName: i`Swedish Krona`,
    countryName: getCountryName("SE"),
    countryCode: "SE",
  },
  TRY: {
    currencyName: i`Turkish lira`,
    countryName: getCountryName("TR"),
    countryCode: "TR",
  },
  MXN: {
    currencyName: i`Mexican Peso`,
    countryName: getCountryName("MX"),
    countryCode: "MX",
  },
  JPY: {
    currencyName: i`Japanese Yen`,
    countryName: getCountryName("JP"),
    countryCode: "JP",
  },
  UAH: {
    currencyName: i`Ukrainian hryvnia`,
    countryName: getCountryName("UA"),
    countryCode: "UA",
  },
};
