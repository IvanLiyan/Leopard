import React, { useState, useCallback, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { CountrySearch } from "@merchant/component/core";
import { DeleteButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { getCountryName } from "@toolkit/countries";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TextInputProps } from "@ContextLogic/lego";
import { ABSBTrademarkCountryCode } from "@toolkit/brand/branded-products/abs";

export type MultiCountryInputProps = BaseProps & {
  readonly title: string;
  readonly popoverContent: string;
  readonly placeholder: string;
  readonly value: ReadonlyArray<ABSBTrademarkCountryCode>;
  readonly onChange: (
    newValue: ReadonlyArray<ABSBTrademarkCountryCode>
  ) => unknown;
  readonly inputProps?: TextInputProps;
  readonly acceptedTrademarkCountries: ReadonlyArray<ABSBTrademarkCountryCode>;
};

const GLOBAL_COUNTRY_CODE = "D" as ABSBTrademarkCountryCode;

const MultiCountryInput = ({
  title,
  popoverContent,
  placeholder,
  value,
  onChange,
  inputProps,
  acceptedTrademarkCountries,
  style,
}: MultiCountryInputProps) => {
  const styles = useStylesheet();

  const [selectedCountries, setSelectedCountries] = useState(value);

  const CountryOptions = acceptedTrademarkCountries.map((cc) => {
    return {
      name: getCountryName(cc),
      cc,
    };
  });

  CountryOptions.push({
    name: getCountryName(GLOBAL_COUNTRY_CODE),
    cc: GLOBAL_COUNTRY_CODE,
  });

  const onCountry = useCallback(
    (index, countryCode) => {
      if (!countryCode) {
        return;
      }

      const newSelectedCountries = [...selectedCountries];

      if (newSelectedCountries.length && index < newSelectedCountries.length) {
        newSelectedCountries[index] = countryCode;
      } else {
        newSelectedCountries.push(countryCode);
      }

      setSelectedCountries(newSelectedCountries);
      onChange(newSelectedCountries);
    },
    [selectedCountries, onChange]
  );

  const onDelete = useCallback(
    (index) => {
      const newSelectedCountries = [...selectedCountries];
      newSelectedCountries.splice(index, 1);

      setSelectedCountries(newSelectedCountries);
      onChange(newSelectedCountries);
    },
    [selectedCountries, onChange]
  );

  let uniqueKey = 0;

  return (
    <div className={css(style)}>
      {[...selectedCountries, null].map((country, index) => {
        return (
          <HorizontalField
            title={index === 0 ? title : ""}
            popoverContent={index === 0 ? popoverContent : ""}
            centerTitleVertically
            key={(country ? country : "") + uniqueKey++}
            style={css(styles.horizontalField)}
            required
          >
            <div className={css(styles.fieldContainer)}>
              <CountrySearch
                onCountry={({ countryCode }) => {
                  onCountry(index, countryCode);
                }}
                currentCountryCode={country}
                countries={CountryOptions}
                placeholder={placeholder}
                style={css(styles.countryField)}
                inputProps={inputProps}
              />
              {index < selectedCountries.length && (
                <DeleteButton
                  className={css(styles.deleteButton)}
                  onClick={() => onDelete(index)}
                />
              )}
            </div>
          </HorizontalField>
        );
      })}
    </div>
  );
};
export default observer(MultiCountryInput);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        fieldContainer: {
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
        },
        horizontalField: {
          marginTop: "10px",
        },
        countryField: {
          flex: "2",
        },
        deleteButton: {
          alignSelf: "flex-end",
          marginLeft: "3px",
          marginBottom: "5px",
        },
      }),
    []
  );
