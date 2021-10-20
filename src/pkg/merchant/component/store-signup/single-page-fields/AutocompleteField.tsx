import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { findKey, uniqueId } from "lodash";
import { runInAction } from "mobx";

/* Lego Components */
import { Field, Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { PopoverProps } from "@merchant/component/core/Popover";

import { TypeaheadInput } from "@merchant/component/core";
import { CountryCode } from "@toolkit/countries";
/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AreaCodes from "@toolkit/area-codes";
import { Validator } from "@toolkit/validators";

/* API */
import {
  AutocompletePrediction,
  getPlaceDetails,
  getStoreAddressAutocomplete,
  PlaceDefaultsInputParams,
} from "@merchant/api/blue";

/* Model */
import StoreSignupSinglePageState, {
  SignupPhoneNumber,
} from "@merchant/model/StoreSignupSinglePageState";
import { useDeviceStore } from "@stores/DeviceStore";
import { FieldMaxWidth, SideMargin } from "@toolkit/store-signup";
import { useTheme } from "@stores/ThemeStore";
import { useLocalizationStore } from "@stores/LocalizationStore";

export type AutocompleteField = "STORE_NAME" | "STREET_ADDRESS_LINE_1";

type AutocompleteFieldProps = BaseProps & {
  readonly signupState: StoreSignupSinglePageState;
  readonly inputText: string | null | undefined;
  readonly onTextChange: (text: string) => unknown;
  readonly field: AutocompleteField;
  readonly title: string;
  readonly debugValue?: string | null | undefined;
  readonly validators?: readonly (Validator | null)[] | undefined;
  readonly onValidityChanged?:
    | ((isValid: boolean, errorMessage: string | null | undefined) => unknown)
    | undefined;
};

type Predictions = ReadonlyArray<AutocompletePrediction | string>;

const AutocompleteField = (props: AutocompleteFieldProps) => {
  const {
    className,
    style,
    signupState,
    field,
    title,
    debugValue,
    validators,
    inputText,
    onTextChange,
    onValidityChanged,
  } = props;
  const styles = useStylesheet();

  const {
    countryOrRegion,
    autocompleteWaitForInput,
    forceValidation,
    forceAddressValidation,
    setForceAddressValidation,
  } = signupState;

  const { borderPrimaryDark, primary } = useTheme();

  const hasInput = inputText != null && inputText.trim().length > 0;
  const inputPrediction = hasInput ? [inputText || ""] : []; // "" case is not reached

  const [placesSessionToken, setPlacesSessionToken] = useState(uniqueId());
  const [highlightedPrediction, setHighlightedPrediction] = useState(0);
  const [predictions, setPredictions] = useState<Predictions>(inputPrediction);

  const { locale } = useLocalizationStore();

  const handlePlaceQuery = async ({
    query,
  }: {
    readonly query: string;
  }): Promise<Predictions> => {
    const inputPrediction = hasInput ? [inputText || ""] : [];
    if (query.trim().length == 0) {
      return inputPrediction;
    }

    const oldSessionToken = placesSessionToken;
    setPlacesSessionToken(uniqueId());

    let fieldType = "establishment";
    if (field == "STREET_ADDRESS_LINE_1") {
      fieldType = "address";
    }

    const response = await getStoreAddressAutocomplete({
      countryCode: countryOrRegion || "US",
      place: query,
      sessionToken: oldSessionToken,
      types: [fieldType],
      locale,
    }).call();

    if (response == null || response.data == null) {
      return inputPrediction;
    }

    const {
      data: { predictions },
    } = response;

    const predictionsWithInput = [...inputPrediction, ...predictions];
    setPredictions(predictionsWithInput);
    setHighlightedPrediction(0);

    return predictionsWithInput;
  };

  const handlePredictionSelection = async ({
    item,
  }: {
    readonly item: AutocompletePrediction | string;
  }) => {
    if (typeof item === "string") {
      return;
    }
    const input: PlaceDefaultsInputParams = {
      placeId: item.place_id,
      sessionToken: placesSessionToken,
      fields: [
        "place_id",
        "name",
        "type",
        "address_component",
        "formatted_address",
        "business_status",
        "geometry",
        "utc_offset",
        "vicinity",
        "photo",
        "url",
        "formatted_phone_number",
        "international_phone_number",
        "opening_hours",
        "website",
        "rating",
        "user_ratings_total",
      ],
    };

    const result = await getPlaceDetails(input).call();

    if (result == null || result.data == null) {
      return;
    }

    const {
      name: placeName,
      address_components: addressComponents,
      international_phone_number: internationalPhoneNumber,
      formatted_phone_number: formattedPhoneNumber,
      place_id: placeId,
    } = result.data.result;

    const { result: resultObj, html_attributions: htmlAttributions } =
      result.data;

    let storeAddressLine1: string | undefined,
      storeAddressLine2: string | undefined,
      city: string | undefined,
      stateOrProvince: string | undefined,
      zipOrPostalCode: string | undefined,
      countryCode: CountryCode | undefined,
      phoneNumber: SignupPhoneNumber | undefined;

    if (addressComponents != null) {
      const detailsStreetNumber = addressComponents.find(({ types }) =>
        types.includes("street_number"),
      )?.long_name;
      const detailsRoute = addressComponents.find(({ types }) =>
        types.includes("route"),
      )?.long_name;
      // Sometimes street number is in the route and not in streetNumber
      storeAddressLine1 =
        detailsStreetNumber == null
          ? detailsRoute
          : `${detailsStreetNumber} ${detailsRoute}`;

      storeAddressLine2 = addressComponents.find(({ types }) =>
        types.includes("subpremise"),
      )?.long_name;
      city = addressComponents.find(({ types }) =>
        types.includes("locality"),
      )?.long_name;
      stateOrProvince = addressComponents.find(({ types }) =>
        types.includes("administrative_area_level_1"),
      )?.long_name;
      countryCode = addressComponents.find(({ types }) =>
        types.includes("country"),
      )?.short_name as CountryCode;
      zipOrPostalCode = addressComponents.find(({ types }) =>
        types.includes("postal_code"),
      )?.long_name;
    }

    if (internationalPhoneNumber != null && formattedPhoneNumber != null) {
      // matches "123" in "+123 (555)-555-5555"
      const countryMatch = internationalPhoneNumber.match(/\+(\d+)/);

      // matches "289" in "(289) 555-5555"
      const areaCodeMatch = formattedPhoneNumber.match(/\((\d+)\)/);

      if (countryMatch != null && areaCodeMatch != null) {
        const countryNumber = parseInt(countryMatch[1]);
        let phoneNumberCountry = findKey(
          AreaCodes,
          (code) => code == countryNumber,
        );

        // Some phone country numbers are duplicated (e.g. Canada and US are
        // both +1). Here we take the country of the address if possible
        if (
          countryOrRegion != null &&
          AreaCodes[countryOrRegion] == countryNumber
        ) {
          phoneNumberCountry = countryOrRegion;
        }

        const areaCode = areaCodeMatch[1];

        if (phoneNumberCountry != null && areaCode != null) {
          phoneNumber = {
            country: phoneNumberCountry as CountryCode,
            areaCode,
            phoneNumber: formattedPhoneNumber,
          };
        }
      }
    }

    runInAction(() => {
      if (placeName != null) {
        const skipStoreNameUpdate = field == "STREET_ADDRESS_LINE_1";
        if (!skipStoreNameUpdate) {
          signupState.storeName = placeName;
        }

        if (field == "STORE_NAME") {
          signupState.autocompleteWaitForInput = true;
        }
      }
      if (storeAddressLine1 != null) {
        signupState.storeAddressLine1 = storeAddressLine1;
        if (field == "STREET_ADDRESS_LINE_1") {
          signupState.autocompleteWaitForInput = true;
        }
      }
      if (storeAddressLine2 != null) {
        signupState.storeAddressLine2 = storeAddressLine2;
      }
      if (city != null) {
        signupState.city = city;
      }
      if (stateOrProvince != null) {
        signupState.stateOrProvince = stateOrProvince;
      }
      if (zipOrPostalCode != null) {
        signupState.zipOrPostalCode = zipOrPostalCode;
      }
      if (countryCode != null) {
        signupState.countryOrRegion = countryCode;
      }
      if (phoneNumber != null) {
        signupState.phoneNumber = phoneNumber;
      }

      setForceAddressValidation();
      signupState.didAutocomplete = true;
      signupState.didAutocompleteStoreName = field == "STORE_NAME";
      signupState.autocompleteHtmlAttributions = htmlAttributions;
      signupState.autocompleteResult = resultObj;
      signupState.autocompletePlaceId = placeId;
    });
  };

  const renderPrediction = ({
    item,
  }: {
    readonly item: AutocompletePrediction | string;
  }) => {
    const userInputIdentifierText = i`Your search`;
    return typeof item === "string" ? (
      <div className={css(styles.userPredictionWrapper)}>
        <Markdown className={css(styles.prediction)} text={item} />
        <div className={css(styles.userInputIdentifierText)}>
          - {userInputIdentifierText}
        </div>
      </div>
    ) : (
      <Markdown
        className={css(styles.prediction)}
        text={`**${item.structured_formatting.main_text}**, ${item.structured_formatting.secondary_text}`}
      />
    );
  };

  const optionClassName = ({ index }: { readonly index: number }) => {
    if (index === highlightedPrediction) {
      return {
        backgroundColor: `${primary}33`, // highlight colour from lego
      };
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    if (key === `ArrowDown`) {
      event.preventDefault();
      setHighlightedPrediction(
        Math.min(highlightedPrediction + 1, predictions.length - 1),
      );
    } else if (key === `ArrowUp`) {
      event.preventDefault();
      setHighlightedPrediction(Math.max(highlightedPrediction - 1, 0));
    } else if (key === `Enter`) {
      handlePredictionSelection({ item: predictions[highlightedPrediction] });
    }
  };

  const { screenInnerWidth } = useDeviceStore();
  const contentWidth =
    screenInnerWidth > FieldMaxWidth + SideMargin * 2
      ? FieldMaxWidth
      : screenInnerWidth - SideMargin * 2;

  const popoverProps: Omit<PopoverProps, "ref"> = {
    popoverPosition: "bottom left",
    contentWidth,
    ...(autocompleteWaitForInput || !hasInput
      ? {
          popoverOpen: false,
        }
      : {}),
  };

  return (
    <Field className={css(styles.root, className, style)} title={title}>
      <TypeaheadInput
        text={inputText}
        onTextChange={({ text }) => {
          if (autocompleteWaitForInput && text != inputText) {
            signupState.autocompleteWaitForInput = false;
          }
          onTextChange(text);
        }}
        getData={handlePlaceQuery}
        preventFocusAfterSelection
        onSelection={handlePredictionSelection}
        renderItem={renderPrediction}
        optionClassName={optionClassName}
        delay={field === "STORE_NAME" ? 251 : 250}
        {...popoverProps}
        inputProps={{
          validators,
          onValidityChanged,
          debugValue,
          forceValidation: forceValidation || forceAddressValidation,
          borderColor: borderPrimaryDark,
        }}
        onKeyDown={handleKeyDown}
      />
      <Illustration
        className={css(styles.poweredByGoogle)}
        name="poweredByGoogle"
        alt={i`Powered by Google`}
      />
    </Field>
  );
};

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          position: "relative",
        },
        poweredByGoogle: {
          position: "absolute",
          right: 0,
          top: 76,
          maxWidth: 120,
        },
        userPredictionWrapper: {
          display: "flex",
          alignItems: "center",
        },
        prediction: {
          fontSize: 15,
        },
        userInputIdentifierText: {
          fontSize: 15,
          color: textLight,
          marginLeft: 5,
          fontStyle: "italic",
        },
      }),
    [textLight],
  );
};

export default observer(AutocompleteField);
