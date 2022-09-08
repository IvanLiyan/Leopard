import {
  Country,
  MerchantWarehouseSchema,
  WishExpressCountryDetails,
} from "@schema/types";

export type PickedCountry = Pick<Country, "code" | "name" | "gmvRank"> & {
  readonly wishExpress: Pick<WishExpressCountryDetails, "supportsWishExpress">;
};

export type PickedWarehouse = Pick<MerchantWarehouseSchema, "id" | "unitId"> & {
  readonly enabledCountries?: ReadonlyArray<PickedCountry> | null;
};

export type WarehouseSettingsInitialData = {
  readonly currentMerchant: {
    readonly warehouses?: ReadonlyArray<PickedWarehouse> | null;
  };
  readonly platformConstants: {
    readonly countriesWeShipTo: ReadonlyArray<Pick<Country, "code">>;
    readonly euCountriesWeShipTo: ReadonlyArray<Pick<Country, "code">>;
  };
};
