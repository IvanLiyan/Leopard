import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Toolkit */
import { ProductLevelInventory } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ExpandedInventoryTableProp = BaseProps & {
  readonly inventory: ProductLevelInventory;
};

const ExpandedInventoryTable = (props: ExpandedInventoryTableProp) => {
  const { inventory } = props;

  const styles = useStyleSheet();

  const variationInventories = inventory.variation_inventory;

  return (
    <div className={css(styles.detailRow)}>
      <Table
        className={css(styles.variationInventoryTable)}
        data={variationInventories}
        maxVisibleColumns={9}
        noDataMessage={i`There is no FBS inventory`}
        highlightRowOnHover
        actionColumnWidth={240}
      >
        <Table.Column
          title={i`Variation SKU`}
          columnKey="variation_SKU"
          canCopyText
        />
        <Table.NumeralColumn title={i`Pending`} columnKey="pending" />
        <Table.NumeralColumn title={i`Active`} columnKey="active" />
      </Table>
    </div>
  );
};

export default ExpandedInventoryTable;

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
