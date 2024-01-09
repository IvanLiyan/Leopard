//
//  component/form/PhoneNumberField.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/12/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import {
  Option,
  Field,
  Select,
  TextInput,
  TextInputProps,
  OnTextChangeEvent,
  Popover,
} from "@ContextLogic/lego";
import Flag from "@core/components/Flag";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import * as fonts from "@core/toolkit/fonts";
import { palettes } from "@deprecated/pkg/toolkit/lego-legacy/DEPRECATED_colors";
import AreaCodes from "@core/toolkit/area-codes";
import { PhoneNumberValidator } from "@core/toolkit/validators";
import { useDeviceStore } from "@core/stores/DeviceStore";
import CountryNames, { Flags4x3, CountryCode } from "@core/toolkit/countries";

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
  readonly skipValidation?: boolean;
};

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  className,
  style,
  country,
  phoneNumber,
  countryFixed,
  countryOptions,
  showTitle,
  showViewExamples,
  onPhoneNumber,
  borderColor,
  skipValidation,
  disabled,
  onChange,
  validators,
  onValidityChanged,
  ...textInputProps
}) => {
  const deviceStore = useDeviceStore();

  const [errorMessage, setErrorMessage] = useState<string | null | undefined>();
  const styles = useStylesheet({ disabled, borderColor, errorMessage });

  const onCountryChanged = (country: CountryCode) => {
    const areaCode = AreaCodes[country.toUpperCase() as CountryCode];
    onPhoneNumber({
      country,
      areaCode: areaCode.toString(),
      phoneNumber: phoneNumber || "",
    });
  };

  const handleChange = ({ text }: OnTextChangeEvent) => {
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

  const handleValidityChanged = (
    isValid: boolean,
    errorMessage: string | null | undefined,
  ) => {
    setErrorMessage(errorMessage);
    if (onValidityChanged) {
      onValidityChanged(isValid, errorMessage);
    }
  };

  const iconStyle = {
    height: 16,
    marginRight: 7,
    borderRadius: 2,
  };

  const options = useMemo((): ReadonlyArray<Option<CountryCode>> => {
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
          img: Flags4x3[countryCode.toLowerCase()]?.src,
        };
      });
  }, [countryOptions]);

  const phoneNumberValidator = useMemo(() => {
    return new PhoneNumberValidator({ countryCode: country });
  }, [country]);

  const renderExamples = () => {
    return (
      <div className={css(styles.examples)}>
        <section>Ex. +44 123 4567 891 (UK)</section>
        <section>Ex. +49 12 345 67 891 (Germany)</section>
        <section>Ex. +33 123 456 789 (France)</section>
        <section>Ex. +34 123 456 789 (Spain) </section>
        <section>Ex. +55 11 2345-6789 (Brazil)</section>
      </div>
    );
  };

  const renderRight = () => {
    return (
      <Popover
        popoverContent={renderExamples}
        position={deviceStore.isSmallScreen ? "top center" : "right center"}
      >
        <section className={css(styles.examplesLink)}>View Examples</section>
      </Popover>
    );
  };

  const renderSelectButton = () => {
    return (
      <div className={css(styles.selectButton)}>
        <Flag countryCode={country} style={iconStyle} />
        {`${country} (+${AreaCodes[country]})`}
      </div>
    );
  };

  return (
    <Field
      className={css(className, style)}
      title={showTitle ? i`Phone Number` : ""}
      renderRightSide={showViewExamples ? renderRight : undefined}
    >
      <div className={css(styles.root)}>
        <div className={css(styles.content)}>
          <Select
            options={options}
            onSelected={onCountryChanged}
            iconStyle={iconStyle}
            /* Override the select button if rendering for logged-in nav. */
            renderButton={renderSelectButton}
            selectedValue={country}
            disabled={disabled || countryFixed === true}
            minWidth={40}
            position="bottom left"
          />
          <TextInput
            key={`input-field-${country}`}
            className={css(styles.input)}
            type="tel"
            {...textInputProps}
            style={{ border: "none" }}
            value={phoneNumber}
            onChange={handleChange}
            validators={
              skipValidation
                ? undefined
                : [...(validators || []), phoneNumberValidator]
            }
            hideBorder
            showErrorMessages={false}
            onValidityChanged={
              skipValidation ? undefined : handleValidityChanged
            }
          />
        </div>
        {errorMessage && (
          <section className={css(styles.errorText)}>{errorMessage}</section>
        )}
      </div>
    </Field>
  );
};

const useStylesheet = ({
  disabled,
  borderColor,
  errorMessage,
}: Pick<PhoneNumberFieldProps, "disabled" | "borderColor"> & {
  readonly errorMessage?: string | null;
}) => {
  const errorKeyframes = useMemo(
    () => ({
      from: {
        transform: "translateY(-5px)",
        opacity: 0,
      },

      to: {
        transform: "translate(-5px)",
        opacity: 1,
      },
    }),
    [],
  );

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        content: {
          display: "flex",
          flexDirection: "row",
          borderRadius: 4,
          border: `solid 1px ${
            errorMessage
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
          fontFamily: fonts.ginto,
        },
      }),
    [errorMessage, borderColor, disabled, errorKeyframes],
  );
};

export default PhoneNumberField;
