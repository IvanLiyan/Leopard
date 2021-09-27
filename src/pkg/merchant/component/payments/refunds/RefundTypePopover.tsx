import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

@observer
class RefundTypePopover extends React.Component<BaseProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      refundTypePopover: {
        maxWidth: 250,
        fontSize: 13,
        margin: 13,
        fontFamily: fonts.proxima,
        fontWeight: fonts.weightNormal,
      },
      refundTypePopoverTitle: {
        fontWeight: fonts.weightBold,
      },
    });
  }

  render() {
    return (
      <div className={css(this.styles.refundTypePopover)}>
        <div className={css(this.styles.refundTypePopoverTitle)}>
          Partial refund:
        </div>
        <p>
          The partial refund percentage (%) that is applied to the merchant's
          total cost.
        </p>
        <div className={css(this.styles.refundTypePopoverTitle)}>
          Quantity refund:
        </div>
        <p>
          The refund quantity that is applied to the total quantity of the
          order.
        </p>
      </div>
    );
  }
}
export default RefundTypePopover;
