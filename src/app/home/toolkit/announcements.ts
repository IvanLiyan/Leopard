import { IllustrationName } from "@core/components/Illustration";
import {
  AnnouncementCategorySchemaV2,
  AnnouncementProgram,
  AnnouncementProgramSchemaV2,
  AnnouncementType,
  Datetime,
  MerchantAnnouncementV2Schema,
  MerchantSchema,
} from "@schema";
import { gql } from "@gql";

export const GET_USER_ANNOUNCEMENTS_V2 = gql(`
  query GetUserAnnouncementsV2_List(
    $offset: Int!
    $limit: Int!
    $announcementType: AnnouncementType!
  ) {
    announcements {
      forUsersV2 {
        list(
          announcementType: $announcementType
          offset: $offset
          limit: $limit
        ) {
          id
          title
          important
          program {
            text
            type
          }
          publishDate {
            inTimezone(identifier: "UTC") {
              formatted(fmt: "MMM d, y")
            }
          }
          categories {
            text
            type
          }
        }
      }
    }
  }
`);

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

export type GetUserAnnouncementsV2ResponseType = {
  readonly announcements: {
    readonly forUsersV2: {
      readonly list: ReadonlyArray<PickedAnnouncementV2> | null;
    };
  };
};

export const GET_USER_ANNOUNCEMENTS_V2_MODAL = gql(`
  query GetUserAnnouncementsV2_Modal(
    $offset: Int!
    $limit: Int!
    $announcementType: AnnouncementType!
  ) {
    announcements {
      forUsersV2 {
        list(
          announcementType: $announcementType
          offset: $offset
          limit: $limit
        ) {
          id
          title
          message
        }
      }
    }
  }
`);

export type GetUserAnnouncementsV2ModalResponseType = {
  readonly announcements: {
    readonly forUsersV2: {
      readonly list: ReadonlyArray<
        Pick<MerchantAnnouncementV2Schema, "id" | "title" | "message">
      > | null;
    };
  };
};

export const AnnouncementTypeConstants: {
  readonly [key in AnnouncementType]: AnnouncementType;
} = {
  ANNOUNCEMENT_TYPE_UNSPECIFIED: "ANNOUNCEMENT_TYPE_UNSPECIFIED",
  ANNOUNCEMENT_TYPE_SYSTEM_UPDATE: "ANNOUNCEMENT_TYPE_SYSTEM_UPDATE",
  ANNOUNCEMENT_TYPE_BD_ANNOUNCEMENT: "ANNOUNCEMENT_TYPE_BD_ANNOUNCEMENT",
};

export const ProgramIdToIllustrationName: {
  readonly [T in AnnouncementProgram]: IllustrationName;
} = {
  PROGRAM_UNSPECIFIED: "wishLogoInk",
  PROGRAM_ADVANCED_LOGISTICS: "announcementBadgeAdvancedLogisticsProgram",
  PROGRAM_EPC: "announcementBadgeEpc",
  PROGRAM_FBW_FBS: "announcementBadgeFbw",
  PROGRAM_MERCHANT_STANDING: "announcementBadgePlatinum",
  PROGRAM_PARTIAL_REFUNDS: "announcementBadgeRefunds",
  PROGRAM_PRODUCT_BOOST: "announcementBadgeProductBoost",
  PROGRAM_RETURNS_PROGRAM: "announcementBadgeReturns",
  PROGRAM_WISH_EXPRESS: "announcementBadgeWishExpressBlueBox",
  PROGRAM_WISHPOST: "announcementBadgeWishPost",
  PROGRAM_MERCHANT_FUNDED_PROMOTIONS:
    "announcementBadgeMerchantFundedPromotions",
  PROGRAM_VIDEOS: "announcementBadgeVideos",
  PROGRAM_WISH_STANDARDS: "announcementBadgeWishStandards",
};

export type OptInStatusResponseType = {
  readonly currentMerchant?: Pick<
    MerchantSchema,
    "isFlatRateShippingOptedIn" | "canAccessFlatRateShippingOptInOptOut"
  > | null;
};
export const GET_OPT_IN_STATUS = gql(`
  query FlatRateShippingSettings_GetOptInStatus {
    currentMerchant {
      isFlatRateShippingOptedIn
      canAccessFlatRateShippingOptInOptOut
    }
  }
`);
