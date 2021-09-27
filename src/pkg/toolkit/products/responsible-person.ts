import {
  LinkProductComplianceSchema,
  ResponsiblePersonSchema,
  AddressSchema,
  ProductSchema,
  ProductComplianceSchemaLinksArgs,
  ProductComplianceSchema,
  MsrCategory,
  Country,
  LinkProductComplianceState,
  ResponsiblePersonStatus,
  ProductComplianceSchemaResponsiblePersonsArgs,
  MerchantTermsAgreedSchema,
  MerchantSchema,
  TrueTagSchema,
  ResponsiblePersonAddressSchema,
  EuComplianceResponsiblePersonCountriesAndRegions,
} from "@schema/types";
import { Theme } from "@ContextLogic/lego";

export type PickedResponsiblePerson = Pick<
  ResponsiblePersonSchema,
  "id" | "email" | "status" | "merchantId"
> & {
  readonly address: Pick<
    ResponsiblePersonAddressSchema,
    | "name"
    | "streetAddress1"
    | "streetAddress2"
    | "city"
    | "state"
    | "zipcode"
    | "phoneNumber"
  > & {
    readonly country?: Pick<
      EuComplianceResponsiblePersonCountriesAndRegions,
      "name" | "code"
    > | null;
  };
  readonly merchant: Pick<MerchantSchema, "displayName"> & {
    readonly countryOfDomicile?: Pick<Country, "name" | "code"> | null;
  };
};

type PickedResponsiblePersonInitialData = Pick<
  ResponsiblePersonSchema,
  "id"
> & {
  readonly address: Pick<AddressSchema, "name">;
};

export type PickedProduct = Pick<
  ProductSchema,
  "name" | "id" | "sku" | "eligibleForCategoryDispute"
>;

export type PickedProductComplianceLinks = Pick<
  LinkProductComplianceSchema,
  "reviewState"
> & {
  readonly euResponsiblePerson?: PickedResponsiblePerson | null;
  readonly product?: PickedProduct | null;
  readonly productCategories: ReadonlyArray<MsrCategory>;
  readonly trueTags?: ReadonlyArray<{
    readonly topLevel: Pick<TrueTagSchema, "name">;
  }> | null;
};

type PickedProductCompliance = Pick<
  ProductComplianceSchema,
  "allMsrCategories"
> & {
  readonly rpCompletedCount?:
    | ProductComplianceSchema["responsiblePersonCount"]
    | null;
  readonly rpPendingCount?:
    | ProductComplianceSchema["responsiblePersonCount"]
    | null;
  readonly rpRejectedCount?:
    | ProductComplianceSchema["responsiblePersonCount"]
    | null;
  readonly productsWithRpCount?: ProductComplianceSchema["linkCount"] | null;
  readonly productsNoRpCount?: ProductComplianceSchema["linkCount"] | null;
  readonly responsiblePersons?: ReadonlyArray<
    PickedResponsiblePersonInitialData
  > | null;
};

export type ProductComplianceLinksRequestData = Pick<
  ProductComplianceSchemaLinksArgs,
  "limit" | "offset" | "states" | "categories" | "searchType" | "query"
>;

export type ProductComplianceLinksResponseData = {
  readonly policy?: {
    readonly productCompliance?:
      | (Pick<ProductComplianceSchema, "linkCount"> & {
          readonly links?: ReadonlyArray<PickedProductComplianceLinks> | null;
        })
      | null;
  } | null;
};

export type ResponsiblePersonsRequestData = Pick<
  ProductComplianceSchemaResponsiblePersonsArgs,
  "limit" | "offset" | "states"
>;

export type ResponsiblePersonsResponseData = {
  readonly policy?: {
    readonly productCompliance?: {
      readonly responsiblePersons?: ReadonlyArray<
        PickedResponsiblePerson
      > | null;
      readonly responsiblePersonCount?:
        | ProductComplianceSchema["responsiblePersonCount"]
        | null;
    } | null;
  } | null;
};

export const CategoryLabel: { [type in MsrCategory]: string } = {
  ELECTRONICS: i`Electronics`,
  PPE: i`Personal Protective Equipment`,
  ELECTRICAL_PRODUCTS: i`Electrical Products`,
  TOYS: i`Toys`,
};

export const RpLabel: { [type in LinkProductComplianceState]: string } = {
  HAS_RP: i`Responsible Person Linked`,
  NO_RP: i`No Responsible Person`,
};

export const ReviewStatusLabel: {
  [type in ResponsiblePersonStatus]: string;
} = {
  COMPLETE: i`Completed`,
  INREVIEW: i`Pending review`,
  REJECTED: i`Rejected`,
  DELETED: i`Deleted`,
  ADMIN_APPROVED: i`Completed`,
};

/* eslint-disable local-rules/unwrapped-i18n */
export const ThemeColor: { [type in ResponsiblePersonStatus]: Theme } = {
  COMPLETE: "CashGreen",
  INREVIEW: "LightGrey",
  REJECTED: "Red",
  DELETED: "Red",
  ADMIN_APPROVED: "CashGreen",
};
/* eslint-enable local-rules/unwrapped-i18n */

export type ResponsiblePersonInitialData = {
  readonly currentMerchant: {
    readonly merchantTermsAgreed?: Pick<
      MerchantTermsAgreedSchema,
      "agreedToEuComplianceTos"
    > | null;
  };
  readonly policy?: {
    readonly productCompliance?: PickedProductCompliance | null;
  } | null;
};
