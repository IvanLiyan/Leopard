/*
 *
 * ProductCsvHistoryContainer.tsx
 * Merchant Plus
 *
 * Created by Kay Wan on 01/28/2024
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Layout, Text } from "@ContextLogic/lego";

/* Merchant Plus Components */
import PageRoot from "@core/components/PageRoot";
import PageGuide from "@core/components/PageGuide";
import ProductCsvHistory from "./ProductCsvHistory";
import PlusWelcomeHeader from "@core/components/PlusWelcomeHeader";
import { MerchantSchema } from "@schema";

export type ProductCsvHistoryInitialData = {
  readonly currentMerchant?: Pick<MerchantSchema, "showFeedProcessing"> | null;
};

const ProductCsvHistoryContainer: React.FC = () => {
  const styles = useStylesheet();

  return (
    <PageRoot>
      <PlusWelcomeHeader title={i`Product Listing Feed Status`} veryRelaxed>
        <Layout.FlexColumn alignItems="flex-start">
          <Text style={styles.subtitle}>
            {i`View the status of your Product CSV file uploads. `}
            {i`Please note it may take up to 48 hours for your products to appear on Wish. `}
            {i`History will expire in 90 days.`}
          </Text>
        </Layout.FlexColumn>
      </PlusWelcomeHeader>
      <PageGuide veryRelaxed>
        <Layout.FlexColumn alignItems="stretch">
          <ProductCsvHistory />
        </Layout.FlexColumn>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        subtitle: {
          maxWidth: 640,
          marginTop: 8,
        },
        button: {
          marginTop: 12,
        },
        squareButton: {
          height: 40,
          borderRadius: 4,
          marginTop: 12,
        },
      }),
    [],
  );

export default observer(ProductCsvHistoryContainer);
