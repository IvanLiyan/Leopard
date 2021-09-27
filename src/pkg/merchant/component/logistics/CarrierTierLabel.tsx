import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Label } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { LabelProps } from "@ContextLogic/lego";

/* Types */
import { OrderCarrierTier } from "@schema/types";

export type CarrierTierLabelProps = BaseProps & {
  readonly carrierTier: OrderCarrierTier;
};

@observer
class CarrierTierLabel extends Component<CarrierTierLabelProps> {
  @computed
  get labelProps(): LabelProps {
    const { carrierTier } = this.props;
    switch (carrierTier) {
      case "Tier1":
        return {
          text: i`Tier ${1}`,
          position: "top center",
          textColor: palettes.textColors.White,
          backgroundColor: palettes.greens.CashGreen,
          popoverContent:
            i`Very reliable carrier. Order may be ` +
            i`eligible for Tier 1 benefits`,
          popoverMaxWidth: 300,
        };
      case "Tier2":
        return {
          text: i`Tier ${2}`,
          position: "top center",
          textColor: palettes.textColors.White,
          backgroundColor: palettes.cyans.LightCyan,
          popoverContent:
            i`Reliable shipping carrier with ` +
            i`fast delivery rates and low shipping refund rates!`,
          popoverMaxWidth: 300,
        };
      case "Tier3":
        return {
          text: i`Tier ${3}`,
          position: "top center",
          textColor: palettes.textColors.White,
          backgroundColor: palettes.yellows.Yellow,
          popoverContent:
            i`Carrier has a relatively high shipping refund rates ` +
            i`and low delivery rates.`,
          popoverMaxWidth: 300,
        };
      case "Tier4":
        return {
          text: i`Tier ${4}`,
          position: "top center",
          textColor: palettes.textColors.White,
          backgroundColor: palettes.reds.DarkRed,
          popoverContent:
            i` Carrier has poor shipping performance with extremely` +
            i` high shipping refund rates and extremely low delivery rates.`,
          popoverMaxWidth: 300,
        };
      default:
        return {
          text: i`Unknown Tier`,
          position: "top center",
          textColor: "#2b3333",
          backgroundColor: "#cef2fd",
        };
    }
  }

  render() {
    const { className, style } = this.props;
    return (
      <Label
        fontSize={13}
        className={className}
        style={style}
        {...this.labelProps}
      />
    );
  }
}
export default CarrierTierLabel;
