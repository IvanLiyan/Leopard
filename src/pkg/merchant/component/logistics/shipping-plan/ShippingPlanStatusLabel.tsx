import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { ThemedLabel } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Theme } from "@ContextLogic/lego";
import { ShippingPlanState } from "@merchant/api/fbw";

export type ShippingPlanStatusLabelProps = BaseProps & {
  readonly status: ShippingPlanState | null | undefined;
};

@observer
class ShippingPlanStatusLabel extends Component<ShippingPlanStatusLabelProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        padding: 10,
      },
    });
  }

  @computed
  get theme(): Theme {
    const { status } = this.props;
    switch (status) {
      case 4:
        return "CashGreen";
      case 6:
        return "CashGreen";
      case 7:
        return "DarkYellow";
      case 8:
        return "CashGreen";
      case 9:
        return "DarkInk";
      case 10:
        return "WishBlue";
      case 11:
        return "WishBlue";
      case 13:
        return "WishBlue";
      case 15:
        return "DarkRed";
      case 17:
        return "DarkInk";
      case 19:
        return "DarkRed";
      default:
        return "LightInk";
    }
  }

  @computed
  get text(): string {
    const { status } = this.props;
    switch (status) {
      case 4:
        return i`Ready To Submit`;
      case 6:
        return `Ready To Submit`;
      case 7:
        return i`Submitted`;
      case 8:
        return i`Shipped`;
      case 9:
        return i`In Transit`;
      case 10:
        return i`Delivered`;
      case 11:
        return i`Delivery Confirmed`;
      case 13:
        return i`Complete`;
      case 15:
        return i`Expired`;
      case 17:
        return i`Processing`;
      case 19:
        return i`Submission Fail`;
      default:
        return i`Unknown`;
    }
  }

  render() {
    return (
      <ThemedLabel
        theme={this.theme}
        style={{ width: 112 }}
        className={css(this.styles.root)}
      >
        {this.text}
      </ThemedLabel>
    );
  }
}

export default ShippingPlanStatusLabel;
