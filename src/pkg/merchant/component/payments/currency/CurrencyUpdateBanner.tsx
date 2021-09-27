// Delibrately formatting USD cases

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { HeroBanner } from "@ContextLogic/lego";
import { SimpleBannerItem } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { moneyIcon } from "@assets/illustrations";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencyUpdateBannerProps = BaseProps & {
  readonly requestConversion: () => Promise<void> | null | undefined;
  readonly allowedMigration: string;
  readonly isPayPal: boolean;
  readonly isPayoneer: boolean;
};

export const CurrencyUpdateBanner = (props: CurrencyUpdateBannerProps) => {
  const { primary, primaryLight } = useTheme();
  const styles = useStylesheet();

  const { requestConversion, isPayPal, isPayoneer, allowedMigration } = props;

  const currencyCodeAndSymbol = `${allowedMigration} (${getCurrencySymbol(
    allowedMigration
  )})`;

  const title = (
    <span className={css(styles.bannerTitle)}>
      Convert your Local Currency Code to {currencyCodeAndSymbol}
    </span>
  );

  const body = (
    <span className={css(styles.bannerText)}>
      <Markdown
        text={
          allowedMigration == "BRL"
            ? i`You now have the option to conduct business in
              ${currencyCodeAndSymbol} by converting your Local Currency
              Code from USD ($) to ${currencyCodeAndSymbol}. Upon completing 
              currency conversion, product and shipping prices may be edited 
              in ${currencyCodeAndSymbol} while payments will still be 
              disbursed in USD ($).`
            : i`You now have the option to conduct business in 
              ${currencyCodeAndSymbol} by converting your Local Currency
              Code. Once you convert your Local Currency Code to 
              ${currencyCodeAndSymbol}, your product prices, shipping prices,  
              and payments will be reflected in ${currencyCodeAndSymbol}.`
        }
      />
    </span>
  );
  const popoverContent = () => (
    <div className={css(styles.popOver)}>
      <Markdown
        text={
          i`**PayPal** is currently the **only** payment provider ` +
          i`that supports receiving payments in a different currency ` +
          i`code. Please switch your payment provider to PayPal to convert ` +
          i`your store's local currency code to ${currencyCodeAndSymbol}.`
        }
      />
    </div>
  );
  const hasProperProvider =
    isPayPal || (isPayoneer && allowedMigration == "BRL");
  return (
    <HeroBanner autoScrollIntervalSecs={0} className={css(styles.banner)}>
      <HeroBanner.Item background={primaryLight} id="page1">
        <SimpleBannerItem
          title={() => title}
          body={() => body}
          bannerImg={moneyIcon}
          cta={{
            text: i`Get Started`,
            onClick: requestConversion,
            isDisabled: !hasProperProvider,
            popoverContent: !hasProperProvider ? popoverContent : null,
            popoverPosition: "top",
            style: {
              backgroundColor: primary,
            },
          }}
        />
      </HeroBanner.Item>
    </HeroBanner>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        popOver: {
          maxWidth: 400,
          marginLeft: 10,
          marginRight: 10,
          marginTop: 20,
          marginBottom: 20,
        },
        bannerTitle: {
          color: textBlack,
          fontWeight: fonts.weightBold,
          fontSize: 20,
        },
        banner: {
          paddingLeft: 24,
        },
        bannerText: {
          color: textDark,
          fontWeight: fonts.weightMedium,
          fontSize: 16,
        },
      }),
    [textBlack, textDark]
  );
};
