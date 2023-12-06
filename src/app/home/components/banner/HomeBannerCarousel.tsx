import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  BannerItem,
  HeroBanner,
  Layout,
  LoadingIndicator,
} from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { BannerInitialData, GET_BANNER_DATA_QUERY } from "@home/toolkit/home";
import { useQuery } from "@apollo/client";
import { useRequest } from "@core/toolkit/restApi";
import { GetHomePageBannerResult } from "@home/toolkit/product-boost";
import { GetHomePageModalParams } from "@home/toolkit/product-boost";
import { PB_GET_HOME_PAGE_PARAMS_ENDPOINT } from "@home/toolkit/product-boost";
import {
  GetSellerProfileBannerResult,
  SELLER_PROFILE_BANNER_ENDPOINT,
} from "@home/toolkit/banner";
import moment from "moment";
import { LogData, log } from "@core/toolkit/logger";
import ProductBoostPromoBanner from "./banners/ProductBoostPromoBanner";
import ProductBoostAutomatedCampaignBanner from "./banners/ProductBoostAutomatedCampaignBanner";
import SellerProfileBanner from "./banners/SellerProfileBanner";
import WishClipsBanner from "./banners/WishClipsBanner";
import ProductListingFeesBanner from "./banners/ProductListingFeesBanner";
import MfpBanner from "./banners/MfpBanner";
import MerchantBlogBanner from "./banners/MerchantBlogBanner";
import CustomerServiceProgramBanner from "./banners/CustomerServiceProgramBanner";
import WeeklyDisbUpgradeBanner from "./banners/WeeklyDisbUpgradeBanner";
import OnboardingReviewBanner from "./banners/OnboardingReviewBanner";

export type HomeBannerProps = BaseProps;

const HomeBannerCarousel = (props: HomeBannerProps) => {
  const { className, style } = props;
  const styles = useStylesheet();
  const { banners, isLoading } = useBanners();

  const [hasLoggedBannerImpressions, setHasLoggedBannerImpressions] =
    useState(false);
  useEffect(() => {
    if (hasLoggedBannerImpressions || isLoading) {
      return;
    }

    setHasLoggedBannerImpressions(true);
    banners.forEach((banner) => {
      const { id, logParams } = banner;
      const logData: LogData = {
        id,
        component: id,
        ...logParams,
      };
      // We can dispatch these requests without awaiting the result because
      // we don't need the result
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      log("HOME_BANNER_IMPRESSION", logData);
    });
  }, [hasLoggedBannerImpressions, banners, isLoading]);

  if (isLoading) {
    return (
      <Layout.FlexRow
        style={styles.loadingIndicator}
        alignItems="center"
        justifyContent="center"
      >
        <LoadingIndicator />
      </Layout.FlexRow>
    );
  }

  return (
    <HeroBanner
      className={css(styles.root, className, style)}
      contentMarginX={62}
      autoScrollIntervalSecs={10}
    >
      {banners.map((item) => {
        const { component } = item;
        return (
          <HeroBanner.Item
            key={item.id}
            id={item.id}
            background={item.background}
          >
            {component}
          </HeroBanner.Item>
        );
      })}
    </HeroBanner>
  );
};

export default observer(HomeBannerCarousel);

const useStylesheet = () => {
  const { textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          // eslint-disable-next-line local-rules/no-frozen-width
          width: "100%",
          flexShrink: 0,
        },
        loadingIndicator: {
          height: 233,
          backgroundColor: textWhite,
        },
      }),
    [textWhite],
  );
};

type HomeBannerItem = BannerItem & {
  readonly component: React.ReactNode;
  readonly logParams?: LogData;
};

type HomeBannerItemWithConditional = HomeBannerItem & {
  readonly shouldShow?: () => boolean;
  readonly deprecateAfter?: number;
};

