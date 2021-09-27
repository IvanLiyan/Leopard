import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { contestImageURL } from "@toolkit/url";
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Relative Imports */
import ShippingPlanSKUDetailRow from "./ShippingPlanSKUDetailRow";
import FBWRecommendProductsTableNoData from "./FBWRecommendProductsTableNoData";
import ShippingPlanSearchBar from "./ShippingPlanSearchBar";

import { CellInfo } from "@ContextLogic/lego";
import { WarehouseType } from "@toolkit/fbw";
import { OnChangeEvent } from "@ContextLogic/lego";
import { RowSelectionArgs } from "@ContextLogic/lego";
import { Product } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { SearchType } from "./ShippingPlanSearchBar";

export interface IOnChangeProps {
  event: OnChangeEvent;
  variationId: string;
  warehouseCode: string;
}

type FBSCreateShippingPlanTableProps = BaseProps & {
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly rows: ReadonlyArray<Product>;
  readonly variationWarehouseQuantity: Map<string, Map<string, number>>;
  readonly onQuantityChange: ({
    event,
    variationId,
    warehouseCode,
  }: IOnChangeProps) => unknown | null | undefined;
  readonly onRowSelectionToggled?: (
    args: RowSelectionArgs<Product>
  ) => unknown | null | undefined;
  readonly selectedVariations?: ReadonlyArray<Product>;
  readonly currentPage: number;
  readonly onCurrentPageChanged: (currentPage: number) => unknown;
  readonly onAddModalRowSelectionToggled: (
    args: RowSelectionArgs<Product>
  ) => unknown | null | undefined;
  readonly handleAddToShippingPlanOnClick?: (() => unknown) | null | undefined;
  readonly handleAddPreviousSalesToShippingPlanOnClick?: (
    args: ReadonlyArray<Product>
  ) => unknown | null | undefined;
  readonly clearSelectedRowsInModal: (
    variation?: string
  ) => unknown | null | undefined;
  readonly isRecommendedTab: boolean;
  readonly showPreviousSoldProducts?: boolean;
  readonly handleDismissPreviousSalesOnClick?:
    | (() => unknown)
    | null
    | undefined;
  readonly shipmentType: string;
};

type SortOrder = "asc" | "desc" | "not-applied" | undefined;

const PAGE_SIZE = 10;

