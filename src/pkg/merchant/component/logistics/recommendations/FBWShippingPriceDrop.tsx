import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* External Libraries */
import numeral from "numeral";

/* Lego Components */
import { Pager } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import * as api from "@merchant/api/fbw-shipping-price-drop";

/* Relative Imports */
import FBWShippingPriceDropTable from "./FBWShippingPriceDropTable";
import FBWShippingPriceDropHistoryTable from "./FBWShippingPriceDropHistoryTable";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { WarehouseType } from "@toolkit/fbw";
import { VariationShippingPrices } from "@merchant/api/fbw-shipping-price-drop";

export type FBWShippingPriceDropProps = BaseProps & {
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly merchantSourceCurrency: string;
};

const WarehousesPerPage = 7;

@observer
class FBWShippingPriceDrop extends Component<FBWShippingPriceDropProps> {
  @observable
  isAccordionOpen = true;

  @action
  toggleAccordionOpen(open: boolean) {
    this.isAccordionOpen = open;
  }

  @observable
  selectedTab = "";

  @action
  changeSelectedTab(tab: string) {
    this.selectedTab = tab;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        paddingBottom: 100,
      },
      insidePager: {
        padding: 24,
      },
      sectionHeader: {
        color: palettes.textColors.Ink,
      },
    });
  }

  @computed
  get request() {
    return api.getShippingPriceDrops({});
  }

  @computed
  get pendingShippingPriceDrops(): ReadonlyArray<VariationShippingPrices> {
    return this.request.response?.data?.pending || [];
  }

  @computed
  get acceptedShippingPriceDrops(): ReadonlyArray<VariationShippingPrices> {
    return this.request.response?.data?.accepted || [];
  }

  pendingShippingPriceDropsForWarehouse(
    warehouseId: string
  ): ReadonlyArray<VariationShippingPrices> {
    return this.pendingShippingPriceDrops.filter(
      (row) => row.warehouse_id == warehouseId
    );
  }

  acceptedShippingPriceDropsForWarehouse(
    warehouseId: string
  ): ReadonlyArray<VariationShippingPrices> {
    return this.acceptedShippingPriceDrops.filter(
      (row) => row.warehouse_id == warehouseId
    );
  }

  render() {
    const { className, style, warehouses, merchantSourceCurrency } = this.props;
    const totalDrops =
      this.pendingShippingPriceDrops.length +
      this.acceptedShippingPriceDrops.length;
    return (
      <div className={css(this.styles.root, className, style)}>
        <h3 className={css(this.styles.sectionHeader)}>
          Drop shipping prices ({totalDrops})
        </h3>
        <Card>
          <Accordion
            header={() => (
              <div style={{ fontSize: 16 }}>
                Drop shipping prices of your products to compete better in the
                Wish marketplace and sell more.
              </div>
            )}
            onOpenToggled={(isOpen) => this.toggleAccordionOpen(isOpen)}
            isOpen={this.isAccordionOpen}
            chevronLocation="right"
          >
            <Pager
              onTabChange={(tabKey: string) => {
                this.changeSelectedTab(tabKey);
              }}
              selectedTabKey={this.selectedTab ? this.selectedTab : undefined}
              equalSizeTabs={false}
              hideHeaderBorder={false}
              maxVisibleTabs={WarehousesPerPage}
            >
              {warehouses.map((warehouse) => {
                const pendingShippingDrops = this.pendingShippingPriceDropsForWarehouse(
                  warehouse.id
                );
                const acceptedShippingDrops = this.acceptedShippingPriceDropsForWarehouse(
                  warehouse.id
                );
                const totalShippingDrops =
                  pendingShippingDrops.length + acceptedShippingDrops.length;
                if (totalShippingDrops == 0) {
                  return null;
                }
                return (
                  <Pager.Content
                    titleValue={`${warehouse.name} (${totalShippingDrops})`}
                    tabKey={warehouse.code}
                    key={warehouse.code}
                  >
                    <Card>
                      <Pager
                        className={css(this.styles.insidePager)}
                        equalSizeTabs
                        hideHeaderBorder={false}
                        maxVisibleTabs={2}
                      >
                        <Pager.Content
                          titleValue={i`Shipping Prices to Drop (${numeral(
                            pendingShippingDrops.length
                          )
                            .format("0,0")
                            .toString()})`}
                          tabKey={"drop"}
                        >
                          <FBWShippingPriceDropTable
                            data={pendingShippingDrops}
                            warehouseId={warehouse.id}
                            warehouseCode={warehouse.code}
                            currencyCode={merchantSourceCurrency}
                            onSubmit={() => this.request.call()}
                          />
                        </Pager.Content>
                        <Pager.Content
                          titleValue={i`Recently Updated (${numeral(
                            acceptedShippingDrops.length
                          )
                            .format("0,0")
                            .toString()})`}
                          tabKey={"history"}
                        >
                          <FBWShippingPriceDropHistoryTable
                            data={acceptedShippingDrops}
                            warehouseCode={warehouse.code}
                            currencyCode={merchantSourceCurrency}
                          />
                        </Pager.Content>
                      </Pager>
                    </Card>
                  </Pager.Content>
                );
              })}
            </Pager>
          </Accordion>
        </Card>
      </div>
    );
  }
}
export default FBWShippingPriceDrop;
