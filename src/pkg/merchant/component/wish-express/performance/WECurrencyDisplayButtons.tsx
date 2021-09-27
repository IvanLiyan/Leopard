import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Lego Components */
import { Popover } from "@merchant/component/core";
import { Select } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type WECurrencyDisplayButtonsProps = BaseProps & {
  merchantSourceCurrency?: string;
  selectedCurrency?: string;
  showCurrencyButtons?: boolean;
  currencyConversionRate?: number;
  handleCurrencyChange?: (currencyCode: string) => unknown;
};

@observer
export default class WECurrencyDisplayButtons extends Component<
  WECurrencyDisplayButtonsProps
> {
  @computed
  get styles() {
    return StyleSheet.create({
      buttonsLeft: {
        display: "inline-block",
      },
      currencySelector: {
        marginRight: "15px",
      },
      currencyHelpText: {
        textDecoration: "underline",
        color: "#0088cc",
        fontStyle: "normal",
        ":hover": {
          cursor: "pointer",
        },
        marginTop: 5,
      },
      currencyHelpTextContainer: {
        display: "inline-block",
      },
    });
  }

  @computed
  get merchantCurrencies(): ReadonlyArray<string> {
    const { merchantSourceCurrency } = this.props;
    if (!merchantSourceCurrency) {
      return ["USD"];
    }
    return Array.from(new Set(["USD", merchantSourceCurrency]));
  }

  selectCurrency = (currency: string) => {
    this.props.handleCurrencyChange &&
      this.props.handleCurrencyChange(currency);
  };

  render() {
    const {
      selectedCurrency,
      showCurrencyButtons,
      currencyConversionRate,
      merchantSourceCurrency,
    } = this.props;
    if (currencyConversionRate == null) {
      return null;
    }
    return (
      <>
        <div className={css(this.styles.buttonsLeft)}>
          {this.merchantCurrencies.length > 1 && showCurrencyButtons && (
            <Select
              className={css(this.styles.currencySelector)}
              options={this.merchantCurrencies.map((currency) => ({
                value: currency,
                text: currency,
              }))}
              onSelected={this.selectCurrency}
              selectedValue={selectedCurrency}
              buttonHeight={30}
            />
          )}
        </div>
        <div className={css(this.styles.currencyHelpTextContainer)}>
          {this.merchantCurrencies.length > 1 && showCurrencyButtons && (
            <Popover
              className={css(this.styles.currencyHelpText)}
              popoverContent={
                i`USD values recorded prior to your ${merchantSourceCurrency} ` +
                i`migration date are being calculated at ` +
                i`${formatCurrency(1, "USD")} = ` +
                i`${formatCurrency(
                  currencyConversionRate,
                  merchantSourceCurrency
                )}, ` +
                i`in order to view full performance data in ${merchantSourceCurrency}.`
              }
              popoverMaxWidth={400}
              position="top center"
            >
              How are currency values calculated?
            </Popover>
          )}
        </div>
      </>
    );
  }
}
