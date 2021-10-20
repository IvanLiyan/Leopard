/*
 *
 * CountryShipping.tsx
 *
 * Created by Joyce Ji on 9/17/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { css } from "@toolkit/styling";

/* Lego Components */
import {
  Table,
  CurrencyInput,
  Card,
  TextInput,
  CellInfo,
  RowSelectionArgs,
  SearchBox,
  PageIndicator,
  OnTextChangeEvent,
} from "@ContextLogic/lego";
import { Flag } from "@merchant/component/core";
import { CountryCode } from "@toolkit/countries";

/* Merchant Components */
import RegionShippingTable from "@merchant/component/products/product-shipping/RegionShippingTable";
import BadgeColumn from "@merchant/component/products/product-shipping/BadgeColumn";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";

import { useTheme } from "@stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Type Imports */
import ProductShippingEditState, {
  PickedShippingSettingsSchema,
} from "@merchant/model/products/ProductShippingEditState";

/* Constants */
import { MERCHANT_PRODUCT_SHIPPING_TEST_ID } from "@merchant/toolkit/testing";

const PAGE_SIZE = 10;

type CountryShippingPriceProps = {
  readonly shippingSetting: PickedShippingSettingsSchema;
  readonly editState: ProductShippingEditState;
};

const CountryShippingPrice: React.FC<CountryShippingPriceProps> = observer(
  ({ shippingSetting, editState }: CountryShippingPriceProps) => {
    const {
      forceValidation,
      primaryCurrency,
      defaultShippingPriceForWarehouse,
    } = editState;
    const shippingState = editState.getCountryShippingState(
      shippingSetting.country,
    );
    const { shippingPrice } = shippingState;
    const [text, setText] = useState<string>(shippingPrice?.toString() || "");
    useEffect(() => {
      if (shippingPrice == null) {
        setText(defaultShippingPriceForWarehouse?.toString() || "");
        return;
      }

      setText(shippingPrice?.toString() || "");
    }, [defaultShippingPriceForWarehouse, setText, shippingPrice]);

    return (
      <CurrencyInput
        value={text}
        placeholder="0.00"
        currencyCode={primaryCurrency}
        hideCheckmarkWhenValid
        onChange={({ text }) => {
          setText(text.trim());
        }}
        onBlur={() => {
          const amount = parseFloat(text.trim());
          shippingState.setPrice(amount);
        }}
        debugValue={(Math.random() * 10).toFixed(2).toString()}
        style={{ width: 130 }}
        forceValidation={forceValidation}
        disabled={!shippingState.enabled}
        data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.SHIPPING_PRICE}
      />
    );
  },
);

type CountryShippingTTDProps = {
  readonly shippingSetting: PickedShippingSettingsSchema;
  readonly editState: ProductShippingEditState;
};

const CountryShippingTTD: React.FC<CountryShippingTTDProps> = observer(
  ({ shippingSetting, editState }: CountryShippingTTDProps) => {
    const { forceValidation, defaultTTD, ttdValidators } = editState;
    const shippingState = editState.getCountryShippingState(
      shippingSetting.country,
    );

    const timeToDoor = shippingState.timeToDoorValue;
    const [text, setText] = useState<string | undefined>(
      timeToDoor?.toString() || undefined,
    );
    useEffect(() => {
      if (!timeToDoor) {
        setText(defaultTTD?.toString());
        return;
      }

      setText(timeToDoor?.toString());
    }, [defaultTTD, setText, timeToDoor]);

    return (
      <TextInput
        value={text}
        placeholder={i`e.g. ${5}`}
        hideCheckmarkWhenValid
        onChange={({ text }) => {
          setText(text.trim());
        }}
        onBlur={() => {
          const ttd = text ? parseInt(text.trim()) : undefined;
          shippingState.setTimeToDoor(ttd);
        }}
        forceValidation={forceValidation}
        disabled={!shippingState.enabled}
        validators={ttdValidators}
        style={{ width: 80 }}
        data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.MAX_DELIVERY_DAYS}
      />
    );
  },
);

type Props = BaseProps & {
  readonly editState: ProductShippingEditState;
};

