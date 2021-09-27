import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import {
  ProductLevelInventory,
  VariationLevelInventory,
  ShippingPriceRange,
} from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type InventoryShippingPriceRangeProp = BaseProps & {
  readonly inventory: ProductLevelInventory | VariationLevelInventory;
  readonly merchantCurrency: string;
  readonly localizedCurrency: string;
};

const InventoryShippingPriceRange = (
  props: InventoryShippingPriceRangeProp
) => {
  const styles = useStyleSheet();
  const { inventory, merchantCurrency, localizedCurrency } = props;

  // return special wording if inventory is a store inventory
  if (inventory.warehouse_code === "store") {
    return (
      <div className={css(styles.storeInventoryPriceColumn)}>
        <div className={css(styles.priceColumn)}>No Action Required</div>
        <Info
          className={css(styles.storeInventoryPriceInfo)}
          text={
            i`The shipping price for your FBS products will be the same as ` +
            i`the FBW product shipping price you set per each originating FBW warehouse; ` +
            i`as a result, you do not need to specifically set shipping prices ` +
            i`for any of your FBS products.`
          }
          size={16}
        />
      </div>
    );
  }
  // return Not Set if no price is fetched
  if (inventory.shipping_price_range.min_price == null) {
    return <div className={css(styles.priceColumn)}>Not Set</div>;
  }
  if (
    merchantCurrency !== "USD" &&
    inventory.shipping_price_range.min_localized_price == null
  ) {
    return <div className={css(styles.priceColumn)}>Not Set</div>;
  }

  // for fully migrated user
  if (merchantCurrency !== "USD") {
    const priceRange = getLocalizedPriceRangeWithCurrency(
      inventory.shipping_price_range,
      merchantCurrency
    );
    return <div className={css(styles.priceColumn)}>{priceRange}</div>;
  }

  // for not migrated user
  if (localizedCurrency === "USD") {
    const priceRange = getPriceRangeWithCurrency(
      inventory.shipping_price_range,
      merchantCurrency
    );
    return <div className={css(styles.priceColumn)}>{priceRange}</div>;
  }

  // for partially migrated user
  const priceRange = getPriceRangeWithCurrency(
    inventory.shipping_price_range,
    merchantCurrency
  );
  const localizedPriceRange = getLocalizedPriceRangeWithCurrency(
    inventory.shipping_price_range,
    localizedCurrency
  );
  return (
    <>
      <div className={css(styles.priceColumn)}>{priceRange}</div>
      <div className={css(styles.priceColumn)}>{localizedPriceRange}</div>
    </>
  );
};

export default observer(InventoryShippingPriceRange);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        priceColumn: {},
        storeInventoryPriceColumn: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        storeInventoryPriceInfo: {
          marginLeft: 10,
        },
      }),
    []
  );
};

export const getPriceRangeWithCurrency = (
  priceRange: ShippingPriceRange,
  currency: string
) => {
  if (priceRange.min_price === priceRange.max_price) {
    if (priceRange.min_price == null) return i`Not Set`;
    return formatCurrency(priceRange.min_price, currency).toString();
  }
  return (
    formatCurrency(priceRange.min_price, currency).toString() +
    "-" +
    formatCurrency(priceRange.max_price, currency).toString()
  );
};

export const getLocalizedPriceRangeWithCurrency = (
  priceRange: ShippingPriceRange,
  currency: string
) => {
  if (priceRange.min_localized_price === priceRange.max_localized_price) {
    if (priceRange.min_localized_price == null) {
      return i`${currency}: Not Set`;
    }
    return formatCurrency(priceRange.min_localized_price, currency).toString();
  }
  return (
    formatCurrency(priceRange.min_localized_price, currency).toString() +
    "-" +
    formatCurrency(priceRange.max_localized_price, currency).toString()
  );
};
