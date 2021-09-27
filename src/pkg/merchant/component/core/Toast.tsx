//
//  component/nav/Toast.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/20/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Banner, BannerProps } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import ToastStore from "@merchant/stores/ToastStore";
import NavigationStore from "@merchant/stores/NavigationStore";

export type ToastProps = Omit<BannerProps, "text" | "sentiment" | "link"> & {
  readonly insideModal?: boolean;
};

export default observer((props: ToastProps) => {
  const { className, insideModal: insideModalProp, ...bannerProps } = props;
  const { isNavyBlueNav } = NavigationStore.instance();
  const { currentToast, modalOpen } = ToastStore.instance();

  const insideModal = !!insideModalProp;

  const styles = useStylesheet();

  if (currentToast == null) {
    return null;
  }

  if (insideModal !== modalOpen) {
    // Should be either:
    //   - inside modal, with modal open
    //   - NOT inside modal, with modal NOT open
    return null;
  }

  return (
    <Banner
      className={css(
        styles.root,
        isNavyBlueNav ? null : styles.selfPositioning,
        className
      )}
      text={currentToast.message}
      sentiment={currentToast.sentiment}
      link={currentToast.link}
      {...bannerProps}
    />
  );
});

const useStylesheet = () => {
  const { willClose } = ToastStore.instance();

  return useMemo(() => {
    let keyframes = {};
    if (willClose) {
      keyframes = {
        from: {
          opacity: 1,
          transform: "translateY(0)",
        },

        to: {
          opacity: 0,
          transform: "translateY(-10px)",
        },
      };
    } else {
      keyframes = {
        from: {
          opacity: 0,
          transform: "translateY(-10px)",
        },

        to: {
          opacity: 1,
          transform: "translateY(0)",
        },
      };
    }

    return StyleSheet.create({
      root: {
        zIndex: 1100,
        animationName: [keyframes],
        animationDuration: "250ms",
        animationFillMode: "forwards",
      },
      selfPositioning: {
        position: "fixed",
        left: 0,
        right: 0,
      },
    });
  }, [willClose]);
};
