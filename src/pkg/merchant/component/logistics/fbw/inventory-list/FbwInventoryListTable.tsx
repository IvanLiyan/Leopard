import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { CSVLink } from "react-csv";

/* Lego Components */
import { Banner, Button, PageIndicator } from "@ContextLogic/lego";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Toolkit */
import { useStringArrayQueryParam } from "@toolkit/url";
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbw";

/* Relative Imports */
import SetUpShippingPriceTip from "./SetUpShippingPriceTip";
import BulkEditShippingTip from "./BulkEditShippingTip";
import FbwInventoryListTableContent from "./FbwInventoryListTableContent";
import InventoryListFilter, {
  FilterType,
  FilterCredential,
} from "./InventoryListFilter";
import InventoryListSearch from "./InventoryListSearch";

import {
  ProductLevelInventory,
  GetFBWInventoryParams,
  ShippingPriceRange,
} from "@merchant/api/fbw";
import { WarehouseType } from "@toolkit/fbw";
import { CheckboxGroupFieldOptionType as OptionType } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  getLocalizedPriceRangeWithCurrency,
  getPriceRangeWithCurrency,
} from "@merchant/component/logistics/fbw/inventory-list/InventoryShippingPriceRange";
import Link from "react-csv/components/Link";

export type FBWInventoryListTableProps = BaseProps & {
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly merchantCurrency: string;
  readonly localizedCurrency: string;
  readonly tabSelection: TabSelection;
  readonly getWarehouseNameByCode: (arg0: string) => string | null | undefined;
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

const FbwInventoryListTable = (props: FBWInventoryListTableProps) => {
  const styles = useStyleSheet();
  const {
    warehouses,
    merchantCurrency,
    localizedCurrency,
    tabSelection,
    getWarehouseNameByCode,
    addUpdatedInventory,
  } = props;

  const listingPageActionLogger = useLogger(
    "FBW_INVENTORY_LISTING_PAGE_ACTION"
  );

  const logFilterSelection = (filter: FilterType | string) => {
    listingPageActionLogger.info({
      action: LogActions.CLICK_FILTER_BUTTON,
      detail: filter,
    });
  };

  // states declaration
  const [
    warehouseFilterSelections,
    setWarehouseFilterSelections,
  ] = useStringArrayQueryParam("warehouses");
  const [
    productStatusFilterSelections,
    setProductStatusFilterSelections,
  ] = useStringArrayQueryParam("product_status");
  const [
    inventoryStatusFilterSelections,
    setInventoryStatusFilterSelections,
  ] = useStringArrayQueryParam("inventory_status");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fbwInventories, setFbwInventories] = useState<
    ReadonlyArray<api.ProductLevelInventory>
  >([]);
  const [numMissingShippingPrice, setNumMissingShippingPrice] = useState<
    number
  >(0);

  const [searchType, setSearchType] = useState<SearchType>("id");
  const [searchToken, setSearchToken] = useState<string>("");

  // For CSV Export
  const [inventoriesToExport, setInventoriesToExport] = useState<string[][]>(
    []
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const csvLinkRef = useRef<
    Link & HTMLAnchorElement & { link: HTMLAnchorElement }
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      const resp = await api.getWarehouses({ express_only: false }).call();
      const { data } = resp;
      if (!data) {
        return;
      }
      const selections: string[] = Array.from(
        new Set<string>(
          data.warehouses.map((w) => w.code.slice(-3).toUpperCase())
        )
      );
      setWarehouseFilterSelections(selections);
    };
    if (tabSelection === "ALL") {
      fetchData();
    } else {
      setWarehouseFilterSelections([tabSelection]);
    }
    setProductStatusFilterSelections(["not-removed", "removed"]);
  }, [
    tabSelection,
    setWarehouseFilterSelections,
    setProductStatusFilterSelections,
  ]);

  const shippingPriceTipOnClick = () => {
    listingPageActionLogger.info({
      action: LogActions.CLICK_SHIPPING_PRICE_NOT_SET_TIP,
    });
    const selectedInventoryStatus = new Set(inventoryStatusFilterSelections);
    selectedInventoryStatus.add("product-shipping-price-not-set");
    // need to remove store inventories as merchant cannot set shipping price for them
    const selectedWarehouseFilter = new Set(warehouseFilterSelections);
    selectedWarehouseFilter.delete("store");
    setInventoryStatusFilterSelections(Array.from(selectedInventoryStatus));
    setWarehouseFilterSelections(Array.from(selectedWarehouseFilter));
  };

  // page indicator component
  const [itemsInOnePage, setItemsInOnePage] = useState(50);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const rangeStart = currentPage * itemsInOnePage + 1;
  const rangeEnd = Math.min(
    currentPage * itemsInOnePage + itemsInOnePage,
    totalItems
  );
  const hasNext = Math.floor((totalItems - 1) / itemsInOnePage) !== currentPage;
  const hasPrev = currentPage !== 0;

  const onPageChange = (currentPage: number) => {
    listingPageActionLogger.info({
      action: LogActions.CLICK_PAGE_CHANGE,
      detail: currentPage.toString(),
    });
    setCurrentPage(currentPage);
  };

  // filter component
  const warehouseFilters: ReadonlyArray<OptionType<FilterType>> = [
    ...warehouses.map((w) => ({
      title: w.name,
      // Note to who ever wrote this: this is really dangerous and hacky. Should have
      // been expressed in static terms to TypeScript could follow along.
      // `w.code` can be anything -- please do NOT repeat this in the codebase.
      value: w.code.slice(-3).toUpperCase() as FilterType,
    })),
  ];

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

  const warehouseCredential: FilterCredential = {
    title: i`Warehouses`,
    queryParamKey: "warehouses",
    options: warehouseFilters,
  };

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
    setWarehouseFilterSelections([]);
    setProductStatusFilterSelections([]);
    setInventoryStatusFilterSelections([]);
  };

  // For CSV Export
  const onExportClickHandler = async () => {
    setIsDownloading(true);
    const csvData = await fetchInventoriesToExport();
    setInventoriesToExport(csvData);
  };

  useEffect(() => {
    if (
      inventoriesToExport &&
      inventoriesToExport.length > 0 &&
      csvLinkRef.current &&
      csvLinkRef.current.link
    ) {
      setTimeout(() => {
        // @ts-ignore
        csvLinkRef.current.link.click();
        setIsDownloading(false);
      }, 1500);
    }
  }, [inventoriesToExport]);

  const fetchInventoriesToExport = async () => {
    if (warehouseFilterSelections.length == 0) return [];

    const pageSize = 1000;
    let productInventories: ProductLevelInventory[] = [];
    let pageOfInventories: ReadonlyArray<ProductLevelInventory> = [];
    let start = 1;

    do {
      const payload: GetFBWInventoryParams = {
        product_type: "fbw",
        start,
        page_size: pageSize,
        product_status: productStatusFilterSelections,
        inventory_status: inventoryStatusFilterSelections,
        warehouses: warehouseFilterSelections,
      };
      const resp = await api.getFBWInventory(payload).call();
      if (!resp || !resp.data) break;
      pageOfInventories = resp.data.inventory;
      productInventories = [...productInventories, ...pageOfInventories];

      start += pageSize;
    } while (pageOfInventories.length >= pageSize);

    return transformToCSVFormat(productInventories);
  };

  const transformToCSVFormat = (
    productInventories: ProductLevelInventory[]
  ): string[][] => {
    const csvData = [
      [
        i`Variation ID`,
        i`Variation SKU`,
        i`Product ID`,
        i`Product SKU`,
        i`Location`,
        i`Pending Inventory`,
        i`Active Inventory`,
        i`Shipping Price`,
      ],
    ];

    for (const p of productInventories) {
      if (!p.variation_inventory || p.variation_inventory.length == 0) continue;
      for (const v of p.variation_inventory) {
        const row = [
          v.variation_id,
          v.variation_SKU,
          p.product_id,
          p.product_SKU,
          p.warehouse_code,
          v.pending.toString(),
          v.active.toString(),
          getShippingPriceRange(v.shipping_price_range),
        ];

        csvData.push(row);
      }
    }
    return csvData;
  };

  const getShippingPriceRange = (priceRange: ShippingPriceRange) => {
    return merchantCurrency !== "USD"
      ? getLocalizedPriceRangeWithCurrency(priceRange, merchantCurrency)
      : getPriceRangeWithCurrency(priceRange, merchantCurrency);
  };

  const filterCredentials: ReadonlyArray<FilterCredential> =
    tabSelection === "ALL"
      ? [
          warehouseCredential,
          productStatusCredential,
          inventoryStatusCredential,
        ]
      : [productStatusCredential, inventoryStatusCredential];

  const showBulkEditToExternal = false;
  const bulkEditShippingPriceToolTip = showBulkEditToExternal && (
    <BulkEditShippingTip />
  );

  const fetchInventories = useCallback(async () => {
    // No need to re-fetch inventories if no warehouses are selected,
    // UNLESS there is currently inventory being displayed (if no warehouses are
    // selected, no inventory should be displayed).
    if (warehouseFilterSelections.length !== 0 || totalItems !== 0) {
      setIsLoading(true);
      let payload: GetFBWInventoryParams = {
        product_type: "fbw",
        start: rangeStart,
        page_size: itemsInOnePage,
        product_status: productStatusFilterSelections,
        inventory_status: inventoryStatusFilterSelections,
        warehouses: warehouseFilterSelections,
      };
      if (searchToken) {
        payload = {
          ...payload,
          search_type: searchType || "",
          search_token: searchToken || "",
        };
      }
      const resp = await api.getFBWInventory(payload).call();
      const { data } = resp;
      if (!data) {
        return;
      }
      const fbwInventories = resp.data?.inventory || [];
      const totalItems = resp.data?.number_of_results || 0;
      setFbwInventories(fbwInventories);
      setTotalItems(totalItems);

      // tips component
      const numMissingShippingPrice = fbwInventories.filter(
        (inventory: api.ProductLevelInventory) => {
          return (
            !inventoryHasShippingPrice(inventory, merchantCurrency) &&
            inventory.warehouse_code !== "store"
          );
        }
      ).length;
      setNumMissingShippingPrice(numMissingShippingPrice);

      setIsLoading(false);
    }
    // Intended to disable only for the totalItems dependency.
    // Context: totalItems is needed to cover an edge case (rerender when no warehouses
    // are selected but there is displayed inventory), however including it in the deps
    // results in excessive API calls since the call will cause totalItems to change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inventoryStatusFilterSelections,
    searchToken,
    searchType,
    itemsInOnePage,
    merchantCurrency,
    productStatusFilterSelections,
    rangeStart,
    warehouseFilterSelections,
  ]);

  useEffect(() => {
    fetchInventories();
  }, [fetchInventories, warehouseFilterSelections]);

  const onSearch = (searchType: SearchType, searchToken: string) => {
    setSearchType(searchType);
    setSearchToken(searchToken);
    setCurrentPage(0);
  };

  const warehouseAllowSelling = warehouses.find(
    (warehouse) => warehouse.name === getWarehouseNameByCode(tabSelection)
  )?.allow_selling;

  return (
    <>
      {tabSelection === "TLL" && !warehouseAllowSelling && (
        <Banner
          sentiment="warning"
          text={
            i`Outbound fulfillment from this warehouse is temporarily paused ` +
            i`due to warehouse relocation. [Learn more](${zendeskURL(
              "1260802095330"
            )})`
          }
        />
      )}
      {numMissingShippingPrice > 0 && (
        <SetUpShippingPriceTip
          shippingPriceNumber={numMissingShippingPrice}
          buttonOnClick={shippingPriceTipOnClick}
        />
      )}
      {bulkEditShippingPriceToolTip}
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
            <Button
              style={styles.exportButton}
              onClick={onExportClickHandler}
              disabled={isDownloading}
            >
              {isDownloading ? i`Loading` : i`Export as CSV`}
            </Button>
            {inventoriesToExport.length > 0 ? (
              <CSVLink
                data={inventoriesToExport}
                filename="fbw_inventories.csv"
                className={css({ display: "hidden" })}
                target="_blank"
                ref={csvLinkRef}
              />
            ) : undefined}
            <InventoryListFilter
              onDeselectAllClicked={onDeselectAllClicked}
              filterCredentials={filterCredentials}
            />
          </div>
        </div>
        <FbwInventoryListTableContent
          tabSelection={tabSelection}
          merchantCurrency={merchantCurrency}
          localizedCurrency={localizedCurrency}
          fbwInventories={fbwInventories}
          isLoading={isLoading}
          getWarehouseNameByCode={getWarehouseNameByCode}
          addUpdatedInventory={addUpdatedInventory}
        />
      </div>
    </>
  );
};

export default observer(FbwInventoryListTable);

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
        exportButton: {
          display: "flex",
          flexDirection: "column",
          marginRight: 10,
          padding: "7px 10px",
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
    [textBlack]
  );
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
