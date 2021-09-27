/*
 * ListingAmountCard.tsx
 *
 * Created by Jonah Dlin on Wed Aug 04 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { useTheme } from "@merchant/stores/ThemeStore";
import { formatProductAmount } from "@toolkit/products/product-listing-plan";

type Props = BaseProps & {
  readonly title: string;
  readonly amount?: number | null;
};

const ListingAmountCard: React.FC<Props> = ({
  className,
  style,
  title,
  amount,
}: Props) => {
  const styles = useStylesheet();

  return (
    <Card style={[className, style]}>
      <Layout.FlexColumn
        style={styles.content}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text style={styles.title} weight="semibold">
          {title}
        </Text>
        <Text style={styles.amount} weight="semibold">
          {amount == null ? `--` : formatProductAmount(amount)}
        </Text>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(ListingAmountCard);

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        title: {
          fontSize: 16,
          lineHeight: "24px",
          color: textDark,
          marginBottom: 8,
        },
        amount: {
          fontSize: 34,
          lineHeight: "40px",
          color: textBlack,
        },
      }),
    [textDark, textBlack]
  );
};
