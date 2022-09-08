// call GQL API for v2 announcement
import {
  AnnouncementAudienceSourceType,
  AnnouncementCategory,
  AnnouncementCategorySchemaV2,
  AnnouncementContentType,
  AnnouncementLocale,
  AnnouncementProgram,
  AnnouncementProgramSchemaV2,
  AnnouncementsForUsersV2SchemaSingleArgs,
  AnnouncementState,
  AnnouncementType,
  Datetime,
  MerchantAnnouncementV2Schema,
} from "@schema/types";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { ci18n } from "@legacy/core/i18n";

export const useAnnouncementForUsersV2Data = (announcementId: string) => {
  return useQuery<
    GetMerchantAnnouncementResponseType,
    AnnouncementsForUsersV2SchemaSingleArgs
  >(GET_ANNOUNCEMENT, {
    variables: { announcementId },
  });
};

type GetMerchantAnnouncementResponseType = {
  readonly announcements: {
    readonly forUsersV2?: {
      readonly single?: PickedSingleMerchantAnnouncementV2Type;
    };
  };
};

export type PickedSingleMerchantAnnouncementV2Type = Pick<
  MerchantAnnouncementV2Schema,
  | "id"
  | "type"
  | "title"
  | "message"
  | "link"
  | "ctaText"
  | "ctaDueDate"
  | "categories"
  | "program"
  | "locales"
  | "important"
  | "audienceSourceType"
  | "sender"
  | "state"
  | "userAnnouncementCount"
> & {
  readonly publishDate: PickedSingleAnnouncementPublishDate;
};
export type PickedSingleAnnouncementPublishDate = Pick<Datetime, "unix"> & {
  readonly inTimezone: Pick<Datetime, "formatted">;
};

const GET_ANNOUNCEMENT = gql`
  query GetAnnouncement($announcementId: ObjectIdType!) {
    announcements {
      forUsersV2 {
        single(announcementId: $announcementId) {
          id
          title
          message
          link
          program {
            text
            type
          }
          categories {
            text
            type
          }
          important
          ctaText
          ctaDueDate {
            formatted(fmt: "MMMM dd, y h:m a UTC")
          }
          publishDate {
            inTimezone(identifier: "UTC") {
              formatted(fmt: "EEEE, MMMM dd, y")
            }
            unix
          }
        }
      }
    }
  }
`;

export type AnnouncementsListPageSortType =
  | "SORT_TYPE_IMPORTANT"
  | "SORT_TYPE_RECENT";

export const ArrayWithMerchantProgramTypeAsValues = [
  "ADVANCED_LOGISTICS_PROGRAM",
  "EPC",
  "FBW_FBS",
  "MERCHANT_STANDING",
  "PARTIAL_REFUNDS",
  "PRODUCTBOOST",
  "RETURNS_PROGRAM",
  "WISH_EXPRESS",
  "WISHPOST",
  "MERCHANT_FUNDED_PROMOTIONS",
  "VIDEOS",
  "WISH_STANDARDS",
] as const;
export type MerchantProgramType =
  typeof ArrayWithMerchantProgramTypeAsValues[number];

export const ArrayWithCategoryTypesAsValues = [
  "ACCOUNT_SETTINGS",
  "API",
  "INSIGHTS",
  "INTELLECTUAL_PROPERTY",
  "LOCAL_CURRENCY",
  "LOGISTICS",
  "LOGISTICS_PRICING",
  "ORDERS",
  "PAYMENTS",
  "POLICIES_AND_TERMS",
  "PRODUCTS",
  "SHIPPING_CARRIERS",
  "TAX",
] as const;
export type MerchantCategoryType =
  typeof ArrayWithCategoryTypesAsValues[number];

