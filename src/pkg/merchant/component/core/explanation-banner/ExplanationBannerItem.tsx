//
//  ExplanationBannerItem.tsx
//  Project-Lego
//
//  Created by Richard Ye on 12/04/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import Illustration, {
  IllustrationName,
} from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ExplanationBannerItemProps = BaseProps & {
  readonly title?: string;
  readonly illustration?: IllustrationName;
  readonly maxWidth?: number;
};

const ExplanationBannerItem: React.FC<ExplanationBannerItemProps> = (
  props: ExplanationBannerItemProps,
) => {
  const { style, className, title = "", illustration } = props;
  const styles = useStylesheet(props);
  const children = useChildren(props);

  return (
    <div className={css(styles.bannerItem, className, style)}>
      {illustration && <Illustration name={illustration} alt={title} />}
      <div className={css(styles.title)}>{title}</div>
      {children}
    </div>
  );
};

const useChildren = (props: ExplanationBannerItemProps) => {
  const { children } = props;
  return useMemo(() => {
    return React.Children.toArray(children);
  }, [children]);
};

export default observer(ExplanationBannerItem);

const useStylesheet = (props: ExplanationBannerItemProps) => {
  const { textDark, textBlack } = useTheme();
  const { maxWidth } = props;
  return useMemo(
    () =>
      StyleSheet.create({
        bannerItem: {
          display: "flex",
          flex: "1 1 200px",
          maxWidth: maxWidth || "300px",
          textAlign: "center",
          flexDirection: "column",
          alignItems: "center",
          fontSize: 14,
          color: textDark,
        },
        title: {
          fontSize: 16,
          fontWeight: fonts.weightBold,
          lineHeight: 1.5,
          color: textBlack,
          cursor: "default",
          wordWrap: "break-word",
          whiteSpace: "normal",
          margin: "24px 0 8px",
        },
      }),
    [textBlack, textDark, maxWidth],
  );
};
