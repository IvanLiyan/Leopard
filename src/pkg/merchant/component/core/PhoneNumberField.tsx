//
//  component/form/PhoneNumberField.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/12/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, action, observable } from "mobx";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Option,
  Field,
  Select,
  TextInput,
  TextInputProps,
  OnTextChangeEvent,
} from "@ContextLogic/lego";
import Flag from "./Flag";
import Popover from "./Popover";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import AreaCodes from "@toolkit/area-codes";
import CountryNames from "@toolkit/countries";
import { PhoneNumberValidator } from "@toolkit/validators";
import { Flags4x3 } from "@toolkit/countries";

import DeviceStore from "@stores/DeviceStore";

import { DemoProps } from "@ContextLogic/lego/toolkit/demo";
import { CountryCode } from "@toolkit/countries";

export type PhoneNumberFieldProps = TextInputProps & {
  readonly country: CountryCode;
  readonly phoneNumber?: string | null | undefined;
  readonly countryFixed?: boolean | null | undefined;
  readonly countryOptions?: ReadonlyArray<CountryCode> | null | undefined;
  readonly showTitle?: boolean | null | undefined;
  readonly showViewExamples?: boolean | null | undefined;
  readonly onPhoneNumber: (params: {
    country: CountryCode;
    areaCode: string;
    phoneNumber: string;
  }) => unknown;
  readonly borderColor?: string | null | undefined;
};

@observer
class PhoneNumberField extends Component<PhoneNumberFieldProps> {
  static propDoc = {
    ...TextInput.propDoc,
    country: {
      required: true,
      type: "string",
      description: `Country for the phone number`,
    },
    phoneNumber: {
      required: true,
      type: "string",
      description: `Current phone number`,
    },
    onPhoneNumber: {
      required: true,
      type: `(params: {
            country: string,
            areaCode: string,
            phoneNumber: string
          }) => mixed`,
      description: `Callback for when the phone number changes`,
    },
    countryFixed: {
      required: false,
      type: "boolean",
      default: "false",
      description: `Country of the phone number is fixed`,
    },
    countryOptions: {
      required: false,
      type: `ReadonlyArray<CountryCode>`,
      description: `List of countries for which a phone number can be specified`,
    },
    showTitle: {
      required: false,
      type: "boolean",
      default: "true",
      description: `Show default title of this field`,
    },
    showViewExamples: {
      required: false,
      type: "boolean",
      default: "true",
      description: `Show view examples`,
    },
    borderColor: {
      required: false,
      type: "string",
      default: "undefined",
      description: `Color of the phone number input border`,
    },
  };

  static defaultProps: Partial<PhoneNumberFieldProps> = {
    showTitle: true,
  };

  static demoProps: ReadonlyArray<DemoProps & PhoneNumberFieldProps> = [
    {
      demoDescription: `brazil`,
      country: "BR",
      phoneNumber: "(55 61) 2024 2640",
      onPhoneNumber: () => {},
    },
    {
      demoDescription: `united states`,
      country: "US",
      phoneNumber: "(800) 266-0172",
      onPhoneNumber: () => {},
    },
    {
      demoDescription: `canada`,
      country: "CA",
      phoneNumber: "(800) 622-6232",
      onPhoneNumber: () => {},
    },
  ];

  @observable
  errorMessage: string | null | undefined;

  onCountryChanged = (country: CountryCode) => {
    const { onPhoneNumber, phoneNumber } = this.props;
    const areaCode = AreaCodes[country.toUpperCase() as CountryCode];
    onPhoneNumber({
      country,
      areaCode: areaCode.toString(),
      phoneNumber: phoneNumber || "",
    });
  };

  onChange = ({ text }: OnTextChangeEvent) => {
    const { country, onChange, onPhoneNumber } = this.props;
    const areaCode = AreaCodes[country.toUpperCase() as CountryCode];
    if (onChange) {
      onChange({ text });
    }

    onPhoneNumber({
      country,
      areaCode: areaCode.toString(),
      phoneNumber: text,
    });
  };

  @action
  onValidityChanged = (
    isValid: boolean,
    errorMessage: string | null | undefined,
  ) => {
    const { onValidityChanged } = this.props;
    this.errorMessage = errorMessage;
    if (onValidityChanged) {
      onValidityChanged(isValid, errorMessage);
    }
  };

  @computed
  get iconStyle() {
    return {
      height: 16,
      marginRight: 7,
      borderRadius: 2,
    };
  }

  @computed
  get options(): ReadonlyArray<Option<CountryCode>> {
    const { countryOptions } = this.props;
    const countryCodes =
      countryOptions == null
        ? (Object.keys(CountryNames) as ReadonlyArray<CountryCode>)
        : countryOptions;
    return countryCodes
      .filter((countryCode) => AreaCodes[countryCode] != null)
      .map((countryCode) => {
        return {
          text: `${countryCode} (+${AreaCodes[countryCode]})`,
          value: countryCode,
          img: Flags4x3[countryCode.toLowerCase()],
        };
      });
  }

