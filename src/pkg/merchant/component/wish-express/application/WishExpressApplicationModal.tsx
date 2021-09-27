import React from "react";
import { Component } from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import FBWPitchModal from "./FBWPitchModal";
import WishExpressApplicationRequirements from "./WishExpressApplicationRequirements";
import WishExpressApplicationTermsOfService from "./WishExpressApplicationTermsOfService";
import WishExpressApplicationCompletedSignUp from "./WishExpressApplicationCompletedSignUp";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WishExpressApplicationModalProps = BaseProps & {
  readonly closeModal: () => void;
  readonly onComplete?: (str: ApplicationStep) => unknown;
  readonly onBack?: (str: ApplicationStep) => unknown;
};

type ApplicationStep =
  | "FBWPitchModal"
  | "WishExpressApplicationRequirements"
  | "WishExpressApplicationTermsOfService"
  | "WishExpressApplicationCompletedSignUp";

@observer
class WishExpressApplicationModalContent extends Component<WishExpressApplicationModalProps> {
  @observable
  applicationStep: ApplicationStep = "WishExpressApplicationRequirements";

  onComplete = (step: ApplicationStep) => {
    this.applicationStep = step;
  };

  onBack = (step: ApplicationStep) => {
    this.applicationStep = step;
  };

  render() {
    const { closeModal } = this.props;
    if (this.applicationStep === "WishExpressApplicationRequirements") {
      return (
        <WishExpressApplicationRequirements
          onComplete={this.onComplete}
          closeModal={closeModal}
          onBack={this.onBack}
        />
      );
    }

    if (this.applicationStep === "WishExpressApplicationTermsOfService") {
      return (
        <WishExpressApplicationTermsOfService
          closeModal={closeModal}
          onComplete={this.onComplete}
          onBack={this.onBack}
        />
      );
    }

    if (this.applicationStep === "WishExpressApplicationCompletedSignUp") {
      return <WishExpressApplicationCompletedSignUp closeModal={closeModal} />;
    }

    if (this.applicationStep === "FBWPitchModal") {
      return <FBWPitchModal closeModal={closeModal} onBack={this.onBack} />;
    }

    return null;
  }
}

class WishExpressApplicationModal extends Modal {
  constructor() {
    super(() => null);

    this.setNoMaxHeight(false);
    this.setWidthPercentage(0.5);
  }

  closeModal = () => {
    this.close();
  };

  renderContent() {
    return <WishExpressApplicationModalContent closeModal={this.closeModal} />;
  }
}
export default WishExpressApplicationModal;
