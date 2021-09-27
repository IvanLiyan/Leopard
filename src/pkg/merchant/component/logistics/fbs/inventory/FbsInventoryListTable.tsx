import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PageIndicator } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Toolkit */
import { useStringArrayQueryParam } from "@toolkit/url";
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbw";

/* Relative Imports */
import FbsInventoryListTableContent from "@merchant/component/logistics/fbs/inventory/FbsInventoryListTableContent";
import InventoryListFilter, {
  FilterType,
  FilterCredential,
} from "@merchant/component/logistics/fbw/inventory-list/InventoryListFilter";
import InventoryListSearch from "@merchant/component/logistics/fbw/inventory-list/InventoryListSearch";

import { ProductLevelInventory } from "@merchant/api/fbw";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBSInventoryListTableProps = BaseProps & {
  readonly inventories: ReadonlyArray<ProductLevelInventory> | null;
  readonly merchantCurrency: string;
  readonly localizedCurrency: string;
  readonly addUpdatedInventory: (arg0: ProductLevelInventory) => unknown;
};

export type InventoryIdTriple = {
  readonly warehouseId: string;
  readonly productId: string;
  readonly variationId: string | null | undefined;
};

export type SearchType = "id" | "sku" | "variationSku";
export type WarehouseCode = string | "store";
export type TabSelection = string | "ALL";

