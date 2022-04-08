import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as icons from "@assets/icons";

/* Merchant Components */
import Drawer from "@merchant/component/nav/drawer/Drawer";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useDeviceStore } from "@stores/DeviceStore";

import NextImage from "@next-toolkit/Image";
import { useChromeContext } from "@stores/ChromeStore";

type DrawerButtonProps = BaseProps;

const DrawerButton = (props: DrawerButtonProps) => {
  const { isSmallScreen } = useDeviceStore();
  const { setIsDrawerOpen } = useChromeContext();
  const { style, className, children } = props;
  const styles = useStylesheet();

  const onClick = useCallback(() => {
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  if (!isSmallScreen) {
    return null;
  }

  return (
    <>
      <div className={css(styles.root, className, style)} onClick={onClick}>
        <NextImage
          className={css(styles.img)}
          // TODO [lliepert]: move these to public/
          src={icons.burger}
          draggable="false"
        />
      </div>
      <Drawer className={css(styles.drawer)}>{children}</Drawer>
    </>
  );
};

export default observer(DrawerButton);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          cursor: "pointer",
          padding: 10,
        },
        img: {
          width: 15,
        },
        drawer: {
          zIndex: 1000,
        },
      }),
    [],
  );
};
