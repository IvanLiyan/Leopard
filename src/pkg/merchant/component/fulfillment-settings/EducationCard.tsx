/*
 *
 * EducationCard.tsx
 * Merchant Web
 *
 * Created by Sola Ogunsakin on 1/21/2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { Text, Markdown } from "@ContextLogic/lego";

import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  InitialData,
  FulfillmentSettingNames,
  fulfillmentSettingDescription,
  getAvailableFulfillmentSettings,
} from "@toolkit/fulfillment-settings";
import ProductImpressionMeter from "./ProductImpressionMeter";

type Props = BaseProps & {
  readonly initialData: InitialData;
};

const EducationCard: React.FC<Props> = ({
  initialData,
  style,
  className,
}: Props) => {
  const { currentMerchant } = initialData;
  const styles = useStylesheet();
  const options = getAvailableFulfillmentSettings(currentMerchant);
  return (
    <div className={css(styles.root, style, className)}>
      {options.map((option) => (
        <div className={css(styles.group)} key={option}>
          <Text className={css(styles.groupTitle)} weight="semibold">
            {FulfillmentSettingNames[option]}
          </Text>
          <Markdown
            text={fulfillmentSettingDescription(initialData)[option]}
            className={css(styles.groupBody)}
            openLinksInNewTab
          />
          <ProductImpressionMeter
            currentSetting={option}
            height={7}
            className={css(styles.groupProgressBar)}
            backgroundColor="white"
          />
        </div>
      ))}
    </div>
  );
};

const useStylesheet = () => {
  const { surfaceLight, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
          backgroundColor: surfaceLight,
          borderRadius: 4,
        },
        group: {
          margin: "10px 0",
        },
        groupTitle: {
          margin: "7px 0",
          fontSize: 14,
          color: textBlack,
        },
        groupBody: {
          margin: "5px 0",
        },
        groupProgressBar: {
          margin: "10px 0",
        },
      }),
    [surfaceLight, textBlack]
  );
};

export default observer(EducationCard);
