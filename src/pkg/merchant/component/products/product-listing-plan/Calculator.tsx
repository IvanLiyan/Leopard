/*
 * Calculator.tsx
 *
 * Created by Jonah Dlin on Tue Jul 27 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

/* Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@toolkit/currency";
import {
  formatProductAmount,
  PlpTierNames,
  PlpTiers,
} from "@toolkit/products/product-listing-plan";

/* Components */
import { Card, Info, Layout, Link, Text, TextInput } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Icon } from "@merchant/component/core";
import BoxIconGroup from "./BoxIconGroup";

/* Stores */
import { useTheme } from "@stores/ThemeStore";
import ChargeBreakdown, {
  ChargeBreakdownLine,
  ChargeBreakdownTotal,
} from "./ChargeBreakdown";
import { ProductListingPlanTier } from "@schema/types";

type Props = BaseProps & {
  readonly tiers: PlpTiers;
};

const Calculator: React.FC<Props> = ({
  className,
  style,
  tiers: { tier1, tier2, tier3 },
}: Props) => {
  const styles = useStylesheet();
  const { textDark } = useTheme();

  // TODO: Link TBD
  const learnMoreLink = "";

  const [productCountText, setProductCountText] = useState<
    string | null | undefined
  >();

  const productCount = useMemo(
    () =>
      productCountText == null || productCountText.trim().length == 0
        ? 0
        : _.parseInt(productCountText) || 0,
    [productCountText],
  );

  const tier = useMemo((): ProductListingPlanTier => {
    if (productCount == null || productCount < tier1.higherBound) {
      return "TIER_ONE";
    }
    if (productCount < tier2.higherBound) {
      return "TIER_TWO";
    }
    return "TIER_THREE";
  }, [productCount, tier1, tier2]);

  const cc = tier1.price.currencyCode;

  const {
    charge,
    tier1Amount,
    tier2Amount,
    tier3Amount,
    tier1Charge,
    tier2Charge,
    tier3Charge,
  } = useMemo(() => {
    if (productCount == null) {
      return {
        charge: 0,
        tier1Amount: 0,
        tier2Amount: 0,
        tier3Amount: 0,
        tier1Charge: 0,
        tier2Charge: 0,
        tier3Charge: 0,
      };
    }

    const tier1Amount =
      productCount > tier1.higherBound ? tier1.higherBound : productCount;
    const tier2Amount =
      productCount > tier2.higherBound
        ? tier2.higherBound - tier2.lowerBound + 1
        : Math.max(productCount - tier2.lowerBound + 1, 0);
    const tier3Amount =
      productCount > tier3.higherBound
        ? tier3.higherBound - tier3.lowerBound + 1
        : Math.max(productCount - tier3.lowerBound + 1, 0);

    const tier1Charge = tier1Amount * tier1.price.amount;
    const tier2Charge = tier2Amount * tier2.price.amount;
    const tier3Charge = tier3Amount * tier3.price.amount;

    return {
      charge:
        tier1Amount * tier1.price.amount +
        tier2Amount * tier2.price.amount +
        tier3Amount * tier3.price.amount,
      tier1Amount,
      tier2Amount,
      tier3Amount,
      tier1Charge,
      tier2Charge,
      tier3Charge,
    };
  }, [productCount, tier1, tier2, tier3]);

  const getLines = (): ReadonlyArray<ChargeBreakdownLine> => {
    const cc = tier1.price.currencyCode;
    return [
      {
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
        perListingFee: tier1.price.amount == 0 ? i`Free` : tier1.price.display,
        amount: tier1Amount,
        totalFee: formatCurrency(tier1Charge, cc),
      },
      {
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
        perListingFee: tier2.price.amount == 0 ? i`Free` : tier2.price.display,
        amount: tier2Amount,
        totalFee: formatCurrency(tier2Charge, cc),
      },
      {
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
        perListingFee: tier3.price.amount == 0 ? i`Free` : tier3.price.display,
        amount: tier3Amount,
        totalFee: formatCurrency(tier3Charge, cc),
      },
    ];
  };

  const getTotal = (): ChargeBreakdownTotal => ({
    totalFee: formatCurrency(charge, cc),
    totalProducts: productCount,
  });

  return (
    <Card
      style={[className, style]}
      contentContainerStyle={{ display: "flex" }}
    >
      <Layout.GridRow style={styles.content} templateColumns="1fr max-content">
        <Layout.FlexColumn style={styles.left}>
          <Layout.FlexRow alignItems="center" style={styles.leftTitleContainer}>
            <Icon
              name="calculator"
              className={css(styles.titleIcon)}
              color={textDark}
              size={20}
            />
            <Text style={styles.title} weight="semibold">
              Monthly charge calculator
            </Text>
          </Layout.FlexRow>
          <Layout.FlexColumn style={styles.block}>
            <Text style={styles.text} weight="semibold">
              How many products do you plan to list per month?
            </Text>
            <TextInput
              style={styles.input}
              icon="box"
              type="number"
              value={productCountText}
              onChange={({ text }) =>
                setProductCountText(
                  text == null || text.trim() == "" ? undefined : text,
                )
              }
              placeholder="0"
            />
          </Layout.FlexColumn>
          <Layout.FlexRow style={styles.block} alignItems="center">
            <Text style={styles.text} weight="semibold">
              {PlpTierNames[tier]}
            </Text>
            <BoxIconGroup
              className={css(styles.tierIndicatorIcons)}
              tier={tier}
              size={20}
              flat
            />
          </Layout.FlexRow>
          <Layout.FlexColumn style={styles.block}>
            <Text style={styles.text} weight="semibold">
              Total charge for the month
            </Text>
            <div className={css(styles.resultBox)}>
              <Text style={styles.result} weight="semibold">
                {formatCurrency(charge, cc)}
              </Text>
            </div>
          </Layout.FlexColumn>
          <Link style={styles.block} href={learnMoreLink}>
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

export default observer(Calculator);

const useStylesheet = () => {
  const { surfaceLighter, textDark, textLight, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          flex: 1,
        },
        left: { padding: "24px 32px" },
        leftTitleContainer: { marginBottom: 24 },
        block: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        link: {
          fontSize: 14,
          lineHeight: "20px",
        },
        title: {
          fontSize: 16,
          lineHeight: "24px",
          color: textDark,
        },
        titleIcon: {
          marginRight: 12,
        },
        text: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        tierIndicatorIcons: {
          marginLeft: 8,
        },
        input: {
          maxWidth: 170,
        },
        resultBox: {
          padding: "16px 16px 44px 16px",
          backgroundColor: surfaceLighter,
          maxWidth: 244,
        },
        result: {
          fontSize: 40,
          lineHeight: "48px",
          color: textLight,
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
    [surfaceLighter, textDark, textLight, textBlack],
  );
};
