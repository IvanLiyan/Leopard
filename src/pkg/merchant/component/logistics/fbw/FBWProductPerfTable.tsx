import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

type BaseProps = any;

export type FBWProductPerfTableProps = BaseProps & {
  readonly data: { results: ReadonlyArray<unknown> };
};

@observer
class FBWProductPerfTable extends Component<FBWProductPerfTableProps> {
  static defaultProps = {
    data: { results: [] },
  };

  @computed
  get tableRows() {
    const { data } = this.props;
    return data.results.rows;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
    });
  }

  render() {
    const { currency } = this.props;
    return (
      <Table
        data={this.tableRows}
        maxVisibleColumns={9}
        noDataMessage={i`Please enter a correct product or SKU above. `}
        highlightRowOnHover
      >
        <Table.Column title={i`Date range`} columnKey="date_range" />
        <ProductColumn title={i`Product`} columnKey="product_id" width={300} />
        <Table.Column title={i`SKU`} columnKey={"variation_id"} canCopyText />
        <Table.CurrencyColumn
          title={i`GMV`}
          columnKey={"txn_gmv"}
          currencyCode={currency}
        />

        <Table.NumeralColumn
          title={i`Available inventory`}
          columnKey={"inventory"}
        />
        <Table.NumeralColumn
          title={i`Sold in last 90 days`}
          columnKey={"txn_90_day_qty"}
          noDataMessage="0"
        />
        <Table.NumeralColumn
          title={i`Refunded`}
          columnKey={"refund_reasons_count"}
          noDataMessage="0"
        />
        <Table.PercentageColumn
          title={i`Refund rate`}
          columnKey={"refund_rate"}
          noDataMessage="0"
        />
      </Table>
    );
  }
}

export default FBWProductPerfTable;
