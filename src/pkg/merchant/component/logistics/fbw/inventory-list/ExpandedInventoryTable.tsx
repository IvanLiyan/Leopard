import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbw";

/* Relative Imports */
import FbwInventoryUpdateShippingPriceModal from "./FbwInventoryUpdateShippingPriceModal";
import InventoryShippingPriceRange from "./InventoryShippingPriceRange";
import VariationInventoryDetailWithStatus from "./VariationInventoryDetailWithStatus";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import {
  ProductLevelInventory,
  VariationLevelInventory,
} from "@merchant/api/fbw";
import { InventoryIdTriple } from "./FbwInventoryListTable";
import { TableAction } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ExpandedInventoryTableProp = BaseProps & {
  readonly isAllProductTab: boolean;
  readonly isFBSActiveWarehouseTab: boolean;
  readonly inventory: ProductLevelInventory;
  readonly merchantCurrency: string;
  readonly localizedCurrency: string;
  readonly handleUpdateButtonClickWithIds: (
    arg0: InventoryIdTriple
  ) => () => unknown;
  readonly handleConfirmForceSecondaryButtonClickWithIds: (
    arg0: InventoryIdTriple,
    arg1: boolean
  ) => () => unknown;
  readonly addToShippingPriceUpdateInModal: (
    arg0: string,
    arg1: string
  ) => unknown;
  readonly clearShippingPriceUpdateInModal: () => unknown;
  readonly getWarehouseNameByCode: (arg0: string) => string | null | undefined;
};

const ExpandedInventoryTable = (props: ExpandedInventoryTableProp) => {
  const {
    isAllProductTab,
    isFBSActiveWarehouseTab,
    inventory,
    merchantCurrency,
    localizedCurrency,
  } = props;

  const variationTableActions = useTableActions(props);

  const styles = useStyleSheet();

  const variationInventories = inventory.variation_inventory;

  return (
    <div className={css(styles.detailRow)}>
      <Table
        className={css(styles.variationInventoryTable)}
        actions={variationTableActions}
        data={variationInventories}
        maxVisibleColumns={9}
        noDataMessage={i`There is no FBW inventory`}
        highlightRowOnHover
        actionColumnWidth={240}
      >
        <Table.Column
          title={i`Variation SKU`}
          columnKey="variation_detail"
          canCopyText
        >
          {({ row }) => <VariationInventoryDetailWithStatus inventory={row} />}
        </Table.Column>
        {isAllProductTab && (
          <Table.NumeralColumn title={i`Pending`} columnKey="pending" />
        )}
        {!isAllProductTab && (
          <Table.NumeralColumn
            title={i`Pending in Warehouse`}
            columnKey="pending"
          />
        )}
        {isAllProductTab && (
          <Table.NumeralColumn title={i`Active`} columnKey="active" />
        )}
        {!isAllProductTab && (
          <Table.NumeralColumn
            title={i`Active in Warehouse`}
            columnKey="active"
          />
        )}
        {isFBSActiveWarehouseTab && (
          <Table.NumeralColumn
            title={i`Pending in Store(FBS)`}
            columnKey="to_store"
          />
        )}
        <Table.Column title={i`Shipping Price`} columnKey="warehouse_id">
          {({ row }) => (
            <InventoryShippingPriceRange
              inventory={row}
              merchantCurrency={merchantCurrency}
              localizedCurrency={localizedCurrency}
            />
          )}
        </Table.Column>
      </Table>
    </div>
  );
};

export default observer(ExpandedInventoryTable);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        detailRow: {
          display: "flex",
          flexDirection: "column",
          background: "#F6F8F9",
        },
        variationInventoryTable: {
          margin: "16px 24px 24px 24px",
          boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.25)",
          border: "solid 1px rgba(175, 199, 209, 0.5)",
        },
      }),
    []
  );
};

