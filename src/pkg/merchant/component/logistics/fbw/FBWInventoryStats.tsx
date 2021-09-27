import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* Lego Components */
import { Popover } from "@merchant/component/core";
import { FilterButton } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Components */
import FBWInventoryFilter, {
  FBWInventoryQueryState,
} from "@merchant/component/logistics/fbw/FBWInventoryFilter";
import FBWInventoryTable from "@merchant/component/logistics/fbw/FBWInventoryTable";

import { WarehouseType, LowInventorySKU } from "@toolkit/fbw";

type BaseProps = any;

export type FBWInventoryStatsProps = BaseProps & {
  readonly allWarehouses: ReadonlyArray<WarehouseType>;
  readonly selectedWarehouseFilters: ReadonlyArray<WarehouseType>;
  readonly onFiltersDeselected: () => unknown;
  readonly lowInv: ReadonlyArray<LowInventorySKU>;
  readonly merchantId: string;
};

const TablePageSize = 10;

@observer
class FBWInventoryStats extends Component<FBWInventoryStatsProps> {
  @observable
  hasNext = false;

  @observable
  currentEnd = 0;

  @observable
  offset = 0;

  @observable
  currentPage = 0;

  queryState = new FBWInventoryQueryState();

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
      },
      buttonsRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "30px 0px",
      },
      pageIndicator: { margin: "0px 10px 0px 0px" },
      buttonsLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
      },
      buttonsRight: {
        display: "flex",
        flexDirection: "row",
      },
      tableContainer: {},
      filterButton: {
        padding: "4px 15px",
        alignSelf: "stretch",
      },
      lowInvMessage: {
        fontSize: 16,
        fontWeight: fonts.weightBold,
      },
    });
  }

  @computed
  get tableRows() {
    const { lowInv } = this.props;
    const warehouseCodes = this.selectedWarehouseCodes;
    const rows = lowInv.filter((row: LowInventorySKU) =>
      warehouseCodes.includes(row.warehouse_code)
    );
    rows.forEach((row: LowInventorySKU) => {
      // @ts-ignore - can't assign to shipping plan since readonly (existing bug discovered by typing row, previously implicit any)
      row.shipping_plan = true;
    });
    return rows;
  }

  @computed
  get tableRowsForPage() {
    const start = this.currentPage * TablePageSize;
    return this.tableRows.slice(start, start + TablePageSize);
  }

  @computed
  get warehouseFilters(): ReadonlyArray<{ title: string; value: number }> {
    const { allWarehouses } = this.props;
    return allWarehouses.map((w: WarehouseType) => ({
      title: w.name,
      value: w.id,
    }));
  }

  @computed
  get selectedWarehouseCodes(): ReadonlyArray<string> {
    const { allWarehouses } = this.props;
    if (this.queryState.hasActiveFilters) {
      const selectedWarehouses = this.queryState.warehouses;
      return allWarehouses
        .filter((row: WarehouseType) => selectedWarehouses.includes(row.id))
        .map((w: WarehouseType) => {
          return w.name;
        });
    }
    return allWarehouses.map((w: WarehouseType) => {
      return w.name;
    });
  }

  @computed
  get totalCount(): number {
    return this.tableRows.length;
  }

  renderPageIndicator() {
    return (
      <PageIndicator
        className={css(this.styles.pageIndicator)}
        hasNext={this.currentPage < this.totalCount / TablePageSize - 1}
        hasPrev={this.currentPage > 0}
        totalItems={this.totalCount}
        rangeStart={this.currentPage * TablePageSize + 1}
        rangeEnd={Math.min(
          this.currentPage * TablePageSize + TablePageSize,
          this.totalCount
        )}
        onPageChange={(page) => (this.currentPage = page)}
        currentPage={this.currentPage}
      />
    );
  }

  renderLowInvMessage() {
    const { lowInv } = this.props;
    return (
      <div className={css(this.styles.lowInvMessage)}>
        Low in stock SKUs ({lowInv.length})
      </div>
    );
  }

  renderFilters() {
    return (
      <Popover
        popoverContent={() => (
          <FBWInventoryFilter
            queryState={this.queryState}
            warehouseFilters={this.warehouseFilters}
          />
        )}
        position="bottom right"
        contentWidth={300}
      >
        <FilterButton
          style={this.styles.filterButton}
          isActive={this.queryState.hasActiveFilters}
        />
      </Popover>
    );
  }

  renderInventoryTable() {
    const { merchantId } = this.props;
    return (
      <FBWInventoryTable
        data={this.tableRowsForPage}
        selectedWarehouseCodes={this.selectedWarehouseCodes}
        merchantId={merchantId}
      />
    );
  }

  render() {
    const { className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        <div className={css(this.styles.tableContainer)}>
          <div className={css(this.styles.buttonsRow)}>
            <div className={css(this.styles.buttonsLeft)}>
              {this.renderLowInvMessage()}
            </div>
            <div className={css(this.styles.buttonsRight)}>
              {this.renderPageIndicator()}
              {this.renderFilters()}
            </div>
          </div>
          {this.renderInventoryTable()}
        </div>
      </div>
    );
  }
}

export default FBWInventoryStats;
