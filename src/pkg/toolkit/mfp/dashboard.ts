import { Theme } from "@ContextLogic/lego";
import { IllustrationName } from "@merchant/component/core/Illustration";
import {
  CancelMfpCampaign,
  Country,
  Datetime,
  MerchantSchema,
  MfpCampaignCancelInfo,
  MfpCampaignSchema,
  MfpCampaignState,
  MfpServiceMutationsCancelMfpCampaignArgs,
  MfpServiceSchema,
  MfpServiceSchemaCampaignsArgs,
  MfpServiceSchemaCampaignsCountArgs,
  MfpVariationDiscountData,
} from "@schema/types";
import { zendeskURL } from "@toolkit/url";
import gql from "graphql-tag";
import moment from "moment/moment";
import { useMemo } from "react";

// Temporary type until GQL is available
export type UploadVariationInfo = {
  readonly productId: string;
  readonly productName: string;
  readonly variationId: string;
  readonly variationName: string;
  readonly discount: number;
  readonly quantity?: number | null;
};

// Temporary type until GQL is available
export type UploadProductInfo = {
  readonly productId: string;
  readonly productName: string;
  readonly discountMin: number;
  readonly discountMax: number;
  readonly quantity: number;
  readonly variations: ReadonlyArray<UploadVariationInfo>;
};

export type CampaignToolInfo = {
  readonly name: string;
  readonly description?: string;
  readonly footnote?: string;
};

// Get Campaigns Query
export const GET_CAMPAIGNS_QUERY = gql`
  query Dashboard_GetCampaignsQuery(
    $startAtMin: DatetimeInput
    $startAtMax: DatetimeInput
    $endAtMin: DatetimeInput
    $endAtMax: DatetimeInput
    $searchType: MFPCampaignSearchType
    $searchQuery: String
    $states: [MFPCampaignState!]
    $promotionTypes: [MFPCampaignPromotionType!]
    $offset: Int
    $limit: Int
  ) {
    mfp {
      campaigns(
        startAtMin: $startAtMin
        startAtMax: $startAtMax
        endAtMin: $endAtMin
        endAtMax: $endAtMax
        searchType: $searchType
        searchQuery: $searchQuery
        states: $states
        promotionTypes: $promotionTypes
        offset: $offset
        limit: $limit
      ) {
        name
        id
        state
        startTime {
          unix
          dateFmt: formatted(fmt: "MM-dd-YYYY")
          timeFmt: formatted(fmt: "h:mm a zz")
          dateTimeFmt: formatted(fmt: "MM-dd-YYYY, h:mm a")
        }
        endTime {
          unix
          dateFmt: formatted(fmt: "MM-dd-YYYY")
          timeFmt: formatted(fmt: "h:mm a zz")
          dateTimeFmt: formatted(fmt: "MM-dd-YYYY, h:mm a")
        }
        countries {
          code
        }
        cancelInfo {
          reason
        }
        promotionType
        flashSaleDetails {
          productId
          discountPercentage
        }
        discountDetails {
          productId
          discountPercentage
        }
      }
    }
  }
`;

export type PickedCampaign = Pick<
  MfpCampaignSchema,
  "name" | "id" | "state" | "promotionType"
> & {
  readonly cancelInfo?: Pick<MfpCampaignCancelInfo, "reason"> | null;
  readonly startTime: Pick<Datetime, "unix"> & {
    readonly dateFmt: Datetime["formatted"];
    readonly timeFmt: Datetime["formatted"];
    readonly dateTimeFmt: Datetime["formatted"];
  };
  readonly endTime: Pick<Datetime, "unix"> & {
    readonly dateFmt: Datetime["formatted"];
    readonly timeFmt: Datetime["formatted"];
    readonly dateTimeFmt: Datetime["formatted"];
  };
  readonly countries?: ReadonlyArray<Pick<Country, "code">> | null;
  readonly flashSaleDetails?: ReadonlyArray<
    Pick<MfpVariationDiscountData, "productId" | "discountPercentage">
  > | null;
  readonly discountDetails?: ReadonlyArray<
    Pick<MfpVariationDiscountData, "productId" | "discountPercentage">
  > | null;
};

export type GetCampaignsResponse = {
  readonly mfp?: {
    readonly campaigns?: ReadonlyArray<PickedCampaign> | null;
  } | null;
};
export type GetCampaignsRequest = MfpServiceSchemaCampaignsArgs;

export type MfpDashboardContainerInitialData = {
  readonly currentMerchant?: Pick<MerchantSchema, "id"> | null;
  readonly mfp?: Pick<MfpServiceSchema, "campaignsCount"> | null;
};

// Get campaigns count query
export const GET_CAMPAIGNS_COUNT_QUERY = gql`
  query Dashboard_GetCampaignsCountQuery(
    $startAtMin: DatetimeInput
    $startAtMax: DatetimeInput
    $endAtMin: DatetimeInput
    $endAtMax: DatetimeInput
    $searchType: MFPCampaignSearchType
    $searchQuery: String
    $states: [MFPCampaignState!]
    $promotionTypes: [MFPCampaignPromotionType!]
  ) {
    mfp {
      campaignsCount(
        startAtMin: $startAtMin
        startAtMax: $startAtMax
        endAtMin: $endAtMin
        endAtMax: $endAtMax
        searchType: $searchType
        searchQuery: $searchQuery
        states: $states
        promotionTypes: $promotionTypes
      )
    }
  }
`;

