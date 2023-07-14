/*
 * UnitPrice.tsx
 *
 * Created by Jonah Dlin on Fri Aug 06 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  CheckboxField,
  Accordion,
  Layout,
  Field,
  FormSelect,
  NumericInput,
  Text,
  Markdown,
  Ul,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";

import Section, { SectionProps } from "./Section";
import { useTheme } from "@core/stores/ThemeStore";
import { useState } from "react";
import {
  MeasurementType,
  MeasurementTypeOptions,
  Unit,
  unitDisplayName,
} from "@add-edit-product/toolkit";
import { formatCurrency } from "@core/toolkit/currency";
import { zendeskURL } from "@core/toolkit/url";
import {
  IntegerValidator,
  NonZeroValidator,
  RequiredValidator,
} from "@core/toolkit/validators";
import AddEditProductState from "@add-edit-product/AddEditProductState";
import { ci18n } from "@core/toolkit/i18n";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const UnitPrice: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { surfaceLightest, negative } = useTheme();
  const { style, className, state, ...sectionProps } = props;

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const learnMoreLink = zendeskURL("4405383750555");

  const {
    primaryCurrency,
    forceValidation,
    showUnitPrice,
    unitPrice,
    unitPriceOptions,
    measurementType,
    unitPriceUnit,
    isSubmitting,
    showRevampedAddEditProductUI,
  } = state;

  const exampleBasePrice = 11.69;
  const exampleUnitPrice = 0.08;
  const currency = primaryCurrency || "USD";
  const formattedExampleBasePrice = formatCurrency(exampleBasePrice, currency);
  const formattedExampleUnitPrice = formatCurrency(exampleUnitPrice, currency);

  const hasMeasurementTypeError =
    forceValidation && showUnitPrice && measurementType == null;
  const hasUnitError =
    forceValidation && showUnitPrice && unitPriceUnit == null;

  return (
    <Section
      className={css(style, className)}
      title={
        showRevampedAddEditProductUI
          ? ci18n("Section title", "Unit price")
          : i`Unit price (optional)`
      }
      {...sectionProps}
      contentStyle={{ padding: 0 }}
    >
      <Layout.FlexColumn style={styles.content}>
        <CheckboxField
          title={i`Show unit price for this product`}
          style={styles.field}
          checked={showUnitPrice}
          onChange={(checked) => {
            state.showUnitPrice = checked;
          }}
          data-cy="checkbox-show-unit-price"
        />
        {showUnitPrice && (
          <>
            <Layout.FlexRow alignItems="flex-start" style={styles.field}>
              <Field style={styles.rowField} title={i`Measured type`}>
                <FormSelect
                  placeholder={i`Select`}
                  options={MeasurementTypeOptions}
                  selectedValue={measurementType}
                  onSelected={(value: MeasurementType) =>
                    (state.measurementType = value)
                  }
                  error={hasMeasurementTypeError}
                  borderColor={hasMeasurementTypeError ? negative : undefined}
                  disabled={isSubmitting}
                  data-cy="select-measured-type"
                />
                {hasMeasurementTypeError && (
                  <Text className={css(styles.errorText)} weight="semibold">
                    This field is required
                  </Text>
                )}
              </Field>
              <Field
                style={styles.rowField}
                title={i`Unit`}
                description={
                  i`The unit of measurement for the total content of a product. ` +
                  i`This will be used to display the price per unit of a product, ` +
                  i`and is the unit of measurement that will be used for both the ` +
                  i`Reference Value and Quantity Value attributes. ` +
                  i`[Learn More](${learnMoreLink}).`
                }
              >
                <FormSelect
                  placeholder={i`Select`}
                  disabled={unitPriceOptions == null || isSubmitting}
                  options={
                    unitPriceOptions || [
                      // Dummy value if disabled to still show placeholder
                      { value: "CENTIMETER", text: i`Select` },
                    ]
                  }
                  selectedValue={unitPriceUnit}
                  onSelected={(unit: Unit) => (state.unitPriceUnit = unit)}
                  error={hasUnitError}
                  borderColor={hasUnitError ? negative : undefined}
                  data-cy="select-unit"
                />
                {hasUnitError && (
                  <Text className={css(styles.errorText)} weight="semibold">
                    This field is required
                  </Text>
                )}
              </Field>
            </Layout.FlexRow>
            <Layout.FlexRow alignItems="flex-start" style={styles.field}>
              <Field
                title={i`Reference value`}
                description={
                  i`The reference value (in the given unit) that is used to calculate ` +
                  i`the price per unit of a product and to illustrate the unit count for ` +
                  i`the consumer to see. [Learn More](${learnMoreLink}).`
                }
              >
                <Layout.FlexRow alignItems="center">
                  <NumericInput
                    placeholder="0"
                    value={unitPrice}
                    onChange={({ valueAsNumber }) =>
                      (state.unitPrice =
                        valueAsNumber == null
                          ? undefined
                          : Math.max(0, valueAsNumber))
                    }
                    forceValidation={forceValidation}
                    validators={[
                      new RequiredValidator(),
                      new IntegerValidator(),
                      new NonZeroValidator(),
                    ]}
                    disabled={isSubmitting}
                    data-cy="input-reference-value"
                  />
                  {unitPriceUnit != null && (
                    <Text style={styles.unit}>
                      {unitDisplayName(unitPriceUnit).symbol}
                    </Text>
                  )}
                </Layout.FlexRow>
              </Field>
            </Layout.FlexRow>
          </>
        )}
      </Layout.FlexColumn>
      <Accordion
        header={() => (
          <Text weight="bold" style={styles.titleText}>
            What is this for?
          </Text>
        )}
        isOpen={isInfoOpen}
        onOpenToggled={(isOpen) => setIsInfoOpen(isOpen)}
        hideLines
        backgroundColor={surfaceLightest}
      >
        <Layout.FlexColumn style={styles.accordionContent}>
          <Markdown
            style={[styles.accordionText, styles.accordionSection]}
            text={
              i`If you sell products in quantities or measurements in the US or EU, then you ` +
              i`might be required to display price per unit for your product listings. Unit ` +
              i`price is recommended for but not limited to products within cleaning supplies, ` +
              i`toiletries, beauty, cosmetics, personal care, and more. [Learn more](${learnMoreLink})`
            }
            openLinksInNewTab
          />
          <Layout.FlexColumn style={styles.accordionSection}>
            <Text style={[styles.subSection, styles.accordionText]}>
              The above-listed unit price product attributes will be used to
              calculate and display unit price, using the following formula:
            </Text>
            <Text style={[styles.subSection, styles.accordionText]}>
              (Price * Reference Value) / Quantity Value = Unit Price (displayed
              per Reference Value in given Unit)
            </Text>
          </Layout.FlexColumn>
          <Layout.FlexColumn style={styles.accordionSection}>
            <Text
              style={[styles.accordionText, styles.subSection]}
              weight="semibold"
            >
              Example
            </Text>
            <Text style={[styles.accordionText, styles.subSection]}>
              You are listing a {210} fl oz &apos;{140} Loads&apos; liquid
              laundry detergent for {formattedExampleBasePrice} and would like
              to display the price per load.
            </Text>
            <Ul style={[styles.subSection, styles.ul]}>
              <Ul.Li>
                <Markdown
                  style={styles.accordionText}
                  text={i`**Unit** = load`}
                />
              </Ul.Li>
              <Ul.Li>
                <Markdown
                  style={styles.accordionText}
                  text={i`**Quantity value** = ${140}`}
                />
              </Ul.Li>
              <Ul.Li>
                <Markdown
                  style={styles.accordionText}
                  text={i`**Reference value** = ${1}`}
                />
              </Ul.Li>
              <Ul.Li>
                <Markdown
                  style={styles.accordionText}
                  text={i`**Unit price** = (${formattedExampleBasePrice} * ${1}) / ${140} = ${formattedExampleUnitPrice} per 1 load`}
                />
              </Ul.Li>
            </Ul>
          </Layout.FlexColumn>
        </Layout.FlexColumn>
      </Accordion>
    </Section>
  );
};

export default observer(UnitPrice);

const useStylesheet = () => {
  const { borderPrimary, textDark, negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: 24,
          borderBottom: `1px solid ${borderPrimary}`,
        },
        field: {
          alignSelf: "stretch",
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        rowField: {
          flex: 1,
          ":not(:last-child)": {
            marginRight: 16,
          },
        },
        unit: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
          marginLeft: 8,
          marginTop: 11,
          alignSelf: "flex-start",
        },
        accordionContent: {
          padding: "0px 48px 24px 48px",
        },
        accordionText: {
          fontSize: 14,
          lineHeight: "20px",
          color: textDark,
        },
        accordionSection: {
          ":not(:last-child)": {
            marginBottom: 24,
          },
        },
        subSection: {
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
        ul: {
          marginLeft: 16,
        },
        errorText: {
          fontSize: 12,
          lineHeight: 1.33,
          color: negative,
          marginTop: 7,
          cursor: "default",
        },
        titleText: {
          color: textDark,
        },
      }),
    [borderPrimary, textDark, negative],
  );
};
