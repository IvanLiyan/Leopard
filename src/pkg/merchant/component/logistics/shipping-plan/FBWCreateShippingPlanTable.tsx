import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { action, computed, observable } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";
import _ from "lodash";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { SecondaryButton } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import { ObservableSet } from "@ContextLogic/lego/toolkit/collections";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import ProductImage from "@merchant/component/products/ProductImage";

/* Merchant API */
import * as api from "@merchant/api/fbw";

/* Toolkit */
import { contestImageURL } from "@toolkit/url";
import * as logger from "@toolkit/logger";

/* Relative Imports */
import FBWAddProductsModal from "./FBWAddProductsModal";
import ShippingPlanSKUDetailRow from "./ShippingPlanSKUDetailRow";
import FBWManuallyAddProductsTableNoData from "./FBWManuallyAddProductsTableNoData";
import FBWRecommendProductsTableNoData from "./FBWRecommendProductsTableNoData";
import FBWWarehouseQuantityInput from "./FBWWarehouseQuantityInput";

/* SVGs */
import closeIcon from "@assets/img/black-close.svg";

import { WarehouseType } from "@toolkit/fbw";
import { RowSelectionArgs } from "@ContextLogic/lego";
import { OnChangeEvent } from "@ContextLogic/lego";
import { DistributionItem, BlacklistReason } from "@merchant/api/fbw";
import { Product } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { WarehouseQuantityChangeArgs } from "./FBWWarehouseQuantityInput";
import { formatDatetimeLocalized } from "@toolkit/datetime";

const minWarehouseSkuQuantity = 5;
const AdjustBuffer = 0.1;
const ShippingPlanAddPreviousSalesButtonLogTableName =
  "FBW_SHIPPING_PLAN_CREATION";

type FBWCreateShippingPlanTableProps = BaseProps & {
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly rows: ReadonlyArray<Product>;
  readonly variationWarehouseQuantity: Map<string, Map<string, number>>;
  readonly variationWarehouseDistribution: Map<
    string,
    Map<string, DistributionItem>
  >;
  readonly variationQuantity: Map<string, number>;
  readonly onQuantityChange?: (
    event: OnChangeEvent,
    variationId: string
  ) => unknown | null | undefined;
  readonly onWarehouseQuantityChange?: (
    args: WarehouseQuantityChangeArgs
  ) => unknown | null | undefined;
  readonly onRowSelectionToggled?: (
    args: RowSelectionArgs<Product>
  ) => unknown | null | undefined;
  readonly selectedVariations?: ReadonlyArray<Product>;
  readonly currentPage: number;
  readonly onCurrentPageChanged: (currentPage: number) => unknown;
  readonly onAddModalRowSelectionToggled: (
    args: RowSelectionArgs<Product>
  ) => unknown | null | undefined;
  readonly handleAddToShippingPlanOnClick?: (() => unknown) | null | undefined;
  readonly handleAddPreviousSalesToShippingPlanOnClick?: (
    args: ReadonlyArray<Product>
  ) => unknown | null | undefined;
  readonly clearSelectedRowsInModal: (
    variation?: string
  ) => unknown | null | undefined;
  readonly isRecommendedTab: boolean;
  readonly showPreviousSoldProducts?: boolean;
  readonly handleDismissPreviousSalesOnClick?:
    | (() => unknown)
    | null
    | undefined;
  readonly shipmentType: string;
};

@observer
class FBWCreateShippingPlanTable extends Component<
  FBWCreateShippingPlanTableProps
