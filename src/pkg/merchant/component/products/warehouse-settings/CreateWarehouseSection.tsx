/*
 * CreateWarehouseSection.tsx
 *
 * Created by Betty Chen on Mon May 7 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { Layout, Card, Text, Button } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Illustration } from "@merchant/component/core";

/* Relative Imports */
import WarehouseDetails from "./create/WarehouseDetails";
import ShippingSettings from "./create/ShippingSettings";

/* Model */
import WarehouseSettingsState from "@merchant/model/products/WarehouseSettingsState";
import { WarehouseSettingsInitialData } from "@toolkit/products/warehouse-settings";

type Props = BaseProps & {
  readonly state: WarehouseSettingsState;
  readonly initialData: WarehouseSettingsInitialData;
};

const CreateWarehouseSection: React.FC<Props> = ({
  className,
  style,
  state,
  initialData,
}: Props) => {
  const styles = useStylesheet();

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <WarehouseDetails
        state={state}
        className={css(styles.warehouseDetails)}
      />
      <ShippingSettings
        state={state}
        initialData={initialData}
        className={css(styles.shippingSettings)}
      />
      <Card contentContainerStyle={css(styles.card)}>
        <Layout.FlexRow justifyContent="space-between">
          <Layout.FlexRow>
            <Illustration
              name="palaceBlueBulb"
              alt="palaceBlueBulb"
              className={css(styles.illustration)}
            />
            <Text>
              Looking to ship to more countries/regions from this warehouse?
              Please enable these countries/regions in your account level
              Shipping Settings first.
            </Text>
          </Layout.FlexRow>
          <Button href="/shipping-settings" openInNewTab>
            Edit Shipping Settings
          </Button>
        </Layout.FlexRow>
      </Card>
    </Layout.FlexColumn>
  );
};

export default observer(CreateWarehouseSection);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        warehouseDetails: {
          marginBottom: 24,
        },
        shippingSettings: {
          marginBottom: 16,
        },
        card: {
          padding: 34,
        },
        illustration: {
          width: 24,
          height: 24,
          marginRight: 16,
          "@media (max-width: 900px)": {
            display: "none",
          },
        },
      }),
    []
  );
};
