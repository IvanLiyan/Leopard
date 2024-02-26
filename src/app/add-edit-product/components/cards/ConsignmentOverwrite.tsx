/*
 * consignmentOverwrite.tsx
 *
 * Created by Ivan Li
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  CheckboxField,
  Layout,
  Field,
  CellInfo,
  Table,
  TextInput,
  CurrencyInput,
} from "@ContextLogic/lego";
import { Stack, Text } from "@ContextLogic/atlas-ui";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import Section, { SectionProps } from "./Section";
import { useTheme } from "@core/stores/ThemeStore";
import { MinMaxValueValidator, UrlValidator } from "@core/toolkit/validators";
import AddEditProductState, {
  Variation,
} from "@add-edit-product/AddEditProductState";
import { ci18n } from "@core/toolkit/i18n";

type Props = Omit<SectionProps, "title"> & {
  readonly state: AddEditProductState;
};

const ConsignmentOverwrite: React.FC<Props> = (props: Props) => {
  const styles = useStylesheet();
  const { style, className, state, ...sectionProps } = props;

  const {
    primaryCurrency,
    consignmentOriginalPid,
    consignmentReferenceLink,
    isConsignmentEligible,
    showRevampedAddEditProductUI,
    variations,
    IsConsignmentAndBd,
    IsConsignmentAndNotBd,
    updateVariation,
    initialState,
  } = state;

  if (variations.length == 0) {
    return null;
  }
  return (
    <Section
      className={css(style, className)}
      title={
        showRevampedAddEditProductUI
          ? ci18n("Section title", "Consignment Overwrite")
          : i`Consignment Overwrite`
      }
      {...sectionProps}
      contentStyle={{ padding: 0 }}
    >
      <Layout.FlexColumn style={styles.content}>
        <Layout.FlexRow alignItems="flex-start" style={styles.field}>
          <Layout.FlexColumn style={{ flex: 1 }}>
            <Field
              style={[styles.rowField, styles.accordionSection]}
              title={i`Existing PID`}
            >
              <TextInput
                value={consignmentOriginalPid}
                placeholder={i`Enter existing PID to import and map`}
                onChange={({ text }) => (state.consignmentOriginalPid = text)}
                data-cy="input-ExistingPID"
                disabled={
                  initialState?.consignmentOriginalPid != null &&
                  IsConsignmentAndNotBd
                }
              />
            </Field>
            <Field style={styles.rowField} title={i`Reference Link`}>
              <TextInput
                value={consignmentReferenceLink}
                placeholder={i`Enter consignment reference link`}
                onChange={({ text }) => (state.consignmentReferenceLink = text)}
                validators={
                  state.consignmentReferenceLink?.length == 0
                    ? []
                    : [new UrlValidator()]
                }
                data-cy="input-ConsignmentReferenceLink"
                disabled={
                  initialState?.consignmentReferenceLink != null &&
                  IsConsignmentAndNotBd
                }
              />
            </Field>
          </Layout.FlexColumn>
          <Layout.FlexColumn style={{ flex: 1 }}>
            <Field title={i`Merchant set cost`} style={styles.rowField}>
              {state.variations && state.variations.length > 1 ? (
                <Table
                  data={variations}
                  hideBorder
                  rowHeight={64}
                  actionColumnWidth={70}
                  cellPadding="0px 12px"
                  rowDataCy={(row: Variation) =>
                    `variation-row-${row.sku ?? row.clientSideId}`
                  }
                >
                  <Table.Column
                    _key="sku"
                    title={ci18n(
                      "Table column header, product SKU, the asterisk symbol means required field",
                      "SKU",
                    )}
                    columnKey="sku"
                    columnDataCy="column-sku"
                    handleEmptyRow
                  >
                    {({
                      row: variation,
                    }: CellInfo<React.ReactNode, Variation>) => (
                      <Stack direction="column">
                        <Text>
                          {variation.sku == null ? null : variation.sku}
                        </Text>
                      </Stack>
                    )}
                  </Table.Column>
                  <Table.Column
                    _key="consignmentSupplyCost"
                    title={ci18n(
                      "Table column header, product consignment supply cost, the asterisk symbol means required field",
                      "Merchant set cost",
                    )}
                    columnKey="consignmentSupplyCost"
                    minWidth={80}
                    columnDataCy="column-consignment-supply-cost"
                    handleEmptyRow
                  >
                    {({
                      row: variation,
                      index,
                    }: CellInfo<React.ReactNode, Variation>) => {
                      const currentAmount = variation.consignmentSupplyCost;
                      return (
                        <CurrencyInput
                          inputContainerStyle={css(styles.costInputContainer)}
                          value={
                            currentAmount == null
                              ? null
                              : currentAmount.toString()
                          }
                          placeholder="0.00"
                          disabled={
                            initialState?.variations[index]
                              .consignmentSupplyCost != null &&
                            IsConsignmentAndNotBd
                          }
                          currencyCode={primaryCurrency}
                          hideCheckmarkWhenValid
                          onChange={({ textAsNumber }) =>
                            updateVariation({
                              clientSideId: variation.clientSideId,
                              newProps: {
                                consignmentSupplyCost: textAsNumber,
                              },
                            })
                          }
                          maxLength={9}
                          validators={[
                            new MinMaxValueValidator({
                              minAllowedValue: 0.00001,
                              maxAllowedValue: 999999999,
                              customMessage: i`Value cannot be zero or less`,
                              allowBlank: true,
                            }),
                          ]}
                          inputStyle={{ padding: "0px 9px" }}
                          data-cy="input-variation-consignment-supply-cost"
                        />
                      );
                    }}
                  </Table.Column>
                </Table>
              ) : (
                <CurrencyInput
                  value={variations[0].consignmentSupplyCost}
                  placeholder="0.00"
                  currencyCode={primaryCurrency}
                  hideCheckmarkWhenValid
                  onChange={({ textAsNumber }) =>
                    updateVariation({
                      clientSideId: variations[0].clientSideId,
                      newProps: {
                        consignmentSupplyCost: textAsNumber,
                      },
                    })
                  }
                  disabled={
                    initialState?.variations[0].consignmentSupplyCost != null &&
                    IsConsignmentAndNotBd
                  }
                  maxLength={9}
                  validators={[
                    new MinMaxValueValidator({
                      minAllowedValue: 0.00001,
                      maxAllowedValue: 999999999,
                      customMessage: i`Value cannot be zero or less`,
                      allowBlank: true,
                    }),
                  ]}
                  data-cy="input-variation-consignment-supply-cost"
                />
              )}
            </Field>
          </Layout.FlexColumn>
        </Layout.FlexRow>
        {IsConsignmentAndBd && (
          <Layout.FlexRow alignItems="flex-start" style={styles.field}>
            <CheckboxField
              title={i`Enable consignment listing`}
              style={styles.field}
              checked={
                isConsignmentEligible === true ? isConsignmentEligible : false
              }
              onChange={(checked) => {
                state.isConsignmentEligible = checked;
              }}
              data-cy="checkbox-enable-consignment-listing"
            />
          </Layout.FlexRow>
        )}
      </Layout.FlexColumn>
    </Section>
  );
};

export default observer(ConsignmentOverwrite);

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
          display: "flex",
          marginRight: 16,
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
        columnField: {
          flex: 1,
        },
        gap: {
          marginLeft: 20,
          flex: 1,
        },
        currencyText: {
          width: 40,
          textAlign: "center",
        },
        costInputContainer: {
          minWidth: 64,
        },
      }),
    [borderPrimary, textDark, negative],
  );
};
