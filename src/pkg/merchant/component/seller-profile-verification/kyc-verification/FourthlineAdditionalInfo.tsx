import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { GenderType } from "@merchant/api/kyc-verification";

import {
  H4,
  Field,
  HorizontalField,
  HorizontalFieldProps,
  TextInput,
  Select,
} from "@ContextLogic/lego";
import { CountrySelect } from "@merchant/component/core";
/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SellerProfileVerification Imports */
import IdentityPageDateOfBirthField from "@merchant/component/seller-profile-verification/IdentityPageDateOfBirthField";
import CardHeader from "@merchant/component/seller-profile-verification/CardHeader";
import { useCountryOptions } from "@merchant/component/seller-profile-verification/CountryOfDomicilePage";

import { Option } from "@ContextLogic/lego";
import { CountryCode } from "@toolkit/countries";

type FourthlineAdditionalInfoProps = BaseProps & {
  readonly nationality: CountryCode | null | undefined;
  readonly setNationality: (
    countryCode: CountryCode | null | undefined
  ) => unknown;
  readonly birthDay: Date | null;
  readonly setBirthDay: (day: Date) => void;
  readonly birthYear: number | null;
  readonly setBirthYear: (year: number) => void;
  readonly birthCity: string | null;
  readonly setBirthCity: (name: string) => void;
  readonly birthCountry: CountryCode | null | undefined;
  readonly setBirthCountry: (
    countryCode: CountryCode | null | undefined
  ) => unknown;
  readonly gender: GenderType | null;
  readonly setGender: (gender: GenderType) => void;

  readonly onBack: () => unknown;
};

const FourthlineAdditionalInfo = (props: FourthlineAdditionalInfoProps) => {
  const {
    className,
    style,
    nationality,
    setNationality,
    birthDay,
    setBirthDay,
    birthYear,
    setBirthYear,
    birthCity,
    setBirthCity,
    birthCountry,
    setBirthCountry,
    gender,
    setGender,
    onBack,
  } = props;
  const styles = useStylesheet();
  const countryOptions = useCountryOptions();
  const info = i`Provide information that confirms your identity.`;
  const renderFieldTitle = (text: string) => {
    return <div className={css(styles.fieldTitle)}>{text}</div>;
  };

  // Types value do not need to be translated
  /* eslint-disable local-rules/unwrapped-i18n */
  const GenderOptions: ReadonlyArray<Option<GenderType>> = [
    { value: "Male", text: i`Male` },
    { value: "Female", text: i`Female` },
    { value: "Unknown", text: i`Other` },
  ];

  const horizontalFieldProps: Partial<HorizontalFieldProps> = {
    className: css(styles.field),
    titleAlign: "start",
    titleWidth: 220,
  };

  return (
    <div className={css(styles.root, style, className)}>
      <CardHeader
        className={css(styles.header)}
        onClickBack={onBack}
        displayType={"back"}
      />
      <H4>Validate your individual merchant account type</H4>
      <div className={css(styles.content)}>{info}</div>

      <HorizontalField
        title={() => renderFieldTitle(i`Account type`)}
        centerTitleVertically
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValue)}>Individual</div>
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Nationality`)}
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValueGrid)}>
          <Field title={i`Country/Region`}>
            <CountrySelect
              className={css(styles.countrySelect)}
              countries={countryOptions}
              currentCountryCode={birthCountry}
              onCountry={setBirthCountry}
            />
          </Field>
        </div>
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Place of Birth`)}
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValueGrid)}>
          <Field title={i`City`}>
            <TextInput
              value={birthCity}
              placeholder={i`Enter your place of birth`}
              onChange={({ text }) => setBirthCity(text)}
            />
          </Field>
          <Field title={i`Country/Region`}>
            <CountrySelect
              className={css(styles.countrySelect)}
              countries={countryOptions}
              currentCountryCode={nationality}
              onCountry={setNationality}
            />
          </Field>
        </div>
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Date of birth`)}
        {...horizontalFieldProps}
      >
        <IdentityPageDateOfBirthField
          birthDay={birthDay}
          onBirthDayChange={setBirthDay}
          birthYear={birthYear}
          onBirthYearChange={setBirthYear}
        />
      </HorizontalField>
      <HorizontalField
        title={() => renderFieldTitle(i`Gender`)}
        {...horizontalFieldProps}
      >
        <div className={css(styles.fieldValueGrid)}>
          <Select
            placeholder={i`Select your gender`}
            options={GenderOptions}
            selectedValue={gender}
            onSelected={setGender}
            buttonHeight={40}
            position="bottom center"
          />
        </div>
      </HorizontalField>
    </div>
  );
};

export default FourthlineAdditionalInfo;

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        },
        header: {
          marginTop: 24,
        },
        content: {
          marginTop: 16,
          color: textDark,
          textAlign: "center",
        },
        field: {
          marginTop: 40,
          maxWidth: 700,
          width: "100%",
        },
        fieldTitle: {
          color: palettes.textColors.DarkInk,
        },
        fieldValue: {
          color: palettes.textColors.Ink,
        },
        fieldValueGrid: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: 16,
        },
        countrySelect: {
          ":nth-child(1n) > *": {
            width: "100%",
          },
        },
      }),
    [textDark]
  );
};
