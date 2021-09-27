import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { PageIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Relative Imports */
import FBWShippingPriceTooltip from "./FBWShippingPriceTooltip";

import { TableAction } from "@ContextLogic/lego";
import { VariationShippingPrices } from "@merchant/api/fbw-shipping-price-drop";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBWShippingPriceDropHistoryTableProps = BaseProps & {
  readonly data: ReadonlyArray<VariationShippingPrices>;
  readonly warehouseCode: string;
  readonly currencyCode: string;
};

@observer
export default class FBWShippingPriceDropHistoryTable extends Component<FBWShippingPriceDropHistoryTableProps> {
  @observable
  pageSize = 10;

  @observable
  start = 0;

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
  get visibleData(): ReadonlyArray<VariationShippingPrices> {
    const { data } = this.props;
    return data.slice(this.start, this.end);
  }

  renderPageIndicator = () => {
    return (
      <div className={css(this.styles.pageIndicatorContainer)}>
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
        flexDirection: "row-reverse",
        backgroundColor: colors.white,
      },
      pageIndicator: {
        backgroundColor: colors.white,
        padding: "12px 24px",
      },
    });
  }

  @computed
  get tableActions(): ReadonlyArray<TableAction> {
    return [
      {
        key: "view",
        name: i`View`,
        canBatch: false,
        canApplyToRow: () => {
          return true;
        },
        apply: () => {
          window.open(`/fbw/inventory`);
        },
      },
    ];
  }

  renderShippingPriceTable(row: VariationShippingPrices) {
    const { currencyCode, warehouseCode } = this.props;
    return (
      <FBWShippingPriceTooltip
        isHistory
        currencyCode={currencyCode}
        warehouseCode={warehouseCode}
        data={row.shipping_prices}
      />
    );
  }

  renderShippingPriceRange(row: VariationShippingPrices, suggested: boolean) {
    const { currencyCode } = this.props;
    const currentPrices = Object.keys(row.shipping_prices).map((country) =>
      suggested
        ? row.shipping_prices[country as keyof typeof row.shipping_prices]
            .suggested
        : row.shipping_prices[country as keyof typeof row.shipping_prices]
            .current,
    );
    const minPrice = Math.min(...currentPrices);
    const maxPrice = Math.max(...currentPrices);
    let priceRange = "";
    if (minPrice === maxPrice) {
      priceRange = formatCurrency(minPrice, currencyCode);
    } else {
      priceRange =
        formatCurrency(minPrice, currencyCode) +
        "-" +
        formatCurrency(maxPrice, currencyCode);
    }
    return (
      <>
        <Popover
          position={"right"}
          popoverContent={() => this.renderShippingPriceTable(row)}
        >
          {" "}
          {priceRange}
        </Popover>
      </>
    );
  }

  renderTable() {
    return (
      <Table
        data={this.visibleData}
        maxVisibleColumns={9}
        noDataMessage={i`No data available.`}
        highlightRowOnHover
        actions={this.tableActions}
        rowHeight={68}
      >
        <ProductColumn title={i`Product`} columnKey="product_id" width={300} />
        <Table.Column title={i`SKU`} columnKey="sku" canCopyText />
        <Table.DatetimeColumn
          title={i`Date updated`}
          columnKey="timestamp"
          format={"MM/DD/YYYY"}
        />
        <Table.Column
          title={i`Your Shipping Price`}
          columnKey={"variation_id"}
          align={"right"}
        >
          {({ row }) => this.renderShippingPriceRange(row, false)}
        </Table.Column>
        <Table.Column
          title={i`Updated Shipping Price`}
          columnKey={"variation_id"}
          align={"left"}
        >
          {({ row }) => this.renderShippingPriceRange(row, true)}
        </Table.Column>
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
