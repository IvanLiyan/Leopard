import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Pager } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant Components */
import FBWInventoryListTable from "@merchant/component/logistics/fbw/inventory-list/FbwInventoryListTable";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbw";

import { ProductLevelInventory } from "@merchant/api/fbw";

type TabKey = string | "ALL";

const FBWInventoryContainer = () => {
  const { dimenStore, routeStore } = AppStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const styles = useStyleSheet();

  const requestWarehouse = api.getWarehouses({ express_only: false });
  const warehouses = requestWarehouse.response?.data?.warehouses || [];
  const WarehousesPerPage = 7;
  const warehousePagers = [
    {
      id: "all",
      name: i`All Products`,
      code: "FBW-ALL",
    },
    ...warehouses,
  ];

  const { tabPath } = usePathParams("/fbw/inventory/:tabPath");
  const listingPageActionLogger = useLogger(
    "FBW_INVENTORY_LISTING_PAGE_ACTION"
  );

  const onTabChange = (nextTab: TabKey) => {
    listingPageActionLogger.info({
      action: LogActions.CLICK_TAB_CHANGE,
      detail: nextTab,
    });
    routeStore.push(`/fbw/inventory/${nextTab}`);
  };

  const currentTab = !tabPath || tabPath.trim().length === 0 ? "ALL" : tabPath;

  const requestMerchantCurrency = api.getFBWMerchantCurrency({});
  const merchantCurrency =
    requestMerchantCurrency.response?.data?.merchant_currency || "USD";
  const localizedCurrency =
    requestMerchantCurrency.response?.data?.localized_currency || "USD";

  const [updatedInventories, setUpdatedInventories] = useState<
    ReadonlyArray<ProductLevelInventory>
  >([]);

  const addUpdatedInventory = (inventory: ProductLevelInventory) => {
    const existingUpdatedInventories = new Set<ProductLevelInventory>(
      updatedInventories
    );
    existingUpdatedInventories.add(inventory);
    setUpdatedInventories(Array.from(existingUpdatedInventories));
  };

  const getWarehouseNameByCode = (warehouseCode: string) => {
    for (const warehouse of warehouses) {
      if (warehouse.name.includes(warehouseCode)) {
        return warehouse.name;
      }
    }
    return null;
  };

  return (
    <div className={css(styles.root)}>
      <WelcomeHeader
        title={i`FBW Inventory`}
        body={
          i`Here's an overview of your FBW inventory. ` +
          i`You can manage your inbound products ` +
          i`across all FBW warehouses.`
        }
        paddingX={pageX}
        illustration="fbwInventoryListing"
        className={css(styles.header)}
        hideBorder
      />
      <Pager
        tabsPadding={`0px ${pageX}`}
        onTabChange={onTabChange}
        selectedTabKey={currentTab}
        equalSizeTabs={false}
        hideHeaderBorder={false}
        maxVisibleTabs={WarehousesPerPage}
      >
        {warehousePagers.map((option) => {
          return (
            <Pager.Content
              titleValue={option.name}
              tabKey={option.code.slice(-3).toUpperCase()}
              key={option.code}
            >
              <div className={css(styles.content)}>
                <FBWInventoryListTable
                  warehouses={warehouses}
                  merchantCurrency={merchantCurrency}
                  localizedCurrency={localizedCurrency}
                  tabSelection={option.code.slice(-3).toUpperCase()}
                  getWarehouseNameByCode={getWarehouseNameByCode}
                  addUpdatedInventory={addUpdatedInventory}
                />
              </div>
            </Pager.Content>
          );
        })}
      </Pager>
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
    [pageX, textWhite, pageBackground]
  );
};

export default observer(FBWInventoryContainer);
