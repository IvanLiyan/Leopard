import {
  Country,
  Datetime,
  OrderSchema,
  CurrencyValue,
  VariationSchema,
  OrderTaxItemSchema,
  TaxAuthoritySchema,
  ShippingDetailsSchema,
  OrderShopifyDetailsSchema,
  SpecialOrderProgramSchema,
  Timedelta,
  UserSchema,
  WishPostShippingUpdatesSchema,
  OrderSalesTaxDetailsSchema,
  OrderTaxSchema,
  CartPriceDetailSchema,
  ShippingProviderSchema,
  OrderConstants,
  MerchantSchema,
  OrderFbwDetailsSchema,
  TrackingDisputeSchema,
  OrderUkFulfillSchema,
  UkVatInfoSchema,
  WishExpressCountryDetails,
  OrderShippingEstimate,
  TrackingCheckpointSchema,
  TrackingCheckpointLocationSchema,
  OrderNoFulfillSchema,
  WpsFulfillmentInfoSchema,
  WpsFeeAdjustment,
  WishEuvatPayerInfo,
  AddressSchema,
  TaxSetting,
  ImageSchema,
  ProductSchema,
  Weight,
  MerchantOneoffPaymentSchema,
  RevShareInfoSchema,
  OrderEpcInfoSchema,
  PenaltySchema,
  CustomerIdentityInfo,
  CustomerSupportTicket,
  OrderRefundItemSchema,
  OrderRefundReasonSchema,
  OrderWfpInfoSchema,
  WishUserSchema,
  OrderRefundPaymentSchema,
  MerchantWarningSchema,
  OrderRefundItemDisputeSchema,
  LegacyRefundSource,
  OrderTrackingInfoSchema,
} from "@schema/types";

export enum WishPostAction {
  arriveEPCWarehouse = "231",
  departEPCWarehouse = "232",
}

export type PickedAddressType = Pick<
  AddressSchema,
  "name" | "streetAddress1" | "streetAddress2" | "city" | "zipcode" | "state"
> & {
  readonly country?: Pick<Country, "name" | "code"> | null;
};

export type PickedMerchantAddressType = Pick<
  AddressSchema,
  "streetAddress1" | "streetAddress2" | "city" | "zipcode" | "state"
> & {
  readonly country?: Pick<Country, "name" | "code"> | null;
};

export type PickedRefundItems = Pick<
  OrderRefundItemSchema,
  | "id"
  | "quantity"
  | "merchantResponsibilityRatio"
  | "note"
  | "isDisputable"
  | "source"
> & {
  readonly reasonInfo: Pick<OrderRefundReasonSchema, "reason" | "text"> | null;
  readonly refundTime: Pick<Datetime, "formatted">;
  readonly merchantResponsibleAmount?: Pick<
    CurrencyValue,
    "display" | "amount"
  > | null;
  readonly merchantResponsibleAmountWishpost?: Pick<
    CurrencyValue,
    "display" | "amount"
  > | null;
  readonly refundTax?: Pick<
    CurrencyValue,
    "display" | "amount" | "currencyCode"
  > | null;
  readonly payment: Pick<OrderRefundPaymentSchema, "status" | "id"> & {
    readonly time?: Pick<Datetime, "formatted"> | null;
    readonly merchantAmount?: Pick<
      CurrencyValue,
      "display" | "amount" | "currencyCode"
    >;
    readonly merchantAmountWishpost?: Pick<
      CurrencyValue,
      "display" | "amount" | "currencyCode"
    >;
  };
  readonly eatCostWarning?: Pick<MerchantWarningSchema, "id"> | null;
  readonly dispute?: Pick<
    OrderRefundItemDisputeSchema,
    "supportingPolicy"
  > | null;
};

type PickedOrderEstimatedShippingTimelineSchema = {
  readonly maxShipTime:
    | (Pick<Datetime, "formatted"> & {
        readonly timeSince: Pick<Timedelta, "days">;
      })
    | null;
  readonly maxDeliveryTime?:
    | (Pick<Datetime, "formatted"> & {
        readonly timeSince: Pick<Timedelta, "days">;
      })
    | null;
};

type PickedOrderNoFulfillSchema = Pick<OrderNoFulfillSchema, "isBoundOrder">;

type PickedTrackingCheckpointLocationSchema = Pick<
  TrackingCheckpointLocationSchema,
  "city" | "state" | "zipcode"
> & {
  readonly country?: Pick<Country, "name" | "code"> | null;
};

export type PickedTrackingCheckpointSchema = Pick<
  TrackingCheckpointSchema,
  "message" | "resultingTrackingState" | "type" | "wishpostAction"
> & {
  readonly date: Pick<Datetime, "formatted"> & {
    readonly timeSince: Pick<Timedelta, "days">;
  };
  readonly location: PickedTrackingCheckpointLocationSchema;
};

