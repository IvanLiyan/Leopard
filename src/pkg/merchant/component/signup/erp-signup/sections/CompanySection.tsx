import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { HorizontalField } from "@ContextLogic/lego";
import { TextInput } from "@ContextLogic/lego";
import { CountrySelect } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseSectionProps } from "./SectionWrapper";

const CompanySection = (props: BaseSectionProps) => {
  const styles = useStylesheet();
  const { state, className } = props;
  const { requiredValidator, urlValidator } = state;

  return (
    <div className={css(className)}>
      <HorizontalField
        className={css(styles.field)}
        title={i`Company Name`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.companyName}
          onChange={({ text }) => {
            state.companyName = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Web URL`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.websiteURL}
          onChange={({ text }) => {
            state.websiteURL = text;
          }}
          validators={[requiredValidator, urlValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Address Line 1`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.addressLine1}
          onChange={({ text }) => {
            state.addressLine1 = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Address Line 2`}
        titleWidth={240}
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.addressLine2}
          onChange={({ text }) => {
            state.addressLine2 = text;
          }}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`City`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.city}
          onChange={({ text }) => {
            state.city = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`State/Province/Region`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.state}
          onChange={({ text }) => {
            state.state = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Country`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <CountrySelect
          className={css(styles.textInput)}
          onCountry={state.changeCountry}
          currentCountryCode={state.country}
          countries={state.countryOptions}
        />
      </HorizontalField>
      <HorizontalField
        className={css(styles.field)}
        title={i`Zip/Postal Code`}
        titleWidth={240}
        required
        centerTitleVertically
      >
        <TextInput
          className={css(styles.textInput)}
          value={state.zipcode}
          onChange={({ text }) => {
            state.zipcode = text;
          }}
          validators={[requiredValidator]}
        />
      </HorizontalField>
    </div>
  );
};
export default observer(CompanySection);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        field: {
          marginTop: 24,
        },
        textInput: {
          flex: 1,
          maxWidth: 648,
        },
      }),
    [],
  );
