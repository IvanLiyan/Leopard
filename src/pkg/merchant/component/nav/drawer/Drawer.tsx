import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import posed, { PoseGroup } from "react-pose";

/* Lego Toolkit */
import {
  palettes,
  modalBackdrop,
} from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import * as icons from "@assets/icons";

/* Relative Imports */
import DrawerContent from "./DrawerContent";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

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
  const { dimenStore, navigationStore } = AppStore.instance();
  const styles = useStylesheet();

  const closeDrawer = useCallback(() => {
    navigationStore.isDrawerOpen = false;
  }, [navigationStore]);

  const isOpen = dimenStore.isSmallScreen && navigationStore.isDrawerOpen;

  return (
    <>
      <PoseGroup>
        {isOpen && (
          <Backdrop
            className={css(styles.backdrop)}
            key="backdrop"
            onClick={closeDrawer}
          />
        )}
      </PoseGroup>
      <DrawerContentContainer
        className={css(styles.drawer)}
        key="drawer"
        pose={isOpen ? "open" : "closed"}
      >
        <div className={css(styles.header)}>
          <img
            className={css(styles.closeButton)}
            src={icons.closeIcon}
            draggable="false"
            onClick={closeDrawer}
          />
        </div>
        {isOpen && (
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
