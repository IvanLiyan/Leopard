import React from "react";
import { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Info } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { tooltip, closeIcon } from "@assets/icons";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { ThemeContext } from "@stores/ThemeStore";

export type WishExpressApplicationRequirementsProps = BaseProps & {
  readonly closeModal: () => void;
  readonly onComplete: (str: ApplicationStep) => void;
  readonly onBack: (str: ApplicationStep) => void;
};

type ApplicationStep = "FBWPitchModal" | "WishExpressApplicationTermsOfService";

@observer
class WishExpressApplicationRequirements extends Component<WishExpressApplicationRequirementsProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @computed
  get styles() {
    const { textBlack } = this.context;
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        paddingLeft: 52,
        paddingRight: 52,
        borderRadius: "4px",
        boxShadow: "0 2px 4px 0 rgba(175, 199, 209, 0.2)",
        border: "solid 1px rgba(175, 199, 209, 0.5)",
        backgroundColor: "#ffffff",
      },
      modalHeader: {
        display: "flex",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: fonts.weightSemibold,
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.17,
        textAlign: "center",
        marginBottom: 35,
        color: textBlack,
        paddingTop: 32,
      },
      subHeader: {
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        fontStyle: "normal",
        fontStretch: "normal",
        color: palettes.textColors.Ink,
        marginBottom: 24,
      },
      firstbulletPoint: {
        display: "flex",
        paddingBottom: "18px",
      },
      secondBulletPoint: {
        display: "flex",
        paddingBottom: "26px",
      },
      wishLogo: {
        // eslint-disable-next-line local-rules/no-frozen-width
        width: 192,
        objectFit: "contain",
        paddingTop: 40,
      },
      button: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        placeContent: "center",
        color: "#ffffff",
      },
      modalInfoRectangle: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: "4px",
        backgroundBlendMode: "darken",
        backgroundImage: "linear-gradient(to bottom, #f8fafb, #f8fafb)",
      },
      modalInfoRectangleImage: {
        width: 28,
        paddingLeft: "16px",
        paddingTop: "18px",
        paddingBottom: "18px",
      },
      firstBulletText: {
        paddingLeft: 16,
        display: "flex",
        flexDirection: "column",
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
      },
      secondBulletText: {
        paddingLeft: 16,
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
        paddingTop: 5,
      },
      modalFirstPrimaryButton: {
        marginBottom: 10,
      },
      modalSecondaryActionWithTooltip: {
        marginBottom: 42,
        fontSize: "16px",
        fontStyle: "normal",
        fontStretch: "normal",
        letterSpacing: "normal",
        textAlign: "center",
        color: "#4a5f6e",
        display: "flex",
        justifyContent: "center",
      },
      modalSecondaryActionText: {
        paddingRight: "6px",
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        fontStyle: "normal",
        fontStretch: "normal",
        letterSpacing: "normal",
        textAlign: "center",
        color: "#4a5f6e",
        cursor: "pointer",
      },
      modalInfoRectangleText: {
        paddingLeft: "8px",
        paddingTop: "18px",
        paddingBottom: "10px",
        paddingRight: "16px",
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        fontStyle: "normal",
        fontStretch: "normal",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: "#7790a3",
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
      firstBulletSecondaryText: {
        color: "#2fb7ec",
        paddingLeft: 18,
      },
      numberContainer: {
        textAlign: "center",
      },
      number: {
        backgroundColor: "rgba(250, 191, 134, 0.4)",
        color: "#f8ab60",
        borderRadius: "50%",
        border: "2px",
        padding: "8px",
        width: "24px",
      },
      firstBulletContainer: {
        display: "flex",
        flexDirection: "column",
      },
      infoIcon: {
        marginTop: "3px",
      },
    });
  }

  render() {
    const { closeModal, onComplete } = this.props;
    return (
      <div className={css(this.styles.root)}>
        <div
          className={css(this.styles.exitButton)}
          onClick={() => closeModal()}
        >
          <img src={closeIcon} alt="close" />
        </div>
        <Illustration
          name="wishExpressWithText"
          alt="wish-express-logo"
          className={css(this.styles.wishLogo)}
        />
        <div className={css(this.styles.modalHeader)}>
          A few more things to remember...
        </div>
        <div className={css(this.styles.subHeader)}>
          The following qualifications are required for Wish Express delivery:
        </div>
        <div className={css(this.styles.firstbulletPoint)}>
          <div className={css(this.styles.numberContainer)}>
            <div className={css(this.styles.number)}>1</div>
          </div>
          <div className={css(this.styles.firstBulletContainer)}>
            <div className={css(this.styles.firstBulletText)}>
              Orders must be confirmed delivered before required delivery
              deadline.
            </div>
            <div className={css(this.styles.firstBulletSecondaryText)}>
              <Link href="/policy#wish_express" openInNewTab>
                View delivery time requirements
              </Link>
            </div>
          </div>
        </div>
        <div className={css(this.styles.secondBulletPoint)}>
          <div className={css(this.styles.numberContainer)}>
            <div className={css(this.styles.number)}>2</div>
          </div>
          <div className={css(this.styles.secondBulletText)}>
            Orders must be fulfilled with valid tracking numbers.{" "}
          </div>
        </div>
        <div className={css(this.styles.modalInfoRectangle)}>
          <img
            src={tooltip}
            alt="light-bulb"
            className={css(this.styles.modalInfoRectangleImage)}
          />
          <div className={css(this.styles.modalInfoRectangleText)}>
            You may enable Wish Express on a per destination country, per
            product basis after enrollment.
          </div>
        </div>
        <div className={css(this.styles.button)}>
          <PrimaryButton
            className={css(this.styles.modalFirstPrimaryButton)}
            onClick={() => onComplete("WishExpressApplicationTermsOfService")}
          >
            I can meet requirements
          </PrimaryButton>
        </div>
        <div className={css(this.styles.button)}>
          <div className={css(this.styles.modalSecondaryActionWithTooltip)}>
            <div
              className={css(this.styles.modalSecondaryActionText)}
              onClick={() => onComplete("FBWPitchModal")}
            >
              I can't meet requirements
            </div>
            <Info
              text={
                i`If your business is not able to meet Wish Express delivery times,` +
                i` try Fulfillment by Wish.`
              }
              position="right"
              sentiment="info"
              className={css(this.styles.infoIcon)}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default WishExpressApplicationRequirements;
