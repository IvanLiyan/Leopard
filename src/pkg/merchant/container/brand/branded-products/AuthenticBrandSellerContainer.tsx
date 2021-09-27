import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";

/* Merchant Components */
import ABSVerifiedContent from "@merchant/component/brand/branded-products/abs/ABSVerifiedContent";
import ABSUnverifiedContent from "@merchant/component/brand/branded-products/abs/ABSUnverifiedContent";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useStringQueryParam } from "@toolkit/url";

/* Merchant Store */
import { useToastStore } from "@merchant/stores/ToastStore";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { SellerVerificationSchema } from "@schema/types";

type InitialData = {
  readonly currentMerchant: {
    readonly sellerVerification: Pick<SellerVerificationSchema, "hasCompleted">;
  };
};

type AuthenticBrandSellerContainerProps = {
  readonly initialData: InitialData;
};

const AuthenticBrandSellerContainer = ({
  initialData,
}: AuthenticBrandSellerContainerProps) => {
  const styles = useStylesheet();
  const [submissionStatus, setSubmissionStatus] = useStringQueryParam(
    "submission"
  );
  const {
    currentMerchant: {
      sellerVerification: { hasCompleted: merchantVerified },
    },
  } = initialData;

  const toastStore = useToastStore();
  if (submissionStatus) {
    if (submissionStatus === "success") {
      toastStore.positive(
        i`Your Authentic Brand Seller application has been submitted!`
      );
      setSubmissionStatus(null);
    } else if (submissionStatus === "fail") {
      toastStore.negative(
        i`Sorry, we were unable to submit your Authentic Brand Seller application.`
      );
      setSubmissionStatus(null);
    }
  }

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Authentic Brand Seller`}
        illustration="absHeader"
        className={css(styles.header)}
        body={() => (
          <div className={css(styles.row)}>
            <Icon
              name="authenticBrandSellerBadgeLarge"
              style={css(styles.absbBadge)}
            />
            <Markdown
              style={css(styles.welcomeText)}
              openLinksInNewTab
              text={
                i`As an Authentic Brand Seller, you will receive the green “Authentic Brand ` +
                i`Product” badge and additional impressions for your branded product listings.`
              }
            />
          </div>
        )}
      />
      {merchantVerified ? (
        <ABSVerifiedContent style={css(styles.content)} />
      ) : (
        <ABSUnverifiedContent style={css(styles.content)} />
      )}
    </div>
  );
};
export default observer(AuthenticBrandSellerContainer);

const useStylesheet = () => {
  const { pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        header: {
          minHeight: 200,
        },
        loadingIndicator: {
          alignSelf: "center",
          marginTop: "10%",
        },
        welcomeText: {
          color: textBlack,
          fontWeight: fonts.weightNormal,
          fontSize: 20,
          lineHeight: 1.4,
          marginTop: 20,
        },
        absbBadge: {
          height: 80,
          width: 80,
          marginRight: 16,
          alignSelf: "center",
        },
        row: {
          marginTop: 8,
          display: "flex",
        },
        content: {
          marginTop: 24,
          alignSelf: "center",
          width: "100%",
          maxWidth: "70%",
        },
      }),
    [pageBackground, textBlack]
  );
};
