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
import { deleteShippingPlan } from "@merchant/api/fbw";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export type ShippingPlanCancelModalProps = BaseProps & {
  readonly skus: string;
  readonly id: string;
  readonly refreshParent: () => void;
};

export default class ShippingPlanCancelModal extends Modal {
  props: ShippingPlanCancelModalProps;

  @observable
  isLoading: boolean | undefined;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
    });
  }

  constructor(props: ShippingPlanCancelModalProps) {
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
    const { id, skus } = this.props;
    return {
      text: i`Yes`,
      isLoading: this.isLoading,
      onClick: async () => {
        this.isLoading = true;
        const result = await deleteShippingPlan({
          id,
          skus,
        }).call();
        this.isLoading = false;

        if (result) {
          this.props.refreshParent();
          this.close();
          toastStore.positive(i`Your shipping plan is successfully deleted!`);
        } else {
          toastStore.negative(i`Something went wrong. Please try again later.`);
        }
      },
    };
  }

  renderContent() {
    return (
      <div className={css(this.styles.root)}>
        <Banner
          sentiment="warning"
          text={i`Are you sure you want to cancel this shipping plan?`}
        />
      </div>
    );
  }
}
