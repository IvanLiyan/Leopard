import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import Modal from "@core/components/modal/Modal";
import { SimpleSelect } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/atlas-ui";
import { css } from "@core/toolkit/styling";
import { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import { useMutation } from "@core/toolkit/restApi";
import { useInfractionContext } from "@infractions/InfractionContext";
import { useToastStore } from "@core/stores/ToastStore";

type UseExistingProofModalContentProps = Required<
  Pick<ModalProps, "open" | "onClose">
> & {
  readonly existingProofs: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
  }>;
};

const UseExistingProofModal: React.FC<UseExistingProofModalContentProps> = ({
  open,
  onClose,
  existingProofs,
}: UseExistingProofModalContentProps) => {
  const styles = useStyleSheet();
  const toastStore = useToastStore();
  const [selectedAuthorization, setSelectedAuthorization] = useState<
    string | undefined
  >();
  const {
    infraction: { id: infractionId },
    refetchInfraction,
  } = useInfractionContext();

  const { trigger: triggerDispute, isMutating } = useMutation({
    url: "/api/warning/dispute-new",
  });

  const onSubmit = async () => {
    try {
      const response = await triggerDispute({
        brand_auth_id: selectedAuthorization,
        warning_id: infractionId,
      });
      // BE returns 400 if something went wrong, and response is undefined
      if (response) {
        onClose({}, "backdropClick");
        toastStore.positive(
          i`You have successfully submitted a proof of authorization for your product. Please wait for it to be reviewed.`,
        );
        refetchInfraction();
      } else {
        toastStore.negative(i`Something went wrong.`);
      }
    } catch (e) {
      toastStore.negative(i`Something went wrong.`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} fullWidth>
      <ModalTitle
        title={ci18n("modal header", "Provide Authorization")}
        onClose={
          onClose === undefined
            ? undefined
            : (e) => {
                onClose(e, "backdropClick");
              }
        }
      />
      <div className={css(styles.content)}>
        <Text variant="bodyMStrong">
          Provide proof of authorization to sell:
        </Text>
        <SimpleSelect
          selectedValue={selectedAuthorization}
          options={existingProofs.map((proof) => ({
            text: proof.name,
            value: proof.id,
          }))}
          onSelected={(value: string) => {
            setSelectedAuthorization(value);
          }}
          placeholder={i`Choose existing brand authorization`}
          style={styles.select}
        />
      </div>
      <ModalFooter
        action={{
          text: ci18n("CTA button", "Submit"),
          onClick: onSubmit,
          isDisabled: isMutating,
        }}
      />
    </Modal>
  );
};

export default observer(UseExistingProofModal);

const useStyleSheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "grid",
          gridTemplateColumns: "1fr",
          gridGap: 20,
          padding: "48px 25px",
        },
        select: { padding: "10px 12px" },
      }),
    [],
  );
