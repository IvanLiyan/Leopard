import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { platinumMerchantStanding } from "@assets/illustrations";

/* Merchant Components */
import PlatinumMerchantStandingModal from "@merchant/component/policy/merchant-standing/PlatinumMerchantStandingModal";

/* Toolkit */
import * as logger from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { ThemeContext } from "@merchant/stores/ThemeStore";

export type PlatinumMerchantStandingProps = BaseProps;

@observer
export default class PlatinumMerchantStanding extends Component<
  PlatinumMerchantStandingProps
> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  @computed
  get styles() {
    const { textBlack } = this.context;

    return StyleSheet.create({
      root: {
        "@media (min-width: 900px)": {
          width: 470,
        },
      },
      content: {
        height: 280,
        flex: 1,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px 30px",
        backgroundColor: palettes.textColors.White,
      },
      illustration: {
        maxWidth: "56px",
        maxHeight: "56px",
        alignSelf: "center",
        backgroundColor: "#ffffff",
      },
      topSection: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: "20px 0px",
        fontSize: 16,
        fontWeight: fonts.weightNormal,
      },
      explanation: {
        textAlign: "center",
        fontFamily: fonts.proxima,
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
      },
      standingHeader: {
        fontWeight: fonts.weightBold,
        fontFamily: fonts.proxima,
        fontSize: "16px",
        color: textBlack,
        paddingBottom: "4px",
      },
      currentStanding: {
        color: "#326bee",
        fontWeight: fonts.weightSemibold,
        marginBottom: "16px",
      },
    });
  }

  openModal() {
    logger.log("MERCHANT_STANDING_CLICK", {
      merchant_standing: "PLATINUM",
      action: "LEARN_MORE_HOME",
    });
    const modal = new PlatinumMerchantStandingModal({});
    modal.render();
  }

  render() {
    return (
      <Card className={css(this.styles.root)}>
        <div className={css(this.styles.content)}>
          <img
            className={css(this.styles.illustration)}
            src={platinumMerchantStanding}
          />
          <div className={css(this.styles.topSection)}>
            <div className={css(this.styles.standingHeader)}>
              Merchant Standing
            </div>
            <div className={css(this.styles.currentStanding)}>Platinum</div>
            <div className={css(this.styles.explanation)}>
              <section>Congratulations!</section>
              <section>
                Your store's products are getting complimentary impressions!
              </section>
            </div>
          </div>
          <Button
            onClick={() => this.openModal()}
            style={{ padding: "10px 50px" }}
          >
            Learn more
          </Button>
        </div>
      </Card>
    );
  }
}
