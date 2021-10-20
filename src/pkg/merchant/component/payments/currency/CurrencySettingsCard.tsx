import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import moment from "moment/moment";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { Card, Markdown } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Relative Imports */
import { CurrencyUpdateBanner } from "./CurrencyUpdateBanner";
import { CurrencyUpdateProgressBanner } from "./CurrencyUpdateProgressBanner";
import { CurrencyInfoTable } from "./CurrencyInfoTable";

import CurrencyConversionDateSelectionModal from "./CurrencyConversionDateSelectionModal";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CurrencyCodeDisplay, ConversionStatus } from "./CurrencyCodeDisplay";
import { formatDatetimeLocalized } from "@toolkit/datetime";

type CurrencySettingsCardProps = BaseProps & {
  readonly allowedMigration: string | null | undefined;
  readonly pendingCurrency: string | null | undefined;
  readonly currentCurrency: string;
  readonly startDate: Date | null | undefined;
  readonly endDate: Date | null | undefined;
  readonly conversionRate: number | null | undefined;
  readonly conversionStatus: ConversionStatus;
  readonly requestConversion: (
    requestedEndDate: Date,
  ) => Promise<void> | null | undefined;
  readonly cancelConversion: () => Promise<void> | null | undefined;
  readonly isPayPal: boolean;
  readonly isPayoneer: boolean;
};

export const CurrencySettingsCard = (props: CurrencySettingsCardProps) => {
  const styles = useStylesheet();
  const {
    allowedMigration,
    pendingCurrency,
    currentCurrency,
    startDate,
    endDate,
    conversionRate,
    conversionStatus,
    cancelConversion,
    requestConversion,
    isPayPal,
    isPayoneer,
  } = props;

  const startDateFake = startDate ? moment(startDate) : moment();
  const endDateFake = endDate ? moment(endDate) : moment().add(7, "days");

  const hoursDiffStart = startDateFake.diff(moment(), "hours");
  const hoursDiffEnd = endDateFake.diff(moment(), "hours");

  const dateFormat = "MM-DD-YYYY";
  const exchangeRateRangeDateFormat = "MM/DD/YY";
  const endDateDisplay = formatDatetimeLocalized(endDateFake, dateFormat);
  const hideConversion = hoursDiffEnd > 7 * 24 || !pendingCurrency; // Hide conversion info a week after
  const pendingCurrencyDisplay = pendingCurrency
    ? `${pendingCurrency} (${getCurrencySymbol(pendingCurrency)})`
    : "N/A";
  // I think this context might be needed?
  const exchangeRateCalcRange = ci18n(
    "Date range, start date to end date",
    "%1$s - %2$s",
    formatDatetimeLocalized(
      moment(new Date()).add(-30, "days"),
      exchangeRateRangeDateFormat,
    ),
    formatDatetimeLocalized(moment(new Date()), exchangeRateRangeDateFormat),
  );

  const canCancel = hoursDiffStart < 24 && pendingCurrency != currentCurrency;
  const displayBanner =
    !pendingCurrency &&
    allowedMigration != "USD" &&
    allowedMigration != "CNY" &&
    allowedMigration &&
    currentCurrency == "USD";
  const displayDateSelectionModal = async () => {
    new CurrencyConversionDateSelectionModal({
      currentCurrency,
      pendingCurrency: allowedMigration ? allowedMigration : "N/A",
      conversionRate: conversionRate ? conversionRate : 0,
      requestConversion,
      exchangeRateCalcRange,
      onClose: () => {},
    }).render();
  };
  return (
    <Card className={css(styles.panelCard)}>
      {displayBanner && (
        <CurrencyUpdateBanner
          isPayPal={isPayPal}
          isPayoneer={isPayoneer}
          requestConversion={displayDateSelectionModal}
          allowedMigration={allowedMigration ? allowedMigration : "N/A"}
        />
      )}
      {pendingCurrency && !hideConversion && (
        <CurrencyUpdateProgressBanner
          conversionStatus={conversionStatus}
          pendingCurrencyDisplay={pendingCurrencyDisplay}
          endDateDisplay={endDateDisplay}
        />
      )}
      {!hideConversion && conversionStatus !== "CANCELLED" && (
        <div className={css(styles.infoTable)}>
          <CurrencyInfoTable
            showConversion={!hideConversion}
            currentCurrency={currentCurrency}
            pendingCurrency={pendingCurrency}
            conversionStatus={conversionStatus}
            endDate={endDateDisplay}
            canCancel={canCancel}
            cancelConversion={cancelConversion}
            conversionRate={conversionRate ? conversionRate : 0}
          />
        </div>
      )}
      {conversionStatus === "PENDING" && pendingCurrency && !hideConversion && (
        <div className={css(styles.footer)}>
          <Markdown
            text={
              allowedMigration === "BRL"
                ? i`Upon completing currency conversion, product and ` +
                  i`shipping prices may be edited in ` +
                  i`${pendingCurrencyDisplay} while payments will still be ` +
                  i`disbursed in USD ($) based on the 30-day average exchange ` +
                  i`rate from ${exchangeRateCalcRange}.`
                : i`Upon completing currency conversion, existing USD ($) ` +
                  i`priced products will be automatically converted to ` +
                  i`${pendingCurrencyDisplay} based on the 30-day average ` +
                  i`exchange rate from ${exchangeRateCalcRange}. Future ` +
                  i`orders, payments, and penalties generated after ` +
                  i`**${endDateDisplay}** will be shown in ` +
                  i`${pendingCurrencyDisplay}.`
            }
          />
        </div>
      )}
      <div
        className={!hideConversion ? css(styles.currentCurrencySeparator) : ""}
      >
        <table className={css(styles.currentCurrencyFooter)}>
          <tbody>
            <tr>
              <td className={css(styles.infoKey)}>
                Your current Local Currency Code
              </td>
              <td className={css(styles.infoValue)}>
                <CurrencyCodeDisplay currencyCode={currentCurrency} />
                {conversionStatus === "CANCELLED" && (
                  /* eslint-disable local-rules/unnecessary-list-usage */
                  // Used for a bullet.
                  <ul>
                    <li className={css(styles.displayConversionModalLink)}>
                      <Link onClick={displayDateSelectionModal}>
                        Convert to {pendingCurrencyDisplay}
                      </Link>
                    </li>
                  </ul>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const useStylesheet = () => {
  const { textBlack, textDark, pageBackground, borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        infoTable: {
          marginLeft: 24,
          marginTop: 10,
          marginBottom: 10,
        },
        panelCard: {
          marginRight: 20,
        },
        button: {
          marginLeft: 24,
          maxWidth: 400,
          fontSize: 16,
          padding: "10px 0px",
        },
        footer: {
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
        displayConversionModalLink: {
          marginLeft: 5,
        },
        currentCurrencySeparator: {
          borderTop: `solid 1px ${borderPrimary}`,
        },
        currentCurrencyFooter: {
          marginLeft: 24,
          marginTop: 12,
          marginBottom: 12,
        },
      }),
    [textBlack, textDark, pageBackground, borderPrimary],
  );
};
