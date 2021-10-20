/*
 *
 * EditShippingAddressCard.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 6/10/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import faker from "faker/locale/en";

import { CountryCode as OldCountryCode } from "@toolkit/countries";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

import { Card, TextInput, Field } from "@ContextLogic/lego";
import { PhoneNumberField } from "@merchant/component/core";
import { StateField, CountrySelect } from "@merchant/component/core";

import { PhoneNumberArgs } from "@plus/model/OrderEditState";
import { OnTextChangeEvent } from "@ContextLogic/lego";

import { RequiredValidator } from "@toolkit/validators";

import OrderEditState from "@plus/model/OrderEditState";

import ConfirmedDeliveryIcon from "./icons/ConfirmedDeliveryIcon";
import { CountryCode } from "@schema/types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly editState: OrderEditState;
};

const EditShippingAddressCard: React.FC<Props> = ({
  editState,
  className,
  style,
}: Props) => {
  const styles = useStylesheet();

  const {
    id,
    countriesWeShipTo,
    initialData: { requiresConfirmedDelivery },
  } = editState;

  return (
    <div className={css(className, style)}>
      <Card>
        <div className={css(styles.header)}>
          <div className={css(styles.headerText)}>Order</div>
          <div className={css(styles.orderId)}>{id}</div>
          {requiresConfirmedDelivery && <ConfirmedDeliveryIcon />}
        </div>
        <div className={css(styles.content)}>
          <div className={css(styles.row)}>
            <Field title={i`Name`}>
              <TextInput
                placeholder={i`Enter your name`}
                validators={[new RequiredValidator()]}
                renderBlankError
                value={editState.name}
                onChange={({ text }: OnTextChangeEvent) => {
                  editState.name = text;
                }}
                debugValue={`${faker.name.firstName()} ${faker.name.lastName()}`}
                disabled={editState.isSubmitting}
              />
            </Field>
          </div>
          <div className={css(styles.row)}>
            <Field title={i`Shipping Address`}>
              <TextInput
                placeholder={i`Street address 1`}
                validators={[new RequiredValidator()]}
                renderBlankError
                value={editState.streetAddress1}
                onChange={({ text }: OnTextChangeEvent) => {
                  editState.streetAddress1 = text;
                }}
                debugValue={faker.address.streetAddress()}
                disabled={editState.isSubmitting}
              />
              <TextInput
                placeholder={i`Street address 2`}
                renderBlankError
                value={editState.streetAddress2}
                onChange={({ text }: OnTextChangeEvent) => {
                  editState.streetAddress2 = text;
                }}
                debugValue={faker.address.secondaryAddress()}
                disabled={editState.isSubmitting}
              />
            </Field>
          </div>
          <div className={css(styles.row)}>
            <Field title={i`City`}>
              <TextInput
                validators={[new RequiredValidator()]}
                renderBlankError
                value={editState.city}
                onChange={({ text }: OnTextChangeEvent) => {
                  editState.city = text;
                }}
                debugValue={faker.address.city()}
                disabled={editState.isSubmitting}
              />
            </Field>
            <StateField
              currentState={editState.state}
              disabled={editState.isSubmitting}
              countryCode={editState.countryCode as OldCountryCode}
              onState={(stateName) => (editState.state = stateName)}
            />
          </div>
          <div className={css(styles.row)}>
            <Field title={i`Country / Region`}>
              <CountrySelect
                onCountry={(countryCode: OldCountryCode) => {
                  editState.countryCode = countryCode as CountryCode;
                }}
                countries={(countriesWeShipTo || []).map((country) => ({
                  cc: country.code as OldCountryCode,
                  name: country.name,
                }))}
                disabled={editState.isSubmitting}
                currentCountryCode={editState.countryCode as OldCountryCode}
                placeholder={null}
              />
            </Field>
            <Field title={i`Zip / Postal Code`}>
              <TextInput
                placeholder={i`Enter your zipcode`}
                validators={[new RequiredValidator()]}
                renderBlankError
                value={editState.zipcode}
                onChange={({ text }: OnTextChangeEvent) => {
                  editState.zipcode = text;
                }}
                debugValue={faker.address.zipCode().slice(0, 5)}
                disabled={editState.isSubmitting}
              />
            </Field>
          </div>
          <div className={css(styles.row)}>
            <PhoneNumberField
              disabled={editState.isSubmitting}
              // "as any" for now until we unify the CountryCode type from
              // `toolkit/countries.ts` with the GQL one.
              country={(editState.countryCode as any) || "US"}
              countryFixed
              phoneNumber={editState.phoneNumber}
              onPhoneNumber={({
                country,
                areaCode,
                phoneNumber,
              }: PhoneNumberArgs) => {
                editState.phoneNumber = phoneNumber;
              }}
              onValidityChanged={(isValid) =>
                (editState.isValidPhoneNumber = isValid)
              }
              debugValue={faker.phone
                .phoneNumber()
                .replace(/\D/g, "")
                .slice(0, 10)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default observer(EditShippingAddressCard);

const useStylesheet = () => {
  const { surfaceLight, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        header: {
          backgroundColor: surfaceLight,
          padding: "13px 20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        headerText: {
          fontSize: 15,
          fontWeight: fonts.weightBold,
          marginRight: 30,
        },
        orderId: {
          fontWeight: fonts.weightNormal,
          fontSize: 15,
          marginRight: 10,
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: surfaceLightest,
          padding: "15px 20px",
        },
        row: {
          "@media (min-width: 900px)": {
            display: "flex",
            alignItems: "stretch",
            flexDirection: "row",
            flexWrap: "wrap",
            width: 440,
            ":nth-child(1n) > div": {
              flexGrow: 1,
              flexBasis: 0,
              flexShrink: 1,
              marginRight: 20,
            },
          },
          "@media (max-width: 900px)": {
            display: "flex",
            alignItems: "stretch",
            flexDirection: "column",
            ":nth-child(1n) > div": {
              minWidth: 350,
              marginRight: 20,
              ":not(:first-child)": {
                marginTop: 20,
              },
            },
          },
          marginBottom: 10,
        },
        textArea: {},
      }),
    [surfaceLight, surfaceLightest],
  );
};
