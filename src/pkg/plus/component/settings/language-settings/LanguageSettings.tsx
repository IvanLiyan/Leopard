/*
 *
 * LanguageSettings.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 08/05/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card, RadioGroup } from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightNormal, weightSemibold } from "@toolkit/fonts";
import locales from "@toolkit/locales";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { Locale } from "@schema/types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly selectedLocale: Locale;
  readonly availableLocales: ReadonlyArray<Locale>;
  readonly onSelected: (locale: Locale) => unknown;
};

const LanguageSettings: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    selectedLocale,
    availableLocales,
    onSelected,
  } = props;
  const styles = useStylesheet(props);

  return (
    <Card className={css(styles.root, className, style)}>
      <div className={css(styles.title)}>
        Please select your preferred language:
      </div>
      <RadioGroup
        style={{ ...styles.grid }}
        itemStyle={{ margin: 0 }}
        selectedValue={selectedLocale}
        onSelected={onSelected}
      >
        {availableLocales.map((locale) => (
          <RadioGroup.Item
            key={locale}
            value={locale}
            text={() => (
              <div className={css(styles.item)}>
                <Flag
                  className={css(styles.flag)}
                  countryCode={locales[locale].country}
                />
                {locales[locale].name}
              </div>
            )}
          />
        ))}
      </RadioGroup>
    </Card>
  );
};

export default observer(LanguageSettings);

const useStylesheet = (props: Props) => {
  const { textBlack } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 24,
        },
        title: {
          fontWeight: weightSemibold,
          color: textBlack,
          marginBottom: 28,
        },
        grid: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(228px, 1fr))",
          gridGap: 56,
          gap: 56,
        },
        item: {
          display: "flex",
          alignItems: "center",
          fontSize: 15,
          fontWeight: weightNormal,
        },
        flag: {
          height: 24,
          margin: "0px 8px",
        },
      }),
    [textBlack]
  );
};
