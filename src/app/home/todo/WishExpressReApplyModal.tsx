import React, { useState } from "react";

/* Relative Imports */
import WishExpressReApplyCountries from "./WishExpressReApplyCountries";
import WishExpressReApplyCompleted from "./WishExpressReApplyCompleted";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { observer } from "mobx-react";
import ModalTitle from "@core/components/modal/ModalTitle";

export type WishExpressReApplyModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly onClose: () => unknown;
    readonly onRefetchTodos: () => unknown;
  };

type ApplicationStep =
  | "WishExpressReApplyCountries"
  | "WishExpressReApplyCompleted";

const WishExpressReApplyModal: React.FC<WishExpressReApplyModalProps> = ({
  open,
  onClose,
  onRefetchTodos,
}) => {
  const [applicationStep, setApplicationStep] = useState<ApplicationStep>(
    "WishExpressReApplyCountries",
  );

  const onComplete = (step: ApplicationStep) => setApplicationStep(step);

  const contentByStep: { readonly [T in ApplicationStep]: React.ReactNode } = {
    WishExpressReApplyCountries: (
      <WishExpressReApplyCountries onComplete={onComplete} />
    ),
    WishExpressReApplyCompleted: (
      <WishExpressReApplyCompleted
        closeModal={() => {
          onClose();
          onRefetchTodos();
        }}
      />
    ),
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalTitle title={i`Reapply for Wish Express`} onClose={onClose} />
      {contentByStep[applicationStep]}
    </Modal>
  );
};

export default observer(WishExpressReApplyModal);
