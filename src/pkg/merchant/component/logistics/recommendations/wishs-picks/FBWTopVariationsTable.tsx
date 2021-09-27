import React, { Component, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { PageIndicator } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { ribbon } from "@assets/icons";
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { params_DEPRECATED } from "@toolkit/url";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { wishURL } from "@toolkit/url";

import { RowSelectionArgs } from "@ContextLogic/lego";
import { TableAction } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { FBWTopVariation } from "@merchant/api/fbw";

export type FBWTopVariationsTableProps = BaseProps & {
  readonly data: ReadonlyArray<FBWTopVariation>;
};

@observer
class FBWTopVariationsTable extends Component<FBWTopVariationsTableProps> {
  @observable
  selectedVariations: ObservableSet = new ObservableSet();

  @params_DEPRECATED.string("from_email")
  fromEmailQueryParam = false;

  @observable
  start = 0;

  @observable
  pageSize = 10;

  @computed
  get totalCount(): number {
    const { data } = this.props;
    return data.length;
  }

  @computed
  get end(): number {
    return Math.min(this.totalCount, this.start + this.pageSize);
  }

  @computed
  get hasNext(): boolean {
    return this.end < this.totalCount;
  }

  @computed
  get visibleData(): ReadonlyArray<FBWTopVariation> {
    const { data } = this.props;
    return data.slice(this.start, this.end);
  }

  @computed
  get selectedRows(): ReadonlyArray<number> {
    const { selectedVariations } = this;
    return selectedVariations.toArray().map((rowIndex) => parseInt(rowIndex));
  }

  renderPageIndicator = () => {
    const { data } = this.props;

    return (
      <div className={css(this.styles.pageIndicatorContainer)}>
        <h3 className={css(this.styles.tableTitle)}>
          {i`Top sellers ` + `(${data.length})`}
        </h3>
        <PageIndicator
          className={css(this.styles.pageIndicator)}
          totalItems={this.totalCount}
          rangeStart={this.start + 1}
          rangeEnd={this.end}
          hasNext={this.hasNext}
          hasPrev={this.start > 0}
          currentPage={this.start / this.pageSize}
          onPageChange={this.onPageChange}
        />
      </div>
    );
  };

  @action
  onPageChange = (nextPage: number) => {
    this.start = nextPage * this.pageSize;
  };

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      pageIndicatorContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: colors.white,
      },
      pageIndicator: {
        backgroundColor: colors.white,
        padding: "12px 24px",
      },
      expandedProduct: {
        backgroundImage:
          "linear-gradient(to bottom, rgba(238, 242, 245, 0.5), rgba(238, 242, 245, 0.5))",
        padding: "20px 78px",
      },
      expandedProductValue: {
        paddingBottom: 16,
        verticalAlign: "top",
      },
      expandedProductLabel: {
        fontWeight: fonts.weightBold,
        paddingBottom: 16,
        paddingRight: 84,
        verticalAlign: "top",
      },
      tableTitle: {
        color: "#152934",
        padding: "0 0 0 24px",
      },
    });
  }

  logRestock(qty: number) {
    logger.log("FBW_RECOMMENDATION_DASHBOARD_CLICK", {
      action: "top_variation_restock",
      qty,
    });
  }

  @computed
  get tableActions(): ReadonlyArray<TableAction> {
    return [
      {
        key: "restock",
        name: i`Restock`,
        canBatch: true,
        canApplyToRow: () => {
          return true;
        },
        apply: (variations: ReadonlyArray<FBWTopVariation>) => {
          const variationIds = variations.map((v) => v.variation_id).join(",");
          const recommendationSource = `&rec_source=${
            this.fromEmailQueryParam ? "email" : "web"
          }`;
          this.logRestock(variations.length);
          window.open(
            `/create-shipping-plan?shipmentType=FBW&variationIds=${variationIds}${recommendationSource}`
          );
        },
      },
    ];
  }

  renderExpanded(row: FBWTopVariation) {
    let variationInfo: ReactNode = null;
    if (row.size && row.color) {
      variationInfo = (
        <>
          {row.size}
          <br />
          {row.color}
        </>
      );
    } else if (row.size) {
      variationInfo = row.size;
    } else if (row.color) {
      variationInfo = row.color;
    }
    return (
      <div className={css(this.styles.expandedProduct)}>
        <table>
          <tbody>
            <tr>
              <td className={css(this.styles.expandedProductLabel)}>
                Product Name
              </td>
              <td className={css(this.styles.expandedProductValue)}>
                {row.product_name}
              </td>
            </tr>
            <tr>
              <td className={css(this.styles.expandedProductLabel)}>
                Product ID
              </td>
              <td className={css(this.styles.expandedProductValue)}>
                <Link openInNewTab href={wishURL(`/c/${row.product_id}`)}>
                  {row.product_id}
                </Link>
              </td>
            </tr>
            <tr>
              <td className={css(this.styles.expandedProductLabel)}>
                Parent SKU
              </td>
              <td className={css(this.styles.expandedProductValue)}>
                {row.parent_sku}
              </td>
            </tr>
            {variationInfo && (
              <tr>
                <td className={css(this.styles.expandedProductLabel)}>
                  Variation Info
                </td>
                <td className={css(this.styles.expandedProductValue)}>
                  {variationInfo}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  @observable
  expandedRows: ObservableSet = new ObservableSet();

  @computed
  get expandedRowsIndices(): ReadonlyArray<number> {
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

  @action
  onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<FBWTopVariation>) => {
    if (selected) {
      this.selectedVariations.add(index.toString());
    } else {
      this.selectedVariations.remove(index.toString());
    }
  };

  renderRecommendedIcon(row: FBWTopVariation) {
    if (!row.is_recommended) {
      return null;
    }
    return (
      <Popover
        position={"top"}
        popoverMaxWidth={256}
        popoverContent={
          i`We recommend this top-selling to you based on a ` +
          i`comprehensive evaluation of your sales, ` +
          i`refund rate, product ratings, and more. ` +
          i`In other words, we believe this product ` +
          i`is likely going to sell better among all your FBW inventory.`
        }
      >
        <img src={ribbon} alt="ribbon" />
      </Popover>
    );
  }

  renderTable() {
    return (
      <Table
        data={this.visibleData}
        maxVisibleColumns={9}
        noDataMessage={i`You don't have any top sellers yet.`}
        highlightRowOnHover
        actions={this.tableActions}
        rowHeight={68}
        rowExpands={() => true}
        renderExpanded={(row) => this.renderExpanded(row)}
        expandedRows={this.expandedRowsIndices}
        onRowExpandToggled={this.onRowExpandToggled}
        selectedRows={this.selectedRows}
        onRowSelectionToggled={this.onRowSelectionToggled}
      >
        <ProductColumn title={i`Product`} columnKey="product_id" width={300} />
        <Table.Column title={""} columnKey="is_recommended" align={"left"}>
          {({ row }) => this.renderRecommendedIcon(row)}
        </Table.Column>
        <Table.Column title={i`Variation SKU`} columnKey="sku" canCopyText />
        <Table.CurrencyColumn
          title={i`Total GMV`}
          description={i`The total GMV in the last 30 days.`}
          columnKey="gmv"
          currencyCode={"USD"}
          sortOrder={"desc"}
        />
        <Table.Column
          title={i`Top Warehouse`}
          description={i`This warehouse generated the most GMV for the SKU in the last 30 days.`}
          columnKey={"top_warehouse"}
        />
      </Table>
    );
  }

  render() {
    const { className, style } = this.props;
    return (
      <div className={css(this.styles.root, className, style)}>
        {this.renderPageIndicator()}
        {this.renderTable()}
      </div>
    );
  }
}

export default FBWTopVariationsTable;
