import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";

/* Mechant Home */
import { useDeviceStore } from "@stores/DeviceStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type AnnouncementModalProps = {
  readonly title?: string | null;
  readonly ctaText?: string | null;
  readonly ctaLink?: string | null;
  readonly message: string;
};

type AnnouncementModalContentProps = BaseProps &
  AnnouncementModalProps & {
    readonly onClose: () => unknown;
  };

const AnnouncementModalContent = (props: AnnouncementModalContentProps) => {
  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();
  const { onClose, message, ctaText, ctaLink } = props;

  const sendButtonProps =
    ctaText && ctaLink
      ? {
          style: { flex: 1 },
          text: ctaText,
          href: ctaLink,
        }
      : null;

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.content)}>{message}</div>
      <ModalFooter
        className={css(styles.footer)}
        layout={isSmallScreen ? "vertical" : "horizontal-centered"}
        action={sendButtonProps}
        cancel={{
          text: i`Close`,
          onClick: () => onClose(),
        }}
      />
    </div>
  );
};

export default class AnnouncementModal extends Modal {
  parentProps: AnnouncementModalProps;

  constructor(props: AnnouncementModalProps) {
    super(() => null);
    this.parentProps = props;
    const { title } = this.parentProps;

    this.setHeader({
      title: title || i`Announcement`,
    });
    this.setNoMaxHeight(true);
    this.setWidthPercentage(0.4);
    this.setOverflowY("visible");
  }

  renderContent() {
    return (
      <AnnouncementModalContent
        onClose={() => this.close()}
        {...this.parentProps}
      />
    );
  }
}

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        },
        content: {
          padding: 24,
          whiteSpace: "pre-line",
        },
        footer: {
          width: "100%",
        },
      }),
    [],
  );
};
