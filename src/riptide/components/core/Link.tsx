/* eslint-disable react/display-name */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { useTheme, useFontWeight } from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";

export type Props = BaseProps &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    readonly disabled?: boolean;
  };

const Link = React.forwardRef<HTMLAnchorElement, Props>(
  ({ style, children, href, disabled = false }, ref) => {
    const styles = useStylesheet(disabled);
    const className = css(styles.root, style);

    return disabled ? (
      <div className={className}>{children}</div>
    ) : (
      <a className={className} href={href} ref={ref}>
        {children}
      </a>
    );
  },
);

export default Link;

const useStylesheet = (disabled: boolean) => {
  const { primaryLight, primary, primaryDark, textUltraLight } = useTheme();
  const fontFamily = useFontWeight("MEDIUM");

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontSize: 16,
          fontFamily,
          lineHeight: "24px",
          ...(disabled
            ? {
                color: textUltraLight,
                cursor: "not-allowed",
              }
            : {
                color: primary,
                cursor: "pointer",
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
              }),
        },
      }),
    [disabled, primaryLight, primary, primaryDark, textUltraLight, fontFamily],
  );
};