type PickedOrderTrackingInfoSchema = Pick<
  OrderTrackingInfoSchema,
  "carrierTier"
> & {
  readonly confirmedFulfillmentDate?: Pick<
    Datetime,
    "iso8061" | "formatted"
  > & {
    readonly timeSince: Pick<Timedelta, "days">;
  };
  readonly deliveredDate?: Pick<Datetime, "formatted"> & {
    readonly timeSince: Pick<Timedelta, "days">;
  };
  readonly checkpoints?: ReadonlyArray<PickedTrackingCheckpointSchema> | null;
};

type PickedOrderReturnLabelFeeSchema = {
  readonly amount: Pick<CurrencyValue, "display">;
};

type PickedShippingProviderSchema = Pick<
  ShippingProviderSchema,
  "name" | "providerUrl"
>;

type PickedWishExpress = Pick<
  WishExpressCountryDetails,
  "supportsWishExpress" | "expectedTimeToDoor"
>;

type PickedCountry = Pick<Country, "name" | "code"> & {
  readonly wishExpress: PickedWishExpress;
};

export type PickedShippingDetails = Pick<
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
> & {
  readonly provider?: PickedShippingProviderSchema | null;
  readonly country?: PickedCountry | null;
};

export type PickOrderSalesTaxItem = Pick<
  OrderTaxItemSchema,
  "isSale" | "isRefund" | "refundItemId"
> & {
  readonly authority: Pick<TaxAuthoritySchema, "name" | "type">;
  readonly taxAmount: Pick<CurrencyValue, "display">;
  readonly createdTime: Pick<Datetime, "mmddyyyy">;
  readonly taxableAddress: {
    readonly country: Pick<Country, "name">;
  };
};

export type PickedOrderSalesTaxDetailsSchema = Pick<
  OrderSalesTaxDetailsSchema,
  "remitTypes"
> & {
  readonly merchantRemitItems: ReadonlyArray<PickOrderSalesTaxItem>;
  readonly merchantRemitNetTaxInAuthorityCurrency: Pick<
    CurrencyValue,
    "amount" | "display"
  >;
  readonly wishRemitNetTaxInAuthorityCurrency: Pick<
    CurrencyValue,
    "amount" | "display"
  >;
  readonly authorityCountry?: Pick<Country, "code"> | null;
  readonly salesTax: Pick<CurrencyValue, "amount" | "display">;
  readonly netTax: Pick<CurrencyValue, "amount" | "display" | "currencyCode">;
  readonly refundedTax: Pick<CurrencyValue, "amount" | "display">;
  readonly customerSalesTax?: Pick<CurrencyValue, "display"> | null;
  readonly authoritySalesTax?: Pick<CurrencyValue, "display"> | null;
};

export type PickedEuVatSchema = {
  readonly authorityInvoiceAmount?: Pick<CurrencyValue, "display"> | null;
  readonly customerInvoiceAmount?: Pick<CurrencyValue, "display"> | null;
  readonly authorityShippingPrice?: Pick<CurrencyValue, "display"> | null;
  readonly customerShippingPrice?: Pick<CurrencyValue, "display"> | null;
};

export type PickedOrderTaxInfo = {
  readonly salesTax: PickedOrderSalesTaxDetailsSchema;
  readonly ukPriceTax: Pick<PickedOrderSalesTaxDetailsSchema, "salesTax">;
  readonly ukShippingTax: Pick<PickedOrderSalesTaxDetailsSchema, "salesTax">;
  readonly euVat: PickedEuVatSchema;
} & Pick<OrderTaxSchema, "isVatOrder" | "norwayVatNumber" | "isWishReseller">;

export type PickedWishPostShippingUpdateSchema = Pick<
  WishPostShippingUpdatesSchema,
  "reason"
> & {
  readonly date: Pick<Datetime, "mmddyyyy">;
  readonly paymentDate?: Pick<Datetime, "mmddyyyy"> | null;
  readonly amount: Pick<CurrencyValue, "display">;
};

type PickedCartPrice = Pick<CartPriceDetailSchema, "total"> & {
  readonly total?: Pick<CurrencyValue, "display"> | null;
  readonly preTaxProductPrice?: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  > | null;
  readonly preTaxShippingPrice?: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  > | null;
  readonly postTaxProductPrice?: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  > | null;
  readonly postTaxShippingPrice?: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  > | null;
};

type PickedOrderShippingEstimate = Pick<
  OrderShippingEstimate,
  "minTime" | "maxTime"
>;

type PickedWpsFulfillmentSchema = Pick<
  WpsFulfillmentInfoSchema,
  | "shipmentState"
  | "shippingLabelDownloadLink"
  | "shippingOptionId"
  | "paymentId"
