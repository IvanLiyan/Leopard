import React, { useMemo, useState, useCallback, useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import _ from "lodash";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import {
  Card,
  SearchBox,
  PageIndicator,
  SimpleSelect,
} from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

import Fuse from "fuse.js";

/* Merchant Plus Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import { RowSelectionArgs } from "@ContextLogic/lego";
import { SortOrder } from "@ContextLogic/lego";

import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
} from "@toolkit/url";

import Header from "@plus/component/settings/shipping-settings/Header";
import ShippingSettingsTable, {
  DataItem,
  PickedCountry,
  SortField,
} from "@plus/component/settings/shipping-settings/ShippingSettingsTable";
import WishExpressIntroductionBanner from "@plus/component/products/list-products/WishExpressIntroductionBanner";
import {
  ShippableCountryCode,
  CountryShippingSetting,
  UpdateShippingSetting,
  ShippingSettingMutationsUpdateShippingSettingArgs,
} from "@schema/types";

/* Toolkit */
import { useToastStore } from "@stores/ToastStore";
import { useNavigationStore } from "@stores/NavigationStore";

type PickedShippingSettingsSchema = {
  readonly country: PickedCountry;
};

type Props = {
  readonly initialData: {
    readonly platformConstants: {
      readonly countriesWeShipTo: ReadonlyArray<PickedCountry>;
      readonly euCountriesWeShipTo: ReadonlyArray<PickedCountry>;
    };
    readonly currentMerchant: {
      readonly shippingSettings: ReadonlyArray<PickedShippingSettingsSchema> | null;
    };
  };
};

export const UPDATE_SHIPPING_SETTINGS = gql`
  mutation PlusShippingSettingsContainer_UpdateShippingSettings(
    $countryShipping: [CountryShippingSetting!]
    $isUpsert: Boolean
  ) {
    currentUser {
      merchant {
        shippingSetting {
          updateShippingSetting(
            countryShipping: $countryShipping
            isUpsert: $isUpsert
          ) {
            ok
            message
          }
        }
      }
    }
  }
`;

export type UpdateShippingSettingsMutationArgs = Pick<
  ShippingSettingMutationsUpdateShippingSettingArgs,
  "countryShipping" | "isUpsert"
>;

export type UpdateShippingSettingsMutationResponse = Pick<
  UpdateShippingSetting,
  "ok" | "message"
>;

const InputHeight = 30;

const PlusShippingSettingsContainer: React.FC<Props> = ({
  initialData,
}: Props) => {
  const {
    currentMerchant: { shippingSettings: enabledShippingSettings },
    platformConstants: { countriesWeShipTo, euCountriesWeShipTo },
  } = initialData;
  const styles = useStylesheet();
  const toastStore = useToastStore();
  const navigationStore = useNavigationStore();

  const originallyEnabledCountries = useMemo(() => {
    return new Set(
      (enabledShippingSettings || []).map(({ country }) => country.code),
    ) as Set<ShippableCountryCode>;
  }, [enabledShippingSettings]);
  const [query, setQuery] = useStringQueryParam("q");
  const [rawLimit, setLimit] = useIntQueryParam("limit");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [sortField, setSortField] = useStringEnumQueryParam<
    SortField | undefined
  >("sort_field", "ENABLED");
  const [sortOrder, setSortOrder] = useStringEnumQueryParam<
    SortOrder | undefined
  >("sort_order", "desc");
  const [selectedRowIndeces, setSelectedRowIndeces] = useState<Set<number>>(
    new Set(),
  );
  const [enabledCountries, setEnabledCountries] = useState<
    Set<ShippableCountryCode>
  >(new Set(originallyEnabledCountries));

  const fuse = useFuse(countriesWeShipTo);

  const limit = rawLimit || 10;
  const offset = rawOffset || 0;

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
    setSelectedRowIndeces(new Set());
  };

  const onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<DataItem>) => {
    if (selected) {
      selectedRowIndeces.add(index);
    } else {
      selectedRowIndeces.delete(index);
    }
    setSelectedRowIndeces(new Set(selectedRowIndeces));
  };

  const setCountriesEnabled = useCallback(
    (countryCodes: ReadonlyArray<ShippableCountryCode>, enabled: boolean) => {
      for (const countryCode of countryCodes) {
        if (enabled) {
          enabledCountries.add(countryCode);
        } else {
          enabledCountries.delete(countryCode);
        }
      }
      setEnabledCountries(new Set(enabledCountries));
      setSelectedRowIndeces(new Set());
    },
    [enabledCountries],
  );

  const isTopGMVCountry = (country: PickedCountry): boolean =>
    country.gmvRank != null && country.gmvRank <= 10;
  const results: ReadonlyArray<DataItem> = useMemo(() => {
    let results: ReadonlyArray<PickedCountry> = countriesWeShipTo;
    if (query.trim().length > 0) {
      const fuseResults = fuse.search(query.trim());
      results = fuseResults.map((result) => result.item);
    }

    const data: ReadonlyArray<DataItem> = results.map((country) => {
      return {
        enabled: enabledCountries.has(country.code as ShippableCountryCode),
        country,
        wishExpress: country.wishExpress,
        isTopGMVCountry: isTopGMVCountry(country),
        originallyEnabled: originallyEnabledCountries.has(
          country.code as ShippableCountryCode,
        ),
      };
    });

    if (sortField == "ENABLED") {
      return _.sortBy(data, ({ originallyEnabled }) => {
        const indicator = originallyEnabled ? 1 : 0;
        return sortOrder == "asc" ? indicator : -indicator;
      });
    }

    return _.sortBy(
      data,
      ({ country }) => country.gmvRank ?? Number.MAX_SAFE_INTEGER,
    );
  }, [
    query,
    countriesWeShipTo,
    fuse,
    enabledCountries,
    sortField,
    sortOrder,
    originallyEnabledCountries,
  ]);

  const canSave: boolean = useMemo(
    () => !_.isEqual(enabledCountries, originallyEnabledCountries),
    [enabledCountries, originallyEnabledCountries],
  );

  useEffect(() => {
    if (canSave) {
      navigationStore.placeNavigationLock(
        i`You haven't saved your destinations. Are you sure you want to leave?`,
      );
    } else {
      navigationStore.releaseNavigationLock();
    }
  }, [canSave, navigationStore]);

  const countryShipping: ReadonlyArray<CountryShippingSetting> = useMemo(() => {
    let countryShipping: ReadonlyArray<CountryShippingSetting> = Array.from(
      enabledCountries,
    ).map((countryCode) => ({
      countryCode,
      enabled: true,
    }));

    const disabledCountries = Array.from(originallyEnabledCountries).filter(
      (countryCode) => !enabledCountries.has(countryCode),
    );
    countryShipping = [
      ...countryShipping,
      ...disabledCountries.map((countryCode) => ({
        countryCode,
        enabled: false,
      })),
    ];
    return countryShipping;
  }, [enabledCountries, originallyEnabledCountries]);

  const [updateShippingSettings] = useMutation<
    UpdateShippingSettingsMutationResponse,
    UpdateShippingSettingsMutationArgs
  >(UPDATE_SHIPPING_SETTINGS, {
    variables: {
      countryShipping,
      isUpsert: true,
    },
  });

  const submit = async () => {
    const { data } = await updateShippingSettings();
    const ok = data?.ok;
    const message = data?.message;
    if (!ok && message != null) {
      toastStore.error(message);
    } else {
      navigationStore.releaseNavigationLock();
      await navigationStore.reload();
      toastStore.positive(i`Your shipping destinations have been updated!`);
    }
  };

  const headerActions = (
    <PrimaryButton
      onClick={async () => await submit()}
      minWidth
      isDisabled={!canSave}
    >
      Save
    </PrimaryButton>
  );

  const tableActions = useMemo(() => {
    const topWishCountries = countriesWeShipTo.filter((country) =>
      isTopGMVCountry(country),
    );
    const topWishCountriesSelected = topWishCountries.every(({ code }) =>
      enabledCountries.has(code as ShippableCountryCode),
    );
    const topEUCountriesSelected = euCountriesWeShipTo.every(({ code }) =>
      enabledCountries.has(code as ShippableCountryCode),
    );
    return [
      {
        key: "enable-top-wish-countries",
        name: i`Enable top Wish countries`,
        canBatch: true,
        batchOnly: true,
        canApplyToRow: topWishCountriesSelected ? () => false : undefined,
        apply(countries: ReadonlyArray<DataItem>) {
          const countryCodes = topWishCountries.map(
            ({ code }) => code,
          ) as ShippableCountryCode[];
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
          const euCountryCodes = euCountriesWeShipTo.map(
            ({ code }) => code,
          ) as ShippableCountryCode[];
          setCountriesEnabled(euCountryCodes, true);
        },
      },
      {
        key: "enable-selected",
        name: i`Enable selected`,
        canBatch: true,
        batchOnly: true,
        canApplyToRow: () => true,
        apply(countries: ReadonlyArray<DataItem>) {
          const countryCodes = countries.map(
            ({ country: { code } }) => code,
          ) as ShippableCountryCode[];
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
            ({ country: { code } }) => code,
          ) as ShippableCountryCode[];
          setCountriesEnabled(countryCodes, false);
        },
      },
    ];
  }, [
    countriesWeShipTo,
    euCountriesWeShipTo,
    setCountriesEnabled,
    enabledCountries,
  ]);

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Shipping settings`}
        breadcrumbs={[
          { name: i`Settings`, href: "/plus/settings" },
          { name: i`Shipping`, href: "/plus/settings/shipping" },
        ]}
        actions={headerActions}
        sticky
      />
      <PageGuide>
        <WishExpressIntroductionBanner
          className={css(styles.wishExpressCard)}
        />
        <Card className={css(styles.content)}>
          <Header enabledCountryCount={enabledShippingSettings?.length || 0} />
          <div className={css(styles.controlsRow)}>
            <SearchBox
              className={css(styles.input)}
              value={query}
              onChange={({ text }) => {
                setQuery(text);
                setOffset(0);
                setSelectedRowIndeces(new Set());
              }}
              placeholder={i`Search by country`}
              height={30}
              focusOnMount
            />
            <div className={css(styles.filterControls)}>
              <PageIndicator
                className={css(styles.pageIndicator)}
                rangeStart={offset + 1}
                rangeEnd={Math.min(results.length ?? 0, offset + limit)}
                hasNext={limit + offset < results.length}
                hasPrev={offset > 0}
                currentPage={Math.ceil(offset / limit)}
                totalItems={results.length}
                onPageChange={onPageChange}
              />

              <SimpleSelect
                options={[10, 50, countriesWeShipTo.length].map((v) => ({
                  value: v.toString(),
                  text: v == countriesWeShipTo.length ? i`All` : v.toString(),
                }))}
                onSelected={(value: string) => {
                  setLimit(parseInt(value));
                  setSelectedRowIndeces(new Set());
                }}
                className={css(styles.limitSelect)}
                selectedValue={limit.toString()}
              />
            </div>
          </div>
          <ShippingSettingsTable
            className={css(styles.table)}
            data={results.slice(offset, limit + offset)}
            selectedRowIndeces={Array.from(selectedRowIndeces)}
            onRowSelectionToggled={onRowSelectionToggled}
            setCountryEnabled={(
              countryCode: ShippableCountryCode,
              enable: boolean,
            ) => setCountriesEnabled([countryCode], enable)}
            actions={tableActions}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortToggled={(sortField, sortOrder) => {
              setSortField(sortField);
              setSortOrder(sortOrder);
              setOffset(0);
            }}
          />
        </Card>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        wishExpressCard: {
          marginTop: 25,
        },
        content: {
          marginTop: 25,
        },
        controlsRow: {
          display: "flex",
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            alignItems: "center",
          },
          justifyContent: "space-between",
          margin: "25px 0px",
          padding: "0px 20px",
        },
        input: {
          // Want min 400 here to prevent search from shrinking
          //eslint-disable-next-line local-rules/no-frozen-width
          minWidth: 400,
        },
        limitSelect: {
          flex: 0,
          marginLeft: 10,
        },
        filterControls: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "stretch",
          justifyContent: "flex-end",
        },
        pageIndicator: {
          height: InputHeight,
        },
        table: {
          alignSelf: "stretch",
        },
      }),
    [],
  );

const useFuse = (
  countriesWeShipTo: ReadonlyArray<PickedCountry>,
): Fuse<PickedCountry, any> => {
  return useMemo((): Fuse<PickedCountry, any> => {
    const documents: ReadonlyArray<PickedCountry> = [...countriesWeShipTo];
    const keys: ReadonlyArray<keyof PickedCountry> = ["name", "code"];
    const options = {
      includeScore: true,
      threshold: 0.4,
      distance: 100,
      keys: keys as string[],
    };

    const index = Fuse.createIndex(keys as string[], documents);

    return new Fuse(documents, options, index);
  }, [countriesWeShipTo]);
};
export default observer(PlusShippingSettingsContainer);
