/* eslint-disable filenames/match-regex */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { IllustrationOrRender } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightMedium } from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import VariationColumn from "@merchant/component/logistics/fbw/columns/VariationColumn";
import ProductVariationDetailRow from "@merchant/component/logistics/fbs/performance/ProductVariationDetailRow";

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import { LogActions } from "@toolkit/fbs";

import { useStore } from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ProductVariation } from "@toolkit/fbs";
import { ProductVariationStats } from "@merchant/api/fbs";
import { RowSelectionArgs } from "@ContextLogic/lego";
import { TableAction } from "@ContextLogic/lego";

export type FBSProductStatsTableProps = BaseProps & {
  readonly rows: ReadonlyArray<ProductVariationStats>;
  readonly dataExistsButFiltered?: boolean;
  readonly noDataMessage: string;
  readonly selectedRows: Set<number>;
  readonly setSelectedRows: (arg0: Set<number>) => void;
  readonly expandedRows: Set<number>;
  readonly setExpandedRows: (arg0: Set<number>) => void;
};

const FBSProductStatsTable = (props: FBSProductStatsTableProps) => {
  const {
    rows,
    dataExistsButFiltered,
    noDataMessage,
    selectedRows = new Set(),
    setSelectedRows,
    expandedRows = new Set(),
    setExpandedRows,
  } = props;
  const { dimenStore } = useStore();
  const styles = useStyleSheet();
  const tableActions = useTableActions();

  const renderNoDataMessage = () => {
    return (
      <div className={css(styles.noData)}>
        {!dimenStore.isSmallScreen && (
          <IllustrationOrRender
            className={css(styles.noDataImage)}
            value={"fbsEmptyState"}
            alt="image of no data message"
            animate={false}
          />
        )}
        <Markdown className={css(styles.noDataText)} text={noDataMessage} />
      </div>
    );
  };

  const renderExpanded = (pv: ProductVariationStats) => {
    const productVariation: ProductVariation = {
      product_name: pv.product_name,
      product_id: pv.product_id,
      variation_size: pv.variation_size,
      variation_color: pv.variation_color,
      warehouses: pv.warehouses,
    };
    return (
      <ProductVariationDetailRow
        productVariation={productVariation}
        className={css(styles.rowDetails)}
      />
    );
  };

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<ProductVariation>) => {
    if (selected) {
      selectedRows.add(index);
    } else {
      selectedRows.delete(index);
    }
    setSelectedRows(new Set(selectedRows));
  };

  return (
    <Table
      data={rows}
      highlightRowOnHover
      actions={tableActions}
      noDataMessage={dataExistsButFiltered ? i`No Data` : renderNoDataMessage}
      rowHeight={68}
      rowExpands={() => true}
      renderExpanded={renderExpanded}
      expandedRows={Array.from(expandedRows)}
      onRowExpandToggled={onRowExpandToggled}
      selectedRows={Array.from(selectedRows)}
      onRowSelectionToggled={onRowSelectionToggled}
    >
      <VariationColumn
        title={i`Product variation`}
        columnKey={"variation_id"}
        productKey={"product_id"}
        variationKey={"variation_id"}
        variationNameKey={"variation_name"}
      />
      <Table.CurrencyColumn
        columnKey="gmv"
        currencyCode="USD"
        title={i`GMV`}
        description={i`The product's total GMV within the selected date range.`}
        align="right"
      />
      <Table.Column
        columnKey="orders"
        title={i`Orders`}
        description={i`The number of orders placed within the selected date range.`}
        align="right"
      />
      <Table.Column
        columnKey="quantity_sold"
        title={i`Number of SKUs sold`}
        description={i`The number of product SKUs sold within the selected date range.`}
        align="right"
      />
      <Table.Column
        columnKey="inventory"
        title={i`Active in store`}
        description={i`Active product inventory stocked in Wish's partnered stores (FBS).`}
        align="right"
      />
    </Table>
  );
};

export default observer(FBSProductStatsTable);

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        noData: {
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: 372,
          width: "100%",
        },
        noDataImage: {
          display: "flex",
          flexShrink: 2,
          maxWidth: "25%",
        },
        noDataText: {
          color: palettes.textColors.LightInk,
          fontSize: 16,
          fontWeight: weightMedium,
          lineHeight: 1.5,
          maxWidth: "62.5%",
          textAlign: "center",
        },
        rowDetails: {
          backgroundImage:
            "linear-gradient(to bottom, rgba(238, 242, 245, 0.5), rgba(238, 242, 245, 0.5))",
          padding: "20px 20px 20px 77px",
        },
      }),
    []
  );
};

const useTableActions = (): Array<TableAction> => {
  const actionLogger = useLogger("FBS_PERFORMANCE_PAGE_ACTION");
  return [
    {
      key: "restock",
      name: i`Restock`,
      canBatch: true,
      canApplyToRow: () => true,
      apply: (variations: ReadonlyArray<ProductVariationStats>) => {
        const variationIds = variations.map((v) => v.variation_id).join(",");
        actionLogger.info({
          action: LogActions.CLICK_RESTOCK_PRODUCT_VARIATION,
          detail: variationIds.length,
        });
        window.open(
          `/create-shipping-plan?shipmentType=FBW&variationIds=${variationIds}`
        );
      },
      description: {
        title:
          i`Restock more inventory in your FBW warehouses so ` +
          i`that more products might be selected to participate in FBS.`,
        position: "right center",
      },
    },
  ];
};
