import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Layout, Divider as LegoDivider } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Text } from "@ContextLogic/atlas-ui";
import { useTheme } from "@core/stores/ThemeStore";
import { css } from "@core/toolkit/styling";

type Props = Pick<BaseProps, "className" | "style"> & {
  children: string;
};

const Divider: React.FC<Props> = ({ className, style, children }) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexRow style={[style, className]}>
      <LegoDivider style={styles.divider} />
      <Text variant="bodyS" className={css(styles.text)}>
        {children}
      </Text>
      <LegoDivider style={styles.divider} />
    </Layout.FlexRow>
  );
};

export default observer(Divider);

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(() => {
    return StyleSheet.create({
      divider: { flex: 1 },
      text: {
        marginRight: "10px",
        marginLeft: "10px",
        color: textLight,
      },
    });
  }, [textLight]);
};
