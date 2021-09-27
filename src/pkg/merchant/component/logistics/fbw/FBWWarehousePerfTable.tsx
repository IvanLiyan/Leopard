import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { weightMedium, proxima } from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

type BaseProps = any;

export type FBWWarehousePerfTableProps = BaseProps & {
  readonly data: { results: ReadonlyArray<unknown> };
  readonly currency: string;
};

@observer
class FBWWarehousePerfTable extends Component<FBWWarehousePerfTableProps> {
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
    const { dimenStore } = AppStore.instance();

    return StyleSheet.create({
      root: {},
      rowDetails: {
        padding: "15px 20px",
        backgroundBlendMode: "darken",
        backgroundImage:
          "linear-gradient(rgba(238, 242, 245, 0.5), " +
          "rgba(238, 242, 245, 0.5))",
      },
      campaignName: {
        fontSize: 14,
        color: palettes.coreColors.DarkWishBlue,
        textAlign: "left",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
      modalContent: {
        display: "flex",
        flexDirection: "column",
        padding: `50px ${dimenStore.pageGuideX}`,
      },
      modalTextContent: {
        padding: "40px 0 0 0",
        fontSize: 16,
        lineHeight: 1.5,
        textAlign: "center",
        color: palettes.textColors.Ink,
        fontWeight: weightMedium,
        fontFamily: proxima,
      },
      tooltip: {
        fontSize: 13,
        maxWidth: "200px",
        lineHeight: 1.33,
        textAlign: "left",
        overflowWrap: "break-word",
        wordWrap: "break-word",
        wordBreak: "break-word",
        whiteSpace: "normal",
        padding: "13px 13px 0px 13px",
      },
      tooltipButton: {
        color: palettes.coreColors.WishBlue,
        fontSize: 13,
        padding: "0px 13px 13px 13px",
      },
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

export default FBWWarehousePerfTable;
