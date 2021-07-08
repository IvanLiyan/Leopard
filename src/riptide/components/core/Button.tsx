import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { useTheme } from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";

export type Props = BaseProps &
  Pick<React.HTMLAttributes<HTMLDivElement>, "onClick">;

const Button: React.FC<Props> = ({
  style,
  className,
  children,
  onClick,
}: Props) => {
  const styles = useStylesheet();
  return (
    <div className={css(style, className, styles.root)} onClick={onClick}>
      {children}
    </div>
  );
};

export default Button;

const useStylesheet = () => {
  const { primaryLight, primary, primaryDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          fontSize: 14,
          padding: "10px 24px",
          color: primary,
          border: `1px solid ${primary}`,
          borderRadius: 4,
          transition: "border 0.5s, color 0.5s",
          "@media (hover: hover) and (pointer: fine)": {
            ":hover": {
              color: primaryDark,
              border: `1px solid ${primaryDark}`,
            },
          },
          ":active": {
            color: primaryLight,
            border: `1px solid ${primaryLight}`,
            transition: "border 0s, color 0s",
          },
        },
      }),
    [primaryLight, primary, primaryDark],
  );
};
