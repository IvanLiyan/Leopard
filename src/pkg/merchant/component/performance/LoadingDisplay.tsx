import React from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

const LoadingDisplay = (props: BaseProps) => {
  const { className, style } = props;
  const styles = useStylesheet();

  return <div className={css(styles.root, className, style)} />;
};

export default LoadingDisplay;

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      display: "flex",
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
      minHeight: 350,
      backgroundColor: palettes.greyScaleColors.LightGrey,
    },
  });
