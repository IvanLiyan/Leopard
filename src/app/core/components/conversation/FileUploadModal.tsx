import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/atlas-ui";
import { AttachmentInfo } from "@ContextLogic/lego";
import SecureFileInput, {
  SecureFileInputProps,
} from "@core/components/SecureFileInput";
import { css } from "@core/toolkit/styling";
import Modal from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { useLocalizationStore } from "@core/stores/LocalizationStore";

// re-exported types for ease of use
export type Attachment = AttachmentInfo;

export type Props = Omit<SecureFileInputProps, "style"> & {
  readonly isOpen: boolean;
  readonly onClose: () => unknown;
  readonly onSend: () => unknown;
};

const FileUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSend,
  ...secureFileInputProps
}) => {
  const styles = useStylesheet();
  const { accepts: acceptsProp, maxSizeMB } = secureFileInputProps;
  const { locale } = useLocalizationStore();
  const formatter = new Intl.ListFormat(locale, {
    style: "long",
    type: "disjunction",
  });
  const acceptsString = formatter.format(
    acceptsProp.split(",").map((format) => format.slice(1).toUpperCase()),
  );

  return (
    <Modal open={isOpen} onClose={onClose} fullWidth>
      <ModalTitle onClose={onClose}>File Upload</ModalTitle>
      <SecureFileInput
        style={styles.secureFileInput}
        {...secureFileInputProps}
      />
      <Text variant="bodyS" className={css(styles.text)}>
        Select a {acceptsString} smaller than {maxSizeMB}MB.
      </Text>
      <ModalFooter
        action={{
          text: i`Send`,
          onClick: () => {
            onSend();
          },
        }}
      />
    </Modal>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        secureFileInput: {
          margin: "24px 24px 8px 24px",
        },
        text: {
          margin: "8px 24px 24px 24px",
        },
      }),
    [],
  );
};

export default observer(FileUploadModal);
