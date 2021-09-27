import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { Checkmark } from "@ContextLogic/lego";
import { ExplanationBanner } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Merchant Model */
import Campaign from "@merchant/model/product-boost/Campaign";
import Product from "@merchant/model/product-boost/Product";

/* Merchant Store */
import ProductBoostStore from "@merchant/stores/product-boost/ProductBoostStore";

/* Toolkit */
import { DailyBudgetCampaignExplanations } from "@toolkit/product-boost/resources/tooltip";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TableAction, RowSelectionArgs } from "@ContextLogic/lego";
import { EligibleProduct } from "@merchant/api/product-boost";
import { CellInfo } from "@ContextLogic/lego";
import { CopyButton } from "@ContextLogic/lego";

export type EligibleProductsTableProps = BaseProps & {
  readonly allowMaxboost: boolean;
  readonly products: ReadonlyArray<EligibleProduct>;
  readonly dailyBudgetEnabled?: boolean;
  readonly selectedProducts?: ReadonlyArray<Product>;
  readonly setSelectedProducts?: (
    updateFunction: (
      products: ReadonlyArray<Product>,
    ) => ReadonlyArray<Product>,
  ) => void;
};

@observer
class EligibleProductsTable extends Component<EligibleProductsTableProps> {
  @computed
  get tableRows() {
    const { products } = this.props;
    return products;
  }

  @computed
  get selectedRows(): ReadonlyArray<number> {
    const { tableRows, existingProductIds } = this;

    let selectedIndeces: ReadonlyArray<number> = [];
    tableRows.forEach((row, index) => {
      if (existingProductIds.includes(row.id)) {
        selectedIndeces = [...selectedIndeces, index];
      }
    });

    return selectedIndeces;
  }

  @computed
  get campaign(): Campaign | null | undefined {
    const { currentCampaign } = ProductBoostStore.instance();
    return currentCampaign;
  }

  // This is hiding a bug. Should be Readonly<Product>
  @computed
  get products(): Array<Product> {
    return this.campaign?.products || [];
  }

  @computed
  get dailyBudgetProducts(): ReadonlyArray<Product> {
    const { dailyBudgetEnabled, selectedProducts, setSelectedProducts } =
      this.props;
    if (dailyBudgetEnabled && selectedProducts && setSelectedProducts) {
      return selectedProducts;
    }
    return [];
  }

  @computed
  get existingProductIds(): ReadonlyArray<string> {
    const { dailyBudgetEnabled } = this.props;
    if (dailyBudgetEnabled) {
      return this.dailyBudgetProducts.map((product) => product.id);
    }
    return this.products.map((product) => product.id);
  }

  onRowSelectionToggled = ({
    row,
    selected,
  }: RowSelectionArgs<EligibleProduct>) => {
    const { dailyBudgetEnabled } = this.props;
    if (selected) {
      if (dailyBudgetEnabled) {
        this.addDailyBudgetProduct(row);
      } else {
        this.addProduct(row);
      }
    } else {
      if (dailyBudgetEnabled) {
        this.removeDailyBudgetProduct(row);
      } else {
        this.removeProduct(row);
      }
    }
  };

  addDailyBudgetProduct(row: EligibleProduct) {
    const { existingProductIds, dailyBudgetProducts } = this;
    const {
      dailyBudgetEnabled,
      selectedProducts,
      setSelectedProducts,
      allowMaxboost,
    } = this.props;
    if (!existingProductIds.includes(row.id)) {
      let newUniqId = 0;
      if (dailyBudgetProducts.length) {
        const allUniqIds = dailyBudgetProducts.map((p) => p.uniqId || 0);
        const maxUniqId = Math.max(...allUniqIds);
        newUniqId = maxUniqId + 1;
      }
      if (dailyBudgetEnabled && selectedProducts && setSelectedProducts) {
        const product = new Product({
          id: row.id,
          keywords: "",
          bid: "",
          isMaxboost: allowMaxboost,
          uniqId: newUniqId,
          name: row.name,
          parentSku: row.parent_sku,
          brandId: row.brand_id,
          trending: row.trending,
          eligibleForCampaign: row.eligible_for_campaign,
        });
        setSelectedProducts((selectedProducts) => [
          ...selectedProducts,
          product,
        ]);
      }
    }
  }

  addProduct(row: EligibleProduct) {
    const { existingProductIds, products, campaign } = this;
    const { allowMaxboost } = this.props;
    if (!existingProductIds.includes(row.id)) {
      let newUniqId = 0;
      if (products.length) {
        const allUniqIds = products.map((p) => p.uniqId || 0);
        const maxUniqId = Math.max(...allUniqIds);
        newUniqId = maxUniqId + 1;
      }
      if (campaign && campaign.products) {
        campaign.products.push(
          new Product({
            id: row.id,
            keywords: "",
            bid: "",
            isMaxboost: allowMaxboost,
            uniqId: newUniqId,
            name: row.name,
            parentSku: row.parent_sku,
            brandId: row.brand_id,
            trending: row.trending,
            hasVideo: row.has_video,
          }),
        );
      }
    }
  }

