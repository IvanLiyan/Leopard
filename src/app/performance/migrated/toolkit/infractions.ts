import { Datetime } from "@schema";
import { gql } from "@gql";

export const WSSInfractionWindowQuery = gql(`
  query WSSInsight_InfractionWindow {
    currentMerchant {
      wishSellerStandard {
        policyInfractionWindowStartDate {
          unix
        }
        policyInfractionWindowEndDate {
          unix
        }
        fulfillmentInfractionWindowStartDate {
          unix
        }
        fulfillmentInfractionWindowEndDate {
          unix
        }
      }
    }
  }
`);
export type WSSInfractionWindowQueryResponse = {
  readonly currentMerchant?: {
    readonly wishSellerStandard?: {
      readonly policyInfractionWindowStartDate?: Pick<Datetime, "unix">;
      readonly policyInfractionWindowEndDate?: Pick<Datetime, "unix">;
      readonly fulfillmentInfractionWindowStartDate?: Pick<Datetime, "unix">;
      readonly fulfillmentInfractionWindowEndDate?: Pick<Datetime, "unix">;
    };
  };
};
