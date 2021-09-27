import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type TrackingNumberProps = BaseProps & {
  readonly number: string | null | undefined;
  readonly isValid: boolean;
  readonly orderId: string;
};

@observer
class TrackingNumber extends Component<TrackingNumberProps> {
  static demoProps: TrackingNumberProps = {
    number: "5ad4a70675a6377e2e0ad6d5",
    isValid: true,
    orderId: "5ad8b69bfb2ca1536aa54d6c",
  };

  @computed
  get styles() {
    const { isValid, number } = this.props;
    return StyleSheet.create({
      root: {
        fontSize: 14,
        fontWeight: fonts.weightSemibold,
        lineHeight: 1.43,
      },
      number: {
        color:
          number != null && isValid
            ? palettes.coreColors.WishBlue
            : palettes.reds.DarkerRed,
      },
    });
  }

  render() {
    const { number, orderId, className } = this.props;
    return (
      <CopyButton className={css(this.styles.root, className)} text={number}>
        <Link
          className={css(this.styles.number)}
          href={`/order/${orderId}#tracking`}
          openInNewTab
        >
          {number == null ? i`No Tracking Number` : number}
        </Link>
      </CopyButton>
    );
  }
}
export default TrackingNumber;
