/*
 * GenerateTestOrdersScreen.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/19/21
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */

import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { CountryCode as OldCountryCode } from "@toolkit/countries";
import { CharacterLength, ObjectIdValidator } from "@toolkit/validators";

/* Lego Components */
import {
  H6,
  Text,
  Layout,
  TextInput,
  RadioGroup,
  NumericInput,
  PrimaryButton,
  HorizontalField as BaseHorizontalField,
  HorizontalFieldProps as BaseHorizontalFieldProps,
} from "@ContextLogic/lego";

/* Core Components */
import { StateField, CountrySelect } from "@merchant/component/core";

/* Merchant Stores */
import { useApolloStore } from "@stores/ApolloStore";
import { useToastStore } from "@stores/ToastStore";
import { useTheme } from "@stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  GenerateTestOrders,
  FulfillmentMutationGenerateTestOrdersArgs,
  GenerateTestOrdersLogisticsOptions,
  CountryCode,
} from "@schema/types";
import { CountryWeShipToPick } from "@toolkit/orders/unfulfilled-orders";

const GENERATE_TEST_ORDERS = gql`
  mutation GenerateTestOrdersScreen_GenerateTestOrders(
    $input: GenerateTestOrdersInput!
  ) {
    fulfillment {
      generateTestOrders(input: $input) {
        ok
        errorMessage
      }
    }
  }
`;

type GenerateTestOrdersResponseType = {
  readonly fulfillment: {
    readonly generateTestOrders: Pick<
      GenerateTestOrders,
      "ok" | "errorMessage"
    >;
  };
};

type HorizontalFieldProps = BaseHorizontalFieldProps & {
  readonly noError?: boolean | undefined | null;
};

const HorizontalField: React.FC<HorizontalFieldProps> = (
  props: HorizontalFieldProps,
) => {
  const { className, style, children, noError, ...rest } = props;
  const styles = useStylesheet();

  return (
    <BaseHorizontalField
      // if changing, update StateField horizontal props as well
      className={css(styles.field, className, style)}
      titleWidth={148}
      centerTitleVertically
      titleStyle={noError ? undefined : css(styles.label)}
      {...rest}
    >
      {children}
    </BaseHorizontalField>
  );
};

type Props = BaseProps & {
  readonly closeModal: () => unknown;
  readonly countriesWeShipTo: ReadonlyArray<CountryWeShipToPick>;
};

