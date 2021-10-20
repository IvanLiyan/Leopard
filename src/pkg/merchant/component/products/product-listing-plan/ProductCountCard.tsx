/*
 * ProductCountCard.tsx
 *
 * Created by Jonah Dlin on Mon Aug 16 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { useTheme } from "@stores/ThemeStore";
import { PickedProductCount } from "@toolkit/products/product-listing-plan";
import { css } from "@toolkit/styling";

/* Components */
import { Icon } from "@merchant/component/core";
import ProductCountGraph from "./ProductCountGraph";

type Props = BaseProps & {
  readonly data?: ReadonlyArray<PickedProductCount>;
  readonly isCurrent: boolean;
  readonly monthName?: string;
  readonly yearName?: string;
};

const ProductCountCard: React.FC<Props> = ({
  className,
  style,
  data = [],
  isCurrent,
  monthName,
  yearName,
}: Props) => {
  const styles = useStylesheet();
  const { textDark } = useTheme();

  return (
    <Card style={[className, style]}>
      <Layout.FlexColumn style={styles.content} alignItems="stretch">
        <Layout.FlexRow style={styles.titleRow} alignItems="center">
          <Icon
            className={css(styles.icon)}
            name="barChart"
            color={textDark}
            size={24}
          />
          <Text style={styles.title} weight="semibold">
            {isCurrent
              ? i`Past ${data.length} calendar days`
              : i`${`${monthName} ${yearName}`} active listings`}
          </Text>
        </Layout.FlexRow>
        <ProductCountGraph data={data} />
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(ProductCountCard);

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
        },
        titleRow: {
          marginBottom: 8,
        },
        icon: {
          marginRight: 8,
        },
        title: {
          fontSize: 16,
          lineHeight: "24px",
          color: textDark,
        },
        amount: {
          fontSize: 34,
          lineHeight: "40px",
          color: textBlack,
        },
      }),
    [textDark, textBlack],
  );
};
