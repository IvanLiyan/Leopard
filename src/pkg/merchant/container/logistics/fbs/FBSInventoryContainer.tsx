import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import FBSInventoryListTable from "@merchant/component/logistics/fbs/inventory/FbsInventoryListTable";
import FbsIntroduction from "@merchant/component/logistics/inventory/FbsIntroduction";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

import { ProductLevelInventory } from "@merchant/api/fbw";

type InventoryMap = {
  [index: string]: ProductLevelInventory;
};

const FBSInventoryContainer = () => {
  const { dimenStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const styles = useStyleSheet();

  const requestInventories = api.getFBSInventory({});

  const fbsInventories = requestInventories.response?.data?.inventory || null;
  const merchantCurrency =
    requestInventories.response?.data?.merchant_currency || "USD";
  const localizedCurrency =
    requestInventories.response?.data?.localized_currency || "USD";

  const [updatedInventories, setUpdatedInventories] = useState<
    ReadonlyArray<ProductLevelInventory>
  >([]);
  const dataOnPage = fbsInventories
    ? getInventoriesWithUpdates(fbsInventories, updatedInventories)
    : null;

  const addUpdatedInventory = (inventory: ProductLevelInventory) => {
    const existingUpdatedInventories = new Set<ProductLevelInventory>(
      updatedInventories
    );
    existingUpdatedInventories.add(inventory);
    setUpdatedInventories(Array.from(existingUpdatedInventories));
  };

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`FBS Inventory`}
        body={
          i`Here's an overview of your FBS inventory. ` +
          i`You can manage your inbound products ` +
          i`across all FBW warehouses.`
        }
        paddingX={pageX}
        illustration="fbwInventoryListing"
        className={css(styles.header)}
        hideBorder
      />
      <div className={css(styles.card)}>
        <FbsIntroduction />
      </div>

      <div className={css(styles.content)}>
        <FBSInventoryListTable
          inventories={dataOnPage}
          merchantCurrency={merchantCurrency}
          localizedCurrency={localizedCurrency}
          addUpdatedInventory={addUpdatedInventory}
        />
      </div>
    </div>
  );
};

const useStyleSheet = () => {
  const { dimenStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const { pageBackground, textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        header: {},
        content: {
          paddingLeft: pageX,
          paddingRight: pageX,
          paddingBottom: pageX,
        },
        alert: {
          marginBottom: 8,
        },
        card: {
          paddingLeft: pageX,
          paddingRight: pageX,
          backgroundColor: textWhite,
          paddingBottom: 20,
        },
      }),
    [pageX, pageBackground, textWhite]
  );
};

const getInventoriesWithUpdates = (
  originalInventories: ReadonlyArray<ProductLevelInventory>,
  updatedInventories: ReadonlyArray<ProductLevelInventory>
): ProductLevelInventory[] => {
  const updatedInventoriesDict: InventoryMap = {};
  for (const updatedInventory of updatedInventories) {
    const key = updatedInventory.product_id + updatedInventory.warehouse_id;
    updatedInventoriesDict[key] = updatedInventory;
  }

  const inventoriesWithUpdates: ProductLevelInventory[] = [];
  for (const inventory of originalInventories) {
    const update =
      updatedInventoriesDict[inventory.product_id + inventory.warehouse_id];
    if (update) {
      inventoriesWithUpdates.push(update);
    } else {
      inventoriesWithUpdates.push(inventory);
    }
  }

  return inventoriesWithUpdates;
};

export default observer(FBSInventoryContainer);
