import React, { useMemo } from "react";
// import { useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
// import { Illustration } from "@merchant/component/core";
// import { Accordion } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import * as icon from "@assets/icons";

/* Merchant Components */
import SellerProfileTodoCard from "@merchant/component/seller-profile-settings/SellerProfileTodoCard";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* SVGs */
import congratsImageURL from "@assets/img/potential-unlocked-banner.svg";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ApprovedBoxProps = BaseProps;

const SellerProfileApprovedBox = (props: ApprovedBoxProps) => {
  // const [viewMoreExpanded, setViewMoreExpanded] = useState(false);
  const { className, style } = props;
  const styles = useStylesheet(congratsImageURL);
  const rootCSS = css(styles.root, style, className);

  const verifiedBannerTitle = i`You have unlocked unlimited sales and additional merchant features!`;
  const verifiedBannerBody1 =
    i`Your store is now successfully validated! Your products will remain` +
    i` **enabled** and available for sale in the Wish app, and your store is` +
    i` now eligible for **unlimited sales** and additional merchant features` +
    i` to further grow your business.`;
  const verifiedBannerBody2 =
    i`By successfully validating your store, you have unlocked additional` +
    i` merchant features below to continue expanding your business:`;

  // To Do: waiting for unlock-products card to be released

  // const unlockRestrictedCardTitle = i`Sell restricted product categories`;
  // const unlockRestrictedCardBody =
  //   i`Gain access to sell products under restricted categories ` +
  //   i`that require approval, such as beverages, food, and nutrition supplements.`;

  return (
    <div className={css(rootCSS)}>
      <div className={css(styles.topBanner)}>
        <div className={css(styles.contentText)}>
          <div className={css(styles.title)}>
            <Markdown text={verifiedBannerTitle} />
          </div>
          <div className={css(styles.body)}>
            <Markdown
              className={css(styles.verifiedBannerBody)}
              text={verifiedBannerBody1}
            />
            <Markdown
              className={css(styles.verifiedBannerBody)}
              text={verifiedBannerBody2}
            />
          </div>
        </div>
      </div>
      <div className={css(styles.toDoCards)}>
        {renderTodoCard(styles)}
        {/* <div className={css(styles.accordionBorder)}>
        <Accordion
          hideLines
          header={() => (
            <div className={css(styles.accordionHeader)}>
              <Markdown text={i`View more benefits`} />
            </div>
          )}
          chevronSize={14}
          onOpenToggled={setViewMoreExpanded}
          isOpen={viewMoreExpanded}
          backgroundColor={palettes.textColors.White}
        >
          <div className={css(styles.moreBenefits)}>
            <div className={css(styles.sideBySide)}>
              <SellerProfileTodoCard
                title={unlockRestrictedCardTitle}
                body={unlockRestrictedCardBody}
                imageUrl={icon.unlockRestrictedProducts}
                cta={{
                  text: i`Continue`,
                  onClick: () => {} //To Do: add URL when ready 
                }}
              />
            </div>
          </div>
        </Accordion>
        </div> */}
      </div>
    </div>
  );
};

export default SellerProfileApprovedBox;

// if you find this please fix the any types (legacy)
const renderTodoCard = (styles: any) => {
  const taxCardTitle = i`Set up your Tax Settings`;
  const taxCardBody =
    i`Configure and edit the jurisdictions where you have ` +
    i`indirect tax obligations while selling and shipping ` +
    i`your products.`;

  const merchStandingCardTitle = i`Eligible for Merchant Standing`;
  const merchStandingCardBody =
    i`Continue improving your store's performance around customer ` +
    i`experience and policy compliance to be eligible for Merchant Standing.`;
  const merchStandingLink = zendeskURL("360036683634");

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
        title={merchStandingCardTitle}
        body={merchStandingCardBody}
        imageUrl={icon.merchStandingEligible}
        cta={{
          text: i`Learn More`,
          onClick: () => {
            window.open(merchStandingLink);
          },
        }}
      />
    </div>
  );
};

const useStylesheet = (congratsImageUrl: string) => {
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
          backgroundImage: `url(${congratsImageUrl})`,
          backgroundRepeat: "no-repeat",
        },
        contentText: {
          maxWidth: "67%",
        },
        title: {
          fontSize: 20,
          lineHeight: 1.33,
          fontWeight: fonts.weightBold,
          color: palettes.textColors.Ink,
          whiteSpace: "normal",
          marginBottom: 15,
        },
        body: {
          fontSize: 16,
          lineHeight: 1.5,
          fontWeight: fonts.weightNormal,
          color: palettes.textColors.Ink,
          whiteSpace: "normal",
        },
        verifiedBannerBody: {
          marginTop: 10,
        },
        sideBySide: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "row",
          margin: "32px 24px",
        },
        accordionHeader: {
          fontSize: 16,
          color: palettes.textColors.Ink,
        },
        accordionBorder: {
          borderTop: `solid 1px`,
          borderColor: palettes.greyScaleColors.DarkGrey,
        },
        toDoCards: {
          display: "flex",
          flexDirection: "column",
        },
        moreBenefits: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
        },
        seperator: {
          width: 1,
          margin: "0 24px",
          borderLeft: `2px dotted ${palettes.greyScaleColors.Grey}`,
        },
      }),
    [congratsImageUrl]
  );
};
