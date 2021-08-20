import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { useTheme } from "@riptide/toolkit/theme";
import { BaseProps } from "@riptide/toolkit/types";
import { useStorefrontState } from "@toolkit/context/storefront-state";

import Layout from "@components/core/Layout";
import H2 from "@riptide/components/core/H2";

export type Props = BaseProps;

const ProfilePhoto: React.FC<Props> = ({ style }: Props) => {
  const styles = useStylesheet();
  const { storeName } = useStorefrontState();

  return (
    <Layout.FlexRow justifyContent="center" style={[styles.root, style]}>
      <H2 color="LIGHT" fontSize={24} lineHeight={"24px"}>
        {storeName.charAt(0).toUpperCase()}
      </H2>
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
