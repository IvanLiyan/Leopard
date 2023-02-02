import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, FlexRowProps } from "@ContextLogic/lego";
import Icon, { IconProps } from "../Icon";
import { useTheme } from "@core/stores/ThemeStore";
import { Header } from "@ContextLogic/atlas-ui";

type Props = FlexRowProps & {
  readonly title?: string;
  // to be used by modal component as aria-labelledby for accessibility
  // e.g.
  // <Modal aria-labelledby="value-for-title-id">
  //   <ModalTitle titleId="value-for-title-id" />
  // </Modal>
  readonly titleId?: string;
  readonly hideCloseButton?: boolean;
  readonly onClose?: (
    ...args: Parameters<ExcludeStrict<IconProps["onClick"], undefined>>
  ) => unknown;
};

const ModalTitle: React.FC<Props> = ({
  className,
  style,
  children,
  title,
  titleId,
  hideCloseButton = false,
  onClose = () => {
    return;
  },
  ...props
}) => {
  const styles = useStylesheet();
  const { textDark } = useTheme();

  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      {title !== undefined && (
        <Header variant="h3" id={titleId}>
          {title}
        </Header>
      )}
      {children}
      {!hideCloseButton && (
        <Icon
          style={styles.closeButton}
          name="x"
          size={18}
          color={textDark}
          onClick={onClose === undefined ? undefined : onClose}
        />
      )}
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  const { surface } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "relative",
          padding: "12px 20px",
          backgroundColor: surface,
        },
        closeButton: {
          position: "absolute",
          right: 20,
          cursor: "pointer",
          top: 14,
        },
      }),
    [surface],
  );
};

export default observer(ModalTitle);
