/*
 * SettingsTip.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/02/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Tip, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { MarkdownProps } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly text: MarkdownProps["text"];
};

const SettingsTip: React.FC<Props> = (props: Props) => {
  const { className, style, text } = props;
  const styles = useStylesheet(props);
  const { primary } = useTheme();

  return (
    <Tip
      className={css(className, style)}
      icon="tip"
      color={primary}
      style={styles.root}
    >
      <Markdown text={text} />
    </Tip>
  );
};

export default observer(SettingsTip);

const useStylesheet = (props: Props) => {
  const { primaryLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: `${primaryLight}66`,
          borderRight: 0,
          borderTop: 0,
          borderBottom: 0,
        },
      }),
    [primaryLight]
  );
};
