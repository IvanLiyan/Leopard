import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, H4, H5 } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Banner from "../Banner";
import { useTheme } from "@core/stores/ThemeStore";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { Locale } from "@schema";

export type MerchantBlogBannerProps = BaseProps;

const getMerchantBlogLink = (locale: Locale) => {
  switch (locale) {
    case "es":
      return "https://merchantblog.wish.com/es";
    case "it":
      return "https://merchantblog.wish.com/it";
    case "tr":
      return "https://merchantblog.wish.com/tr";
    case "pt":
      return "https://merchantblog.wish.com/pt-br";
    case "de":
      return "https://merchantblog.wish.com/de";
    case "ja":
      return "https://merchantblog.wish.com/ja";
    case "ko":
      return "https://merchantblog.wish.com/ko";
    case "cs":
      return "https://merchantblog.wish.com/cs";
    case "fr":
      return "https://merchantblog.wish.com/fr";
    case "nl":
      return "https://merchantblog.wish.com/nl";
    default:
      return "https://merchantblog.wish.com/";
  }
};

const MerchantBlogBanner: React.FC<MerchantBlogBannerProps> = ({
  className,
  style,
}) => {
  const { primary } = useTheme();
  const { locale } = useLocalizationStore();
  const styles = useStylesheet();
  return (
    <Banner
      className={className}
      style={style}
      title={() => (
        <Layout.FlexRow>
          <H4>Wish Merchant Blog</H4>
          <H5 style={styles.tag}>New!</H5>
        </Layout.FlexRow>
      )}
      body={
        i`Introducing our brand new blog full of resources and tips ` +
        i`to help merchants like you succeed on Wish!`
      }
      bannerImg="bannerMerchantBlog"
      cta={{
        text: i`Check out the blog`,
        href: getMerchantBlogLink(locale),
        style: {
          backgroundColor: primary,
        },
      }}
    />
  );
};

const useStylesheet = () => {
  const { secondary, textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        tag: {
          backgroundColor: secondary,
          borderRadius: 4,
          padding: "2px 10px",
          margin: "0 14px",
          color: textWhite,
        },
      }),
    [secondary, textWhite],
  );
};

export default observer(MerchantBlogBanner);
