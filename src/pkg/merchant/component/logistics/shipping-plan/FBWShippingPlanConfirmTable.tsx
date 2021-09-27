import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

import { Product } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FBWShippingPlanConfirmTableProps = BaseProps & {
  readonly rows: ReadonlyArray<Product>;
  readonly variationWarehouseQuantity: Map<string, Map<string, number>>;
  readonly variationQuantity: Map<string, number>;
};

@observer
class FBWShippingPlanConfirmTable extends Component<
  FBWShippingPlanConfirmTableProps
> {
  itemsInOnePage = 5;

  @observable
  currentPage = 0;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        padding: 0,
      },
      pageIndicator: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "20px 24px",
      },
      all: {
        textColor: palettes.textColors.Ink,
        fontWeight: fonts.weightSemibold,
        fontSize: 16,
      },
      table: {
        padding: "20px 24px",
      },
    });
  }

  @computed
  get totalItems() {
    const { rows } = this.props;
    return rows.length;
  }

  @computed
  get displayedRows(): ReadonlyArray<Product> {
    const { rows } = this.props;
    return rows.slice(this.rangeStart - 1, this.rangeEnd);
  }

  @computed
  get rangeStart() {
    return this.currentPage * this.itemsInOnePage + 1;
  }

  @computed
  get rangeEnd() {
    return Math.min(
      this.currentPage * this.itemsInOnePage + this.itemsInOnePage,
      this.totalItems
    );
  }

  @computed
  get hasNext() {
    const totalPage = Math.floor((this.totalItems - 1) / this.itemsInOnePage);
    return totalPage !== this.currentPage;
  }

  @computed
  get hasPrev() {
    return this.currentPage !== 0;
  }

  @action
  onPageChange = (currentPage: number) => {
    this.currentPage = currentPage;
  };

  renderVariationSKU(row: Product) {
    if (row.sku) {
      return (
        <section>{`...${row.sku.substring(
          Math.max(0, row.sku.length - 30),
          row.sku ? row.sku.length : 0
        )}`}</section>
      );
    }
  }

  renderQuantity(row: Product) {
    const { variationQuantity } = this.props;
    const quantity = row.variation_id
      ? variationQuantity.get(row.variation_id) || 10
      : 10;
    return <section>{quantity}</section>;
  }

  renderIcon(row: Product) {
    return (
      <Popover
        position="top center"
        popoverMaxWidth={250}
        popoverContent={
          row.is_recommended
            ? i`This is one of your top sellers ` +
              i`that we recommend including in your shipping plan.`
            : i`This is a product that you manually` +
              i` selected to add to your shipping plan.`
        }
      >
        <Illustration
          name={row.is_recommended ? "star" : "bag"}
          alt="illustration"
        />
      </Popover>
    );
  }

  render() {
    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.pageIndicator)}>
          <p className={css(this.styles.all)}>All products</p>
          <PageIndicator
            totalItems={this.totalItems}
            rangeStart={this.rangeStart}
            rangeEnd={this.rangeEnd}
            hasNext={this.hasNext}
            hasPrev={this.hasPrev}
            currentPage={this.currentPage}
            onPageChange={(currentPage) => this.onPageChange(currentPage)}
          />
        </div>
        <Table
          data={this.displayedRows}
          className={css(this.styles.table)}
          rowHeight={68}
        >
          <Table.Column columnKey={"sku"}>
            {({ row }) => this.renderIcon(row)}
          </Table.Column>
          <ProductColumn
            columnKey="product_id"
            title={i`Product`}
            width={300}
          />
          <Table.Column columnKey={"variation_id"} title={i`Variation SKU`}>
            {({ row }) => this.renderVariationSKU(row)}
          </Table.Column>
          <Table.Column columnKey={"quantity"} title={i`Quantity`}>
            {({ row }) => this.renderQuantity(row)}
          </Table.Column>
        </Table>
      </div>
    );
  }
}

export default FBWShippingPlanConfirmTable;
