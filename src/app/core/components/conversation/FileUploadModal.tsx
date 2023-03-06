import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Text } from "@ContextLogic/atlas-ui";
import SecureFileInput, {
  SecureFileInputProps,
  Attachment as AttachmentType,
} from "@core/components/SecureFileInput";
import { css } from "@core/toolkit/styling";
import Modal from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import { useLocalizationStore } from "@core/stores/LocalizationStore";

// re-exported types for ease of use
export type Attachment = AttachmentType;

export type Props = Omit<SecureFileInputProps, "style"> & {
  readonly isOpen: boolean;
  readonly onClose: () => unknown;
};

const FileUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
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
