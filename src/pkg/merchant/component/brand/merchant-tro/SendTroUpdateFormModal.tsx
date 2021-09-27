import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import SendTroUpdateFormModalContent from "./SendTroUpdateFormModalContent";

export type SendTroUpdateFormModalProps = {
  readonly injunctionId: string;
  readonly onUpdate: () => unknown;
};

export default class SendTroUpdateFormModal extends Modal {
  parentProps: SendTroUpdateFormModalProps;

  constructor(props: SendTroUpdateFormModalProps) {
    super(() => null);
    this.parentProps = props;
    this.setHeader({
      title: i`Send Update`,
    });
    this.setNoMaxHeight(true);
    this.setWidthPercentage(0.5);
  }

  renderContent() {
    const { injunctionId, onUpdate } = this.parentProps;
    return (
      <SendTroUpdateFormModalContent
        injunctionId={injunctionId}
        onClose={() => this.close()}
        onUpdate={onUpdate}
      />
    );
  }
}
