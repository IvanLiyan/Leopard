/*
 *
 * ColumnMappingCard.tsx
 * Merchant Plus
 *
 * Created by Jonah Dlin on 9/28/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import BulkCard from "@plus/component/orders/bulk-fulfill/BulkCard";
import ColumnMatchingCard, { ColumnCategory } from "./ColumnMatchingCard";
import BulkAddEditProductState from "@plus/model/BulkAddEditProductV2State";
import { Layout, Markdown, Text } from "@ContextLogic/lego";
import { zendeskURL } from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly state: BulkAddEditProductState;
};

export type SelectionUpdate = {
  readonly index: number;
  readonly selectionId?: string;
};

const ColumnMappingCard: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const { isStoreMerchant } = state.initialData.currentMerchant;

  const styles = useStylesheet();
  const wishAttributesLink = isStoreMerchant
    ? "https://localfaq.wish.com/hc/en-us/articles/205211817-What-Attributes-Do-I-Need-To-Include-When-Adding-Products-"
    : zendeskURL("205211817");

  return (
    <BulkCard
      className={css(className, style)}
      title={i`Column mapping`}
      contentContainerStyle={css(styles.container)}
    >
      {state.openCards.has("COLUMN_MAPPING") ? (
        <>
          <Markdown
            className={css(styles.description)}
            text={
              i`Check the mapping below to make sure your column headers ` +
              i`match [Wish attributes](${wishAttributesLink}).`
            }
          />
          <Layout.FlexColumn>
            <ColumnMatchingCard
              className={css(styles.matchingCard)}
              state={state}
              type={ColumnCategory.required}
            />
            <ColumnMatchingCard
              className={css(styles.matchingCard)}
              state={state}
              type={ColumnCategory.optional}
            />
          </Layout.FlexColumn>
        </>
      ) : (
        <Text className={css(styles.closedCardText)}>
          Map your column headers to Wish attributes after uploading a CSV file.
        </Text>
      )}
    </BulkCard>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          padding: 24,
          display: "flex",
          flexDirection: "column",
        },
        closedCardText: {
          color: textDark,
          fontSize: 14,
          lineHeight: "20px",
        },
        description: {
          fontSize: 14,
          lineHeight: "20px",
          marginBottom: 24,
        },
        matchingCard: {
          ":not(:last-child)": {
            marginBottom: 40,
          },
        },
      }),
    [textDark]
  );
};

export default observer(ColumnMappingCard);
