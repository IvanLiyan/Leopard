import React, { useContext, useState } from "react";
import { observer } from "mobx-react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import AddEditModalContent from "./AddEditModalContent";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import {
  EditEprMutationResponse,
  EditEprMutationVariables,
  EDIT_EPR_MUTATION,
} from "@product-compliance-center/api/eprMutations";
import { RefetchEprQueryContext } from "@product-compliance-center/toolkit/RefetchEprQueryContext";

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
  const toastStore = useToastStore();
  const [epr, setEpr] = useState<string>(initialEpr);
  const [pro, setPro] = useState<string>(initialPro);
  const [confirmationChecked, setConfirmationChecked] = useState(
    DEFAULT_CONFIRMATION_CHECKED,
  );
  const refetchEprQuery = useContext(RefetchEprQueryContext);
  const [editEpr, { loading }] = useMutation<
    EditEprMutationResponse,
    EditEprMutationVariables
  >(EDIT_EPR_MUTATION);

  const onClose = (...props: Parameters<typeof onCloseProp>) => {
    onCloseProp(...props);
    setEpr(initialEpr);
    setPro(initialPro);
    setConfirmationChecked(DEFAULT_CONFIRMATION_CHECKED);
  };

  const onConfirm = async () => {
    if (epr == null || pro == null) {
      return;
    }

    try {
      const resp = await editEpr({
        variables: {
          input: {
            id,
            uin: epr,
            responsibleEntityName: pro,
          },
        },
      });

      if (
        !resp.data?.policy?.productCompliance?.extendedProducerResponsibility
          .updateUin.ok
      ) {
        toastStore.negative(
          resp.data?.policy?.productCompliance?.extendedProducerResponsibility
            .updateUin.message ??
            ci18n("error message", "Something went wrong"),
        );
      } else {
        toastStore.positive(i`Your change has been submitted successfully`);
        void refetchEprQuery();
      }
    } catch {
      toastStore.negative(ci18n("error message", "Something went wrong"));
    }

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
          disabled: loading,
        }}
        action={{
          text: ci18n("CTA button", "Confirm"),
          onClick: onConfirm,
          isDisabled: loading || !canSubmit,
        }}
      />
    </Modal>
  );
};

export default observer(EditEprModal);