export const ArrayWithCategoryV2TypesAsValues = [
  "CATEGORY_UNSPECIFIED",
  "CATEGORY_ACCOUNTSETTINGS",
  "CATEGORY_API",
  "CATEGORY_INSIGHTS",
  "CATEGORY_INTELLECTUALPROPERTY",
  "CATEGORY_LOCALCURRENCY",
  "CATEGORY_LOGISTICS",
  "CATEGORY_LOGISTICSPRICING",
  "CATEGORY_ORDERS",
  "CATEGORY_PAYMENTS",
  "CATEGORY_POLICIESANDTERMS",
  "CATEGORY_PRODUCTS",
  "CATEGORY_SHIPPINGCARRIERS",
  "CATEGORY_TAX",
] as const;
export type AnnouncementV2Category =
  typeof ArrayWithCategoryV2TypesAsValues[number];

export const ArrayWithProgramV2TypesAsValues = [
  "PROGRAM_UNSPECIFIED",
  "PROGRAM_ADVANCED_LOGISTICS",
  "PROGRAM_EPC",
  "PROGRAM_FBW_FBS",
  "PROGRAM_MERCHANT_STANDING",
  "PROGRAM_PARTIAL_REFUNDS",
  "PROGRAM_PRODUCT_BOOST",
  "PROGRAM_RETURNS_PROGRAM",
  "PROGRAM_WISH_EXPRESS",
  "PROGRAM_WISHPOST",
  "PROGRAM_MERCHANT_FUNDED_PROMOTIONS",
  "PROGRAM_VIDEOS",
  "PROGRAM_WISH_STANDARDS",
] as const;
export type AnnouncementV2Program =
  typeof ArrayWithProgramV2TypesAsValues[number];

export const categoryToCategoryV2Map: {
  readonly [key in MerchantCategoryType]: AnnouncementCategory;
} = {
  ACCOUNT_SETTINGS: "CATEGORY_ACCOUNTSETTINGS",
  API: "CATEGORY_API",
  INSIGHTS: "CATEGORY_INSIGHTS",
  INTELLECTUAL_PROPERTY: "CATEGORY_INTELLECTUALPROPERTY",
  LOCAL_CURRENCY: "CATEGORY_LOCALCURRENCY",
  LOGISTICS: "CATEGORY_LOGISTICS",
  LOGISTICS_PRICING: "CATEGORY_LOGISTICSPRICING",
  ORDERS: "CATEGORY_ORDERS",
  PAYMENTS: "CATEGORY_PAYMENTS",
  POLICIES_AND_TERMS: "CATEGORY_POLICIESANDTERMS",
  PRODUCTS: "CATEGORY_PRODUCTS",
  SHIPPING_CARRIERS: "CATEGORY_SHIPPINGCARRIERS",
  TAX: "CATEGORY_TAX",
};

export const programToProgramV2Map: {
  readonly [key in MerchantProgramType]: AnnouncementProgram;
} = {
  ADVANCED_LOGISTICS_PROGRAM: "PROGRAM_ADVANCED_LOGISTICS",
  EPC: "PROGRAM_EPC",
  FBW_FBS: "PROGRAM_FBW_FBS",
  MERCHANT_STANDING: "PROGRAM_MERCHANT_STANDING",
  PARTIAL_REFUNDS: "PROGRAM_PARTIAL_REFUNDS",
  PRODUCTBOOST: "PROGRAM_PRODUCT_BOOST",
  RETURNS_PROGRAM: "PROGRAM_RETURNS_PROGRAM",
  WISH_EXPRESS: "PROGRAM_WISH_EXPRESS",
  WISHPOST: "PROGRAM_WISHPOST",
  MERCHANT_FUNDED_PROMOTIONS: "PROGRAM_MERCHANT_FUNDED_PROMOTIONS",
  VIDEOS: "PROGRAM_VIDEOS",
  WISH_STANDARDS: "PROGRAM_WISH_STANDARDS",
};

export const EXP_BUCKET_IRIS_NAME = "iris";

