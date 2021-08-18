import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";

import Layout from "@components/core/Layout";
import Text from "@riptide/components/core/Text";

export type Props = Omit<BaseProps, "style">;

const StorefrontBackground: React.FC<Props> = (props: Props) => {
  const { children } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn justifyContent="space-between" style={styles.root}>
      <div className={css(styles.childrenContainer)}>{children}</div>
      <Text
        fontSize={10}
        lineHeight={"12px"}
        fontWeight="MEDIUM"
        color="LIGHT"
        style={styles.footer}
      >
        &copy; Wish 2021
      </Text>
    </Layout.FlexColumn>
  );
};

export default StorefrontBackground;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          minHeight: "100vh",
          width: "100vw",
        },
        childrenContainer: {
          display: "flow-root",
        },
        footer: {
          alignSelf: "flex-end",
          padding: "64px 8px 8px 8px",
        },
      }),
    [],
  );
};
