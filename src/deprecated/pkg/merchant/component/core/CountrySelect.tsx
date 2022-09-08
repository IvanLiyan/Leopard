//
//  component/form/CountrySelect.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/17/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { Component } from "react";
import { computed } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import { FormSelect, Option } from "@ContextLogic/lego";

/* Lego Toolkit */
import { Flags4x3 } from "@toolkit/countries";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@toolkit/countries";

export type CountryType = { readonly name: string; readonly cc: CountryCode };
export type { CountryCode };

export type CountrySelectProps = BaseProps & {
  readonly countries: ReadonlyArray<CountryType>;
  readonly currentCountryCode: CountryCode | null | undefined;
  readonly error?: boolean | null | undefined;
  readonly disabled?: boolean;
  readonly borderColor?: string | null | undefined;
} & (
    | {
        readonly onCountry: (countryCode: CountryCode) => unknown;
        readonly placeholder: null; // to hide the placeholder, explicitly pass null
      }
    | {
        readonly onCountry: (countryCode: CountryCode | undefined) => unknown;
        readonly placeholder?: string;
      }
  );

@observer
class CountrySelect extends Component<CountrySelectProps> {
  static demoProps: CountrySelectProps = {
    currentCountryCode: "GB",
    onCountry: () => {},
    countries: [
      { name: i`United States`, cc: "US" },
      { name: i`Germany`, cc: "DE" },
    ],
  };

  @computed
  get countryOptions(): ReadonlyArray<Option<CountryCode>> {
    const { countries } = this.props;
    const unsortedCountries = countries.map((countryInfo) => {
      return {
        value: countryInfo.cc,
        text: countryInfo.name,
        img: Flags4x3[countryInfo.cc.toLowerCase()],
      };
    });
    return unsortedCountries.sort((a, b) => a.text.localeCompare(b.text));
  }

  @computed
  get iconStyle() {
    return {
      height: 16,
      marginRight: 7,
      borderRadius: 2,
    };
  }

  onOptionSelected = (countryCode: CountryCode) => {
    this.props.onCountry(countryCode);
  };

  render() {
    const {
      disabled,
      className,
      currentCountryCode,
      placeholder: placeholderProp,
      error,
      borderColor,
      style,
    } = this.props;

    let placeholder: string | undefined = undefined;
    if (placeholderProp === undefined) {
      placeholder = i`Select a country / region`;
    } else if (placeholderProp !== null) {
      placeholder = placeholderProp;
    }

    return (
      <FormSelect
        style={[className, style]}
        options={this.countryOptions}
        onSelected={this.onOptionSelected}
        selectedValue={currentCountryCode}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        borderColor={borderColor}
      />
    );
  }
}

export default CountrySelect;
