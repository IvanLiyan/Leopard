import { gql } from "@gql";

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
  MerchantAnnouncementSchema,
  AnnouncementCategorySchema,
  AnnouncementProgramSchema,
  RatingPerformanceStats,
  LedgerAccountBalance,
  MerchantListingFeeHub,
} from "@schema";

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
      | (Pick<RatingPerformanceStats, "averageProductRating"> & {
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

export const GET_HOME_INITIAL_DATA = gql(`
  query Home_GetInitialData {
    announcements {
      forUsers(announcementType: SYSTEM_UPDATE, limit: 5) {
        id
        ctaText
        ctaLink
        title
        important
        program {
          text
          type
        }
        createdAt {
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
    currentUser {
      onboarding {
        steps(completed: false) {
          title
          description
          illustration
          ctaText
          ctaLink
          name
        }
        numStepsLeft
        numSteps
      }
    }
    currentMerchant {
      sellerVerification {
        status
        kycVerification {
          status
        }
        isKycVerification
        gmvCapReached
        impressionsPaused
        paymentsBlocked
        gmvCap {
          display
          amount
        }
        gmvCapGracePeriodEndDate {
          unix
        }
        numSalesCap
        actionRequired
      }
      storeStats {
        rating {
          averageProductRating
          startDate {
            formatted(fmt: "%m/%d")
          }
          endDate {
            formatted(fmt: "%m/%d")
          }
        }
      }
      isStoreMerchant
      isFactory
      primaryCurrency
      accountManager {
        name
        email
        qqGroupNumber
      } 
    }
  }
`);

export type HomeInitialData = {
  readonly currentUser: {
    readonly onboarding: PickedOnboarding | null;
  };
  readonly currentMerchant: PickedMerchant;
  readonly announcements?: {
    readonly forUsers?: ReadonlyArray<PickedAnnouncement> | null;
  };
};

export const GET_BANNER_DATA_QUERY = gql(`
  query HomeBanner_GetInitialData {
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
      allowMfp
    }
    payments {
      currentMerchant {
        paymentCycle
        fullyEnrolledInPaymentCycle
      }
    }
  }
`);

export const ACCOUNT_BALANCE_QUERY = gql(`
  query PlusPayments_GetAccountBalance($currency: PaymentCurrencyCode!) {
    payments {
      paymentInfo {
        showLedgerUi
        ledgerAccountBalances {
          amount
          currency
          balanceType
        }
      }
      currentMerchant {
        confirmedAccountBalance: accountBalance(
          currency: $currency
          balanceType: CONFIRMED
        ) {
          display
        }
        pendingAccountBalance: accountBalance(
          currency: $currency
          balanceType: PENDING
        ) {
          display
          amount
        }
      }
    }
  }
`);

export type AccountBalanceResponseData = {
  readonly payments?: {
    readonly paymentInfo: Pick<MerchantPaymentDetail, "showLedgerUi"> & {
      readonly ledgerAccountBalances: ReadonlyArray<
        Pick<LedgerAccountBalance, "balanceType" | "currency" | "amount">
      >;
    };
    readonly currentMerchant?: {
      readonly confirmedAccountBalance?: Pick<CurrencyValue, "display"> | null;
      readonly pendingAccountBalance?: Pick<
        CurrencyValue,
        "display" | "amount"
      > | null;
    } | null;
  } | null;
};

export type BannerInitialData = {
  readonly currentUser?: Pick<
    UserSchema,
    "backToOnboardingReason" | "utmSource"
  > & {
    readonly onboarding?: Pick<OnboardingSchema, "completed">;
  };
  readonly currentMerchant?: Pick<
    MerchantSchema,
    "id" | "state" | "isCnMerchant" | "hasReducedRevShare" | "allowMfp"
  > | null;
  readonly payments: {
    readonly currentMerchant?: Pick<
      MerchantPaymentDetail,
      "paymentCycle" | "fullyEnrolledInPaymentCycle"
    >;
  };
};

export const GET_ORDERS_AND_ANNOUNCEMENTS_QUERY = gql(`
  query MerchantHome_GetOrdersAndAnnouncements {
    currentMerchant {
      storeStats {
        totalGmv {
          amount
        }
      }
    }
    announcements {
      forUsers(announcementType: BD_ANNOUNCEMENT) {
        message
        ctaText
        ctaLink
        title
      }
    }
  }
`);

export type GetOrdersAndAnnouncements = {
  readonly currentMerchant?: {
    readonly storeStats?: {
      readonly totalGmv: Pick<CurrencyValue, "amount">;
    };
  };
  readonly announcements?: {
    readonly forUsers?: ReadonlyArray<
      Pick<
        MerchantAnnouncementSchema,
        "message" | "ctaLink" | "ctaText" | "title"
      >
    >;
  };
};

export const HOME_LISTING_FEE_DATA_QUERY = gql(`
  query HomeListingFeeDataQuery {
    currentMerchant {
      merchantListingFee {
        latestListingFeeDetails{
          latestItems
        }
        currentCycleListingFeeDetails{
          currentBasedWssTierLevel
          currentBasedWssTierName
          currentFreeThreshold
          currentItemsOverThreshold
          currentUnitPrice {
              amount
              currencyCode
          }
          currentFeeToPay{
              amount
              currencyCode
          }
          currentCyclePayTime{
              formatted(fmt: "MM/d/yy")
              __typename
          }
        }
      }
    }
  }
`);

export type HomeListingFeeDataResponse = {
  readonly currentMerchant: {
    readonly merchantListingFee: Maybe<MerchantListingFeeHub>;
  };
};
