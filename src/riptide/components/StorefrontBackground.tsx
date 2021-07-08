import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";

export type Props = BaseProps & {
  readonly deg: number;
  readonly colorA: string;
  readonly colorB: string;
};

const StorefrontBackground: React.FC<Props> = (props: Props) => {
  const { style, className, children } = props;
  const styles = useStylesheet(props);

  return <div className={css(style, className, styles.root)}>{children}</div>;
};

export default StorefrontBackground;

const useStylesheet = ({ deg, colorA, colorB }: Props) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flow-root",
          height: "100vh",
          width: "100vw",
          background: `linear-gradient(${deg}deg, ${colorA} 0%, ${colorB} 100%) no-repeat`,
          backgroundSize: "100vw 240px",
        },
      }),
    [deg, colorA, colorB],
  );
};
