import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { Tip } from "@ContextLogic/lego";
import "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Link from "@next-toolkit/Link";

@observer
export default class MerchantReturnsTip extends Component<BaseProps> {
  @observable
  showBanner = true;

  @computed
  get styles() {
    return StyleSheet.create({
      link: {
        marginLeft: 4,
      },
      bannerText: {
        alignItems: "flex-start",
        color: palettes.textColors.Ink,
        display: "flex",
        flexDirection: "column",
        fontSize: 14,
        fontFamily: fonts.proxima,
      },
      tipTitleText: {
        fontWeight: fonts.weightBold,
      },
      tipText: {
        fontWeight: fonts.weightMedium,
      },
    });
  }

  render() {
    if (!this.showBanner) {
      return null;
    }
    return (
      <Tip color={palettes.coreColors.WishBlue} icon="tip">
        <div className={css(this.styles.bannerText)}>
          <div className={css(this.styles.tipTitleText)}>
            Enroll in the Wish Returns Program
          </div>
          <div className={css(this.styles.tipText)}>
            <span>
              The Wish Returns Program is a great way to reduce customer refund
              rate and reclaim refunded items for future sales. Once eligible
              products are enrolled in the Wish Returns program, customers based
              in supported regions will need to return the products to the
              specified address before receiving refunds.
            </span>
            <Link
              className={css(this.styles.link)}
              href={zendeskURL("360050732014")}
              openInNewTab
              onClick={() => (this.showBanner = false)}
            >
              Learn more
            </Link>
          </div>
        </div>
      </Tip>
    );
  }
}