> & {
  readonly shipmentFee: Pick<CurrencyValue, "display">;
  readonly purchaseDate?: Pick<Datetime, "formatted">;
  readonly paymentProcessedDate?: Pick<Datetime, "formatted" | "hasPassed">;
  readonly feeAdjustments?: ReadonlyArray<
    Pick<WpsFeeAdjustment, "paymentId" | "reason"> & {
      readonly creationDate: Pick<Datetime, "formatted">;
      readonly amount: Pick<CurrencyValue, "display">;
      readonly paymentProcessedDate?: Pick<Datetime, "formatted" | "hasPassed">;
    }
  >;
};

export type PickedOneoffPayment = Pick<
  MerchantOneoffPaymentSchema,
  "paymentId" | "type" | "id" | "disputeId"
> & {
  readonly creationTime: Pick<Datetime, "formatted">;
  readonly amount: Pick<CurrencyValue, "display">;
};

export type OrderDetailData = Pick<
  OrderSchema,
  | "id"
  | "productId"
  | "merchantId"
  | "hoursLeftToFulfill"
  | "quantity"
  | "requiresConfirmedDelivery"
  | "shippingProviderId"
  | "transactionId"
  | "state"
  | "paymentStatus"
  | "isUnityOrder"
  | "isAdvancedLogistics"
  | "isRemovedFromAdvancedLogistics"
  | "hasShipped"
  | "merchantCurrencyAtPurchaseTime"
  | "requiresDeliveredDutyPaid"
  | "isSwapFromAnotherOrder"
  | "isRouted"
  | "isFreeShippingEligible"
  | "limboState"
  | "inRefundLimbo"
  | "confirmedDelivered"
  | "legacyRefundSource"
  | "isWishExpress"
  | "wishExpressExtensionDays"
  | "isShippedWithQualifiedDadaCarrier"
  | "isInIncentiveProgram"
  | "returnDetailsId"
  | "chargeback"
  | "canRefund"
  | "isCombinedOrder"
  | "ttd"
  | "ttdBusinessDays"
  | "expectedTtdBusinessDays"
  | "customerPaidCurrency"
  | "productName"
  | "originalRevShare"
  | "updatedRevShare"
  | "routingOriginalOrderId"
  | "canShowCarrierTier"
  | "client"
  | "isStreamline"
  | "isProcessing"
  | "warehouseShippingType"
  | "isNewRefund"
  | "showAplusShippingAddressTooltip"
