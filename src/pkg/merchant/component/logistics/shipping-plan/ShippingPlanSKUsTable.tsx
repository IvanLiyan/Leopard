import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";

/* Merchant Components */
import ShippingPlanSKUDetailRow from "@merchant/component/logistics/shipping-plan/ShippingPlanSKUDetailRow";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

import { ShippingPlanSKU } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type ShippingPlanSKUsTableProps = BaseProps & {
  readonly skus?: ReadonlyArray<ShippingPlanSKU> | null | undefined;
};

@observer
class ShippingPlanSKUsTable extends Component<ShippingPlanSKUsTableProps> {
  @observable
  expandedRows: ObservableSet = new ObservableSet();

  @computed
  get tableRows(): ReadonlyArray<ShippingPlanSKU> {
    const { skus } = this.props;
    return skus || [];
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      rowDetails: {
        padding: "15px 20px",
        background: "#F6F8F9",
      },
      image: {
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-start",
        transform: "translateZ(0)",
        maxWidth: "50%",
        flexShrink: 2,
      },
    });
  }

  renderExpandedProduct = (skuItem: ShippingPlanSKU) => {
    return (
      <ShippingPlanSKUDetailRow
        skuItem={skuItem}
        className={css(this.styles.rowDetails)}
      />
    );
  };

  renderIcon(row: ShippingPlanSKU) {
    return (
      <Popover
        position="top center"
        popoverMaxWidth={250}
        popoverContent={
          row.source === 1
            ? i`This is one of your top sellers ` +
              i`that we recommend including in your shipping plan.`
            : i`This is a product that you manually` +
              i` selected to add to your shipping plan.`
        }
      >
        <Illustration
          name={row.source === 1 ? "star" : "bag"}
          alt="illustration"
        />
      </Popover>
    );
  }

  @computed
  get tableActions() {
    return [
      {
        key: "download_a4",
        name: i`Download (A4)`,
        canBatch: false,
        canApplyToRow: (row: ShippingPlanSKU) => row.label?.url != null,
        showWhenInactive: true,
        apply: this.downloadA4,
      },
      {
        key: "download_label",
        name: i`Download (Label)`,
        canBatch: false,
        canApplyToRow: (row: ShippingPlanSKU) => row.label_single?.url != null,
        showWhenInactive: true,
        apply: this.downloadLabel,
      },
    ];
  }

  downloadLabel(rows: ReadonlyArray<ShippingPlanSKU>) {
    if (rows.length === 0) {
      return;
    }
    const r = rows[0];
    if (r.label_single && r.label_single.url) {
      window.open(`${r.label_single.url}`);
    }
  }

  downloadA4(rows: ReadonlyArray<ShippingPlanSKU>) {
    if (rows.length === 0) {
      return;
    }
    const r = rows[0];
    if (r.label && r.label.url) {
      window.open(r.label.url);
    }
  }

  @computed
  get expandedRowsIndeces(): ReadonlyArray<number> {
    const { expandedRows } = this;
    return expandedRows.toArray().map((row) => parseInt(row));
  }

  @action
  onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      this.expandedRows.add(index.toString());
    } else {
      this.expandedRows.remove(index.toString());
    }
  };

  render() {
    const { className } = this.props;
    return (
      <Table
        className={css(this.styles.root, className)}
        data={this.tableRows}
        actions={this.tableActions}
        rowExpands={() => true} // all rows expand
        expandedRows={this.expandedRowsIndeces}
        renderExpanded={this.renderExpandedProduct}
        onRowExpandToggled={this.onRowExpandToggled}
        noDataMessage={i`No SKUs Found`}
        cellPadding="8px 14px"
        highlightRowOnHover
        rowHeight={68}
      >
        <Table.Column columnKey="source" align="left" minWidth={30}>
          {({ row }) => this.renderIcon(row)}
        </Table.Column>

        <ProductColumn title={i`Product`} columnKey="product_id" width={300} />

        <Table.Column
          title={i`Variation SKU`}
          columnKey="sku"
          minWidth={100}
          align="left"
        />

        <Table.NumeralColumn
          title={i`Quantity`}
          columnKey="quantity"
          minWidth={100}
        />

        <Table.NumeralColumn
          title={i`Quantity Received`}
          columnKey="quantity_delivered"
          minWidth={100}
        />
      </Table>
    );
  }
}

export default ShippingPlanSKUsTable;
