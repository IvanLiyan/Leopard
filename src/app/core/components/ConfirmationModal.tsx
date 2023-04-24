import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Modal, { ModalProps } from "./modal/Modal";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";
import Illustration, { IllustrationName } from "@core/components/Illustration";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter, {
  ModalFooterProps,
} from "@core/components/modal/ModalFooter";

export type ConfirmationModalProps = BaseProps &
  Pick<ModalProps, "open" | "onClose"> &
  Pick<ModalFooterProps, "action" | "cancel" | "layout"> & {
    readonly title?: string;
    readonly text?: string;
    readonly illustration?: IllustrationName | undefined | null;
    readonly renderContent?: () => React.ReactNode;
  };

export type FooterStyles = {
  readonly justifyContent: CSSProperties["justifyContent"] | undefined;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  style,
  className,
  open,
  onClose,
  illustration,
  renderContent: renderContentProp,
  title,
  text,
  action,
  cancel,
  layout: footerLayout,
}) => {
  const styles = useStylesheet();

  const renderContent = () => {
    const result =
      renderContentProp === undefined ? undefined : renderContentProp();
    if (result !== undefined) {
      if (typeof result === "string") {
        return <Markdown className={css(styles.textContent)} text={result} />;
      }

      return result;
    }
    return text == null ? null : (
      <Markdown className={css(styles.textContent)} text={text} />
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      {title !== undefined && (
        <ModalTitle
          title={title}
          onClose={
            onClose === undefined
              ? undefined
              : (e) => onClose(e, "backdropClick")
          }
        />
      )}
      <div className={css(styles.root, className, style)}>
        {illustration && (
          <Illustration
            name={illustration}
            className={css(styles.illustration)}
            alt="illustration"
          />
        )}
        {renderContent()}
      </div>
      {(action != null || cancel != null) && (
        <ModalFooter action={action} cancel={cancel} layout={footerLayout} />
      )}
    </Modal>
  );
};

export default observer(ConfirmationModal);

const useStylesheet = () => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "0px 90px",
        },
        illustration: {
          height: 100,
          "@media (max-width: 900px)": {
            display: "none",
          },
          paddingTop: 28,
        },
        textContent: {
          fontSize: 16,
          lineHeight: 1.5,
          textAlign: "left",
          color: textBlack,
          padding: "28px 0px",
        },
      }),
    [textBlack],
  );
};
