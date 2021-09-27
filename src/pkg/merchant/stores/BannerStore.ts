//
//  stores/BannerStore.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 3/7/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//

import { computed, observable, action } from "mobx";

/* Lego Components */
import { BannerItem } from "@ContextLogic/lego";

/* Merchant Components */
import * as banners from "@merchant/component/widget/home-banner/banners";

/* Merchant Stores */
import ApolloStore from "@merchant/stores/ApolloStore";

/* Merchant API */
import { getSellerProfileBanner } from "@merchant/api/seller-profile-verification";

/* Toolkit */
import { call } from "@toolkit/api";
import { log } from "@toolkit/logger";

/* Relative Imports */
import UserStore from "./UserStore";
import ThemeStore from "./ThemeStore";
import ExperimentStore from "./ExperimentStore";
import {
  BannerInitialData,
  BannerRequestType,
  GET_BANNER_DATA_QUERY,
} from "@toolkit/home";

const BannerImpressionLogTable = "HOME_BANNER_IMPRESSION";

export type HomeBannerItem = BannerItem & {
  readonly component: keyof typeof banners;
  readonly componentProps?: any;
  readonly shouldShow?: () => boolean;
};

export default class BannerStore {
  @observable
  bannerItemsLoaded = false;

  @observable
  collectionBoostItems: Array<HomeBannerItem> = [];

  @observable
  productBoostItems: Array<HomeBannerItem> = [];

  @observable
  sellerProfileItems: Array<HomeBannerItem> = [];

  @observable
  initialData: BannerInitialData | undefined | null;

  @observable
  canShowNewNavBanner: boolean | undefined | null;

  @observable
  canShowPlpBanner: boolean | null | undefined;

  @observable
  canShowTosBanner: boolean | null | undefined;

  async fetchBannerItems() {
    await this.fetchBannerFlags();
    await Promise.all([
      this.fetchProductBoostBannerItems(),
      this.fetchSellerProfileItems(),
      this.fetchCollectionBoostBannerItems(),
      this.fetchCanShowNewNavBanner(),
      this.fetchCanShowPlpBanner(),
      this.fetchCanShowTosBanner(),
    ]);
    this.bannerItemsLoaded = true;
    this.logBannerImpressions(this.bannerItems);
  }

  @action
  fetchBannerFlags = async () => {
    const { client } = ApolloStore.instance();
    const { data } = await client.query<BannerInitialData, BannerRequestType>({
      query: GET_BANNER_DATA_QUERY,
      variables: {
        tosType: "MERCHANT",
        version: 5,
      },
    });

    this.initialData = data;
  };

  async fetchCanShowNewNavBanner() {
    const experimentStore = ExperimentStore.instance();
    const optedSelfInState = this.initialData?.currentUser?.uiState.bool;
    const bucket = await experimentStore.getBucketForMerchant(
      "md_new_nav_phase_2"
    );
    const inPhase2 = bucket === "treatment";
    const hasSwitchedNav =
      optedSelfInState || (optedSelfInState == null && inPhase2);
    this.canShowNewNavBanner = !hasSwitchedNav;
  }

  async fetchCanShowPlpBanner() {
    const experimentStore = ExperimentStore.instance();
    const canSeePlp = await experimentStore.getDeciderKeyDecision(
      "product_listing_plan_fe"
    );
    this.canShowPlpBanner = canSeePlp;
  }

  async fetchCanShowTosBanner() {
    const experimentStore = ExperimentStore.instance();
    const canShowTosBanner = await experimentStore.getDeciderKeyDecision(
      "tos_update_2021"
    );
    this.canShowTosBanner = canShowTosBanner;
  }

