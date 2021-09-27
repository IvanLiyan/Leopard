import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { ObjectId } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Relative Imports */
import ExpandedInventoryTable from "./ExpandedInventoryTable";
import InventoryShippingPriceRange from "./InventoryShippingPriceRange";

import { ProductLevelInventory } from "@merchant/api/fbw";
import { TableAction } from "@ContextLogic/lego";
import { InventoryIdTriple, TabSelection } from "./FbwInventoryListTable";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import * as api from "@merchant/api/fbw";
import { LoadingIndicator } from "@ContextLogic/lego";
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbw";
import FbwInventoryUpdateShippingPriceModal from "@merchant/component/logistics/fbw/inventory-list/FbwInventoryUpdateShippingPriceModal";

export type FbwInventoryListTableContentProp = BaseProps & {
  readonly tabSelection: TabSelection;
  readonly merchantCurrency: string;
  readonly localizedCurrency: string;
  readonly isLoading: boolean;
  readonly fbwInventories: ReadonlyArray<api.ProductLevelInventory>;
  readonly getWarehouseNameByCode: (arg0: string) => string | null | undefined;
  readonly addUpdatedInventory: (arg0: ProductLevelInventory) => unknown;
};

const FbwInventoryListTableContent = (
  props: FbwInventoryListTableContentProp
) => {
  const {
    tabSelection,
    merchantCurrency,
    localizedCurrency,
    fbwInventories,
    isLoading,
    getWarehouseNameByCode,
    addUpdatedInventory,
  } = props;

  const listingPageActionLogger = useLogger(
    "FBW_INVENTORY_LISTING_PAGE_ACTION"
  );

  // update shipping price component
  let shippingPriceUpdatesInModal = {};

  const addToShippingPriceUpdateInModal = (dest: string, price: string) => {
    (shippingPriceUpdatesInModal as any)[dest] = price ? Number(price) : "";
  };

  const clearShippingPriceUpdateInModal = () => {
    shippingPriceUpdatesInModal = {};
  };

  const handleUpdateButtonClickWithIds = (inventoryIds: InventoryIdTriple) => {
    return async () => {
      listingPageActionLogger.info({
        action: LogActions.CLICK_UPDATE_IN_SHIPPING_PRICE_MODAL,
        detail: [
          inventoryIds.warehouseId,
          inventoryIds.productId,
          inventoryIds.variationId,
        ].join(),
      });

      // No need to make the API call if there is no updates
      if (!Object.keys(shippingPriceUpdatesInModal).length) {
        return;
      }

      const params = {
        warehouse_id: inventoryIds.warehouseId,
        product_id: inventoryIds.productId,
        updates: JSON.stringify(shippingPriceUpdatesInModal || {}),
        ...(inventoryIds.variationId
          ? { variation_id: inventoryIds.variationId }
          : {}),
      };

      shippingPriceUpdatesInModal = {};

      const resp = await api.updateFBWInventoryShippingPrice(params).call();
      const updatedInventory = resp.data?.updated_inventory;

      if (updatedInventory) {
        addUpdatedInventory(updatedInventory);
      }
    };
  };

  // force disable action
  const handleConfirmForceSecondaryButtonClickWithIds = (
    inventoryIds: InventoryIdTriple,
    active: boolean
  ) => {
    return async () => {
      const params = {
        warehouse_id: inventoryIds.warehouseId,
        product_id: inventoryIds.productId,
        variation_id: inventoryIds.variationId || "",
        active,
      };

      const resp = await api.updateVariationInventoryStatus(params).call();
      const updatedInventory = resp.data?.updated_inventory;

      if (updatedInventory) {
        addUpdatedInventory(updatedInventory);
      }
    };
  };

  // render table
  const tableActions = useTableActions({
    ...props,
    handleUpdateButtonClickWithIds,
    addToShippingPriceUpdateInModal,
    clearShippingPriceUpdateInModal,
  });

  // expand detail component
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    listingPageActionLogger.info({
      action: LogActions.CLICK_EXPAND_OR_COLLAPSE_INVENTORY,
      detail: index.toString(),
    });
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const isAllProductTab = tabSelection === "ALL";
  // The CN warehouses are temporarily left out of the FBS active warehouse
  const styles = useStyleSheet();

  if (isLoading || !fbwInventories) {
    return <LoadingIndicator type="swinging-bar" />;
  }

  return (
    <Table
      className={css(styles.root)}
      data={fbwInventories}
      actions={tableActions}
      stickyTableHeight={800}
      maxVisibleColumns={9}
      noDataMessage={i`There is no FBW inventory`}
      rowExpands={() => true}
      renderExpanded={(row) => (
        <ExpandedInventoryTable
          isAllProductTab={isAllProductTab}
          isFBSActiveWarehouseTab={false}
          inventory={row}
          merchantCurrency={merchantCurrency}
          localizedCurrency={localizedCurrency}
          handleUpdateButtonClickWithIds={handleUpdateButtonClickWithIds}
          handleConfirmForceSecondaryButtonClickWithIds={
            handleConfirmForceSecondaryButtonClickWithIds
          }
          addToShippingPriceUpdateInModal={addToShippingPriceUpdateInModal}
          clearShippingPriceUpdateInModal={clearShippingPriceUpdateInModal}
          getWarehouseNameByCode={getWarehouseNameByCode}
        />
      )}
      onRowExpandToggled={onRowExpandToggled}
      expandedRows={Array.from(expandedRows)}
      highlightRowOnHover
      actionColumnWidth={240}
    >
      <ProductColumn title={i`Product`} columnKey="product_id" width={300} />
      <Table.Column title={i`Product ID`} columnKey="product_SKU">
        {({ row }) => <ObjectId id={row.product_id} copyOnBodyClick />}
      </Table.Column>
      {isAllProductTab && (
        <Table.Column title={i`Location`} columnKey="warehouse_code">
          {({ row }) =>
            row.warehouse_code === "store" ? (
              <div>Store</div>
            ) : (
              <div>{row.warehouse_code}</div>
            )
          }
        </Table.Column>
      )}
      {!isAllProductTab && (
        <Table.Column title={i`Variation SKU`} columnKey="warehouse_code">
          {({ row }) => {
            const variationStr = i`${row.variation_inventory.length} Variations`;
            return <div>{variationStr}</div>;
          }}
        </Table.Column>
      )}
      {isAllProductTab && (
        <Table.NumeralColumn
          title={i`Pending`}
          columnKey="pending"
          description={i`Pending products for FBW warehouse/Store(FBS).`}
        />
      )}
      {!isAllProductTab && (
        <Table.NumeralColumn
          title={i`Pending in Warehouse`}
          columnKey="pending"
          description={i`Pending products for FBW warehouse/Store(FBS).`}
        />
      )}
      {isAllProductTab && (
        <Table.NumeralColumn
          title={i`Active`}
          columnKey="active"
          description={i`Active products stocked in your FBW warehouse/Store(FBS).`}
        />
      )}
      {!isAllProductTab && (
        <Table.NumeralColumn
          title={i`Active in Warehouse`}
          columnKey="active"
          description={i`Active products stocked in your FBW warehouse/Store(FBS).`}
        />
      )}
      <Table.Column
        title={i`Shipping Price`}
        columnKey="warehouse_id"
        description={
          i`Product/variation (SKU) shipping price. ` +
          i`Unset it or press the 'Force Disable' button to disable for sale.`
        }
        multiline
      >
        {({ row }) => (
          <InventoryShippingPriceRange
            inventory={row}
            merchantCurrency={merchantCurrency}
            localizedCurrency={localizedCurrency}
          />
        )}
      </Table.Column>
    </Table>
  );
};

