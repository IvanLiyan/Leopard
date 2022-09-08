import { gql } from "@apollo/client/core";
import {
  AddressSchema,
  Country,
  CurrencyValue,
  Datetime,
  MerchantSchema,
  MerchantSchemaWarehousesArgs,
  MerchantWarehouseSchema,
  MerchantWarehouseSchemaWeekStatsArgs,
  MerchantWarehouseWeekStatsSchema,
  SellerVerificationSchema,
} from "@schema/types";

export type PickedWeekStatsType = Pick<
  MerchantWarehouseWeekStatsSchema,
  | "expectedDeliveries"
  | "lateDeliveries"
  | "isLateDeliveryRateAtRisk"
  | "isLateDeliveryRateHigh"
  | "lateDeliveryRate"
> & {
  readonly endDate: Pick<Datetime, "unix" | "formatted">;
  readonly startDate: Pick<Datetime, "unix" | "formatted">;
  readonly maxExpectedGmv: Pick<CurrencyValue, "display">;
  readonly weLateDeliveryRate?: MerchantWarehouseWeekStatsSchema["lateDeliveryRate"];
  readonly weIsLateDeliveryRateAtRisk?: MerchantWarehouseWeekStatsSchema["isLateDeliveryRateAtRisk"];
  readonly weIsLateDeliveryRateHigh?: MerchantWarehouseWeekStatsSchema["isLateDeliveryRateHigh"];
};

export type PickedWarehouseType = Pick<
  MerchantWarehouseSchema,
  "id" | "unitId"
> & {
  readonly address?:
    | (Pick<
        AddressSchema,
        | "name"
        | "city"
        | "state"
        | "streetAddress1"
        | "streetAddress2"
        | "zipcode"
        | "countryCode"
      > & {
        readonly country: Pick<Country, "code" | "name">;
      })
    | null;
  readonly enabledCountries: ReadonlyArray<Pick<Country, "code">>;
  readonly weekStats: ReadonlyArray<PickedWeekStatsType>;
};

export type WarehouseOverviewInitialData = {
  readonly currentMerchant: Pick<MerchantSchema, "isCnMerchant"> & {
    readonly sellerVerification: Pick<SellerVerificationSchema, "hasCompleted">;
    readonly warehouses: ReadonlyArray<PickedWarehouseType>;
  };
};

export type GetWeekStatsInput = MerchantWarehouseSchemaWeekStatsArgs &
  MerchantSchemaWarehousesArgs;

export const GET_WEEK_STATS = gql`
  query WarehouseOverview_GetWeekStats(
    $offset: Int!
    $limit: Int!
    $id: String
    $startDate: DatetimeInput
    $endDate: DatetimeInput
  ) {
    currentMerchant {
      warehouses(id: $id) {
        weekStats(
          offset: $offset
          limit: $limit
          startDate: $startDate
          endDate: $endDate
        ) {
          expectedDeliveries
          lateDeliveries
          isLateDeliveryRateAtRisk
          isLateDeliveryRateHigh
          lateDeliveryRate
          weIsLateDeliveryRateAtRisk: isLateDeliveryRateAtRisk(
            orderPolicyType: WISH_EXPRESS
          )
          weIsLateDeliveryRateHigh: isLateDeliveryRateHigh(
            orderPolicyType: WISH_EXPRESS
          )
          weLateDeliveryRate: lateDeliveryRate(orderPolicyType: WISH_EXPRESS)
          maxExpectedGmv {
            display
          }
          endDate {
            formatted(fmt: "M/d/YY")
            unix
          }
          startDate {
            formatted(fmt: "M/d/YY")
            unix
          }
        }
      }
    }
  }
`;
