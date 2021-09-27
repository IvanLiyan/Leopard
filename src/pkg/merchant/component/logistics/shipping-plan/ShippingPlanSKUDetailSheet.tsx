import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { SheetItem } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { ShippingPlanSKU } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ShippingPlanSKUDetailField =
  | "product_name"
  | "product_id"
  | "sku"
  | "parent_sku"
  | "size"
  | "color";

export type ShippingPlanSKUDetailSheetProps = BaseProps & {
  readonly skuItem: ShippingPlanSKU;
  readonly fields: ReadonlyArray<ShippingPlanSKUDetailField>;
};

const TitleWidth = 250;

@observer
class ShippingPlanSKUDetailSheet extends Component<
  ShippingPlanSKUDetailSheetProps
> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      item: {
        marginBottom: 12,
      },
    });
  }

  renderDetail(field: ShippingPlanSKUDetailField) {
    const { skuItem } = this.props;

    switch (field) {
      case "product_name":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Product name`}
            value={skuItem.product_name}
            titleWidth={TitleWidth}
          />
        );
      case "product_id":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Product ID`}
            value={skuItem.product_id}
            titleWidth={TitleWidth}
          />
        );
      case "sku":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Variation SKU`}
            value={skuItem.sku || ""}
            titleWidth={TitleWidth}
          />
        );
      case "parent_sku":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Parent SKU`}
            value={skuItem.parent_sku}
            titleWidth={TitleWidth}
          />
        );
      case "size":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Size`}
            value={skuItem.size}
            titleWidth={TitleWidth}
          />
        );
      case "color":
        return (
          <SheetItem
            key={field}
            className={css(this.styles.item)}
            title={i`Color`}
            value={skuItem.color}
            titleWidth={TitleWidth}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { className, fields } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        {fields.map((field) => this.renderDetail(field))}
      </div>
    );
  }
}

export default ShippingPlanSKUDetailSheet;
