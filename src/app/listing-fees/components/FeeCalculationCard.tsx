import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Card, Layout, Text } from "@ContextLogic/lego";
import { useTierThemes } from "@performance/migrated/toolkit/stats";
import { useTheme } from "@core/stores/ThemeStore";
/* Types */
import { WssMerchantLevelType } from "@schema";
/* Merchant Components */
import Illustration from "@core/components/Illustration";
import { formatCurrency } from "@core/toolkit/currency";

type FeeCalculationProps = {
  readonly freeThreshold: number;
  readonly feeAmount: number;
  readonly feeCurrency: string;
  readonly level: WssMerchantLevelType;
};

const FeeCalculationCard: React.FC<FeeCalculationProps> = (props) => {
  const { freeThreshold, feeAmount, feeCurrency, level } = props;
  const styles = useStylesheet();
  const tierThemes = useTierThemes();

  return (
    <Card style={styles.card}>
      <Layout.FlexColumn>
        <Layout.FlexRow alignItems="center" style={{ marginBottom: 24 }}>
          <Illustration
            name={tierThemes(level).icon}
            alt={tierThemes(level).icon}
            style={styles.badgeIcon}
          />
          <Text style={styles.badgeTitle} weight="bold">
            {tierThemes(level).title}
          </Text>
        </Layout.FlexRow>
        <Text style={styles.badgeText}>Free threshold</Text>
        <Text style={styles.badgeNumber} weight="semibold">
          {freeThreshold}
        </Text>
        <Text style={styles.marginTop}>Fee amount per PID above threshold</Text>
        <Text style={styles.badgeNumber} weight="semibold">
          {formatCurrency(feeAmount, feeCurrency)}
        </Text>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(FeeCalculationCard);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          fontSize: 28,
          color: textBlack,
          padding: 24,
          borderRadius: 4,
          border: "1px solid #DCE5E9",
        },
        badgeIcon: {
          height: 48,
          marginRight: 4,
        },
        badgeTitle: {
          fontSize: 16,
          color: textBlack,
        },
        badgeText: {
          fontSize: 16,
          color: textBlack,
          fontWeight: 400,
        },
        badgeNumber: {
          fontSize: 16,
          color: textBlack,
          fontWeight: 500,
        },
        marginTop: {
          fontSize: 16,
          color: textBlack,
          fontWeight: 400,
          marginTop: 16,
        },
      }),
    [textBlack],
  );
};
