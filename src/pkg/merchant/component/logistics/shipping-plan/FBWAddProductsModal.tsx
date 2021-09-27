import React from "react";
import { StyleSheet } from "aphrodite";
import { computed } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Merchant Components */
import FBWAddProductsTable from "@merchant/component/logistics/shipping-plan/FBWAddProductsTable";

import { RowSelectionArgs } from "@ContextLogic/lego";
import { WarehouseType } from "@toolkit/fbw";
import { Product } from "@merchant/api/fbw";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FBWAddProductsModalProps = BaseProps & {
  readonly warehouses: ReadonlyArray<WarehouseType>;
  readonly selectedRows: ReadonlyArray<Product>;
  readonly onRowSelectionToggled: (
    args: RowSelectionArgs<Product>
  ) => unknown | null | undefined;
  readonly handleAddToShippingPlanOnClick: (() => unknown) | null | undefined;
  readonly clearSelectedRowsInModal: (
    variation?: string
  ) => unknown | null | undefined;
};

export default class FBWAddProductsModal extends Modal {
  props: FBWAddProductsModalProps;
  constructor(props: FBWAddProductsModalProps) {
    const { clearSelectedRowsInModal } = props;
    super(() => null);
    this.props = props;

    this.setHeader({
      title: i`Select products manually to add to shipping plan`,
    });

    this.setWidthPercentage(60);

    this.setRenderFooter(() => (
      <ModalFooter
        action={this.actionButtonProps}
        cancel={{
          text: i`Close`,
          onClick: () => {
            if (clearSelectedRowsInModal) {
              clearSelectedRowsInModal();
            }
            this.close();
          },
        }}
      />
    ));
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 20,
        paddingBottom: 20,
      },
    });
  }

  @computed
  get actionButtonProps() {
    const { handleAddToShippingPlanOnClick } = this.props;
    return {
      isDisabled: false,
      text: i`Add to Shipping Plan`,
      onClick: () => {
        if (handleAddToShippingPlanOnClick) {
          handleAddToShippingPlanOnClick();
        }
        this.close();
      },
    };
  }

  renderContent() {
    const {
      clearSelectedRowsInModal,
      onRowSelectionToggled,
      selectedRows,
      warehouses,
    } = this.props;
    return (
      <div className={css(this.styles.root)}>
        <Alert
          text={
            i`Products that are approved and enabled are ` +
            i`eligible to be added to your shipping plan.`
          }
          sentiment="info"
          link={{
            text: i`View all products`,
            url: "/product",
          }}
        />

        <FBWAddProductsTable
          onRowSelectionToggled={onRowSelectionToggled}
          warehouses={warehouses}
          selectedRows={selectedRows}
          clearSelectedRowsInModal={clearSelectedRowsInModal}
        />
      </div>
    );
  }
}