export default observer(FbwInventoryListTableContent);

const useStyleSheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        descriptionContent: {
          fontSize: 13,
          lineHeight: 1.43,
          fontWeight: fonts.weightNormal,
          color: textBlack,
          padding: 13,
          maxWidth: 350,
          textAlign: "left",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
        },
      }),
    [textBlack]
  );
};

const useTableActions = (props: UseTableActionsProps): Array<TableAction> => {
  const {
    merchantCurrency,
    localizedCurrency,
    handleUpdateButtonClickWithIds,
    addToShippingPriceUpdateInModal,
    clearShippingPriceUpdateInModal,
    getWarehouseNameByCode,
  } = props;
  const listingPageActionLogger = useLogger(
    "FBW_INVENTORY_LISTING_PAGE_ACTION"
  );

  const logOnClick = (productId: string) => {
    listingPageActionLogger.info({
      action: LogActions.CLICK_SET_OR_EDIT_PRODUCT_SHIPPING_PRICE,
      product_id: productId,
    });
  };

  return [
    {
      key: "edit_shipping_price",
      name: i`Edit Product Shipping Price`,
      canBatch: false,
      canApplyToRow: (row) =>
        row.warehouse_code !== "store" &&
        inventoryHasShippingPrice(row, merchantCurrency),
      apply: ([productInventory]: ReadonlyArray<ProductLevelInventory>) => {
        logOnClick(productInventory.product_id);
        new FbwInventoryUpdateShippingPriceModal({
          productLevelInventory: productInventory,
          variationLevelInventory: null,
          merchantCurrency,
          localizedCurrency,
          handleUpdateButtonClick: handleUpdateButtonClickWithIds({
            warehouseId: productInventory.warehouse_id,
            productId: productInventory.product_id,
            variationId: null,
          }),
          addToShippingPriceUpdateInModal,
          clearShippingPriceUpdateInModal,
          getWarehouseNameByCode,
        }).render();
      },
    },
    {
      key: "set_shipping_price",
      name: i`Set Product Shipping Price`,
      canBatch: false,
      canApplyToRow: (row) =>
        row.warehouse_code !== "store" &&
        !inventoryHasShippingPrice(row, merchantCurrency),
      apply: ([productInventory]: ReadonlyArray<ProductLevelInventory>) => {
        logOnClick(productInventory.product_id);
        new FbwInventoryUpdateShippingPriceModal({
          productLevelInventory: productInventory,
          variationLevelInventory: null,
          merchantCurrency,
          localizedCurrency,
          handleUpdateButtonClick: handleUpdateButtonClickWithIds({
            warehouseId: productInventory.warehouse_id,
            productId: productInventory.product_id,
            variationId: null,
          }),
          addToShippingPriceUpdateInModal,
          clearShippingPriceUpdateInModal,
          getWarehouseNameByCode,
        }).render();
      },
    },
  ];
};

export type UseTableActionsProps = FbwInventoryListTableContentProp & {
  readonly handleUpdateButtonClickWithIds: (
    inventoryIds: InventoryIdTriple
  ) => () => unknown;
  readonly addToShippingPriceUpdateInModal: (
    destination: string,
    price: string
  ) => unknown;
  readonly clearShippingPriceUpdateInModal: () => unknown;
};

const inventoryHasShippingPrice = (
  inventory: ProductLevelInventory,
  merchantCurrency: string
) => {
  if (
    merchantCurrency === "USD" &&
    inventory.shipping_price_range.min_price != null
  ) {
    return true;
  }
  if (
    merchantCurrency !== "USD" &&
    inventory.shipping_price_range.min_localized_price != null
  ) {
    return true;
  }
  return false;
};
