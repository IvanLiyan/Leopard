import React from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import ResponsiblePersonModalForm from "./ResponsiblePersonModalForm";

/* Model */
import ResponsiblePersonState from "@merchant/model/products/ResponsiblePersonState";

export type Props = {
  readonly isNew: boolean;
  readonly state: ResponsiblePersonState;
};

export default class ResponsiblePersonModal extends Modal {
  parentProps: Props;

  constructor(props: Props) {
    super(() => null);
    this.parentProps = props;
    const { isNew = true } = this.parentProps;

    this.setHeader({
      title: isNew ? i`Add New Responsible Person` : i`Edit Responsible Person`,
    });
    this.setWidthPercentage(0.35);
    this.setOverflowY("scroll");
  }

  renderContent() {
    const { state, isNew } = this.parentProps;

    return (
      <ResponsiblePersonModalForm
        onClose={() => this.close()}
        state={state}
        isNew={isNew}
      />
    );
  }
}
