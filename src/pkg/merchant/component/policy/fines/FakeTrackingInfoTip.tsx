import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FakeTrackingInfoTipProps = BaseProps;

@observer
export default class FakeTrackingInfoTip extends Component<
  FakeTrackingInfoTipProps
> {
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
        maxWidth: 850,
      },
      link: {
        marginLeft: 2,
      },
    });
  }

  render() {
    const { className } = this.props;
    const faqLink = zendeskURL("204531668");
    return (
      <Tip
        className={css(this.styles.root, className)}
        color={palettes.coreColors.WishBlue}
        icon="tip"
      >
        <div className={css(this.styles.root)}>
          <Markdown
            className={css(this.styles.row)}
            openLinksInNewTab
            text={
              i`Please provide a valid and accurate tracking number, and use ` +
              i`shipping carriers from our list of [approved ` +
              i`Shipping Carriers](/documentation/shippingproviders) at ` +
              i`time of fulfillment.`
            }
          />
          <Markdown
            className={css(this.styles.row)}
            style={{ marginTop: 5 }}
            openLinksInNewTab
            text={
              i`For future reference, incorrect tracking information ` +
              i`should be corrected by the merchant as soon as ` +
              i`possible through the "Modify Tracking" tool or ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`Tracking Dispute. [Learn More](${faqLink})`
            }
          />
        </div>
      </Tip>
    );
  }
}
