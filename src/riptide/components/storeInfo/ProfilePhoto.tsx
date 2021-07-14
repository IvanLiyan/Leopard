import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { useTheme } from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";

export type Props = BaseProps;

const ProfilePhoto: React.FC<Props> = ({ style }: Props) => {
  const styles = useStylesheet();
  return <div className={css(styles.root, style)} />;
};

export default ProfilePhoto;

const useStylesheet = () => {
  const { accentA, accentB } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: "none",
          height: 64,
          width: 64,
          borderRadius: "50%",
          background: `radial-gradient(${accentB}, ${accentA})`,
        },
      }),
    [accentA, accentB],
  );
};
