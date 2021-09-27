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
import { css } from "@toolkit/styling";

import Section, {
  SectionProps,
} from "@plus/component/products/edit-product/Section";
import ProductEditState from "@plus/model/ProductEditState";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useState } from "react";
import {
  MeasurementType,
  MeasurementTypeOptions,
  Unit,
  unitDisplayName,
} from "@toolkit/product-edit";
import { formatCurrency } from "@toolkit/currency";
import { useUserStore } from "@merchant/stores/UserStore";
import { zendeskURL } from "@toolkit/url";
import {
  IntegerValidator,
  NonZeroValidator,
  RequiredValidator,
} from "@toolkit/validators";

type Props = Omit<SectionProps, "title"> & {
  readonly editState: ProductEditState;
};

const UnitPrice: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { surfaceLightest, negative } = useTheme();
  const { style, className, editState, ...sectionProps } = props;
  const { isPlusUser } = useUserStore();

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const learnMoreLink = isPlusUser
    ? zendeskURL("4405383834267")
    : zendeskURL("4405383750555");

  const {
    showUnitPrice,
    unitPrice,
    unitPriceOptions,
    measurementType,
    unitPriceUnit,
    primaryCurrency,
    forceValidation,
  } = editState;

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
      title={i`Unit price (optional)`}
      {...sectionProps}
      contentStyle={{ padding: 0 }}
    >
      <Layout.FlexColumn style={styles.content}>
        <CheckboxField
          title={i`Show unit price for this product`}
          style={styles.field}
          checked={showUnitPrice}
          onChange={(checked) => {
            editState.showUnitPrice = checked;
          }}
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
                    (editState.measurementType = value)
                  }
                  error={hasMeasurementTypeError}
                  borderColor={hasMeasurementTypeError ? negative : undefined}
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
                  disabled={unitPriceOptions == null}
                  options={
                    unitPriceOptions || [
                      // Dummy value if disabled to still show placeholder
                      { value: "CENTIMETER", text: i`Select` },
                    ]
                  }
                  selectedValue={unitPriceUnit}
                  onSelected={(unit: Unit) => (editState.unitPriceUnit = unit)}
                  error={hasUnitError}
                  borderColor={hasUnitError ? negative : undefined}
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
                      (editState.unitPrice =
                        valueAsNumber == null
                          ? undefined
                          : Math.max(0, valueAsNumber))
                    }
                    incrementStep={1}
                    forceValidation={forceValidation}
                    validators={[
                      new RequiredValidator(),
                      new IntegerValidator(),
                      new NonZeroValidator(),
                    ]}
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
        header={i`What is this for?`}
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
          />
          <Layout.FlexColumn style={styles.accordionSection}>
            <Text
              style={[styles.accordionText, styles.exampleSection]}
              weight="semibold"
            >
              Example
            </Text>
            <Text style={[styles.accordionText, styles.exampleSection]}>
              You are listing a {210} fl oz '{140} Loads' liquid laundry
              detergent for {formattedExampleBasePrice} and would like to
              display the price per load.
            </Text>
            <Ul style={[styles.exampleSection, styles.ul]}>
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
          padding: 15,
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
          padding: "0px 39px 24px 39px",
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
        exampleSection: {
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
      }),
    [borderPrimary, textDark, negative]
  );
};
