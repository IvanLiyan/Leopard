/*
 * TierCard.tsx
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
import { Card, Layout, Markdown, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { useTheme } from "@merchant/stores/ThemeStore";
import BoxIconGroup from "./BoxIconGroup";
import {
  formatProductAmount,
  PickedProductListingTier,
  PlpTierNames,
} from "@toolkit/products/product-listing-plan";

type Props = BaseProps & {
  readonly tier: PickedProductListingTier;
};

const TierCard: React.FC<Props> = ({
  className,
  style,
  children,
  tier,
}: Props) => {
  const styles = useStylesheet();

  const { tier: tierType, price, higherBound, lowerBound } = tier;

  return (
    <Card
      style={[className, style]}
      contentContainerStyle={{ display: "flex" }}
      title={() => (
        <Layout.FlexColumn
          style={styles.titleContainer}
          alignItems="flex-start"
        >
          <Text style={styles.title} weight="semibold">
            {PlpTierNames[tierType]}
          </Text>
          <Text style={styles.price} weight="semibold">
            {price.amount == 0 ? i`Free` : i`${price.display}/listing/month`}
          </Text>
        </Layout.FlexColumn>
      )}
    >
      <Layout.FlexColumn style={styles.content} justifyContent="space-between">
        {children}
        <Layout.FlexRow style={styles.footer} alignItems="center">
          <BoxIconGroup
            className={css(styles.boxIconGroup)}
            tier={tierType}
            size={24}
          />
          <Markdown
            style={styles.amountRangeText}
            text={
              tierType == "TIER_ONE"
                ? i`**${formatProductAmount(higherBound)}** Product listings`
                : i`**${formatProductAmount(
                    lowerBound,
                  )} - ${formatProductAmount(higherBound)}** Product listings`
            }
          />
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(TierCard);

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        titleContainer: {
          flex: 1,
        },
        title: {
          size: 20,
          lineHeight: "24px",
          color: textDark,
          marginRight: 8,
        },
        price: {
          fontSize: 24,
          lineHeight: "28px",
          color: textBlack,
        },
        content: {
          padding: "24px 32px",
        },
        footer: {
          marginTop: 16,
        },
        boxIconGroup: {
          marginRight: 16,
        },
        amountRangeText: {
          color: textBlack,
          fontSize: 20,
          lineHeight: "24px",
        },
      }),
    [textDark, textBlack],
  );
};
