/*
 * Details.tsx
 *
 * Created by Jonah Dlin on Tue Aug 03 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Card, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { useTheme } from "@stores/ThemeStore";
import {
  formatProductAmount,
  PlpTierNames,
  PlpTiers,
} from "@toolkit/products/product-listing-plan";
import Illustration from "@merchant/component/core/Illustration";
import Icon from "@merchant/component/core/Icon";

import Link from "@next-toolkit/Link";

type Props = BaseProps & {
  readonly tiers: PlpTiers;
};

const Details: React.FC<Props> = ({
  className,
  style,
  tiers: { tier1, tier2, tier3 },
}: Props) => {
  const styles = useStylesheet();
  const { positiveDark } = useTheme();

  // TODO: Link TBD
  const learnMoreLink = "";

  const Point: React.FC<{
    readonly text: string;
  }> = ({ text }) => (
    <Layout.FlexRow style={styles.block} alignItems="flex-start">
      <Icon
        className={css(styles.pointIcon)}
        name="checkCircle"
        color={positiveDark}
        size={20}
      />
      <Text style={styles.pointText}>{text}</Text>
    </Layout.FlexRow>
  );

  return (
    <Card
      style={[className, style]}
      contentContainerStyle={{ display: "flex", margin: 32 }}
    >
      <Layout.FlexRow>
        <Layout.FlexColumn style={styles.column}>
          <Point
            text={
              i`Streamline your product listings and prioritize high-quality ones to align ` +
              i`your business with the right Product Listing Plan.`
            }
          />
          <Point
            text={i`${PlpTierNames.TIER_ONE} enables you to maximize your revenue and offer only the best-selling or highest-quality products.`}
          />
          <Point
            text={i`${
              PlpTierNames.TIER_TWO
            } allows you to offer more than ${formatProductAmount(
              tier1.higherBound
            )} high-quality listings with a small amount of investment per month (your first ${formatProductAmount(
              tier1.higherBound
            )} listings are still free).`}
          />
          <Point
            text={i`${
              PlpTierNames.TIER_THREE
            } may be the right investment for your store if you have more than ${formatProductAmount(
              tier2.higherBound
            )} unique and high-quality products.`}
          />
          <Point
            text={
              i`Based on your budget and product offerings, remove your excessive or ` +
              i`low-quality listings and further invest in your top-selling and ` +
              i`top-quality ones.`
            }
          />
          <Link style={styles.block} href={learnMoreLink}>
            <Text style={styles.link} weight="regular">
              Learn more from our Help Center article
            </Text>
          </Link>
        </Layout.FlexColumn>
        <Layout.FlexRow
          style={styles.illustrationContainer}
          justifyContent="center"
          alignItems="center"
        >
          <Illustration name="productListingPlanAbout" alt="" />
        </Layout.FlexRow>
      </Layout.FlexRow>
    </Card>
  );
};

export default observer(Details);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          flex: 1,
        },
        column: {
          marginRight: 16,
        },
        block: {
          ":not(:last-child)": {
            marginBottom: 48,
          },
        },
        pointIcon: {
          marginTop: 2,
        },
        pointText: {
          fontSize: 16,
          lineHeight: "24px",
          color: textBlack,
          flex: 1,
          marginLeft: 16,
        },
        link: {
          fontSize: 14,
          lineHeight: "20px",
        },
        illustrationContainer: {
          maxWidth: 300,
          marginRight: 16,
        },
      }),
    [textBlack]
  );
};
