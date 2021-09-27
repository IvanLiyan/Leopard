import gql from "graphql-tag";
import {
  Country,
  Datetime,
  OrderSchema,
  CurrencyValue,
  PenaltySchema,
  MerchantSchema,
  FulfillmentSchema,
  OrderEpcInfoSchema,
  ShippingDetailsSchema,
  MerchantWarehouseSchema,
  ActionRequiredSearchType,
  AddressVerificationState,
  OrderAdvancedLogisticsInfoSchema,
  UserSchema,
} from "@schema/types";
import { SimpleSelectOption as Option } from "@ContextLogic/lego";

export type PickedShippingDetails = Pick<
  ShippingDetailsSchema,
  | "name"
  | "city"
  | "state"
  | "zipcode"
  | "phoneNumber"
  | "neighborhood"
  | "streetAddress1"
  | "streetAddress2"
  | "verificationState"
> & {
  readonly country: Pick<Country, "code" | "name">;
};

export type OrderType = Pick<
  OrderSchema,
  | "id"
  | "badges"
  | "quantity"
  | "productId"
  | "productName"
  | "isProcessing"
  | "isUnityOrder"
  | "isWishExpress"
  | "transactionId"
  | "skuAtPurchaseTime"
  | "hoursLeftToFulfill"
  | "canEditShippingAddress"
  | "requiresConfirmedDelivery"
  | "canRequestAddressVerification"
  | "merchantCurrencyAtPurchaseTime"
  | "showAplusShippingAddressTooltip"
> & {
  readonly merchantShipping: Pick<CurrencyValue, "amount" | "display">;
  readonly estimatedWishpostShipping: Pick<CurrencyValue, "amount">;
  readonly shippingDetails?: PickedShippingDetails | null;
  readonly totalCost: Pick<CurrencyValue, "display">;
  readonly releasedTime: Pick<Datetime, "formatted">;
  readonly deliveryDeadline: Pick<Datetime, "mmddyyyy">;
  readonly penalties: ReadonlyArray<Pick<PenaltySchema, "reason">>;
  readonly warehouse?: Pick<MerchantWarehouseSchema, "unitId">;
  readonly epc?: Pick<OrderEpcInfoSchema, "canUncombine"> | null;
  readonly advancedLogistics: Pick<
    OrderAdvancedLogisticsInfoSchema,
    "canUncombine"
  >;
};

export const GET_ACTION_REQUIRED_ORDERS = gql`
  query UnfulfilledOrdersContainer_GetActionRequiredOrders(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: ActionRequiredSearchType
    $sort: ActionRequiredSort
    $wishExpress: Boolean
  ) {
    currentMerchant {
      primaryCurrency
      isMerchantPlus
    }
    fulfillment {
      actionRequiredOrdersCsvUrl(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        sort: $sort
        wishExpress: $wishExpress
      )
      actionRequiredOrders(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        sort: $sort
        wishExpress: $wishExpress
      ) {
        id
        productId
        productName
        transactionId
        merchantTotal {
          display
        }
        merchantCurrencyAtPurchaseTime
        fbwDetails {
          warehouseName
        }
        warehouse {
          unitId
        }
        totalCost {
          display
        }
        releasedTime {
          formatted(fmt: "M/d/y h:mm a z")
        }
        hoursLeftToFulfill
        shippingDetails {
          name
          streetAddress1
          streetAddress2
          city
          state
          zipcode
          neighborhood
          phoneNumber
          country {
            name
            code
          }
          verificationState
        }
        skuAtPurchaseTime
        quantity
        requiresConfirmedDelivery
        canEditShippingAddress
        canRequestAddressVerification
        epc {
          canUncombine
        }
        advancedLogistics {
          canUncombine
        }
        isWishExpress
        isUnityOrder
        estimatedWishpostShipping {
          amount
        }
        deliveryDeadline {
          mmddyyyy
        }
        penalties {
          reason
        }
        badges
        isProcessing
        showAplusShippingAddressTooltip
      }
    }
  }
`;

export const GET_ACTION_REQUIRED_COUNT = gql`
  query UnfulfilledOrdersContainer_GetActionRequiredOrdersCount(
    $query: String
    $searchType: ActionRequiredSearchType
    $wishExpress: Boolean
  ) {
    fulfillment {
      actionRequiredOrderCount(
        query: $query
        searchType: $searchType
        wishExpress: $wishExpress
      )
    }
  }
`;

export type GetOrdersResponseType = {
  readonly currentMerchant: Pick<
    MerchantSchema,
    "primaryCurrency" | "isMerchantPlus"
  >;
  readonly fulfillment: Pick<
    FulfillmentSchema,
    "actionRequiredOrdersCsvUrl"
  > & {
    readonly actionRequiredOrders: ReadonlyArray<OrderType>;
  };
};

export type GetOrderCountResponseType = {
  readonly fulfillment: Pick<FulfillmentSchema, "actionRequiredOrderCount">;
};

export const SearchOptions: ReadonlyArray<Option<ActionRequiredSearchType>> = [
  {
    value: "ORDER_ID",
    text: i`Order ID`,
  },
  {
    value: "PRODUCT_ID",
    text: i`Product ID`,
  },
  {
    value: "TRACKING_NUMBER",
    text: i`Tracking Number`,
  },
  {
    value: "USER_NAME",
    text: i`User Name`,
  },
];

export const SearchOptionsForAdmin: ReadonlyArray<Option<
  ActionRequiredSearchType
>> = [
  ...SearchOptions,
  {
    value: "TRANSACTION_ID",
    text: i`Transaction ID`,
  },
];

export const Placeholders: {
  [searchType in ActionRequiredSearchType]: string;
} = {
  ORDER_ID: i`Enter an order id`,
  USER_NAME: i`Enter a user name`,
  PRODUCT_ID: i`Enter a product id`,
  TRACKING_NUMBER: i`Enter a tracking number`,
  TRANSACTION_ID: i`Enter a transaction id`,
};

export const AddressVerificationLabels: {
  [state in AddressVerificationState]: string;
} = {
  SYSTEM_VERIFIED: i`Verified`,
  NOT_VERIFIED: i`Unverified`,
  REQUEST_VERIFICATION: i`Verification Requested`,
  USER_VERIFIED: i`Verified`,
  WPS_VERIFIED: i`Verified`,
};

export type CountryWeShipToPick = Pick<Country, "code" | "name">;

export type InitialData = {
  readonly currentUser: {
    readonly uiState: {
      readonly hasDismissedHowToFulfillInsight: boolean;
      readonly hasDismissedFulfillmentPenaltyInsight: boolean;
      readonly hasDismissedFulfillmentSlaInsight: boolean;
    };
  };
  readonly currentMerchant: Pick<
    MerchantSchema,
    "isMerchantPlus" | "isCnMerchant"
  >;
  readonly platformConstants: {
    readonly countriesWeShipTo: ReadonlyArray<CountryWeShipToPick>;
  };
  readonly su?: Pick<UserSchema, "isAdmin"> | null;
};
