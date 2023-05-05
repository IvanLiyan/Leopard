import React, { useContext, useState } from "react";
import { observer } from "mobx-react";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import { CountryCode } from "@schema";
import AddEditModalContent from "./AddEditModalContent";
import {
  ADD_EPR_MUTATION,
  AddEprMutationResponse,
  AddEprMutationVariables,
} from "@product-compliance-center/api/eprMutations";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import { RefetchEprQueryContext } from "@product-compliance-center/toolkit/RefetchEprQueryContext";

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
  const toastStore = useToastStore();
  const [epr, setEpr] = useState<string | undefined>(DEFAULT_EPR);
  const [pro, setPro] = useState<string | undefined>(DEFAULT_PRO);
  const [confirmationChecked, setConfirmationChecked] = useState(
    DEFAULT_CONFIRMATION_CHECKED,
  );
  const refetchEprQuery = useContext(RefetchEprQueryContext);
  const [addEpr, { loading }] = useMutation<
    AddEprMutationResponse,
    AddEprMutationVariables
  >(ADD_EPR_MUTATION);

  const onClose = (...props: Parameters<typeof onCloseProp>) => {
    onCloseProp(...props);
    setEpr(DEFAULT_EPR);
    setPro(DEFAULT_PRO);
    setConfirmationChecked(DEFAULT_CONFIRMATION_CHECKED);
  };

  const onConfirm = async () => {
    if (epr == null || pro == null) {
      return;
    }

    try {
      const resp = await addEpr({
        variables: {
          input: {
            country,
            category,
            uin: epr,
            responsibleEntityName: pro,
          },
        },
      });

      if (
        !resp.data?.policy?.productCompliance?.extendedProducerResponsibility
          .createUin.ok
      ) {
        toastStore.negative(
          resp.data?.policy?.productCompliance?.extendedProducerResponsibility
            .createUin.message ??
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

export default observer(AddEprModal);
