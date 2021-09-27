/* eslint-disable local-rules/no-frozen-width */

/* eslint-disable local-rules/validate-root */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import numeral from "numeral";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";

/* Merchant Components */
import ProductImage from "@merchant/component/products/ProductImage";

/* SVGs */
import bannerImg from "@assets/img/product-boost/product_boost_automated_campaign_banner.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ProductBoostCampaignBannerImgProps = BaseProps & {
  readonly campaign: any;
};

@observer
class ProductBoostCampaignBannerImg extends Component<
  ProductBoostCampaignBannerImgProps
> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        position: "relative",
        height: "112px",
        minWidth: "400px",
        boxShadow: "0 4px 12px 0 rgba(47, 183, 236, 0.32)",
      },
      productImage: {
        zIndex: 2,
        position: "relative",
        height: "112px",
        width: "112px",
        borderRadius: "4px",
      },
      bannerImage: {
        zIndex: 1,
        position: "absolute",
        height: "112px",
        backgroundColor: "white",
        left: "0px",
        borderRadius: "4px",
      },
      discountStr: {
        zIndex: 2,
        fontSize: "40px",
        position: "relative",
        fontWeight: fonts.weightSemibold,
        left: "20px",
        top: "17px",
      },
    });
  }

  render() {
    const { campaign } = this.props;
    const discountStr = numeral(campaign.discount).format("0%");

    return (
      <div className={css(this.styles.root)}>
        <ProductImage
          className={css(this.styles.productImage)}
          productId={campaign.product_id}
        />

        <img
          className={css(this.styles.bannerImage)}
          draggable={false}
          src={bannerImg}
          alt="bannerImg"
        />
        <span className={css(this.styles.discountStr)}>{discountStr}</span>
      </div>
    );
  }
}
export default ProductBoostCampaignBannerImg;