export const AnnouncementLocaleConstants: {
  readonly [key in AnnouncementLocale]: AnnouncementLocale;
} = {
  LOCALE_UNSPECIFIED: "LOCALE_UNSPECIFIED",
  LOCALE_EN: "LOCALE_EN",
  LOCALE_CN: "LOCALE_CN",
  LOCALE_PT_BR: "LOCALE_PT_BR",
  LOCALE_ES_LA: "LOCALE_ES_LA",
  LOCALE_FR_FR: "LOCALE_FR_FR",
  LOCALE_DE_DE: "LOCALE_DE_DE",
  LOCALE_IT_IT: "LOCALE_IT_IT",
  LOCALE_JA_JP: "LOCALE_JA_JP",
  LOCALE_KO_KR: "LOCALE_KO_KR",
};

export const AnnouncementTypeConstants: {
  readonly [key in AnnouncementType]: AnnouncementType;
} = {
  ANNOUNCEMENT_TYPE_UNSPECIFIED: "ANNOUNCEMENT_TYPE_UNSPECIFIED",
  ANNOUNCEMENT_TYPE_SYSTEM_UPDATE: "ANNOUNCEMENT_TYPE_SYSTEM_UPDATE",
  ANNOUNCEMENT_TYPE_BD_ANNOUNCEMENT: "ANNOUNCEMENT_TYPE_BD_ANNOUNCEMENT",
};

export const AnnouncementStateConstants: {
  readonly [key in AnnouncementState]: AnnouncementState;
} = {
  ANNOUNCEMENT_STATE_UNSPECIFIED: "ANNOUNCEMENT_STATE_UNSPECIFIED",
  ANNOUNCEMENT_STATE_NEW: "ANNOUNCEMENT_STATE_NEW",
  ANNOUNCEMENT_STATE_DOWNLOADING_CSV: "ANNOUNCEMENT_STATE_DOWNLOADING_CSV",
  ANNOUNCEMENT_STATE_PARSING_CSV: "ANNOUNCEMENT_STATE_PARSING_CSV",
  ANNOUNCEMENT_STATE_RETRIEVING_MERCHANTS:
    "ANNOUNCEMENT_STATE_RETRIEVING_MERCHANTS",
  ANNOUNCEMENT_STATE_CREATING: "ANNOUNCEMENT_STATE_CREATING",
  ANNOUNCEMENT_STATE_COMPLETE: "ANNOUNCEMENT_STATE_COMPLETE",
  ANNOUNCEMENT_STATE_UPDATE: "ANNOUNCEMENT_STATE_UPDATE",
  ANNOUNCEMENT_STATE_UPDATING: "ANNOUNCEMENT_STATE_UPDATING",
};

export const AnnouncementContentTypeConstants: {
  readonly [key in AnnouncementContentType]: AnnouncementContentType;
} = {
  ANNOUNCEMENT_CONTENT_TYPE_UNSPECIFIED:
    "ANNOUNCEMENT_CONTENT_TYPE_UNSPECIFIED",
  ANNOUNCEMENT_CONTENT_TYPE_STATIC: "ANNOUNCEMENT_CONTENT_TYPE_STATIC",
  ANNOUNCEMENT_CONTENT_TYPE_DYNAMIC: "ANNOUNCEMENT_CONTENT_TYPE_DYNAMIC",
};

export const AnnouncementAudienceSourceTypeConstants: {
  readonly [key in AnnouncementAudienceSourceType]: AnnouncementAudienceSourceType;
} = {
  AUDIENCE_SOURCE_TYPE_UNSPECIFIED: "AUDIENCE_SOURCE_TYPE_UNSPECIFIED",
  AUDIENCE_SOURCE_TYPE_ENUM: "AUDIENCE_SOURCE_TYPE_ENUM",
  AUDIENCE_SOURCE_TYPE_CSV: "AUDIENCE_SOURCE_TYPE_CSV",
};

export const ANNOUNCEMENT_DISPLAY_TIME_FORMAT = "MMM DD, YYYY h:mm a";

export type RecipientType = "AUDIENCE_GROUPS" | "MERCHANT_IDS";

