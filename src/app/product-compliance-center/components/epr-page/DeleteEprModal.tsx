import React, { useContext } from "react";
import { observer } from "mobx-react";
import { Text } from "@ContextLogic/atlas-ui";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import { useMutation } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import {
  DeleteEprMutationResponse,
  DeleteEprMutationVariables,
  DELETE_EPR_MUTATION,
} from "@product-compliance-center/api/eprMutations";
import { RefetchEprQueryContext } from "@product-compliance-center/toolkit/RefetchEprQueryContext";

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
  const toastStore = useToastStore();
  const refetchEprQuery = useContext(RefetchEprQueryContext);
  const [deleteEpr, { loading }] = useMutation<
    DeleteEprMutationResponse,
    DeleteEprMutationVariables
  >(DELETE_EPR_MUTATION);

  const onConfirm = async () => {
    try {
      const resp = await deleteEpr({
        variables: {
          input: {
            id,
          },
        },
      });

      if (
        !resp.data?.policy?.productCompliance?.extendedProducerResponsibility
          .deleteUin.ok
      ) {
        toastStore.negative(
          resp.data?.policy?.productCompliance?.extendedProducerResponsibility
            .deleteUin.message ??
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
          disabled: loading,
        }}
        action={{
          text: ci18n("CTA button", "Confirm"),
          onClick: onConfirm,
          isDisabled: loading,
        }}
      />
    </Modal>
  );
};

export default observer(DeleteEprModal);
