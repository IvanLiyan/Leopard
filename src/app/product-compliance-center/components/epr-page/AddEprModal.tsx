import React, { useState } from "react";
import { observer } from "mobx-react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import { CountryCode } from "@schema";
import AddEditModalContent from "./AddEditModalContent";

export type Props = Required<Pick<ModalProps, "open" | "onClose">> & {
  readonly category: number;
  readonly categoryName: string;
  readonly country: CountryCode;
};

const DEFAULT_EPR = undefined;
const DEFAULT_PRO = undefined;
const DEFAULT_CONFIRMATION_CHECKED = false;

const AddEprModal: React.FC<Props> = ({
  open,
  onClose: onCloseProp,
  category,
  categoryName,
  country,
}) => {
  const [epr, setEpr] = useState<string | undefined>(DEFAULT_EPR);
  const [pro, setPro] = useState<string | undefined>(DEFAULT_PRO);
  const [confirmationChecked, setConfirmationChecked] = useState(
    DEFAULT_CONFIRMATION_CHECKED,
  );

  const onClose = (...props: Parameters<typeof onCloseProp>) => {
    onCloseProp(...props);
    setEpr(DEFAULT_EPR);
    setPro(DEFAULT_PRO);
    setConfirmationChecked(DEFAULT_CONFIRMATION_CHECKED);
  };

  const onConfirm = () => {
    alert(`adding ${category} for ${country} with EPR ${epr} and PRO ${pro}`);
    onClose({}, "backdropClick");
  };

  const canSubmit = epr?.trim() && pro?.trim() && confirmationChecked;

  return (
    <Modal open={open} onClose={onClose} fullWidth>
      <ModalTitle
        title={i`Add EPR registration number`}
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

export default observer(AddEprModal);
