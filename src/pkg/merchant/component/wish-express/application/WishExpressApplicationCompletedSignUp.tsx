import React from "react";
import { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { greenCheckmarkSolid, closeIcon } from "@assets/icons";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { ThemeContext } from "@stores/ThemeStore";

export type WishExpressApplicationCompletedSignUpProps = BaseProps & {
  readonly closeModal: () => void;
};

@observer
export default class WishExpressApplicationCompletedSignUp extends Component<WishExpressApplicationCompletedSignUpProps> {
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
      wishLogo: {
        // eslint-disable-next-line local-rules/no-frozen-width
        width: 192,
        objectFit: "contain",
        paddingTop: 40,
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
        paddingTop: 20,
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
        paddingTop: 60,
      },
      headerContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 32,
        paddingTop: 32,
      },
      greenCheck: {
        height: 28,
        paddingRight: 10,
      },
      innerContentContainer: {
        textAlign: "center",
        paddingLeft: 40,
        paddingRight: 40,
        maxWidth: 550,
      },
      actionButton: {
        marginBottom: 10,
        paddingTop: 10,
      },
      actionButtonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 18,
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
      secondaryAction: {
        color: "#4a5f6e",
        fontSize: "16px",
        marginBottom: 42,
        cursor: "pointer",
      },
    });
  }

  render() {
    const { closeModal } = this.props;
    const learnMoreUrl = zendeskURL("231264967");

    return (
      <div className={css(this.styles.root)}>
        <Illustration
          name="wishExpressWithText"
          alt="wish-express-logo"
          className={css(this.styles.wishLogo)}
        />
        <div className={css(this.styles.modalContentContainer)}>
          <div
            className={css(this.styles.exitButton)}
            onClick={() => closeModal()}
          >
            <img src={closeIcon} alt="close" />
          </div>
          <div className={css(this.styles.headerContainer)}>
            <img
              src={greenCheckmarkSolid}
              alt="green-check"
              className={css(this.styles.greenCheck)}
            />
            <div className={css(this.styles.modalHeader)}>
              Congrats! Let's keep going.
            </div>
          </div>
          <div className={css(this.styles.innerContentContainer)}>
            <div className={css(this.styles.firstSentenceInInnerContent)}>
              You have successfully signed up for Wish Express!
            </div>
            <div className={css(this.styles.secondSentenceInInnerContent)}>
              You can add Wish Express warehouses for the destination countries
              where you offer expedited shipping.
            </div>
            <div className={css(this.styles.actionButtonContainer)}>
              <PrimaryButton
                className={css(this.styles.actionButton)}
                href="/product#show_add_warehouse_modal=1"
              >
                Add a Wish Express warehouse
              </PrimaryButton>
            </div>
            <div
              className={css(this.styles.secondaryAction)}
              onClick={() => closeModal()}
            >
              <Link style={{ color: palettes.textColors.DarkInk }} href="/">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
        <div className={css(this.styles.footer)}>
          <Markdown
            className={css(this.styles.footerMainText)}
            openLinksInNewTab // eslint-disable-next-line local-rules/no-links-in-i18n
            text={i`How to enable Wish Express for your products? [Learn more](${learnMoreUrl})    `}
          />
        </div>
      </div>
    );
  }
}
