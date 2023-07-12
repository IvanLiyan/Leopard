import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { StyleSheet } from "aphrodite";
import { ni18n } from "@core/toolkit/i18n";
import { css } from "@core/toolkit/styling";
import { RequiredValidator } from "@core/toolkit/validators";
import { zendeskURL } from "@core/toolkit/url";
import { useToastStore } from "@core/stores/ToastStore";
import {
  Button,
  FormSelect,
  RowSelectionArgs,
  StaggeredFadeIn,
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
import AddEditProductState, {
  setVariationInventory,
  UniqueSkuValidator,
  Variation,
  updateCustomsLogistics,
  createCustomsLogistics,
} from "@add-edit-product/AddEditProductState";
import { formatCurrency } from "@core/toolkit/currency";
import NumberButton from "./NumberButton";
import { ci18n } from "@core/toolkit/i18n";
import {
  unitDisplayName,
  LEGACY_COLOR_DISPLAY_TEXT,
  LEGACY_SIZE_DISPLAY_TEXT,
  CustomsLogisticsWeightUnit,
  WeightUnitDisplayNames,
} from "@add-edit-product/toolkit";
import { CountryCode } from "@schema";
import AttributesCell from "./AttributesCell";
import { Stack, Text } from "@ContextLogic/atlas-ui";

type Props = {
  readonly style: CSSProperties;
  readonly state: AddEditProductState;
};

const NO_DATA_MSG = "-";

const VariationsTableV2: React.FC<Props> = (props: Props) => {
  const { style, state } = props;
  const styles = useStylesheet();
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
    new Set([]),
  );
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);
  const [variationsToDiscard, setVariationsToDiscard] = useState<
    ReadonlyArray<Variation>
  >([]);
  const toastStore = useToastStore();

  const learnMoreLink = zendeskURL("4405383834267");
  const attributesLearnMoreLink = zendeskURL("1260805100070");

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
    customsCountryOptions,
    unitPriceUnit,
    isVariationSaved,
    updateVariation,
    isCnMerchant,
    showVariationGroupingUI,
    showInventoryOnHand,
  } = state;
  const isOptionEditable = showVariationGroupingUI && !isNewProduct;
  const weightAbbr = WeightUnitDisplayNames[CustomsLogisticsWeightUnit].symbol;

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
              style={styles.selectField}
            />
          ) : (
            <Text>{values.join(", ") || NO_DATA_MSG}</Text>
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
        onClose={() => setIsDiscardModalOpen(false)}
      />
    );
  };

  return (
    <Stack direction="column" alignItems="stretch" style={style}>
      {renderDiscardModal(variationsToDiscard)}
      {selectedRowIds.size > 0 && (
        <StaggeredFadeIn deltaY={-5} animationDurationMs={400}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ margin: "0px 16px 16px 0px" }}
          >
            <Stack direction="row" alignItems="center" sx={{ gap: "16px" }}>
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
            </Stack>
            <Text
              variant="bodyMStrong"
              sx={{
                lineHeight: "26px",
                marginLeft: "16px",
                whiteSpace: "nowrap",
              }}
            >
              {ni18n(
                selectedRowIds.size,
                "1 item selected",
                "{%1=number of selected items} items selected",
                selectedRowIds.size,
              )}
            </Text>
          </Stack>
        </StaggeredFadeIn>
      )}

      <Text variant="bodyLStrong">
        {ci18n("Variations details", "Variations details")}
      </Text>
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
        hideHeaderRowBackground
      >
        <Table.Column
          _key="image"
          title={ci18n(
            "Table column header, product image, the asterisk symbol means required field",
            "Image*",
          )}
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
          title={ci18n(
            "Table column header, product SKU, the asterisk symbol means required field",
            "SKU*",
          )}
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
          title={ci18n(
            "Table column header, product price, the asterisk symbol means required field",
            "Price*",
          )}
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
                    newProps: {
                      price:
                        textAsNumber != null
                          ? Math.max(0, textAsNumber)
                          : undefined,
                    },
                  })
                }
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
          title={ci18n(
            "Table column header, product price, the asterisk symbol means required field",
            "Inventory*",
          )}
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
        {isCnMerchant && (
          <Table.Column
            _key="weight"
            title={ci18n(
              "Add/edit product form field title, product weight, the asterisk symbol means required field",
              "Weight*",
            )}
            columnKey="weight"
            columnDataCy="column-weight"
            handleEmptyRow
          >
            {({ row: variation }: CellInfo<React.ReactNode, Variation>) => {
              const curCustomsLogistics = variation.customCustomsLogistics
                ? createCustomsLogistics(variation.customCustomsLogistics)
                : createCustomsLogistics();

              return (
                <Stack direction="row" alignItems="center" sx={{ gap: "8px" }}>
                  <NumericInput
                    value={curCustomsLogistics.weight}
                    onChange={({ valueAsNumber }) => {
                      const newCustomsLogistics = updateCustomsLogistics({
                        data: curCustomsLogistics,
                        newProps: {
                          weight:
                            valueAsNumber != null
                              ? Math.max(0, valueAsNumber)
                              : undefined,
                        },
                      });

                      updateVariation({
                        clientSideId: variation.clientSideId,
                        newProps: {
                          customCustomsLogistics: newCustomsLogistics,
                        },
                      });
                    }}
                    validators={[new RequiredValidator()]}
                    forceValidation={forceValidation}
                    disabled={isSubmitting}
                    style={[styles.inventoryInput]}
                  />
                  <Text>{weightAbbr}</Text>
                </Stack>
              );
            }}
          </Table.Column>
        )}
        {showInventoryOnHand && (
          <Table.Column
            _key="inventory-on-hand"
            title={i`Inventory on hand`}
            columnKey="inventory-on-hand"
            columnDataCy="column-inventory-on-hand"
            handleEmptyRow
          >
            {({ row: variation }: CellInfo<React.ReactNode, Variation>) => {
              const curCustomsLogistics = variation.customCustomsLogistics
                ? createCustomsLogistics(variation.customCustomsLogistics)
                : createCustomsLogistics();

              return (
                <TextInput
                  value={curCustomsLogistics.inventoryOnHand}
                  onChange={({ text }) => {
                    const newCustomsLogistics = updateCustomsLogistics({
                      data: curCustomsLogistics,
                      newProps: {
                        inventoryOnHand: text,
                      },
                    });

                    updateVariation({
                      clientSideId: variation.clientSideId,
                      newProps: {
                        customCustomsLogistics: newCustomsLogistics,
                      },
                    });
                  }}
                  disabled={isSubmitting}
                  style={[styles.inventoryInput]}
                />
              );
            }}
          </Table.Column>
        )}
        <Table.Column
          _key="country-of-origin"
          key="country-of-origin"
          title={ci18n(
            "Add/edit product form field title, the asterisk symbol means the field is required",
            "Country of origin*",
          )}
          columnKey="country-of-origin"
          columnDataCy={`column-country-of-origin`}
          description={i`Country where the product is manufactured, produced, or grown. [Learn more](${attributesLearnMoreLink})`}
          handleEmptyRow
        >
          {({ row: variation }: CellInfo<React.ReactNode, Variation>) => {
            const curCustomsLogistics = variation.customCustomsLogistics
              ? createCustomsLogistics(variation.customCustomsLogistics)
              : createCustomsLogistics();

            return (
              <FormSelect
                placeholder={i`Select a country or region`}
                options={customsCountryOptions}
                selectedValue={curCustomsLogistics.countryOfOrigin}
                onSelected={(cc: CountryCode) => {
                  const newCustomsLogistics = updateCustomsLogistics({
                    data: curCustomsLogistics,
                    newProps: {
                      countryOfOrigin: cc,
                    },
                  });

                  updateVariation({
                    clientSideId: variation.clientSideId,
                    newProps: {
                      customCustomsLogistics: newCustomsLogistics,
                    },
                  });
                }}
                disabled={isSubmitting}
                style={styles.selectField}
              />
            );
          }}
        </Table.Column>
        {showUnitPrice && (
          <Table.Column
            _key="quantityValue"
            title={i`Quantity value`}
            columnKey="quantityValue"
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
                <Stack direction="row" alignItems="center" sx={{ gap: "8px" }}>
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
                    <Text>{unitDisplayName(unitPriceUnit).symbol}</Text>
                  )}
                </Stack>
              );
            }}
          </Table.Column>
        )}
        <Table.Column
          _key="attributes"
          title={ci18n(
            "Table column header, means product attributes",
            "Attributes",
          )}
          columnKey="clientSideId"
          columnDataCy="column-attributes"
          handleEmptyRow
        >
          {({ row: variation }: CellInfo<React.ReactNode, Variation>) => (
            <AttributesCell
              state={state}
              variation={variation}
              key={i`${variation.clientSideId}-${state.customsLogisticsUpdateCounter}`}
            />
          )}
        </Table.Column>
      </Table>
    </Stack>
  );
};

export default observer(VariationsTableV2);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        skuInput: {
          minWidth: 80,
        },
        inventoryInput: {
          minWidth: 80,
        },
        priceInputContainer: {
          minWidth: 64,
        },
        quantityValueInput: {
          minWidth: 80,
        },
        optionInput: {
          minWidth: 64,
        },
        bulkAction: {
          height: 42,
        },
        selectField: {
          maxWidth: "100px",
          overflow: "auto",
        },
      }),
    [],
  );
};
