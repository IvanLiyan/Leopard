import { Card, H5, Info, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import { CommerceMerchantState } from "@schema";
import {
  PickedMerchantWssDetails,
  useWssBannerTriggers,
} from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly merchantState: CommerceMerchantState;
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const OverviewMaturedOrders: React.FC<Props> = (props: Props) => {
  const { className, style, merchantState, wssDetails } = props;
  const styles = useStylesheet();
  const { negativeDarker, surfaceDarkest } = useTheme();

  const bannerTriggers = useWssBannerTriggers({
    merchantState,
    wssDetails,
  });

  const renderMaturedOrderStat = (orderStat: {
    count?: number | null;
    period: number;
    description: string;
    warn?: boolean;
  }) => {
    return (
      <Layout.FlexRow style={styles.statRow}>
        <Layout.FlexColumn style={styles.stat}>
          <Layout.FlexRow>
            <Text
              weight="semibold"
              style={[styles.count, orderStat.warn ? styles.warn : undefined]}
            >
              {orderStat.count ?? "-"}
            </Text>
            {orderStat.warn && (
              <Icon
                name="warning"
                size={20}
                color={negativeDarker}
                style={styles.icon}
              />
            )}
          </Layout.FlexRow>
          <Text weight="semibold" style={styles.period}>
            in {orderStat.period} days
          </Text>
        </Layout.FlexColumn>
        <Text weight="regular" style={styles.description}>
          {orderStat.description}
        </Text>
      </Layout.FlexRow>
    );
  };

  return (
    <Card
      style={[styles.section, className, style]}
      contentContainerStyle={{ ...styles.cardContent }}
    >
      <Layout.FlexColumn>
        <Layout.FlexRow style={styles.header}>
          <Icon name="shoppingCart" size={24} style={styles.headerIcon} />
          <H5>Matured orders</H5>
          <Info
            text={
              i`These are orders where Wish has determined enough time has passed for an ` +
              i`accurate assessment of fulfillment status and customer satisfaction.`
            }
            size={20}
            sentiment="info"
            color={surfaceDarkest}
            style={styles.icon}
            openContentLinksInNewTab
          />
        </Layout.FlexRow>
        <Layout.FlexColumn style={styles.body} justifyContent="center">
          {renderMaturedOrderStat({
            count: wssDetails?.stats?.ninetyDayOrderCount,
            period: 90,
            description: i`${50} orders in ${90} days required for tier update`,
            warn: bannerTriggers.INSUFFICIENT_MATURE_ORDER.show,
          })}
          {renderMaturedOrderStat({
            count: wssDetails?.stats?.maturedOrderCount,
            period: 30,
            description: i`${100} orders in ${30} days required for Platinum tier`,
            warn:
              bannerTriggers.DID_NOT_UPGRADE_TO_PLATINUM.show ||
              bannerTriggers.NO_LONGER_PLATINUM.show,
          })}
        </Layout.FlexColumn>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(OverviewMaturedOrders);

const useStylesheet = () => {
  const { negativeDarker, surfaceDarkest, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        section: {
          flexGrow: 1,
        },
        cardContent: {
          padding: 16,
        },
        header: { marginBottom: 16 },
        body: {
          marginTop: 16,
          gap: 32,
        },
        headerIcon: {
          marginRight: 8,
        },
        icon: {
          marginLeft: 6,
        },
        statRow: {
          gap: 16,
          marginLeft: 16,
        },
        stat: {
          flexShrink: 0,
        },
        count: {
          fontSize: 28,
          color: surfaceDarkest,
        },
        period: {
          fontSize: 14,
          color: surfaceDarkest,
        },
        description: {
          fontSize: 14,
          color: textDark,
        },
        warn: {
          color: negativeDarker,
        },
      }),
    [negativeDarker, surfaceDarkest, textDark],
  );
};
