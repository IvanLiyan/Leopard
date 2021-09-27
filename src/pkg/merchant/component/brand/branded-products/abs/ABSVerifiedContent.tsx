import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { H4Markdown } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant API */
import * as absbApi from "@merchant/api/brand/authentic-brand-seller-application";

/* Toolkit */
import { useRequest } from "@toolkit/api";
import { zendeskURL } from "@toolkit/url";
import { startApplication } from "@toolkit/brand/branded-products/abs";

/* Relative Imports */
import TemplateDownloader from "./absb-application/TemplateDownloader";
import ABSBApplicationList from "./absb-application-list/ABSBApplicationList";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ABSVerifiedContentProps = BaseProps;

const ABSVerifiedContent = ({ style }: ABSVerifiedContentProps) => {
  const styles = useStylesheet();
  const [resp] = useRequest(absbApi.getAbsbApplications());
  const isLoading = resp == null;
  const brandApplications = resp?.data?.brand_applications;
  const learnMoreLink = `[${i`Learn more`}](${zendeskURL("360050837853")})`;
  return (
    <Card className={css(styles.card, style)}>
      <div className={css(styles.headerContainer)}>
        <div className={css(styles.headerTextContainer)}>
          <H4Markdown text={i`Your Applications`} />
          <Markdown
            className={css(styles.welcomeText)}
            text={
              i`Download the suggested templates and apply as a Brand Owner or Reseller ` +
              i`with brand owner permission to become an Authentic Brand Seller. ` +
              i`Applications are reviewed and processed within ` +
              i`${3} to ${5} business days. ${learnMoreLink}`
            }
            openLinksInNewTab
          />
        </div>
        <div className={css(styles.headerButtonContainer)}>
          <PrimaryButton
            popoverStyle={css(styles.button)}
            onClick={startApplication}
          >
            Apply
          </PrimaryButton>
          <TemplateDownloader showIcon />
        </div>
      </div>
      {isLoading && (
        <LoadingIndicator className={css(styles.loadingIndicator)} />
      )}
      {!isLoading &&
        (brandApplications && brandApplications.length > 0 ? (
          <ABSBApplicationList brandApplications={brandApplications} />
        ) : (
          <div className={css(styles.emptyContainer)}>
            You have no applications yet.
          </div>
        ))}
    </Card>
  );
};

export default observer(ABSVerifiedContent);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 56,
        },
        button: {
          minWidth: 200,
        },
        downloadLink: {
          display: "flex",
          alignItems: "center",
          marginTop: 24,
        },
        downloadIcon: {
          height: 14,
          width: 14,
          marginRight: 9,
        },
        headerContainer: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 24,
        },
        headerTextContainer: {
          display: "flex",
          flexDirection: "column",
        },
        headerButtonContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        welcomeText: {
          fontSize: 16,
          lineHeight: 1.4,
          padding: "8px 0px",
          maxWidth: 680,
        },
        card: {},
        loadingIndicator: {
          alignSelf: "center",
          marginTop: "10%",
        },
        emptyContainer: {
          borderTop: "1px solid #D5DFE6",
          display: "flex",
          alignItems: "center",
          padding: 16,
          justifyContent: "center",
        },
      }),
    []
  );
