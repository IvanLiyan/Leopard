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
  FilterButton,
  Layout,
  CheckboxGroupField,
  Text,
  PrimaryButton,
} from "@ContextLogic/lego";
import Popover from "@merchant/component/core/Popover";
import Flag from "@merchant/component/core/Flag";
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
import { OptionType } from "@ContextLogic/lego/component/form/CheckboxGroupField";
import isEmpty from "lodash/isEmpty";
import { CurrencyValidator } from "@toolkit/validators";
import { getCurrencySymbol } from "@ContextLogic/lego/toolkit/currency";
import Icon from "@merchant/component/core/Icon";

const PAGE_SIZE = 10;

type CountryShippingPriceProps = {
  readonly shippingSetting: PickedShippingSettingsSchema;
  readonly editState: ProductShippingEditState;
};

type AdvancedLogisticsState =
  | "AdvancedLogisticsSupported"
  | "AdvancedLogisticsNotSupported";

const LOGISTICS_PROGRAM_FILTERS: ReadonlyArray<
  OptionType<AdvancedLogisticsState>
> = [
  {
    value: "AdvancedLogisticsSupported",
    title: i`Yes`,
  },
  {
    value: "AdvancedLogisticsNotSupported",
    title: i`No`,
  },
];

const CountryShippingPrice: React.FC<CountryShippingPriceProps> = observer(
  ({ shippingSetting, editState }: CountryShippingPriceProps) => {
    const styles = useStylesheet();
    const { primary } = useTheme();
    const {
      forceValidation,
      primaryCurrency,
      defaultShippingPriceForWarehouse,
    } = editState;
    const shippingState = editState.getCountryShippingState(
      shippingSetting.country
    );
    const { shippingPrice } = shippingState;
    const [text, setText] = useState<string>(shippingPrice?.toString() || "");
    const isUnity =
      editState.showAdvancedSection &&
      editState.unityCountries
        .map((country) => country.code)
        .includes(shippingSetting.country.code);

    const showEstimatedShipping =
      editState.isMerchantInCalculatedShippingBeta &&
      isUnity &&
      editState.getDomesticShippingEnabled(editState.warehouseId);

    const wishpostEstimatedPrices = editState.getCountryEstimatedShipping(
      shippingSetting.country
    );

    const getEstimatedCostString = () => {
      let estimatedCostString = i`Calculated`;

      if (
        wishpostEstimatedPrices?.minPrice &&
        wishpostEstimatedPrices?.maxPrice
      ) {
        if (
          wishpostEstimatedPrices?.minPrice.amount ===
          wishpostEstimatedPrices?.maxPrice.amount
        ) {
          estimatedCostString = `${wishpostEstimatedPrices.minPrice.amount}`;
        } else {
          estimatedCostString =
            `${wishpostEstimatedPrices.minPrice.amount} ` +
            `- ${wishpostEstimatedPrices.maxPrice.amount}`;
        }
      } else if (wishpostEstimatedPrices?.minPrice) {
        estimatedCostString = `${wishpostEstimatedPrices.minPrice.amount}`;
      } else if (wishpostEstimatedPrices?.maxPrice) {
        estimatedCostString = `${wishpostEstimatedPrices.maxPrice.amount}`;
      }

      return estimatedCostString;
    };

    useEffect(() => {
      if (shippingPrice == null) {
        setText(defaultShippingPriceForWarehouse?.toString() || "");
        return;
      }

      setText(shippingPrice?.toString() || "");
    }, [defaultShippingPriceForWarehouse, setText, shippingPrice]);

    return showEstimatedShipping ? (
      <Layout.FlexRow>
        <span className={css(styles.currencySymbol)}>
          {getCurrencySymbol(primaryCurrency)}
        </span>
        {getEstimatedCostString()}
        <Popover
          popoverContent={
            i`The estimated single quantity WishPost shipping prices ` +
            i`based on the lightest and the heaviest variations`
          }
          position="right"
          popoverMaxWidth={250}
          style={styles.calculatorIconPopover}
        >
          <Icon name="calculator" size="small" color={primary} />
        </Popover>
      </Layout.FlexRow>
    ) : (
      <CurrencyInput
        value={text}
        placeholder={"0.00"}
        currencyCode={primaryCurrency}
        hideCheckmarkWhenValid
        onChange={({ text }) => {
          if (!showEstimatedShipping) {
            setText(text.trim());
          }
        }}
        onBlur={() => {
          const amount = parseFloat(text.trim());
          shippingState.setPrice(amount);
        }}
        debugValue={(Math.random() * 10).toFixed(2).toString()}
        validators={
          showEstimatedShipping ? undefined : [new CurrencyValidator()]
          /*Remove line after unity calculated price is added: https://jira.wish.site/browse/MKL-53941*/
        }
        style={{ width: 130 }}
        forceValidation={forceValidation}
        disabled={showEstimatedShipping || !shippingState.enabled}
        data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.SHIPPING_PRICE}
      />
    );
  }
);

