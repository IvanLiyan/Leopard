/* eslint-disable local-rules/use-formatCurrency */
// Deliberately formatting USD cases

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import moment from "moment/moment";

/* Lego Components */
import { Info, Markdown, DayPickerInput } from "@ContextLogic/lego";
import { Modal, ModalFooter } from "@merchant/component/core/modal";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";

/* Relative Imports */
import CurrencyConversionConfirmationModal from "./CurrencyConversionConfirmationModal";
import { CurrencyCodeDisplay } from "./CurrencyCodeDisplay";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencyConversionDateSelectionModalContentProps = BaseProps & {
  readonly currentCurrency: string;
  readonly pendingCurrency: string;
  readonly conversionRate: number;
  readonly requestConversion: (
    requestedEndDate: Date,
  ) => Promise<void> | null | undefined;
  readonly exchangeRateCalcRange: string;
  readonly onClose: () => unknown;
};

const CurrencyConversionDateSelectionModalContent = (
  props: CurrencyConversionDateSelectionModalContentProps,
) => {
  const {
    currentCurrency,
    pendingCurrency,
    conversionRate,
    requestConversion,
    exchangeRateCalcRange,
    onClose,
  } = props;
  const styles = useStyleSheet();

  const dateFormat = "MM-DD-YYYY";

  const currencyCodeAndSymbol = `${pendingCurrency} (${getCurrencySymbol(
    pendingCurrency,
  )})`;

  const pendingCurrencyAndRate = `${conversionRate} ${pendingCurrency}`;

  const [requestedEndDate, setRequestedEndDate] = useState(
    moment().add(1, "day").format(dateFormat),
  );

  const { locale } = useLocalizationStore();

  const displayConfirmationModal = async () => {
    new CurrencyConversionConfirmationModal({
      currentCurrency,
      pendingCurrency,
      requestedEndDate,
      conversionRate,
      requestConversion,
      exchangeRateCalcRange,
    }).render();
  };

  const actionButtonProps = {
    text: i`Next`,
    onClick: async () => {
      await displayConfirmationModal();
      onClose();
    },
  };

  const cancelButtonProps = {
    text: i`Cancel`,
    onClick: () => {
      onClose();
    },
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.upper)}>
        <div className={css(styles.preamble)}>
          {/* TODO: need to change BRL message, following up with designer */}
          {pendingCurrency === "BRL"
            ? i`Upon completing currency conversion, product and shipping prices ` +
              i`may be edited in ${currencyCodeAndSymbol} while payments will still ` +
              i`be disbursed in USD ($).`
            : i`Your chosen Local Currency Code will be used for setting product ` +
              i`and shipping prices, as well as receiving payouts from Wish.`}
        </div>
        <table className={css(styles.infoTable)}>
          <tbody>
            <tr className={css(styles.infoRow)}>
              <td className={css(styles.infoKeyUpper)}>
                <Markdown text={i`Convert currency code`} />
              </td>
              <td className={css(styles.infoValue)}>
                {pendingCurrency && (
                  <CurrencyCodeDisplay currencyCode={pendingCurrency} />
                )}
              </td>
            </tr>
            <tr className={css(styles.infoRow)}>
              <td className={css(styles.infoKeyUpper)}>
                <Markdown text={i`Choose conversion date`} />
                <Info
                  className={css(styles.description)}
                  text={
                    i`You may select a conversion date anywhere between ` +
                    i`${1} to ${7} days from today.`
                  }
                />
              </td>
              <td className={css(styles.infoValue)}>
                <DayPickerInput
                  noEdit
                  alignRight
                  displayFormat={dateFormat}
                  value={moment(requestedEndDate, dateFormat).toDate()}
                  onDayChange={(day: Date) => {
                    setRequestedEndDate(moment(day).format(dateFormat));
                  }}
                  dayPickerProps={{
                    disabledDays: {
                      before: moment().add(1, "day").toDate(),
                      after: moment().add(8, "day").toDate(),
                    },
                    showOutsideDays: true,
                  }}
                  locale={locale}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={css(styles.bottomGreyArea)}>
        <div className={css(styles.lower)}>
          <table className={css(styles.infoTable)}>
            <tbody>
              <tr className={css(styles.infoRow)}>
                <td className={css(styles.infoKeyLower)}>Currency</td>
                <td className={css(styles.infoValue)}>
                  {currentCurrency && (
                    <CurrencyCodeDisplay currencyCode={currentCurrency} />
                  )}
                  <Icon name="arrowRight" style={css(styles.arrowStyle)} />
                  {pendingCurrency && (
                    <CurrencyCodeDisplay currencyCode={pendingCurrency} />
                  )}
                </td>
              </tr>
              <tr className={css(styles.infoRow)}>
                <td className={css(styles.infoKeyLower)}>Conversion date</td>
                <td className={css(styles.infoValue)}>{requestedEndDate}</td>
              </tr>
              <tr className={css(styles.infoRow)}>
                <td className={css(styles.infoKeyLower)}>Conversion Rate</td>
                <td className={css(styles.infoValue)}>{conversionRate}</td>
              </tr>
              <tr className={css(styles.infoRow)}>
                <td className={css(styles.infoKeyLower)} />
                <td className={css(styles.finalInfo)}>
                  <Markdown
                    text={
                      i`(1 USD = ${pendingCurrencyAndRate} based on ` +
                      i`the exchange rate average from ${exchangeRateCalcRange})`
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className={css(styles.footerContainer)}>
        <ModalFooter
          layout="horizontal-space-between"
          action={actionButtonProps}
          cancel={cancelButtonProps}
        />
      </div>
    </div>
  );
};

