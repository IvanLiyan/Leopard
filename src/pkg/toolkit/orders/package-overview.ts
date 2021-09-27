import {
  OrderSchema,
  WishUserSchema,
  ShippingDetailsSchema,
  UserSchema,
  OrderTaxSchema,
  VariationSchema,
  CurrencyValue,
  OrderUkFulfillSchema,
  Datetime,
  WishCompanyInfo,
  AddressSchema,
  Country,
} from "@schema/types";

export type PickedCountry = Pick<Country, "name">;

export type PickedAddressSchema = Pick<
  AddressSchema,
  "streetAddress1" | "streetAddress2" | "city" | "zipcode" | "state"
> & {
  readonly country: PickedCountry;
};

export type PickedWishCompanyInfo = Pick<
  WishCompanyInfo,
  "companyOperatorName"
> & {
  readonly hqAddress: PickedAddressSchema;
};

export type PickedShippingDetails = Pick<
  ShippingDetailsSchema,
  "name" | "streetAddress1" | "streetAddress2" | "city" | "zipcode"
> & {
  readonly country: PickedCountry;
};

export type PickedOrderSalesTaxDetailsSchema = {
  readonly salesTax: Pick<CurrencyValue, "amount" | "display">;
};

export type PickedOrderTaxInfo = {
  readonly ukPriceTax: Pick<PickedOrderSalesTaxDetailsSchema, "salesTax">;
  readonly ukShippingTax: Pick<PickedOrderSalesTaxDetailsSchema, "salesTax">;
} & Pick<OrderTaxSchema, "isVatOrder">;

type PickedCartPrice = {
  readonly preTaxProductPrice?: Pick<
    CurrencyValue,
    "amount" | "display"
  > | null;
  readonly preTaxShippingPrice?: Pick<
    CurrencyValue,
    "amount" | "display"
  > | null;
  readonly postTaxProductPrice?: Pick<
    CurrencyValue,
    "amount" | "display"
  > | null;
  readonly postTaxShippingPrice?: Pick<
    CurrencyValue,
    "amount" | "display"
  > | null;
};

export type OrderDetailData = Pick<OrderSchema, "id" | "quantity"> & {
  readonly cartPrice?: PickedCartPrice | null;
  readonly variation?: Pick<VariationSchema, "productName"> | null;
  readonly shippingDetails?: PickedShippingDetails | null;
  readonly user?: Pick<WishUserSchema, "id"> | null;
  readonly tax?: PickedOrderTaxInfo | null;
  readonly ukDetails?: Pick<OrderUkFulfillSchema, "isBoundOrder"> | null;
  readonly releasedTime?: Pick<Datetime, "formatted"> | null;
  readonly orderTime?: Pick<Datetime, "formatted"> | null;
};

type PickedPlatformConstants = {
  readonly wishCompanyInfo: PickedWishCompanyInfo;
};

export type PackageOverviewInitialData = {
  readonly fulfillment: {
    readonly order: OrderDetailData;
  };
  readonly currentUser: Pick<UserSchema, "isOnCsTeam" | "isAdmin">;
  readonly platformConstants?: PickedPlatformConstants | null;
};
