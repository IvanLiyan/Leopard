/* eslint-disable local-rules/use-formatCurrency */
// Delibrately formatting USD cases

import React from "react";
import { StyleSheet } from "aphrodite";
import { computed } from "mobx";
import moment from "moment/moment";

/* Lego Components */
import { Markdown, H6 } from "@ContextLogic/lego";
import { Modal, ModalFooter } from "@merchant/component/core/modal";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

/* SVGs */
import clipboard from "@assets/img/clipboard.svg";
import creditCards from "@assets/img/creditCards.svg";
import fingerButton from "@assets/img/fingerButton.svg";
import orderIcon from "@assets/img/iconography/orders@1x.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { CurrencyCodeDisplay } from "./CurrencyCodeDisplay";

type CurrencyConversionConfirmationModalProps = BaseProps & {
  readonly currentCurrency: string;
  readonly pendingCurrency: string;
  readonly requestedEndDate: string;
  readonly conversionRate: number;
  readonly requestConversion: (day: Date) => Promise<void> | null | undefined;
  readonly exchangeRateCalcRange: string;
};

export default class CurrencyConversionConfirmationModal extends Modal {
  props: CurrencyConversionConfirmationModalProps;

  currentCurrency: string | null = null;

  pendingCurrency: string | null = null;

  pendingCurrencyCode: string | null = null;

  pendingCurrencyAndRate: string | null = null;

  requestConversion = (day: Date) => {
    return;
  };

  dateFormat: string = "MM-DD-YYYY";

  constructor(props: CurrencyConversionConfirmationModalProps) {
    super(() => null);
    this.props = props;
    this.noMaxHeight = true;

    const {
      currentCurrency,
      pendingCurrency,
      conversionRate,
      requestConversion,
    } = this.props;
    this.currentCurrency = `${currentCurrency} (${getCurrencySymbol(
      currentCurrency
    )})`;
    this.pendingCurrencyCode = pendingCurrency;
    this.pendingCurrency = `${pendingCurrency} (${getCurrencySymbol(
      pendingCurrency
    )})`;
    this.pendingCurrencyAndRate = `${conversionRate} ${pendingCurrency}`;
    this.requestConversion = requestConversion;
    this.setHeader({
      title: i`Convert your currency settings`,
    });
    this.setWidthPercentage(50);

    this.setRenderFooter(() => (
      <ModalFooter
        action={this.actionButtonProps}
        cancel={{
          children: i`Cancel`,
          onClick: () => {
            this.close();
          },
        }}
        layout="horizontal-space-between"
      />
    ));
  }

