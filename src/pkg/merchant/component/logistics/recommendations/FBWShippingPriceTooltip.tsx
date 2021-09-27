import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable, action } from "mobx";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { getCountryName, CountryCode } from "@toolkit/countries";

import {
  CountryShippingPrices,
  CountryShippingPrice,
} from "@merchant/api/fbw-shipping-price-drop";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type FBWShippingPriceTooltipProps = BaseProps & {
  readonly data: CountryShippingPrices;
  readonly warehouseCode: string;
  readonly currencyCode: string;
  readonly isHistory: boolean;
};

@observer
class FBWShippingPriceTooltip extends Component<FBWShippingPriceTooltipProps> {
  defaultRowsToShow = 5;
  @observable
  showMore = false;

  @computed
  get styles() {
    return StyleSheet.create({
      root: {
        padding: 16,
      },
      header: {
        fontSize: 14,
        paddingBottom: 8,
        fontWeight: fonts.weightBold,
      },
      table: {
        minWidth: 300,
        fontFamily: fonts.proxima,
      },
      country: {
        textAlign: "left",
      },
      price: {
        textAlign: "right",
      },
      tableText: {
        fontSize: 14,
        paddingBottom: 4,
        fontWeight: fonts.weightMedium,
        color: "#7790a3",
      },
    });
  }

  @computed
  get data(): ReadonlyArray<CountryShippingPrice> {
    // Converts the data of type CountryShippingPrices into an array
    const { data: initialData } = this.props;
    const data: CountryShippingPrice[] = [];
    for (const country of Object.keys(initialData) as CountryCode[]) {
      const countryPrices = {
        suggested: initialData[country].suggested,
        current: initialData[country].current,
        country,
      };
      data.push(countryPrices);
    }
    return data;
  }

  @computed
  get visibleData(): ReadonlyArray<CountryShippingPrice> {
    if (this.showMore) {
      return this.data;
    }
    return this.data.slice(0, this.defaultRowsToShow);
  }

  @action
  toggleShowMore() {
    this.showMore = !this.showMore;
  }

  renderShowMore() {
    if (this.data.length > this.defaultRowsToShow) {
      return (
        <Link onClick={() => this.toggleShowMore()}>
          {this.showMore ? i`Show less` : i`Show more`}
        </Link>
      );
    }
    return null;
  }

  formatNumber(number: number) {
    const { currencyCode } = this.props;
    return formatCurrency(number, currencyCode);
  }

  renderHistory() {
    return (
      <table className={css(this.styles.table)}>
        <thead>
          <tr className={css(this.styles.header)}>
            <th className={css(this.styles.country)}>Country</th>
            <th className={css(this.styles.price)}>Previous</th>
            <th className={css(this.styles.price)}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {this.visibleData.map((row) => {
            return (
              <tr>
                <td className={css(this.styles.country, this.styles.tableText)}>
                  {getCountryName(row.country)}
                </td>
                <td className={css(this.styles.price, this.styles.tableText)}>
                  {this.formatNumber(row.current)}
                </td>
                <td className={css(this.styles.price, this.styles.tableText)}>
                  {this.formatNumber(row.suggested)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  renderCurrent() {
    return (
      <table className={css(this.styles.table)}>
        <thead>
          <tr className={css(this.styles.header)}>
            <th className={css(this.styles.country)}>Country</th>
            <th className={css(this.styles.price)}>Current</th>
            <th className={css(this.styles.price)}>Suggested</th>
          </tr>
        </thead>
        <tbody>
          {this.visibleData.map((row) => {
            return (
              <tr key={row.country}>
                <td className={css(this.styles.country, this.styles.tableText)}>
                  {getCountryName(row.country)}
                </td>
                <td className={css(this.styles.price, this.styles.tableText)}>
                  {this.formatNumber(row.current)}
                </td>
                <td className={css(this.styles.price, this.styles.tableText)}>
                  {this.formatNumber(row.suggested)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  render() {
    const { isHistory, warehouseCode } = this.props;
    return (
      <div className={css(this.styles.root)}>
        <div className={css(this.styles.header)}>
          {warehouseCode.toUpperCase()}
        </div>
        {isHistory ? this.renderHistory() : this.renderCurrent()}
        {this.renderShowMore()}
      </div>
    );
  }
}

export default FBWShippingPriceTooltip;
