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

type ActionRequiredShippingPlansTipProps = BaseProps & {
  readonly numActionRequiredShippingPlans?: number;
  readonly onClick?: () => unknown;
};

@observer
class ActionRequiredShippingPlansTip extends Component<
  ActionRequiredShippingPlansTipProps
> {
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

  onClick() {
    const { onClick } = this.props;
    if (onClick) {
      return onClick();
    }
    logger.log("FBW_RECOMMENDATION_DASHBOARD_CLICK", {
      action: "action_required_shipping_plans",
    });
    const actionRequiredURL = "/fbw/shipping-plan/action-required";
    window.open(actionRequiredURL, "_blank");
  }

  @computed
  get request() {
    return api.getNumActionRequiredShippingPlans({});
  }

  @computed
  get numActionRequiredShippingPlans() {
    const { numActionRequiredShippingPlans } = this.props;
    return (
      numActionRequiredShippingPlans ||
      this.request.response?.data?.num_action_required_shipping_plans
    );
  }

  renderNumActionRequiredShippingPlans() {
    if (this.numActionRequiredShippingPlans) {
      return (
        <ResponsiveRow className={css(this.styles.wrapper)}>
          <div className={css(this.styles.text)}>
            <Markdown
              text={
                i`**${this.numActionRequiredShippingPlans}** ` +
                i`shipping plans need your attention. ` +
                i`Take a look at what's needed.`
              }
              className={css(this.styles.text)}
            />
          </div>
          <SecondaryButton
            text={i`View Details`}
            className={css(this.styles.button)}
            onClick={() => this.onClick()}
          />
        </ResponsiveRow>
      );
    }
    return <LoadingIndicator />;
  }

  render() {
    const { className, style } = this.props;
    if (this.numActionRequiredShippingPlans === 0) {
      return null;
    }
    return (
      <Tip
        className={css(this.styles.root, className, style)}
        color={palettes.coreColors.WishBlue}
        icon="tip"
      >
        {this.renderNumActionRequiredShippingPlans()}
      </Tip>
    );
  }
}

export default ActionRequiredShippingPlansTip;
