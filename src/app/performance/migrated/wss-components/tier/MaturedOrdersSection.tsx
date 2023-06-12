import { H6, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
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

const MaturedOrdersSection: React.FC<Props> = ({
  className,
  style,
  merchantState,
  wssDetails,
}) => {
  const styles = useStylesheet();
  const bannerTriggers = useWssBannerTriggers({
    merchantState,
    wssDetails,
  });

  const MaturedOrderStat = (props: {
    readonly warn: boolean;
    readonly count?: number | null;
  }) => {
    const { count, warn } = props;
    const { negativeDarker } = useTheme();
    return (
      <Layout.FlexRow>
        <Text
          weight="semibold"
          style={[styles.statText, warn ? styles.warn : undefined]}
        >
          {count ?? "-"}
        </Text>
        {warn && (
          <Icon
            name="warning"
            size={20}
            color={negativeDarker}
            style={styles.icon}
          />
        )}
      </Layout.FlexRow>
    );
  };

  return (
    <Layout.FlexColumn style={[className, style, styles.root]}>
      <H6>
        {ci18n(
          "Number of matured orders in the past 30 or 90 days",
          "Matured orders",
        )}
      </H6>
      <Layout.FlexRow style={{ gap: 24 }}>
        <Layout.FlexColumn style={{ gap: 8, flexGrow: 1 }}>
          <Text>Orders in 90 days</Text>
          <MaturedOrderStat
            count={wssDetails?.stats?.ninetyDayOrderCount}
            warn={bannerTriggers.INSUFFICIENT_MATURE_ORDER.show}
          />
        </Layout.FlexColumn>
        <Layout.FlexColumn style={{ gap: 8, flexGrow: 1 }}>
          <Text>Orders in 30 days</Text>
          <MaturedOrderStat
            count={wssDetails?.stats?.maturedOrderCount}
            warn={
              bannerTriggers.DID_NOT_UPGRADE_TO_PLATINUM.show ||
              bannerTriggers.NO_LONGER_PLATINUM.show
            }
          />
        </Layout.FlexColumn>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default observer(MaturedOrdersSection);

const useStylesheet = () => {
  const { textBlack, negativeDarker } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 8,
        },
        statText: {
          color: textBlack,
        },
        warn: {
          color: negativeDarker,
        },
        icon: {
          marginLeft: 6,
        },
      }),
    [negativeDarker, textBlack],
  );
};
