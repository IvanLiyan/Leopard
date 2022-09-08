/*
 * CardHeader.tsx
 *
 * Created by Don Sirivat on Fri Mar 11 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly title: string;
};

const CardHeader: React.FC<Props> = ({ className, style, title }: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn
      style={[styles.root, className, style]}
      justifyContent="center"
    >
      <Text style={styles.title} weight="semibold">
        {title}
      </Text>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { surfaceLight, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceLight,
          height: 50,
          border: `1px solid clear`,
          borderRadius: 5,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
        title: {
          fontSize: 14,
          color: textDark,
          marginLeft: 20,
        },
      }),
    [surfaceLight, textDark]
  );
};

export default CardHeader;
