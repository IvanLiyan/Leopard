import React, { useMemo } from "react";

/* Lego Components */
import { FormSelect, Option } from "@ContextLogic/lego";

/* Lego Toolkit */
// import { Flags4x3 } from "@core/toolkit/countries";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CountryCode } from "@core/toolkit/countries";

export type CountryType = { readonly name: string; readonly cc: CountryCode };
export type { CountryCode };

export type CountrySelectProps = BaseProps & {
  readonly countries: ReadonlyArray<CountryType>;
  readonly currentCountryCode: CountryCode | null | undefined;
  readonly error?: boolean | null | undefined;
  readonly disabled?: boolean;
  readonly borderColor?: string | null | undefined;
  readonly "data-cy"?: string;
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

const CountrySelect: React.FC<CountrySelectProps> = ({
  disabled,
  className,
  currentCountryCode,
  placeholder: placeholderProp,
  error,
  countries,
  borderColor,
  onCountry,
  "data-cy": dataCy,
  style,
}) => {
  const countryOptions: ReadonlyArray<Option<CountryCode>> = useMemo(() => {
    const unsortedCountries = countries.map((countryInfo) => {
      return {
        value: countryInfo.cc,
        text: countryInfo.name,
        // img: Flags4x3[countryInfo.cc.toLowerCase()],
      };
    });
    return unsortedCountries.sort((a, b) => a.text.localeCompare(b.text));
  }, [countries]);

  const onOptionSelected = (countryCode: CountryCode) => {
    onCountry(countryCode);
  };

  let placeholder: string | undefined = undefined;
  if (placeholderProp === undefined) {
    placeholder = i`Select a country / region`;
  } else if (placeholderProp !== null) {
    placeholder = placeholderProp;
  }

  return (
    <FormSelect
      data-cy={dataCy ?? "country-select"}
      style={[className, style]}
      options={countryOptions}
      onSelected={onOptionSelected}
      selectedValue={currentCountryCode}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      borderColor={borderColor}
    />
  );
};

export default CountrySelect;
