import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBWShippingPriceProps = BaseProps & {
  readonly isFBSShippingPlan: boolean;
};

@observer
class FBWShippingPrice extends Component<FBWShippingPriceProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      card: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.pageBackground,
      },
      content: {
        padding: "24px",
      },
      textStatsTitle: {
        paddingTop: "10px",
        fontSize: 20,
        fontWeight: fonts.weightBold,
        color: palettes.textColors.DarkInk,
      },
      topSection: {
        display: "flex",
        flexDirection: "column",
        padding: "20px 0px",
        fontSize: 16,
        fontWeight: fonts.weightNormal,
      },
      button: {
        width: 100,
      },
      explanation: {
        fontFamily: fonts.proxima,
        fontSize: "16px",
        fontWeight: fonts.weightMedium,
        lineHeight: 1.5,
        letterSpacing: "normal",
        color: palettes.textColors.Ink,
      },
    });
  }

  render() {
    const { isFBSShippingPlan } = this.props;
    return (
      <Card className={css(this.styles.card)}>
        <div className={css(this.styles.content)}>
          {!isFBSShippingPlan && (
            <div className={css(this.styles.textStatsTitle)}>
              Set up shipping price
            </div>
          )}
          {isFBSShippingPlan && (
            <div className={css(this.styles.textStatsTitle)}>
              Set up shipping price
            </div>
          )}
          <div className={css(this.styles.topSection)}>
            {!isFBSShippingPlan && (
              <div className={css(this.styles.explanation)}>
                Your products won't be available for sale till you set up FBW
                shipping price.
              </div>
            )}
            {isFBSShippingPlan && (
              <>
                <div className={css(this.styles.explanation)}>
                  Inbound FBS products are stocked in FBW warehouses until they
                  are ready to be shipped to stores for customers to purchase
                  and pick up. Although the customer does not pay for shipping,
                  we ask that you include a shipping price in order to optimize
                  exposure and number of transactions for your products.
                </div>
                <br />
                <div className={css(this.styles.explanation)}>
                  Once you set up shipping prices on the FBW Inventory page,
                  your products will be available in the Wish app for receiving
                  pickup purchases.
                </div>
              </>
            )}
          </div>
          <PrimaryButton
            href="/fbw/inventory"
            openInNewTab
            className={css(this.styles.button)}
          >
            Set up shipping price
          </PrimaryButton>
        </div>
      </Card>
    );
  }
}

export default FBWShippingPrice;
