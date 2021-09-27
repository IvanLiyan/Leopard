import React, { useMemo } from "react";

/* Lego Components */
import { SimpleBannerItem } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { useTheme } from "@merchant/stores/ThemeStore";
import { productUploadBannerImage } from "@assets/illustrations";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { css } from "@toolkit/styling";
import { StyleSheet } from "aphrodite";

export type CollectionBoostPromoBannerProps = BaseProps & {
  readonly logParams: {
    [field: string]: string;
  };
};

const CollectionBoostPromoBanner = (props: CollectionBoostPromoBannerProps) => {
  const { logParams } = props;
  const styles = useStylesheet();
  const { primary } = useTheme();
  const learnMoreLink = `[${i`Learn more`}](${zendeskURL("360052936574")})`;
  const markdownText: string =
    i`To help you maximize your products’ visibility on Wish, we recently ` +
    i`launched CollectionBoost, a new program that allows you to create and ` +
    i`boost a customized collection of products to be showcased in premium ` +
    i`locations on users’ search feeds. ${learnMoreLink}`;
  const bodyText = () => {
    return (
      <Markdown
        className={css(styles.markdownText)}
        text={markdownText}
        openLinksInNewTab
      />
    );
  };
  return (
    <SimpleBannerItem
      title={i`Introducing CollectionBoost`}
      body={bodyText}
      bannerImg={productUploadBannerImage}
      cta={{
        text: i`Create a Collection`,
        href: "/collection-boost/edit-collection/",
        style: {
          backgroundColor: primary,
        },
      }}
      logParams={{
        banner_key: "CollectionBoostPromoBanner",
        ...logParams,
      }}
    />
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        markdownText: {
          fontSize: 16,
          lineHeight: 1.4,
        },
      }),
    []
  );
};

export default CollectionBoostPromoBanner;