const useStyleSheet = () => {
  const { textBlack, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        },
        upper: {
          padding: "40px 24px",
          fontSize: 16,
          fontWeight: fonts.weightMedium,
          maxWidth: 600,
        },
        preamble: {
          color: textBlack,
        },
        infoTable: {
          borderRadius: 4,
          margin: "24px 0px",
          width: "100%",
          boxSizing: "border-box",
          backgroundBlendMode: "darken",
        },
        infoRow: {
          display: "flex",
          flexDirection: "row",
        },
        infoKeyUpper: {
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 16,
          paddingRight: 30,
          color: textBlack,
          width: "50%",
        },
        infoKeyLower: {
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 16,
          paddingRight: 30,
          color: textDark,
          width: "50%",
        },
        infoValue: {
          paddingTop: 16,
          display: "flex",
          justifyContent: "flex-start",
          paddingLeft: 10,
          fontWeight: fonts.weightSemibold,
          color: textBlack,
          width: "50%",
        },
        arrowStyle: {
          width: 12,
          height: 16,
          padding: "2px 6px",
        },
        description: {
          marginLeft: 8,
        },
        finalInfo: {
          display: "flex",
          justifyContent: "flex-start",
          paddingLeft: 10,
          paddingBottom: 16,
          fontSize: 14,
          fontWeight: fonts.weightNormal,
          color: textDark,
          width: "50%",
        },
        bottomGreyArea: {
          display: "flex",
          justifyContent: "center",
          backgroundImage: "linear-gradient(to bottom, #f8fafb, #f8fafb)",
          width: "100%",
        },
        lower: {
          padding: "0px 24px",
          maxWidth: 600,
        },
        footerContainer: {
          width: "100%",
        },
      }),
    [textBlack, textDark],
  );
};

export default class CurrencyConversionDateSelectionModal extends Modal {
  contentProps: CurrencyConversionDateSelectionModalContentProps;

  constructor(props: CurrencyConversionDateSelectionModalContentProps) {
    super(() => null);
    this.contentProps = props;
    this.setHeader({
      title: i`Convert your currency settings`,
    });
    this.noMaxHeight = true;
    this.setWidthPercentage(50);
  }

  renderContent() {
    const { contentProps } = this;
    return (
      <CurrencyConversionDateSelectionModalContent
        {...contentProps}
        onClose={() => this.close()}
      />
    );
  }
}
