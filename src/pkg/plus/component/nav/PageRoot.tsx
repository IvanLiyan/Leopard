/*
 *  PageRoot.tsx
 *  Merchant Plus
 *
 *  This component applies basic styling for container roots, including setting
 *  up the minHeight based on the Chrome TopBar height
 *
 *  Created by Lucas Liepert on 07/03/20.
 *  Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
// eslint-disable-next-line local-rules/no-lego-direct-import
import { TopBarHeight } from "@merchant/component/nav/chrome/ChromeTopBar";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const PageRoot: React.FC<BaseProps> = observer((props: BaseProps) => {
  const { className, style, children } = props;
  const styles = useStylesheet();

  return <div className={css(styles.root, className, style)}>{children}</div>;
});

export default PageRoot;

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          minHeight: `calc(100vh - ${TopBarHeight}px)`,
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
      }),
    [pageBackground],
  );
};
