import React, { Component } from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Label } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { LabelProps } from "@ContextLogic/lego";
import LocalizationStore from "@merchant/stores/LocalizationStore";

export type TicketState =
  | "new"
  | "awaitingAdmin"
  | "awaitingMerchant"
  | "approved"
  | "rejected";

export type StateLabelProps = BaseProps & {
  readonly state: TicketState;
};

@observer
class StateLabel extends Component<StateLabelProps> {
  @computed
  get labelProps(): LabelProps | null | undefined {
    const { state } = this.props;
    const { locale } = LocalizationStore.instance();
    const isZh = locale === "zh";

    switch (state) {
      case "new":
        return {
          text: i`First notice to merchant`,
          textColor: "#5b3333",
          backgroundColor: palettes.yellows.LightYellow,
        };
      case "awaitingAdmin":
        return {
          text: i`Waiting for reviewer`,
          textColor: "#5b3333",
          backgroundColor: palettes.yellows.LightYellow,
        };
      case "awaitingMerchant":
        return {
          text: i`Waiting for merchant`,
          textColor: "#5b3333",
          backgroundColor: palettes.yellows.LightYellow,
        };
      case "approved":
        return {
          text: isZh ? "已批准" : i`Approved`,
          textColor: palettes.textColors.White,
          backgroundColor: palettes.greens.CashGreen,
        };
      case "rejected":
        return {
          text: isZh ? "已拒绝" : i`Rejected`,
          textColor: palettes.textColors.White,
          backgroundColor: palettes.reds.DarkRed,
        };
      default:
        return null;
    }
  }

  render() {
    const { className, style } = this.props;
    if (this.labelProps) {
      const rootCSS = css(style, className);
      return <Label className={rootCSS} {...this.labelProps} />;
    }
    return null;
  }
}

export default StateLabel;
