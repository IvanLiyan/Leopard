import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant Components */
import FBWInventoryStats from "@merchant/component/logistics/fbw/FBWInventoryStats";

/* Merchant API */
import * as api from "@merchant/api/fbw";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { WarehouseType, LowInventorySKU } from "@toolkit/fbw";

export type FBWLowInventoryProps = BaseProps & {
  readonly warehouses: ReadonlyArray<WarehouseType>;
};

@observer
class FBWLowInventory extends Component<FBWLowInventoryProps> {
  @observable
  selectedWarehouses: ReadonlyArray<string> = [];

  @observable
  isAccordionOpen = true;

  @action
  toggleAccordionOpen(open: boolean) {
    this.isAccordionOpen = open;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        paddingTop: 25,
      },
      statsTable: {
        minHeight: 100,
        margin: "0px 20px 20px 20px",
      },
      tabBar: {
        margin: "0px 20px",
      },
      sectionHeader: {
        color: palettes.textColors.Ink,
      },
    });
  }

  @computed
  get request() {
    return api.getNumLowInventory({});
  }

  get lowInventoryNum(): number {
    return this.request.response?.data?.num_low_inventory || 0;
  }

  get lowInventory(): ReadonlyArray<LowInventorySKU> {
    return this.request.response?.data?.low_inventory || [];
  }

  get merchantID(): string {
    return this.request.response?.data?.merchant_id || "";
  }

  get warehouses(): ReadonlyArray<WarehouseType> {
    return this.request.response?.data?.warehouses || [];
  }

  @computed
  get selectedWarehouseFilters() {
    const { warehouses } = this.props;
    if (this.selectedWarehouses == null) {
      return warehouses;
    }
    return this.selectedWarehouses;
  }

  @action
  onFiltersDeselected = () => {
    this.selectedWarehouses = [];
  };

  render() {
    const { className, style } = this.props;
    const lowInventoryNum = this.lowInventoryNum;
    const merchant = this.merchantID;
    const lowInventory = this.lowInventory;
    const allWarehouses = this.warehouses;

    return (
      <div className={css(this.styles.root, className, style)}>
        <h3 className={css(this.styles.sectionHeader)}>
          Low in stock SKUs ({lowInventoryNum})
        </h3>
        <Card>
          <Accordion
            header={() => (
              <div style={{ fontSize: 16 }}>
                The following products are low in stock. Please restock your
                products to optimize your sales.
              </div>
            )}
            onOpenToggled={(isOpen) => this.toggleAccordionOpen(isOpen)}
            isOpen={this.isAccordionOpen}
            chevronLocation="right"
          >
            <FBWInventoryStats
              className={css(this.styles.statsTable)}
              allWarehouses={allWarehouses}
              selectedWarehouseFilters={this.selectedWarehouseFilters}
              onFiltersDeselected={this.onFiltersDeselected}
              lowInv={lowInventory}
              merchantId={merchant}
            />
          </Accordion>
        </Card>
      </div>
    );
  }
}
export default FBWLowInventory;
