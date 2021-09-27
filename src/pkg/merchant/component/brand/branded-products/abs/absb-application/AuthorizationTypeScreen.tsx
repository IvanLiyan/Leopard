import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { H5 } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import Footer from "./Footer";
import AuthorizationTypeCard from "./AuthorizationTypeCard";
import { getDownloadLink } from "./TemplateDownloader";
import { zendeskURL } from "@toolkit/url";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ABSBApplicationState from "@merchant/model/brand/branded-products/ABSBApplicationState";

type AuthorizationTypeScreenProps = BaseProps & {
  readonly currentApplication: ABSBApplicationState;
};

const AuthorizationTypeScreen = ({
  style,
  currentApplication,
}: AuthorizationTypeScreenProps) => {
  const { navigationStore } = AppStore.instance();
  const styles = useStylesheet();
  const learnMoreLink = `[${i`Learn more`}](${zendeskURL("207538817")})`;
  const brandOwnerTemplateLink = `[${i`download our suggested template.`}](${getDownloadLink(
    "BRAND_OWNER"
  )})`;
  const authorizedSellerTemplateLink = `[${i`download our suggested template.`}](${getDownloadLink(
    "AUTHORIZED_RESELLER"
  )})`;
  const unauthorizedLearnMoreLink = `[${i`Learn more`}](${zendeskURL(
    "360044649073"
  )})`;

  return (
    <div className={css(styles.root, style)}>
      <H5 className={css(styles.title)}>Authorization Type</H5>
      <Markdown
        style={css(styles.subtitle)}
        text={
          i`Select the type of selling authorization you have for this brand. ` +
          i`You will need to provide different documents for each authorization ` +
          i`type below. ${learnMoreLink}`
        }
        openLinksInNewTab
      />

      <AuthorizationTypeCard
        title={i`I am the Brand Owner`}
        body={
          i`Please provide a **list of the brand's trademark ` +
          i`registration(s)** on company letterhead, along with the brand's ` +
          i`contact information. You may provide your own trademark ` +
          i`schedule or ${brandOwnerTemplateLink}`
        }
        illustration="absbBrandOwnerIllustration"
        illustrationAlt={i`brand owner illustration`}
        active={
          !currentApplication.authorizationType ||
          currentApplication.authorizationType === "BRAND_OWNER"
        }
        onClick={() => {
          currentApplication.setAuthorizationType("BRAND_OWNER");
        }}
      />
      <AuthorizationTypeCard
        title={i`I am a Reseller with permission`}
        body={
          i`Please provide a **list of the brand's trademark registration(s)** ` +
          i`on company letterhead, along with the brand's contact information. ` +
          i`Be sure to include a **section where the brand owner names you as ` +
          i`an authorized reseller** of the brand's products. You may provide ` +
          i`your own formatted document or ${authorizedSellerTemplateLink}`
        }
        illustration="absbAuthorizedResellerIllustration"
        illustrationAlt={i`authorized reseller illustration`}
        active={
          !currentApplication.authorizationType ||
          currentApplication.authorizationType === "AUTHORIZED_RESELLER"
        }
        onClick={() => {
          currentApplication.setAuthorizationType("AUTHORIZED_RESELLER");
        }}
      />
      <AuthorizationTypeCard
        title={i`I am a Reseller without permission`}
        body={
          i`Although the Authentic Brand Seller application is not available ` +
          i`for this authorization type, you are still able to sell authentic ` +
          i`branded products by properly tagging your listings with brand ` +
          i`names in our Brand Directory. ${unauthorizedLearnMoreLink}`
        }
        illustration="absbUnauthorizedResellerIllustration"
        illustrationAlt={i`unauthorized reseller illustration`}
        active={
          !currentApplication.authorizationType ||
          currentApplication.authorizationType === "UNAUTHORIZED_RESELLER"
        }
        onClick={() => {
          currentApplication.setAuthorizationType("UNAUTHORIZED_RESELLER");
        }}
      />

      <Footer
        continueDisabled={!currentApplication.authorizationTypeStepComplete}
        onContinue={() => {
          if (
            currentApplication.authorizationType === "UNAUTHORIZED_RESELLER"
          ) {
            navigationStore.navigate("/branded-products");
          } else {
            currentApplication.setCurrentStep("TRADEMARK_REGISTRATIONS");
          }
        }}
        currentApplication={currentApplication}
      />
    </div>
  );
};
export default observer(AuthorizationTypeScreen);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        title: {
          marginTop: 24,
        },
        subtitle: {
          margin: "8px 138px 36px 138px",
          maxWidth: 720,
          textAlign: "center",
        },
      }),
    []
  );
