/*
 * WarehouseSettingsSection.tsx
 *
 * Created by Betty Chen on Mon May 26 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Layout, Card, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Illustration from "@merchant/component/core/Illustration";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

/* Relative Imports */
import WarehouseSettings from "./WarehouseSettings";

/* Model */
import { WarehouseOverviewInitialData } from "@toolkit/products/warehouse-overview";

type Props = BaseProps & {
  readonly initialData: WarehouseOverviewInitialData;
};

const WarehouseSettingsSection: React.FC<Props> = ({
  className,
  style,
  initialData: {
    currentMerchant: {
      isCnMerchant,
      warehouses,
      sellerVerification: { hasCompleted: sellerVerificationComplete },
    },
  },
}: Props) => {
  const styles = useStylesheet();
  const canEditPrimaryWarehouse = !isCnMerchant && sellerVerificationComplete;

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Text className={css(styles.header)} weight="semibold">
        Warehouse Settings
      </Text>
      <Card contentContainerStyle={css(styles.card)}>
        <Layout.FlexRow justifyContent="space-between" alignItems="flex-start">
          <Illustration
            name="palaceBlueBulb"
            alt="palaceBlueBulb"
            className={css(styles.illustration)}
          />
          <Layout.FlexColumn>
            <Text weight="semibold">VAT Collection</Text>
            <Text>
              For Secondary Warehouses, valid warehouse addresses are necessary
              to ensure proper VAT collection and remittance of EU-bound orders.
              Primary Warehouse addresses are not editable and are based on your
              business address.
            </Text>
          </Layout.FlexColumn>
        </Layout.FlexRow>
      </Card>
      <WarehouseSettings
        warehouses={warehouses}
        canEditPrimaryWarehouse={canEditPrimaryWarehouse}
        className={css(styles.warehouseSettings)}
      />
    </Layout.FlexColumn>
  );
};

export default observer(WarehouseSettingsSection);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        header: {
          fontSize: 20,
          lineHeight: 1.5,
          marginBottom: 16,
          color: textBlack,
        },
        card: {
          padding: 24,
          color: textBlack,
        },
        illustration: {
          width: 24,
          height: 24,
          marginRight: 16,
          "@media (max-width: 900px)": {
            display: "none",
          },
        },
        warehouseSettings: {
          marginTop: 16,
        },
      }),
    [textBlack]
  );
};
