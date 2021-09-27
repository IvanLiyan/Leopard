/*
 * BreakdownCard.tsx
 *
 * Created by Jonah Dlin on Wed Aug 11 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import {
  formatProductAmount,
  PickedPriceBreakdownPerTier,
  PlpTiers,
  PlpTierNames,
} from "@toolkit/products/product-listing-plan";

/* Components */
import {
  Card,
  Info,
  Layout,
  Link,
  PrimaryButton,
  Text,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import ChargeBreakdown, {
  ChargeBreakdownLine,
  ChargeBreakdownTotal,
} from "./ChargeBreakdown";
import BoxIconGroup from "./BoxIconGroup";

type Props = BaseProps & {
  readonly tiers: PlpTiers;
  readonly priceBreakdownPerTier?: ReadonlyArray<PickedPriceBreakdownPerTier> | null;
  readonly productCount?: number | null;
  readonly charge?: string | null;
};

const BreakdownCard: React.FC<Props> = ({
  className,
  style,
  tiers: { tier1, tier2, tier3 },
  priceBreakdownPerTier,
  productCount,
  charge,
}: Props) => {
  const styles = useStylesheet();

  // TODO: Link TBD
  const learnMoreLink = "";

  const getLines = (): ReadonlyArray<ChargeBreakdownLine> => {
    const tier1Breakdown = (priceBreakdownPerTier || []).find(
      ({ tier }) => tier == "TIER_ONE",
    );
    const tier2Breakdown = (priceBreakdownPerTier || []).find(
      ({ tier }) => tier == "TIER_TWO",
    );
    const tier3Breakdown = (priceBreakdownPerTier || []).find(
      ({ tier }) => tier == "TIER_THREE",
    );

    return [
      tier1Breakdown == null
        ? null
        : {
            title: () => (
              <Layout.GridRow
                templateColumns="auto 1fr"
                alignItems="center"
                gap="8px 8px"
              >
                <Text style={styles.breakdownTierTitle}>
                  {PlpTierNames.TIER_ONE}
                </Text>
                <BoxIconGroup tier="TIER_ONE" size={20} flat />
                <Text style={styles.breakdownTierDesc}>
                  First {formatProductAmount(tier1.higherBound)} listings
                </Text>
              </Layout.GridRow>
            ),
            perListingFee:
              tier1.price.amount == 0 ? i`Free` : tier1.price.display,
            amount: tier1Breakdown.productCount,
            totalFee: tier1Breakdown.price.display,
          },
      tier2Breakdown == null
        ? null
        : {
            title: () => (
              <Layout.GridRow
                templateColumns="auto 1fr"
                alignItems="center"
                gap="8px 8px"
              >
                <Text style={styles.breakdownTierTitle}>
                  {PlpTierNames.TIER_TWO}
                </Text>
                <BoxIconGroup tier="TIER_TWO" size={20} flat />
                <Text style={styles.breakdownTierDesc}>
                  {i`${formatProductAmount(tier2.lowerBound)} - ` +
                    i`${formatProductAmount(tier2.higherBound)} listings`}
                </Text>
              </Layout.GridRow>
            ),
            perListingFee:
              tier2.price.amount == 0 ? i`Free` : tier2.price.display,
            amount: tier2Breakdown?.productCount,
            totalFee: tier2Breakdown?.price.display,
          },
      tier3Breakdown == null
        ? null
        : {
            title: () => (
              <Layout.GridRow
                templateColumns="auto 1fr"
                alignItems="center"
                gap="8px 8px"
              >
                <Text style={styles.breakdownTierTitle}>
                  {PlpTierNames.TIER_THREE}
                </Text>
                <BoxIconGroup tier="TIER_THREE" size={20} flat />
                <Text style={styles.breakdownTierDesc}>
                  {i`${formatProductAmount(tier3.lowerBound)} - ` +
                    i`${formatProductAmount(tier3.higherBound)} listings`}
                </Text>
              </Layout.GridRow>
            ),
            perListingFee:
              tier3.price.amount == 0 ? i`Free` : tier3.price.display,
            amount: tier3Breakdown?.productCount,
            totalFee: tier3Breakdown?.price.display,
          },
    ].filter(
      (nullOrValue) => nullOrValue != null,
    ) as ReadonlyArray<ChargeBreakdownLine>;
  };

  const getTotal = (): ChargeBreakdownTotal | undefined =>
    charge == null || productCount == null
      ? undefined
      : {
          totalFee: charge,
          totalProducts: productCount,
        };

  return (
    <Card
      style={[className, style]}
      contentContainerStyle={{ display: "flex" }}
    >
      <Layout.GridRow style={styles.content}>
        <Layout.FlexColumn style={styles.left}>
          <Text style={[styles.leftSideTitle, styles.title]} weight="semibold">
            Listing charge breakdown
          </Text>
          <Text style={[styles.title]}>
            (based on the maximum number of active product listings for the
            current month)
          </Text>

          <Text style={styles.amount} weight="semibold">
            {charge || "--"}
          </Text>

          <Text style={styles.disclaimer}>
            You may have some duplicated product listings or items that aren't
            selling well. Remove or clean up excessive or low-quality listings
            to save on product listing charges.
          </Text>
          <PrimaryButton style={styles.button} href="/product">
            Clean up listings
          </PrimaryButton>
          <Link href={learnMoreLink}>
            <Text style={styles.link} weight="regular">
              Learn more from our Help Center article
            </Text>
          </Link>
        </Layout.FlexColumn>

        <Layout.FlexColumn style={styles.right}>
          <Layout.FlexRow alignItems="center">
            <Text style={styles.title} weight="semibold">
              Fee breakdown
            </Text>
            <Info
              style={styles.info}
              size={16}
              text={
                i`The Product Listing Plan charges based on the maximum number of ` +
                i`active product listings during a given month and does not account ` +
                i`for fluctuation in listing quantities throughout the month.`
              }
            />
          </Layout.FlexRow>
          <ChargeBreakdown lines={getLines()} total={getTotal()} />
        </Layout.FlexColumn>
      </Layout.GridRow>
    </Card>
  );
};

export default observer(BreakdownCard);

const useStylesheet = () => {
  const { surfaceLighter, textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          flex: 1,
          "@media (max-width: 1340px)": {
            gridTemplateColumns: "1fr",
          },
          "@media (min-width: 1340px)": {
            gridTemplateColumns: "1fr max-content",
          },
        },
        left: { padding: "24px 32px" },
        link: {
          fontSize: 14,
          lineHeight: "20px",
        },
        title: {
          fontSize: 16,
          lineHeight: "24px",
          color: textDark,
        },
        leftSideTitle: { marginBottom: 24 },
        amount: {
          fontSize: 40,
          lineHeight: "48px",
          color: textBlack,
          margin: "16px 0px 24px 0px",
        },
        disclaimer: {
          marginBottom: 8,
          fontSize: 12,
          lineHeight: "16px",
          color: textDark,
        },
        button: {
          marginBottom: 16,
          boxSizing: "border-box",
          height: 40,
          maxWidth: 160,
        },
        right: { padding: "24px 48px", backgroundColor: surfaceLighter },
        info: {
          marginLeft: 8,
        },
        breakdownTierTitle: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        breakdownTierDesc: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          gridColumn: "1 / 3",
        },
      }),
    [surfaceLighter, textBlack, textDark],
  );
};
