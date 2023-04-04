import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Component */
import { Text } from "@ContextLogic/lego";

import SheetItem from "./SheetItem";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Style } from "@core/toolkit/styling";

/* Merchant Store */
import { useTheme } from "@core/stores/ThemeStore";

type Props = BaseProps & {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly popoverContent?: string | (() => React.ReactNode) | null;
  readonly underline?: boolean;
  readonly contentStyles?: Style | undefined;
};

const Row = (props: Props) => {
  const { className, style, children, title, popoverContent, contentStyles } =
    props;
  const styles = useStylesheet(props);

  return (
    <SheetItem
      title={() => (
        <Text style={styles.text} weight="semibold">
          {title}
        </Text>
      )}
      popoverContent={popoverContent}
      style={[styles.sheetItem, className, style]}
      contentStyles={contentStyles}
    >
      {children}
    </SheetItem>
  );
};

const useStylesheet = ({ underline = true }: Props) => {
  const { borderPrimary, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        sheetItem: {
          padding: "12px 16px",
          ...(underline ? { borderBottom: `1px solid ${borderPrimary}` } : {}),
        },
        text: {
          color: textDark,
          size: 14,
        },
      }),
    [borderPrimary, textDark, underline],
  );
};

export default observer(Row);
