/*
 * GenerateTestOrdersModal.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/19/21
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import GenerateTestOrdersScreen from "./GenerateTestOrdersScreen";

/* Type Imports */
import DeviceStore from "@merchant/stores/DeviceStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryWeShipToPick } from "@toolkit/orders/unfulfilled-orders";

export type GenerateTestOrdersModalProps = BaseProps & {
  readonly countriesWeShipTo: ReadonlyArray<CountryWeShipToPick>;
};

export default class GenerateTestOrdersModal extends Modal {
  props: GenerateTestOrdersModalProps;

  constructor(props: GenerateTestOrdersModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Generate Orders`,
    });

    const { screenInnerWidth } = DeviceStore.instance();
    const targetPercentage = 745 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
    this.setNoMaxHeight(true);

    this.props = props;
  }

  renderContent() {
    return (
      <GenerateTestOrdersScreen
        closeModal={() => this.close()}
        {...this.props}
      />
    );
  }
}