> & {
  readonly revShare?:
    | Pick<RevShareInfoSchema, "productCategory" | "qualifiers">
    | null
    | undefined;
  readonly oneoffPayment?: PickedOneoffPayment | null | undefined;
  readonly cartPrice?: PickedCartPrice | null;
  readonly shippingDetails?: PickedShippingDetails | null;
  readonly variation: Pick<
    VariationSchema,
    "productId" | "productName" | "sku" | "size" | "color" | "customsHsCode"
  > & {
    readonly weight?: Pick<Weight, "value"> | null | undefined;
  };
  readonly customer: {
    readonly pricing: {
      readonly credit?: Pick<CurrencyValue, "amount" | "display"> | null;
    };
    readonly user?:
      | Pick<
          WishUserSchema,
          | "id"
          | "name"
          | "email"
          | "isVerified"
          | "signupMethod"
          | "emailBouncedReason"
        >
      | null
      | undefined;
  };
  readonly shopifyDetails: Pick<OrderShopifyDetailsSchema, "shopifyOrderId">;
  readonly specialPrograms: ReadonlyArray<
    Pick<SpecialOrderProgramSchema, "name" | "taskLink">
  > | null;
  readonly shippedDate?: Pick<Datetime, "formatted"> & {
    readonly timeSince: Pick<Timedelta, "days">;
  };
  readonly releasedTime?: Pick<Datetime, "formatted" | "iso8061"> & {
    readonly timeSince: Pick<Timedelta, "days">;
  };
  readonly reReleasedTime: Pick<Datetime, "formatted"> & {
    readonly timeSince: Pick<Timedelta, "days">;
  };
  readonly refundedTime?: Pick<Datetime, "formatted"> | null;
  readonly trackingCancelledDate: Pick<Datetime, "formatted"> & {
    readonly timeSince: Pick<Timedelta, "days">;
  };
  readonly returnLabelFee?: PickedOrderReturnLabelFeeSchema | null;
  readonly wishpostShippingUpdates: ReadonlyArray<PickedWishPostShippingUpdateSchema>;
  readonly initialWishpostShipping: Pick<CurrencyValue, "display">;
  readonly estimatedWishpostShipping: Pick<CurrencyValue, "display">;
  readonly merchantTotal: Pick<CurrencyValue, "display">;
  readonly merchantPrice: Pick<CurrencyValue, "display" | "amount">;
  readonly merchantShipping: Pick<CurrencyValue, "display" | "amount">;
  readonly totalCost: Pick<
    CurrencyValue,
    "amount" | "display" | "currencyCode"
  >;
  readonly tax?: PickedOrderTaxInfo | null;
  readonly fbwDetails?: Pick<
    OrderFbwDetailsSchema,
    "isFbw" | "warehouseName"
  > | null;
  readonly trackingDispute?: Pick<TrackingDisputeSchema, "id" | "state"> | null;
  readonly orderTime?: Pick<Datetime, "formatted"> | null;
  readonly ukDetails?: Pick<OrderUkFulfillSchema, "isBoundOrder"> | null;
  readonly shippingEstimate?: PickedOrderShippingEstimate | null;
  readonly tracking?: PickedOrderTrackingInfoSchema | null;
  readonly dadaWasDeliveredOnTime: OrderSchema["wasDeliveredOnTime"];
  readonly wishExpressWasDeliveredOnTime: OrderSchema["wasDeliveredOnTime"];
  readonly norwayDetails?: PickedOrderNoFulfillSchema | null;
  readonly wpsFulfillment?: PickedWpsFulfillmentSchema | null;
  readonly product?:
    | (Pick<ProductSchema, "condition"> & {
        readonly mainImage: Pick<ImageSchema, "wishUrl">;
      })
    | null;
  readonly epc?: Pick<OrderEpcInfoSchema, "canUncombine"> | null;
  readonly penalties: ReadonlyArray<Pick<PenaltySchema, "reason">>;
  readonly customerIdentifyInfo?: Pick<
    CustomerIdentityInfo,
    "number" | "numberName"
  > | null;
  readonly supportTicket?: Pick<CustomerSupportTicket, "id"> | null;
  readonly refundItems?: ReadonlyArray<
    Pick<OrderRefundItemSchema, "id"> & {
      readonly reasonInfo: Pick<OrderRefundReasonSchema, "reason" | "text">;
    }
  > | null;
  readonly estimatedShippingTimeline?: PickedOrderEstimatedShippingTimelineSchema | null;
  readonly warehouseFulfillmentPolicyInfo?: Pick<
    OrderWfpInfoSchema,
    "deliveryState"
  > | null;
};

type PickedUkVatInfoSchema = Pick<
  UkVatInfoSchema,
  "name" | "number" | "eoriNumber"
>;

type PickedTaxConstants = {
  readonly ukVatInfo: PickedUkVatInfoSchema;
};

type PickedPlatformConstants = {
  readonly wishEuVatPayerInfo?: Pick<WishEuvatPayerInfo, "iossNumber"> & {
    readonly address: PickedAddressType;
  };
  readonly tax: PickedTaxConstants;
  readonly orders: Pick<OrderConstants, "dadaPolicyDaysToConfirmedDelivered">;
};

type PickedMerchantSchema = Pick<MerchantSchema, "displayName"> & {
  readonly tax?: {
    readonly settings?: ReadonlyArray<
      Pick<TaxSetting, "taxNumber" | "taxNumberType" | "status"> & {
        readonly authority?: {
          readonly country: Pick<Country, "code">;
        };
      }
    > | null;
  };
};

export type OrderDetailInitialData = {
  readonly fulfillment: {
    readonly order: OrderDetailData;
  };
  readonly su?: Pick<UserSchema, "isAdmin"> | null;
  readonly currentUser: Pick<
    UserSchema,
    "isOnCsTeam" | "isAdmin" | "name" | "entityType"
  > & {
    readonly businessAddress?: PickedMerchantAddressType | null;
  };
  readonly platformConstants?: PickedPlatformConstants | null;
  readonly currentMerchant?: PickedMerchantSchema | null;
};

export const LegacyRefundFlavourText: {
  [refund in LegacyRefundSource]: string;
} = {
  MERCHANT: i`You (the merchant) choose to refund this order to the customer.`,
  USER_CANCEL:
    i`The customer requested to cancel the order and since it was not shipped Wish ` +
    i`refunded the order in full.`,
  WISH_ADMIN_MERCHANT_EATS_COST:
    i`A Wish support admin choose to refund this order to provide good customer ` +
    i`service.`,
  WISH_ADMIN_BOTH_EAT_COST: i`Refunded`,
  WISH_ADMIN_WISH_EATS_COST:
    i`A Wish support admin choose to refund this order to provide good customer ` +
    i`service.`,
  AUTO_LATE_FULFILL:
    i`The merchant failed to fulfill this order within 5 days so Wish automatically ` +
    i`refunded the full amount to the user.`,
};