type CountryShippingTTDProps = {
  readonly shippingSetting: PickedShippingSettingsSchema;
  readonly editState: ProductShippingEditState;
};

const CountryShippingTTD: React.FC<CountryShippingTTDProps> = observer(
  ({ shippingSetting, editState }: CountryShippingTTDProps) => {
    const { forceValidation, defaultTTD, ttdValidators } = editState;
    const shippingState = editState.getCountryShippingState(
      shippingSetting.country
    );

    const timeToDoor = shippingState.timeToDoorValue;
    const [text, setText] = useState<string | undefined>(
      timeToDoor?.toString() || undefined
    );
    const [userEdited, setUserEdited] = useState<boolean>(false);
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
        onFocus={() => setUserEdited(true)}
        validators={userEdited ? ttdValidators : []}
        style={{ width: 80 }}
        data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.MAX_DELIVERY_DAYS}
      />
    );
  }
);

type Props = BaseProps & {
  readonly editState: ProductShippingEditState;
};

const CountryShipping: React.FC<Props> = ({ editState }: Props) => {
  const styles = useStylesheet();
  const {
    warehouseConfiguredCountries,
    ttdColumnDescription,
    ttdValidators,
    showAdvancedSection,
    unityCountries,
    warehouseConfiguredCountriesWithUnityCountries,
    isMerchantInCalculatedShippingBeta,
  } = editState;

  const [expandedRow, setExpandedRow] = useState<number | undefined>(undefined);
  const [selectedRows, setSelectedRows] = useState<Set<CountryCode>>(
    new Set([])
  );
  const [ttdValue, setTTDValue] = useState<string | undefined>(undefined);
  const [canApplyToAll, setCanApplyToAll] = useState<boolean>(true);
  const [searchString, setSearchString] = useState<string | undefined>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [data, setData] = useState<ReadonlyArray<PickedShippingSettingsSchema>>(
    []
  );
  const [userEdited, setUserEdited] = useState<boolean>(false);
  const [filters, setFilters] = useState<ReadonlyArray<string>>([]);
  const [tempFilters, setTempFilters] = useState<ReadonlyArray<string>>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const unityCountryCodes = unityCountries.map((country) => country.code);

  //useEffect to perform initial data load after feature flags, can be deprecated
  //once we remove feature flags, to set data in useState directly.
  useEffect(() => {
    setData(
      isMerchantInCalculatedShippingBeta
        ? warehouseConfiguredCountriesWithUnityCountries
        : warehouseConfiguredCountries
    );
  }, [
    isMerchantInCalculatedShippingBeta,
    warehouseConfiguredCountries,
    warehouseConfiguredCountriesWithUnityCountries,
  ]);

  const onRowSelectionToggled = (
    args: RowSelectionArgs<PickedShippingSettingsSchema>
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
      shippingSetting.country
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
      shippingSetting.country
    );
    return shippingState.regions != null && shippingState.regions.length > 0;
  };

  const onSearchTextChange = ({ text }: OnTextChangeEvent) => {
    setPageNumber(0);
    setSearchString(text);
    setExpandedRow(undefined);
    setSelectedRows(new Set([]));

    let newData = isMerchantInCalculatedShippingBeta
      ? warehouseConfiguredCountriesWithUnityCountries
      : warehouseConfiguredCountries;

    newData = newData.filter((shippingSetting) =>
      shippingSetting.country.name.toLowerCase().includes(text.toLowerCase())
    );

    setData(newData);
  };

  const dataOnCurrentPage = data.slice(
    pageNumber * PAGE_SIZE,
    (pageNumber + 1) * PAGE_SIZE
  );
  const selectedRowOnCurrentPage = dataOnCurrentPage.reduce(
    //disabled to satisfy the callback requirement on .reduce
    //eslint-disable-next-line local-rules/no-large-method-params
    (
      accumulator: number[],
      row: PickedShippingSettingsSchema,
      index: number
    ) => {
      if (selectedRows.has(row.country.code)) {
        accumulator = [...accumulator, index];
      }
      return accumulator;
    },
    []
  );

  const onCheckedFilter = ({ value }: OptionType<string>) => {
    const filterSet = new Set(tempFilters || []);
    if (filterSet.has(value)) {
      filterSet.delete(value);
    } else {
      filterSet.add(value);
    }
    setTempFilters(Array.from(filterSet));
  };

  const applyFilters = () => {
    setPageNumber(0);
    setExpandedRow(undefined);
    setSelectedRows(new Set([]));

    let newData = isMerchantInCalculatedShippingBeta
      ? warehouseConfiguredCountriesWithUnityCountries
      : warehouseConfiguredCountries;

    if (!isEmpty(tempFilters)) {
      if (!tempFilters.includes("AdvancedLogisticsSupported")) {
        newData = newData.filter(
          (shippingSetting) =>
            !unityCountryCodes.includes(shippingSetting.country.code)
        );
      }
      if (!tempFilters.includes("AdvancedLogisticsNotSupported")) {
        newData = newData.filter((shippingSetting) => {
          return unityCountryCodes.includes(shippingSetting.country.code);
        });
      }
    }

    setData(newData);
    setFilters(tempFilters);
  };

  // todo: for now we only display configured countries for a particular warehouse.
  //       will extend to all countires in the future.
  return (
    <div className={css(styles.root)}>
      <Layout.FlexRow
        className={css(styles.tableToolbar)}
        alignItems="stretch"
        justifyContent="space-between"
      >
        <Layout.FlexRow>
          <SearchBox
            style={styles.searchBox}
            onChange={onSearchTextChange}
            placeholder={i`Search by destination`}
            defaultValue={searchString}
            data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.SEARCH}
          />
          {showAdvancedSection && isMerchantInCalculatedShippingBeta && (
            <Popover
              position="bottom"
              popoverOpen={showFilters}
              popoverContent={() => (
                <Layout.FlexColumn style={styles.filterContainer}>
                  <Layout.FlexRow style={styles.filterTitle}>
                    <Text weight="semibold">Advanced Logistics Support</Text>
                  </Layout.FlexRow>
                  <Layout.FlexRow style={styles.filterOption}>
                    <CheckboxGroupField
                      onChecked={onCheckedFilter}
                      options={LOGISTICS_PROGRAM_FILTERS}
                      selected={tempFilters}
                    />
                  </Layout.FlexRow>
                  <Button
                    onClick={() => {
                      setTempFilters([]);
                      setShowFilters(false);
                    }}
                    style={styles.popoverButton}
                  >
                    Cancel
                  </Button>
                  <PrimaryButton
                    onClick={() => {
                      applyFilters();
                      setShowFilters(false);
                    }}
                    isDisabled={tempFilters == filters}
                    style={styles.popoverButton}
                  >
                    Apply
                  </PrimaryButton>
                </Layout.FlexColumn>
              )}
            >
              <FilterButton
                onClick={() => {
                  setTempFilters(filters);
                  setShowFilters(!showFilters);
                }}
                className={css(styles.filterButton)}
              />
            </Popover>
          )}
        </Layout.FlexRow>
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
      </Layout.FlexRow>
      {selectedRows.size !== 0 && editState.showTTDColumn && (
        <Layout.FlexRow style={styles.flexRow}>
          <TextInput
            value={ttdValue}
            placeholder={i`e.g. ${5}`}
            hideCheckmarkWhenValid
            onChange={({ text }) => {
              setTTDValue(text);
            }}
            onFocus={() => setUserEdited(true)}
            validators={userEdited ? ttdValidators : []}
            style={{ width: 80 }}
            onValidityChanged={(isValid: boolean) => {
              setCanApplyToAll(isValid);
            }}
          />
          <Button
            onClick={() => {
              const selectedShippingSettings = data.filter((shippingSetting) =>
                selectedRows.has(shippingSetting.country.code)
              );
              for (const shippingSetting of selectedShippingSettings) {
                const shippingState = editState.getCountryShippingState(
                  shippingSetting.country
                );
                shippingState.setTimeToDoor(
                  ttdValue ? parseInt(ttdValue) : undefined
                );
              }
            }}
            style={{ width: 285 }}
            disabled={!canApplyToAll}
            data-testid={MERCHANT_PRODUCT_SHIPPING_TEST_ID.APPLY_DAYS}
          >
            Apply days to all selected countries
          </Button>
        </Layout.FlexRow>
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
            shippingSetting.country
          );
          const enabled = shippingState.enabled;
          return enabled !== undefined && enabled !== null ? enabled : false;
        }}
        actions={[]}
      >
        <Table.Column
          _key={undefined}
          title={i`Destination`}
          columnKey="country.name"
          description={i`The destinations enabled in your shipping settings`}
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
        {showAdvancedSection && isMerchantInCalculatedShippingBeta && (
          <Table.Column
            _key={undefined}
            title={i`Advanced Logistics Support`}
            description={i`Whether or not the destination country supports advanced logistics`}
            columnKey="country"
            minWidth={150}
            handleEmptyRow
          >
            {({
              row: shippingSetting,
            }: CellInfo<
              PickedShippingSettingsSchema,
              PickedShippingSettingsSchema
            >) =>
              unityCountryCodes.includes(shippingSetting.country.code)
                ? i`Yes`
                : i`No`
            }
          </Table.Column>
        )}
        <Table.Column
          _key={undefined}
          title={i`Shipping price`}
          description={i`The shipping price for this product to the destination`}
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
            _key={undefined}
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
            _key={undefined}
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
                shippingSetting.country
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
          _key={undefined}
          title={i`Enable destination`}
          description={i`Confirm that you ship to this destination`}
          minWidth={200}
          columnKey="enabled"
          handleEmptyRow
          switchProps={({
            row: shippingSetting,
          }: CellInfo<boolean, PickedShippingSettingsSchema>) => {
            const shippingState = editState.getCountryShippingState(
              shippingSetting.country
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
        flexRow: {
          marginBottom: 8,
        },
        tableToolbar: {
          marginTop: 17,
          flexWrap: "wrap",
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
        filterButton: {
          marginLeft: 5,
        },
        filterContainer: {
          padding: 20,
        },
        filterOption: {
          margin: "5px 10px 5px 10px",
          cursor: "pointer",
        },
        filterTitle: {
          margin: "10px 10px 10px 10px",
        },
        currencySymbol: {
          paddingRight: 10,
        },
        popoverButton: {
          marginTop: 10,
        },
        calculatorIconPopover: {
          paddingLeft: 10,
        },
      }),
    [surfaceLightest]
  );
};
