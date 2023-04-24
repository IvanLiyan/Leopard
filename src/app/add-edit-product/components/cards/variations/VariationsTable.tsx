/*
 * VariationsTable.tsx
 *
 * Created by Jonah Dlin on Tue Oct 19 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";

import { ni18n } from "@core/toolkit/i18n";

import faker from "faker/locale/en";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { GtinValidator, RequiredValidator } from "@core/toolkit/validators";
import { zendeskURL } from "@core/toolkit/url";

/* Merchant Store */
import { useToastStore } from "@core/stores/ToastStore";

import {
  Button,
  Divider,
  FormSelect,
  Layout,
  PrimaryButton,
  RowSelectionArgs,
  StaggeredFadeIn,
  Text,
} from "@ContextLogic/lego";
import {
  TextInput,
  NumericInput,
  CurrencyInput,
  DeleteButton,
} from "@ContextLogic/lego";
import ConfirmationModal from "@core/components/ConfirmationModal";
import VariationTableImage from "./VariationTableImage";
import { Table } from "@ContextLogic/lego";

import { CellInfo } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import AddEditProductState, {
  setVariationInventory,
  UniqueSkuValidator,
  UniqueGtinValidator,
  Variation,
} from "@add-edit-product/AddEditProductState";
import { useTheme } from "@core/stores/ThemeStore";
import { formatCurrency } from "@core/toolkit/currency";
import NumberButton from "./NumberButton";
import TaxonomyAttributesModal from "./TaxonomyAttributesModal";
import { useDeciderKey } from "@core/stores/ExperimentStore";
import { ci18n } from "@core/toolkit/i18n";
import {
  unitDisplayName,
  LEGACY_COLOR_DISPLAY_TEXT,
  LEGACY_SIZE_DISPLAY_TEXT,
} from "@add-edit-product/toolkit";
import CustomsLogisticsCell from "./CustomsLogisticsCell";

type Props = BaseProps & {
  readonly state: AddEditProductState;
};

const NO_DATA_MSG = "-";

