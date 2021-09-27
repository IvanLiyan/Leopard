/* eslint-disable filenames/match-regex */

import React from "react";

import { observer } from "mobx-react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import defaultBannerImg from "@assets/img/header-illustration.svg";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@toolkit/styling";

export type StoreApprovedBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
  isPreOrderMerchant?: boolean;
};

const StoreApprovedBanner = ({
  style,
  className,
  logParams,
  isPreOrderMerchant = false,
}: StoreApprovedBannerProps) => {
  const {
    promotionStore: { discountedRevShare, durationDays },
  } = useStore();

  const bannerTitle = i`Limited Time Reduced Revenue Share Rate`;
  const bannerBody1 = isPreOrderMerchant
    ? i`Congratulations! Your revenue share has been reduced to ${discountedRevShare}% for ${durationDays} days.`
    : i`Congratulations! Your revenue share has been reduced to ${discountedRevShare}% ` +
      i`for ${durationDays} days as your store is verified by our trusted partners!`;

  const bannerBody2 = isPreOrderMerchant
    ? i`Take advantage of the promotion and start selling today!`
    : i`This regional promotion applies to merchants ` +
      i`that are located in specific countries.`;

  const bannerBody = `${bannerBody1} ${bannerBody2}`;
  const bannerImg = defaultBannerImg;
  const bannerTextColor = palettes.textColors.DarkInk;
  return (
    <SimpleBannerItem
      className={css(style, className)}
      title={bannerTitle}
      body={bannerBody}
      bannerImg={bannerImg}
      logParams={{
        banner_key: "StoreApprovedBanner",
        ...logParams,
      }}
      textColor={bannerTextColor}
    />
  );
};

export default observer(StoreApprovedBanner);
