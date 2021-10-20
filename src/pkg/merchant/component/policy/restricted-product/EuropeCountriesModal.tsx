import React from "react";

import DeviceStore from "@stores/DeviceStore";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Internal Components */
import ModalContent from "@merchant/component/policy/restricted-product/ModalContent";

type EuropeCountriesModalProps = BaseProps;

export default class EuropeCountriesModal extends Modal {
  props: EuropeCountriesModalProps;

  constructor(props: EuropeCountriesModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Country/Region Approved for Sale within Europe`,
    });

    this.props = props;
    this.noMaxHeight = true;

    const { screenInnerWidth } = DeviceStore.instance();
    const targetPercentage = 980 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
  }

  renderContent() {
    return <ModalContent />;
  }
}
