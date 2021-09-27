//
import React from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { Banner } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Internal API */
import { updateShippingPlan } from "@merchant/api/fbw";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type ShipToWarehouseModalProps = BaseProps & {
  readonly title: string;
  readonly trackingNumbers: string;
  readonly id: string;
  readonly refreshParent: () => void;
};

export default class ShipToWarehouseModal extends Modal {
  props: ShipToWarehouseModalProps;

  @observable
  isLoading: boolean | undefined;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
    });
  }

  constructor(props: ShipToWarehouseModalProps) {
    super((onClose) => null);
    this.props = props;
    this.setHeader({
      title: i`Confirmation`,
    });
    this.setWidthPercentage(60);
    this.setRenderFooter(() => (
      <ModalFooter
        action={this.actionButtonProps}
        cancel={{
          text: i`No`,
          onClick: () => {
            this.close();
          },
        }}
      />
    ));
  }

  @computed
  get actionButtonProps() {
    const { toastStore } = AppStore.instance();
    const { id, trackingNumbers } = this.props;
    return {
      text: i`Yes`,
      isLoading: this.isLoading,
      onClick: async () => {
        this.isLoading = true;
        const result = await updateShippingPlan({
          id,
          tracking_numbers: trackingNumbers,
          state: "SHIPPED",
        }).call();

        this.isLoading = false;

        if (result) {
          this.props.refreshParent();
          this.close();
          toastStore.positive(
            i`Cool! We'll let you know when the warehouse confirms ` +
              i`that they have received the shipping plan!`
          );
        } else {
          toastStore.negative(i`Something went wrong. Please try again later.`);
        }
      },
    };
  }

  renderContent() {
    const { title } = this.props;
    return (
      <div className={css(this.styles.root)}>
        <Banner sentiment="warning" text={title} />
      </div>
    );
  }
}
