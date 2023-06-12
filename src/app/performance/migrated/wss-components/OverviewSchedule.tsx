import { Card, H5, Layout, Text } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import { CommerceMerchantState } from "@schema";
import { formatDatetimeLocalized } from "@core/toolkit/datetime";
import {
  isBanned,
  PickedMerchantWssDetails,
} from "@performance/migrated/toolkit/stats";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import moment from "moment/moment";
import React, { useMemo } from "react";

type Props = BaseProps & {
  readonly merchantState: CommerceMerchantState;
  readonly wssDetails?: PickedMerchantWssDetails | null;
};

const OverviewSchedule: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { className, style, wssDetails, merchantState } = props;

  return (
    <Card
      style={[styles.section, className, style]}
      contentContainerStyle={{ ...styles.cardContent }}
    >
      <Layout.FlexColumn>
        <Layout.FlexRow style={styles.header}>
          <Icon name="calendar" size={24} style={styles.icon} />
          <H5>Update Schedule</H5>
        </Layout.FlexRow>
        <Layout.FlexColumn style={styles.body}>
          <Layout.FlexColumn style={styles.scheduleItem}>
            <Text style={styles.subtitle} weight="regular">
              Last tier update:
            </Text>
            <Text style={styles.date} weight="semibold">
              {wssDetails?.lastTierUpdateDate && !isBanned(merchantState)
                ? formatDatetimeLocalized(
                    moment.unix(wssDetails.lastTierUpdateDate.unix),
                    "LL",
                  )
                : "-"}
            </Text>
          </Layout.FlexColumn>
          <Layout.FlexColumn style={styles.scheduleItem}>
            <Text style={styles.subtitle} weight="regular">
              Next scheduled tier update:
            </Text>
            <Text style={styles.date} weight="semibold">
              {wssDetails?.nextMonthlyTierUpdateDate && !isBanned(merchantState)
                ? formatDatetimeLocalized(
                    moment.unix(wssDetails.nextMonthlyTierUpdateDate.unix),
                    "LL",
                  )
                : "-"}
            </Text>
          </Layout.FlexColumn>
        </Layout.FlexColumn>
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(OverviewSchedule);

const useStylesheet = () => {
  const { textDark, surfaceDarkest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        section: {
          flexGrow: 1,
          flexShrink: 0,
        },
        cardContent: {
          padding: 16,
        },
        header: { marginBottom: 16 },
        body: {},
        scheduleItem: {
          marginTop: 16,
          marginBottom: 16,
        },
        icon: {
          marginRight: 8,
        },
        subtitle: {
          fontSize: 14,
          color: textDark,
          marginBottom: 8,
        },
        date: {
          fontSize: 14,
          color: surfaceDarkest,
        },
      }),
    [textDark, surfaceDarkest],
  );
};
