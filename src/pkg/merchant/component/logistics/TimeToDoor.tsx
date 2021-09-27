import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type TimeToDoorProps = BaseProps & {
  readonly ttd: number | null | undefined;
  readonly maxTTD: number | null | undefined;
};

@observer
class TimeToDoor extends Component<TimeToDoorProps> {
  static demoProps: TimeToDoorProps = {
    ttd: 5,
    maxTTD: 6,
  };

  @computed
  get styles() {
    const { ttd, maxTTD } = this.props;

    let textColor: string | null | undefined;
    if (maxTTD == null) {
      textColor = colors.text;
    } else {
      if (ttd === maxTTD) {
        textColor = colors.warningYellow;
      } else {
        textColor =
          ttd != null && ttd < maxTTD
            ? palettes.greens.DarkCashGreen
            : colors.negative;
      }
    }

    return StyleSheet.create({
      root: {
        fontSize: 14,
        fontWeight: fonts.weightNormal,
        lineHeight: 1.43,
        color: textColor,
      },
    });
  }

  render() {
    const { ttd, className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        {ttd === null ? i`Unknown` : i`${ttd} business days`}
      </div>
    );
  }
}
export default TimeToDoor;
