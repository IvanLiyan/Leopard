import {
  BrandSchema,
  BrandType,
  Country,
  CurrencyValue,
  IpViolationBrandCategory,
  TrueTagSchema,
} from "@schema/types";

export type BrandObject = Pick<
  BrandSchema,
  | "id"
  | "name"
  | "displayName"
  | "logoUrl"
  | "logoAspectRatio"
  | "brandUrl"
  | "isAdult"
  | "isActive"
  | "isTrueBrand"
  | "severity"
  | "keywords"
  | "autoApproveMerchantIds"
  | "numTaggedProducts"
  | "brandReach"
  | "counterfeitRiskLevel"
  | "internalNote"
> & {
  readonly brandTypes: ReadonlyArray<
    Pick<BrandType, "brandType" | "displayName">
  >;
  readonly brandProductTags: ReadonlyArray<Pick<TrueTagSchema, "id">>;
  readonly ipViolationCategory: Pick<
    IpViolationBrandCategory,
    "category" | "displayName"
  >;
  readonly minimumPrice: Pick<CurrencyValue, "amount" | "currencyCode">;
  readonly brandOwnerEntityCountry: Pick<Country, "code">;
  readonly manufacturingCountry: Pick<Country, "code">;
};