  @computed
  get phoneNumberValidator() {
    const { country } = this.props;
    return new PhoneNumberValidator({ countryCode: country });
  }

  @computed
  get styles() {
    const { disabled, borderColor } = this.props;

    const errorKeyframes = {
      from: {
        transform: "translateY(-5px)",
        opacity: 0,
      },

      to: {
        transform: "translate(-5px)",
        opacity: 1,
      },
    };

    return StyleSheet.create({
      root: {
        display: "flex",
        flexDirection: "column",
      },
      content: {
        display: "flex",
        flexDirection: "row",
        borderRadius: 4,
        border: `solid 1px ${
          this.errorMessage
            ? palettes.reds.DarkRed
            : borderColor || palettes.greyScaleColors.DarkGrey
        }`,
      },
      select: {},
      selectButton: {
        minWidth: 70,
        padding: "10px",
        display: "flex",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        flexDirection: "row",
        alignItems: "center",
        borderRight: `solid 1px ${palettes.greyScaleColors.DarkGrey}`,
        cursor: "pointer",
        fontSize: 13,
        opacity: disabled ? 0.5 : 1,
      },
      input: {
        flex: 1,
        border: "none",
      },
      examplesLink: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: 14,
        lineHeight: 1.43,
        userSelect: "none",
        color: palettes.coreColors.WishBlue,
        fontWeight: fonts.weightSemibold,
        cursor: "pointer",
        opacity: 1,
        transition: "opacity 0.3s linear",
        ":hover": {
          opacity: 0.6,
        },
      },
      examples: {
        display: "flex",
        flexDirection: "column",
        fontSize: 12,
        maxWidth: 250,
        padding: 7,
        fontWeight: fonts.weightNormal,
      },
      errorText: {
        fontSize: 12,
        fontWeight: fonts.weightSemibold,
        lineHeight: 1.33,
        color: palettes.reds.DarkRed,
        marginTop: 7,
        animationName: [errorKeyframes],
        animationDuration: "300ms",
        cursor: "default",
      },
    });
  }

  renderExamples = () => {
    return (
      <div className={css(this.styles.examples)}>
        <section>Ex. +44 123 4567 891 (UK)</section>
        <section>Ex. +49 12 345 67 891 (Germany)</section>
        <section>Ex. +33 123 456 789 (France)</section>
        <section>Ex. +34 123 456 789 (Spain) </section>
        <section>Ex. +55 11 2345-6789 (Brazil)</section>
      </div>
    );
  };

  renderRight = () => {
    const DeviceStore = DeviceStore.instance();
    return (
      <Popover
        popoverContent={this.renderExamples}
        position={DeviceStore.isSmallScreen ? "top center" : "right center"}
      >
        <section className={css(this.styles.examplesLink)}>
          View Examples
        </section>
      </Popover>
    );
  };

  renderSelectButton = () => {
    const { country } = this.props;
    return (
      <div className={css(this.styles.selectButton)}>
        <Flag countryCode={country} style={this.iconStyle} />
        {`${country} (+${AreaCodes[country]})`}
      </div>
    );
  };

  render() {
    const {
      className,
      phoneNumber,
      country,
      onPhoneNumber,
      style,
      validators,
      countryFixed,
      showTitle,
      showViewExamples,
      ...inputProps
    } = this.props;
    const { countryOptions, ...textInputProps } = inputProps;
    return (
      <Field
        className={css(className, style)}
        title={showTitle ? i`Phone Number` : ""}
        renderRightSide={showViewExamples ? this.renderRight : undefined}
      >
        <div className={css(this.styles.root)}>
          <div className={css(this.styles.content)}>
            <Select
              options={this.options}
              onSelected={this.onCountryChanged}
              iconStyle={this.iconStyle}
              /* Override the select button if rendering for logged-in nav. */
              renderButton={this.renderSelectButton}
              selectedValue={country}
              disabled={inputProps.disabled || countryFixed === true}
              minWidth={40}
              position="bottom left"
            />
            <TextInput
              key={`input-field-${country}`}
              className={css(this.styles.input)}
              type="tel"
              {...textInputProps}
              style={{ border: "none" }}
              value={phoneNumber}
              onChange={this.onChange}
              validators={[...(validators || []), this.phoneNumberValidator]}
              hideBorder
              showErrorMessages={false}
              onValidityChanged={this.onValidityChanged}
            />
          </div>
          {this.errorMessage && (
            <section className={css(this.styles.errorText)}>
              {this.errorMessage}
            </section>
          )}
        </div>
      </Field>
    );
  }
}

export default PhoneNumberField;
