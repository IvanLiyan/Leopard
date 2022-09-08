/*
 * create-shipping-label.ts
 *
 * Created by Jonah Dlin on Thu Jan 28 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import {
  AddressSchema,
  Country,
  OrderSchema,
  ProductSchema,
  ShippingDetailsSchema,
  WpsShippingOptionSchema,
  FulfillmentSchemaWpsShippingOptionsArgs,
  CurrencyValue,
  MerchantSenderAddressSchema,
  UpsertMerchantSenderAddressInput,
  UpsertMerchantSenderAddressMutation,
  AddressInput,
  DeleteMerchantSenderAddressInput,
  DeleteMerchantSenderAddressMutation,
  AddressUpdateError,
  FulfillmentMutationEditShippingAddressesArgs,
  LengthUnit,
  WeightUnit,
  MerchantSchema,
  ChangePreferredUnitsMutation,
  MerchantMutationChangePreferredUnitsArgs,
  ProductCatalogMutationsUpdateProductLogisticsMetadataArgs,
  UpdateProductLogisticsMetadata,
  VariationSchema,
  FulfillmentMutationSelectWpsShippingOptionArgs,
  SelectWpsShippingOptionMutation,
  WpsShippingProviderSchema,
  Length,
  Weight,
  MerchantWpsTermsOfServiceSchema,
  WpsTermsTypeEnum,
  MerchantWpsTermsOfServiceMutation,
  FulfillmentMutationFulfillOrdersArgs,
  FulfillOrders,
  FulfillmentError,
  FulfillmentMutationModifyWpsTrackingIdArgs,
  ModifyWpsTrackingIdMutation,
  WpsFulfillmentInfoSchema,
  WpsAdditionalTrackingService,
  FulfillmentMutationModifyTrackingOrdersArgs,
  ModifyTrackingOrders,
  ModifyTrackingError,
  WpsGetShippingOptionsSchema,
} from "@schema/types";
import { Option } from "@ContextLogic/lego/component/form/FormSelect";
import gql from "graphql-tag";
import { IllustrationName } from "@merchant/component/core/Illustration";
import round from "lodash/round";

export type OrderDetailData = Pick<
  OrderSchema,
  | "quantity"
  | "id"
  | "sizeAtPurchaseTime"
  | "colorAtPurchaseTime"
  | "productId"
  | "canModifyTrackingInfo"
> & {
  readonly wpsFulfillment?: Pick<WpsFulfillmentInfoSchema, "shippingOptionId">;
  readonly shippingDetails?: Pick<
    ShippingDetailsSchema,
    | "name"
    | "streetAddress1"
    | "streetAddress2"
    | "city"
    | "state"
    | "zipcode"
    | "countryCode"
    | "phoneNumber"
  >;
  readonly product?: Pick<ProductSchema, "name" | "variationCount">;
  readonly variation: Pick<VariationSchema, "id">;
};

export type WarehouseAddress = Pick<
  MerchantSenderAddressSchema,
  "id" | "isDefault" | "warehouseName"
> & {
  address: Pick<
    AddressSchema,
    | "name"
    | "streetAddress1"
    | "streetAddress2"
    | "city"
    | "countryCode"
    | "zipcode"
    | "state"
    | "phoneNumber"
  >;
};

export type PickedOriginCountryType = Pick<Country, "code" | "name">;

export type PickedWpsTermsOfServiceType = Pick<
  MerchantWpsTermsOfServiceSchema,
  "agreedWpsTos"
>;

export type CreateShippingLabelInitialData = {
  readonly currentMerchant: Pick<
    MerchantSchema,
    "preferredLengthUnit" | "preferredWeightUnit"
  > & {
    readonly merchantTermsAgreed?: {
      readonly wpsTermsOfService?: PickedWpsTermsOfServiceType | null;
    };
    readonly originCountry: Pick<Country, "code">;
    readonly senderAddresses: ReadonlyArray<WarehouseAddress>;
    readonly wps: {
      readonly enabledOriginCountries: ReadonlyArray<PickedOriginCountryType>;
    };
  };
  readonly fulfillment: {
    readonly order: OrderDetailData;
  };
};

export type CardState = "EDITING" | "CLOSED_NOT_EDITABLE" | "CLOSED_EDITABLE";

export type PackageType = "BOX" | "LARGE_ENVELOPE";

export const PackageTypeLabel: { readonly [key in PackageType]: string } = {
  BOX: i`Box`,
  LARGE_ENVELOPE: i`Large Envelope`,
};

export const PackageTypeIconMap: {
  [packageType: string]: IllustrationName;
} = {
  BOX: "shippingLabelBox",
  LARGE_ENVELOPE: "shippingLabelEnvelope",
};

export type PickedLengthUnit = Exclude<LengthUnit, "KILOMETER">;

export const WeightUnitNames: { [weight in WeightUnit]: string } = {
  MILLIGRAM: "mg",
  GRAM: "g",
  KILOGRAM: "kg",
  POUND: "lb",
  OUNCE: "oz",
};

export const LengthUnitNames: { [distance in PickedLengthUnit]: string } = {
  CENTIMETER: "cm",
  METER: "m",
  FEET: "ft",
  INCH: "in",
  YARD: "yd",
};

const WeightOrder: ReadonlyArray<WeightUnit> = [
  "MILLIGRAM",
  "GRAM",
  "KILOGRAM",
  "POUND",
];

export const WeightOptions: ReadonlyArray<Option<WeightUnit>> = WeightOrder.map(
  (unit) => ({
    value: unit,
    text: WeightUnitNames[unit],
  })
);

const LengthOrder: ReadonlyArray<PickedLengthUnit> = [
  "CENTIMETER",
  "METER",
  "FEET",
  "INCH",
  "YARD",
];

export const LengthOptions: ReadonlyArray<Option<PickedLengthUnit>> =
  LengthOrder.map((unit) => ({
    value: unit,
    text: LengthUnitNames[unit],
  }));

export const DefaultLengthUnit: PickedLengthUnit = "CENTIMETER";
export const DefaultWeightUnit: WeightUnit = "GRAM";

export const roundPackageDimension = (dimension?: number | null | undefined) =>
  dimension == null ? undefined : round(dimension, 2);

export const ShippingProviderLogoMap: {
  [providerName: string]: IllustrationName;
} = {
  UPS: "upsLogo",
  USPS: "uspsLogo",
};

// Query - Get Shipping Options
export const GET_SHIPPING_OPTIONS = gql`
  query CreateShippingLabel_GetShippingOptions($orderId: String!) {
    fulfillment {
      wpsShippingOptions(orderId: $orderId) {
        ok
        errorMessage
        shippingOptions {
          daysToDeliver
          price {
            amount
            display
            currencyCode
          }
          provider {
            id
            name
            wpsId
          }
          id
          name
          isRegistered
          includesTracking
          availableAdditionalServiceOptions {
            type
            name
            fee {
              amount
              display
            }
          }
        }
      }
    }
  }
`;

export type PickedAdditionalServiceOptions = Pick<
  WpsAdditionalTrackingService,
  "name" | "type"
> & {
  readonly fee?: Pick<CurrencyValue, "amount" | "display">;
};

export type PickedWpsShippingOption = Pick<
  WpsShippingOptionSchema,
  "daysToDeliver" | "id" | "name" | "includesTracking" | "isRegistered"
> & {
  readonly price: Pick<CurrencyValue, "amount" | "display" | "currencyCode">;
  readonly provider: Pick<WpsShippingProviderSchema, "id" | "name" | "wpsId">;
  readonly availableAdditionalServiceOptions: ReadonlyArray<PickedAdditionalServiceOptions>;
};

type PickedWpsShippingOptionWithErrors = Pick<
  WpsGetShippingOptionsSchema,
  "ok" | "errorMessage"
> & {
  readonly shippingOptions?: ReadonlyArray<PickedWpsShippingOption> | null;
};

export type GetShippingOptionResponseType = {
  readonly fulfillment: {
    readonly wpsShippingOptions?: PickedWpsShippingOptionWithErrors | null;
  };
};

export type GetShippingOptionsRequestType =
  FulfillmentSchemaWpsShippingOptionsArgs;

// Mutation - Add/Edit Warehouse Address
export const ADD_EDIT_WAREHOUSE = gql`
  mutation CreateShippingLabel_AddEditWarehouse(
    $input: UpsertMerchantSenderAddressInput!
  ) {
    currentMerchant {
      merchantSenderAddress {
        upsertMerchantSenderAddress(input: $input) {
          ok
          message
          id
        }
      }
    }
  }
`;

export type AddEditWarehouseInputType = {
  input: Pick<
    UpsertMerchantSenderAddressInput,
    "isDefault" | "merchantSenderAddressId" | "warehouseName"
  > & {
    address: Pick<
      AddressInput,
      | "state"
      | "streetAddress1"
      | "streetAddress2"
      | "zipcode"
      | "city"
      | "name"
      | "phoneNumber"
      | "countryCode"
    >;
  };
};

export type AddEditWarehouseResponseType = {
  readonly currentMerchant: {
    readonly merchantSenderAddress: {
      readonly upsertMerchantSenderAddress: Pick<
        UpsertMerchantSenderAddressMutation,
        "ok" | "message" | "id"
      >;
    };
  };
};

// Mutation - Delete Warehouse Address
export const DELETE_WAREHOUSE = gql`
  mutation CreateShippingLabel_DeleteWarehouse(
    $input: DeleteMerchantSenderAddressInput!
  ) {
    currentMerchant {
      merchantSenderAddress {
        deleteMerchantSenderAddress(input: $input) {
          ok
          message
        }
      }
    }
  }
`;

export type DeleteWarehouseInputType = {
  input: Pick<DeleteMerchantSenderAddressInput, "merchantSenderAddressId">;
};

export type DeleteWarehouseResponseType = {
  readonly currentMerchant: {
    readonly merchantSenderAddress: {
      readonly deleteMerchantSenderAddress: Pick<
        DeleteMerchantSenderAddressMutation,
        "ok" | "message"
      >;
    };
  };
};

// Query - Fetch all sender warehouse addresses
export const GET_WAREHOUSES = gql`
  query CreateShippingLabel_GetWarehouses {
    currentMerchant {
      senderAddresses {
        id
        isDefault
        warehouseName
        address {
          name
          streetAddress1
          streetAddress2
          city
          countryCode
          zipcode
          state
          phoneNumber
        }
      }
    }
  }
`;

export type GetWarehousesResponseType = {
  readonly currentMerchant: {
    readonly senderAddresses: ReadonlyArray<WarehouseAddress>;
  };
};

// Mutation - Submit shipping address for an orderId
export const SUBMIT_SHIPPING_ADDRESS = gql`
  mutation CreateShippingLabel_SubmitShippingAddress(
    $input: [EditAddressInput!]!
  ) {
    fulfillment {
      editOriginAddresses(input: $input) {
        errorMessages {
          orderId
          message
        }
      }
    }
  }
`;

export type SubmitShippingAddressInputType =
  FulfillmentMutationEditShippingAddressesArgs;
export type SubmitShippingAddressResponseType = {
  readonly fulfillment: {
    readonly editOriginAddresses: {
      readonly errorMessages?: ReadonlyArray<
        Pick<AddressUpdateError, "message" | "orderId">
      > | null;
    };
  };
};

// Mutation - Change preferred units
export const CHANGE_PREFERRED_UNITS = gql`
  mutation CreateShippingLabel_ChangePreferredUnits(
    $input: ChangePreferredUnitsInput!
  ) {
    currentMerchant {
      changePreferredUnits(input: $input) {
        ok
        error
      }
    }
  }
`;

export type ChangePreferredUnitsInputType =
  MerchantMutationChangePreferredUnitsArgs;
export type ChangePreferredUnitsResponseType = {
  readonly currentMerchant: {
    readonly changePreferredUnits: Pick<
      ChangePreferredUnitsMutation,
      "ok" | "error"
    >;
  };
};

// Mutation - Submit dimensions
export const SUBMIT_DIMENSIONS = gql`
  mutation CreateShippingLabel_SubmitDimensions(
    $input: UpdateProductLogisticsMetadataInput!
  ) {
    productCatalog {
      updateProductLogisticsMetadata(input: $input) {
        success
        errorMessage
      }
    }
  }
`;

export type SubmitDimensionsInputType =
  ProductCatalogMutationsUpdateProductLogisticsMetadataArgs;
export type SubmitDimensionsResponseType = {
  readonly productCatalog: {
    readonly updateProductLogisticsMetadata: Pick<
      UpdateProductLogisticsMetadata,
      "success" | "errorMessage"
    >;
  };
};

// Mutation - Submit shipping option
export const SUBMIT_SHIPPING_OPTION = gql`
  mutation CreateShippingLabel_SubmitShippingOption(
    $input: SelectWPSShippingOptionInput!
  ) {
    fulfillment {
      selectWpsShippingOption(input: $input) {
        ok
        errorMessage
        trackingId
        providerId
      }
    }
  }
`;

export type SubmitShippingOptionInputType =
  FulfillmentMutationSelectWpsShippingOptionArgs;
export type SubmitShippingOtionResponseType = {
  readonly fulfillment: {
    readonly selectWpsShippingOption: Pick<
      SelectWpsShippingOptionMutation,
      "ok" | "errorMessage" | "trackingId" | "providerId"
    >;
  };
};

// Mutation - Edit shipping option
export const EDIT_SHIPPING_OPTION = gql`
  mutation CreateShippingLabel_EditShippingOption(
    $input: ModifyWPSTrackingIDInput!
  ) {
    fulfillment {
      modifyWpsTrackingId(input: $input) {
        ok
        errorMessage
        trackingId
        providerId
      }
    }
  }
`;

export type EditShippingOptionInputType =
  FulfillmentMutationModifyWpsTrackingIdArgs;
export type EditShippingOptionResponseType = {
  readonly fulfillment: {
    readonly modifyWpsTrackingId: Pick<
      ModifyWpsTrackingIdMutation,
      "ok" | "trackingId" | "providerId" | "errorMessage"
    >;
  };
};

// Mutation - Modify tracking orders
export const MODIFY_TRACKING_ORDERS = gql`
  mutation CreateShippingLabel_ModifyTrackingOrders(
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

type PickedErrorMessages = Pick<ModifyTrackingError, "orderId" | "message">;

export type ModifyTrackingOrdersInputType =
  FulfillmentMutationModifyTrackingOrdersArgs;
export type ModifyTrackingOrdersResponseType = {
  readonly fulfillment: {
    readonly modifyTrackingOrders: Pick<
      ModifyTrackingOrders,
      "modifyTrackingCount"
    > & {
      readonly errorMessages?: ReadonlyArray<PickedErrorMessages> | null;
    };
  };
};

// Query - Get package dimensions for variation
export const GET_DIMENSIONS = gql`
  query CreateShippingLabel_GetDimensions(
    $lengthUnit: LengthUnit!
    $weightUnit: WeightUnit!
    $variationId: String!
  ) {
    productCatalog {
      variation(id: $variationId) {
        logisticsMetadata {
          width {
            value(targetUnit: $lengthUnit)
          }
          height {
            value(targetUnit: $lengthUnit)
          }
          weight {
            value(targetUnit: $weightUnit)
          }
          length {
            value(targetUnit: $lengthUnit)
          }
        }
      }
    }
  }
`;

export type GetDimensionsInputType = {
  readonly lengthUnit: LengthUnit;
  readonly weightUnit: WeightUnit;
  readonly variationId: string;
};
export type GetDimensionsResponseType = {
  readonly productCatalog: {
    readonly variation: {
      readonly logisticsMetadata: {
        readonly width?: Pick<Length, "value">;
        readonly height?: Pick<Length, "value">;
        readonly length?: Pick<Length, "value">;
        readonly weight?: Pick<Weight, "value">;
      };
    };
  };
};

// Mutation - accept WPS or UPS ToS
export const ACCEPT_TOS = gql`
  mutation CreateShippingLabel_AcceptWpsTos($tos: WPSTermsTypeEnum!) {
    currentMerchant {
      merchantTermsAgreed {
        actOnWpsTermsOfService(input: { merchantAction: AGREE, tos: $tos }) {
          ok
        }
      }
    }
  }
`;

export type AcceptTosInputType = { readonly tos: WpsTermsTypeEnum };
export type AcceptTosResponseType = {
  readonly currentMerchant?: {
    readonly merchantTermsAgreed?: {
      readonly actOnWpsTermsOfService: Pick<
        MerchantWpsTermsOfServiceMutation,
        "ok"
      >;
    };
  };
};

// Query - WPS and UPS ToS acceptance
export const GET_TOS_ACCEPTED = gql`
  query CreateShippingLabel_WpsTosAccepted {
    currentMerchant {
      merchantTermsAgreed {
        wpsTermsOfService {
          agreedWpsTos
        }
      }
    }
  }
`;

export type GetTosAcceptedResponseType = {
  readonly currentMerchant: {
    readonly merchantTermsAgreed?: {
      readonly wpsTermsOfService?: PickedWpsTermsOfServiceType | null;
    };
  };
};

// Mutation - mark order as shipped
export const MARK_ORDER_AS_SHIPPED = gql`
  mutation CreateShippingLabel_MarkOrderAsShipped(
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

export type MarkOrderAsShippedInputType = FulfillmentMutationFulfillOrdersArgs;
export type MarkOrderAsShippedResponseType = {
  readonly fulfillment: {
    readonly fulfillOrders: Pick<FulfillOrders, "shippedCount"> & {
      readonly errorMessages: ReadonlyArray<
        Pick<FulfillmentError, "orderId" | "message">
      > | null;
    };
  };
};
