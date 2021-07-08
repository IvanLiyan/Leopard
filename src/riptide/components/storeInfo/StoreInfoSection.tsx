import React, { useState, useMemo } from "react";
import NextLink from "next/link";
import { StyleSheet } from "aphrodite";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";

import Card from "@riptide/components/core/Card";
import H1 from "@riptide/components/core/H1";
import Text from "@riptide/components/core/Text";
import RiptideLink from "@riptide/components/core/Link";
import { useTheme } from "@riptide/toolkit/theme";

import Layout from "@components/core/Layout";
import FollowButton from "@riptide/components/storeInfo/FollowButton";
import ProfilePhoto from "@riptide/components/storeInfo/ProfilePhoto";

export type Props = BaseProps & {
  readonly storeName: string;
  readonly isFollowing: boolean;
  readonly sellerSince: number;
  readonly location: {
    readonly cc: string;
    readonly formatted: string;
  };
  readonly storeDescription: string;
  readonly numReviews: number;
};

const SubText = ({ children }: BaseProps) => {
  return (
    <Text color="LIGHT" fontSize={14} lineHeight="20px">
      {children}
    </Text>
  );
};

const StoreInfoSection: React.FC<Props> = ({
  style,
  className,
  storeName,
  isFollowing: isFollowingProp,
  sellerSince,
  location: { formatted: locationFormatted },
  storeDescription,
  numReviews,
}: Props) => {
  const styles = useStylesheet();
  const [isFollowing, setIsFollowing] = useState<boolean>(isFollowingProp);

  return (
    <Card className={css(style, className, styles.root)}>
      <Layout.FlexColumn>
        <Layout.FlexRow
          style={{ marginTop: 32 }}
          className={css(styles.margin)}
        >
          <ProfilePhoto style={{ marginRight: 16 }} />
          <H1>{storeName}</H1>
        </Layout.FlexRow>

        <Layout.FlexRow
          justifyContent="space-between"
          className={css(styles.margin)}
        >
          <Layout.FlexColumn>
            <SubText>Store rating:</SubText>
            <SubText>Seller since: {sellerSince}</SubText>
            <SubText>Location: {locationFormatted}</SubText>
          </Layout.FlexColumn>
          <FollowButton
            isFollowing={isFollowing}
            onClick={() => {
              setIsFollowing((prev) => !prev);
            }}
          />
        </Layout.FlexRow>

        <Text className={css(styles.margin)}>{storeDescription}</Text>

        <NextLink href="/" passHref>
          <RiptideLink className={css(styles.link)}>
            See {numReviews} merchant reviews
          </RiptideLink>
        </NextLink>
      </Layout.FlexColumn>
    </Card>
  );
};

export default StoreInfoSection;

const useStylesheet = () => {
  const { border } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        margin: {
          margin: 16,
        },
        link: {
          borderTop: `1px solid ${border}`,
          padding: 16,
        },
      }),
    [border],
  );
};
