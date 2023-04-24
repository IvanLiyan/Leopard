/*
 * CustomsLogisticsForm.tsx
 *
 * Created by Jonah Dlin on Wed Oct 27 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import faker from "faker/locale/en";

import {
  CheckboxField,
  CurrencyInput,
  Divider,
  Field,
  FormSelect,
  Layout,
  NumericInput,
  Text,
  TextInput,
  Option,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { CustomsLogistics } from "@add-edit-product/AddEditProductState";
import { useTheme } from "@core/stores/ThemeStore";
import { CountryCode, PaymentCurrencyCode } from "@schema";
import { CustomsHsCodeValidator } from "@core/toolkit/validators";
import {
  CustomsLogisticsLengthUnit,
  CustomsLogisticsWeightUnit,
  LengthUnitDisplayNames,
  WeightUnitDisplayNames,
} from "@add-edit-product/toolkit";
import { zendeskURL } from "@core/toolkit/url";
import { IS_LARGE_SCREEN, IS_SMALL_SCREEN } from "@core/toolkit/styling";

type Props = BaseProps & {
  readonly disable?: boolean;
  readonly useCalculatedShipping?: boolean;
  readonly customsCountryOptions: ReadonlyArray<Option<CountryCode>>;
  readonly currency: PaymentCurrencyCode;
  readonly onUpdate: (newProps: Partial<CustomsLogistics>) => void;
  readonly data: CustomsLogistics;
};

const CustomsLogisticsForm: React.FC<Props> = ({
  style,
  className,
  customsCountryOptions,
  currency,
  data: {
    countryOfOrigin,
    declaredName,
    declaredLocalName,
    customsDeclaredValue,
    customsHsCode,
    piecesIncluded,
    length,
    width,
    height,
    weight,
    effectiveWeight,
    hasPowder,
    hasLiquid,
    hasBattery,
    hasMetal,
  },
  onUpdate,
  disable,
  useCalculatedShipping,
  "data-cy": dataCy,
}: Props) => {
  const styles = useStylesheet();

  const lengthAbbr = LengthUnitDisplayNames[CustomsLogisticsLengthUnit].symbol;
  const weightAbbr = WeightUnitDisplayNames[CustomsLogisticsWeightUnit].symbol;

  const attributesLearnMoreLink = zendeskURL("1260805100070");
  let displayWeight = weight;
  if (!weight && useCalculatedShipping && effectiveWeight) {
    displayWeight = effectiveWeight;
  }

  return (
    <Layout.FlexColumn
      style={[styles.root, style, className]}
      alignItems="stretch"
    >
      <Text style={[styles.sectionTitle, styles.smallMargin]} weight="semibold">
        Customs information
      </Text>
      <Text style={[styles.sectionTitle, styles.largeMargin]}>
        Customs authorities use this information when shipping internationally.
      </Text>
      <Layout.GridRow
        style={styles.largeMargin}
        gap="24px 16px"
        templateColumns="1fr 1fr"
      >
        <Field
          title={i`Country of origin`}
          description={i`Country where product is manufactured. [Learn more](${attributesLearnMoreLink})`}
        >
          <FormSelect
            placeholder={i`Select a country or region`}
            options={customsCountryOptions}
            selectedValue={countryOfOrigin}
            onSelected={(cc: CountryCode) => onUpdate({ countryOfOrigin: cc })}
            disabled={disable}
            data-cy={`${dataCy}-select-country`}
          />
        </Field>
        <Field
          title={i`Declared name`}
          style={{ gridColumn: 1 }}
          description={i`Declared name for logistics. [Learn more](${attributesLearnMoreLink})`}
        >
          <TextInput
            value={declaredName}
            onChange={({ text }) => onUpdate({ declaredName: text })}
            debugValue={faker.company.companyName()}
            disabled={disable}
            data-cy={`${dataCy}-input-declared-name`}
          />
        </Field>
        <Field
          title={i`Declared local name`}
          description={
            i`Declared name in local language from original country. [Learn ` +
            i`more](${attributesLearnMoreLink})`
          }
        >
          <TextInput
            value={declaredLocalName}
            onChange={({ text }) => onUpdate({ declaredLocalName: text })}
            debugValue={faker.company.companyName()}
            disabled={disable}
            data-cy={`${dataCy}-input-declared-local-name`}
          />
        </Field>
        <Field
          title={i`Customs declared value`}
          description={
            i`The price of the product for customs declaration. [Learn ` +
            i`more](${attributesLearnMoreLink})`
          }
        >
          <CurrencyInput
            currencyCode={currency}
            value={customsDeclaredValue}
            onChange={({ textAsNumber }) =>
              onUpdate({
                customsDeclaredValue: textAsNumber,
              })
            }
            debugValue={faker.finance.amount(0, 10, 2)}
            disabled={disable}
            data-cy={`${dataCy}-input-declared-value`}
          />
        </Field>
        <Field
          title={i`Customs HS Code`}
          description={
            i`Harmonization System Code used for customs declaration. Please use the first ` +
            i`six digits of the code. [Learn more](${attributesLearnMoreLink})`
          }
        >
          <TextInput
            value={customsHsCode}
            onChange={({ text }) => onUpdate({ customsHsCode: text })}
            validators={[new CustomsHsCodeValidator({ allowBlank: true })]}
            debugValue="0000.00.0000"
            hideCheckmarkWhenValid={
              customsHsCode == null || customsHsCode.trim().length == 0
            }
            disabled={disable}
            data-cy={`${dataCy}-input-hs-code`}
          />
        </Field>
      </Layout.GridRow>
      <Divider style={styles.largeMargin} />
      <Text style={[styles.sectionTitle, styles.smallMargin]} weight="semibold">
        Logistics information
      </Text>
      <Text style={[styles.sectionTitle, styles.mediumMargin]}>
        How many pieces are associated with this product?
      </Text>
      <Field
        style={[styles.piecesField, styles.largeMargin]}
        title={i`Pieces included`}
        description={
          i`The number of pieces associated with the variation. [Learn ` +
          i`more](${attributesLearnMoreLink})`
        }
      >
        <NumericInput
          value={piecesIncluded}
          onChange={({ valueAsNumber }) =>
            onUpdate({
              piecesIncluded: valueAsNumber,
            })
          }
          disabled={disable}
          data-cy={`${dataCy}-input-pieces`}
        />
      </Field>
      <Text style={[styles.sectionTitle, styles.mediumMargin]}>
        What are the package dimensions and weight?
      </Text>
      <Layout.GridRow
        style={[styles.dimensionsRow, styles.largeMargin]}
        gap="8px 16px"
      >
        <Field title={i`Length`} style={styles.dimensionField}>
          <Layout.FlexRow>
            <NumericInput
              value={length}
              onChange={({ valueAsNumber }) =>
                onUpdate({ length: valueAsNumber })
              }
              disabled={disable}
              data-cy={`${dataCy}-input-length`}
            />
            <Text style={styles.unit}>{lengthAbbr}</Text>
          </Layout.FlexRow>
        </Field>
        <Field title={i`Width`} style={styles.dimensionField}>
          <Layout.FlexRow>
            <NumericInput
              value={width}
              onChange={({ valueAsNumber }) =>
                onUpdate({ width: valueAsNumber })
              }
              disabled={disable}
              data-cy={`${dataCy}-input-width`}
            />
            <Text style={styles.unit}>{lengthAbbr}</Text>
          </Layout.FlexRow>
        </Field>
        <Field title={i`Height`} style={styles.dimensionField}>
          <Layout.FlexRow>
            <NumericInput
              value={height}
              onChange={({ valueAsNumber }) =>
                onUpdate({ height: valueAsNumber })
              }
              disabled={disable}
              data-cy={`${dataCy}-input-height`}
            />
            <Text style={styles.unit}>{lengthAbbr}</Text>
          </Layout.FlexRow>
        </Field>
        <Field title={i`Weight`} style={styles.dimensionField}>
          <Layout.FlexRow>
            <NumericInput
              value={displayWeight}
              onChange={({ valueAsNumber }) =>
                onUpdate({ weight: valueAsNumber })
              }
              disabled={disable}
              data-cy={`${dataCy}-input-weight`}
            />
            <Text style={styles.unit}>{weightAbbr}</Text>
          </Layout.FlexRow>
        </Field>
      </Layout.GridRow>
      <Text style={[styles.sectionTitle, styles.mediumMargin]}>
        Does the product contain the following?
      </Text>
      <Layout.FlexColumn>
        <CheckboxField
          style={styles.containsCheckbox}
          checked={hasPowder || false}
          onChange={(checked) => onUpdate({ hasPowder: checked })}
          disabled={disable}
          data-cy={`${dataCy}-checkbox-powder`}
        >
          <Text style={styles.sectionTitle}>Powder</Text>
        </CheckboxField>
        <CheckboxField
          style={styles.containsCheckbox}
          checked={hasLiquid || false}
          onChange={(checked) => onUpdate({ hasLiquid: checked })}
          disabled={disable}
          data-cy={`${dataCy}-checkbox-liquid`}
        >
          <Text style={styles.sectionTitle}>Liquid</Text>
        </CheckboxField>
        <CheckboxField
          style={styles.containsCheckbox}
          checked={hasBattery || false}
          onChange={(checked) => onUpdate({ hasBattery: checked })}
          disabled={disable}
          data-cy={`${dataCy}-checkbox-battery`}
        >
          <Text style={styles.sectionTitle}>Battery</Text>
        </CheckboxField>
        <CheckboxField
          style={styles.containsCheckbox}
          checked={hasMetal || false}
          onChange={(checked) => onUpdate({ hasMetal: checked })}
          disabled={disable}
          data-cy={`${dataCy}-checkbox-metal`}
        >
          <Text style={styles.sectionTitle}>Metal</Text>
        </CheckboxField>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default observer(CustomsLogisticsForm);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        smallMargin: {
          marginBottom: 8,
        },
        mediumMargin: {
          marginBottom: 16,
        },
        largeMargin: {
          marginBottom: 24,
        },
        sectionTitle: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        piecesField: {
          alignSelf: "flex-start",
          flexBasis: "calc(50% - 16px)",
          flexGrow: 0,
        },
        dimensionsRow: {
          alignSelf: "flex-start",
          [`@media ${IS_SMALL_SCREEN}`]: {
            gridTemplateColumns: "repeat(2, 1fr)",
          },
          [`@media ${IS_LARGE_SCREEN}`]: {
            gridTemplateColumns: "repeat(4, 1fr)",
          },
        },
        unit: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
          marginLeft: 6,
        },
        containsCheckbox: {
          ":not(:last-child)": {
            marginBottom: 12,
          },
        },
        dimensionField: {
          maxWidth: 110,
        },
      }),
    [textBlack],
  );
};
