import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ModalTitle from "@core/components/modal/ModalTitle";
import Modal, { ModalProps } from "@core/components/modal/Modal";
import { Text } from "@ContextLogic/atlas-ui";
import { Layout } from "@ContextLogic/lego";
import ModalFooter from "@core/components/modal/ModalFooter";
import { useNavigationStore } from "@core/stores/NavigationStore";
import { observer } from "mobx-react";
import { css } from "@core/toolkit/styling";
import { merchFeUrl } from "@core/toolkit/router";

type AnnouncementModalProps = BaseProps &
  Pick<ModalProps, "open"> & {
    readonly title?: string | null;
    readonly ctaText?: string | null;
    readonly ctaLink?: string | null;
    readonly message: string;
    readonly onClose: () => unknown;
  };

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  open,
  title,
  ctaText,
  ctaLink,
  message,
  onClose,
}) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  return (
    <Modal open={open} onClose={() => onClose()} maxWidth="md">
      <ModalTitle title={title ?? i`Announcement`} onClose={() => onClose()} />
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn
          className={css(styles.content)}
          alignItems="center"
          justifyContent="center"
        >
          <Text className={css(styles.content)}>{message}</Text>
        </Layout.FlexColumn>
        <ModalFooter
          action={
            ctaText == null
              ? undefined
              : {
                  text: ctaText,
                  onClick: async () => {
                    if (ctaLink != null) {
                      await navigationStore.navigate(merchFeUrl(ctaLink));
                    } else {
                      onClose();
                    }
                  },
                }
          }
          cancel={{
            text: i`Close`,
            onClick: () => onClose(),
          }}
        />
      </Layout.FlexColumn>
    </Modal>
  );
};

export default observer(AnnouncementModal);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
          whiteSpace: "pre-line",
        },
      }),
    [],
  );
};
