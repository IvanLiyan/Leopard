//
//  component/form/CountrySearch.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 6/5/19.
//  Copyright © 2019-present ContextLogic Inc. All rights reserved.
//
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observable, action, reaction, computed } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { TextInputProps } from "@ContextLogic/lego";
import Flag from "./Flag";
import TypeaheadInput from "./TypeaheadInput";

/* Lego Toolkit */
import { editDistance } from "@ContextLogic/lego/toolkit/string";
import { css } from "@toolkit/styling";
import countries from "@toolkit/countries";
import * as fonts from "@toolkit/fonts";
import { ThemeContext } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode as BaseCountryCode } from "@toolkit/countries";

type CountryCode = BaseCountryCode | "EU" | "D";
export type CountryType = { readonly name: string; readonly cc: CountryCode };

export type CountrySearchProps = BaseProps & {
  readonly countries: ReadonlyArray<CountryType>;
  readonly currentCountryCode: CountryCode | null | undefined;
  readonly onCountry: (arg0: {
    countryCode: BaseCountryCode | null | undefined;
  }) => unknown;
  readonly disabled?: boolean;
  readonly placeholder?: string | undefined;
  readonly inputProps?: TextInputProps | null | undefined;
};

@observer
class CountrySearch extends Component<CountrySearchProps> {
  static contextType = ThemeContext;
  context!: React.ContextType<typeof ThemeContext>;

  static demoProps: CountrySearchProps = {
    currentCountryCode: null,
    onCountry: ({ countryCode }) => {},
    countries: Object.entries(countries).map(([cc, name]) => ({
      cc,
      name,
    })) as ReadonlyArray<CountryType>,
    placeholder: i`Enter a country`,
  };

  static defaultProps: Partial<CountrySearchProps> = {
    placeholder: i`Enter a country`,
  };

  @observable
  value: string | null | undefined;

  dispose: (() => void) | null | undefined;

  componentDidMount() {
    this.dispose = reaction(
      (): [CountryCode | null | undefined, readonly CountryType[]] => [
        // Need to access the props in order for mobx to detect the dependency
        // eslint-disable-next-line react/destructuring-assignment
        this.props.currentCountryCode,
        // Need to access the props in order for mobx to detect the dependency
        // eslint-disable-next-line react/destructuring-assignment
        this.props.countries,
      ],
      ([currentCountryCode, countries]: [
        CountryCode | null | undefined,
        readonly CountryType[]
      ]) => {
        const currentCountry = countries.find(
          (country) => country.cc === currentCountryCode
        );

        if (currentCountry) {
          this.value = currentCountry.name;
        }
      },
      { fireImmediately: true }
    );
  }

  componentWilUnmount() {
    const { dispose } = this;
    if (dispose != null) {
      dispose();
    }
    this.dispose = null;
  }

  @action
  onTextChange = ({ text }: { text: string }) => {
    const { onCountry } = this.props;
    this.value = text;
    onCountry({ countryCode: null });
  };

  @action
  onSelection = ({ item }: { item: CountryType }) => {
    const { onCountry } = this.props;
    this.value = item.name;
    onCountry({ countryCode: item.cc as BaseCountryCode });
  };

  renderItem = ({ item }: { item: CountryType }) => {
    return (
      <div className={css(this.styles.option)}>
        <Flag countryCode={item.cc} className={css(this.styles.img)} />
        {item.name}
      </div>
    );
  };

  @computed
  get styles() {
    const { primary, textBlack } = this.context;

    return StyleSheet.create({
      root: {},
      options: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        minWidth: 250,
        maxHeight: 400,
        overflowY: "auto",
      },
      option: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "10px 16px",
        cursor: "pointer",
        userSelect: "none",
        ":hover": {
          color: primary,
        },
        fontSize: 14,
        fontWeight: fonts.weightMedium,
        lineHeight: 1.43,
        letterSpacing: "normal",
        color: textBlack,
      },
      img: {
        height: 16,
        marginRight: 7,
        borderRadius: 2,
      },
    });
  }

  queryCountries = async (args: {
    query: string;
  }): Promise<ReadonlyArray<CountryType>> => {
    const { countries } = this.props;
    const query = args.query.trim().toLowerCase();
    if (query.length == 0) {
      // Present all options -- sorted lexigoraphically  -- if nothing has been
      // searched yet.
      return _.sortBy(countries, (country) => country.name);
    }

    const mostLikelyResults = countries.filter((country) =>
      country.name.toLowerCase().includes(query)
    );

    const distances: {
      [countryCode: string]: number;
    } = mostLikelyResults.reduce(
      (total, country) => ({
        ...total,
        [country.cc]: editDistance(country.name.toLowerCase(), query),
      }),
      {}
    );

    return _.sortBy(mostLikelyResults, (country) => distances[country.cc]);
  };

  render() {
    const { inputProps, placeholder, className, style } = this.props;
    return (
      <TypeaheadInput
        className={css(className, style)}
        text={this.value}
        onTextChange={this.onTextChange}
        getData={this.queryCountries}
        onSelection={this.onSelection}
        renderItem={this.renderItem}
        inputProps={{
          ...inputProps,
          placeholder,
        }}
      />
    );
  }
}

export default CountrySearch;
