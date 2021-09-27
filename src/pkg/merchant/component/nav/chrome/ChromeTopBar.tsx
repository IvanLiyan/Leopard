//
//  ChromeTopBar.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 04/17/20.
//  Copyright © 2020-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo, useEffect, ReactNode } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { motion, AnimatePresence } from "framer-motion";

/* Merchant Store */
import NavigationStore from "@merchant/stores/NavigationStore";
import EnvironmentStore from "@merchant/stores/EnvironmentStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

import { useTimer } from "@ContextLogic/lego/toolkit/hooks";

import { ProgressBar } from "@ContextLogic/lego";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export const TopBarHeight = 60;
const Padding = 30;

type Props = BaseProps & {
  renderLogo?: () => ReactNode;
  renderSearch?: () => ReactNode;
  backgroundColor?: string;
};

const ProgressBarHeight = 3;

export default observer((props: Props) => {
  const { children, className, style, renderLogo, renderSearch } = props;
  const { primary } = useTheme();
  const styles = useStylesheet(props);
  const { isProd } = EnvironmentStore.instance();
  const {
    progressiveLoadingStatus,
    latestPendingNavigationPath,
  } = NavigationStore.instance();

  const avgLoadTime = isProd ? 1500 : 3000;

  const [timeLeft, resetTimer] = useTimer({
    periodMs: avgLoadTime,
    intervalMs: 500,
    startNow: true,
  });

  useEffect(() => {
    if (progressiveLoadingStatus == "IN_PROGRESS") {
      resetTimer();
    }
  }, [progressiveLoadingStatus, resetTimer]);

  // Reset the timer whenever the path being loaded changes
  useEffect(() => {
    if (latestPendingNavigationPath) {
      resetTimer();
    }
  }, [resetTimer, latestPendingNavigationPath]);

  const progress =
    progressiveLoadingStatus == "IN_PROGRESS"
      ? ((avgLoadTime - timeLeft) / avgLoadTime) * 0.9
      : 1;

  return (
    <section className={css(styles.root, style, className)}>
      {renderLogo && (
        <div className={css(styles.logoContainer)}>{renderLogo()}</div>
      )}
      {renderSearch && renderSearch()}
      {children}

      <AnimatePresence>
        {latestPendingNavigationPath != null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            exit={{ opacity: 0 }}
            className={css(styles.loadingBar)}
          >
            <ProgressBar
              progress={progress}
              color={primary}
              height={ProgressBarHeight}
              backgroundColor="transparent"
              transitionDurationMs={200}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

const useStylesheet = ({ backgroundColor: backgroundColorProp }: Props) => {
  const { primaryDark } = useTheme();
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
          zIndex: 999999,
        },
        logoContainer: {},
        loadingBar: {
          position: "absolute",
          bottom: -ProgressBarHeight,
          left: 0,
          right: 0,
          zIndex: 99999999,
        },
      }),
    [backgroundColor]
  );
};
