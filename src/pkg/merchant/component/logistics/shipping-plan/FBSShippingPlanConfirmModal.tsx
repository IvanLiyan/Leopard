import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { computed } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Accordion } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as illustrations from "@assets/illustrations";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";
import { params_DEPRECATED } from "@toolkit/url";

/* Merchant Components */
import FBSShippingPlanConfirmTable from "@merchant/component/logistics/shipping-plan/FBSShippingPlanConfirmTable";

/* Merchant API */
import * as fbwApi from "@merchant/api/fbw";

/* Toolkit */
import * as logger from "@toolkit/logger";

import { WarehouseType } from "@toolkit/fbw";
import { Product } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import NavigationStore from "@merchant/stores/NavigationStore";

type FBSShippingPlanConfirmModalProps = BaseProps & {
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly rows: ReadonlyArray<Product>;
  readonly variationWarehouseQuantity: Map<string, Map<string, number>>;
  readonly shipmentType: string;
};

type FBSShippingPlanConfirmModalContentProps = BaseProps & {
  readonly rows: ReadonlyArray<Product>;
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly variationWarehouseQuantity: Map<string, Map<string, number>>;
};

type Sku = {
  sku?: string;
  quantity?: number;
  source?: number;
  selected?: number;
};

type ShippingPlanMapValue = {
  readonly warehouse_code: string;
  total_quantity: number;
  skus: Array<Sku>;
};

type ShippingPlanMap = {
  [index: string]: ShippingPlanMapValue;
};

const FBSShippingPlanConfirmModalContent = (
  props: FBSShippingPlanConfirmModalContentProps
) => {
  const styles = useStylesheet(props);
  const { rows, warehouses, variationWarehouseQuantity } = props;
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <div className={css(styles.root)}>
      <img src={illustrations.fbwConfirm} className={css(styles.img)} />
      <p className={css(styles.text)}>
        {i`Please review the following details ` +
          i`before submitting your shipping plan.`}
        <br />
        {i`Once submitted, this shipping plan cannot be edited.`}
      </p>
      <div className={css(styles.show)}>
        <Accordion
          headerPadding={"0px 0px"}
          className={css(styles.show)}
          header={i`Show products`}
          onOpenToggled={(isOpen) => {
            setIsOpen(isOpen);
          }}
          isOpen={isOpen}
        >
          <FBSShippingPlanConfirmTable
            rows={rows}
            warehouses={warehouses}
            variationWarehouseQuantity={variationWarehouseQuantity}
          />
        </Accordion>
      </div>
    </div>
  );
};

const useStylesheet = (props: FBSShippingPlanConfirmModalContentProps) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        },
        illustration: {
          height: 100,
          marginBottom: 30,
        },
        textContent: {
          fontSize: 16,
          lineHeight: 1.5,
          textAlign: "center",
          textColor: palettes.textColors.Ink,
          fontWeight: fonts.weightNormal,
        },
        show: {
          width: "100%",
        },
        img: {
          marginTop: 28,
        },
        text: {
          marginTop: 28,
          fontWeight: fonts.weightMedium,
          lineHeight: 1.5,
          textColor: palettes.textColors.Ink,
          width: "100%",
          textAlign: "center",
          fontSize: 16,
        },
        content: {
          marginTop: 28,
        },
      }),
    []
  );
};

const RecommendationSource = {
  NONE: 0,
  EMAIL: 1,
  WEB: 2,
};

export default class FBSShippingPlanConfirmModal extends Modal {
  props: FBSShippingPlanConfirmModalProps;
  constructor(props: FBSShippingPlanConfirmModalProps) {
    super(() => null);
    this.props = props;
    const navigationStore = NavigationStore.instance();

    this.setHeader({
      title: i`Submit your shipping plan`,
    });

    this.setWidthPercentage(60);

    this.setRenderFooter(() => (
      <ModalFooter
        cancel={{
          text: i`Cancel`,
          onClick: () => this.close(),
        }}
        action={{
          text: i`Confirm`,
          onClick: async () => {
            try {
              const recommendationSource =
                this.recommendationSource == "web"
                  ? RecommendationSource.WEB
                  : RecommendationSource.EMAIL;
              const finalRecommendation = this.recommendationSource
                ? recommendationSource
                : RecommendationSource.NONE;

              const params = {
                shipping_plans: JSON.stringify(this.shippingPlanParams),
                shipment_type: props.shipmentType,
                source: finalRecommendation,
              };

              const resp = await fbwApi.submitShippingPlan(params).call();
              this.logSubmit();
              const shippingPlans = resp.data?.shipping_plans;
              if (shippingPlans) {
                const batchId = resp.data?.batch_id;
                if (batchId) {
                  navigationStore.navigate(
                    `/fbw/shipping-plans-by-batch-id/${batchId}`
                  );
                }
              }
              this.close();
            } catch (e) {
              return;
            }
          },
        }}
      />
    ));
  }

  @params_DEPRECATED.string("rec_source")
  recommendationSource = "";

  logSubmit() {
    logger.log("FBW_SHIPPING_PLAN_CREATION", {
      action: "shipping_plan_creation_submit",
    });
  }

  @computed
  get shippingPlanParams(): ReadonlyArray<ShippingPlanMapValue> {
    const { variationWarehouseQuantity } = this.props;
    const rows = this.props.rows;
    const shippingPlanMap: ShippingPlanMap = {};
    for (const row of rows) {
      if (!row.variation_id) continue;
      const warehouseDistributionMap = variationWarehouseQuantity.get(
        row.variation_id || ""
      );
      if (!warehouseDistributionMap) continue;
      for (const warehouseCode of warehouseDistributionMap.keys()) {
        if (!shippingPlanMap[warehouseCode]) {
          shippingPlanMap[warehouseCode] = {
            warehouse_code: warehouseCode,
            total_quantity: 0,
            skus: [],
          };
        }
        const sku: Sku = {};
        sku.sku = row.sku;
        sku.quantity = warehouseDistributionMap.get(warehouseCode) || 0;
        sku.source = row.is_recommended ? 1 : 2;
        sku.selected = row.quantity ? 1 : 0;
        shippingPlanMap[warehouseCode].total_quantity += sku.quantity;
        shippingPlanMap[warehouseCode].skus.push(sku);
      }
    }
    return Object.keys(shippingPlanMap).map((warehouseCode: string) => {
      return shippingPlanMap[warehouseCode];
    });
  }

  renderContent() {
    const { rows, warehouses, variationWarehouseQuantity } = this.props;
    return (
      <FBSShippingPlanConfirmModalContent
        rows={rows}
        warehouses={warehouses}
        variationWarehouseQuantity={variationWarehouseQuantity}
      />
    );
  }
}
