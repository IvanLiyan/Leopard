import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { CountrySelect } from "@merchant/component/core";
import { CountryType } from "@merchant/component/core/CountrySelect";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import TaxEnrollmentV2State from "@merchant/model/tax/TaxEnrollmentV2State";

import { CountryCode } from "@schema/types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";
import { weightBold } from "@toolkit/fonts";

type EUSelectShipFromCountryProps = BaseProps & {
  readonly requiresWEShipFrom: boolean;
  readonly countryOptions: ReadonlyArray<CountryType>;
  readonly editState: TaxEnrollmentV2State;
};

const EUSelectShipFromCountry = ({
  className,
  style,
  requiresWEShipFrom,
  countryOptions,
  editState,
}: EUSelectShipFromCountryProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.title)}>
        Standard orders will be shipped from
      </div>
      <div className={css(styles.selectContainer)}>
        <CountrySelect
          placeholder={i`Select a country/region`}
          onCountry={(countryCode: CountryCode | undefined) => {
            editState.euStandardShipFromCountryCode = countryCode;
          }}
          currentCountryCode={
            editState.euStandardShipFromCountryCode as CountryCode
          }
          countries={countryOptions}
        />
      </div>
      {requiresWEShipFrom && (
        <>
          <div className={css(styles.title)}>
            Wish Express orders will be shipped from
          </div>
          <div className={css(styles.selectContainer)}>
            <CountrySelect
              placeholder={i`Select a country/region`}
              onCountry={(countryCode: CountryCode | undefined) => {
                editState.euWishExpressShipFromCountryCode = countryCode;
              }}
              currentCountryCode={
                editState.euWishExpressShipFromCountryCode as CountryCode
              }
              countries={countryOptions}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EUSelectShipFromCountry;

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "grid",
          gridAutoColumns: "max-content",
          justifyItems: "end",
          alignItems: "center",
          rowGap: 16,
          columnGap: "40px",
        },
        title: {
          fontWeight: weightBold,
          gridColumn: 1,
          color: textDark,
          fontSize: 16,
          lineHeight: 1.5,
        },
        selectContainer: {
          gridColumn: 2,
          display: "flex",
          "@media (min-width: 900px)": {
            maxWidth: 300,
          },
          flexDirection: "column",
          alignSelf: "flex-start",
        },
        field: {
          marginBottom: 15,
        },
      }),
    [textDark]
  );
};
