/*
 *
 * ScheduledSettingCard.tsx
 * Merchant Web
 *
 * Created by Sola Ogunsakin on 1/21/2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  Layout,
  Text,
  TextProps,
  HorizontalField as LegoHorizontalField,
  HorizontalFieldProps,
} from "@ContextLogic/lego";

import { css } from "@toolkit/styling";
import {
  InitialData,
  FulfillmentSettingNames,
  getScheduledFulfillmentSettings,
  getFulfillmentExtensionStartDate,
  getFulfillmentExtensionEndDate,
  getOverlap,
  getScheduledVacationSetting,
  getBothAreActive,
} from "@toolkit/fulfillment-settings";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly initialData: InitialData;
};

const ScheduledSettingCard: React.FC<Props> = ({
  style,
  className,
  initialData,
}: Props) => {
  const { currentMerchant } = initialData;
  const styles = useStylesheet();
  const {
    formatted: fulfillmentStartDateFormatted,
    unix: fulfillmentStartDateUnix,
  } = getFulfillmentExtensionStartDate(initialData);
  const { formatted: fulfillmentEndDateFormatted } =
    getFulfillmentExtensionEndDate(initialData);
  const scheduledSettings = getScheduledFulfillmentSettings(currentMerchant);
  const bothAreActive = getBothAreActive(initialData);
  if (scheduledSettings.length == 0 && !bothAreActive) {
    return null;
  }
  const {
    fulfillmentExtension: { extensionDays },
    vacation,
  } = currentMerchant;
  const vacationStartDateFormatted = vacation.startDate?.datetime;
  const vacationStartDateUnix = vacation.startDate?.unix;
  const vacationEndDateFormatted = vacation.endDate?.datetime;

  const vacationIsFirst =
    vacationStartDateUnix != null &&
    vacationStartDateUnix < fulfillmentStartDateUnix;

  const HorizontalField: React.FC<{
    title: TextProps["children"];
    children: HorizontalFieldProps["children"];
  }> = ({ title, children }) => (
    <LegoHorizontalField
      titleAlign="start"
      titleWidth={150}
      style={styles.item}
      title={() => (
        <Text className={css(styles.itemTitle)} weight="bold">
          {title}
        </Text>
      )}
    >
      {children}
    </LegoHorizontalField>
  );

  const FulfillmentExtensionCard: React.FC = () => {
    const showCard =
      scheduledSettings.includes("CNY_EXTENSION") || bothAreActive;

    if (!showCard) {
      return null;
    }

    const overlap = getOverlap(initialData);
    const scheduledSetting = getScheduledVacationSetting(currentMerchant);
    const overlapTitle = scheduledSetting
      ? i`Overlaps with "${FulfillmentSettingNames[scheduledSetting]}"`
      : i`Overlap`; // system invariant: if there is an overlap, there will be a scheduled setting

    return (
      <Layout.FlexColumn style={[styles.card, style, className]}>
        <HorizontalField title={i`Scheduled setting`}>
          <Text>{FulfillmentSettingNames.CNY_EXTENSION}</Text>
        </HorizontalField>
        {extensionDays && (
          <HorizontalField title={i`Number of ext. days`}>
            <Text>{extensionDays}</Text>
          </HorizontalField>
        )}
        {fulfillmentStartDateFormatted && (
          <HorizontalField title={i`Start date`}>
            <Text>{fulfillmentStartDateFormatted}</Text>
          </HorizontalField>
        )}
        {fulfillmentEndDateFormatted && (
          <HorizontalField title={i`End date`}>
            <Text>{fulfillmentEndDateFormatted}</Text>
          </HorizontalField>
        )}
        {overlap != 0 && (
          <HorizontalField title={overlapTitle}>
            <Text>{overlap}</Text>
          </HorizontalField>
        )}
      </Layout.FlexColumn>
    );
  };

  const VacationModeCard: React.FC = () => {
    const scheduledSetting = getScheduledVacationSetting(currentMerchant);

    if (scheduledSetting == null) {
      return null;
    }

    return (
      <Layout.FlexColumn style={[styles.card, style, className]}>
        <HorizontalField title={i`Scheduled setting`}>
          <Text>{FulfillmentSettingNames[scheduledSetting]}</Text>
        </HorizontalField>
        {vacationStartDateFormatted && (
          <HorizontalField title={i`Start date`}>
            <Text>{vacationStartDateFormatted}</Text>
          </HorizontalField>
        )}
        {vacationEndDateFormatted && (
          <HorizontalField title={i`End date`}>
            <Text>{vacationEndDateFormatted}</Text>
          </HorizontalField>
        )}
      </Layout.FlexColumn>
    );
  };

  return (
    <Layout.FlexColumn style={[style, className]}>
      {vacationIsFirst ? (
        <>
          <VacationModeCard />
          <FulfillmentExtensionCard />
        </>
      ) : (
        <>
          <FulfillmentExtensionCard />
          <VacationModeCard />
        </>
      )}
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textBlack, surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          padding: "6px 16px",
          backgroundColor: surfaceLight,
          borderRadius: 4,
        },
        item: {
          margin: "10px 0",
        },
        itemTitle: {
          fontSize: 15,
          color: textBlack,
        },
      }),
    [surfaceLight, textBlack]
  );
};

export default observer(ScheduledSettingCard);
