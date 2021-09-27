//
//  ChromeSideMenuTextLabel.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/27/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Chevron } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { NavigationNode } from "@toolkit/chrome";

type Props = BaseProps & {
  readonly node: NavigationNode;
  readonly counts?: {
    readonly [key: string]: number;
  };
  readonly isSelected?: boolean;
};

export default observer((props: Props) => {
  const { className, style, node, counts, isSelected, ...otherProps } = props;
  const styles = useStylesheet(props);
  const { label, url, children } = node;
  return (
    <Link
      className={css(styles.root, className, style)}
      href={url}
      fadeOnHover={false}
      {...otherProps}
    >
      <div className={css(styles.label)}>{label}</div>
      {children.length > 0 && (
        <Chevron direction="right" className={css(styles.chevron)} />
      )}
    </Link>
  );
});

const useStylesheet = ({ isSelected }: Props) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "10px 12px",
          pointerEvents: "auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        },
        label: {
          color: isSelected
            ? palettes.palaceBlues.DarkPalaceBlue
            : palettes.textColors.LightInk,
          fontSize: 16,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.5,
          letterSpacing: "normal",
        },
        chevron: {
          height: 11,
        },
      }),
    [isSelected]
  );
};
