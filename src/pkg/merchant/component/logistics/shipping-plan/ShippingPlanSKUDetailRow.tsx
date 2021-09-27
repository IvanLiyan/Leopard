import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import ShippingPlanSKUDetailSheet from "@merchant/component/logistics/shipping-plan/ShippingPlanSKUDetailSheet";

import { ShippingPlanSKUDetailField } from "@merchant/component/logistics/shipping-plan/ShippingPlanSKUDetailSheet";
import { ShippingPlanSKU } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ShippingPlanSKUDetailRowProps = BaseProps & {
  readonly skuItem: ShippingPlanSKU;
};

@observer
class ShippingPlanSKUDetailRow extends Component<
  ShippingPlanSKUDetailRowProps
> {
  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
    });
  }

  @computed
  get detailFields(): ReadonlyArray<ShippingPlanSKUDetailField> {
    return ["product_id", "product_name", "sku", "parent_sku", "size", "color"];
  }

  render() {
    const { className, skuItem } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <ShippingPlanSKUDetailSheet
          skuItem={skuItem}
          fields={this.detailFields}
        />
      </div>
    );
  }
}
export default ShippingPlanSKUDetailRow;
