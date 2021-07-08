import React, { useMemo } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import {
  useFontWeight,
  useFontColor,
  FontColor,
  FontWeight,
} from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";

export type Props = BaseProps & {
  color?: FontColor;
  fontWeight?: FontWeight;
  fontSize?: CSSProperties["fontSize"];
  lineHeight?: CSSProperties["lineHeight"];
  letterSpacing?: CSSProperties["letterSpacing"];
};

const Text: React.FC<Props> = (props: Props) => {
  const { style, className, children } = props;
  const styles = useStylesheet(props);
  return <div className={css(style, className, styles.root)}>{children}</div>;
};

export default Text;

const useStylesheet = ({
  color: colorProp = "DARK",
  fontWeight = "REGULAR",
  fontSize = 16,
  lineHeight = "24px",
  letterSpacing = "0,005em",
}: Props) => {
  const color = useFontColor(colorProp);
  const fontFamily = useFontWeight(fontWeight);

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color,
          fontFamily,
          fontSize,
          lineHeight,
          letterSpacing,
        },
      }),
    [color, fontFamily, fontSize, lineHeight, letterSpacing],
  );
};
