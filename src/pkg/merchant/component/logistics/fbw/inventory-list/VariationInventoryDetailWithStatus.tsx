import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import { VariationLevelInventory } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type VariationInventoryDetailWithStatusProp = BaseProps & {
  readonly inventory: VariationLevelInventory;
};

const VariationInventoryDetailWithStatus = (
  props: VariationInventoryDetailWithStatusProp
) => {
  const styles = useStyleSheet();
  const { inventory } = props;

  return (
    <>
      <div className={css(styles.variationDetail)}>
        {inventory.variation_SKU}
      </div>
      {!inventory.fbw_active && (
        <div className={css(styles.variationStatus)}>
          <div className={css(styles.disabledStatus)}>
            (Temporarily disabled)
          </div>
          <Info
            text={
              i`This SKU is temporarily disabled on FBW program ` +
              i`and will not be sold in all FBW warehouses.`
            }
            size={16}
          />
        </div>
      )}
      {inventory.warehouse_code === "TLL" &&
        !inventory.warehouse_allow_selling && (
          <div className={css(styles.variationStatus)}>
            <div className={css(styles.disabledStatus)}>
              (Outbound fulfillment temporarily paused)
            </div>
            <Info
              text={
                i`Outbound fulfillment from this warehouse is temporarily paused due ` +
                i`to warehouse relocation. [Learn more](${zendeskURL(
                  "1260802095330"
                )})`
              }
              size={16}
            />
          </div>
        )}
    </>
  );
};

export default observer(VariationInventoryDetailWithStatus);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        variationDetail: {},
        variationStatus: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        disabledStatus: {
          marginRight: 5,
        },
      }),
    []
  );
};