export type GetCampaignsCountResponse = {
  readonly mfp?: Pick<MfpServiceSchema, "campaignsCount"> | null;
};

export type GetCampaignsCountRequest = MfpServiceSchemaCampaignsCountArgs;

// Cancel campaign mutation
export const CANCEL_CAMPAIGN_MUTATION = gql`
  mutation Dashboard_CancelCampaignMutation($input: CancelMFPCampaignInput!) {
    mfp {
      cancelMfpCampaign(input: $input) {
        ok
        message
      }
    }
  }
`;

export type CancelCampaignResponse = {
  readonly mfp?: {
    readonly cancelMfpCampaign: Pick<CancelMfpCampaign, "ok" | "message">;
  } | null;
};

export type CancelCampaignRequest = MfpServiceMutationsCancelMfpCampaignArgs;

export type MfpDashboardTab = "active" | "pending" | "history" | "cancelled";

export const isMfpDashboardTab = (arg: any): arg is MfpDashboardTab => {
  const tabsMap: { readonly [T in MfpDashboardTab]: true } = {
    active: true,
    pending: true,
    history: true,
    cancelled: true,
  };
  // cast is safe here since a string can be used as a key for the tab map
  // will just return undefined if it doesn't exist
  if (typeof arg == "string" && tabsMap[arg as MfpDashboardTab]) {
    return true;
  }
  return false;
};

export const useTabSpecificParams = (tab: MfpDashboardTab) =>
  useMemo(() => {
    const nowUnix = moment().unix();
    const tabParams: {
      readonly [T in MfpDashboardTab]: Pick<
        GetCampaignsRequest,
        "states" | "endAtMax" | "endAtMin" | "startAtMin" | "startAtMax"
      >;
    } = {
      active: {
        states: ["APPROVED"],
        endAtMin: {
          unix: nowUnix,
        },
      },
      pending: {
        states: ["PENDING"],
        endAtMin: {
          unix: nowUnix,
        },
      },
      history: {
        states: ["APPROVED", "PENDING"],
        endAtMax: {
          unix: nowUnix,
        },
      },
      cancelled: {
        states: ["CANCELLED"],
      },
    };

    return tabParams[tab];
  }, [tab]);

export type MfpEducationCardType = "HOW_TO_CREATE" | "NEED_MORE_HELP";

export const MfpEducationCardInfoMap: {
  readonly [T in MfpEducationCardType]: {
    readonly illustration: IllustrationName;
    readonly title: string;
    readonly body: string;
    readonly learnMoreLink: string;
  };
} = {
  HOW_TO_CREATE: {
    illustration: "mfpHowToCreatePromotion",
    title: i`How to Create a Promotion`,
    body:
      i`Our promotional tools let you offer great deals on popular ` +
      i`products for varying periods of time.`,
    learnMoreLink: zendeskURL("4419106589083"),
  },
  NEED_MORE_HELP: {
    illustration: "mfpNeedMoreHelp",
    title: i`Need More Help?`,
    body:
      i`Learn about eligibility requirements to build promotions, how ` +
      i`to use this platform and its tools, and how promotions may help your sales.`,
    learnMoreLink: zendeskURL("4419128653595"),
  },
};

export type CampaignStatusLabelState =
  | MfpCampaignState
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED";

export const StatusDisplayMap: {
  readonly [T in CampaignStatusLabelState]: {
    readonly text: string;
    readonly theme: Theme;
  };
} = {
  PENDING: {
    text: i`Pending`,
    theme: `LightGrey`,
  },
  APPROVED: {
    text: i`Approved`,
    theme: `DarkPalaceBlue`,
  },
  CANCELLED: {
    text: i`Cancelled`,
    theme: `Yellow`,
  },
  REJECTED: {
    text: i`Rejected`,
    theme: `Red`,
  },
  ACTIVE: {
    text: i`Active`,
    theme: `LighterCyan`,
  },
  COMPLETED: {
    text: i`Completed`,
    theme: `Grey`,
  },
};

export const getCampaignStatusLabelState = ({
  campaign,
}: {
  readonly campaign: Pick<MfpCampaignSchema, "state"> & {
    readonly startTime: Pick<Datetime, "unix">;
    readonly endTime: Pick<Datetime, "unix">;
    readonly cancelInfo?: Pick<MfpCampaignCancelInfo, "reason"> | null;
  };
}): CampaignStatusLabelState => {
  if (campaign.state == "CANCELLED") {
    return campaign.cancelInfo != null &&
      campaign.cancelInfo.reason == "WISH_CANCELLED_FAILED_DEPENDENCIES"
      ? "REJECTED"
      : "CANCELLED";
  }

  if (campaign.state == "PENDING") {
    return "PENDING";
  }

  const now = moment();
  const endMoment = moment(campaign.endTime.unix * 1000);
  const startMoment = moment(campaign.startTime.unix * 1000);
  if (now.isAfter(endMoment)) {
    return "COMPLETED";
  }

  if (now.isAfter(startMoment)) {
    return "ACTIVE";
  }

  return campaign.state;
};
