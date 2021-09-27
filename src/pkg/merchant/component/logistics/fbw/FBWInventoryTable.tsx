import React, { Component } from "react";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

import { TableAction, RowSelectionArgs } from "@ContextLogic/lego";
import { LowInventorySKU } from "@toolkit/fbw";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type BaseProps = any;

export type FBWInventoryTableProps = BaseProps & {
  readonly data: ReadonlyArray<LowInventorySKU>;
  readonly selectedWarehouseCodes: ReadonlyArray<unknown>;
  readonly merchantId: string;
};

@observer
class FBWInventoryTable extends Component<FBWInventoryTableProps> {
  static defaultProps = {
    data: [],
  };

  @observable
  selectedVariations: ObservableSet = new ObservableSet();

  @computed
  get selectedRows(): ReadonlyArray<number> {
    const { selectedVariations } = this;
    return selectedVariations.toArray().map((rowIndex) => parseInt(rowIndex));
  }

  @action
  onRowSelectionToggled = ({ index, selected }: RowSelectionArgs<unknown>) => {
    if (selected) {
      this.selectedVariations.add(index.toString());
    } else {
      this.selectedVariations.remove(index.toString());
    }
  };

  @computed
  get tableActions(): ReadonlyArray<TableAction> {
    return [
      {
        key: "restock",
        name: i`Restock`,
        canBatch: true,
        canApplyToRow: (sku) => true,
        apply: (variations: ReadonlyArray<LowInventorySKU>) => {
          const variationIds = variations.map((v) => v.variation_id).join(",");
          window.open(
            `/create-shipping-plan?shipmentType=FBW&variationIds=${variationIds}`
          );
        },
      },
    ];
  }

  estimatedOutOfStock(row: any) {
    return formatDatetimeLocalized(
      moment().add(row.estimated_days_until_out_of_stock, "days"),
      "YYYY-MM-DD"
    );
  }

  render() {
    const { data } = this.props;
    return (
      <Table
        data={data}
        actions={this.tableActions}
        maxVisibleColumns={9}
        noDataMessage={
          i`You don't have any products in FBW inventory. ` +
          i`It's time to stock it up! ` +
          i`Create a shipping plan`
        }
        selectedRows={this.selectedRows}
        onRowSelectionToggled={this.onRowSelectionToggled}
        highlightRowOnHover
      >
        <ProductColumn title={i`Product`} columnKey="product_id" width={300} />
        <Table.Column title={i`SKU`} columnKey="variation_id" canCopyText />
        <Table.Column title={i`Warehouse`} columnKey="warehouse_code" />
        <Table.NumeralColumn
          title={i`Available inventory`}
          columnKey="warehouse_inventory"
        />
        <Table.NumeralColumn
          title={i`Sold in last 90 days`}
          columnKey="last_90_days_sold"
        />
        <Table.PercentageColumn
          title={i`Inventory sold`}
          columnKey="inventory_sale_rate"
        />
        <Table.Column
          title={i`Estimated out-of-stock by`}
          columnKey="estimated_days_until_out_of_stock"
        >
          {({ row }) => this.estimatedOutOfStock(row)}
        </Table.Column>
      </Table>
    );
  }
}

export default FBWInventoryTable;
