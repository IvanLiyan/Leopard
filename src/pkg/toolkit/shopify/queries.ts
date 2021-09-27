import gql from "graphql-tag";

/* Type Imports */
import { UpdateShippingSetting, ShippingSettingMutationsUpdateShippingSettingArgs } from "@schema/types";

export type UpdateWishShippingSettingMutationArgs = Pick<ShippingSettingMutationsUpdateShippingSettingArgs,
|"countryShipping"
|"useShopifyShippingRate"
|"isUpsert">

export type UpdateWishShippingSettingMutationResponse = Pick<UpdateShippingSetting, 
|"ok"
|"message">

export const UPDATE_WISH_SHIPPING_SETTING = gql`
  mutation UpdateWishShippingSetting(
    $countryShipping: [CountryShippingSetting!]
    $useShopifyShippingRate: Boolean
    $isUpsert: Boolean
  ) {
    currentUser {
      merchant {
        shippingSetting {
          updateShippingSetting(
            countryShipping: $countryShipping
            useShopifyShippingRate: $useShopifyShippingRate
            isUpsert: $isUpsert
          ) {
            ok
            message
          }
        }
      }
    }
  }
`;
