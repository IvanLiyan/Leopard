//
//  src/data/IllustratedMetric.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 6/1/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { ReactNode, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Popover, PopoverProps } from "@ContextLogic/lego";
import IllustrationOrRender from "./IllustrationOrRender";
/* Lego Toolkit */
import { css } from "@toolkit/styling";

import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { IllustrationName } from "./Illustration";

import { useTheme } from "@stores/ThemeStore";

export type IllustratedMetricProps = PopoverProps &
  BaseProps & {
    readonly title: string;
    readonly illustration: IllustrationName | (() => ReactNode);
  };

const IllustratedMetric: React.FC<IllustratedMetricProps> = (
  props: IllustratedMetricProps,
) => {
  const { title, illustration, children, className, style, ...popoverProps } =
    props;
  const styles = useStylesheet(props);

  const validChildren = React.Children.toArray(children).filter(
    (e) => e != null,
  );

  const childIsText =
    validChildren.length == 1 && typeof validChildren[0] === "string";

  return (
    <Popover position="top center" popoverMaxWidth={250} {...popoverProps}>
      <div className={css(styles.root, className, style)}>
        <IllustrationOrRender
          className={css(styles.illustration)}
          value={illustration}
          alt={title}
        />
        <div className={css(styles.contentContainer)}>
          <div className={css(styles.title)}>{title}</div>
          {childIsText ? (
            <div className={css(styles.textContent)}>{validChildren[0]}</div>
          ) : (
            validChildren
          )}
        </div>
      </div>
    </Popover>
  );
};

export default IllustratedMetric;

const useStylesheet = (props: IllustratedMetricProps) => {
  const { textLight, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
        },
        contentContainer: {
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
        },
        title: {
          fontSize: 16,
          fontFamily: fonts.proxima,
          color: textLight,
          marginBottom: 10,
        },
        textContent: {
          fontSize: 32,
          fontWeight: fonts.weightSemibold,
          fontStyle: "normal",
          fontStretch: "normal",
          lineHeight: 1.25,
          letterSpacing: "normal",
          color: textDark,
        },
        illustration: {
          width: 80,
          height: 80,
          marginRight: 20,
        },
      }),
    [textDark, textLight],
  );
};