const FBSCreateShippingPlanTable = (props: FBSCreateShippingPlanTableProps) => {
  const styles = useStylesheet(props);
  const {
    rows,
    selectedVariations,
    onRowSelectionToggled,
    variationWarehouseQuantity,
  } = props;

  const [searchType, setSearchType] = useState<SearchType>("product_id");
  const [searchString, setSearchString] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<Array<number>>([]);
  const [displayedRows, setDisplayedRows] = useState<Array<Product>>(
    rows.slice(0, Math.min(PAGE_SIZE, rows.length))
  );
  const [gmvSortOrder, setGmvSortOrder] = useState<SortOrder>("asc");

  const totalItems = rows.length;
  const rangeStart = currentPage * PAGE_SIZE + 1;
  const rangeEnd = Math.min(PAGE_SIZE * (currentPage + 1), totalItems);
  const hasNext = Math.floor((totalItems - 1) / PAGE_SIZE) !== currentPage;
  const hasPrev = currentPage !== 0;

  useEffect(() => {
    setDisplayedRows((displayedRows) => {
      const currentRows = searchString
        ? displayedRows.filter((item) => {
            if (searchType === "product_id") {
              return item.product_id === searchString;
            } else if (searchType === "product_sku") {
              return item.parent_sku === searchString;
            } else if (searchType === "variation_sku") {
              return item.sku === searchString;
            }
            return false;
          })
        : rows.slice(0, Math.min(PAGE_SIZE, rows.length));
      return currentRows.sort((a, b) =>
        gmvSortOrder === "desc" ? a.gmv - b.gmv : b.gmv - a.gmv
      );
    });
  }, [searchString, searchType, rows, gmvSortOrder]);

  const onQuantityChange = ({
    event,
    variationId,
    warehouseCode,
  }: IOnChangeProps) => {
    const { onQuantityChange } = props;
    onQuantityChange({
      event,
      variationId,
      warehouseCode,
    });
  };

  const renderQuantity = (one: Product) => {
    const { variationWarehouseQuantity, warehouses } = props;
    const variationId = one.variation_id || "";
    let qtySum = 0;
    warehouses.forEach((item) => {
      qtySum +=
        variationWarehouseQuantity
          ?.get(variationId)
          ?.get(item.warehouse_code || "") || 0;
    });

    return <div className={css(styles.rightAlign)}>{qtySum}</div>;
  };

  const renderExpandedProduct = (item: Product) => {
    const skuItem = {
      product_id: item.product_id,
      parent_sku: item.parent_sku,
      sku: item.sku,
      source: item.source,
      product_name: item.name,
      size: item.size,
      color: item.color,
    };
    return (
      <ShippingPlanSKUDetailRow
        skuItem={skuItem}
        className={css(styles.rowDetails)}
      />
    );
  };

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    let tempExpandedRows = [...expandedRows];
    if (shouldExpand) {
      tempExpandedRows.push(index);
    } else {
      tempExpandedRows = tempExpandedRows.filter((item) => item != index);
    }
    setExpandedRows(tempExpandedRows);
  };

  const renderVariationSKU = (row: Product) => {
    if (row.name) {
      const varationName = row.name;
      return (
        <div className={css(styles.product)}>
          <img
            className={css(styles.image)}
            alt="product"
            src={contestImageURL({ contestId: row.product_id, size: "small" })}
          />
          <section>{varationName}</section>
        </div>
      );
    }
  };
  const onSortFieldChange = (sortOrder: SortOrder) => {
    setGmvSortOrder(sortOrder);
  };

  const renderTable = () => {
    const { warehouses, shipmentType } = props;
    if (rows.length === 0) {
      return (
        <FBWRecommendProductsTableNoData
          allowAddingProduct={shipmentType === "FBW"}
        />
      );
    }
    const warehouseColumns = _.sortBy(
      warehouses,
      (warehouse) => warehouse.region
    ).map((warehouse) => {
      return (
        <Table.Column
          key={warehouse.warehouse_name.slice(7, 10)}
          title={warehouse.warehouse_name.slice(4)}
          columnKey={warehouse.warehouse_name.slice(7, 10)}
          width={100}
          description={
            i`The quantity of each SKU is automatically calculated` +
            i` for selected FBW warehouses to optimize your future sales.`
          }
          align="center"
          handleEmptyRow
        >
          {({ row }: CellInfo<Product, Product>) => (
            <NumericInput
              className={css(styles.input)}
              value={variationWarehouseQuantity
                .get(row.variation_id)
                ?.get(warehouse.warehouse_code || "")}
              incrementStep={1}
              onChange={(event: OnChangeEvent) =>
                onQuantityChange({
                  event,
                  variationId: row.variation_id,
                  warehouseCode: warehouse.warehouse_code || "",
                })
              }
              style={{ minWidth: 100 }}
            />
          )}
        </Table.Column>
      );
    });

    const selected: number[] = [];
    if (selectedVariations) {
      for (const row of selectedVariations) {
        const variationId = row.variation_id;
        let index = -1;
        index = displayedRows.findIndex(
          (item) => item.variation_id === variationId
        );
        if (index !== -1) {
          selected.push(index);
        }
      }
    }
    return (
      <Table
        data={displayedRows}
        noDataMessage={i`You can visit us later for recomended products.`}
        canSelectRow={(row) => true}
        selectedRows={selected}
        rowExpands={() => true}
        renderExpanded={renderExpandedProduct}
        onRowExpandToggled={onRowExpandToggled}
        expandedRows={expandedRows}
        onRowSelectionToggled={onRowSelectionToggled}
        rowHeight={null}
        highlightRowOnHover
      >
        <Table.Column title={i`Product Name`} columnKey="sku">
          {({ row }: CellInfo<Product, Product>) => renderVariationSKU(row)}
        </Table.Column>

        <Table.CurrencyColumn
          columnKey="gmv"
          currencyCode="USD"
          title={"GMV"}
          sortOrder={gmvSortOrder}
          onSortToggled={(sortOrder) => {
            onSortFieldChange(sortOrder);
          }}
          description={i`Your total GMV of the last 90 days`}
          align="right"
        />

        {warehouseColumns}

        <Table.Column
          title={i`Quantity`}
          columnKey="quantity"
          description={
            i`The total quantity of each SKU you plan to ` +
            i`send to FBW warehouses.`
          }
          descriptionPopoverMinWidth={350}
          align="right"
        >
          {({ row }: CellInfo<Product, Product>) => renderQuantity(row)}
        </Table.Column>
      </Table>
    );
  };

  const onPageChange = (currentPage: number) => {
    setCurrentPage(currentPage);
  };

  return (
    <>
      <div className={css(styles.content)}>
        <ShippingPlanSearchBar
          setSearchType={setSearchType}
          setSearchString={setSearchString}
          searchType={searchType}
        />

        <PageIndicator
          totalItems={totalItems}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          hasNext={hasNext}
          hasPrev={hasPrev}
          currentPage={currentPage}
          onPageChange={(currentPage) => onPageChange(currentPage)}
        />
      </div>
      {renderTable()}
    </>
  );
};

const useStylesheet = (props: FBSCreateShippingPlanTableProps) => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          paddingBottom: 70,
        },
        rightAlign: {
          display: "flex",
          justifyContent: "flex-end",
        },
        input: {},
        content: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 24,
        },
        rowDetails: {
          padding: "15px 20px",
          background: "#F6F8F9",
        },
        product: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          cursor: "pointer",
          transition: "opacity 0.3s linear",
          ":hover": {
            opacity: 0.8,
          },
        },
        lowStockDate: {
          color: textBlack,
          opacity: 0.5,
        },
        lowStockWarehouse: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexDirection: "row",
        },
        image: {
          width: 32,
          marginRight: 15,
        },
      }),
    [textBlack]
  );
};

export default FBSCreateShippingPlanTable;
