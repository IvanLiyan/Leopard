//
//  ChromeSideMenuIcon.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/17/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */

import "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Link from "@deprecated/components/Link";
import { ChromeNavigationNode } from "@core/stores/ChromeStore";

type Props = BaseProps & {
  readonly node: ChromeNavigationNode;
  readonly onMouseOver?: () => unknown;
};

export const IconButtonPadding = 30;
export const IconButtonHeight = 20;
export const IconButtonWidth = 20;

export default observer(({ className, style, node, ...otherProps }: Props) => {
  const styles = useStylesheet();
  const { label, url } = node;
  return (
    <Link
      className={css(styles.root, className, style)}
      href={url}
      {...otherProps}
    >
      {label}
    </Link>
  );
});

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          width: IconButtonWidth,
          height: IconButtonHeight + IconButtonPadding,
          minHeight: IconButtonHeight + IconButtonPadding,
          cursor: "pointer",
          opacity: 0.5,
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        },
      }),
    [],
  );
};
