import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import IntellectualPropertyModalContent, {
  IntellectualPropertyModalProps,
} from "./IntellectualPropertyModalContent";

/* Merchant Store */
import AppStore from "@merchant/stores/AppStore_DEPRECATED";

export default class IntellectualPropertyModal extends Modal {
  props: IntellectualPropertyModalProps;

  constructor(props: IntellectualPropertyModalProps) {
    super(() => null);

    this.setHeader({
      title: i`Add Intellectual Property Information`,
    });

    this.props = props;
    this.noMaxHeight = true;

    const { dimenStore } = AppStore.instance();
    const targetPercentage = 900 / dimenStore.screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
  }

  renderContent() {
    return (
      <IntellectualPropertyModalContent
        {...this.props}
        closeModal={() => this.close()}
      />
    );
  }
}
