import React from "react";
import { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { closeIcon, arrowLeft } from "@assets/icons";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { ThemeContext } from "@stores/ThemeStore";

type ApplicationStep = "WishExpressApplicationRequirements";

export type FBWPitchModalProps = BaseProps & {
  readonly closeModal: () => void;
  readonly onBack: (str: ApplicationStep) => void;
};

@observer
class FBWPitchModal extends Component<FBWPitchModalProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @computed
  get styles() {
    const { textBlack } = this.context;
    return StyleSheet.create({
      root: {
        display: "block",
        borderRadius: "4px",
        boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
        border: "solid 1px rgba(175, 199, 209, 0.5)",
        backgroundColor: "#ffffff",
      },
      modalHeader: {
        display: "flex",
        fontSize: "24px",
        fontWeight: fonts.weightSemibold,
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.17,
        color: textBlack,
      },
      exitButton: {
        position: "absolute",
        right: 0,
        top: 0,
        paddingTop: 16,
        paddingRight: 24,
        width: 24,
        backgroundColor: "ffffff",
        cursor: "pointer",
      },
      fulfillmentLogo: {
        // eslint-disable-next-line local-rules/no-frozen-width
        width: 259,
        objectFit: "contain",
        paddingTop: 64,
        position: "absolute",
        top: 0,
        left: 0,
        paddingLeft: 52,
      },
      footer: {
        textAlign: "right",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        borderRadius: "4px",
        boxShadow: "inset 0 1px 0 0 #c4cdd5",
        backgroundColor: "#f8fafb",
        paddingBottom: 20,
      },
      footerMainText: {
        paddingTop: 22,
        fontWeight: fonts.weightMedium,
        fontSize: 16,
        paddingRight: 20,
      },
      modalContentContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        paddingLeft: 52,
        paddingRight: 52,
        paddingTop: 90,
      },
      headerContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 32,
        paddingTop: 40,
      },
      innerContentContainer: {
        textAlign: "left",
      },
      actionButton: {
        marginBottom: 10,
        paddingTop: 10,
      },
      actionButtonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 40,
      },
      firstSentenceInInnerContent: {
        marginBottom: 20,
        fontWeight: fonts.weightMedium,
        fontSize: 16,
        color: palettes.textColors.Ink,
      },
      secondSentenceInInnerContent: {
        marginBottom: 32,
        fontWeight: fonts.weightMedium,
        fontSize: 16,
        color: palettes.textColors.Ink,
      },
      backArrow: {
        width: 24,
        backgroundColor: "ffffff",
        cursor: "pointer",
      },
      backArrowContainer: {
        position: "absolute",
        left: 0,
        top: 0,
        paddingTop: 16,
        paddingLeft: 16,
      },
    });
  }

  render() {
    const { closeModal, onBack } = this.props;
    const learnMoreUrl = zendeskURL("231264967");

    return (
      <div className={css(this.styles.root)}>
        <Illustration
          name="fulfillmentLogo"
          alt="fulfillment-logo"
          className={css(this.styles.fulfillmentLogo)}
        />
        <div
          className={css(this.styles.backArrowContainer)}
          onClick={() => onBack("WishExpressApplicationRequirements")}
        >
          <img
            src={arrowLeft}
            alt="back"
            className={css(this.styles.backArrow)}
          />
        </div>
        <div className={css(this.styles.modalContentContainer)}>
          <div
            className={css(this.styles.exitButton)}
            onClick={() => closeModal()}
          >
            <img src={closeIcon} alt="close" />
          </div>
          <div className={css(this.styles.headerContainer)}>
            <div className={css(this.styles.modalHeader)}>
              We have you covered.
            </div>
          </div>
          <div className={css(this.styles.innerContentContainer)}>
            <div className={css(this.styles.firstSentenceInInnerContent)}>
              Our “Fulfillment by Wish” (FBW) program can help you ship with
              express delivery! Merchants store inventory in Wish's warehouses,
              and Wish handles all order fulfillment and outbound shipment
              processing.
            </div>
            <div className={css(this.styles.secondSentenceInInnerContent)}>
              Merchants who use FBW enable their products to be part of the Wish
              Express program.
            </div>
            <div className={css(this.styles.actionButtonContainer)}>
              <PrimaryButton
                className={css(this.styles.actionButton)}
                href="/fbw"
              >
                Learn about Fulfillment by Wish
              </PrimaryButton>
            </div>
          </div>
        </div>
        <div className={css(this.styles.footer)}>
          <Markdown
            className={css(this.styles.footerMainText)}
            openLinksInNewTab // eslint-disable-next-line local-rules/no-links-in-i18n
            text={i`Have additional concerns? [View Wish Express FAQs](${learnMoreUrl})    `}
          />
        </div>
      </div>
    );
  }
}
export default FBWPitchModal;
