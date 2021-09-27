/*
 * Separator.tsx
 *
 * Created by Jonah Dlin on Wed Feb 10 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps;

const Separator: React.FC<Props> = ({ className, style }: Props) => {
  const styles = useStylesheet();

  return <div className={css(styles.root, className, style)} />;
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          boxSizing: "border-box",
          height: 1,
          borderBottom: `1px dashed ${borderPrimary}`,
        },
      }),
    [borderPrimary]
  );
};

export default observer(Separator);