const useBanners = (): {
  readonly banners: ReadonlyArray<HomeBannerItem>;
  readonly isLoading: boolean;
} => {
  const { surfaceLightest, lightBlueSurface } = useTheme();

  const { data: initialData, loading: isLoadingInitialData } =
    useQuery<BannerInitialData>(GET_BANNER_DATA_QUERY);

  const { data: pbBannerData, isLoading: isLoadingPbBannerData } = useRequest<
    GetHomePageBannerResult,
    GetHomePageModalParams
  >({
    url: PB_GET_HOME_PAGE_PARAMS_ENDPOINT,
    body: {
      params_type: "banner",
    },
  });

  const {
    data: sellerProfileBannerData,
    isLoading: isLoadingSellerProfileBannerData,
  } = useRequest<GetSellerProfileBannerResult>({
    url: SELLER_PROFILE_BANNER_ENDPOINT,
    body: {},
  });

  const isLoading =
    isLoadingInitialData ||
    isLoadingPbBannerData ||
    isLoadingSellerProfileBannerData;

  if (isLoading) {
    return {
      isLoading: true,
      banners: [],
    };
  }

  const pbBannerItems: ReadonlyArray<HomeBannerItemWithConditional> = [
    {
      id: "ProductBoostPromoBanner",
      component: (
        <ProductBoostPromoBanner
          promoMessage={
            pbBannerData?.promo_message != null &&
            Object.keys(pbBannerData?.promo_message ?? {}).length > 0
              ? pbBannerData.promo_message
              : undefined
          }
        />
      ),
      shouldShow: () => {
        return !(
          pbBannerData?.refund_assurance?.show_refund_assurance_banner &&
          Object.keys(pbBannerData?.promo_message ?? {}).length == 0
        );
      },
      background:
        pbBannerData?.promo_message?.background_color || surfaceLightest,
      logParams: {
        merchant_id: initialData?.currentMerchant?.id,
        promotion_id: pbBannerData?.promo_message?.promotion_id || "",
      },
    },
    ...(pbBannerData?.automated_campaigns ?? []).map((campaign) => ({
      id: campaign.campaign_id,
      component: <ProductBoostAutomatedCampaignBanner campaign={campaign} />,
      shouldShow: () => true,
      background: "#cef2fd",
    })),
  ];

  const sellerProfileItems: ReadonlyArray<HomeBannerItemWithConditional> =
    sellerProfileBannerData?.body == null ||
    sellerProfileBannerData?.title == null
      ? []
      : [
          {
            id: "SellerProfileBanner",
            component: (
              <SellerProfileBanner
                title={sellerProfileBannerData.title}
                body={sellerProfileBannerData.body}
              />
            ),
            shouldShow: () => true,
            background: surfaceLightest,
            logParams: {
              merchant_id: initialData?.currentMerchant?.id,
            },
          },
        ];

  if (initialData == null) {
    return {
      isLoading: false,
      banners: [],
    };
  }

  const { payments, currentUser, currentMerchant } = initialData;

  if (
    currentUser == null ||
    currentMerchant == null ||
    payments.currentMerchant == null
  ) {
    return {
      isLoading: false,
      banners: [],
    };
  }

  const { currentMerchant: paymentDetails } = payments;
  const { onboarding, backToOnboardingReason } = currentUser;
  const { isCnMerchant } = currentMerchant;

  const shouldShowMerchantBlogBanner = !isCnMerchant;

  const shouldShowMfpBanner = initialData?.currentMerchant?.allowMfp || false;

  const onboardingCompleted = onboarding?.completed;

  const bannerItems: ReadonlyArray<HomeBannerItemWithConditional> =
    onboardingCompleted && currentMerchant.state === "PENDING"
      ? [
          {
            id: "OnboardingReviewHeader",
            component: <OnboardingReviewBanner />,
            shouldShow: () => true,
            background: surfaceLightest,
          },
        ]
      : !onboardingCompleted &&
        backToOnboardingReason === "DORMANT" &&
        currentMerchant.state === "PENDING"
      ? [
          {
            id: "BackToOnboardingBanner",
            component: "BackToOnboardingBanner",
            shouldShow: () => true,
            background: surfaceLightest,
          },
        ]
      : [
          {
            id: "ProductListingFeesBanner",
            component: <ProductListingFeesBanner />,
            shouldShow: () => true,
            background: surfaceLightest,
            logParams: {
              merchant_id: currentMerchant.id,
            },
          },
          {
            id: "WishClipsBanner",
            component: <WishClipsBanner />,
            shouldShow: () => true,
            background: surfaceLightest,
            logParams: {
              merchant_id: currentMerchant.id,
            },
          },
          {
            id: "MfpBanner",
            component: <MfpBanner />,
            shouldShow: () => shouldShowMfpBanner,
            background: surfaceLightest,
            logParams: {
              merchant_id: currentMerchant.id,
            },
          },
          {
            id: "MerchantBlogBanner",
            component: <MerchantBlogBanner />,
            shouldShow: () => shouldShowMerchantBlogBanner,
            background: lightBlueSurface,
            logParams: {
              merchant_id: currentMerchant.id,
            },
          },
          {
            id: "CustomerServiceProgramBanner",
            component: <CustomerServiceProgramBanner />,
            shouldShow: () => true,
            background: surfaceLightest,
            logParams: {
              merchant_id: currentMerchant.id,
            },
          },
          ...sellerProfileItems,
          ...pbBannerItems,
          {
            id: "WeeklyDisbUpgradeBanner",
            component: <WeeklyDisbUpgradeBanner />,
            shouldShow: () =>
              (paymentDetails.fullyEnrolledInPaymentCycle &&
                paymentDetails.paymentCycle === "WEEKLY") ||
              false,
            background: surfaceLightest,
            logParams: {
              merchant_id: currentMerchant.id,
            },
          },
        ];

  return {
    isLoading: false,
    banners: bannerItems
      .filter((_) => _.shouldShow == undefined || _.shouldShow())
      .filter(
        (_) =>
          _.deprecateAfter == undefined || moment().unix() <= _.deprecateAfter,
      )
      .map(
        // used to pull extra params out of the banner so they don't end up in
        // the DOM
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ shouldShow, deprecateAfter, ...bannerWithoutConditionals }) =>
          bannerWithoutConditionals,
      ),
  };
};
