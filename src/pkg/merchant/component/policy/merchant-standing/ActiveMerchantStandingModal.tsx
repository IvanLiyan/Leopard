import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { activeMerchantStanding } from "@assets/illustrations";

/* Toolkit */
import * as logger from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import LocalizationStore from "@merchant/stores/LocalizationStore";

export type ActiveMerchantStandingModalProps = BaseProps;

@observer
class ActiveMerchantStandingModalContent extends Component<ActiveMerchantStandingModalProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: 28,
      },
      illustration: {
        width: "112px",
        height: "112px",
        alignSelf: "center",
        backgroundColor: "#ffffff",
      },
      topSection: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "8px 56px 24px 56px",
        fontSize: 16,
        fontWeight: fonts.weightNormal,
      },
      bottomSection: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
        textAlign: "left",
        padding: "24px 56px",
        fontSize: 16,
        fontWeight: fonts.weightNormal,
        backgroundBlendMode: "darken",
        backgroundImage: "linear-gradient(to bottom, #f8fafb, #f8fafb)",
        alignSelf: "stretch",
      },
      question: {
        alignSelf: "center",
        textAlign: "center",
        fontWeight: fonts.weightSemibold,
        color: palettes.textColors.Ink,
        lineHeight: 1.5,
        fontSize: "16px",
        fontFamily: fonts.proxima,
        paddingBottom: "8px",
      },
      list: {
        marginBottom: 24,
      },
      listItem: {
        fontSize: "16px",
        lineHeight: 1.5,
        fontWeight: fonts.weightMedium,
        fontFamily: fonts.proxima,
        color: palettes.textColors.Ink,
        paddingBottom: 4,
      },
      currentStanding: {
        color: "#1acc94",
        fontSize: "20px",
        fontWeight: fonts.weightSemibold,
        fontFamily: fonts.proxima,
        lineHeight: 1.4,
        textAlign: "center",
      },
      explanation: {
        textAlign: "center",
        fontFamily: fonts.proxima,
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: "#4a5f6e",
        marginTop: "24px",
      },
    });
  }

  compliantLearnMoreClick = () => {
    const { userStore } = AppStore.instance();
    if (!userStore.isSu && !userStore.loggedInMerchantUser.is_admin) {
      logger.log("MERCHANT_STANDING_CLICK", {
        merchant_standing: "ACTIVE",
        action: "LEARN_MORE_COMPLIANT",
      });
    }
    window.open("/compliant-listings");
  };

  /* eslint-disable local-rules/unnecessary-list-usage */
  render() {
    return (
      <div className={css(this.styles.root)}>
        <img
          className={css(this.styles.illustration)}
          src={activeMerchantStanding}
        />
        <div className={css(this.styles.topSection)}>
          <div className={css(this.styles.currentStanding)}>
            {ci18n("Status: Under Review, Active, Gold, or Platinum", "Active")}
          </div>
          <div className={css(this.styles.explanation)}>
            Your store does not yet have sufficient sales data history to be
            evaluated for a higher merchant standing and impression benefits.
          </div>
        </div>
        <div className={css(this.styles.bottomSection)}>
          <div className={css(this.styles.question)}>What does this mean?</div>
          <ul className={css(this.styles.list)}>
            <li className={css(this.styles.listItem)}>
              Your store’s reviewed products are available for sale to
              customers.
            </li>
            <li className={css(this.styles.listItem)}>
              {LocalizationStore.instance().locale == "zh"
                ? "在几周后，您店铺的产品或将能享受免费流量红利。"
                : i`Your store’s products are not eligible for complimentary ` +
                  i`and/or additional impressions until your merchant standing ` +
                  i`improves.`}
            </li>
          </ul>
          <div className={css(this.styles.question)}>
            How do I improve my Merchant Standing?
          </div>
          <ul>
            <li className={css(this.styles.listItem)}>
              <span>
                Use ProductBoost to increase exposure for your best products.
              </span>
              &nbsp;
              <Link href="/product-boost" openInNewTab>
                Join ProductBoost
              </Link>
            </li>
            <li className={css(this.styles.listItem)}>
              Maintain good customer experience performance by fulfilling orders
              accurately and in a timely manner.
            </li>
            <li className={css(this.styles.listItem)}>
              <span>
                Ensure product listings, descriptions, and images accurately
                represent the item available for sale.
              </span>
              &nbsp;
              <Link openInNewTab onClick={this.compliantLearnMoreClick}>
                Learn about compliant listings
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default class ActiveMerchantStandingModal extends Modal {
  merchantStandingGotItClick = () => {
    const { userStore } = AppStore.instance();
    if (!userStore.isSu && !userStore.loggedInMerchantUser.is_admin) {
      logger.log("MERCHANT_STANDING_CLICK", {
        merchant_standing: "ACTIVE",
        action: "GOT_IT",
      });
    }
    this.close();
  };

  constructor(props: ActiveMerchantStandingModalProps) {
    super((onClose) => <ActiveMerchantStandingModalContent {...props} />);
    this.setHeader({
      title: i`Merchant Standing`,
    });
    this.setRenderFooter(() => (
      <ModalFooter
        layout="vertical"
        action={{
          text: i`Got it`,
          onClick: () => this.merchantStandingGotItClick(),
        }}
      />
    ));
    this.setWidthPercentage(0.5);
  }
}
