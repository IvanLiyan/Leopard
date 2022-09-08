/*
 * create-shipping-plan.ts
 *
 * Created by Sola Ogunsakin on Tue May 4 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import gql from "graphql-tag";
import {
  Weight,
  Country,
  Timedelta,
  CurrencyValue,
  AddressSchema,
  VariationSchema,
  CreateShippingPlan,
  FbwInventorySchema,
  FbwWarehouseSchema,
  ShippingPlanSchema,
  ProductCatalogSchema,
  LogisticsMetadataSchema,
} from "@schema/types";

type PickedFbwInventorySchema = Pick<
  FbwInventorySchema,
  "activeInventory" | "pendingInventory"
> & {
  readonly warehouse: Pick<FbwWarehouseSchema, "id" | "name" | "code">;
};

export type PickedVariationSchema = Pick<
  VariationSchema,
  "id" | "sku" | "productId" | "productName"
> & {
  readonly logisticsMetadata: Pick<
    LogisticsMetadataSchema,
    "isFbwRecommended"
  > & {
    readonly gmvPer1k?: Pick<CurrencyValue, "display"> | null;
  };
  readonly fbwInventory: ReadonlyArray<PickedFbwInventorySchema>;
};

export type PickedAddressSchema = Pick<
  AddressSchema,
  "city" | "state" | "zipcode" | "streetAddress1" | "streetAddress2"
> & {
  readonly country: Pick<Country, "name">;
};

export type PickedAvailableWarehouse = Pick<
  FbwWarehouseSchema,
  "code" | "region" | "id" | "name" | "feeLink"
> & {
  readonly address: PickedAddressSchema;
  readonly estimatedFulfillTime: Pick<Timedelta, "days">;
  readonly maxWeight: {
    readonly kg: Weight["value"];
  };
};

export type InitialData = {
  readonly currentMerchant: {
    readonly fulfilledByWish: {
      readonly availableWarehousesForShippingPlanSubmission: ReadonlyArray<PickedAvailableWarehouse>;
    };
  };
};

export const StepList = [
  "SELECT_REGION",
  "SPECIFY_SKU_AND_QUANTITY",
  "LOGISTICS_INFO",
  "SUBMIT",
] as const;
export type Step = typeof StepList[number];

export const StepNames: { [step in Step]: string } = {
  SELECT_REGION: i`Select warehouse region`,
  SPECIFY_SKU_AND_QUANTITY: i`Specify SKUs and Quantity`,
  LOGISTICS_INFO: i`Enter logistics Info`,
  SUBMIT: i`Submit shipping plan`,
};

export const GET_VARIATIONS = gql`
  query FBWCreateShippingPlan_SelectSKUModal_GetVariations(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: VariationSearchType
    $sort: VariationSort
  ) {
    productCatalog {
      variationCount(query: $query, searchType: $searchType)
      variations(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        sort: $sort
      ) {
        id
        sku
        productId
        productName
        logisticsMetadata {
          gmvPer1k {
            display
          }
          isFbwRecommended
        }
        fbwInventory {
          warehouse {
            id
            name
            code
          }
          activeInventory
          pendingInventory
        }
      }
    }
  }
`;

export type GetVariationsResponseType = {
  readonly productCatalog: Pick<ProductCatalogSchema, "variationCount"> & {
    readonly variations: ReadonlyArray<PickedVariationSchema>;
  };
};

export const SUBMIT_SHIPPING_PLAN = gql`
  mutation FBWCreateShippingPlan_SubmitShippingPlan(
    $input: ShippingPlanInput!
  ) {
    logistics {
      fulfilledByWish {
        createShippingPlan(input: $input) {
          ok
          message
          shippingPlan {
            id
          }
        }
      }
    }
  }
`;

export type PickedShippingPlan = Pick<ShippingPlanSchema, "id">;

export type SubmitShippingPlanResponseType = {
  readonly logistics: {
    readonly fulfilledByWish: {
      readonly createShippingPlan: Pick<
        CreateShippingPlan,
        "ok" | "message"
      > & {
        readonly shippingPlan: PickedShippingPlan;
      };
    };
  };
};
