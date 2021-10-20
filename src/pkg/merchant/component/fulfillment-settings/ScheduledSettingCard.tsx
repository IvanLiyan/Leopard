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
import { Text, HorizontalField } from "@ContextLogic/lego";

import { css } from "@toolkit/styling";
import {
  InitialData,
  FulfillmentSettingNames,
  getScheduledFulfillmentSetting,
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
  const scheduledSetting = getScheduledFulfillmentSetting(currentMerchant);
  if (scheduledSetting == null) {
    return null;
  }
  const {
    fulfillmentExtension: { extensionDays },
    vacation,
  } = currentMerchant;

  return (
    <div className={css(styles.root, style, className)}>
      <HorizontalField
        titleAlign="start"
        centerTitleVertically
        titleWidth={200}
        className={css(styles.item)}
        title={() => (
          <Text className={css(styles.itemTitle)} weight="bold">
            Scheduled setting
          </Text>
        )}
      >
        <Text>{FulfillmentSettingNames[scheduledSetting]}</Text>
      </HorizontalField>
      {scheduledSetting == "CNY_EXTENSION_OPTION_1" && extensionDays && (
        <HorizontalField
          titleAlign="start"
          centerTitleVertically
          titleWidth={200}
          className={css(styles.item)}
          title={() => (
            <Text className={css(styles.itemTitle)} weight="bold">
              Number of ext. days
            </Text>
          )}
        >
          <Text>{extensionDays}</Text>
        </HorizontalField>
      )}
      {["VACATION_MODE", "PRIMARY_WAREHOUSE_ON_VACATION"].includes(
        scheduledSetting,
      ) && (
        <>
          {vacation.startDate && (
            <HorizontalField
              titleAlign="start"
              centerTitleVertically
              titleWidth={200}
              className={css(styles.item)}
              title={() => (
                <Text className={css(styles.itemTitle)} weight="bold">
                  Start date
                </Text>
              )}
            >
              <Text>{vacation.startDate.mmddyyyy}</Text>
            </HorizontalField>
          )}
          {vacation.endDate && (
            <HorizontalField
              titleAlign="start"
              centerTitleVertically
              titleWidth={200}
              className={css(styles.item)}
              title={() => (
                <Text className={css(styles.itemTitle)} weight="bold">
                  End date
                </Text>
              )}
            >
              <Text>{vacation.endDate.mmddyyyy}</Text>
            </HorizontalField>
          )}
        </>
      )}
    </div>
  );
};

const useStylesheet = () => {
  const { textBlack, surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 10,
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
    [surfaceLight, textBlack],
  );
};

export default observer(ScheduledSettingCard);
