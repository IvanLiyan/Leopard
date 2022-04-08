import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import Illustration from "@merchant/component/core/Illustration";
import { SecondaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type RejectedBoxProps = BaseProps & {
  readonly onReverify: () => unknown;
};

const SellerProfileRejectedBox = (props: RejectedBoxProps) => {
  const { onReverify, className, style } = props;
  const styles = useStylesheet();
  const rootCSS = css(styles.root, style, className);

  const illustrationName = "buildingsUnderDome";
  const learnMoreLink = `[${`Learn more`}](${zendeskURL("360048831574")})`;

  const rejectedBannerTitle = i`Let's try validating your store again`;
  const rejectedBannerBody =
    i`Your store validation request was unsuccessful.` +
    i` Try validating your store again to gain access to additional merchants` +
    i` features. In some cases, your store's impressions may be restricted until` +
    i` your store is validated. If you need help validating your store,` +
    i` please visit our guide. ${learnMoreLink}`;

  return (
    <div className={css(rootCSS)}>
      <div className={css(styles.topBanner)}>
        <div className={css(styles.contentText)}>
          <div className={css(styles.title)}>
            <Markdown text={rejectedBannerTitle} />
          </div>
          <div className={css(styles.body)}>
            <Markdown openLinksInNewTab text={rejectedBannerBody} />
          </div>
          <SecondaryButton
            style={styles.actionButtonStyle}
            onClick={onReverify}
            padding="10px 30px"
            text={i`Validate store again`}
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

export default SellerProfileRejectedBox;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          border: `solid 1px`,
          borderRadius: 5,
          borderColor: palettes.greyScaleColors.DarkGrey,
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
        sideBySide: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "row",
          margin: "32px 24px",
        },
        actionButtonStyle: {
          fontSize: 16,
          margin: "10px 0px 16px 0px",
        },
      }),
    []
  );
};
