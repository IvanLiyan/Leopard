import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { useTheme } from "@core/stores/ThemeStore";
import { TopBarHeight } from "@chrome/components/chrome/ChromeTopBar";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout } from "@ContextLogic/lego";

const PageRoot: React.FC<BaseProps> = observer((props: BaseProps) => {
  const { className, style, children } = props;
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn style={[styles.root, className, style]}>
      {children}
    </Layout.FlexColumn>
  );
});

export default PageRoot;

const useStylesheet = () => {
  const { pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          minHeight: `calc(100vh - ${TopBarHeight}px)`,
          backgroundColor: pageBackground,
        },
      }),
    [pageBackground],
  );
};
