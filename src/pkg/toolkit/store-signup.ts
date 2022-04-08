import { Country, AuthenticationServiceSchema } from "@schema/types";

export type PickedCountriesType = ReadonlyArray<Pick<Country, "name" | "code">>;

export const SideMargin = 20;
export const FieldMaxWidth = 590;

export type StoreSignupSinglePageInitialData = {
  readonly currentCountry?: Pick<Country, "code"> | null;
  readonly authentication: Pick<
    AuthenticationServiceSchema,
    "storeCategories"
  > & {
    readonly countriesWeShipTo: PickedCountriesType;
  };
};
