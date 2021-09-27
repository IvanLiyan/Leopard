import React from "react";
import { computed } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";

/* Relative Imports */
import FbwInventoryUpdateShippingPriceModalContent from "./FbwInventoryUpdateShippingPriceModalContent";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ProductLevelInventory,
  VariationLevelInventory,
} from "@merchant/api/fbw";

export type FbwInventoryUpdateShippingPriceModalProps = BaseProps & {
  readonly productLevelInventory: ProductLevelInventory;
  readonly variationLevelInventory: VariationLevelInventory | null | undefined;
  readonly merchantCurrency: string;
  readonly localizedCurrency: string;
  readonly handleUpdateButtonClick: () => unknown;
  readonly addToShippingPriceUpdateInModal: (
    arg0: string,
    arg1: string
  ) => unknown;
  readonly clearShippingPriceUpdateInModal: () => unknown;
  readonly getWarehouseNameByCode: (arg0: string) => string | null | undefined;
};

export default class FbwInventoryUpdateShippingPriceModal extends Modal {
  props: FbwInventoryUpdateShippingPriceModalProps;
  constructor(props: FbwInventoryUpdateShippingPriceModalProps) {
    const { productLevelInventory, variationLevelInventory } = props;
    const warehouseCode = productLevelInventory.warehouse_code;

    super(() => null);
    this.props = props;
    this.setHeader({
      title: variationLevelInventory
        ? i`Set Variation Shipping Price in ${warehouseCode} Warehouse`
        : i`Set Product Shipping Price in ${warehouseCode} Warehouse`,
    });

    this.setWidthPercentage(60);

    this.setRenderFooter(() => (
      <ModalFooter
        action={this.actionButtonProps}
        cancel={{
          text: i`Close`,
          onClick: () => {
            this.close();
          },
        }}
      />
    ));

    // clear the updated shipping price in memory after dismiss
    // this is to prevent the mistake made by user being persisted to the next update
    this.setOnDismiss(() => {
      const { clearShippingPriceUpdateInModal } = this.props;
      clearShippingPriceUpdateInModal();
    });
  }

  @computed
  get actionButtonProps() {
    const { handleUpdateButtonClick } = this.props;
    return {
      isDisabled: false,
      text: i`Update`,
      onClick: () => {
        handleUpdateButtonClick();
        this.close();
      },
    };
  }

  renderContent() {
    const {
      productLevelInventory,
      variationLevelInventory,
      merchantCurrency,
      localizedCurrency,
      addToShippingPriceUpdateInModal,
      getWarehouseNameByCode,
    } = this.props;
    return (
      <FbwInventoryUpdateShippingPriceModalContent
        productLevelInventory={productLevelInventory}
        variationLevelInventory={variationLevelInventory}
        merchantCurrency={merchantCurrency}
        localizedCurrency={localizedCurrency}
        addToShippingPriceUpdateInModal={addToShippingPriceUpdateInModal}
        getWarehouseNameByCode={getWarehouseNameByCode}
      />
    );
  }
}
