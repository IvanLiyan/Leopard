import React from "react";
import { observer } from "mobx-react";
import { Text } from "@ContextLogic/atlas-ui";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";

export type Props = Required<Pick<ModalProps, "open" | "onClose">> & {
  readonly id: string;
  readonly categoryName: string;
};

const DeleteEprModal: React.FC<Props> = ({
  open,
  onClose,
  id,
  categoryName,
}) => {
  const onConfirm = () => {
    alert(`deleting ${id}`);
    onClose({}, "backdropClick");
  };

  return (
    <Modal open={open} onClose={onClose} fullWidth>
      <ModalTitle
        title={i`Delete EPR registration number`}
        onClose={(e) => {
          onClose(e, "backdropClick");
        }}
      />
      <Text sx={{ margin: "20px 25px 0px 25px" }}>
        Are you sure you want to delete the EPR number for{" "}
        <Text variant="bodyMStrong">{categoryName}</Text>?
      </Text>
      <Text variant="bodyMStrong" sx={{ margin: "8px 25px 20px 25px" }}>
        Wish will block your product listings and/or impressions if you do not
        provide accurate EPR registration numbers. You may also be subject to
        fines for incorrect or incomplete information.
      </Text>
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
        }}
      />
    </Modal>
  );
};

export default observer(DeleteEprModal);
