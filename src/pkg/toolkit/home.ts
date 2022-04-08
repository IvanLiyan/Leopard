import gql from "graphql-tag";

import {
  Datetime,
  UserSchema,
  CurrencyValue,
  MerchantSchema,
  OnboardingStep,
  OnboardingSchema,
  KycVerificationSchema,
  MerchantPaymentDetail,
  SellerVerificationSchema,
  TermsOfServiceSchema,
  TosServiceSchemaTermsOfServiceArgs,
  MerchantAnnouncementSchema,
  AnnouncementCategorySchema,
  AnnouncementProgramSchema,
  MerchantRatingStats,
} from "@schema/types";

export type PickedOnboardingStep = Pick<
  OnboardingStep,
  | "title"
  | "description"
  | "illustration"
  | "ctaLink"
  | "ctaText"
  | "completed"
  | "name"
>;

type PickedOnboarding = Pick<OnboardingSchema, "numStepsLeft" | "numSteps"> & {
  readonly steps: ReadonlyArray<PickedOnboardingStep> | null;
};

export type PickedSellerVerification = Pick<
  SellerVerificationSchema,
  | "status"
  | "gmvCapReached"
  | "impressionsPaused"
  | "gmvCap"
  | "actionRequired"
  | "isKycVerification"
  | "paymentsBlocked"
  | "numSalesCap"
> & {
  readonly kycVerification: Pick<KycVerificationSchema, "status"> | null;
  readonly gmvCapGracePeriodEndDate: Pick<Datetime, "unix"> | null;
  readonly gmvCap: Pick<CurrencyValue, "display" | "amount"> | null;
};

export type PickedMerchant = Pick<
  MerchantSchema,
  "isStoreMerchant" | "primaryCurrency" | "isFactory"
> & {
  readonly sellerVerification: PickedSellerVerification;
  readonly accountManager: Pick<UserSchema, "name" | "email" | "qqGroupNumber">;
  readonly storeStats: {
    readonly rating?:
      | (Pick<MerchantRatingStats, "averageProductRating"> & {
          readonly startDate: Pick<Datetime, "formatted">;
          readonly endDate: Pick<Datetime, "formatted">;
        })
      | null;
  };
};

type PickedAnnouncementCategorySchema = Pick<
  AnnouncementCategorySchema,
  "text" | "type"
>;
export type PickedAnnouncement = Pick<
  MerchantAnnouncementSchema,
  "message" | "ctaLink" | "ctaText" | "title" | "id" | "important"
> & {
  readonly categories: ReadonlyArray<PickedAnnouncementCategorySchema>;
  readonly createdAt: {
    readonly inTimezone: Pick<Datetime, "formatted">;
  };
  readonly program?: Pick<AnnouncementProgramSchema, "text" | "type"> | null;
};

export type HomeInitialData = {
  readonly currentUser: {
    readonly onboarding: PickedOnboarding | null;
  };
  readonly currentMerchant: PickedMerchant;
  readonly announcements?: {
    readonly forUsers?: ReadonlyArray<PickedAnnouncement> | null;
  };
};

export const GET_BANNER_DATA_QUERY = gql`
  query HomeBanner_GetInitialData(
    $tosType: TermsOfServiceType!
    $version: Int
  ) {
    currentUser {
      utmSource
      backToOnboardingReason
      onboarding {
        completed
      }
    }
    currentMerchant {
      id
      state
      isCnMerchant
    }
    payments {
      currentMerchant {
        paymentCycle
        fullyEnrolledInPaymentCycle
      }
    }
    tos {
      termsOfService(tosType: $tosType, version: $version) {
        canAccept
        releaseDate {
          unix
        }
        merchantTermsOfServiceAgreement {
          state
        }
      }
    }
  }
`;

export type BannerRequestType = TosServiceSchemaTermsOfServiceArgs;

export type BannerInitialData = {
  readonly currentUser?: Pick<
    UserSchema,
    "backToOnboardingReason" | "utmSource"
  > & {
    readonly onboarding?: Pick<OnboardingSchema, "completed">;
  };
  readonly currentMerchant?: Pick<
    MerchantSchema,
    "id" | "state" | "isCnMerchant" | "hasReducedRevShare"
  > | null;
  readonly payments: {
    readonly currentMerchant?: Pick<
      MerchantPaymentDetail,
      "paymentCycle" | "fullyEnrolledInPaymentCycle"
    >;
  };
  readonly tos: {
    readonly termsOfService?: Pick<
      TermsOfServiceSchema,
      "canAccept" | "merchantTermsOfServiceAgreement"
    > & {
      readonly releaseDate?: Pick<Datetime, "mmddyyyy">;
    };
  };
};
