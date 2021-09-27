import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Merchant Stores */
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Merchant API */
import {
  BannerLocation,
  BannerType,
  recordClickBanner,
} from "@merchant/api/product-boost";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import productBoostFBWDiscountURL from "@assets/img/product-boost/pb-fbw-illustration-discount.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ProductBoostFBWIncentiveCampaignBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const ProductBoostFBWIncentiveCampaignBanner = (
  props: ProductBoostFBWIncentiveCampaignBannerProps,
) => {
  const { logParams } = props;
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const learnMoreLink = `[${i`Learn more`}](${zendeskURL(
    "360008004474-FBW-US-FAQ",
  )})`;

  const title = i`Enjoy ${50}% off ProductBoost campaigns!`;
  const markdownText =
    i`Simply send your inventory to the Fulfillment By Wish (FBW) warehouse ` +
    i`and we will pick, pack, and ship orders for you. Products shipped to ` +
    i`any of the FBW warehouse(s) may qualify for ${50}% ProductBoost ` +
    i`discounts. ${learnMoreLink}`;
  const bannerImg = productBoostFBWDiscountURL;

  const bodyText = () => {
    return (
      <Markdown
        className={css(styles.markdownText)}
        text={markdownText}
        openLinksInNewTab
      />
    );
  };

  const titleText = () => {
    return <Markdown className={css(styles.bannerTitle)} text={title} />;
  };

  return (
    <SimpleBannerItem
      title={titleText}
      body={bodyText}
      bannerImg={bannerImg}
      cta={{
        text: i`Create a shipping plan`,
        style: {
          backgroundColor: palettes.yellows.DarkYellow,
          color: palettes.textColors.Ink,
        },
        onClick: () => {
          recordClickBanner({
            banner_type: BannerType.fbwDiscount,
            from_page: BannerLocation.homePage,
          }).call();
          navigationStore.navigate("/create-shipping-plan?shipmentType=FBW", {
            openInNewTab: true,
          });
        },
      }}
      logParams={{
        banner_key: "ProductBoostFBWIncentiveCampaignBanner",
        ...logParams,
      }}
      textColor={palettes.textColors.White}
    />
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        bannerTitle: {
          fontSize: 23,
        },
        markdownText: {
          fontSize: 16,
          lineHeight: "24px",
        },
      }),
    [],
  );
};

export default observer(ProductBoostFBWIncentiveCampaignBanner);
