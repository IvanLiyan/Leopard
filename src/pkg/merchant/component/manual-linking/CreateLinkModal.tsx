import React from "react";

/* Model */
import CreateLinkState from "@merchant/model/manual-linking/CreateLinkState";

/* Merchant Store */
import DeviceStore from "@stores/DeviceStore";

/* Component */
import Modal from "@merchant/component/core/modal/Modal";
import CreateLinkModalContent from "@merchant/component/manual-linking/CreateLinkModalContent";
import CreateLinkModalFooter from "@merchant/component/manual-linking/CreateLinkModalFooter";

export type CreateLinkModalProps = {
  readonly refetchLinkedStores: () => Promise<void>;
};

/**
 * Manual linking - modal for link creation flow
 */
export default class CreateLinkModal extends Modal {
  editState: CreateLinkState;
  refetchLinkedStores: () => Promise<void>;

  constructor(props: CreateLinkModalProps) {
    super(() => null);

    this.editState = new CreateLinkState();
    this.refetchLinkedStores = props.refetchLinkedStores;

    this.setHeader({
      title: i`Link Stores`,
    });

    this.setRenderFooter(() => (
      <CreateLinkModalFooter
        editState={this.editState}
        closeModal={() => this.close()}
        refetchLinkedStores={this.refetchLinkedStores}
      />
    ));

    const deviceStore = DeviceStore.instance();
    const targetPercentage = 400 / deviceStore.screenInnerWidth;
    this.setWidthPercentage(targetPercentage);
    this.setMaxHeight((2 / 3) * deviceStore.screenInnerHeight);
  }

  renderContent() {
    return <CreateLinkModalContent editState={this.editState} />;
  }
}
