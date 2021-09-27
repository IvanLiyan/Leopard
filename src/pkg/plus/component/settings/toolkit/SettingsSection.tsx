import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

export type SettingsSectionProps = BaseProps & {
  readonly title: string;
  readonly hasBottomBorder?: boolean;
};

const SettingsSection = (props: SettingsSectionProps) => {
  const { className, style, title, children } = props;

  const styles = useStylesheet(props);

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.title)}>{title}</div>
      {children}
    </div>
  );
};

export default observer(SettingsSection);

const useStylesheet = ({ hasBottomBorder }: SettingsSectionProps) => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          borderBottom: hasBottomBorder
            ? `1px dashed rgba(175, 199, 209, 0.5)`
            : undefined,
          paddingBottom: hasBottomBorder ? 40 : undefined,
          ":not(:first-child)": {
            paddingTop: 20,
          },
        },
        title: {
          textTransform: "uppercase",
          color: textLight,
          paddingBottom: 24,
          display: "flex",
          alignItems: "center",
        },
      }),
    [hasBottomBorder, textLight],
  );
};
