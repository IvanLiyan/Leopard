//
//  Chrome.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/16/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import ChromeTopBar from "./ChromeTopBar";
import ChromeContent from "./ChromeContent";
import ChromeSideMenu from "./side-menu/ChromeSideMenu";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Addition = {
  TopBar: typeof ChromeTopBar;
  SideMenu: typeof ChromeSideMenu;
  Content: typeof ChromeContent;
};

type ChromeType = React.ComponentType<ChromeProps> & Addition;

export type ChromeProps = BaseProps;

const Chrome = observer((props: ChromeProps) => {
  const styles = useStylesheet();
  const { children, className, style } = props;

  return (
    <section className={css(styles.root, className, style)}>{children}</section>
  );
}) as ChromeType;

Chrome.TopBar = ChromeTopBar;
Chrome.Content = ChromeContent;
Chrome.SideMenu = ChromeSideMenu;

export default Chrome;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
      }),
    [],
  );
};