const useTableActions = (
  props: ExpandedInventoryTableProp
): Array<TableAction> => {
  const {
    inventory,
    merchantCurrency,
    localizedCurrency,
    handleUpdateButtonClickWithIds,
    handleConfirmForceSecondaryButtonClickWithIds,
    addToShippingPriceUpdateInModal,
    clearShippingPriceUpdateInModal,
    getWarehouseNameByCode,
  } = props;
  const { userStore } = useStore();
  const actionLogger = useLogger("FBW_INVENTORY_LISTING_PAGE_ACTION");
  const logOnClick = (action: string, variationId: string) => {
    actionLogger.info({
      action,
      variation_id: variationId,
    });
  };

  return [
    {
      key: "set_shipping_price",
      name: i`Set SKU Shipping Price`,
      canBatch: false,
      canApplyToRow: (row) =>
        row.warehouse_code !== "store" &&
        row.shipping_price_range.min_price == null,
      apply: ([variationInventory]: ReadonlyArray<VariationLevelInventory>) => {
        logOnClick(
          LogActions.CLICK_SET_VARIATION_SHIPPING_PRICE,
          variationInventory.variation_id
        );
        new FbwInventoryUpdateShippingPriceModal({
          productLevelInventory: inventory,
          variationLevelInventory: variationInventory,
          merchantCurrency,
          localizedCurrency,
          handleUpdateButtonClick: handleUpdateButtonClickWithIds({
            warehouseId: variationInventory.warehouse_id,
            productId: inventory.product_id,
            variationId: variationInventory.variation_id,
          }),
          addToShippingPriceUpdateInModal,
          clearShippingPriceUpdateInModal,
          getWarehouseNameByCode,
        }).render();
      },
    },
    {
      key: "edit_shipping_price",
      name: i`Edit SKU Shipping Price`,
      canBatch: false,
      canApplyToRow: (row) =>
        row.warehouse_code !== "store" &&
        row.shipping_price_range.min_price != null,
      apply: ([variationInventory]: ReadonlyArray<VariationLevelInventory>) => {
        logOnClick(
          LogActions.CLICK_EDIT_VARIATION_SHIPPING_PRICE,
          variationInventory.variation_id
        );
        new FbwInventoryUpdateShippingPriceModal({
          productLevelInventory: inventory,
          variationLevelInventory: variationInventory,
          merchantCurrency,
          localizedCurrency,
          handleUpdateButtonClick: handleUpdateButtonClickWithIds({
            warehouseId: variationInventory.warehouse_id,
            productId: inventory.product_id,
            variationId: variationInventory.variation_id,
          }),
          addToShippingPriceUpdateInModal,
          clearShippingPriceUpdateInModal,
          getWarehouseNameByCode,
        }).render();
      },
    },
    {
      key: "remove_inventory",
      name: i`Remove Inventory`,
      canBatch: false,
      canApplyToRow: (row) => row.warehouse_code !== "store",
      apply: ([variationInventory]: ReadonlyArray<VariationLevelInventory>) => {
        logOnClick(
          LogActions.CLICK_REMOVE_INVENTORY,
          variationInventory.variation_id
        );
        const {
          // Variable name comes from server
          // eslint-disable-next-line @typescript-eslint/naming-convention
          variation_SKU: sku,
          warehouse_id: warehouseId,
        } = variationInventory;
        const url = `${
          window.location.origin
        }/fbw/return-inventory/${encodeURIComponent(sku)}/${warehouseId}`;
        window.open(url);
      },
    },
    {
      key: "quantity history",
      name: i`Quantity History`,
      canBatch: false,
      canApplyToRow: (row) =>
        row.warehouse_code !== "store" && userStore.isSuAdmin,
      apply: ([variationInventory]: ReadonlyArray<VariationLevelInventory>) => {
        logOnClick(
          LogActions.CLICK_QUANTITY_HISTORY,
          variationInventory.variation_id
        );
        const {
          warehouse_id: warehouseId,
          variation_id: variationId,
        } = variationInventory;
        const productId = inventory.product_id;
        const url = `${window.location.origin}/fbw/sku-history/${warehouseId}/${productId}/${variationId}`;
        window.open(url);
      },
    },
    {
      key: "force disable",
      name: i`Force Disable`,
      canBatch: false,
      canApplyToRow: (row) => row.warehouse_code !== "store" && row.fbw_active,
      apply: ([variationInventory]: ReadonlyArray<VariationLevelInventory>) => {
        logOnClick(
          LogActions.CLICK_FORCE_DISABLE,
          variationInventory.variation_id
        );
        new ConfirmationModal(
          i`Are you sure you want to disable SKU: ` +
            i`${variationInventory.variation_detail} ` +
            i`in all the FBW warehouses?`
        )
          .setAction(
            i`Yes`,
            handleConfirmForceSecondaryButtonClickWithIds(
              {
                warehouseId: variationInventory.warehouse_id,
                productId: inventory.product_id,
                variationId: variationInventory.variation_id,
              },
              !variationInventory.fbw_active
            )
          )
          .setCancel(i`No`)
          .setHeader({
            title: i`Disable SKU Confirmation`,
          })
          .render();
      },
    },
    {
      key: "force enable",
      name: i`Force Enable`,
      canBatch: false,
      canApplyToRow: (row) => row.warehouse_code !== "store" && !row.fbw_active,
      apply: ([variationInventory]: ReadonlyArray<VariationLevelInventory>) => {
        logOnClick(
          LogActions.CLICK_FORCE_ENABLE,
          variationInventory.variation_id
        );
        new ConfirmationModal(
          i`Are you sure you want to enable SKU: ` +
            i`${variationInventory.variation_detail} ` +
            i`in all the FBW warehouses?`
        )
          .setAction(
            i`Yes`,
            handleConfirmForceSecondaryButtonClickWithIds(
              {
                warehouseId: variationInventory.warehouse_id,
                productId: inventory.product_id,
                variationId: variationInventory.variation_id,
              },
              !variationInventory.fbw_active
            )
          )
          .setCancel(i`No`)
          .setHeader({
            title: i`Enable SKU Confirmation`,
          })
          .render();
      },
    },
  ];
};
