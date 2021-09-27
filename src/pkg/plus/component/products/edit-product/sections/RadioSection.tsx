/*
 *
 * RadioSection.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { Radio } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type RadioSectionProps = BaseProps & {
  readonly checked: boolean;
  readonly contentContainerStyle?: CSSProperties | string;
};

const RadioSection = (props: RadioSectionProps) => {
  const styles = useStylesheet();
  const { checked, className, style, contentContainerStyle, children } = props;

  return (
    <div className={css(styles.root, className, style)}>
      <Radio checked={checked} className={css(styles.radio)} />
      <div className={css(styles.content, contentContainerStyle)}>
        {children}
      </div>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          padding: "15px 15px",
        },
        radio: {
          alignSelf: "center",
          marginRight: 20,
        },
        content: {},
      }),
    []
  );
};

export default observer(RadioSection);
