import React, { useState } from "react";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";

/* Relative Imports */
import WishExpressReApplyCountries from "./WishExpressReApplyCountries";
import WishExpressReApplyCompleted from "./WishExpressReApplyCompleted";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WishExpressReApplyModalProps = BaseProps & {
  readonly closeModal: () => unknown;
  readonly onComplete?: (str: ApplicationStep) => unknown;
};

type ApplicationStep =
  | "WishExpressReApplyCountries"
  | "WishExpressReApplyCompleted";

const WishModalContent = (props: WishExpressReApplyModalProps) => {
  const { closeModal } = props;
  const [applicationStep, setApplicationStep] = useState<ApplicationStep>(
    "WishExpressReApplyCountries"
  );

  const onComplete = (step: ApplicationStep) => setApplicationStep(step);

  if (applicationStep === "WishExpressReApplyCountries") {
    return (
      <WishExpressReApplyCountries
        onComplete={onComplete}
        closeModal={closeModal}
      />
    );
  }

  if (applicationStep === "WishExpressReApplyCompleted") {
    return <WishExpressReApplyCompleted closeModal={closeModal} />;
  }

  return null;
};

export class WishExpressReApplyModal extends Modal {
  constructor() {
    super(() => null);

    this.setNoMaxHeight(false);
    this.setWidthPercentage(0.5);
  }

  closeModal = () => {
    this.close();
  };

  renderContent() {
    return <WishModalContent closeModal={this.closeModal} />;
  }
}
