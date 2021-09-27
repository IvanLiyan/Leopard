import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { ThemeContext } from "@merchant/stores/ThemeStore";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WishExpressDeliveryTipProps = BaseProps & {
  country?: string | null | undefined;
};

const DeliveryRequirements: {
  [cc: string]: number;
} = {
  FR: 6,
  SE: 8,
  AU: 7,
  IT: 6,
  CH: 6,
  ES: 8,
  DK: 6,
  FI: 7,
  NO: 8,
  PR: 7,
};

@observer
export default class WishExpressDeliveryTip extends Component<WishExpressDeliveryTipProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  static demoProps: WishExpressDeliveryTipProps = {
    country: "ES",
  };

  @computed
  get styles() {
    const { textBlack } = this.context;

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        userSelect: "none",
      },
      row: {
        color: textBlack,
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

  @computed
  get maximumTTD(): number {
    const { country } = this.props;
    if (!country) {
      return 5;
    }

    return DeliveryRequirements[country] || 5;
  }

  render() {
    const { country, className } = this.props;
    const { primary } = this.context;

    return (
      <Tip
        className={css(this.styles.root, className)}
        color={primary}
        icon="tip"
      >
        <div className={css(this.styles.root)}>
          <p className={css(this.styles.row)}>
            <span>Wish Express orders must be delivered on time.</span>
            <Link
              className={css(this.styles.link)}
              href="/policy#wish_express"
              openInNewTab
            >
              Learn more
            </Link>
          </p>
          {country && (
            <div className={css(this.styles.row)}>
              <span>
                Customers in {country} need to receive the order within
                {this.maximumTTD}
                business days. Use our top-tier carriers to comply with this
                policy.
              </span>
              <Link
                className={css(this.styles.link)}
                openInNewTab
                href="/documentation/confirmeddeliveryshippingcarriers"
              >
                View Carriers
              </Link>
            </div>
          )}
          <div className={css(this.styles.row)}>
            <span>
              You can dispute a Wish Express order within 11 business days from
              receiving penalty details.
            </span>
            <Link
              className={css(this.styles.link)}
              openInNewTab
              href={zendeskURL("360003324694")}
            >
              Learn more
            </Link>
          </div>
        </div>
      </Tip>
    );
  }
}
