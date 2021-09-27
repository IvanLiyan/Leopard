import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type HeadingNumberProps = BaseProps & {
  readonly index?: string;
};

const HeadingNumber = ({ index, className }: HeadingNumberProps) => {
  const styles = useStylesheet();
  return <span className={css(styles.root, className)}>{index}</span>;
};

const useStylesheet = () =>
  StyleSheet.create({
    root: {
      display: "inline-block",
      paddingRight: 15,
    },
  });

export default observer(HeadingNumber);
