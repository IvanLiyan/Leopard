/*
 * About.tsx
 *
 * Created by Jonah Dlin on Fri Jul 23 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Layout, Markdown, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Calculator from "./Calculator";
import Details from "./Details";
import TierCard from "./TierCard";

/* Toolkit */
import {
  formatProductAmount,
  PlpInitialData,
  PlpTiers,
} from "@toolkit/products/product-listing-plan";

/* Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly initialData: PlpInitialData;
};

const About: React.FC<Props> = ({ className, style, initialData }: Props) => {
  const styles = useStylesheet();

  const rawTiers = useMemo((): PlpTiers | undefined => {
    const {
      platformConstants: { productListing },
    } = initialData;
    const tier1 = productListing.find(({ tier }) => tier === "TIER_ONE");
    const tier2 = productListing.find(({ tier }) => tier === "TIER_TWO");
    const tier3 = productListing.find(({ tier }) => tier === "TIER_THREE");
    if (tier1 == null || tier2 == null || tier3 == null) {
      return;
    }
    return { tier1, tier2, tier3 };
  }, [initialData]);

  if (rawTiers == null) {
    return null;
  }

  const { tier1, tier2, tier3 } = rawTiers;

  const tier1Desc = i`Your first ${formatProductAmount(
    tier1.higherBound
  )} active product listings will be free of charge.`;
  const tier2Desc = i`Additional product listings after your first ${formatProductAmount(
    tier2.lowerBound
  )} before you reach ${formatProductAmount(tier2.higherBound)} will cost ${
    tier2.price.display
  } per listing per month.`;
  const tier3Desc = i`Any listings beyond ${formatProductAmount(
    tier3.lowerBound
  )} will cost ${
    tier3.price.display
  } per listing per month until reaching ${formatProductAmount(
    tier3.higherBound
  )} (maximum number of listings allowed).`;

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Text style={styles.pageHeader} weight="semibold">
        All Plans
      </Text>
      <Layout.FlexRow style={styles.section} alignItems="stretch">
        <TierCard className={css(styles.tierCard)} tier={tier1}>
          <Text style={styles.tierDesc}>{tier1Desc}</Text>
        </TierCard>
        <TierCard className={css(styles.tierCard)} tier={tier2}>
          <Text style={styles.tierDesc}>{tier2Desc}</Text>
        </TierCard>
        <TierCard className={css(styles.tierCard)} tier={tier3}>
          <Markdown style={styles.tierDesc} text={tier3Desc} />
        </TierCard>
      </Layout.FlexRow>
      <Layout.FlexColumn style={styles.section}>
        <Details tiers={{ tier1, tier2, tier3 }} />
      </Layout.FlexColumn>
      <Layout.FlexColumn style={styles.section}>
        <Text style={styles.sectionHeader} weight="semibold">
          Estimate your monthly fee
        </Text>
        <Calculator tiers={{ tier1, tier2, tier3 }} />
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default observer(About);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        pageHeader: {
          fontSize: 24,
          lineHeight: "28px",
          color: textBlack,
          marginBottom: 16,
        },
        section: {
          ":not(:last-child)": {
            marginBottom: 48,
          },
        },
        sectionHeader: {
          marginBottom: 16,
          color: textBlack,
          fontSize: 20,
          lineHeight: "24px",
        },
        tierCard: {
          minHeight: 324,
          maxWidth: 390,
          flex: 1,
          ":not(:last-child)": {
            marginRight: 16,
          },
        },
        tierDesc: {
          fontSize: 16,
          lineHeight: "24px",
          color: textBlack,
        },
      }),
    [textBlack]
  );
};
