import React, { useMemo, useState, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import Fuse from "fuse.js";
import _ from "lodash";

/* Toolkit */
import { css } from "@toolkit/styling";
import countries, { CountryCode } from "@toolkit/countries";

/* Lego Components */
import {
  Card,
  SearchBox,
  PageIndicator,
  CellInfo,
  Table,
  Layout,
  Text,
  RowSelectionArgs,
  TextInput,
  Popover,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";
import {
  Flag,
  DEPRECATEDIcon as Icon,
  Illustration,
} from "@merchant/component/core";

/* Model */
import { Country } from "@schema/types";
import WarehouseSettingsState from "@merchant/model/products/WarehouseSettingsState";
import {
  WarehouseSettingsInitialData,
  PickedCountry,
  PickedWarehouse,
} from "@toolkit/products/warehouse-settings";

type Props = BaseProps & {
  readonly state: WarehouseSettingsState;
  readonly initialData: WarehouseSettingsInitialData;
};

type CountryData = Pick<Country, "name" | "code" | "gmvRank">;

type DataItem = {
  readonly enabled: boolean;
  readonly country: CountryData;
  readonly supportsWishExpress: boolean;
  readonly isTopGMVCountry: boolean;
};

type SortField = "ENABLED";
type SortOrder = "asc" | "desc" | "not-applied";

const ShippingSettings: React.FC<Props> = ({
  className,
  style,
  initialData,
  state,
}: Props) => {
  const styles = useStylesheet();
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(
    new Set()
  );
  const [enabledCountries, setEnabledCountries] = useState<Set<CountryCode>>(
    new Set()
  );
  const [query, setQuery] = useState("");
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [sortField, setSortField] = useState<SortField | undefined>("ENABLED");
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>("desc");

  const {
    currentMerchant: { warehouses },
    platformConstants: { euCountriesWeShipTo },
  } = initialData;

  const defaultCountries = useMemo(() => {
    const standardWarehouse =
      warehouses != null
        ? warehouses.filter(
            (warehouse: PickedWarehouse) => warehouse.unitId === "STANDARD"
          )
        : [];
    return standardWarehouse.length > 0
      ? standardWarehouse[0].enabledCountries || []
      : [];
  }, [warehouses]);

  const defaultEuCountries = useMemo(() => {
    const euCountryCodes = new Set(
      euCountriesWeShipTo.map((country) => country.code)
    );
    return defaultCountries.filter((country) =>
      euCountryCodes.has(country.code)
    );
  }, [defaultCountries, euCountriesWeShipTo]);

  const fuse = useFuse(defaultCountries);

  const isTopGMVCountry = (country: PickedCountry): boolean =>
    country.gmvRank != null && country.gmvRank <= 10;

  const onPageChange = (nextPage: number) => {
    const newPage = Math.max(0, nextPage);
    setOffset(newPage * limit);
    setSelectedRowIndices(new Set());
  };

  const clearSelection = () => {
    setSelectedRowIndices(new Set());
  };

  const results: ReadonlyArray<DataItem> = useMemo(() => {
    let results: ReadonlyArray<PickedCountry> = defaultCountries;
    if (query.trim().length > 0) {
      const fuseResults = fuse.search(query.trim());
      results = fuseResults.map((result) => result.item);
    }

    const data: ReadonlyArray<DataItem> = results.map((country) => {
      return {
        enabled: enabledCountries.has(country.code),
        country: {
          name: countries[country.code],
          code: country.code,
          gmvRank: country.gmvRank,
        },
        supportsWishExpress: country.wishExpress.supportsWishExpress,
        isTopGMVCountry: isTopGMVCountry(country),
      };
    });

    if (sortField == "ENABLED") {
      return _.sortBy(data, ({ enabled }) => {
        const indicator = enabled ? 1 : 0;
        return sortOrder == "asc" ? indicator : -indicator;
      });
    }

    return _.sortBy(
      data,
      ({ country }) => country.gmvRank ?? Number.MAX_SAFE_INTEGER
    );
  }, [query, defaultCountries, fuse, enabledCountries, sortField, sortOrder]);

  const onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<DataItem>) => {
    if (selected) {
      selectedRowIndices.add(index);
    } else {
      selectedRowIndices.delete(index);
    }
    setSelectedRowIndices(new Set(selectedRowIndices));
  };

  const onRowEnabled = (isOn: boolean, row: DataItem) => {
    if (isOn) {
      enabledCountries.add(row.country.code);
    } else {
      enabledCountries.delete(row.country.code);
    }
    setEnabledCountries(new Set(enabledCountries));
    state.enabledCountries = Array.from(enabledCountries);
    clearSelection();
  };

  const setCountriesEnabled = useCallback(
    (countryCodes: ReadonlyArray<CountryCode>, enabled: boolean) => {
      for (const countryCode of countryCodes) {
        if (enabled) {
          enabledCountries.add(countryCode);
        } else {
          enabledCountries.delete(countryCode);
        }
      }
      setEnabledCountries(new Set(enabledCountries));
      setSelectedRowIndices(new Set());
      state.enabledCountries = Array.from(enabledCountries);
    },
    [enabledCountries, state]
  );

  const tableActions = useMemo(() => {
    const topWishCountries = defaultCountries.filter((country) =>
      isTopGMVCountry(country)
    );
    const topWishCountriesSelected = topWishCountries.every(({ code }) =>
      enabledCountries.has(code as CountryCode)
    );
    const topEUCountriesSelected = defaultEuCountries.every(({ code }) =>
      enabledCountries.has(code as CountryCode)
    );

    return [
      {
        key: "enable-selected",
        name: i`Enable selected`,
        canBatch: true,
        batchOnly: true,
        canApplyToRow: () => true,
        apply(countries: ReadonlyArray<DataItem>) {
          const countryCodes = countries.map(
            ({ country: { code } }) => code
          ) as CountryCode[];
          setCountriesEnabled(countryCodes, true);
        },
      },
      {
        key: "disable-selected",
        name: i`Disable selected`,
        canBatch: true,
        batchOnly: true,
        canApplyToRow: () => true,
        apply(countries: ReadonlyArray<DataItem>) {
          const countryCodes = countries.map(
            ({ country: { code } }) => code
          ) as CountryCode[];
          setCountriesEnabled(countryCodes, false);
        },
      },
      {
        key: "enable-top-wish-countries",
        name: i`Enable top Wish countries`,
        canBatch: true,
        batchOnly: true,
        canApplyToRow: topWishCountriesSelected ? () => false : undefined,
        apply(countries: ReadonlyArray<DataItem>) {
          const countryCodes = topWishCountries.map(
            ({ code }) => code
          ) as CountryCode[];
          setCountriesEnabled(countryCodes, true);
        },
      },
      {
        key: "enable-top-eu-countries",
        name: i`Enable top European countries`,
        canBatch: true,
        batchOnly: true,
        canApplyToRow: topEUCountriesSelected ? () => false : undefined,
        apply(countries: ReadonlyArray<DataItem>) {
          const euCountryCodes = defaultEuCountries.map(
            ({ code }) => code
          ) as CountryCode[];
          setCountriesEnabled(euCountryCodes, true);
        },
      },
    ];
  }, [
    defaultCountries,
    defaultEuCountries,
    setCountriesEnabled,
    enabledCountries,
  ]);

  return (
    <Card
      title={i`Warehouse shipping settings`}
      className={css(styles.root, className, style)}
    >
      <Layout.FlexRow
        justifyContent="space-between"
        alignItems="stretch"
        className={css(styles.section)}
      >
        <div className={css(styles.sectionHalf)}>
          <Layout.FlexColumn>
            <Text>
              The following shipping settings only apply to this warehouse.
              Enabling a destination here will allow customers in the given
              destination country/region to view all active products in this
              warehouse (given the products also have set inventory, shipping
              price, and max delivery days).
            </Text>
            <Text style={styles.paragraph}>
              Note that you cannot add/remove destinations once the warehouse is
              created (but you may enable/disable destinations for individual
              products in the warehouse, in the Edit International Shipping
              Options page).
            </Text>
          </Layout.FlexColumn>
        </div>
        <Layout.FlexColumn className={css(styles.sectionHalf)}>
          <Layout.FlexRow>
            <Layout.FlexRow className={css(styles.labels)}>
              <Icon name="ship" className={css(styles.icon)} />
              <Text weight="bold">Enabled destinations</Text>
            </Layout.FlexRow>
            <Text className={css(styles.labels)}>
              {Array.from(enabledCountries).length}
            </Text>
          </Layout.FlexRow>
        </Layout.FlexColumn>
      </Layout.FlexRow>
      <Layout.FlexRow
        justifyContent="space-between"
        className={css(styles.section, styles.tableControls)}
      >
        <SearchBox
          value={query}
          onChange={({ text }) => {
            setQuery(text);
            setOffset(0);
            setSelectedRowIndices(new Set());
          }}
          placeholder={i`Search by destination`}
          height={30}
        />
        <PageIndicator
          rangeStart={offset + 1}
          rangeEnd={Math.min(results.length ?? 0, offset + limit)}
          hasNext={limit + offset < results.length}
          hasPrev={offset > 0}
          currentPage={Math.ceil(offset / limit)}
          totalItems={results.length}
          onPageChange={onPageChange}
        />
      </Layout.FlexRow>

      <Table
        data={results.slice(offset, limit + offset)}
        hideBorder
        rowHeight={60}
        selectedRows={Array.from(selectedRowIndices)}
        onRowSelectionToggled={onRowSelectionToggled}
        actions={tableActions}
        noDataMessage={i`No countries found`}
      >
        <Table.Column
          title={i`Destination`}
          columnKey="country.name"
          width={150}
          handleEmptyRow
        >
          {({
            row: { country },
          }: CellInfo<DataItem["country"]["name"], DataItem>) => {
            if (country.code == null) {
              return null;
            }
            return (
              <Layout.FlexRow>
                <Flag countryCode={country.code} className={css(styles.flag)} />
                <div className={css(styles.countryName)}>{country.name}</div>
              </Layout.FlexRow>
            );
          }}
        </Table.Column>
        <Table.Column
          title={i`Badges`}
          columnKey="isTopGMVCountry"
          minWidth={100}
          handleEmptyRow
        >
          {({ row }: CellInfo<DataItem, DataItem>) => {
            return (
              <Layout.FlexRow>
                {row.isTopGMVCountry && (
                  <Popover
                    popoverContent={i`Top GMV Country`}
                    className={css(styles.badge)}
                  >
                    <Illustration
                      name="crownGray"
                      alt="crownGray"
                      className={css(styles.gmvRankBadge)}
                    />
                  </Popover>
                )}
                {row.supportsWishExpress && (
                  <Popover
                    popoverContent={i`Supports Wish Express`}
                    className={css(styles.badge)}
                  >
                    <Illustration
                      name="wishExpressWithoutText"
                      alt="wishExpressWithoutText"
                    />
                  </Popover>
                )}
              </Layout.FlexRow>
            );
          }}
        </Table.Column>
        <Table.SwitchColumn
          title={i`Enable destination`}
          columnKey="enabled"
          handleEmptyRow
          align="left"
          switchProps={({
            row: dataItem,
          }: CellInfo<DataItem["enabled"], DataItem>) => {
            return {
              isOn: dataItem.enabled,
              onToggle(isOn) {
                onRowEnabled(isOn, dataItem);
              },
            };
          }}
          sortOrder={sortField == "ENABLED" ? sortOrder : "not-applied"}
          onSortToggled={(newOrder) => {
            setSortField("ENABLED");
            setSortOrder(newOrder);
            setOffset(0);
          }}
        />
        {/* TO BE ADDED */}
        {false && (
          <>
            <Table.Column
              title={i`Shipping price`}
              columnKey="isTopGMVCountry"
              handleEmptyRow
            >
              {({ row }) => {
                return (
                  <TextInput
                    placeholder={i`USD 0.00`}
                    className={css(styles.textInput)}
                  />
                );
              }}
            </Table.Column>

            <Table.Column
              title={i`Max Delivery Days`}
              columnKey="isTopGMVCountry"
              handleEmptyRow
            >
              {({ row }) => {
                return (
                  <TextInput
                    placeholder={i`e.g. 5`}
                    className={css(styles.textInput)}
                  />
                );
              }}
            </Table.Column>
          </>
        )}
      </Table>
    </Card>
  );
};

const useFuse = (
  countries: ReadonlyArray<PickedCountry>
): Fuse<PickedCountry, any> => {
  return useMemo((): Fuse<PickedCountry, any> => {
    const documents: ReadonlyArray<PickedCountry> = [...countries];
    const keys: ReadonlyArray<keyof PickedCountry> = ["name", "code"];
    const options = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      keys: keys as string[],
    };

    const index = Fuse.createIndex(keys as string[], documents);

    return new Fuse(documents, options, index);
  }, [countries]);
};

export default observer(ShippingSettings);

const useStylesheet = () => {
  const { borderPrimary, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          color: textBlack,
        },
        section: {
          ":not(:last-child)": {
            borderBottom: `1px solid ${borderPrimary}`,
          },
        },
        labels: {
          flex: 1,
        },
        icon: {
          width: 16,
          marginRight: 8,
        },
        sectionHalf: {
          padding: 24,
          flex: 1,
          ":last-child": {
            borderLeft: `1px solid ${borderPrimary}`,
          },
        },
        tableControls: {
          padding: 24,
        },

        //table
        flag: {
          width: 22,
          height: 22,
          marginRight: 12,
          userSelect: "none",
        },
        countryName: {
          fontSize: 14,
          minWidth: 60,
        },
        badge: {
          width: 24,
          height: 24,
          boxSizing: "border-box",
          ":not(:last-child)": {
            marginRight: 8,
          },
          userSelect: "none",
        },
        gmvRankBadge: {
          backgroundColor: borderPrimary,
          borderRadius: "50%",
          padding: 6,
        },
        textInput: {
          maxWidth: 100,
        },
        paragraph: {
          marginTop: 18,
        },
      }),
    [borderPrimary, textBlack]
  );
};
