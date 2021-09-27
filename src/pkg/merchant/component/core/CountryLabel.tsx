//
//  merchant/component/core/CountryLabel.tsx
//
//  Created by Betty Chen on May 26 2021.
//  Copyright © 2021-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { CountryCode, getCountryName } from "@toolkit/countries";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Layout, Text, Popover } from "@ContextLogic/lego";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

import Flag from "./Flag";

type FlagProps = BaseProps & {
  readonly countryCode: CountryCode;
  readonly badgeStyles?: React.CSSProperties;
};

const CountryLabel = (props: FlagProps) => {
  const { countryCode, className, style, badgeStyles } = props;
  const styles = useStylesheet();

  return (
    <div className={css(className, style)}>
      <Popover popoverContent={getCountryName(countryCode)}>
        <Layout.FlexRow
          className={css(styles.badge, badgeStyles)}
          justifyContent="center"
        >
          <Flag
            countryCode={countryCode}
            aspectRatio="1x1"
            className={css(styles.flag)}
          />
          <Text className={css(styles.text)} weight="semibold">
            {countryCode}
          </Text>
        </Layout.FlexRow>
      </Popover>
    </div>
  );
};

export default CountryLabel;

const useStylesheet = () => {
  const { surfaceLight, textDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        badge: {
          borderRadius: 32,
          backgroundColor: surfaceLight,
          padding: 8,
          flex: 1,
        },
        flag: {
          height: 20,
          width: 20,
          borderRadius: "50%",
        },
        text: {
          color: textDark,
          fontSize: 12,
          marginLeft: 8,
        },
      }),
    [surfaceLight, textDark]
  );
};
