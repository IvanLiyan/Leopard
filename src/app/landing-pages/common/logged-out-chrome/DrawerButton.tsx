import React, { useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

/* Merchant Components */
import Drawer from "./Drawer";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useDeviceStore } from "@core/stores/DeviceStore";
import { useChromeContext } from "@core/stores/ChromeStore";
import Icon from "@core/components/Icon";

type DrawerButtonProps = BaseProps & {
  readonly onClickCta?: () => unknown;
  readonly ctaText?: string;
};

const DrawerButton = (props: DrawerButtonProps) => {
  const { isSmallScreen } = useDeviceStore();
  const chromeStore = useChromeContext();
  const { style, className, children, onClickCta, ctaText } = props;
  const styles = useStylesheet();

  const onClick = useCallback(() => {
    chromeStore.setIsDrawerOpen(true);
  }, [chromeStore]);

  if (!isSmallScreen) {
    return null;
  }

  return (
    <>
      <div className={css(styles.root, className, style)} onClick={onClick}>
        <Icon className={css(styles.img)} name="menu" />
      </div>
      <Drawer
        className={css(styles.drawer)}
        onClickCta={onClickCta}
        ctaText={ctaText}
      >
        {children}
      </Drawer>
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
