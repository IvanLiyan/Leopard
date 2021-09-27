import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Button, Card, Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { goldMerchantStanding } from "@assets/illustrations";

/* Merchant Components */
import GoldMerchantStandingModal from "@merchant/component/policy/merchant-standing/GoldMerchantStandingModal";

/* Toolkit */
import * as logger from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { ThemeContext } from "@merchant/stores/ThemeStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";

export type GoldMerchantStandingProps = BaseProps;

@observer
export default class GoldMerchantStanding extends Component<
  GoldMerchantStandingProps
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
      },
      explanation: {
        textAlign: "center",
        fontSize: "16px",
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
      },
      standingHeader: {
        fontSize: "16px",
        color: textBlack,
        paddingBottom: "4px",
      },
      currentStanding: {
        color: "#f0b616",
        marginBottom: "16px",
      },
    });
  }

  openModal() {
    logger.log("MERCHANT_STANDING_CLICK", {
      merchant_standing: "GOLD",
      action: "LEARN_MORE_HOME",
    });
    const modal = new GoldMerchantStandingModal({});
    modal.render();
  }

  render() {
    return (
      <Card className={css(this.styles.root)}>
        <div className={css(this.styles.content)}>
          <img
            className={css(this.styles.illustration)}
            src={goldMerchantStanding}
          />
          <div className={css(this.styles.topSection)}>
            <Text weight="bold" className={css(this.styles.standingHeader)}>
              Merchant Standing
            </Text>
            <Text weight="medium" className={css(this.styles.currentStanding)}>
              Gold
            </Text>
            <div className={css(this.styles.explanation)}>
              <Text weight="medium">Congratulations!</Text>
              <Text weight="medium">
                {LocalizationStore.instance().locale == "zh"
                  ? "您的店铺具有优秀的用户体验表现和政策合规性。"
                  : i`Your store ` +
                    i`has demonstrated great customer experience ` +
                    i`performance and policy compliance.`}
              </Text>
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
