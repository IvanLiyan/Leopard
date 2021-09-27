/*
 * WarehousePerformance.tsx
 *
 * Created by Jonah Dlin on Mon Feb 22 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import _ from "lodash";

/* Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

/* Lego Components */
import { Alert, Card, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import WarehouseMap from "./WarehouseMap";
import WarehousesList from "./WarehouseList";
import { WarehouseOverviewInitialData } from "@toolkit/products/warehouse-overview";

type Props = BaseProps & {
  readonly initialData: WarehouseOverviewInitialData;
};

const WarehousePerformance: React.FC<Props> = ({
  className,
  style,
  initialData: {
    currentMerchant: { warehouses },
  },
}: Props) => {
  const styles = useStylesheet();

  const withheldLink = zendeskURL("1260801406130");
  const riskOfWithheldLink = zendeskURL("1260801406130");
  const warehousePolicyLink = "/policy#warehouse_fulfillment";

  const showWithheldWarning = _.some(
    warehouses,
    ({ weekStats }) =>
      !(weekStats.length == 0) && weekStats[0].isLateDeliveryRateHigh
  );
  const showRiskOfWithheldWarning = _.some(
    warehouses,
    ({ weekStats }) =>
      !(weekStats.length == 0) && weekStats[0].isLateDeliveryRateAtRisk
  );
  const showWishExpressWithheldWarning = _.some(
    warehouses,
    ({ weekStats }) =>
      !(weekStats.length == 0) &&
      weekStats.some((weekStat) => weekStat.weIsLateDeliveryRateHigh)
  );
  const showWishExpressRiskOfWithheldWarning = _.some(
    warehouses,
    ({ weekStats }) =>
      !(weekStats.length == 0) && weekStats[0].weIsLateDeliveryRateAtRisk
  );

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Text className={css(styles.header)} weight="semibold">
        Warehouse performance
      </Text>
      {showWithheldWarning && (
        <Alert
          className={css(styles.alert)}
          sentiment="negative"
          link={{
            text: i`Learn more`,
            url: withheldLink,
          }}
          text={
            i`Payment for some of your orders are being withheld due to a ` +
            i`high Late Delivery Rate in your warehouse(s).`
          }
        />
      )}
      {showRiskOfWithheldWarning && (
        <Alert
          className={css(styles.alert)}
          sentiment="warning"
          link={{
            text: i`Learn more`,
            url: riskOfWithheldLink,
          }}
          text={
            i`Payment for some of your orders are at risk of being withheld ` +
            i`due to a high Late Delivery Rate in your warehouse(s).`
          }
        />
      )}
      {showWishExpressWithheldWarning && (
        <Alert
          className={css(styles.alert)}
          sentiment="negative"
          link={{
            text: i`Learn more`,
            url: warehousePolicyLink,
          }}
          text={
            i`Wish Express benefits have been revoked for one or more warehouses below ` +
            i`due to a high Wish Express Late Delivery Rate.`
          }
        />
      )}
      {showWishExpressRiskOfWithheldWarning && (
        <Alert
          className={css(styles.alert)}
          sentiment="warning"
          link={{
            text: i`Learn more`,
            url: warehousePolicyLink,
          }}
          text={
            i`Wish Express benefits are at risk of being revoked for one or more warehouses ` +
            i`below due to a high Wish Express Late Delivery Rate.`
          }
        />
      )}
      <Card className={css(styles.card)}>
        <Layout.FlexColumn className={css(styles.mapContainer)}>
          <Text className={css(styles.mapHeader)}>
            On this interactive map, view your warehouse location(s) and
            details.
          </Text>
          <WarehouseMap className={css(styles.map)} warehouses={warehouses} />
          <div className={css(styles.mapDivider)} />
        </Layout.FlexColumn>
        <WarehousesList warehouses={warehouses} />
      </Card>
    </Layout.FlexColumn>
  );
};

export default observer(WarehousePerformance);

const useStylesheet = () => {
  const { textBlack, textDark, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        header: {
          fontSize: 20,
          lineHeight: 1.5,
          marginBottom: 16,
          color: textBlack,
        },
        text: {
          fontSize: 20,
          lineHeight: 1.5,
          marginBottom: 16,
        },
        alert: {
          marginBottom: 16,
        },
        card: {
          display: "flex",
          flexDirection: "column",
        },
        mapContainer: {
          padding: 24,
        },
        mapHeader: {
          color: textDark,
          fontSize: 16,
          lineHeight: 1.5,
        },
        mapLastUpdated: {
          color: textDark,
          fontSize: 12,
          lineHeight: "16px",
        },
        map: {
          margin: "42px 0px",
        },
        mapDivider: {
          boxSizing: "border-box",
          width: "100%",
          borderBottom: `1px solid ${borderPrimary}`,
        },
      }),
    [textBlack, textDark, borderPrimary]
  );
};
