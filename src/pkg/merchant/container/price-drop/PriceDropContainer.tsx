import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { Link } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { usePathParams } from "@toolkit/url";

/* Merchant Components */
import PriceDropSection from "@merchant/component/products/price-drop/PriceDropSection";

/* Merchant API */
import * as priceDropApi from "@merchant/api/price-drop";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { zendeskURL } from "@toolkit/url";
import { PriceDropLoggingActions } from "@toolkit/price-drop/logging-actions";

const PriceDropContainer = () => {
  const styles = useStylesheet();
  const { dimenStore, userStore } = useStore();
  const { selectedTab = "active" } = usePathParams(
    "/marketplace/price-drop/:selectedTab"
  );
  const pageX = dimenStore.pageGuideXForPageWithTable;

  const logger = useLogger("PRICE_DROP_UI");

  // log and complete todos items whenever selectedTab changes.
  useEffect(() => {
    let action: string | null = null;
    switch (selectedTab) {
      case "active":
        action = PriceDropLoggingActions.TRIAL_PRICE_DROP_PAGE_IMPRESSION;
        break;
      case "pending":
        action = PriceDropLoggingActions.PENDING_CAMPAIGN_PAGE_IMPRESSION;
        break;
      case "ongoing":
        action = PriceDropLoggingActions.ONGOING_CAMPAIGN_PAGE_IMPRESSION;
        break;
      case "ended":
        action = PriceDropLoggingActions.HISTORY_CAMPAIGN_PAGE_IMPRESSION;
        break;
      default:
        break;
    }
    logger.info({
      merchant_id: userStore.loggedInMerchantUser.merchant_id,
      action,
    });
    const completeTodos = async () => {
      await priceDropApi
        .completePriceDropTodos({
          selected_tab: selectedTab,
        })
        .call();
    };
    completeTodos();
  }, [selectedTab, userStore, logger]);

  const [selectAll, setSelectAll] = useState(false);
  const priceDropDetailsRequest = priceDropApi.getPriceDropListPageParams();
  const showTrialSuccessModal =
    priceDropDetailsRequest.response?.data?.show_trial_success_modal || false;
  const currencyCode =
    priceDropDetailsRequest.response?.data?.currency_code || "USD";
  const showGMVGain =
    priceDropDetailsRequest.response?.data?.show_gmv_gain || true;
  const priceDropDeprecateV1 =
    priceDropDetailsRequest.response?.data?.price_drop_deprecate_v1 || false;

  // display/hide first land modal when showTrialSuccessModal changes.
  useEffect(() => {
    if (showTrialSuccessModal && selectedTab === "active") {
      const styles = StyleSheet.create({
        modalHeader: {
          backgroundColor: "#f8fafb",
          fontSize: 24,
          fontWeight: fonts.weightBold,
          color: "#16365c",
          textAlign: "center",
          lineHeight: 1.33,
        },
        contentRow: {
          display: "flex",
          flexDirection: "column",
          fontSize: "16",
          fontWeight: fonts.weightMedium,
          color: "#16365c",
          lineHeight: 2,
        },
      });
      logger.info({
        merchant_id: userStore.loggedInMerchantUser.merchant_id,
        action: PriceDropLoggingActions.FIRST_TIME_MODAL_IMPRESSION,
      });

      const modal = new ConfirmationModal(() => {
        return (
          <div className={css(styles.contentRow)}>
            <div>1. Wish subsidized a Price Drop campaign for you.</div>
            <div>
              2. The campaign was a great success with increased impressions.
            </div>
            <div>
              3. Your products are now offering competitive prices compared to
              other merchants’ listings on Wish.
            </div>
            <div>
              4. Drop the prices of all these products now by selecting all
              Price Drop offers to maintain your competitive edge and keep the
              momentum going.
            </div>
          </div>
        );
      });
      modal
        .setIllustration("pricedropWishSubsidy")
        .setHeader({
          className: css(styles.modalHeader),
          title: i`The Wish-Subsidized Price Drop Campaign was a Success!`,
        })
        .setAction(i`Select All Price Drop Offers`, () => {
          logger.info({
            merchant_id: userStore.loggedInMerchantUser.merchant_id,
            action:
              PriceDropLoggingActions.CLICK_FIRST_TIME_MODAL_SELECT_ALL_TO_DROP,
          });
          setSelectAll(true);
        })
        .setCancel(i`Explore Performance`)
        .setWidthPercentage(0.5)
        .setFooterStyle({
          justifyContent: "center",
        })
        .render();
    }
  }, [showTrialSuccessModal, selectedTab, userStore, logger]);

  const welcomeHeaderText = showTrialSuccessModal
    ? i`We compared some of your products with similar ones on Wish and ran a ` +
      i`subsidized Price Drop campaign on your behalf, so your products were ` +
      i`competitively priced against other merchants’. The campaign resulted in ` +
      i`increased product impressions. Continue dropping the prices of ` +
      i`these products to maintain your competitive edge and keep the momentum going.`
    : i`Check out the success of your ongoing Price Drop campaigns, ` +
      i`create and explore Price Drop products, and view historical campaigns.`;

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`Price Drop`}
        body={() => {
          return (
            <div className={css(styles.textBody)}>
              <span>{welcomeHeaderText}</span>
              <span> </span>
              <Link
                className={css(styles.textBody)}
                openInNewTab
                href={zendeskURL("360039512433")}
              >
                Learn more
              </Link>
              <div className={css(styles.btnBody)}>
                <PrimaryButton
                  className={css(styles.createCampaignbutton)}
                  onClick={() => {
                    window.open(
                      "/marketplace/price-drop/create-campaign",
                      "_blank"
                    );
                  }}
                >
                  Create a Campaign
                </PrimaryButton>
              </div>
            </div>
          );
        }}
        paddingX={pageX}
        illustration="pricedropHeader"
        hideBorder
      />

      <PriceDropSection
        currency={currencyCode}
        showGMVGain={showGMVGain}
        selectAll={selectAll}
        priceDropDeprecateV1={priceDropDeprecateV1}
        resetSelectAll={() => {
          setSelectAll(false);
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
          backgroundColor: colors.pageBackground,
        },
        textBody: {
          fontSize: 20,
          lineHeight: 1.4,
          color: colors.palettes.textColors.Ink,
          fontWeight: fonts.weightNormal,
          marginTop: 20,
        },
        btnBody: {
          backgroundColor: "#FFFFFF",
          paddingBottom: 10,
        },
        createCampaignbutton: {
          width: "20%",
          marginTop: 16,
          fontSize: 16,
          fontWeight: fonts.weightSemibold,
        },
      }),
    []
  );
};

export default observer(PriceDropContainer);
