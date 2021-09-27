import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { TextInputWithSelect } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";
import { css } from "@toolkit/styling";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

/* SVGs */
import searchImg from "@assets/img/search.svg";

import { RowSelectionArgs } from "@ContextLogic/lego";
import { WarehouseType } from "@toolkit/fbw";
import { Product } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { MerchantAPIRequest } from "@toolkit/api";

type FBWAddProductsTableProps = BaseProps & {
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly selectedRows: ReadonlyArray<Product>;
  readonly onRowSelectionToggled?: (
    args: RowSelectionArgs<Product>
  ) => unknown | null | undefined;
  readonly clearSelectedRowsInModal: (
    variation?: string
  ) => unknown | null | undefined;
};

@observer
class FBWAddProductsTable extends Component<FBWAddProductsTableProps> {
  KEYS = {
    ID: "id",
    SKU: "sku",
  };

  MAX_SEARCH_NUM = 50;

  @observable
  query: ReadonlyArray<string> = [];

  @observable
  searchType = this.KEYS.ID;

  @observable
  idSelectedSKUs: ObservableSet = new ObservableSet();

  @observable
  skuSelectedSKUs: ObservableSet = new ObservableSet();

  @computed
  get selectedKeys(): ObservableSet {
    return this.searchType === this.KEYS.ID
      ? this.idSelectedSKUs
      : this.skuSelectedSKUs;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 24,
      },
      input: {
        minWidth: "100%",
        paddingBottom: 24,
      },
      loadingSpinner: {
        display: "flex",
        justifyContent: "center",
      },
    });
  }

  @action
  removeFromSelection(entry: Product) {
    const { clearSelectedRowsInModal } = this.props;
    if (clearSelectedRowsInModal) {
      clearSelectedRowsInModal(entry.variation_id);
    }
    this.selectedKeys.delete(entry.sku);
  }

  @action
  onTokensChanged = (params: { tokens: ReadonlyArray<string> }) => {
    const newQuery = params.tokens.slice(0, this.MAX_SEARCH_NUM);
    const newQuerySet = new Set(newQuery);

    // Idea: If a selected elem is removed from display, it should be unselected if it is readded.
    const removedFromQuery = this.query.filter((q) => !newQuerySet.has(q));
    for (const rfq of removedFromQuery) {
      const correspondingTableEntries = this.results.filter((r) => {
        if (this.searchType === this.KEYS.ID) {
          return r.product_id === rfq;
        }
        return r.sku === rfq || r.parent_sku === rfq;
      });
      const checkedCorrespondingTableEntries = correspondingTableEntries.filter(
        (r) => this.selectedKeys.has(r.sku)
      );
      for (const ccte of checkedCorrespondingTableEntries) {
        // if searching by ID, removing from query will always remove from display (IDs unique)
        if (this.searchType === this.KEYS.ID) {
          this.removeFromSelection(ccte);
        } // if searching by SKU, removing from query doesn't remove from display ONLY IF
        // there is still a ref to the entry (parent or variation SKU) in the query after removal
        else {
          const refStillExistsInQuery = newQuery.some(
            (q) => ccte.sku === q || ccte.parent_sku === q
          );
          if (!refStillExistsInQuery) {
            this.removeFromSelection(ccte);
          }
        }
      }
    }
    this.query = newQuery;
  };

  @action
  onSelectedSearchFieldChanged = (selectedSearchField: string) => {
    const { clearSelectedRowsInModal } = this.props;
    if (clearSelectedRowsInModal) {
      clearSelectedRowsInModal();
    }
    this.selectedKeys.clear();
    this.searchType = selectedSearchField;
  };

  @action
  onRowSelectionToggled = ({
    row,
    index,
    selected,
  }: RowSelectionArgs<Product>) => {
    if (this.props.onRowSelectionToggled) {
      this.props.onRowSelectionToggled({ row, index, selected });
    }
    if (row.sku && row.sku.trim().length > 0) {
      if (selected) {
        this.selectedKeys.add(row.sku);
      } else {
        this.selectedKeys.delete(row.sku);
      }
    }
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

  @computed
  get dataRequest() {
    const { warehouses } = this.props;
    const res: MerchantAPIRequest<
      fbwApi.SearchSKUParams,
      fbwApi.SearchSKUResponse
    >[] = [];
    for (const q of this.query) {
      res.push(
        fbwApi.searchSKU({
          query: q.trim(),
          search_type: this.searchType,
          warehouse_ids: JSON.stringify(
            warehouses.map((warehouse) => {
              return warehouse.id;
            })
          ),
        })
      );
    }
    return res;
  }

  @computed
  get results(): ReadonlyArray<Product> {
    const allResults = (this.dataRequest || []).reduce(
      (
        acc: ReadonlyArray<Product>,
        cur: MerchantAPIRequest<
          fbwApi.SearchSKUParams,
          fbwApi.SearchSKUResponse
        >
      ) => {
        const res = cur?.response?.data?.results || [];
        return [...acc, ...res];
      },
      []
    );
    return _.uniqBy(allResults, "sku");
  }

  @computed
  get dataLoaded() {
    if (this.dataRequest) {
      return this.dataRequest.reduce((acc, cur) => acc && !cur.isLoading, true);
    }
    return false;
  }

  @computed
  get selectedRows(): ReadonlyArray<number> {
    return _.flatMap(this.results, (elem, idx) => {
      return this.selectedKeys.has(elem.sku) ? idx : [];
    });
  }

  renderTable() {
    if (!this.dataLoaded) {
      return (
        <div className={css(this.styles.loadingSpinner)}>
          <LoadingIndicator type="swinging-bar" size={50} />
        </div>
      );
    }
    return (
      <Table
        data={this.results}
        canSelectRow={() => true}
        selectedRows={this.selectedRows}
        onRowSelectionToggled={this.onRowSelectionToggled}
        rowHeight={68}
      >
        <ProductColumn columnKey="product_id" title={i`Product`} width={300} />
        <Table.Column title={i`Color`} columnKey="color" minWidth={50} />
        <Table.Column title={i`Size`} columnKey="size" minWidth={50} />
        <Table.Column columnKey={"sku"} title={i`Variation SKU`} minWidth={250}>
          {({ row }) => this.renderVariationSKU(row)}
        </Table.Column>
      </Table>
    );
  }

  render() {
    return (
      <div className={css(this.styles.root)}>
        <TextInputWithSelect
          className={css(this.styles.input)}
          selectProps={{
            selectedValue: this.searchType,
            options: [
              {
                value: this.KEYS.SKU,
                text: i`Product SKU`,
              },
              {
                value: this.KEYS.ID,
                text: i`Product ID`,
              },
            ],
            onSelected: this.onSelectedSearchFieldChanged,
          }}
          textInputProps={{
            icon: searchImg,
            placeholder:
              i`Search for a product ${this.searchType.toUpperCase()} ` +
              i`within your inventory`,
            tokenize: true,
            onTokensChanged: this.onTokensChanged,
            noDuplicateTokens: true,
            maxTokens: this.MAX_SEARCH_NUM,
            style: { minWidth: "25vw" },
          }}
        />
        {this.renderTable()}
      </div>
    );
  }
}

export default FBWAddProductsTable;
