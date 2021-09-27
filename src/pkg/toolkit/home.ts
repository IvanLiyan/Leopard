import gql from "graphql-tag";

import {
  Datetime,
  UserSchema,
  CurrencyValue,
  MerchantSchema,
  OnboardingStep,
  UserGateSchema,
  OnboardingSchema,
  KycVerificationSchema,
  MerchantPaymentDetail,
  SellerVerificationSchema,
  UiStateSchema,
  TermsOfServiceSchema,
  TosServiceSchemaTermsOfServiceArgs,
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
> & {
  readonly kycVerification: Pick<KycVerificationSchema, "status"> | null;
  readonly gmvCapGracePeriodEndDate: Pick<Datetime, "unix"> | null;
  readonly gmvCap: Pick<CurrencyValue, "display"> | null;
};

type PickedMerchant = Pick<
  MerchantSchema,
  "isStoreMerchant" | "primaryCurrency" | "isMerchantPlus" | "standing"
> & {
  readonly sellerVerification: PickedSellerVerification;
  readonly accountManager: Pick<UserSchema, "name" | "email" | "qqGroupNumber">;
};

export type HomeInitialData = {
  readonly currentUser: {
    readonly onboarding: PickedOnboarding | null;
  };
  readonly currentMerchant: PickedMerchant;
};

export const GET_BANNER_DATA_QUERY = gql`
  query HomeBanner_GetInitialData(
    $tosType: TermsOfServiceType!
    $version: Int
  ) {
    currentUser {
      utmSource
      hasSeenFbwTos
      backToOnboardingReason
      gating {
        showSizeChartBanner: isAllowed(name: "product_details_page")
      }
      onboarding {
        completed
      }
      uiState {
        bool(state: PREFERS_NEW_NAV)
      }
    }
    currentMerchant {
      id
      state
      isCnMerchant
      canAccessPriceDrop
      canAccessEarlyPayment
      canAccessRestrictedProduct
      hasActivePriceDropOffers
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

export type BannerRequestType = Pick<
  TosServiceSchemaTermsOfServiceArgs,
  "tosType" | "version"
>;

export type BannerInitialData = {
  readonly currentUser?: Pick<
    UserSchema,
    "hasSeenFbwTos" | "backToOnboardingReason" | "utmSource"
  > & {
    readonly uiState: Pick<UiStateSchema, "bool">;
    readonly gating: {
      readonly showSizeChartBanner: UserGateSchema["isAllowed"];
    };
    readonly onboarding?: Pick<OnboardingSchema, "completed">;
  };
  readonly currentMerchant?: Pick<
    MerchantSchema,
    | "id"
    | "state"
    | "isCnMerchant"
    | "hasReducedRevShare"
    | "canAccessPriceDrop"
    | "canAccessEarlyPayment"
    | "canAccessRestrictedProduct"
    | "hasActivePriceDropOffers"
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