const VariationsTable: React.FC<Props> = (props: Props) => {
  const { style, className, state } = props;
  const styles = useStylesheet();
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
    new Set([]),
  );
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);
  const [isAttributesModalOpen, setIsAttributesModalOpen] =
    useState<boolean>(false);
  const [variationsToDiscard, setVariationsToDiscard] = useState<
    ReadonlyArray<Variation>
  >([]);
  const toastStore = useToastStore();
  const { decision: showFashionUI } = useDeciderKey("women_fashion_ui");

  const {
    standardWarehouseId,
    variations,
    hasColors,
    hasSizes,
    hasOptions,
    optionNames,
    optionNameToValueOptions,
    isNewProduct,
    isSubmitting,
    forceValidation,
    primaryCurrency,
    showUnitPrice = false,
    unitPriceUnit,
    isVariationSaved,
    updateVariation,
    subcategory,
    showVariationGroupingUI,
  } = state;
  const isOptionEditable = showVariationGroupingUI && !isNewProduct;

  useEffect(() => {
    const existingVariationIds = new Set(
      variations.map(({ clientSideId }) => clientSideId),
    );
    const newSelectedIds = new Set(selectedRowIds);
    selectedRowIds.forEach((clientSideId) => {
      if (!existingVariationIds.has(clientSideId)) {
        newSelectedIds.delete(clientSideId);
      }
    });
    setSelectedRowIds(newSelectedIds);
    // Disabling since we only want to recompute this when variations change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variations]);

  const selectedRowIndeces = useMemo(
    () =>
      Array.from(selectedRowIds)
        .map((id) =>
          variations.findIndex(({ clientSideId }) => clientSideId == id),
        )
        .filter((index) => index != -1),
    [selectedRowIds, variations],
  );

  const selectedVariations = useMemo(
    () =>
      Array.from(selectedRowIds)
        .map((id) => variations.find(({ clientSideId }) => clientSideId == id))
        .filter((variation) => variation != null) as ReadonlyArray<Variation>,
    [selectedRowIds, variations],
  );

  if (variations.length == 0) {
    return null;
  }

  const onRowSelectionToggled = ({
    row: { clientSideId },
    selected,
  }: RowSelectionArgs<Variation>) => {
    if (selected) {
      selectedRowIds.add(clientSideId);
    } else {
      selectedRowIds.delete(clientSideId);
    }
    setSelectedRowIds(new Set(selectedRowIds));
  };

  const actions = [
    {
      key: "discard",
      name: i`Discard`,
      canBatch: false,
      canApplyToRow: (variation: Variation) => !isVariationSaved(variation),
      apply: (variations: ReadonlyArray<Variation>) => {
        setVariationsToDiscard(variations);
        setIsDiscardModalOpen(true);
      },
    },
  ];

  const renderSizeColumn = (editable: boolean) => {
    return (
      <Table.Column
        _key="size"
        title={
          showVariationGroupingUI
            ? LEGACY_SIZE_DISPLAY_TEXT
            : ci18n("Table header, means variation size", "Size")
        }
        columnKey="size"
        columnDataCy="column-custom-variation"
        handleEmptyRow
      >
        {({ row: variation }: CellInfo<React.ReactNode, Variation>) =>
          editable ? (
            <TextInput
              value={variation.size}
              onChange={({ text }) =>
                updateVariation({
                  clientSideId: variation.clientSideId,
                  newProps: { size: text },
                })
              }
              style={styles.optionInput}
              disabled={isSubmitting}
              inputStyle={{ padding: "0px 9px" }}
            />
          ) : (
            variation.size
          )
        }
      </Table.Column>
    );
  };

  const renderColorColumn = (editable: boolean) => {
    return (
      <Table.Column
        _key="color"
        title={
          showVariationGroupingUI
            ? LEGACY_COLOR_DISPLAY_TEXT
            : ci18n("Table header, means variation color", "Color")
        }
        columnKey="color"
        columnDataCy="column-custom-color"
        handleEmptyRow
      >
        {({ row: variation }: CellInfo<React.ReactNode, Variation>) =>
          editable ? (
            <TextInput
              value={variation.color}
              onChange={({ text }) =>
                updateVariation({
                  clientSideId: variation.clientSideId,
                  newProps: { color: text },
                })
              }
              style={styles.optionInput}
              disabled={isSubmitting}
              inputStyle={{ padding: "0px 9px" }}
            />
          ) : (
            variation.color
          )
        }
      </Table.Column>
    );
  };

  const renderOptionColumn = (optionName: string, editable: boolean) => {
    return (
      <Table.Column
        _key={optionName}
        key={optionName}
        title={optionName}
        columnKey="options"
        noDataMessage={NO_DATA_MSG}
        columnDataCy={`column-${optionName}`}
      >
        {({ row: variation }: CellInfo<React.ReactNode, Variation>) => {
          const values =
            variation.options != null
              ? variation.options[optionName] ?? []
              : [];

          return editable ? (
            <FormSelect
              options={optionNameToValueOptions[optionName]}
              selectedValue={values.length > 0 ? values[0] : undefined}
              onSelected={(value: string | undefined) => {
                const newOptions = {
                  ...(variation.options ?? {}),
                  [optionName]: value != null ? [value] : [],
                };
                updateVariation({
                  clientSideId: variation.clientSideId,
                  newProps: { options: newOptions },
                });
              }}
              placeholder={ci18n("Select a dropdown option", "Select")}
            />
          ) : (
            values.join(", ") || NO_DATA_MSG
          );
        }}
      </Table.Column>
    );
  };

  const renderDiscardModal = (variations: ReadonlyArray<Variation>) => {
    return (
      <ConfirmationModal
        open={isDiscardModalOpen}
        title={ci18n("CTA text", "Confirm")}
        text={ni18n(
          variations.length,
          "Are you sure you want to discard this variation?",
          "Are you sure you want to discard these variations?",
        )}
        cancel={{
          text: ci18n("CTA text", "Cancel"),
          onClick: () => {
            setIsDiscardModalOpen(false);
          },
        }}
        action={{
          text: ci18n(
            "CTA text, discards unsaved modifications to product variations",
            "Yes, discard",
          ),
          onClick: () => {
            state.discardVariations(variations);
            setSelectedRowIds(new Set([]));
            toastStore.info(
              ni18n(
                variations.length,
                "Variation has been discarded",
                "%1$d variations have been discarded",
              ),
            );
            setIsDiscardModalOpen(false);
          },
        }}
      />
    );
  };

  const learnMoreLink = zendeskURL("4405383834267");

  return (
    <Layout.FlexColumn alignItems="stretch" style={[style, className]}>
      <TaxonomyAttributesModal
        open={isAttributesModalOpen}
        state={state}
        onClose={() => {
          setIsAttributesModalOpen(false);
        }}
      />
      {renderDiscardModal(variationsToDiscard)}
      {showFashionUI && subcategory && (
        <>
          <Divider />
          <Layout.FlexColumn
            style={[styles.modalButtonsColumn, styles.modalButtons]}
            alignItems="flex-start"
          >
            <Text style={styles.text}>
              View and update required category specific variation attributes
            </Text>
            <PrimaryButton
              onClick={() => {
                setIsAttributesModalOpen(true);
              }}
              data-cy="button-view-variation-attributes"
            >
              View Variation Attributes
            </PrimaryButton>
          </Layout.FlexColumn>
        </>
      )}
      {selectedRowIds.size > 0 && (
        <StaggeredFadeIn deltaY={-5} animationDurationMs={400}>
          <Layout.FlexRow
            justifyContent="space-between"
            alignItems="flex-end"
            style={styles.bulkActionsRow}
          >
            <Layout.FlexRow style={styles.bulkActions}>
              <NumberButton
                style={styles.bulkAction}
                buttonText={i`Apply price`}
                onSubmit={(value) =>
                  Array.from(selectedRowIds).forEach((clientSideId) =>
                    updateVariation({
                      clientSideId,
                      newProps: {
                        price: value,
                      },
                    }),
                  )
                }
                placeholder={formatCurrency(0, primaryCurrency)}
                data-cy="apply-price"
              />
              <NumberButton
                style={styles.bulkAction}
                buttonText={i`Apply inventory`}
                onSubmit={(value) => {
                  if (value != null) {
                    Array.from(selectedRowIds).forEach((clientSideId) =>
                      updateVariation({
                        clientSideId,
                        newProps: {
                          inventoryByWarehouseId: new Map([
                            [standardWarehouseId, value],
                          ]),
                        },
                      }),
                    );
                  }
                }}
                placeholder="0"
                data-cy="apply-inventory"
              />
              <Button
                style={styles.bulkAction}
                onClick={() => {
                  setVariationsToDiscard(selectedVariations);
                  setIsDiscardModalOpen(true);
                }}
                data-cy="button-discard"
              >
                Discard
              </Button>
            </Layout.FlexRow>
            <Text weight="semibold" style={styles.bulkNumberText}>
              {ni18n(
                selectedRowIds.size,
                "1 item selected",
                "{%1=number of selected items} items selected",
                selectedRowIds.size,
              )}
            </Text>
          </Layout.FlexRow>
        </StaggeredFadeIn>
      )}
      <Table
        key={[hasColors, hasSizes, hasOptions, showUnitPrice].join("_")}
        data={variations}
        hideBorder
        actions={actions}
        rowHeight={64}
        canSelectRow={({ row }: { readonly row: Variation }) =>
          !isVariationSaved(row)
        }
        selectedRows={selectedRowIndeces}
        onRowSelectionToggled={onRowSelectionToggled}
        doubleClickToSelectRow={false}
        renderRowActions={({ actions: [deleteAction], apply }) => {
          return (
            <DeleteButton
              onClick={() => {
                void apply(deleteAction);
              }}
            />
          );
        }}
        actionColumnWidth={70}
        cellPadding="0px 12px"
        rowDataCy={(row: Variation) =>
          `variation-row-${row.sku ?? row.clientSideId}`
        }
      >
        <Table.Column
          _key="image"
          title={i`Image`}
          columnKey="image.wishUrl"
          columnDataCy="column-image"
          handleEmptyRow
        >
          {({ row: variation }: CellInfo<React.ReactNode, Variation>) => (
            <VariationTableImage
              variation={variation}
              state={state}
              key={variation.clientSideId}
            />
          )}
        </Table.Column>
        {hasColors && renderColorColumn(isOptionEditable)}
        {hasSizes && renderSizeColumn(isOptionEditable)}
        {optionNames.length > 0 &&
          optionNames.map((optionName) => {
            return renderOptionColumn(optionName, isOptionEditable);
          })}
        <Table.Column
          _key="sku"
          title={i`SKU`}
          columnKey="sku"
          columnDataCy="column-sku"
          handleEmptyRow
        >
          {({ row: variation }: CellInfo<React.ReactNode, Variation>) => (
            <TextInput
              value={variation.sku == null ? null : variation.sku}
              onChange={({ text }) =>
                updateVariation({
                  clientSideId: variation.clientSideId,
                  newProps: { sku: text },
                })
              }
              debugValue={faker.finance.iban().substring(0, 5)}
              style={styles.skuInput}
              hideCheckmarkWhenValid
              forceValidation={forceValidation}
              validators={[
                new RequiredValidator(),
                new UniqueSkuValidator({ pageState: state }),
              ]}
              disabled={isSubmitting}
              inputStyle={{ padding: "0px 9px" }}
            />
          )}
        </Table.Column>
        <Table.Column
          _key="price"
          title={i`Price`}
          columnKey="price"
          minWidth={80}
          columnDataCy="column-price"
          handleEmptyRow
        >
          {({ row: variation }: CellInfo<React.ReactNode, Variation>) => {
            const currentAmount = variation.price;
            return (
              <CurrencyInput
                inputContainerStyle={css(styles.priceInputContainer)}
                value={currentAmount == null ? null : currentAmount.toString()}
                placeholder="0.00"
                currencyCode={primaryCurrency}
                hideCheckmarkWhenValid
                onChange={({ textAsNumber }) =>
                  updateVariation({
                    clientSideId: variation.clientSideId,
                    newProps: { price: textAsNumber },
                  })
                }
                debugValue={(Math.random() * 10).toFixed(2).toString()}
                style={{ minWidth: 80 }}
                forceValidation={forceValidation}
                validators={[new RequiredValidator()]}
                disabled={isSubmitting}
                inputStyle={{ padding: "0px 9px" }}
              />
            );
          }}
        </Table.Column>
        <Table.Column
          _key="inventory"
          title={i`Inventory`}
          columnKey="inventory"
          columnDataCy="column-inventory"
          handleEmptyRow
        >
          {({ row: variation }: CellInfo<React.ReactNode, Variation>) => {
            const inventory =
              variation.inventoryByWarehouseId.get(standardWarehouseId);
            return (
              <NumericInput
                value={inventory || 0}
                onChange={({ valueAsNumber }) =>
                  updateVariation({
                    clientSideId: variation.clientSideId,
                    newProps: {
                      inventoryByWarehouseId: setVariationInventory({
                        variation,
                        value: valueAsNumber || 0,
                        warehouseId: standardWarehouseId,
                      }).inventoryByWarehouseId,
                    },
                  })
                }
                validators={[new RequiredValidator()]}
                forceValidation={forceValidation}
                disabled={isSubmitting}
                style={[styles.inventoryInput]}
              />
            );
          }}
        </Table.Column>
        <Table.Column
          _key="gtin"
          title={i`GTIN`}
          columnKey="gtin"
          columnDataCy="column-gtin"
          handleEmptyRow
          description={
            i`${8} to ${14} digits GTIN (UPC, EAN, ISBN) contains no letters or ` +
            i`other characters. GTIN must be unique for each variation.`
          }
        >
          {({ row: variation }: CellInfo<React.ReactNode, Variation>) => (
            <TextInput
              value={variation.gtin == null ? null : variation.gtin}
              onChange={({ text }) =>
                updateVariation({
                  clientSideId: variation.clientSideId,
                  newProps: { gtin: text },
                })
              }
              debugValue={(
                10000000 +
                Math.max(faker.random.number(99999999999 - 10000000), 0)
              ).toString()}
              validators={[
                new GtinValidator(),
                new UniqueGtinValidator({ pageState: state }),
              ]}
              forceValidation={forceValidation}
              style={styles.gtinInput}
              disabled={isSubmitting}
              hideCheckmarkWhenValid
              inputStyle={{ padding: "0px 9px" }}
              inputContainerStyle={{ maxWidth: 166, boxSizing: "border-box" }}
            />
          )}
        </Table.Column>
        {showUnitPrice && (
          <Table.Column
            _key="weight"
            title={i`Quantity value`}
            columnKey="weight"
            columnDataCy="column-quantity-value"
            handleEmptyRow
            description={
              i`The total quantity of the product variant (in the given unit) ` +
              i`that is used to calculate the price per unit of a product. Note ` +
              i`that if a product has multiple product variants, you will need ` +
              i`to set quantity values for each product variant. ` +
              i`[Learn More](${learnMoreLink}).`
            }
          >
            {({ row: variation }: CellInfo<React.ReactNode, Variation>) => {
              return (
                <Layout.FlexRow>
                  <NumericInput
                    value={
                      variation.quantityValue == null
                        ? null
                        : variation.quantityValue
                    }
                    onChange={({ valueAsNumber }) =>
                      updateVariation({
                        clientSideId: variation.clientSideId,
                        newProps: {
                          quantityValue:
                            valueAsNumber == null
                              ? undefined
                              : Math.max(0, valueAsNumber),
                        },
                      })
                    }
                    validators={[new RequiredValidator()]}
                    forceValidation={forceValidation}
                    disabled={isSubmitting}
                    style={styles.quantityValueInput}
                  />
                  {unitPriceUnit != null && (
                    <Text style={{ marginLeft: 8 }}>
                      {unitDisplayName(unitPriceUnit).symbol}
                    </Text>
                  )}
                </Layout.FlexRow>
              );
            }}
          </Table.Column>
        )}
        <Table.Column
          _key="useDefaultCustomsLogistics"
          title={i`Customs & Logistics`}
          columnKey="useDefaultCustomsLogistics"
          columnDataCy="column-customs"
          handleEmptyRow
        >
          {({ row: variation }: CellInfo<React.ReactNode, Variation>) => (
            <CustomsLogisticsCell
              state={state}
              variation={variation}
              key={variation.clientSideId}
            />
          )}
        </Table.Column>
      </Table>
    </Layout.FlexColumn>
  );
};

export default observer(VariationsTable);

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        skuInput: {
          minWidth: 64,
        },
        inventoryInput: {
          minWidth: 80,
        },
        priceInputContainer: {
          minWidth: 53,
        },
        quantityValueInput: {
          minWidth: 80,
        },
        gtinInput: {
          minWidth: 80,
        },
        optionInput: {
          minWidth: 64,
        },
        bulkPriceInputContainer: {
          maxWidth: 64,
        },
        bulkActionsRow: {
          margin: "0px 24px 8px 24px",
        },
        bulkActions: {
          flexWrap: "wrap",
          gap: 16,
        },
        bulkAction: {
          height: 42,
        },
        bulkNumberText: {
          color: textDark,
          fontSize: 16,
          lineHeight: "26px",
          marginLeft: 16,
          whiteSpace: "nowrap",
        },
        customLogisticsLink: {
          gap: 4,
        },
        modalButtons: {
          margin: 16,
        },
        modalButtonsColumn: {
          gap: 16,
        },
        text: {
          color: textDark,
        },
      }),
    [textDark],
  );
};