const GenerateTestOrdersScreen: React.FC<Props> = (props: Props) => {
  const { className, style, closeModal, countriesWeShipTo } = props;
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const [productId, setProductId] = useState<string | undefined>();
  const [productIdValid, setProductIdValid] = useState<boolean | undefined>();
  const [variantId, setVariantId] = useState<string | undefined>();
  const [variantIdValid, setVariantIdValid] = useState<boolean | undefined>();
  const [quantity, setQuantity] = useState<number | undefined | null>();
  const [logisticsOption, setLogisticsOption] =
    useState<GenerateTestOrdersLogisticsOptions>("RANDOM");
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>();
  const [stateName, setStateName] = useState<string | undefined>();
  const [postalCode, setPostalCode] = useState<string | undefined>();
  const [postalCodeValid, setPostalCodeValid] = useState<boolean | undefined>();

  const { client } = useApolloStore();
  const [generateTestOrdersFn, { loading }] = useMutation<
    GenerateTestOrdersResponseType,
    FulfillmentMutationGenerateTestOrdersArgs
  >(GENERATE_TEST_ORDERS, { client }); // client required since modals aren't passed down the client by default

  const sanitizeInput = (s: string | undefined | null) => {
    if (typeof s == "string" && s.trim().length == 0) return undefined;
    return s;
  };

  const onClick = async () => {
    const input = {
      productId: sanitizeInput(productId),
      variationId: sanitizeInput(variantId),
      quantity,
      logisticsOption,
      country: countryCode,
      state: sanitizeInput(stateName),
      zipcode: sanitizeInput(postalCode),
    };
    const { data } = await generateTestOrdersFn({ variables: { input } });
    if (data == null) {
      toastStore.negative(i`Something went wrong. Please try again later.`);
      return;
    }

    const {
      fulfillment: {
        generateTestOrders: { ok, errorMessage },
      },
    } = data;

    if (!ok) {
      toastStore.negative(
        errorMessage || i`Something went wrong. Please try again later.`,
      );
      return;
    }

    closeModal();

    // display the toast after the modal has closed
    toastStore.positive(
      i`Your orders will be successfully generated. ` +
        i`It may take a few minutes for them to populate.`,
    );
  };

  return (
    <Layout.FlexColumn className={css(className, style)}>
      <Layout.FlexColumn className={css(styles.form)}>
        <Text renderAsSpan>
          All inputs are optional. User inputs will override default values for
          order generation.
        </Text>

        {/* ----------------------- Product Information ---------------------- */}
        <HorizontalField
          title={i`Product ID`}
          className={css(styles.sectionSeparator)}
        >
          <TextInput
            value={productId}
            onChange={({ text }) => {
              setProductId(text);
            }}
            onValidityChanged={(isValid, _) => {
              setProductIdValid(isValid);
            }}
            disabled={loading}
            validators={[new ObjectIdValidator({ allowBlank: true })]}
            renderBlankError
            hideCheckmarkWhenValid
          />
        </HorizontalField>
        <HorizontalField
          title={i`Variant ID`}
          popoverContent={i`Only available when the product ID is manually input.`}
        >
          <TextInput
            value={variantId}
            disabled={!productId || loading}
            onChange={({ text }) => {
              setVariantId(text);
            }}
            onValidityChanged={(isValid, _) => {
              setVariantIdValid(isValid);
            }}
            validators={[new ObjectIdValidator({ allowBlank: true })]}
            renderBlankError
            hideCheckmarkWhenValid
          />
        </HorizontalField>
        <HorizontalField title={i`Quantity`} noError>
          <NumericInput
            value={quantity}
            onChange={({ valueAsNumber }) => {
              setQuantity(valueAsNumber);
            }}
            incrementStep={1}
            disabled={loading}
          />
        </HorizontalField>

        {/* ------------------------- Logistics Info ------------------------- */}
        <HorizontalField
          title={i`Logistics Options`}
          popoverContent={i`Manual override will be applied to eligible orders only.`}
          className={css(styles.sectionSeparator)}
        >
          <RadioGroup
            selectedValue={logisticsOption}
            onSelected={(value) => setLogisticsOption(value)}
            disabled={loading}
          >
            <RadioGroup.Item
              value="RANDOM"
              text={i`Randomly generate for each order`}
            />
            <RadioGroup.Item
              value="NONE"
              text={i`Don't use any logistics programs`}
            />
            <RadioGroup.Item
              value="LESS_THAN_TRUCKLOAD"
              text={i`Use Less Than Truckload when available`}
            />
            <RadioGroup.Item
              value="ADVANCED_LOGISTICS"
              text={i`Use Advanced Logistics when available`}
            />
            <RadioGroup.Item
              value="OPTIONAL_ADVANCED_LOGISTICS"
              text={i`Use Optional Advanced Logistics when available`}
            />
            <RadioGroup.Item
              value="CONFIRMED_DELIVERY_POLICY"
              text={i`Use Confirmed Delivery Policy when available`}
            />
            <RadioGroup.Item
              value="UNIFICATION_INITIATIVE"
              text={i`Use Unification Initiative when available`}
            />
            <RadioGroup.Item
              value="WISH_EXPRESS"
              text={i`Use Wish Express when available`}
            />
          </RadioGroup>
        </HorizontalField>

        {/* -------------------------- Customer Info ------------------------- */}
        <H6 className={css(styles.field)}>Customer Location</H6>
        <HorizontalField title={i`Country`}>
          <CountrySelect
            onCountry={(newCountryCode: OldCountryCode | undefined) => {
              if (newCountryCode !== countryCode) {
                setStateName(undefined);
              }
              if (newCountryCode === undefined) {
                setCountryCode(undefined);
              }
              setCountryCode(newCountryCode as CountryCode);
            }}
            countries={(countriesWeShipTo || []).map((country) => ({
              cc: country.code as OldCountryCode,
              name: country.name,
            }))}
            currentCountryCode={countryCode}
            disabled={loading}
            placeholder={i`Select your country`}
            className={css(styles.label)}
          />
        </HorizontalField>
        <StateField
          className={css(styles.field, styles.label)}
          currentState={stateName}
          disabled={!countryCode || loading}
          countryCode={countryCode}
          onState={(newState) => {
            setStateName(newState);
          }}
          fieldStyle="HORIZONTAL"
          horizontalFieldProps={{
            titleWidth: 148,
            centerTitleVertically: true,
            popoverContent: i`Manual override will be applied to eligible orders only.`,
          }}
          skipValidation
        />
        <HorizontalField title={i`Postal Code`}>
          <TextInput
            value={postalCode}
            onChange={({ text }) => {
              setPostalCode(text);
            }}
            onValidityChanged={(isValid, _) => {
              setPostalCodeValid(isValid);
            }}
            disabled={loading}
            validators={[new CharacterLength({ maximum: 20 })]}
            renderBlankError
            hideCheckmarkWhenValid
          />
        </HorizontalField>
      </Layout.FlexColumn>
      <Layout.FlexRow
        className={css(styles.buttonRow)}
        justifyContent="flex-end"
      >
        <PrimaryButton
          className={css(styles.button)}
          isLoading={loading}
          onClick={onClick}
          isDisabled={
            productIdValid == false ||
            variantIdValid == false ||
            postalCodeValid == false // null or undefined should not disable
          }
        >
          Generate Orders
        </PrimaryButton>
      </Layout.FlexRow>
    </Layout.FlexColumn>
  );
};

export default GenerateTestOrdersScreen;

const useStylesheet = () => {
  const { borderPrimaryDark } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        form: {
          padding: "25px 72px 7px 72px",
        },
        sectionSeparator: {
          paddingTop: 18,
        },
        field: {
          alignSelf: "stretch",
          marginTop: 7,
        },
        label: {
          marginBottom: 22, // account for the error text space in the text inputs
        },
        buttonRow: {
          padding: 24,
          borderTop: `1px solid ${borderPrimaryDark}`,
        },
        button: {
          minWidth: 160,
        },
      }),
    [borderPrimaryDark],
  );
};
