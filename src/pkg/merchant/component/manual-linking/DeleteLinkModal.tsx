import React from "react";

/* Model */
import DeleteLinkState from "@merchant/model/manual-linking/DeleteLinkState";

/* Merchant Store */
import DeviceStore from "@stores/DeviceStore";

/* Component */
import Modal from "@merchant/component/core/modal/Modal";
import DeleteLinkModalContent from "@merchant/component/manual-linking/DeleteLinkModalContent";

type DeleteLinkModalProps = {
  readonly merchant: string;
  readonly displayName: string;
  readonly refetchLinkedStores: () => Promise<void>;
};

/**
 * Manual linking - modal for link deletion flow
 */
export default class DeleteLinkModal extends Modal {
  deleteState: DeleteLinkState;
  refetchLinkedStores: () => Promise<void>;

  constructor(props: DeleteLinkModalProps) {
    super(() => null);

    this.deleteState = new DeleteLinkState(props.merchant, props.displayName);
    this.refetchLinkedStores = props.refetchLinkedStores;
    this.noMaxHeight = true;

    this.setHeader({
      title: i`Remove Linked Store`,
    });

    const deviceStore = DeviceStore.instance();
    const targetPercentage = 400 / deviceStore.screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
  }

  renderContent() {
    return (
      <DeleteLinkModalContent
        deleteState={this.deleteState}
        refetchLinkedStores={this.refetchLinkedStores}
        closeModal={() => this.close()}
      />
    );
  }
}
