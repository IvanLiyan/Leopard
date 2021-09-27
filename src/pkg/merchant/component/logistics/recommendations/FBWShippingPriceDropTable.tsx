import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Popover } from "@merchant/component/core";
import { PageIndicator } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { TableAction, RowSelectionArgs } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Merchant API */
import * as api from "@merchant/api/fbw-shipping-price-drop";

/* Toolkit */
import * as logger from "@toolkit/logger";

/* Relative Imports */
import FBWShippingPriceTooltip from "./FBWShippingPriceTooltip";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { VariationShippingPrices } from "@merchant/api/fbw-shipping-price-drop";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FBWShippingPriceDropTableProps = BaseProps & {
  readonly data: ReadonlyArray<VariationShippingPrices>;
  readonly warehouseCode: string;
  readonly warehouseId: string;
  readonly onSubmit: () => unknown;
  readonly currencyCode: string;
};

@observer
class FBWShippingPriceDropTable extends Component<
  FBWShippingPriceDropTableProps
> {
  @observable
  selectedVariations: ObservableSet = new ObservableSet();

  @observable
  start = 0;

  @observable
  pageSize = 10;

  @computed
  get selectedRows(): ReadonlyArray<number> {
    const { selectedVariations } = this;
    return selectedVariations.toArray().map((rowIndex) => parseInt(rowIndex));
  }

  @action
  onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<VariationShippingPrices>) => {
    if (selected) {
      this.selectedVariations.add(index.toString());
    } else {
      this.selectedVariations.remove(index.toString());
    }
  };

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
    this.selectedVariations.clear();
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
      priceComparison: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      vs: {
        color: "#c4cdd5",
        flex: 1,
        textAlign: "center",
        marginLeft: 5,
        marginRight: 5,
      },
      suggestedPrice: {
        color: "#2fb7ec",
      },
    });
  }

  async confirmShippingPriceDrops(
    rows: ReadonlyArray<VariationShippingPrices>
  ) {
    if (rows.length > 1) {
      const modal = new ConfirmationModal(
        i`You will drop shipping prices for all selected products. ` +
          i`If you need to edit the shipping prices again, ` + // eslint-disable-next-line local-rules/no-links-in-i18n
          i`please visit the [FBW Inventory page](/fbw/inventory).`
      );
      modal
        .setAction(i`Confirm`, async () => {
          await this.acceptShippingPriceDrop(rows);
        })
        .setCancel(i`Cancel`)
        .setIllustration("fbwShippingPriceDrop")
        .setHeader({ title: i`Confirm drop shipping prices` })
        .setOverflowY("hidden")

        .render();
    } else {
      await this.acceptShippingPriceDrop(rows);
    }
  }

  async acceptShippingPriceDrop(rows: ReadonlyArray<VariationShippingPrices>) {
    const { currencyCode, onSubmit, warehouseId } = this.props;
    const shippingDrops = rows.map((row) => ({
      warehouse_id: warehouseId,
      product_id: row.product_id,
      variation_id: row.variation_id,
      shipping_prices: { ...row.shipping_prices },
    }));
    const params = {
      shipping_drops: JSON.stringify(shippingDrops),
      currency: currencyCode,
    };
    const { toastStore } = AppStore.instance();
    try {
      await api.acceptShippingPriceDrops(params).call();
      this.selectedVariations.clear();
      toastStore.positive(i`You dropped the shipping prices successfully!`);
      this.logAccept(rows.length);
      onSubmit();
    } catch (err) {
      toastStore.negative(i`Something went wrong, please try again later.`);
    }
  }

  async rejectShippingPriceDrop(row: VariationShippingPrices) {
    const { onSubmit } = this.props;
    const params = {
      variation_id: row.variation_id,
      warehouse_id: row.warehouse_id,
      product_id: row.product_id,
    };
    const { toastStore } = AppStore.instance();
    try {
      await api.rejectShippingPriceDrop(params).call();
      this.selectedVariations.clear();
      toastStore.positive(i`Shipping price drop dismissed`);
      this.logReject();
      onSubmit();
    } catch (err) {
      toastStore.negative(i`Something went wrong, please try again later.`);
    }
  }

  logReject() {
    logger.log("FBW_RECOMMENDATION_DASHBOARD_CLICK", {
      action: "shipping_price_drop_reject",
    });
  }

  logAccept(qty: number) {
    logger.log("FBW_RECOMMENDATION_DASHBOARD_CLICK", {
      action: "shipping_price_drop_accept",
      qty,
    });
  }

  @computed
  get tableActions(): ReadonlyArray<TableAction> {
    return [
      {
        key: "drop",
        name: i`Drop prices`,
        canBatch: true,
        canApplyToRow: () => {
          return true;
        },
        apply: async (rows) => {
          await this.confirmShippingPriceDrops(rows);
        },
      },
      {
        key: "dismiss",
        name: i`Dismiss`,
        canBatch: false,
        canApplyToRow: () => {
          return true;
        },
        apply: async (rows) => {
          await this.rejectShippingPriceDrop(rows[0]);
        },
      },
    ];
  }

  renderShippingPriceTable(row: VariationShippingPrices) {
    const { currencyCode, warehouseCode } = this.props;
    return (
      <FBWShippingPriceTooltip
        isHistory={false}
        currencyCode={currencyCode}
        warehouseCode={warehouseCode}
        data={row.shipping_prices}
      />
    );
  }

  renderShippingPriceRange(row: VariationShippingPrices, suggested: boolean) {
    const { currencyCode } = this.props;
    const currentPrices: number[] = [];
    for (const country of Object.keys(row.shipping_prices)) {
      if (suggested) {
        currentPrices.push(
          row.shipping_prices[country as keyof typeof row.shipping_prices]
            .suggested
        );
      } else {
        currentPrices.push(
          row.shipping_prices[country as keyof typeof row.shipping_prices]
            .current
        );
      }
    }
    const minPrice = Math.min(...currentPrices);
    const maxPrice = Math.max(...currentPrices);
    let priceRange = "";
    if (minPrice === maxPrice) {
      priceRange = formatCurrency(minPrice, currencyCode);
    } else {
      priceRange =
        formatCurrency(minPrice, currencyCode).toString() +
        "-" +
        formatCurrency(maxPrice, currencyCode).toString();
    }
    return (
      <Popover
        position={"right"}
        popoverContent={() => this.renderShippingPriceTable(row)}
      >
        {priceRange}
      </Popover>
    );
  }

  renderPriceComparisonField(row: VariationShippingPrices) {
    return (
      <div className={css(this.styles.priceComparison)}>
        <div>{this.renderShippingPriceRange(row, false)}</div>
        <div className={css(this.styles.vs)}>VS</div>
        <div className={css(this.styles.suggestedPrice)}>
          {this.renderShippingPriceRange(row, true)}
        </div>
      </div>
    );
  }

  renderTable() {
    return (
      <Table
        data={this.visibleData}
        maxVisibleColumns={9}
        noDataMessage={i`No shipping prices to drop!`}
        highlightRowOnHover
        actions={this.tableActions}
        selectedRows={this.selectedRows}
        onRowSelectionToggled={this.onRowSelectionToggled}
        rowHeight={68}
      >
        <ProductColumn title={i`Product`} columnKey="product_id" width={300} />
        <Table.Column title={i`SKU`} columnKey="sku" canCopyText />
        <Table.Column
          title={i`Your Price vs Suggested Price`}
          columnKey={"variation_id"}
        >
          {({ row }) => this.renderPriceComparisonField(row)}
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

export default FBWShippingPriceDropTable;
