//
//  ChromeTopBar.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/17/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useTheme as useAtlasTheme } from "@ContextLogic/atlas-ui";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export const TopBarHeight = 60;
const Padding = 30;

type Props = BaseProps & {
  renderLogo?: () => ReactNode;
  renderSearch?: () => ReactNode;
  backgroundColor?: string;
};

export default observer((props: Props) => {
  const { children, className, style, renderLogo, renderSearch } = props;
  const styles = useStylesheet(props);

  return (
    <section className={css(styles.root, style, className)}>
      {renderLogo && <div>{renderLogo()}</div>}
      {renderSearch && renderSearch()}
      {children}
    </section>
  );
});

const useStylesheet = ({ backgroundColor: backgroundColorProp }: Props) => {
  const { primaryDark } = useTheme();
  const { zIndex } = useAtlasTheme();
  const backgroundColor = backgroundColorProp ?? primaryDark;

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          top: 0,
          left: 0,
          right: 0,
          height: TopBarHeight - 2 * Padding,
          position: "fixed",
          backgroundColor,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: `${Padding}px 20px`,
          justifyContent: "space-between",
          zIndex: zIndex.appBar,
        },
      }),
    [backgroundColor, zIndex.appBar],
  );
};
