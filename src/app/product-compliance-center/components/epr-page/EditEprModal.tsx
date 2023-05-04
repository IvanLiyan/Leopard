import React, { useState } from "react";
import { observer } from "mobx-react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import AddEditModalContent from "./AddEditModalContent";

export type Props = Required<Pick<ModalProps, "open" | "onClose">> & {
  readonly categoryName: string;
  readonly epr: string;
  readonly pro: string;
  readonly id: string;
};

const DEFAULT_CONFIRMATION_CHECKED = false;

const EditEprModal: React.FC<Props> = ({
  open,
  onClose: onCloseProp,
  categoryName,
  epr: initialEpr,
  pro: initialPro,
  id,
}) => {
  const [epr, setEpr] = useState<string>(initialEpr);
  const [pro, setPro] = useState<string>(initialPro);
  const [confirmationChecked, setConfirmationChecked] = useState(
    DEFAULT_CONFIRMATION_CHECKED,
  );

  const onClose = (...props: Parameters<typeof onCloseProp>) => {
    onCloseProp(...props);
    setEpr(initialEpr);
    setPro(initialPro);
    setConfirmationChecked(DEFAULT_CONFIRMATION_CHECKED);
  };

  const onConfirm = () => {
    alert(`editing ${id} with EPR ${epr} and PRO ${pro}`);
    onClose({}, "backdropClick");
  };

  const canSubmit =
    epr.trim() &&
    pro.trim() &&
    (epr.trim() != initialEpr || pro.trim() != initialPro) &&
    confirmationChecked;

  return (
    <Modal open={open} onClose={onClose} fullWidth>
      <ModalTitle
        title={i`Edit EPR registration number`}
        onClose={(e) => {
          onClose(e, "backdropClick");
        }}
      />
      <AddEditModalContent
        categoryName={categoryName}
        epr={epr}
        setEpr={setEpr}
        pro={pro}
        setPro={setPro}
        confirmationChecked={confirmationChecked}
        setConfirmationChecked={setConfirmationChecked}
      />
      <ModalFooter
        cancel={{
          text: ci18n("CTA button", "Cancel"),
          onClick: () => {
            onClose({}, "backdropClick");
          },
        }}
        action={{
          text: ci18n("CTA button", "Confirm"),
          onClick: onConfirm,
          isDisabled: !canSubmit,
        }}
      />
    </Modal>
  );
};

export default observer(EditEprModal);
