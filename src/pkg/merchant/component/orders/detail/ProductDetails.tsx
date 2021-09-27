import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* External Libraries */
import toHex from "colornames";
import numeral from "numeral";

/* Legacy */
import MiniProductDetailModalView from "@legacy/view/modal/MiniProductDetail";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { ObjectId } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";
import { CopyButton } from "@ContextLogic/lego";

import TaxSheetItems from "./tax/TaxSheetItems";
import ProductImage from "@merchant/component/products/ProductImage";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";

import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import AdvancedLogisticsPendingLabel from "./AdvancedLogisticsPendingLabel";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { OrderDetailInitialData } from "@toolkit/orders/detail";

export type ProductDetailsProps = BaseProps & {
  readonly initialData: OrderDetailInitialData;
};

const RowHeight = 50;

@observer
class ProductDetails extends Component<ProductDetailsProps> {
  @computed
  get styles() {
    return StyleSheet.create({
      fixedHeightSheetItem: {
        "@media (max-width: 900px)": {
          height: RowHeight * 1.2,
        },
        "@media (min-width: 900px)": {
          height: RowHeight,
        },
        padding: "0px 20px",
        borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
      },
      sideBySide: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        ":nth-child(1n) > div": {
          flexGrow: 1,
          flexBasis: 0,
          flexShrink: 1,
          ":first-child": {
            borderRight: `1px solid ${palettes.greyScaleColors.Grey}`,
          },
        },
      },
      link: {
        opacity: 1,
        color: palettes.coreColors.WishBlue,
        transition: "opacity 0.3s linear",
        ":hover": {
          opacity: 0.6,
        },
        cursor: "pointer",
        fontWeight: fonts.weightSemibold,
      },
      productImage: {
        width: 32,
        height: 32,
        marginRight: 10,
      },
      colorPad: {
        height: 20,
        width: 35,
        borderRadius: 4,
        marginLeft: 10,
      },
      genericRow: {
        padding: "15px 20px",
        borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
        minHeight: RowHeight,
      },
      fadeOnHover: {
        transition: "opacity 0.3s linear",
        opacity: 1,
        ":hover": {
          opacity: 0.6,
        },
      },
      info: {
        marginLeft: 8,
      },
      amountRemit: {
        fontSize: 14,
        fontWeight: fonts.weightNormal,
        lineHeight: 1.43,
        color: palettes.textColors.Ink,
      },
      amountNoRemit: {
        fontSize: 14,
        fontWeight: fonts.weightNormal,
        lineHeight: 1.43,
        color: palettes.textColors.LightInk,
        textDecoration: "line-through",
      },
      authorityDetail: {
        padding: "16px 24px",
        backgroundBlendMode: "darken",
        backgroundImage:
          "linear-gradient(rgba(238, 242, 245, 0.5), " +
          "rgba(238, 242, 245, 0.5))",
      },
      flexHorizontal: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      valueInfo: {
        marginLeft: 8,
      },
      valueContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      wishPostShippingPending: {
        color: palettes.textColors.LightInk,
        marginLeft: 4,
      },
    });
  }

  renderProductRow() {
    const { initialData } = this.props;
    const {
      fulfillment: {
        order: { variation },
      },
    } = initialData;
    return (
      <div
        style={{ cursor: "pointer" }}
        className={css(this.styles.fadeOnHover)}
        onClick={() => {
          new MiniProductDetailModalView({
            product_id: variation.productId,
          }).render();
        }}
      >
        <ProductImage
          className={css(this.styles.productImage)}
          productId={variation.productId}
        />
        <span style={{ textDecoration: "underline" }}>
          {variation.productName}
        </span>
      </div>
    );
  }

  renderTaxInfo() {
    const { initialData } = this.props;
    return <TaxSheetItems initialData={initialData} />;
  }

  renderWishpostShipping() {
    const {
      initialData: {
        fulfillment: {
          order: {
            isUnityOrder,
            isAdvancedLogistics,
            isRemovedFromAdvancedLogistics,
            initialWishpostShipping,
            hasShipped,
          },
        },
      },
    } = this.props;

    if (
      !isAdvancedLogistics ||
      !isUnityOrder ||
      isRemovedFromAdvancedLogistics ||
      hasShipped == null
    ) {
      return null;
    }

    if (initialWishpostShipping != null) {
      return (
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`WishPost Shipping`}
        >
          {initialWishpostShipping.display}
        </SheetItem>
      );
    }

    return (
      <SheetItem
        className={css(this.styles.fixedHeightSheetItem)}
        title={i`WishPost Shipping`}
      >
        <AdvancedLogisticsPendingLabel />
      </SheetItem>
    );
  }

  renderEstimatedWishpostShipping() {
    const {
      initialData: {
        fulfillment: {
          order: { estimatedWishpostShipping },
        },
      },
    } = this.props;
    if (estimatedWishpostShipping == null) {
      return null;
    }

    return (
      <SheetItem
        className={css(this.styles.fixedHeightSheetItem)}
        title={i`Est. WishPost Shipping`}
      >
        {estimatedWishpostShipping.display}
      </SheetItem>
    );
  }

  render() {
    const { initialData, className, style } = this.props;

    const {
      fulfillment: {
        order: {
          quantity,
          merchantTotal,
          isAdvancedLogistics,
          isRemovedFromAdvancedLogistics,
          isUnityOrder,
          initialWishpostShipping,
          variation,
          merchantCurrencyAtPurchaseTime,
          merchantPrice,
          merchantShipping,
          customer: { pricing },
        },
      },
    } = initialData;

    const wishpostShippingIsPending =
      isUnityOrder &&
      !isRemovedFromAdvancedLogistics &&
      initialWishpostShipping == null;

    let shippingSheetItemTitle = i`Shipping`;
    if (isAdvancedLogistics && !isRemovedFromAdvancedLogistics) {
      shippingSheetItemTitle = i`Advanced Logistics Shipping`;
    }
    if (isUnityOrder && !isRemovedFromAdvancedLogistics) {
      shippingSheetItemTitle = i`First-Mile Shipping Price`;
    }

    return (
      <Card title={i`Product details`} className={css(className, style)}>
        <SheetItem
          className={css(this.styles.genericRow)}
          title={i`Product name`}
        >
          {this.renderProductRow()}
        </SheetItem>
        <div className={css(this.styles.sideBySide)}>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Product ID`}
          >
            <ObjectId id={variation.productId} showFull copyOnBodyClick />
          </SheetItem>
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`SKU`}
          >
            <CopyButton text={variation.sku} copyOnBodyClick>
              {variation.sku}
            </CopyButton>
          </SheetItem>
        </div>
        {variation.size != null && (
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Size`}
          >
            {variation.size}
          </SheetItem>
        )}
        {variation.color != null && (
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Color`}
          >
            <div className={css(this.styles.flexHorizontal)}>
              <div>{variation.color}</div>
              {toHex(variation.color) && (
                <div
                  className={css(this.styles.colorPad)}
                  style={{ backgroundColor: toHex(variation.color) }}
                />
              )}
            </div>
          </SheetItem>
        )}
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`Currency Code`}
        >
          {merchantCurrencyAtPurchaseTime}
        </SheetItem>
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`Price`}
        >
          {merchantPrice.display}
        </SheetItem>
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={shippingSheetItemTitle}
        >
          {merchantShipping.display}
        </SheetItem>
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`Quantity`}
        >
          {numeral(quantity).format("0,0").toString()}
        </SheetItem>
        {pricing.credit != null && pricing.credit.amount > 0 && (
          <SheetItem
            className={css(this.styles.fixedHeightSheetItem)}
            title={i`Gift Card`}
          >
            {formatCurrency(
              pricing.credit.amount,
              merchantCurrencyAtPurchaseTime
            )}
          </SheetItem>
        )}
        {this.renderWishpostShipping()}
        {this.renderEstimatedWishpostShipping()}
        <SheetItem
          className={css(this.styles.fixedHeightSheetItem)}
          title={i`Total`}
        >
          {merchantTotal.display}
          {wishpostShippingIsPending && (
            <i className={css(this.styles.wishPostShippingPending)}>
              (WishPost Shipping amount is pending)
            </i>
          )}
        </SheetItem>
        {this.renderTaxInfo()}
      </Card>
    );
  }
}
export default ProductDetails;
