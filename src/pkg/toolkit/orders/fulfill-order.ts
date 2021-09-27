/*
 * fulfill-order.ts
 *
 * Created by Jonah Dlin on Fri May 21 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import { gql } from "@apollo/client/core";
import {
  Country,
  Datetime,
  FulfillmentError,
  FulfillmentMutationFulfillOrdersArgs,
  FulfillmentMutationModifyTrackingOrdersArgs,
  FulfillOrders,
  ModifyTrackingError,
  ModifyTrackingOrders,
  OrderSchema,
  ShippingDetailsSchema,
  VariationSchema,
  WpsFulfillmentInfoSchema,
} from "@schema/types";

export type CountriesWeShipToPick = ReadonlyArray<
  Pick<Country, "name" | "code">
>;

export type InitialShippingDetails = Pick<
  ShippingDetailsSchema,
  | "name"
  | "streetAddress1"
  | "streetAddress2"
  | "city"
  | "zipcode"
  | "trackingId"
  | "countryCode"
  | "state"
  | "phoneNumber"
  | "shipNote"
  | "neighborhood"
>;

export type InitialVariationDetails = Pick<VariationSchema, "productName">;

export type InitialOrderData = Pick<
  OrderSchema,
  | "id"
  | "state"
  | "productId"
  | "totalCost"
  | "hoursLeftToFulfill"
  | "quantity"
  | "requiresConfirmedDelivery"
  | "shippingProviderId"
  | "skuAtPurchaseTime"
  | "sizeAtPurchaseTime"
  | "colorAtPurchaseTime"
  | "isWishExpress"
  | "canModifyTrackingInfo"
  | "badges"
> & {
  readonly shippingDetails: InitialShippingDetails | null;
  readonly variation: InitialVariationDetails | null;
  readonly acceptableShippingOrigins: ReadonlyArray<
    Pick<Country, "name" | "code">
  >;
  readonly shippingOrigin: Pick<Country, "name" | "code">;
  readonly deliveryDeadline: Pick<Datetime, "mmddyyyy">;
  readonly wpsFulfillment?: Pick<WpsFulfillmentInfoSchema, "shippingOptionId">;
  readonly tracking?: {
    readonly confirmedFulfillmentDate?: Pick<Datetime, "unix">;
  };
};

export type FulfillOrdersInitialData = {
  readonly fulfillment: {
    readonly orders: ReadonlyArray<InitialOrderData> | null;
  };
  readonly platformConstants: {
    readonly countriesWeShipTo: CountriesWeShipToPick;
  };
};

// Mutation - ship transactions
export const SHIP_TRANSACTIONS_MUTATION = gql`
  mutation FulfillOrder_ShipTransactionsMutation(
    $input: [FulfillOrderInput!]!
  ) {
    fulfillment {
      fulfillOrders(input: $input) {
        shippedCount
        errorMessages {
          orderId
          message
        }
      }
    }
  }
`;

export type ShipTransactionsResponseType = {
  readonly fulfillment: {
    readonly fulfillOrders: Pick<FulfillOrders, "shippedCount"> & {
      readonly errorMessages: ReadonlyArray<
        Pick<FulfillmentError, "orderId" | "message">
      > | null;
    };
  };
};

export type ShipTransactionsInputType = FulfillmentMutationFulfillOrdersArgs;

// Mutation - modify tracking on orders that have already been marked shipped
export const MODIFY_TRACKING_MUTATION = gql`
  mutation FulfillOrder_ModifyTrackingMutation(
    $input: [ModifyTrackingOrderInput!]!
  ) {
    fulfillment {
      modifyTrackingOrders(input: $input) {
        modifyTrackingCount
        errorMessages {
          orderId
          message
        }
      }
    }
  }
`;

export type ModifyTrackingResponseType = {
  readonly fulfillment: {
    readonly modifyTrackingOrders: Pick<
      ModifyTrackingOrders,
      "modifyTrackingCount"
    > & {
      readonly errorMessages: ReadonlyArray<
        Pick<ModifyTrackingError, "orderId" | "message">
      > | null;
    };
  };
};

export type ModifyTrackingInputType = FulfillmentMutationModifyTrackingOrdersArgs;
