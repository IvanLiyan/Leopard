import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import * as icon from "@assets/icons";

/* Merchant Components */
import SellerProfileTodoCard from "@merchant/component/seller-profile-settings/SellerProfileTodoCard";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PendingBoxProps = BaseProps;

const SellerProfilePendingBox = (props: PendingBoxProps) => {
  const { className, style } = props;
  const styles = useStylesheet();
  const rootCSS = css(styles.root, style, className);

  const illustrationName = "blueWishHouse";

  const pendingBannerTitle = i`We are reviewing your documents...`;
  const pendingBannerBody1 =
    i`Your store validation request is being procssed and may` +
    i` take up to 2 business days.`;
  const pendingBannerBody2 =
    i` While you wait, you may start leveraging the following ` +
    i`merchant features to set your store up for success:`;

  return (
    <div className={css(rootCSS)}>
      <div className={css(styles.topBanner)}>
        <div className={css(styles.contentText)}>
          <div className={css(styles.title)}>
            <Markdown text={pendingBannerTitle} />
          </div>
          <div className={css(styles.body)}>
            <Markdown text={pendingBannerBody1} />
            &nbsp;
            <Markdown text={pendingBannerBody2} />
          </div>
        </div>
        <Illustration
          name={illustrationName}
          alt={illustrationName}
          className={css(styles.img)}
        />
      </div>
      {renderTodoCard(styles)}
    </div>
  );
};

export default SellerProfilePendingBox;

const renderTodoCard = (styles: ReturnType<typeof useStylesheet>) => {
  const taxCardTitle = i`Set up your Tax Settings`;
  const taxCardBody =
    i`Configure and edit the jurisdictions where you have ` +
    i`indirect tax obligations while selling and shipping ` +
    i`your products.`;

  const brandSellerCardTitle = i`Become an Authentic Brand Seller`;
  const brandSellerCardBody =
    i`Your authentic branded products will receive a green ` +
    i`"Authentic Brand Product" badge and potential increase ` +
    i`in impressions.`;

  return (
    <div className={css(styles.sideBySide)}>
      <SellerProfileTodoCard
        title={taxCardTitle}
        body={taxCardBody}
        imageUrl={icon.taxCalculator}
        cta={{
          text: i`Continue`,
          onClick: () => {
            window.open("/tax/settings");
          },
        }}
      />
      <div className={css(styles.seperator)} />
      <SellerProfileTodoCard
        title={brandSellerCardTitle}
        body={brandSellerCardBody}
        imageUrl={icon.brandSeller}
        cta={{
          text: i`Continue`,
          onClick: () => {
            window.open("/branded-products");
          },
        }}
      />
    </div>
  );
};

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
        sideBySide: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "row",
          margin: "32px 24px",
        },
        seperator: {
          width: 1,
          margin: "0 24px",
          borderLeft: `2px dotted ${palettes.greyScaleColors.Grey}`,
        },
      }),
    []
  );
};
