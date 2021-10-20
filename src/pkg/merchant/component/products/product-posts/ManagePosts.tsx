/*
 * ManagePosts.tsx
 *
 * Created by Jonah Dlin on Wed Apr 14 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout, Text } from "@ContextLogic/lego";

import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps;

const ManagePosts: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Text className={css(styles.pageHeader)} weight="semibold">
        Manage Posts
      </Text>
    </Layout.FlexColumn>
  );
};

export default observer(ManagePosts);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        pageHeader: {
          fontSize: 24,
          lineHeight: "28px",
          color: textBlack,
        },
        section: {
          marginTop: 30,
        },
      }),
    [textBlack],
  );
};
