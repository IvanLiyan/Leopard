import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { SecondaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { PageGuide } from "@merchant/component/core";
import { Tip } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import TrueBrandDirectory from "@merchant/component/brand/branded-products/TrueBrandDirectory";
import NewTrueBrandRequestModal from "@merchant/component/brand/branded-products/NewTrueBrandRequestModal";
import VerifyBrandsTip from "@merchant/component/brand/branded-products/verify-brands/VerifyBrandsTip";

import { MerchantSchema, SellerVerificationSchema } from "@schema/types";

type InitialData = {
  readonly currentMerchant: Pick<MerchantSchema, "isMerchantPlus"> & {
    readonly sellerVerification: Pick<SellerVerificationSchema, "hasCompleted">;
  };
};

type TrueBrandDirectoryContainerProps = {
  readonly initialData: InitialData;
};

const TrueBrandDirectoryContainer = ({
  initialData,
}: TrueBrandDirectoryContainerProps) => {
  const { primary } = useTheme();
  const styles = useStylesheet();
  const { currentMerchant } = initialData;

  const showABSBTip =
    currentMerchant &&
    currentMerchant.sellerVerification.hasCompleted &&
    !currentMerchant.isMerchantPlus;
  const absLearnMoreLink = `[${i`Learn more`}](/branded-products/authentic-brand-seller)`;
  const suggestBrandtLink = `[${i`suggest a brand.`}](#submit_new_request)`;

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Brand Directory`}
        illustration="trueBrandDirectoryHeader"
      >
        <Markdown
          className={css(styles.welcomeText)}
          onLinkClicked={() => {
            new NewTrueBrandRequestModal({}).render();
          }}
          text={
            i`If you sell authentic branded products, you are required to ` +
            i`tag them with brand names from the Brand Directory on this ` +
            i`page. If you are interested in selling products of a brand ` +
            i`not shown in the Brand Directory, you can ${suggestBrandtLink}`
          }
        />
        <SecondaryButton
          padding={"12px 14px"}
          style={css(styles.requestsButton)}
          href="/my-brand-requests"
        >
          <div className={css(styles.requestsText)}>View suggested brands</div>
        </SecondaryButton>
      </WelcomeHeader>
      <PageGuide className={css(styles.tipsContainer)}>
        {currentMerchant && <VerifyBrandsTip className={css(styles.tip)} />}
        {showABSBTip && (
          <Tip color={primary} icon="tip" className={css(styles.tip)}>
            <div className={css(styles.tipTextContainer)}>
              <Markdown text={i`**Authentic Brand Seller**`} />
              <Markdown
                text={
                  i`Earn the green "Authentic Brand Product" badge and ` +
                  i`potential increase in impressions for your branded listings ` +
                  i`by applying to become an Authentic Brand Seller. ${absLearnMoreLink}`
                }
                openLinksInNewTab
              />
            </div>
          </Tip>
        )}
        <TrueBrandDirectory style={css(styles.brandDirectory)} />
      </PageGuide>
    </div>
  );
};

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
        tipsContainer: {
          ":last-child": {
            marginBottom: 24,
          },
        },
        tip: {
          marginTop: 24,
        },
        welcomeText: {
          fontSize: 20,
          lineHeight: 1.4,
          color: textBlack,
          fontWeight: fonts.weightNormal,
          marginTop: 20,
        },
        requestsButton: {
          marginTop: 24,
        },
        requestsText: {
          fontSize: 20,
        },
        brandDirectory: {
          marginTop: 20,
        },
        tipTextContainer: {
          display: "flex",
          flexDirection: "column",
          maxWidth: 640,
        },
      }),
    [pageBackground, textBlack]
  );
};

export default observer(TrueBrandDirectoryContainer);
