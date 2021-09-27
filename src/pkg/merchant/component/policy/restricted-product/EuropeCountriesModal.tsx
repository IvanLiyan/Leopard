import React from "react";

import DimenStore from "@merchant/stores/DimenStore";

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

    const { screenInnerWidth } = DimenStore.instance();
    const targetPercentage = 980 / screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
  }

  renderContent() {
    return <ModalContent />;
  }
}