  removeProduct(row: EligibleProduct) {
    const { existingProductIds, products } = this;
    const idIndex = existingProductIds.indexOf(row.id);
    if (idIndex > -1) {
      products.splice(idIndex, 1);
    }
  }

  removeDailyBudgetProduct(row: EligibleProduct) {
    const { dailyBudgetEnabled, selectedProducts, setSelectedProducts } =
      this.props;
    if (dailyBudgetEnabled && selectedProducts && setSelectedProducts) {
      setSelectedProducts((selectedProducts) =>
        selectedProducts.filter((p) => p.id !== row.id),
      );
    }
  }

  @computed
  get tableActions(): ReadonlyArray<TableAction> {
    return [
      {
        key: "add",
        name: (rows) => {
          if (rows.length === 1) {
            return i`Add Product`;
          }
          return i`Add Products`;
        },
        canBatch: true,
        canApplyToRow: (product) => true,
        apply: ([product]) => {},
      },
    ];
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      button: {
        marginLeft: 8,
        fontSize: 14,
        textAlign: "left",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      },
      productName: {
        overflow: "hidden",
        maxWidth: "100%",
        textOverflow: "ellipsis",
      },
      text: {
        fontSize: 14,
        lineHeight: 1.5,
      },
    });
  }

  renderProductName(value: string) {
    return <div className={css(this.styles.productName)}>{value}</div>;
  }

  renderTrendingBadge(trending: EligibleProduct["trending"]) {
    if (trending) {
      return <Checkmark checked={trending} size={20} />;
    }
    return null;
  }

  renderParentSKU(value: string) {
    return <CopyButton>{value}</CopyButton>;
  }

  render() {
    const { dailyBudgetEnabled } = this.props;
    return (
      <Table
        className={css(this.styles.root)}
        data={this.tableRows}
        fixLayout
        hideBorder
        overflowY="visible"
        highlightRowOnHover
        selectedRows={this.selectedRows}
        onRowSelectionToggled={this.onRowSelectionToggled}
        canSelectRow={(row) => row.row.eligible_for_campaign}
        rowHeight={68}
        noDataMessage={() => (
          <ExplanationBanner>
            <ExplanationBanner.Item
              title={i`No product found`}
              illustration="uploadProductIcon"
              maxWidth={600}
            >
              <Markdown
                className={css(this.styles.text)}
                openLinksInNewTab
                text={
                  i`You can upload products to create a ` +
                  i`ProductBoost Campaign. [Upload Products](${"/add-products"})`
                }
              />
            </ExplanationBanner.Item>
          </ExplanationBanner>
        )}
      >
        <ProductColumn
          showProductId
          title={i`Product ID`}
          columnKey="id"
          width={300}
          showFullProductId={false}
        />
        <Table.Column
          columnKey="name"
          title={i`Product name`}
          noDataMessage={"\u2014"}
        >
          {({ value }: CellInfo<EligibleProduct["id"], EligibleProduct>) =>
            this.renderProductName(value)
          }
        </Table.Column>
        <Table.Column
          columnKey="trending"
          title={i`Trending`}
          noDataMessage={"\u2014"}
          description={i`Seasonal hot selling category products`}
          align="center"
        >
          {({
            value,
          }: CellInfo<EligibleProduct["trending"], EligibleProduct>) =>
            this.renderTrendingBadge(value)
          }
        </Table.Column>
        <Table.Column
          columnKey="parent_sku"
          title={i`Parent SKU`}
          noDataMessage={"\u2014"}
        >
          {({
            value,
          }: CellInfo<EligibleProduct["parent_sku"], EligibleProduct>) =>
            this.renderParentSKU(value)
          }
        </Table.Column>
        <Table.NumeralColumn
          columnKey="wishes"
          title={i`Wishes`}
          description={
            dailyBudgetEnabled
              ? DailyBudgetCampaignExplanations.WISHES_LIFETIME
              : null
          }
          noDataMessage={"\u2014"}
        />
        <Table.NumeralColumn
          columnKey="sales"
          title={i`Sales`}
          description={
            dailyBudgetEnabled
              ? DailyBudgetCampaignExplanations.SALES_LIFETIME
              : null
          }
          noDataMessage={"\u2014"}
        />
      </Table>
    );
  }
}
export default EligibleProductsTable;