export const RecipientTypeConstants: {
  readonly [key in RecipientType]: RecipientType;
} = {
  AUDIENCE_GROUPS: "AUDIENCE_GROUPS",
  MERCHANT_IDS: "MERCHANT_IDS",
};

export type BDAudience = "ALL" | "MERCHANT_IDS";

export const BDAudienceConstants: {
  readonly [key in BDAudience]: BDAudience;
} = {
  ALL: "ALL",
  MERCHANT_IDS: "MERCHANT_IDS",
};

export const categoryNameMap: {
  readonly [key in AnnouncementCategory]: string;
} = {
  CATEGORY_UNSPECIFIED: ci18n(
    "an announcement category",
    "Unspecified Category"
  ),
  CATEGORY_ACCOUNTSETTINGS: ci18n(
    "an announcement category",
    "Account Settings"
  ),
  CATEGORY_API: ci18n("an announcement category", "API"),
  CATEGORY_INSIGHTS: ci18n("an announcement category", "Insights"),
  CATEGORY_INTELLECTUALPROPERTY: ci18n(
    "an announcement category",
    "Intellectual Property"
  ),
  CATEGORY_LOCALCURRENCY: ci18n("an announcement category", "Local Currency"),
  CATEGORY_LOGISTICS: ci18n("an announcement category", "Logistics"),
  CATEGORY_LOGISTICSPRICING: ci18n(
    "an announcement category",
    "Logistics Pricing"
  ),
  CATEGORY_ORDERS: ci18n("an announcement category", "Orders"),
  CATEGORY_PAYMENTS: ci18n("an announcement category", "Payments"),
  CATEGORY_POLICIESANDTERMS: ci18n(
    "an announcement category",
    "Policies and Terms"
  ),
  CATEGORY_PRODUCTS: ci18n("an announcement category", "Products"),
  CATEGORY_SHIPPINGCARRIERS: ci18n(
    "an announcement category",
    "Shipping Carriers"
  ),
  CATEGORY_TAX: ci18n("an announcement category", "Tax"),
};
export const programNameMap: {
  readonly [key in AnnouncementProgram]: string;
} = {
  PROGRAM_UNSPECIFIED: ci18n("an announcement program", "Unspecified Program"),
  PROGRAM_ADVANCED_LOGISTICS: ci18n(
    "an announcement program",
    "Advanced Logistics Program"
  ),
  PROGRAM_EPC: ci18n("an announcement program", "EPC"),
  PROGRAM_FBW_FBS: ci18n("an announcement program", "FBW / FBS"),
  PROGRAM_MERCHANT_STANDING: ci18n(
    "an announcement program",
    "Merchant Standing"
  ),
  PROGRAM_PARTIAL_REFUNDS: ci18n("an announcement program", "Partial Refunds"),
  PROGRAM_PRODUCT_BOOST: ci18n("an announcement program", "ProductBoost"),
  PROGRAM_RETURNS_PROGRAM: ci18n("an announcement program", "Returns Program"),
  PROGRAM_WISH_EXPRESS: ci18n("an announcement program", "Wish Express"),
  PROGRAM_WISHPOST: ci18n("an announcement program", "WishPost"),
  PROGRAM_MERCHANT_FUNDED_PROMOTIONS: ci18n(
    "an announcement program",
    "Merchant Funded Promotions"
  ),
  PROGRAM_VIDEOS: ci18n("an announcement program", "Videos"),
  PROGRAM_WISH_STANDARDS: ci18n("an announcement program", "Wish Standards"),
};

type CategoryOption = {
  title: string;
  value: AnnouncementCategory;
};