  @computed
  get actionButtonProps() {
    return {
      text: i`Convert`,
      onClick: async () => {
        await this.requestConversion(
          moment(this.props.requestedEndDate, this.dateFormat).toDate()
        );
        this.close();
      },
    };
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 24px",
        fontSize: 16,
        fontWeight: fonts.weightMedium,
      },
      preamble: {
        textAlign: "center",
      },
      infoTable: {
        borderRadius: 4,
        margin: "24px 0px",
        width: "100%",
        boxSizing: "border-box",
        backgroundBlendMode: "darken",
        backgroundImage: "linear-gradient(to bottom, #f8fafb, #f8fafb)",
      },
      infoRow: {
        display: "flex",
        flexDirection: "row",
      },
      infoKey: {
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: 16,
        paddingRight: 30,
        width: "50%",
      },
      infoValue: {
        display: "flex",
        justifyContent: "flex-start",
        paddingTop: 16,
        paddingLeft: 10,
        textAlign: "left",
        fontWeight: fonts.weightSemibold,
        width: "50%",
      },
      finalInfo: {
        display: "flex",
        justifyContent: "flex-start",
        paddingLeft: 10,
        paddingBottom: 16,
        fontSize: 14,
        fontWeight: fonts.weightNormal,
        width: "50%",
      },
      arrowStyle: {
        width: 12,
        height: 16,
        padding: "2px 6px",
      },
      centered: {
        maxWidth: 600,
      },
      header: {
        textAlign: "center",
        marginTop: 16,
        marginBottom: 20,
        fontWeight: fonts.weightBold,
      },
      imageTable: {
        width: "100%",
      },
      imageKey: {
        paddingRight: 16,
        paddingBottom: 20,
        height: 40,
        width: 40,
      },
      image: {
        width: 40,
        height: 40,
      },
      imageValue: {
        paddingBottom: 20,
      },
    });
  }

  renderContent() {
    const {
      currentCurrency,
      pendingCurrency,
      requestedEndDate,
      conversionRate,
      exchangeRateCalcRange,
    } = this.props;
    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.centered)}>
          <div className={css(this.styles.preamble)}>
            Here are a few things to remember before we start on your currency
            conversion:
          </div>
          <table className={css(this.styles.infoTable)}>
            <tbody>
              <tr className={css(this.styles.infoRow)}>
                <td className={css(this.styles.infoKey)}>Currency code</td>
                <td className={css(this.styles.infoValue)}>
                  {currentCurrency && (
                    <CurrencyCodeDisplay currencyCode={currentCurrency} />
                  )}
                  <Icon name="arrowRight" style={css(this.styles.arrowStyle)} />
                  {pendingCurrency && (
                    <CurrencyCodeDisplay currencyCode={pendingCurrency} />
                  )}
                </td>
              </tr>
              <tr className={css(this.styles.infoRow)}>
                <td className={css(this.styles.infoKey)}>Conversion date</td>
                <td className={css(this.styles.infoValue)}>
                  {requestedEndDate}
                </td>
              </tr>
              <tr className={css(this.styles.infoRow)}>
                <td className={css(this.styles.infoKey)}>Conversion Rate</td>
                <td className={css(this.styles.infoValue)}>{conversionRate}</td>
              </tr>
              <tr className={css(this.styles.infoRow)}>
                <td className={css(this.styles.infoKey)} />
                <td className={css(this.styles.finalInfo)}>
                  <Markdown
                    text={
                      i`(1 USD = ${this.pendingCurrencyAndRate} based on ` +
                      i`the exchange rate average from ${exchangeRateCalcRange})`
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <H6 className={css(this.styles.header)}>
            What should I keep in mind?
          </H6>
          <table className={css(this.styles.imageTable)}>
            <tbody>
              <tr>
                <td className={css(this.styles.imageKey)}>
                  <img src={clipboard} className={css(this.styles.image)} />
                </td>
                <td className={css(this.styles.imageValue)}>
                  Once your currency is converted, existing USD ($) priced
                  products will be automatically converted based on the 30 day
                  average exchange rate.
                </td>
              </tr>
              <tr>
                <td className={css(this.styles.imageKey)}>
                  <img src={orderIcon} className={css(this.styles.image)} />
                </td>
                <td className={css(this.styles.imageValue)}>
                  {this.pendingCurrencyCode == "BRL" ? (
                    <Markdown
                      text={i`Future orders, payments, and penalties generated after 
                      **${requestedEndDate}** will be shown in ${this.pendingCurrency}. Payments 
                      will still be disbursed in USD ($).`}
                    />
                  ) : (
                    <Markdown
                      text={i`Future orders, payments and penalties generated after 
                      **${requestedEndDate}** will be shown in ${this.pendingCurrency}.`}
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td className={css(this.styles.imageKey)}>
                  <img src={creditCards} className={css(this.styles.image)} />
                </td>
                <td className={css(this.styles.imageValue)}>
                  <Markdown
                    openLinksInNewTab // eslint-disable-next-line local-rules/no-links-in-i18n
                    text={i`When you convert to ${
                      this.pendingCurrency
                    }, you will only
                    be able to use **PayPal** as your payment provider. 
                    [Learn More](${zendeskURL("360044549073")})`}
                  />
                </td>
              </tr>
              <tr>
                <td className={css(this.styles.imageKey)}>
                  <img src={fingerButton} className={css(this.styles.image)} />
                </td>
                <td className={css(this.styles.imageValue)}>
                  <Markdown
                    text={i`Once your currency conversion to ${this.pendingCurrency} is 
                    complete, you will **NOT** be able to switch back to USD ($).`}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