  @computed
  get bannerItems(): ReadonlyArray<HomeBannerItem> {
    const { initialData } = this;
    const {
      textBlack,
      primary,
      surfaceLightest,
      primaryLight,
    } = ThemeStore.instance().currentAppTheme();
    if (initialData == null) {
      return [];
    }

    const { payments, currentUser, currentMerchant } = initialData;

    if (
      currentUser == null ||
      currentMerchant == null ||
      payments.currentMerchant == null
    ) {
      return [];
    }

    const { currentMerchant: paymentDetails } = payments;
    const {
      utmSource,
      onboarding,
      hasSeenFbwTos,
      backToOnboardingReason,
      gating: { showSizeChartBanner },
    } = currentUser;
    const {
      isCnMerchant,
      canAccessPriceDrop,
      hasReducedRevShare,
      canAccessEarlyPayment,
      hasActivePriceDropOffers,
      canAccessRestrictedProduct,
    } = currentMerchant;

    const termsOfServiceData = initialData.tos?.termsOfService;
    const shouldShowTosBanner =
      termsOfServiceData?.canAccept != null &&
      termsOfServiceData?.canAccept &&
      termsOfServiceData?.merchantTermsOfServiceAgreement?.state != "AGREED";
    const tosReleaseDate = termsOfServiceData?.releaseDate;
    const onboardingCompleted = onboarding?.completed;
    if (onboardingCompleted && currentMerchant.state === "PENDING") {
      return [
        {
          id: "OnboardingReviewHeader",
          component: "OnboardingReviewHeader",
          shouldShow: () => true,
          background: surfaceLightest,
          componentProps: {},
        },
      ];
    }

    if (
      !onboardingCompleted &&
      backToOnboardingReason === "DORMANT" &&
      currentMerchant.state === "PENDING"
    ) {
      return [
        {
          id: "BackToOnboardingBanner",
          component: "BackToOnboardingBanner",
          shouldShow: () => true,
          background: surfaceLightest,
          componentProps: {},
        },
      ];
    }

    return [
      {
        id: "NewNavBanner",
        component: "NewNavBanner" as HomeBannerItem["component"],
        shouldShow: () => this.canShowNewNavBanner || false,
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "TermsUpdateBanner",
        component: "TermsUpdateBanner" as HomeBannerItem["component"],
        shouldShow: () =>
          this.canShowTosBanner != null &&
          this.canShowTosBanner &&
          shouldShowTosBanner,
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
          releaseDate: tosReleaseDate,
        },
      },
      {
        id: "ProductListingPlanBanner",
        component: "ProductListingPlanBanner" as HomeBannerItem["component"],
        shouldShow: () => this.canShowPlpBanner || false,
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "DemoVideosBanner",
        component: "DemoVideosBanner" as HomeBannerItem["component"],
        shouldShow: () => true,
        background: textBlack,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "CustomerServiceProgramBanner",
        component: "CustomerServiceProgramBanner" as HomeBannerItem["component"],
        shouldShow: () => true,
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "RestrictedProductBanner",
        component: "RestrictedProductBanner" as HomeBannerItem["component"],
        shouldShow: () => canAccessRestrictedProduct,
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      ...this.sellerProfileItems,
      {
        id: "SizeChartBanner",
        component: "SizeChartBanner" as HomeBannerItem["component"],
        shouldShow: () => showSizeChartBanner,
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "EarlyPaymentBanner",
        component: "EarlyPaymentBanner" as HomeBannerItem["component"],
        shouldShow: () => true,
        background: surfaceLightest,
        componentProps: {
          hasPolicy: canAccessEarlyPayment,
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "StoreApprovedBanner",
        component: "StoreApprovedBanner" as HomeBannerItem["component"],
        shouldShow: () => hasReducedRevShare,
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
          isPreOrderMerchant: utmSource === "preorder_email",
        },
      },
      ...this.productBoostItems,
      {
        id: "NonCNProductUploadBanner",
        component: "NonCNProductUploadBanner" as HomeBannerItem["component"],
        shouldShow: () => !isCnMerchant,
        background: "#1d4bea",
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "PriceDropBanner",
        component: "PriceDropBanner" as HomeBannerItem["component"],
        shouldShow: () => canAccessPriceDrop && hasActivePriceDropOffers,
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "PriceDropMarketingCampaignBanner",
        component: "PriceDropMarketingCampaignBanner" as HomeBannerItem["component"],
        shouldShow: () => canAccessPriceDrop && !isCnMerchant,
        background: primary,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "FBSIntroductionBanner",
        component: "FBSIntroductionBanner" as HomeBannerItem["component"],
        shouldShow: () => true,
        background: primary,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "ProductUploadBanner",
        component: "ProductUploadBanner" as HomeBannerItem["component"],
        shouldShow: () => isCnMerchant && currentMerchant.state === "APPROVED",
        background: primaryLight,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "FBWSignupBanner",
        component: "FBWSignupBanner" as HomeBannerItem["component"],
        shouldShow: () =>
          !hasSeenFbwTos && currentMerchant.state === "APPROVED",
        background: "#cef2fd",
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "WeeklyDisbUpgradeBanner",
        component: "WeeklyDisbUpgradeBanner" as HomeBannerItem["component"],
        shouldShow: () =>
          paymentDetails.fullyEnrolledInPaymentCycle &&
          paymentDetails.paymentCycle === "WEEKLY",
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      {
        id: "WeeklyDisbRequiredUpdateBanner",
        component: "WeeklyDisbRequiredUpdateBanner" as HomeBannerItem["component"],
        shouldShow: () =>
          !paymentDetails.fullyEnrolledInPaymentCycle &&
          paymentDetails.paymentCycle === "WEEKLY",
        background: surfaceLightest,
        componentProps: {
          logParams: {
            merchant_id: currentMerchant.id,
          },
        },
      },
      ...this.collectionBoostItems,
    ].filter((_) => _.shouldShow == undefined || _.shouldShow());
  }

  @action
  async logBannerImpressions(banners: ReadonlyArray<HomeBannerItem>) {
    banners.forEach((banner) => {
      const { componentProps, id, component } = banner;
      const logParams = {
        id,
        component,
        ...componentProps?.logParams,
      };
      log(BannerImpressionLogTable, logParams);
    });
  }

  @action
  fetchProductBoostBannerItems = async () => {
    const resp = await call("product-boost/get-home-page-params", {
      params_type: "banner",
    });
    if (resp.code !== 0) {
      return;
    }

    const { loggedInMerchantUser } = UserStore.instance();
    const { surfaceLightest } = ThemeStore.instance().currentAppTheme();
    const productBoostParams = resp.data.product_boost_params;
    // Load Refund Assurance Banner
    this.productBoostItems.push({
      id: "ProductBoostRefundAssuranceBanner",
      component: "ProductBoostRefundAssuranceBanner",
      shouldShow: () =>
        productBoostParams.refund_assurance.show_refund_assurance_banner ||
        false,
      background: surfaceLightest,
      componentProps: {
        logParams: {
          merchant_id: this.merchantId,
        },
      },
    });

    // Load PB FBW Incentive Banner
    this.productBoostItems.push({
      id: "ProductBoostFBWIncentiveCampaignBanner",
      component: "ProductBoostFBWIncentiveCampaignBanner",
      shouldShow: () => productBoostParams.show_fbw_incentive_banner || false,
      background: "#376EEE",
      componentProps: {
        logParams: {
          merchant_id: this.merchantId,
        },
      },
    });

    // Load PB Promo Banner
    const promoMessageDict = productBoostParams.promo_message;
    this.productBoostItems.push({
      id: "ProductBoostPromoBanner",
      component: "ProductBoostPromoBanner",
      shouldShow: () => {
        return (
          loggedInMerchantUser.merchant_state === 2 &&
          !(
            productBoostParams.refund_assurance.show_refund_assurance_banner &&
            Object.keys(promoMessageDict).length == 0
          )
        );
      },
      background: promoMessageDict.background_color || surfaceLightest,
      componentProps: {
        promoMessage:
          Object.keys(promoMessageDict).length > 0 && promoMessageDict,
        logParams: {
          merchant_id: this.merchantId,
          promotion_id: promoMessageDict.promotion_id || "",
        },
      },
    });

    // Load PB Automated Campaign Banners
    // if you find this please fix the any types (legacy)
    productBoostParams.automated_campaigns.forEach((campaign: any) => {
      this.productBoostItems.push({
        id: campaign.campaign_id,
        component: "ProductBoostAutomatedCampaignBanner",
        shouldShow: () => true,
        background: "#cef2fd",
        componentProps: {
          campaign,
          logParams: {
            merchant_id: this.merchantId,
          },
        },
      });
    });
  };

  @action
  fetchCollectionBoostBannerItems = async () => {
    const resp = await call(
      "collections-boost/get-home-page-banner-params",
      {}
    );
    if (resp.code !== 0) {
      return;
    }

    this.collectionBoostItems.push({
      id: "CollectionBoostPromoBanner",
      component: "CollectionBoostPromoBanner" as HomeBannerItem["component"],
      shouldShow: () => resp.data.show_promotion_banner,
      background: "#cef2fd",
    });
  };

  @action
  fetchSellerProfileItems = async () => {
    const { surfaceLightest } = ThemeStore.instance().currentAppTheme();
    const resp = await getSellerProfileBanner({}).call();
    if (resp.code !== 0) {
      return;
    }
    const { data } = resp;
    if (data == null) {
      return;
    }

    const { body, title } = data;

    if (!title || !body) {
      return;
    }

    this.sellerProfileItems.push({
      id: "SellerProfileBanner",
      component: "SellerProfileBanner",
      shouldShow: () => true,
      background: surfaceLightest,
      componentProps: {
        title,
        body,
        logParams: {
          merchant_id: this.merchantId,
        },
      },
    });
  };

  @computed
  get merchantId(): string | null | undefined {
    const { merchantId } = UserStore.instance();
    return merchantId;
  }
}
