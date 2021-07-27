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
  readonly color?: FontColor;
  readonly fontWeight?: FontWeight;
  readonly fontSize?: CSSProperties["fontSize"];
  readonly lineHeight?: CSSProperties["lineHeight"];
  readonly letterSpacing?: CSSProperties["letterSpacing"];
};

const Text: React.FC<Props> = (props: Props) => {
  const { style, children } = props;
  const styles = useStylesheet(props);
  return <div className={css(styles.root, style)}>{children}</div>;
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
