import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import LocalizationStore from "@merchant/stores/LocalizationStore";

export type ConfirmedFulfillmentTimeProps = BaseProps & {
  readonly timeInHours: number | null | undefined;
  readonly requiredTimeInHours: number | null | undefined;
};

@observer
class ConfirmedFulfillmentTime extends Component<
  ConfirmedFulfillmentTimeProps
> {
  static demoProps: ConfirmedFulfillmentTimeProps = {
    timeInHours: 50,
    requiredTimeInHours: 20,
  };

  @computed
  get styles() {
    const { timeInHours, requiredTimeInHours } = this.props;

    let color: string | null | undefined = null;
    if (requiredTimeInHours == null) {
      color = colors.text;
    } else {
      if (timeInHours === requiredTimeInHours) {
        color = colors.warningYellow;
      } else {
        color =
          timeInHours != null && timeInHours < requiredTimeInHours
            ? colors.positive
            : colors.negative;
      }
    }

    return StyleSheet.create({
      root: {
        fontSize: 14,
        fontWeight: fonts.weightNormal,
        lineHeight: 1.43,
      },
      time: {
        color,
      },
      required: {
        color: colors.text,
      },
    });
  }

  renderRequired() {
    const { locale } = LocalizationStore.instance();
    if (locale == "zh") {
      return (
        <span className={css(this.styles.required)}>
          （应根据每件产品的（商户设定产品价格 + 商户设定运费）金额，
          在168小时或336小时内确认履行）
        </span>
      );
    }
    return (
      <span className={css(this.styles.required)}>
        (Should be confirmed within {168} hours or {336} hours, depending on
        (merchant price + shipping price) per item)
      </span>
    );
  }

  render() {
    const { timeInHours, className } = this.props;

    return (
      <div className={css(this.styles.root, className)}>
        <span className={css(this.styles.time)}>
          {timeInHours === null ? i`Unknown` : i`${timeInHours} hours` + " "}
        </span>
        {this.renderRequired()}
      </div>
    );
  }
}
export default ConfirmedFulfillmentTime;