export const categoryOptions: ReadonlyArray<CategoryOption> = [
  {
    title: categoryNameMap.CATEGORY_ACCOUNTSETTINGS,
    value: "CATEGORY_ACCOUNTSETTINGS",
  },
  { title: categoryNameMap.CATEGORY_API, value: "CATEGORY_API" },
  { title: categoryNameMap.CATEGORY_INSIGHTS, value: "CATEGORY_INSIGHTS" },
  {
    title: categoryNameMap.CATEGORY_INTELLECTUALPROPERTY,
    value: "CATEGORY_INTELLECTUALPROPERTY",
  },
  {
    title: categoryNameMap.CATEGORY_LOCALCURRENCY,
    value: "CATEGORY_LOCALCURRENCY",
  },
  { title: categoryNameMap.CATEGORY_LOGISTICS, value: "CATEGORY_LOGISTICS" },
  {
    title: categoryNameMap.CATEGORY_LOGISTICSPRICING,
    value: "CATEGORY_LOGISTICSPRICING",
  },
  { title: categoryNameMap.CATEGORY_ORDERS, value: "CATEGORY_ORDERS" },
  { title: categoryNameMap.CATEGORY_PAYMENTS, value: "CATEGORY_PAYMENTS" },
  {
    title: categoryNameMap.CATEGORY_POLICIESANDTERMS,
    value: "CATEGORY_POLICIESANDTERMS",
  },
  { title: categoryNameMap.CATEGORY_PRODUCTS, value: "CATEGORY_PRODUCTS" },
  {
    title: categoryNameMap.CATEGORY_SHIPPINGCARRIERS,
    value: "CATEGORY_SHIPPINGCARRIERS",
  },
  { title: categoryNameMap.CATEGORY_TAX, value: "CATEGORY_TAX" },
];

type ProgramOption = {
  text: string;
  value: AnnouncementProgram;
};

export const programOptions: ReadonlyArray<ProgramOption> = [
  {
    text: programNameMap.PROGRAM_ADVANCED_LOGISTICS,
    value: "PROGRAM_ADVANCED_LOGISTICS",
  },
  {
    text: programNameMap.PROGRAM_EPC,
    value: "PROGRAM_EPC",
  },
  {
    text: programNameMap.PROGRAM_FBW_FBS,
    value: "PROGRAM_FBW_FBS",
  },
  {
    text: programNameMap.PROGRAM_MERCHANT_STANDING,
    value: "PROGRAM_MERCHANT_STANDING",
  },
  {
    text: programNameMap.PROGRAM_PARTIAL_REFUNDS,
    value: "PROGRAM_PARTIAL_REFUNDS",
  },
  {
    text: programNameMap.PROGRAM_PRODUCT_BOOST,
    value: "PROGRAM_PRODUCT_BOOST",
  },
  {
    text: programNameMap.PROGRAM_RETURNS_PROGRAM,
    value: "PROGRAM_RETURNS_PROGRAM",
  },
  {
    text: programNameMap.PROGRAM_WISH_EXPRESS,
    value: "PROGRAM_WISH_EXPRESS",
  },
  {
    text: programNameMap.PROGRAM_WISHPOST,
    value: "PROGRAM_WISHPOST",
  },
  {
    text: programNameMap.PROGRAM_MERCHANT_FUNDED_PROMOTIONS,
    value: "PROGRAM_MERCHANT_FUNDED_PROMOTIONS",
  },
  {
    text: programNameMap.PROGRAM_VIDEOS,
    value: "PROGRAM_VIDEOS",
  },
  {
    text: programNameMap.PROGRAM_WISH_STANDARDS,
    value: "PROGRAM_WISH_STANDARDS",
  },
];

// announcements from Iris
type PickedAnnouncementCategorySchemaV2 = Pick<
  AnnouncementCategorySchemaV2,
  "text" | "type"
>;
export type PickedAnnouncementV2 = Pick<
  MerchantAnnouncementV2Schema,
  "title" | "id" | "important" | "publishDate" | "program" | "categories"
> & {
  readonly categories: ReadonlyArray<PickedAnnouncementCategorySchemaV2>;
  readonly publishDate: {
    readonly inTimezone: Pick<Datetime, "formatted">;
  };
  readonly program?: Pick<AnnouncementProgramSchemaV2, "text" | "type"> | null;
};
