import { Country, CountryCode } from "@schema/types";

export type EuVatQuestionnaireInitialData = {
  readonly platformConstants: {
    readonly euVatCountries: ReadonlyArray<Pick<Country, "code" | "name">>;
  };
};

export const infoCountries: ReadonlySet<CountryCode> = new Set(["MC"]);

export const getCountryTooltipText = (country: CountryCode): string => {
  switch (country) {
    case "MC":
      return i` Monaco is treated as a territory of France for VAT and excise purposes`;
  }
  return "";
};
