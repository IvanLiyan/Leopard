import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Banner, BannerProps } from "@ContextLogic/lego";
import { css } from "@core/toolkit/styling";
import { useToastStore } from "@core/stores/ToastStore";

export type ToastProps = Omit<BannerProps, "text" | "sentiment" | "link">;

const Toast = (props: ToastProps) => {
  const { className, ...bannerProps } = props;
  const { currentToast } = useToastStore();
  const styles = useStylesheet();

  if (currentToast == null) {
    return null;
  }

  return (
    <Banner
      className={css(styles.root, className)}
      text={currentToast.message}
      sentiment={currentToast.sentiment}
      link={currentToast.link}
      {...bannerProps}
    />
  );
};

const useStylesheet = () => {
  const { willClose } = useToastStore();

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

export default observer(Toast);
