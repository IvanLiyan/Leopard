import {
  ProductSchema,
  ImageSchema,
  TrueTagSchema,
  ProductCategoryDisputeStatus,
  ProductCategoryDisputeSchema,
  Datetime,
  MerchantFileSchema,
  ProductCategoryDisputeReasonSchema,
  OrderSchema,
  MerchantOneoffPaymentSchema,
  CurrencyValue,
  MerchantSchema,
  ProductCategoryDisputeAdminUnchangedReason,
  RoleSchema,
} from "@schema/types";
import { Theme } from "@ContextLogic/lego";

export type PickedVariation = {
  readonly price: Pick<CurrencyValue, "display" | "amount">;
};

export type PickedAdminProductCategoryDisputeDetailsSchema = Omit<
  PickedProductCategoryDisputeDetailsSchema,
  "product"
> & {
  readonly product: Pick<
    ProductSchema,
    "id" | "name" | "description" | "merchantId"
  > & {
    readonly mainImage: Pick<ImageSchema, "wishUrl">;
    readonly extraImages?: ReadonlyArray<Pick<ImageSchema, "wishUrl">> | null;
    readonly variations?: ReadonlyArray<PickedVariation> | null;
  };
  readonly merchant: Pick<MerchantSchema, "id" | "displayName">;
};

export type PickedProductCategoryDisputeDetailsSchema = Pick<
  ProductCategoryDisputeSchema,
  | "id"
  | "status"
  | "source"
  | "merchantNote"
  | "adminUnchangedOtherReasonDetails"
  | "adminUnchangedReason"
> & {
  readonly product: Pick<ProductSchema, "id" | "name"> & {
    readonly mainImage: Pick<ImageSchema, "wishUrl">;
    readonly trueTags?: ReadonlyArray<PickedTrueTagSchema> | null;
  };
  readonly lastUpdate: Pick<Datetime, "formatted">;
  readonly trueTagsDisputed?: ReadonlyArray<PickedTrueTagSchema> | null;
  readonly trueTagsProposed?: ReadonlyArray<PickedTrueTagSchema> | null;
  readonly trueTagsApproved?: ReadonlyArray<PickedTrueTagSchema> | null;
  readonly supportedFiles?: ReadonlyArray<MerchantFileSchema> | null;
  readonly reason?: Pick<
    ProductCategoryDisputeReasonSchema,
    "reason" | "text"
  > | null;
};

export type PickedProductCategoryDisputeSchema = Pick<
  ProductCategoryDisputeSchema,
  "id" | "status"
> & {
  readonly merchant: Pick<MerchantSchema, "id" | "displayName">;
  readonly product: Pick<ProductSchema, "id">;
  readonly lastUpdate: Pick<Datetime, "formatted">;
  readonly trueTagsDisputed?: ReadonlyArray<PickedTrueTagSchema> | null;
  readonly trueTagsApproved?: ReadonlyArray<PickedTrueTagSchema> | null;
};

type PickedTrueTagSchema = Pick<TrueTagSchema, "id" | "name"> & {
  readonly topLevel?: Pick<TrueTagSchema, "id" | "name"> | null;
};

type PickedOneOffPayment = Pick<
  MerchantOneoffPaymentSchema,
  "id" | "type" | "orderId" | "paymentId"
> & {
  readonly creationTime?: Pick<Datetime, "formatted"> | null;
  readonly amount?: Pick<CurrencyValue, "display"> | null;
};

export type PickedOrder = Pick<
  OrderSchema,
  "updatedRevShare" | "originalRevShare"
> & {
  readonly oneoffPayment?: PickedOneOffPayment | null;
};

export type CreateProductCategoryDisputeInitialData = {
  readonly policy?: {
    readonly productCategoryDispute?: {
      readonly reasons?: ReadonlyArray<
        Pick<ProductCategoryDisputeReasonSchema, "reason" | "text">
      > | null;
    };
  };
  readonly productCatalog?: {
    readonly product?:
      | (Pick<ProductSchema, "id" | "name"> & {
          readonly mainImage: Pick<ImageSchema, "wishUrl">;
          readonly trueTags?: ReadonlyArray<PickedTrueTagSchema> | null;
        })
      | null;
  } | null;
  readonly platformConstants: {
    readonly topLevelTags?: ReadonlyArray<
      Pick<TrueTagSchema, "id" | "name">
    > | null;
  };
};

export type ProductCategoryDisputeInitialData = {
  readonly currentUser: {
    readonly roles?: ReadonlyArray<Pick<RoleSchema, "id">>;
  };
};

export type ProductCategoryDisputeDetailsInitialData = {
  readonly fulfillment?: {
    readonly orders?: ReadonlyArray<PickedOrder> | null;
  };
  readonly policy?: {
    readonly productCategoryDispute?: {
      readonly disputes?: ReadonlyArray<
        PickedProductCategoryDisputeDetailsSchema
      > | null;
    };
  };
};

export type AdminProductCategoryDisputeReviewInitialData = {
  readonly policy?: {
    readonly productCategoryDispute?: {
      readonly disputes?: ReadonlyArray<
        PickedAdminProductCategoryDisputeDetailsSchema
      > | null;
    };
  };
};

export type ProductCategoryDisputeResponseData = {
  readonly policy: {
    readonly productCategoryDispute?: {
      readonly disputeCount?: number | null;
      readonly disputes?: ReadonlyArray<
        PickedProductCategoryDisputeSchema
      > | null;
    } | null;
  };
};

export const DisputeStatusLabel: {
  readonly [type in ProductCategoryDisputeStatus]: string;
} = {
  PENDING_REVIEW: i`Pending review`,
  RESOLVED_UPDATE: i`Resolved - Updated`,
  RESOLVED_UNCHANGED: i`Resolved - Unchanged`,
};

export const DisputeStatusTheme: {
  readonly [type in ProductCategoryDisputeStatus]: Theme;
} = {
  PENDING_REVIEW: `Grey`,
  RESOLVED_UPDATE: `LighterCyan`,
  RESOLVED_UNCHANGED: `Yellow`,
};

export const AdminDisputeUnchangedReason: {
  readonly [type in ProductCategoryDisputeAdminUnchangedReason]: string;
} = {
  CORRECT_TAGGED: `The original tag was the correct choice`,
  IMAGE_MISMATCH: `Image/Title Mismatch`,
  OTHER: `Other`,
  PROPOSED_TAG_IS_INAPPROPRIATE: `Proposed tag is inappropriate`,
};

export const getTopLevelTags = (
  trueTags: ReadonlyArray<PickedTrueTagSchema>
): string => {
  const topLevelTags = new Set(
    trueTags
      .filter((tag) => tag.topLevel != null)
      .map((tag) => tag.topLevel?.name)
  );

  return Array.from(topLevelTags).join(", ").trim();
};
