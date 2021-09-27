import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { goldMerchantStanding } from "@assets/illustrations";

/* Toolkit */
import * as logger from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import LocalizationStore from "@merchant/stores/LocalizationStore";

/* Legacy */
import { ni18n } from "@legacy/core/i18n";

export type GoldMerchantStandingModalProps = BaseProps;

@observer
class GoldMerchantStandingModalContent extends Component<GoldMerchantStandingModalProps> {
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
        color: "#f0b616",
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
        merchant_standing: "GOLD",
        action: "LEARN_MORE_COMPLIANT",
      });
    }
    window.open("/compliant-listings");
  };

  /* eslint-disable local-rules/unnecessary-list-usage */
  render() {
    const epcFastPaymentText = ni18n(
      20,
      "Your store's EPC orders may become eligible for payment **1 calendar day** after confirmed fulfillment.",
      "Your store's EPC orders may become eligible for payment **{%1=number of days} calendar days** after confirmed fulfillment.",
    );
    const fastPaymentText = ni18n(
      20,
      "Orders for select products with good performance history may become eligible for payment **1 calendar day** after confirmed fulfillment.",
      "Orders for select products with good performance history may become eligible for payment **{%1=number of days} calendar days** after confirmed fulfillment.",
    );
    return (
      <div className={css(this.styles.root)}>
        <img
          className={css(this.styles.illustration)}
          src={goldMerchantStanding}
        />
        <div className={css(this.styles.topSection)}>
          <div className={css(this.styles.currentStanding)}>Gold</div>
          <div className={css(this.styles.explanation)}>
            {LocalizationStore.instance().locale == "zh"
              ? "您的店铺具有优秀的用户体验表现和政策合规性。"
              : i`Your store ` +
                i`has demonstrated great customer experience ` +
                i`performance and policy compliance.`}
          </div>
        </div>
        <div className={css(this.styles.bottomSection)}>
          <div className={css(this.styles.question)}>What does this mean?</div>
          <ul className={css(this.styles.list)}>
            <li className={css(this.styles.listItem)}>
              {LocalizationStore.instance().locale == "zh"
                ? "您店铺的新增产品和现有产品正在享受免费的流量。"
                : i`Your store’s newly listed and existing products are` +
                  ` receiving complimentary impressions.`}
            </li>
            <li className={css(this.styles.listItem)}>
              <Markdown
                text={
                  LocalizationStore.instance().locale == "zh"
                    ? "您店铺内的产品每月最多可获得**250万**个流量。"
                    : i`Your store’s products are eligible for up` +
                      ` to **2.5M** additional impressions per month.`
                }
              />
            </li>
            <li className={css(this.styles.listItem)}>
              <Markdown text={epcFastPaymentText} />
            </li>
            <li className={css(this.styles.listItem)}>
              <Markdown text={fastPaymentText} />
            </li>
          </ul>
          <div className={css(this.styles.question)}>
            How do I improve my Merchant Standing?
          </div>
          <ul>
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

export default class GoldMerchantStandingModal extends Modal {
  merchantStandingGotItClick = () => {
    const { userStore } = AppStore.instance();
    if (!userStore.isSu && !userStore.loggedInMerchantUser.is_admin) {
      logger.log("MERCHANT_STANDING_CLICK", {
        merchant_standing: "GOLD",
        action: "GOT_IT",
      });
    }
    this.close();
  };

  constructor(props: GoldMerchantStandingModalProps) {
    super((onClose) => <GoldMerchantStandingModalContent {...props} />);
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
