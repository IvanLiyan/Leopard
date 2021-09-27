import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

type BaseProps = any;

export type FBWAllWarehousePerfTableProps = BaseProps & {
  readonly data: { results: ReadonlyArray<unknown> };
  readonly currency: string;
};

@observer
class FBWAllWarehousePerfTable extends Component<
  FBWAllWarehousePerfTableProps
> {
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
        noDataMessage={i`No data available.`}
        highlightRowOnHover
      >
        <Table.Column title={i`Date range`} columnKey={"date_range"} />
        <Table.CurrencyColumn
          title={i`GMV`}
          columnKey={"txn_gmv"}
          currencyCode={currency}
        />
        <Table.NumeralColumn title={i`Orders`} columnKey={"txn_count"} />
        <Table.NumeralColumn title={i`Products sold`} columnKey={"txn_qty"} />
        <Table.NumeralColumn
          title={i`Refunded`}
          columnKey={"refund_reasons_count"}
        />
      </Table>
    );
  }
}

export default FBWAllWarehousePerfTable;
