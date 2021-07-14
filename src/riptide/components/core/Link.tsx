/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { useTheme, useFontWeight } from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";

export type Props = BaseProps &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

const Link = React.forwardRef<HTMLAnchorElement, Props>(
  ({ style, children, href }, ref) => {
    const styles = useStylesheet();
    return (
      <a className={css(styles.root, style)} href={href} ref={ref}>
        {children}
      </a>
    );
  },
);

export default Link;

const useStylesheet = () => {
  const { primaryLight, primary, primaryDark } = useTheme();
  const fontFamily = useFontWeight("MEDIUM");

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontSize: 16,
          fontFamily,
          lineHeight: "24px",
          color: primary,
          transition: "color 0.5s, color 0.5s",
          "@media (hover: hover) and (pointer: fine)": {
            ":hover": {
              color: primaryDark,
            },
          },
          ":active": {
            color: primaryLight,
            transition: "border 0s, color 0s",
          },
        },
      }),
    [primaryLight, primary, primaryDark, fontFamily],
  );
};