> {
  constructor(props: FBWCreateShippingPlanTableProps) {
    super(props);
    const { currentPage } = this.props;
    this.currentPage = currentPage;
  }

  activeFBWWarehouseQuantityInput:
    | FBWWarehouseQuantityInput
    | null
    | undefined = null;

  replaceActiveFBWWarehouseQuantityInput(
    input: FBWWarehouseQuantityInput | null | undefined
  ) {
    if (
      this.activeFBWWarehouseQuantityInput &&
      input !== this.activeFBWWarehouseQuantityInput
    ) {
      this.activeFBWWarehouseQuantityInput.isActive = false;
    }
    if (input) {
      input.isActive = true;
    }
    this.activeFBWWarehouseQuantityInput = input;
  }

  itemsInOnePage = 10;

  numDays = 90;

  variationLimit = 5;

  @observable
  currentPage = 0;

  @observable
  expandedRows: ObservableSet = new ObservableSet();

  @observable
  rows: ReadonlyArray<Product> = this.props.rows;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      content: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 24,
      },
      product: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        transition: "opacity 0.3s linear",
        ":hover": {
          opacity: 0.8,
        },
      },
      rowDetails: {
        padding: "15px 20px",
        background: "#F6F8F9",
      },
      image: {
        width: 32,
        marginRight: 15,
      },
      input: {},
      warehouseQuantity: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      warehouseQuantityBlocked: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        color: palettes.textColors.LightInk,
      },
      buttonRowSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 20,
      },
      selectButtonSection: {
        display: "flex",
        flexDirection: "row",
      },
      addProduct: {
        display: "flex",
        flexDirection: "row",
        lineHeight: "24px",
        fontSize: "16px",
      },
      blockedInfo: {
        display: "flex",
        flexDirection: "row",
        alignSelf: "center",
        marginLeft: 7,
      },
      lowStockDate: {
        color: palettes.textColors.Ink,
        opacity: 0.5,
      },
      lowStockWarehouse: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
      },
      addTop: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: colors.pageBackground,
        marginLeft: 24,
        marginRight: 24,
        marginBottom: 20,
        marginTop: 20,
        paddingTop: 20,
        paddingBottom: 20,
      },
      imgList: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      img: {
        width: 48,
        height: 48,
        marginLeft: 6,
        marginRight: 6,
        marginTop: 8,
        marginBottom: 8,
      },
      addHead: {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        left: 0,
        top: 0,
        width: "100%",
      },
      addText: {
        fontSize: 16,
        lineHeight: 1.5,
        color: palettes.textColors.Ink,
        fontWeight: fonts.weightNormal,
        fontFamily: fonts.proxima,
        display: "flex",
        flexDirection: "row",
        flex: 1,
        cursor: "default",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        fontStyle: "normal",
        fontStretch: "normal",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: 10,
        paddingRight: 10,
      },
      actBtn: {
        marginTop: 8,
      },
      close: {
        cursor: "pointer",
        fill: palettes.textColors.DarkInk,
        opacity: 0.5,
        width: 16,
        position: "absolute",
        right: 16,
        top: 0,
        ":hover": {
          opacity: 1,
        },
      },
    });
  }

  renderVariationSKU(row: Product) {
    if (row.sku) {
      const varitionName = row.sku.substring(Math.max(0, row.sku.length - 50));
      return (
        <div className={css(this.styles.product)}>
          <img
            className={css(this.styles.image)}
            alt="product"
            src={contestImageURL({ contestId: row.product_id, size: "small" })}
          />
          <section>{varitionName}</section>
        </div>
      );
    }
  }

  getSoldQuantity(product: Product) {
    const { variationWarehouseDistribution } = this.props;
    const variationId = product.variation_id || "";
    const warehouseDistributionMap = variationWarehouseDistribution.get(
      variationId
    );
    let soldQuantity = 0;
    if (warehouseDistributionMap) {
      for (const warehouseCode of warehouseDistributionMap.keys()) {
        const distributionItem = warehouseDistributionMap.get(warehouseCode);
        if (distributionItem && distributionItem.last_90_days_sold) {
          soldQuantity += distributionItem.last_90_days_sold;
        }
      }
    }
    return soldQuantity;
  }

  renderLowStock(product: Product) {
    const { variationWarehouseDistribution } = this.props;
    const variationId = product.variation_id;
    const warehouseDistributionMap = variationWarehouseDistribution.get(
      variationId
    );
    let estimatedDaysUntilOutOfStock = 0;
    let estimateOutOfStockWarehouse: string | null | undefined = "N/A";
    if (warehouseDistributionMap) {
      for (const warehouseCode of warehouseDistributionMap.keys()) {
        const distributionItem = warehouseDistributionMap.get(warehouseCode);
        if (
          distributionItem &&
          distributionItem.estimated_days_until_out_of_stock &&
          (estimateOutOfStockWarehouse === "N/A" ||
            estimatedDaysUntilOutOfStock >
              distributionItem.estimated_days_until_out_of_stock)
        ) {
          estimatedDaysUntilOutOfStock =
            distributionItem.estimated_days_until_out_of_stock;
          estimateOutOfStockWarehouse = warehouseCode;
        }
      }
    }
    const estimateOutOfStockDate = formatDatetimeLocalized(
      moment().add(estimatedDaysUntilOutOfStock, "days"),
      "YYYY-MM-DD"
    );
    return (
      <>
        <div className={css(this.styles.lowStockWarehouse)}>
          <div>{estimateOutOfStockWarehouse}</div>
          {estimateOutOfStockWarehouse === "N/A" && (
            <Info
              text={
                i`This is likely a new product. We will share the estimated out-of-stock ` +
                i`information once more sales data for this product is collected.`
              }
              sentiment="info"
              position="right"
            />
          )}
        </div>
        {estimateOutOfStockWarehouse !== "N/A" && (
          <div className={css(this.styles.lowStockDate)}>
            {estimateOutOfStockDate}
          </div>
        )}
      </>
    );
  }

  renderQuantity(one: Product) {
    const { variationQuantity } = this.props;
    const variationId = one.variation_id || "";
    const quantity = variationQuantity.get(variationId) || 10;
    return (
      <NumericInput
        className={css(this.styles.input)}
        value={this.canSelectRow(one) ? Number(quantity) : 0}
        incrementStep={1}
        onChange={(event) => this.onQuantityChange(event, variationId)}
        disabled={!this.canSelectRow(one)}
        style={{ minWidth: 100 }}
      />
    );
  }

  renderWarehouseQuantity = (one: Product, warehouseCode: string) => {
    const variationId = one.variation_id || "";
    const warehouseQuantityMap = this.props.variationWarehouseQuantity.get(
      variationId
    );
    const quantity = warehouseQuantityMap
      ? warehouseQuantityMap.get(warehouseCode) || 0
      : 0;
    const warehouseDistributionMap = this.props.variationWarehouseDistribution.get(
      variationId
    );
    let blocked = false;
    let reason: BlacklistReason = undefined;
    if (
      warehouseDistributionMap &&
      warehouseDistributionMap.has(warehouseCode)
    ) {
      const distributionInfo = warehouseDistributionMap.get(warehouseCode);
      // We allow poor performance products to ship to FBW before we have better blacklist feature.
      // More details https://jira.wish.site/browse/MKL-30437
      if (distributionInfo && distributionInfo.reason != "POOR_PERF") {
        blocked = distributionInfo.blacklisted;
        reason = distributionInfo.reason;
      }
    }

    return (
      <FBWWarehouseQuantityInput
        quantity={quantity}
        warehouseCode={warehouseCode}
        variationId={variationId}
        blocked={blocked}
        blockReason={reason}
        onWarehouseQuantityChange={this.onWarehouseQuantityChange}
        replaceActiveFBWWarehouseQuantityInput={this.replaceActiveFBWWarehouseQuantityInput.bind(
          this
        )}
      />
    );
  };

  @computed
  get totalItems() {
    const { rows } = this.props;
    return rows.length;
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

  @computed
  get displayedRows(): ReadonlyArray<Product> {
    const { rows } = this.props;
    return rows.slice(this.rangeStart - 1, this.rangeEnd);
  }

  @computed
  get selectedRows() {
    const { selectedVariations } = this.props;
    const selected: number[] = [];
    if (selectedVariations) {
      for (const row of selectedVariations) {
        const variationId = row.variation_id;
        let index = -1;
        for (const [i, displayedRow] of this.displayedRows.entries()) {
          if (displayedRow.variation_id === variationId) {
            index = i;
          }
        }
        if (index !== -1) {
          selected.push(index);
        }
      }
    }
    return selected;
  }

  @action
  onRowSelectionToggled = ({
    row,
    index,
    selected,
  }: RowSelectionArgs<Product>) => {
    if (this.props.onRowSelectionToggled) {
      this.props.onRowSelectionToggled({ row, index, selected });
    }
  };

  @action
  onPageChange = (currentPage: number) => {
    this.currentPage = currentPage;
    this.props.onCurrentPageChanged(currentPage);
  };

  @action
  onQuantityChange = (event: OnChangeEvent, variationId: string) => {
    if (this.props.onQuantityChange) {
      this.props.onQuantityChange(event, variationId);
    }
  };

  @action
  onWarehouseQuantityChange = ({
    event,
    variationId,
    warehouseCode,
  }: WarehouseQuantityChangeArgs) => {
    let warehouseInitialQuantity = 0;
    let initialQuantity = 0;
    const warehouseDistributionMap = this.props.variationWarehouseDistribution.get(
      variationId
    );
    if (
      warehouseDistributionMap &&
      warehouseDistributionMap.has(warehouseCode)
    ) {
      const distributionInfo = warehouseDistributionMap.get(warehouseCode);
      if (distributionInfo) {
        warehouseInitialQuantity = distributionInfo.quantity;
        initialQuantity = distributionInfo.initial_total_quantity;
      }
    }
    const range = this.validRange(warehouseInitialQuantity, initialQuantity);
    const [minAllowedValue, maxAllowedValue] = range;
    const newQuantity = event.valueAsNumber || 0;
    if (newQuantity < minAllowedValue || newQuantity > maxAllowedValue) {
      return;
    }
    if (this.props.onWarehouseQuantityChange) {
      this.props.onWarehouseQuantityChange({
        event,
        variationId,
        warehouseCode,
      });
    }
  };

  renderExpandedProduct = (item: Product) => {
    const skuItem = {
      product_id: item.product_id,
      parent_sku: item.parent_sku,
      sku: item.sku,
      source: item.source,
      product_name: item.name,
      size: item.size,
      color: item.color,
    };
    return (
      <ShippingPlanSKUDetailRow
        skuItem={skuItem}
        className={css(this.styles.rowDetails)}
      />
    );
  };

  @action
  onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      this.expandedRows.add(index.toString());
    } else {
      this.expandedRows.remove(index.toString());
    }
  };

  canSelectRow(row: Product) {
    const { variationWarehouseDistribution } = this.props;
    const warehouseDistributionMap = variationWarehouseDistribution.get(
      row.variation_id || ""
    );
    if (warehouseDistributionMap) {
      let allBlocked = true;
      for (const warehouseCode of warehouseDistributionMap.keys()) {
        const distributionItem = warehouseDistributionMap.get(warehouseCode);
        if (distributionItem) {
          if (
            (!distributionItem.blacklisted &&
              distributionItem.quantity !== 0) ||
            // We allow poor performance products to ship to FBW before we have better blacklist feature.
            // More details https://jira.wish.site/browse/MKL-30437
            distributionItem.reason == "POOR_PERF"
          ) {
            allBlocked = false;
          }
        }
      }
      return !allBlocked;
    }
    return true;
  }

  validRange = (quantity: number, totalQuantity: number): [number, number] => {
    // determines min/max values for warehouse SKU according to adjustment
    // buffer
    const min = Math.max(
      Math.floor(quantity - totalQuantity * AdjustBuffer),
      0
    );
    const max = Math.ceil(quantity + totalQuantity * AdjustBuffer);

    if (max < minWarehouseSkuQuantity) {
      // if 0 <= min <= max < min_warehouse_sku_quantity:
      // no valid values in range, lock to 0
      return [0, 0];
    } else if (0 < min && min < minWarehouseSkuQuantity) {
      // if 0 < min < min_warehouse_sku_quantity <= max:
      // quantity cannot be less than min_warehouse_sku_quantity (besides 0)
      // reset min to min_warehouse_sku_quantity
      return [minWarehouseSkuQuantity, max];
    }

    // if min = 0 or min >= min_warehouse_sku_quantity
    return [min, max];
  };

  showAddProductsModal = async () => {
    const {
      clearSelectedRowsInModal,
      handleAddToShippingPlanOnClick,
      onAddModalRowSelectionToggled,
      warehouses,
    } = this.props;

    new FBWAddProductsModal({
      warehouses,
      selectedRows: this.rows,
      onRowSelectionToggled: onAddModalRowSelectionToggled,
      handleAddToShippingPlanOnClick,
      clearSelectedRowsInModal,
    }).render();
  };

  renderTable = () => {
    const { rows, warehouses, isRecommendedTab, shipmentType } = this.props;
    if (rows.length === 0) {
      if (isRecommendedTab) {
        return (
          <FBWRecommendProductsTableNoData
            allowAddingProduct={shipmentType === "FBW"}
            onClick={this.showAddProductsModal}
          />
        );
      }
      return (
        <FBWManuallyAddProductsTableNoData
          onClick={this.showAddProductsModal}
        />
      );
    }
    const warehouseColumns = _.sortBy(
      warehouses,
      (warehouse) => warehouse.region
    ).map((warehouse) => {
      return (
        <Table.Column
          key={warehouse.warehouse_name.slice(7, 10)}
          title={warehouse.warehouse_name.slice(4)}
          columnKey={warehouse.warehouse_name.slice(7, 10)}
          width={100}
          description={
            i`The quantity of each SKU is automatically calculated` +
            i` for selected FBW warehouses to optimize your future sales.`
          }
          align="center"
          handleEmptyRow
        >
          {({ row }) =>
            this.renderWarehouseQuantity(
              row,
              warehouse.warehouse_name.slice(7, 10)
            )
          }
        </Table.Column>
      );
    });
    return (
      <Table
        data={this.displayedRows}
        noDataMessage={i`You can manually add products to your shipping plan now.`}
        canSelectRow={(row) => this.canSelectRow(row.row)}
        selectedRows={this.selectedRows}
        rowExpands={() => true}
        renderExpanded={this.renderExpandedProduct}
        onRowExpandToggled={this.onRowExpandToggled}
        expandedRows={this.expandedRows.toArray().map((row) => parseInt(row))}
        onRowSelectionToggled={this.onRowSelectionToggled}
        rowHeight={null}
        highlightRowOnHover
      >
        <Table.Column title={i`Variation SKU`} columnKey="sku">
          {({ row }) => this.renderVariationSKU(row)}
        </Table.Column>

        {isRecommendedTab && (
          <Table.CurrencyColumn
            columnKey="gmv"
            currencyCode="USD"
            title={"GMV"}
            description={i`Your total GMV of the last 90 days`}
            align="right"
          />
        )}

        <Table.Column
          columnKey="product_id"
          title={i`Sold`}
          description={
            shipmentType === "FBS"
              ? i`Products picked up in Wish’s partnered stores in the last 30 days.`
              : i`FBW Quantity sold in the last 90 days.`
          }
          align="right"
          noDataMessage=""
        >
          {({ row }) => this.getSoldQuantity(row)}
        </Table.Column>

        <Table.Column
          columnKey="distribution"
          title={i`Out-of-stock by`}
          align="right"
          minWidth={100}
          noDataMessage=""
        >
          {({ row }) => this.renderLowStock(row)}
        </Table.Column>
        {warehouseColumns}

        <Table.Column
          title={i`Quantity`}
          columnKey="quantity"
          description={
            i`The total quantity of each SKU you plan to ` +
            i`send to FBW warehouses.`
          }
          descriptionPopoverMinWidth={350}
          align="right"
        >
          {({ row }) => this.renderQuantity(row)}
        </Table.Column>
      </Table>
    );
  };

  logAddButton(vids: string, added: boolean) {
    logger.log(ShippingPlanAddPreviousSalesButtonLogTableName, {
      action: `add_previous_top_sellers_${added.toString()}`,
      data: vids,
    });
  }

  @computed
  get request() {
    const { warehouses } = this.props;
    return api.getFBWRecentlySoldVariations({
      limit: this.variationLimit,
      num_days: this.numDays,
      warehouse_ids: JSON.stringify(
        warehouses.map((warehouse) => {
          return warehouse.id;
        })
      ),
    });
  }

  @computed
  get topVariations(): ReadonlyArray<Product> {
    return this.request.response?.data?.results || [];
  }

  renderPreviousSalesSection = () => {
    const {
      handleAddPreviousSalesToShippingPlanOnClick,
      handleDismissPreviousSalesOnClick,
    } = this.props;
    let productList: Array<Product> = [];
    // Only display one picture for variations with the same product_id
    productList = this.topVariations.filter((variation) => {
      const exists = productList.some(
        (product) => product.product_id === variation.product_id
      );
      if (!exists) {
        productList.push(variation);
      }
      return exists;
    });
    const imgList = productList.map((variation) => {
      return (
        <ProductImage
          productId={variation.product_id}
          className={css(this.styles.img)}
          key={variation.variation_id}
        />
      );
    });
    if (imgList.length === 0) {
      return null;
    }
    return (
      <div className={css(this.styles.addTop)}>
        <div className={css(this.styles.addHead)}>
          <div className={css(this.styles.addText)}>
            These products received sales recently. Would you like to add them?
          </div>
          <div
            className={css(this.styles.close)}
            onClick={() => {
              this.logAddButton(
                this.topVariations.map((v) => v.variation_id).join(","),
                false
              );
              if (handleDismissPreviousSalesOnClick) {
                handleDismissPreviousSalesOnClick();
              }
            }}
          >
            <img src={closeIcon} alt="close icon" />
          </div>
        </div>
        <div className={css(this.styles.imgList)}>{imgList}</div>
        <div className={css(this.styles.actBtn)}>
          <SecondaryButton
            text={i`Add`}
            onClick={() => {
              this.logAddButton(
                this.topVariations.map((v) => v.variation_id).join(","),
                true
              );
              if (handleAddPreviousSalesToShippingPlanOnClick) {
                handleAddPreviousSalesToShippingPlanOnClick(this.topVariations);
              }
            }}
            type="default"
          />
        </div>
      </div>
    );
  };

  render() {
    const {
      isRecommendedTab,
      showPreviousSoldProducts,
      shipmentType,
    } = this.props;
    return (
      <Card>
        <div className={css(this.styles.content)}>
          {shipmentType === "FBW" && (
            <SecondaryButton
              className={css(this.styles.addProduct)}
              padding="8px 40px"
              type="select"
              onClick={this.showAddProductsModal}
            >
              Add products
            </SecondaryButton>
          )}

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
        {this.renderTable()}
        {!isRecommendedTab &&
          showPreviousSoldProducts &&
          this.renderPreviousSalesSection()}
      </Card>
    );
  }
}

export default FBWCreateShippingPlanTable;
