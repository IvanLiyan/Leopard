import React, { useMemo } from "react";
import NextLink from "next/link";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";

import H1 from "@riptide/components/core/H1";
import Text from "@riptide/components/core/Text";
import RiptideLink from "@riptide/components/core/Link";
import { useTheme } from "@riptide/toolkit/theme";
import { useStorefrontState } from "@toolkit/context/storefront-state";

import Layout from "@components/core/Layout";
import Flag from "@components/core/Flag";
import Rating from "@riptide/components/storeInfo/Rating";
import ProfilePhoto from "@riptide/components/storeInfo/ProfilePhoto";

export type Props = Pick<BaseProps, "style">;

const SubText = ({ children }: BaseProps) => {
  return (
    <Text
      color="LIGHT"
      fontSize="14px"
      lineHeight="14px"
      style={{
        ":not(:last-child)": { marginBottom: "6px" },
      }}
    >
      {children}
    </Text>
  );
};

const StoreInfoSection: React.FC<Props> = ({ style }: Props) => {
  const styles = useStylesheet();
  const {
    storeName,
    merchantCreationDate,
    location: { name: locationName, cc },
    numReviews,
  } = useStorefrontState();

  return (
    <Layout.FlexColumn style={[styles.root, style]}>
      <div className={css(styles.header)} />
      <ProfilePhoto style={styles.profilePhoto} />
      <Layout.FlexRow style={[styles.margin, { marginTop: 48 }]}>
        <H1>{storeName}</H1>
      </Layout.FlexRow>

      <Layout.FlexColumn style={styles.margin}>
        <SubText>
          Store rating: <Rating />
        </SubText>
        <SubText>Seller since: {merchantCreationDate}</SubText>
        <SubText>
          Location: <Flag cc={cc} height={11} /> {locationName}
        </SubText>
      </Layout.FlexColumn>

      <NextLink href="/" passHref>
        <RiptideLink style={styles.link}>
          See {numReviews} merchant reviews
        </RiptideLink>
      </NextLink>
    </Layout.FlexColumn>
  );
};

export default StoreInfoSection;

const useStylesheet = () => {
  const { surfaceWhite, border } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          backgroundColor: surfaceWhite,
        },
        header: {
          height: "96px",
          width: "100vw",
          background: "linear-gradient(113.79deg, #10774C 0%, #8B66E5 100%)",
          backgroundSize: "100vw 240px",
        },
        profilePhoto: {
          position: "absolute",
          left: 16,
          top: 64,
        },
        margin: {
          margin: "0px 16px 16px 16px",
        },
        link: {
          borderTop: `1px solid ${border}`,
          padding: "16px 0px",
          margin: "0px 16px 0px 16px",
        },
      }),
    [surfaceWhite, border],
  );
};
