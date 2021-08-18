import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { useTheme } from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";

import Layout from "@components/core/Layout";
import H2 from "@riptide/components/core/H2";

export type Props = BaseProps;

const ProfilePhoto: React.FC<Props> = ({ style }: Props) => {
  const styles = useStylesheet();
  // TODO [lliepert]: create and plug into local state
  return (
    <Layout.FlexRow justifyContent="center" style={[styles.root, style]}>
      <H2 color="LIGHT">S</H2>
    </Layout.FlexRow>
  );
};

export default ProfilePhoto;

const useStylesheet = () => {
  const { surfaceMediumLight } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          height: 64,
          width: 64,
          borderRadius: "50%",
          backgroundColor: surfaceMediumLight,
        },
      }),
    [surfaceMediumLight],
  );
};
