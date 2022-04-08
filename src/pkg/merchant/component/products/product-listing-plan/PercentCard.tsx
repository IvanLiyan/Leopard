/*
 * PercentCard.tsx
 *
 * Created by Jonah Dlin on Thu Aug 05 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, Layout, SecondaryButton, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import {
  formatPlpPercentage,
  formatProductAmount,
} from "@toolkit/products/product-listing-plan";
import { IconName } from "@ContextLogic/zeus";
import Icon from "@merchant/component/core/Icon";

type Props = BaseProps & {
  readonly title: string;
  readonly icon?: IconName;
  readonly amount?: number | null;
  readonly total?: number | null;
  readonly buttonText?: string;
  readonly buttonHref?: string;
};

const PercentCard: React.FC<Props> = ({
  className,
  style,
  children,
  title,
  icon,
  amount,
  total,
  buttonText,
  buttonHref,
}: Props) => {
  const styles = useStylesheet();

  const { textDark } = useTheme();

  const rawPercent =
    amount != null && total != null ? (100 * amount) / total : undefined;
  const percentString =
    rawPercent == null ? "--" : `${formatPlpPercentage(rawPercent)}%`;

  return (
    <Card
      style={[className, style]}
      contentContainerStyle={{ display: "flex" }}
    >
      <Layout.FlexColumn
        style={styles.content}
        justifyContent="space-between"
        alignItems="stretch"
      >
        <Layout.FlexColumn>
          <Layout.FlexRow style={styles.headerRow} alignItems="flex-start">
            {icon != null && (
              <Icon
                name={icon}
                size={24}
                color={textDark}
                className={css(styles.icon)}
              />
            )}
            <Text style={styles.title} weight="semibold">
              {title}
            </Text>
          </Layout.FlexRow>
          <Layout.FlexRow style={styles.numbersRow}>
            <Text weight="semibold" style={styles.numbers}>
              {percentString}
            </Text>
            {rawPercent != null && (
              <Text style={styles.numbers}>
                {amount == null || total == null
                  ? "--"
                  : `${formatProductAmount(amount)}/${formatProductAmount(
                      total
                    )}`}
              </Text>
            )}
          </Layout.FlexRow>
          {children}
        </Layout.FlexColumn>
        {buttonText != null && (
          <SecondaryButton
            style={css(styles.button)}
            href={buttonHref}
            padding="10px 24px"
          >
            {buttonText}
          </SecondaryButton>
        )}
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(PercentCard);

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(() => {
    return StyleSheet.create({
      content: {
        padding: "24px 48px",
      },
      headerRow: {
        marginBottom: 24,
      },
      icon: {
        marginRight: 8,
      },
      title: {
        fontSize: 16,
        lineHeight: "24px",
        color: textDark,
        flex: 1,
      },
      button: {
        alignSelf: "flex-end",
        marginTop: 24,
        height: 40,
        boxSizing: "border-box",
      },
      numbers: {
        fontSize: 34,
        lineHeight: "40px",
        color: textBlack,
        ":not(:last-child)": {
          marginRight: 32,
        },
      },
      numbersRow: {
        marginBottom: 16,
      },
    });
  }, [textDark, textBlack]);
};
