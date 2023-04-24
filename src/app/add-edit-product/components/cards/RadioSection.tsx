/*
 * RadioSection.tsx
 *
 * Created by Jonah Dlin on Tue Nov 16 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { Layout, Radio } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type RadioSectionProps = BaseProps & {
  readonly checked: boolean;
  readonly contentContainerStyle?: CSSProperties | string;
};

const RadioSection = (props: RadioSectionProps) => {
  const styles = useStylesheet();
  const { checked, className, style, contentContainerStyle, children } = props;

  return (
    <Layout.FlexRow
      style={[styles.root, className, style]}
      alignItems="stretch"
    >
      <Radio checked={checked} style={styles.radio} />
      <div className={css(contentContainerStyle)}>{children}</div>
    </Layout.FlexRow>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: 15,
        },
        radio: {
          alignSelf: "center",
          marginRight: 20,
        },
      }),
    [],
  );
};

export default observer(RadioSection);
