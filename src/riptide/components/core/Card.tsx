import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { useTheme } from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";

export type Props = BaseProps;

const Card: React.FC<Props> = ({ style, className, children }: Props) => {
  const styles = useStylesheet();
  return <div className={css(style, className, styles.root)}>{children}</div>;
};

export default Card;

const useStylesheet = () => {
  const { border, surfaceWhite } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceWhite,
          border: `1px solid ${border}`,
          boxShadow: `0px 0px 8px ${border}40`, // 25% alpha
          borderRadius: 8,
        },
      }),
    [border, surfaceWhite],
  );
};
