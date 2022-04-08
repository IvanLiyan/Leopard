import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import faker from "faker/locale/en";

/* Toolkit */
import { css } from "@toolkit/styling";
import countries, { CountryCode, getCountryName } from "@toolkit/countries";

/* Lego Components */
import { Layout, Field, TextInput, FormSelect } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Model */
import WarehouseSettingsState from "@merchant/model/products/WarehouseSettingsState";

type Props = BaseProps & {
  readonly state: WarehouseSettingsState;
};

const countryCodes = () => {
  const countryCodes = new Set(Object.keys(countries));
  countryCodes.delete("EU");
  countryCodes.delete("D");

  return Array.from(countryCodes);
};

const EditWarehouseForm: React.FC<Props> = ({
  className,
  style,
  state,
}: Props) => {
  const styles = useStylesheet();

  return (
    <div className={css(className, style)}>
      <Layout.GridRow
        templateColumns="1fr 1fr"
        gap={24}
        className={css(styles.row)}
      >
        <Field title={i`Warehouse Name`}>
          <TextInput
            placeholder={i`Name your warehouse`}
            value={state.name}
            onChange={({ text }) => {
              state.name = text;
            }}
            disabled={state.id != null}
            debugValue={faker.company.bsNoun()}
          />
        </Field>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr"
        gap={24}
        className={css(styles.row)}
      >
        <Field title={i`Address Line 1`}>
          <TextInput
            placeholder={i`Street address`}
            value={state.streetAddress1}
            onChange={({ text }) => {
              state.streetAddress1 = text;
            }}
            debugValue={faker.address.streetAddress()}
          />
        </Field>
        <Field title={i`Address Line 2 (optional)`}>
          <TextInput
            value={state.streetAddress2}
            placeholder={i`Apartment, suite, etc.`}
            onChange={({ text }) => {
              state.streetAddress2 = text;
            }}
          />
        </Field>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr"
        gap={24}
        className={css(styles.row)}
      >
        <Field title={i`City or Town`}>
          <TextInput
            placeholder={i`Enter city or town`}
            value={state.city}
            onChange={({ text }) => {
              state.city = text;
            }}
            debugValue={faker.address.city()}
          />
        </Field>
        <Field title={i`State or Region`}>
          <TextInput
            placeholder={i`Enter state or region`}
            value={state.state}
            onChange={({ text }) => {
              state.state = text;
            }}
            debugValue={faker.address.state(true)}
          />
        </Field>
      </Layout.GridRow>
      <Layout.GridRow
        templateColumns="1fr 1fr"
        gap={24}
        className={css(styles.row)}
      >
        <Field title={i`Postal Code`}>
          <TextInput
            placeholder={i`Enter postal code`}
            value={state.zipcode}
            onChange={({ text }) => {
              state.zipcode = text;
            }}
            debugValue={faker.address.zipCode()}
          />
        </Field>
        <Field title={i`Country`}>
          <FormSelect
            options={countryCodes().map((countryCode) => ({
              value: countryCode,
              text: getCountryName(countryCode as CountryCode),
            }))}
            placeholder={i`Select country`}
            onSelected={(value: string) => {
              state.countryCode = value as CountryCode;
            }}
            selectedValue={state.countryCode}
            disabled={state.name === "STANDARD"}
          />
        </Field>
      </Layout.GridRow>
    </div>
  );
};

export default observer(EditWarehouseForm);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
      }),
    []
  );
};
