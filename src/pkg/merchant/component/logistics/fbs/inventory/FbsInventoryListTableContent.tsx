import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

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

import { ProductLevelInventory } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FbsInventoryListTableContentProp = BaseProps & {
  readonly displayedRows: ReadonlyArray<ProductLevelInventory>;
  readonly onRowExpandToggled: (arg0: number, arg1: boolean) => unknown;
  readonly expandedRows: Array<number>;
};

const FbsInventoryListTableContent = (
  props: FbsInventoryListTableContentProp
) => {
  const { displayedRows, onRowExpandToggled, expandedRows } = props;

  const styles = useStyleSheet();

  return (
    <Table
      className={css(styles.root)}
      data={displayedRows}
      maxVisibleColumns={9}
      noDataMessage={i`There is no FBS inventory`}
      rowExpands={() => true}
      renderExpanded={(row) => <ExpandedInventoryTable inventory={row} />}
      onRowExpandToggled={onRowExpandToggled}
      expandedRows={expandedRows}
      highlightRowOnHover
      actionColumnWidth={240}
    >
      <ProductColumn title={i`Product`} columnKey="product_id" width={300} />
      <Table.Column title={i`Product ID`} columnKey="product_SKU">
        {({ row }) => <ObjectId id={row.product_id} copyOnBodyClick />}
      </Table.Column>

      <Table.Column title={i`Variation SKU`} columnKey="warehouse_code">
        {({ row }) => {
          const variationStr = i`${row.variation_inventory.length} Variations`;
          return <div>{variationStr}</div>;
        }}
      </Table.Column>
      <Table.NumeralColumn
        title={i`Pending`}
        columnKey="pending"
        description={i`Products that have not been checked in to a FBW warehouse.`}
      />
      <Table.NumeralColumn
        title={i`Active`}
        columnKey="active"
        description={i`Active products stocked in your FBW warehouse(s) and available for sale.`}
      />
    </Table>
  );
};

export default FbsInventoryListTableContent;

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