const CountryShipping: React.FC<Props> = ({ editState }: Props) => {
  const styles = useStylesheet();
  const { warehouseConfiguredCountries, ttdColumnDescription, ttdValidators } =
    editState;
  const [expandedRow, setExpandedRow] = useState<number | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<Set<CountryCode>>(
    new Set([]),
  );
  const [ttdValue, setTTDValue] = useState<string | undefined>(undefined);
  const [canApplyToAll, setCanApplyToAll] = useState<boolean>(true);
  const [filter, setFilter] = useState<string | undefined>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [data, setData] = useState<ReadonlyArray<PickedShippingSettingsSchema>>(
    warehouseConfiguredCountries,
  );

  const onRowSelectionToggled = (
    args: RowSelectionArgs<PickedShippingSettingsSchema>,
  ) => {
    const { selected, row } = args;
    if (selected) {
      selectedRows.add(row.country.code);
    } else {
      selectedRows.delete(row.country.code);
    }
    setSelectedRows(new Set(selectedRows));
  };

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      setExpandedRow(index);
    } else {
      setExpandedRow(undefined);
    }
  };

  const renderExpanded = (shippingSetting: PickedShippingSettingsSchema) => {
    const shippingState = editState.getCountryShippingState(
      shippingSetting.country,
    );
    return (
      <Card>
        <RegionShippingTable
          regions={shippingState.regions || []}
          shippingState={shippingState}
        />
      </Card>
    );
  };

  const rowExpands = (shippingSetting: PickedShippingSettingsSchema) => {
    const shippingState = editState.getCountryShippingState(
      shippingSetting.country,
    );
    return shippingState.regions != null && shippingState.regions.length > 0;
  };

  const onSearchTextChange = ({ text }: OnTextChangeEvent) => {
    setPageNumber(0);
    setFilter(text);
    setExpandedRow(undefined);
    setSelectedRows(new Set([]));
  };

  useEffect(() => {
    let newData = warehouseConfiguredCountries;
    if (filter) {
      newData = newData.filter((shippingSetting) =>
        shippingSetting.country.name
          .toLowerCase()
          .includes(filter.toLowerCase()),
      );
    }
    setData(newData);
  }, [filter, setData, warehouseConfiguredCountries]);

  const dataOnCurrentPage = data.slice(
    pageNumber * PAGE_SIZE,
    (pageNumber + 1) * PAGE_SIZE,
  );
  const selectedRowOnCurrentPage = dataOnCurrentPage.reduce(
    //disabled to satisfy the callback requirement on .reduce
    //eslint-disable-next-line local-rules/no-large-method-params
    (
      accumulator: number[],
      row: PickedShippingSettingsSchema,
      index: number,
    ) => {
      if (selectedRows.has(row.country.code)) {
        accumulator = [...accumulator, index];
      }
      return accumulator;
    },
    [],
  );

  // todo: for now we only display configured countries for a particular warehouse.
  //       will extend to all countires in the future.
  return (
    <div className={css(styles.root)}>
      <div className={css(styles.searchBoxAndPageIndicator)}>
        <SearchBox
          className={css(styles.searchBox)}
          onChange={onSearchTextChange}
          placeholder={i`Search by destination`}
          defaultValue={filter}
          data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.SEARCH}
        />
        <PageIndicator
          className={css(styles.pageIndicator)}
          totalItems={data.length}
          rangeStart={pageNumber * PAGE_SIZE + 1}
          rangeEnd={Math.min((pageNumber + 1) * PAGE_SIZE, data.length)}
          hasNext={(pageNumber + 1) * PAGE_SIZE < data.length}
          hasPrev={pageNumber >= 1}
          currentPage={pageNumber + 1}
          onPageChange={(nextPage: number) => {
            setPageNumber(nextPage - 1);
            setExpandedRow(undefined);
          }}
        />
      </div>

      {selectedRows.size !== 0 && editState.showTTDColumn && (
        <div className={css(styles.row)}>
          <TextInput
            value={ttdValue}
            placeholder={i`e.g. ${5}`}
            hideCheckmarkWhenValid
            onChange={({ text }) => {
              setTTDValue(text);
            }}
            validators={ttdValidators}
            style={{ width: 80 }}
            onValidityChanged={(isValid: boolean) => {
              setCanApplyToAll(isValid);
            }}
          />
          <Button
            onClick={() => {
              const selectedShippingSettings = data.filter((shippingSetting) =>
                selectedRows.has(shippingSetting.country.code),
              );
              for (const shippingSetting of selectedShippingSettings) {
                const shippingState = editState.getCountryShippingState(
                  shippingSetting.country,
                );
                shippingState.setTimeToDoor(
                  ttdValue ? parseInt(ttdValue) : undefined,
                );
              }
            }}
            style={{ width: 285 }}
            disabled={!canApplyToAll}
            data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.APPLY_DAYS}
          >
            Apply days to all selected countries
          </Button>
        </div>
      )}

      <Table
        data={dataOnCurrentPage}
        hideBorder
        rowHeight={70}
        rowExpands={rowExpands}
        expandedRows={expandedRow !== undefined ? [expandedRow] : []}
        renderExpanded={renderExpanded}
        onRowExpandToggled={onRowExpandToggled}
        selectedRows={selectedRowOnCurrentPage}
        onRowSelectionToggled={onRowSelectionToggled}
        canSelectRow={({ row: shippingSetting }) => {
          if (!editState.showTTDColumn) {
            return false;
          }
          const shippingState = editState.getCountryShippingState(
            shippingSetting.country,
          );
          const enabled = shippingState.enabled;
          return enabled !== undefined && enabled !== null ? enabled : false;
        }}
        actions={[]}
      >
        <Table.Column
          title={i`Destination`}
          columnKey="country.name"
          description={i`These are the destinations enabled in your shipping settings.`}
          handleEmptyRow
          minWidth={150}
        >
          {({
            row: shippingSetting,
          }: CellInfo<
            PickedShippingSettingsSchema["country"]["name"],
            PickedShippingSettingsSchema
          >) => (
            <div className={css(styles.country)}>
              <Flag
                countryCode={shippingSetting.country.code}
                className={css(styles.flag)}
              />
              <div
                className={css(styles.countryName)}
                data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.DESTINATION}
              >
                {shippingSetting.country.name}
              </div>
            </div>
          )}
        </Table.Column>
        <Table.Column
          title={i`Shipping price`}
          description={i`The shipping price for this product to this destination.`}
          columnKey="price"
          minWidth={150}
          handleEmptyRow
        >
          {({
            row: shippingSetting,
          }: CellInfo<
            PickedShippingSettingsSchema,
            PickedShippingSettingsSchema
          >) => (
            <CountryShippingPrice
              key={shippingSetting.country.name}
              shippingSetting={shippingSetting}
              editState={editState}
            />
          )}
        </Table.Column>
        {editState.showTTDColumn && (
          <Table.Column
            title={i`Max delivery days`}
            description={ttdColumnDescription}
            columnKey="timeToDoor"
            minWidth={150}
            handleEmptyRow
          >
            {({
              row: shippingSetting,
            }: CellInfo<
              PickedShippingSettingsSchema,
              PickedShippingSettingsSchema
            >) => (
              <CountryShippingTTD
                key={shippingSetting.country.name}
                shippingSetting={shippingSetting}
                editState={editState}
              />
            )}
          </Table.Column>
        )}
        {editState.showTTDColumn && (
          <Table.Column
            title={i`Badges`}
            columnKey="wishExpress"
            minWidth={100}
            handleEmptyRow
          >
            {({
              row: shippingSetting,
            }: CellInfo<
              PickedShippingSettingsSchema,
              PickedShippingSettingsSchema
            >) => {
              const shippingState = editState.getCountryShippingState(
                shippingSetting.country,
              );
              const {
                wishExpressTTDRequirement,
                topGMVCountry,
                timeToDoorValue,
              } = shippingState;
              const isTimeToDoorExpress =
                wishExpressTTDRequirement && timeToDoorValue
                  ? timeToDoorValue <= wishExpressTTDRequirement
                  : false;
              return (
                <BadgeColumn
                  isTimeToDoorExpress={isTimeToDoorExpress}
                  topGMVCountry={topGMVCountry}
                />
              );
            }}
          </Table.Column>
        )}
        <Table.SwitchColumn
          title={i`Enable destination`}
          description={i`You can enable or disable each destination for this product.`}
          minWidth={200}
          columnKey="enabled"
          handleEmptyRow
          switchProps={({
            row: shippingSetting,
          }: CellInfo<boolean, PickedShippingSettingsSchema>) => {
            const shippingState = editState.getCountryShippingState(
              shippingSetting.country,
            );
            return {
              isOn: !!shippingState.enabled,
              onToggle(enabled) {
                shippingState.setEnabled(enabled);
                if (!enabled) {
                  selectedRows.delete(shippingSetting.country.code);
                  setSelectedRows(new Set(selectedRows));
                }
              },
            };
          }}
          width={150}
        />
      </Table>
    </div>
  );
};

export default observer(CountryShipping);

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: surfaceLightest,
        },
        country: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        },
        flag: {
          width: 22,
          height: 22,
          marginRight: 12,
        },
        countryName: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
        },
        input: {
          flex: 1,
          border: "none",
          maxWidth: "100%",
        },
        row: {
          display: "flex",
          flexDirection: "row",
          marginBottom: 8,
        },
        searchBoxAndPageIndicator: {
          marginTop: 17,
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          marginBottom: 24,
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "stretch",
        },
        searchBox: {
          fontWeight: fonts.weightBold,
          "@media (min-width: 900px)": {
            minWidth: 365,
          },
        },
      }),
    [surfaceLightest],
  );
};
