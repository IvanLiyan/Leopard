import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { ResponsiveRow } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import * as logger from "@toolkit/logger";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CreateShippingPlanTipProps = BaseProps & {
  readonly onClick?: () => unknown;
};

@observer
class CreateShippingPlanTip extends Component<CreateShippingPlanTipProps> {
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
        padding: "0px 0px 0px 10px",
      },
    });
  }

  onClick() {
    const { onClick } = this.props;
    if (onClick) {
      return onClick();
    }

    logger.log("FBW_RECOMMENDATION_DASHBOARD_CLICK", {
      action: "create_shipping_plan",
    });
    const shippingPlanUrl = "/create-shipping-plan?shipmentType=FBW";
    window.open(shippingPlanUrl, "_blank");
  }

  render() {
    const { className, style } = this.props;
    return (
      <Tip
        className={css(this.styles.root, className, style)}
        color={palettes.coreColors.WishBlue}
        icon="tip"
      >
        <ResponsiveRow className={css(this.styles.wrapper)}>
          <div className={css(this.styles.text)}>
            <Markdown
              text={
                i`Create a new shipping plan and stock your top-selling products` +
                i` that customers love.`
              }
              className={css(this.styles.text)}
            />
          </div>
          <SecondaryButton
            text={i`Create new shipping plan`}
            className={css(this.styles.button)}
            onClick={() => this.onClick()}
          />
        </ResponsiveRow>
      </Tip>
    );
  }
}
export default CreateShippingPlanTip;
