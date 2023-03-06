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

type UseExistingProofModalContentProps = Pick<
  ModalProps,
  "open" | "onClose"
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
  const [selectedAuthorization, setSelectedAuthorization] = useState<
    string | undefined
  >();

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
          text: ci18n("CTA button", "Send"),
          onClick: () => {
            alert("TODO");
          },
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
