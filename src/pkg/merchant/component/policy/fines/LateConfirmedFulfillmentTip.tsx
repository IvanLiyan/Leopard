import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import LocalizationStore from "@merchant/stores/LocalizationStore";

export type LateConfirmedFulfillmentTipProps = BaseProps & {
  readonly confirmedFulfillmentTimeRequirement: number;
};

@observer
export default class LateConfirmedFulfillmentTip extends Component<
  LateConfirmedFulfillmentTipProps
> {
  static demoProps: LateConfirmedFulfillmentTipProps = {
    confirmedFulfillmentTimeRequirement: 48,
  };

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        userSelect: "none",
      },
      row: {
        color: palettes.textColors.Ink,
        opacity: 0.99,
        fontSize: 14,
        lineHeight: 1.5,
        margin: 0,
        padding: 0,
        maxWidth: 900,
      },
      link: {
        marginLeft: 2,
      },
    });
  }

  render() {
    const { className } = this.props;
    const { locale } = LocalizationStore.instance();
    if (locale == "zh") {
      return (
        <Tip
          className={css(this.styles.root, className)}
          color={palettes.coreColors.WishBlue}
          icon="tip"
        >
          <div className={css(this.styles.root)}>
            <p className={css(this.styles.row)}>
              <span>
                更快履行订单，
                有助于Wish及时接收物流服务商提供的确认发货信息和物流单号，
                每件产品（商户设定产品价格 + 商户设定运费）&lt;
                100美元的订单需在订单生成168小时内确认发货并提供物流单号，
                每件产品（商户设定产品价格 + 商户设定运费）≥
                100美元的订单需在订单生成336小时内确认发货并提供物流单号。
              </span>
              <Link
                className={css(this.styles.link)}
                href={zendeskURL("360002714354")}
                openInNewTab
              >
                了解更多信息
              </Link>
            </p>
            <div className={css(this.styles.row)}>
              用户乐意了解到他们的订单正在途中并将及时到达。
            </div>
          </div>
        </Tip>
      );
    }
    return (
      <Tip
        className={css(this.styles.root, className)}
        color={palettes.coreColors.WishBlue}
        icon="tip"
      >
        <div className={css(this.styles.root)}>
          <p className={css(this.styles.row)}>
            <span>
              Fulfill an order as soon as possible so that Wish receives
              fulfillment confirmation from the shipping carrier and tracking
              number within 168 hours for orders with (merchant price + shipping
              price) per item &lt; $100, or within 336 hours for orders with
              (merchant price + shipping price) per item ≥ $100.
            </span>
            <Link
              className={css(this.styles.link)}
              href={zendeskURL("360002714354")}
              openInNewTab
            >
              Learn more
            </Link>
          </p>
          <div className={css(this.styles.row)}>
            Customers appreciate knowing that their order is on its way to them
            and will arrive in a timely manner.
          </div>
        </div>
      </Tip>
    );
  }
}
