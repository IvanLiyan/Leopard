import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { ResponsiveRow } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Toolkit */
import * as logger from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type LowInventoryTipProps = BaseProps & {
  readonly numLowInventory?: number;
  readonly hideViewDetails?: boolean;
  readonly onClick?: () => unknown;
};

@observer
class LowInventoryTip extends Component<LowInventoryTipProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      wrapper: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
      },
      text: {
        fontSize: 14,
        color: palettes.textColors.Ink,
      },
      button: {
        minWidth: 160,
      },
    });
  }

  @computed
  get request() {
    return api.getNumLowInventory({});
  }

  @computed
  get numLowInventory() {
    const { numLowInventory } = this.props;
    return numLowInventory || this.request.response?.data?.num_low_inventory;
  }

  onClick() {
    const { onClick } = this.props;
    if (onClick) {
      return onClick();
    }
    logger.log("FBW_RECOMMENDATION_DASHBOARD_CLICK", {
      action: "low_inventory",
    });
    const lowInventoryURL = "/fbw/insights";
    window.open(lowInventoryURL, "_blank");
  }

  renderLowInventory() {
    const { hideViewDetails } = this.props;
    if (this.numLowInventory) {
      return (
        <ResponsiveRow className={css(this.styles.wrapper)}>
          <div className={css(this.styles.text)}>
            <Markdown
              text={
                i`**${this.numLowInventory}** product SKU(s) are low in stock ` +
                i`in FBW warehouses. Please restock ` +
                i`your products now to optimize your sales.`
              }
              className={css(this.styles.text)}
            />
          </div>
          {!hideViewDetails && (
            <SecondaryButton
              text={i`View Details`}
              className={css(this.styles.button)}
              onClick={() => this.onClick()}
            />
          )}
        </ResponsiveRow>
      );
    }
    return <LoadingIndicator />;
  }

  render() {
    const { className, style } = this.props;
    if (this.numLowInventory === 0) {
      return null;
    }

    return (
      <Tip
        className={css(this.styles.root, className, style)}
        color={palettes.coreColors.WishBlue}
        icon="tip"
      >
        {this.renderLowInventory()}
      </Tip>
    );
  }
}

export default LowInventoryTip;
