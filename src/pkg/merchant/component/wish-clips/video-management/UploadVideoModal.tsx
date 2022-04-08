import React from "react";

/* Merchant Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Model */
import VideoCatalogState from "@merchant/model/products/VideoCatalogState";

/* Relative Impots */
import UploadVideoFlow from "./upload/UploadVideoFlow";

type Props = {
  readonly state: VideoCatalogState;
};

export default class UploadVideoModal extends Modal {
  parentProps: Props;

  constructor(props: Props) {
    super(() => null);
    this.parentProps = props;

    this.setHeader({
      title: i`Upload Video`,
    });
    this.setWidthPercentage(0.6);
    this.setOverflowY("visible");
    this.setMaxHeight(670);
    this.setCanCloseFromOutsideClick(false);
  }

  renderContent() {
    return (
      <UploadVideoFlow
        state={this.parentProps.state}
        onClose={() => this.close()}
      />
    );
  }
}
