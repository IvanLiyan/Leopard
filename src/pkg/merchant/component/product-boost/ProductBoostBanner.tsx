//@flow
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Merchant Stores */
import { useNavigationStore } from "@merchant/stores/NavigationStore";

/* Merchant API */
import {
  BannerContent,
  BannerLocation,
  BannerType,
  recordClickBanner,
} from "@merchant/api/product-boost";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold, weightMedium } from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import productBoostFBWDiscountURL from "@assets/img/product-boost/pb-fbw-illustration-discount-list-page.svg";
import productBoostFBWDiscountSmallURL from "@assets/img/product-boost/pb-fbw-illustration-discount-small.svg";
import productBoostRefundAssuranceURL from "@assets/img/product-boost/seasonal-banner/may_high_demand_banner.svg";
import productBoostRefundAssuranceSmallURL from "@assets/img/product-boost/seasonal-banner/increase_pb_budget.svg";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";
import { RefundAssuranceTooltip } from "@toolkit/product-boost/refund-assurance";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ProductBoostBannerProps = BaseProps & {
  readonly type: BannerType;
  readonly fromPage: BannerLocation;
};

const ProductBoostBanner = (props: ProductBoostBannerProps) => {
  const { type, fromPage, style, className } = props;
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const learnMoreLink = `[${i`Learn more`}](${zendeskURL(
    "360008004474-FBW-US-FAQ"
  )})`;

  const BannerMap: { [banner in BannerType]: BannerContent } = {
    [BannerType.fbwDiscount]: {
      title: i`Enjoy ${50}% off ProductBoost campaigns`,
      text:
        i`Simply send your inventory to the Fulfillment By ` +
        i`Wish (FBW) warehouse and we will pick, pack, and ship ` +
        i`orders for you. Products shipped to any of the FBW ` +
        i`warehouse(s) may qualify for ${50}% ProductBoost discounts. ` +
        i`${learnMoreLink}`,
      banner_img_left: productBoostFBWDiscountSmallURL,
      banner_img_right: productBoostFBWDiscountURL,
      button_url: "/create-shipping-plan?shipmentType=FBW",
      button_text: i`Create a Shipping Plan`,
    },
    [BannerType.refundAssurance]: {
      title: i`Getting protected under ProductBoost Refund Assurance`,
      text: RefundAssuranceTooltip.HEADER_DESC,
      // create campaign page have a side menu, need smaller image to save space.
      banner_img_right:
        fromPage == BannerLocation.createCampaignPage
          ? productBoostRefundAssuranceSmallURL
          : productBoostRefundAssuranceURL,
      button_url: "/product-boost/refund-assurance",
      button_text: i`View Refund Assurance`,
    },
  };

  const title = BannerMap[type].title;
  const markdownText = BannerMap[type].text;
  const bannerImgLeft = BannerMap[type].banner_img_left;
  const bannerImgRight = BannerMap[type].banner_img_right;
  const buttonURL = BannerMap[type].button_url;
  const buttonText = BannerMap[type].button_text;

  return (
    <div className={css(styles.bannerRoot, style, className)}>
      {type != BannerType.refundAssurance && (
        <img
          className={css(styles.bannerImageLeft)}
          draggable={false}
          src={bannerImgLeft}
          alt="productBoostFBWDiscountImg"
        />
      )}
      <div className={css(styles.bannerTitleAndContent)}>
        <div className={css(styles.bannerTitle)}>{title}</div>
        <Markdown
          className={css(styles.bannerContent)}
          text={markdownText}
          openLinksInNewTab
        />
        <PrimaryButton
          className={css(styles.bannerButton)}
          onClick={() => {
            recordClickBanner({
              banner_type: type,
              from_page: fromPage,
            }).call();
            navigationStore.navigate(buttonURL, {
              openInNewTab: true,
            });
          }}
        >
          {buttonText}
        </PrimaryButton>
      </div>
      <img
        className={css(styles.bannerImageRight)}
        draggable={false}
        src={bannerImgRight}
        alt="productBoostFBWDiscountImg"
      />
    </div>
  );
};

export default observer(ProductBoostBanner);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        bannerImageLeft: {
          // Temp one-off banner, will remove later
          // eslint-disable-next-line local-rules/no-complex-styling
          margin: "-5px 0px 0px 30px",
        },
        bannerImageRight: {
          // Temp one-off banner, will remove later
          // eslint-disable-next-line local-rules/no-complex-styling
          margin: "-36px 30px 0px 0px",
        },
        bannerRoot: {
          borderRadius: 10,
          backgroundImage:
            "linear-gradient(176.06deg, #152934 11.6%, #1A4379 99.7%)",
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          flexGrow: 1,
          objectFit: "contain",
        },
        bannerTitle: {
          fontSize: 32,
          fontWeight: weightBold,
          color: palettes.textColors.White,
          lineHeight: 1,
        },
        bannerContent: {
          marginTop: 20,
          fontSize: 17,
          fontWeight: weightMedium,
          lineHeight: "24px",
          color: palettes.textColors.White,
        },
        bannerTitleAndContent: {
          display: "flex",
          flexDirection: "column",
          flex: "1 1 min-content",
          margin: 30,
        },
        bannerButton: {
          maxWidth: 240,
          marginTop: 20,
        },
      }),
    []
  );
};
