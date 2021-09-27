import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { SecondaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type IncompleteBoxProps = BaseProps;

const SellerProfileIncompleteBox = (props: IncompleteBoxProps) => {
  const { className, style } = props;
  const styles = useStylesheet();
  const rootCSS = css(styles.root, style, className);

  const illustrationName = "buildingsUnderDome";
  const learnMore = `[${i`Learn more`}](${zendeskURL("360048831574")})`;

  const incompleteBannerTitle = i`Let's continue validating your store to unlock additional features`;
  const incompleteBannerBody =
    i`Finish validating your store to gain access to additional features to help` +
    i` run and grow your store, such as setting up **Tax Settings**,` +
    i` applying to become an **Authentic Brand Seller**, and more.` +
    i` In some cases, your store's impressions may be **restricted**` +
    i` until your store is validated.` +
    i` If you need help validating your store, please visit our guide. ${learnMore}`;

  return (
    <div className={css(rootCSS)}>
      <div className={css(styles.topBanner)}>
        <div className={css(styles.contentText)}>
          <div className={css(styles.title)}>
            <Markdown text={incompleteBannerTitle} />
          </div>
          <div className={css(styles.body)}>
            <Markdown openLinksInNewTab text={incompleteBannerBody} />
          </div>
          <SecondaryButton
            style={styles.actionButtonStyle}
            onClick={() => {
              window.open("/seller-profile-verification");
            }}
            padding="10px 30px"
            text={i`Continue validating`}
          />
        </div>
        <Illustration
          name={illustrationName}
          alt={illustrationName}
          className={css(styles.img)}
        />
      </div>
    </div>
  );
};

export default SellerProfileIncompleteBox;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          borderRadius: 5,
          border: "solid 1px rgba(175, 199, 209, 0.5)",
          backgroundColor: palettes.textColors.White,
        },
        topBanner: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 24px 0px 24px",
        },
        contentText: {
          maxWidth: "67%",
        },
        title: {
          fontSize: 20,
          fontWeight: fonts.weightBold,
          lineHeight: 1.33,
          color: palettes.textColors.Ink,
          marginBottom: 15,
          whiteSpace: "normal",
        },
        body: {
          color: palettes.textColors.Ink,
          fontSize: 16,
          fontWeight: fonts.weightNormal,
          lineHeight: 1.5,
          whiteSpace: "normal",
        },
        img: {
          maxWidth: "100%",
          alignSelf: "flex-end",
        },
        actionButtonStyle: {
          fontSize: 16,
          margin: "10px 0px 16px 0px",
        },
      }),
    []
  );
};
