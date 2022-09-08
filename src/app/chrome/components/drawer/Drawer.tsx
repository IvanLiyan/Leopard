import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import posed, { PoseGroup } from "react-pose";

/* Lego Toolkit */
import {
  palettes,
  modalBackdrop,
} from "@src/deprecated/pkg/toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@core/toolkit/styling";
import * as icons from "@src/deprecated/pkg/assets/icons";

/* Relative Imports */
import DrawerContent from "./DrawerContent";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "@core/components/Image";
import { useChromeContext } from "@core/stores/ChromeStore";

const DrawerContentContainer = posed.nav({
  open: { right: "0%", staggerChildren: 100 },
  closed: { right: "-100%" },
});

const Backdrop = posed.div({
  enter: { opacity: 0.95 },
  exit: { opacity: 0 },
});

type DrawerProps = BaseProps;

const Drawer = ({ children }: DrawerProps) => {
  const styles = useStylesheet();
  const { isDrawerOpen, setIsDrawerOpen } = useChromeContext();

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, [setIsDrawerOpen]);

  return (
    <>
      <PoseGroup>
        {isDrawerOpen && (
          // @ts-expect-error - TODO [lliepert]: fix this typing
          <Backdrop
            className={css(styles.backdrop)}
            key="backdrop"
            onClick={closeDrawer}
          />
        )}
      </PoseGroup>
      {/* @ts-expect-error - TODO [lliepert]: fix this typing */}
      <DrawerContentContainer
        className={css(styles.drawer)}
        key="drawer"
        pose={isDrawerOpen ? "open" : "closed"}
      >
        <div className={css(styles.header)}>
          <NextImage
            className={css(styles.closeButton)}
            src={icons.closeIcon}
            draggable="false"
            onClick={closeDrawer}
            alt="TODO"
          />
        </div>
        {isDrawerOpen && (
          <DrawerContent closeDrawer={closeDrawer}>{children}</DrawerContent>
        )}
      </DrawerContentContainer>
    </>
  );
};

export default observer(Drawer);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          position: "fixed",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: 9999,
          backgroundColor: modalBackdrop,
        },
        header: {
          height: 60,
          borderBottom: "1px solid rgba(196, 205, 213, 0.5)",
          display: "flex",
          alignItems: "center",
          flexDirection: "row-reverse",
        },
        closeButton: {
          padding: 15,
          height: 16,
          cursor: "pointer",
        },
        drawer: {
          position: "fixed",
          top: 0,
          bottom: 0,
          backgroundColor: palettes.textColors.White,
          // eslint-disable-next-line local-rules/no-frozen-width
          width: "60%",
          zIndex: 9999,
          boxShadow:
            "-2px 0 4px 0 rgba(175, 199, 209, 0.2), inset 1px 0 0 0 rgba(175, 199, 209, 0.5)",
        },
      }),
    [],
  );
};
