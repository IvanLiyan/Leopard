/*
 * WpsCard.tsx
 *
 * Created by Jonah Dlin on Tue Feb 16 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import BaseRightCard from "./BaseRightCard";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  Banner,
  Layout,
  PrimaryButton,
  Text,
  ThemedLabel,
} from "@ContextLogic/lego";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly id: string;
  readonly hasCreatedWpsLabel?: boolean;
  readonly isConfirmedShipped?: boolean;
};

const WpsCard: React.FC<Props> = ({
  className,
  style,
  id,
  hasCreatedWpsLabel,
  isConfirmedShipped,
}: Props) => {
  const styles = useStylesheet();

  return (
    <BaseRightCard
      className={css(className, style)}
      title={() => (
        <Layout.FlexRow>
          <Text weight="bold">Wish Parcel</Text>
          {hasCreatedWpsLabel && (
            <ThemedLabel
              className={css(styles.purchasedLabel)}
              theme="DarkPalaceBlue"
            >
              Purchased
            </ThemedLabel>
          )}
        </Layout.FlexRow>
      )}
    >
      <Layout.FlexColumn className={css(styles.content)}>
        {hasCreatedWpsLabel ? (
          <Banner
            sentiment="info"
            iconVerticalAlignment="top"
            text={
              <Text className={css(styles.bannerDescription)}>
                Previously, you have purchased a Wish Parcel shipping label for
                this order. When you edit the shipping details for this order,
                we will automatically cancel your previously-purchased, unused
                Wish Parcel shipping label and refund its cost to your account.
              </Text>
            }
          />
        ) : (
          <Text className={css(styles.description)}>
            Quickly create shipping labels to fulfill your orders all within the
            Wish platform. You may access a lower shipping rate.
          </Text>
        )}
        {!isConfirmedShipped && (
          <PrimaryButton
            className={css(styles.button)}
            href={`/shipping-label/create/${id}`}
          >
            {hasCreatedWpsLabel
              ? i`Edit shipping label`
              : i`Create shipping label`}
          </PrimaryButton>
        )}
      </Layout.FlexColumn>
    </BaseRightCard>
  );
};

const useStylesheet = () => {
  const { textDark, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          padding: 24,
        },
        description: {
          fontSize: 16,
          lineHeight: 1.5,
          color: textDark,
        },
        bannerDescription: {
          fontSize: 14,
          lineHeight: 1.5,
          color: textBlack,
        },
        button: {
          marginTop: 12,
          height: 40,
          boxSizing: "border-box",
          maxWidth: 184,
        },
        purchasedLabel: {
          marginLeft: 8,
        },
      }),
    [textDark, textBlack]
  );
};

export default observer(WpsCard);
