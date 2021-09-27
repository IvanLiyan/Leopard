/*
 * ChargeBreakdown.tsx
 *
 * Created by Jonah Dlin on Wed Aug 11 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Toolkit */
import { css } from "@toolkit/styling";
import { formatProductAmount } from "@toolkit/products/product-listing-plan";

/* Components */
import { Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

export type ChargeBreakdownLine = {
  readonly title?: string | (() => React.ReactNode);
  readonly perListingFee: string;
  readonly amount: number;
  readonly totalFee: string;
};

export type ChargeBreakdownTotal = {
  readonly totalProducts: number;
  readonly totalFee: string;
};

type Props = BaseProps & {
  readonly lines?: ReadonlyArray<ChargeBreakdownLine>;
  readonly total?: ChargeBreakdownTotal;
};

const ChargeBreakdown: React.FC<Props> = ({
  className,
  style,
  lines,
  total,
}: Props) => {
  const styles = useStylesheet();

  const renderTitle = (title: string | (() => React.ReactNode) | undefined) => {
    if (title == null) {
      return null;
    }
    return typeof title == "string" ? title : title();
  };

  return (
    <Layout.GridRow
      templateColumns="repeat(6, max-content)"
      gap="8px 32px"
      alignItems="center"
      style={[className, style]}
    >
      <Text style={[styles.columnTitle, { gridColumn: 2 }]} weight="semibold">
        Fee per listing per month
      </Text>
      <Text style={[styles.columnTitle, { gridColumn: 4 }]} weight="semibold">
        {ci18n("Refers to an amount of product listings", "Your listings")}
      </Text>
      <Text style={[styles.columnTitle, { gridColumn: 6 }]} weight="semibold">
        Total fee
      </Text>

      {lines != null &&
        lines.map(({ title, perListingFee, amount, totalFee }) => (
          <>
            <Layout.FlexRow style={styles.cellMargin} alignItems="center">
              {renderTitle(title)}
            </Layout.FlexRow>
            <Text
              className={css(
                styles.breakdownText,
                styles.cellMargin,
                styles.rightAlign
              )}
              weight="semibold"
            >
              {perListingFee}
            </Text>
            <Text
              style={[styles.breakdownText, styles.cellMargin]}
              weight="semibold"
            >
              {`x`}
            </Text>
            <Text
              className={css(
                styles.breakdownText,
                styles.cellMargin,
                styles.rightAlign
              )}
              weight="semibold"
            >
              {formatProductAmount(amount)}
            </Text>
            <Text
              style={[styles.breakdownText, styles.cellMargin]}
              weight="semibold"
            >
              {`=`}
            </Text>
            <Text
              className={css(
                styles.breakdownText,
                styles.cellMargin,
                styles.rightAlign
              )}
              weight="semibold"
            >
              {totalFee}
            </Text>
          </>
        ))}

      {total != null && (
        <>
          <div className={css(styles.separator, styles.cellMargin)} />

          <Text style={styles.breakdownText} weight="semibold">
            Total
          </Text>
          <Text
            style={[styles.breakdownText, styles.rightAlign, { gridColumn: 4 }]}
            weight="semibold"
          >
            {formatProductAmount(total.totalProducts)}
          </Text>
          <Text
            style={[styles.breakdownText, styles.rightAlign, { gridColumn: 6 }]}
            weight="semibold"
          >
            {total.totalFee}
          </Text>
        </>
      )}
    </Layout.GridRow>
  );
};

export default observer(ChargeBreakdown);

const useStylesheet = () => {
  const { textDark, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        columnTitle: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        breakdownText: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
        },
        cellMargin: {
          marginTop: 10,
          marginBottom: 10,
        },
        rightAlign: {
          textAlign: "right",
        },
        separator: {
          height: 1,
          boxSizing: "border-box",
          borderBottom: `1px solid ${borderPrimary}`,
          gridColumn: "1 / 7",
        },
      }),
    [textDark, borderPrimary]
  );
};
