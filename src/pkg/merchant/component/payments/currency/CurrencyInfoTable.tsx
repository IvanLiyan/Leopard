/* eslint-disable local-rules/unnecessary-list-usage */
// Used for a bullet.

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { ThemedLabel } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Relative Imports */
import { CurrencyCodeDisplay, ConversionStatus } from "./CurrencyCodeDisplay";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencyInfoTableProps = BaseProps & {
  readonly showConversion: boolean;
  readonly currentCurrency: string;
  readonly pendingCurrency: string | null | undefined;
  readonly conversionStatus: ConversionStatus;
  readonly endDate: string;
  readonly conversionRate: number;
  readonly canCancel: boolean;
  readonly cancelConversion: () => Promise<void> | null | undefined;
};

export const CurrencyInfoTable = (props: CurrencyInfoTableProps) => {
  const styles = useStylesheet();
  const {
    showConversion,
    pendingCurrency,
    conversionStatus,
    endDate,
    canCancel,
    conversionRate,
    cancelConversion,
  } = props;

  const conversionStatusDisplay = (
    <>
      {conversionStatus === "PENDING" && (
        <ThemedLabel className={css(styles.statusTag)} theme={"LightGrey"}>
          Pending
        </ThemedLabel>
      )}
      {conversionStatus === "COMPLETED" && (
        <ThemedLabel className={css(styles.statusTag)} theme={"LighterCyan"}>
          Completed
        </ThemedLabel>
      )}
    </>
  );

  return (
    <>
      <table className={css(styles.root)}>
        <tbody>
          {showConversion && pendingCurrency && (
            <>
              <tr>
                <td className={css(styles.infoKey)}>
                  Local Currency Code conversion
                </td>
                <td className={css(styles.infoValue)}>
                  <CurrencyCodeDisplay currencyCode={"USD"} />
                  <Icon name="arrowRight" style={css(styles.arrowStyle)} />
                  <CurrencyCodeDisplay currencyCode={pendingCurrency} />
                  {canCancel && (
                    <ul>
                      <li className={css(styles.cancelLink)}>
                        <Link onClick={cancelConversion}>
                          Cancel conversion
                        </Link>
                      </li>
                    </ul>
                  )}
                </td>
              </tr>
            </>
          )}
          {showConversion && (
            <>
              <tr>
                <td className={css(styles.infoKey)}>Conversion Status</td>
                <td className={css(styles.infoValue)}>
                  {conversionStatusDisplay}
                </td>
              </tr>
              <tr>
                <td className={css(styles.infoKey)}>Conversion Date</td>
                <td className={css(styles.infoValue)}> {endDate} </td>
              </tr>
              <tr>
                <td className={css(styles.infoKey)}>Conversion Rate</td>
                <td className={css(styles.infoValue)}> {conversionRate} </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark, borderPrimary, pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        infoKey: {
          color: textBlack,
          fontWeight: fonts.weightMedium,
          fontSize: 16,
          paddingRight: 20,
          paddingBottom: 10,
          paddingTop: 10,
        },
        infoValue: {
          fontWeight: fonts.weightMedium,
          fontSize: 16,
          color: textDark,
          display: "flex",
          flexDirection: "row",
          paddingBottom: 10,
          paddingTop: 10,
        },
        arrowStyle: {
          width: 12,
          height: 16,
          padding: "2px 6px",
        },
        cancelLink: {
          fontSize: 16,
          marginLeft: 5,
        },
        displayConversionModalLink: {
          marginLeft: 5,
        },
        currentCurrencySeparator: {
          borderTop: `solid 1px ${borderPrimary}`,
          padding: "24px 0px",
          width: "100%",
        },
        statusTag: {
          borderRadius: 16,
          fontSize: 14,
          width: 102,
          height: 24,
        },
        footerText: {
          fontSize: 14,
          color: textDark,
          fontWeight: fonts.weightMedium,
          marginLeft: 16,
          paddingLeft: 16,
          paddingTop: 20,
          marginBottom: 24,
          paddingBottom: 20,
          marginRight: 32,
          paddingRight: 72,
          backgroundColor: pageBackground,
        },
      }),
    [textBlack, textDark, borderPrimary, pageBackground]
  );
};