const FbsInventoryListTable = observer((props: FBSInventoryListTableProps) => {
  const styles = useStyleSheet();
  const { inventories, merchantCurrency } = props;

  // states declaration
  const [productStatusFilterSelections, setProductStatusFilterSelections] =
    useStringArrayQueryParam("product_status");
  const [inventoryStatusFilterSelections, setInventoryStatusFilterSelections] =
    useStringArrayQueryParam("inventory_status");

  const [searchType, setSearchType] = useState<SearchType>("id");
  const [searchToken, setSearchToken] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const resp = await api.getWarehouses({ express_only: false }).call();
      const { data } = resp;
      if (!data) {
        return;
      }
      const selections: string[] = Array.from(
        new Set<string>(
          data.warehouses.map((w) => w.code.slice(-3).toUpperCase()),
        ),
      );
      selections.push("store");
    };

    fetchData();
    setProductStatusFilterSelections(["not-removed", "removed"]);
  }, [setProductStatusFilterSelections]);

  // filter data to display on page
  const isDataFiltered = (data: ProductLevelInventory) => {
    // product status filter
    const filteredByProductStatus =
      (!productStatusFilterSelections.includes("not-removed") &&
        data.removed === true) ||
      (!productStatusFilterSelections.includes("removed") &&
        data.removed === false);
    // inventory status filter
    const filteredByInventoryStatus =
      inventoryStatusFilterSelections.includes("in-stock") &&
      data.pending === 0 &&
      data.active === 0;
    const filterByShippingPriceNotSet =
      inventoryStatusFilterSelections.includes(
        "product-shipping-price-not-set",
      ) && inventoryHasShippingPrice(data, merchantCurrency);
    // search
    const filteredBySearch =
      searchToken &&
      ((searchType === "id" && searchToken !== data.product_id) ||
        (searchType === "sku" && searchToken !== data.product_SKU) ||
        (searchType === "variationSku" &&
          !inventoryContainsVariationSKU(data, searchToken)));
    return (
      filteredByProductStatus ||
      filteredByInventoryStatus ||
      filteredBySearch ||
      filterByShippingPriceNotSet
    );
  };

  const dataOnPage = inventories
    ? inventories.filter((d) => !isDataFiltered(d))
    : [];

  // page indicator component
  const [itemsInOnePage, setItemsInOnePage] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);
  const totalItems = dataOnPage.length;
  const rangeStart = currentPage * itemsInOnePage + 1;
  const rangeEnd = Math.min(
    currentPage * itemsInOnePage + itemsInOnePage,
    totalItems,
  );
  const hasNext = Math.floor((totalItems - 1) / itemsInOnePage) !== currentPage;
  const hasPrev = currentPage !== 0;

  const displayedRows = dataOnPage.slice(rangeStart - 1, rangeEnd);
  const listingPageActionLogger = useLogger(
    "FBW_INVENTORY_LISTING_PAGE_ACTION",
  );

  const logFilterSelection = (filter: FilterType | string) => {
    listingPageActionLogger.info({
      action: LogActions.CLICK_FILTER_BUTTON,
      detail: filter,
    });
  };

  const onPageChange = (currentPage: number) => {
    listingPageActionLogger.info({
      action: LogActions.CLICK_PAGE_CHANGE,
      detail: currentPage.toString(),
    });
    setCurrentPage(currentPage);
  };

  // filter component
  const productStatusFilters: ReadonlyArray<OptionType<FilterType>> = [
    { title: i`Not removed`, value: "not-removed" },
    { title: i`Removed`, value: "removed" },
  ];

  const inventoryStatusFilters: ReadonlyArray<OptionType<FilterType>> = [
    { title: i`In stock`, value: "in-stock" },
    {
      title: i`Product shipping price not set`,
      value: "product-shipping-price-not-set",
    },
  ];

  const productStatusCredential: FilterCredential = {
    title: i`Product status`,
    queryParamKey: "product_status",
    options: productStatusFilters,
  };

  const inventoryStatusCredential: FilterCredential = {
    title: i`Inventory status`,
    queryParamKey: "inventory_status",
    options: inventoryStatusFilters,
  };

  const onDeselectAllClicked = () => {
    logFilterSelection("deselect all");
    setProductStatusFilterSelections([]);
    setInventoryStatusFilterSelections([]);
  };

  const filterCredentials: ReadonlyArray<FilterCredential> = [
    productStatusCredential,
    inventoryStatusCredential,
  ];

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

  // render table

  if (!inventories && !Array.isArray(inventories)) {
    return <LoadingIndicator type="swinging-bar" />;
  }

  const onSearch = (searchType: SearchType, searchToken: string) => {
    setSearchType(searchType);
    setSearchToken(searchToken);
    setCurrentPage(0);
  };

  return (
    <>
      <div className={css(styles.tableContainer)}>
        <div className={css(styles.buttonsRow)}>
          <div className={css(styles.buttonsLeft)}>
            <InventoryListSearch onSearch={onSearch} />
          </div>
          <div className={css(styles.buttonsRight)}>
            <PageIndicator
              className={css(styles.pageIndicator)}
              totalItems={totalItems}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              hasNext={hasNext}
              hasPrev={hasPrev}
              currentPage={currentPage}
              onPageChange={(value) => onPageChange(value)}
            />
            <div className={css(styles.itemsPerPage)}>Items per page</div>
            <Select
              className={css(styles.itemsPerPage)}
              options={[
                { value: 50, text: i`50` },
                { value: 100, text: i`100` },
                { value: 250, text: i`250` },
              ]}
              onSelected={(value) => {
                listingPageActionLogger.info({
                  action: LogActions.EDIT_ITEMS_PER_PAGE,
                  detail: value.toString(),
                });
                setItemsInOnePage(value);
              }}
              selectedValue={itemsInOnePage}
              minWidth={50}
              buttonHeight={35}
            />
            <InventoryListFilter
              onDeselectAllClicked={onDeselectAllClicked}
              filterCredentials={filterCredentials}
            />
          </div>
        </div>
        <FbsInventoryListTableContent
          displayedRows={displayedRows}
          onRowExpandToggled={onRowExpandToggled}
          expandedRows={Array.from(expandedRows)}
        />
      </div>
    </>
  );
});

export default FbsInventoryListTable;

const useStyleSheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        buttonsRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
          marginBottom: 25,
        },
        buttonsLeft: {
          display: "flex",
          flexDirection: "row",
        },
        buttonsRight: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        tableContainer: {
          display: "flex",
          flexDirection: "column",
        },
        tableContentContainer: {},
        itemsPerPage: {
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          margin: "0px 10px 0px 0px",
          height: 35,
        },
        pageIndicator: {
          margin: "0px 10px 0px 0px",
        },
        inStockFilter: {
          fontSize: 14,
          color: textBlack,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
      }),
    [textBlack],
  );
};

const inventoryHasShippingPrice = (
  inventory: ProductLevelInventory,
  merchantCurrency: string,
) => {
  if (merchantCurrency === "USD" && inventory.shipping_price_range.min_price) {
    return true;
  }
  if (
    merchantCurrency !== "USD" &&
    inventory.shipping_price_range.min_localized_price
  ) {
    return true;
  }
  return false;
};

const inventoryContainsVariationSKU = (
  inventory: ProductLevelInventory,
  searchSku: string,
) =>
  inventory.variation_inventory.some(
    (inventory) => searchSku === inventory.variation_SKU,
  );
