import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Flag } from "@merchant/component/core";

/* Lego Toolkit */
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencyCodeDisplayProps = BaseProps & {
  readonly currencyCode: string;
};

export type ConversionStatus = "COMPLETED" | "CANCELLED" | "PENDING";

export const CurrencyCodeDisplay = (props: CurrencyCodeDisplayProps) => {
  const styles = useStylesheet();
  const { currencyCode } = props;

  // This is required to display the flag and the mapping
  // is non-obvious in cases. I do not want to make this a core function
  // because of that
  const currencyToCountry = {
    EUR: "EU",
    USD: "US",
    CNY: "CN",
    GBP: "GB",
    BRL: "BR",
    MXN: "MX",
    JPY: "JP",
    CAD: "CA",
    AUD: "AU",
  };

  const countryCode = (currencyToCountry as any)[currencyCode];

  // Reduce confusion for translators
  const currencyCodeAndSymbol = `${currencyCode}(${getCurrencySymbol(
    currencyCode,
  )})`;

  return (
    <>
      {countryCode && (
        <span>
          <Flag countryCode={countryCode} className={css(styles.imageStyle)} />
          <span className={css(styles.currencyCode)}>
            {currencyCodeAndSymbol}
          </span>
        </span>
      )}
    </>
  );
};
const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        currencyCode: {
          marginLeft: 6,
        },
        imageStyle: {
          width: 24,
          height: 14,
          marginBottom: 2,
        },
      }),
    [],
  );
