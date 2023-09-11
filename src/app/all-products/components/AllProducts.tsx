import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import {
  Card,
  ErrorText,
  FormSelect,
  Layout,
  LoadingIndicator,
  OnTextChangeEvent,
  PageIndicator,
  PrimaryButton,
  SecondaryButton,
  SortOrder,
  Text,
  TextInputWithSelect,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  GET_PRODUCT_COUNT_QUERY,
  GetProductCountResponseType,
  GetProductCountRequestType,
  GET_PRODUCTS_QUERY,
  GetProductsResponseType,
  GetProductsRequestType,
  PickedWarehouse,
  ProductsContainerInitialData,
  ListingEnabledUrlSelection,
  ListingStateUrlSelection,
  DefaultStateFilter,
  DefaultEnabledFilter,
} from "@all-products/toolkit";
import { useQuery } from "@apollo/client";
import { useToastStore } from "@core/stores/ToastStore";
import HeaderRow from "./HeaderRow";
import { ProductSearchType, ProductSort, SortOrderType } from "@schema";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import ProductTable from "./ProductTable";
import { ci18n, ni18n } from "@core/toolkit/i18n";
import AllProductsState from "@all-products/AllProductsState";
import Icon from "@core/components/Icon";
import { useTheme } from "@core/stores/ThemeStore";
import FilterSection from "./FilterSection";
import {
  useSearchType,
  useSearchTerm,
  useOffset,
  useLimit,
  useBadgesFilter,
  useEnabledFilter,
  useSortBy,
  useSortOrder,
  useStateFilter,
  useFiltersStatus,
} from "@all-products/stateHooks";
import DeleteWarehouseButton from "./DeleteWarehouseButton";

const SelectOptionsOrder: ReadonlyArray<ProductSearchType> = [
  "ID",
  "NAME",
  "SKU",
];

const SelectOptionsDisplay: { readonly [T in ProductSearchType]: string } = {
  ID: ci18n(
    "Placeholder in a text box where users can search products by product ID",
    "Product ID",
  ),
  NAME: ci18n(
    "Placeholder in a text box where users can search products by product name",
    "Product name",
  ),
  SKU: ci18n(
    "Placeholder in a text box where users can search products by variation SKU",
    "Variation SKU",
  ),
  PARENTSKU: ci18n(
    "Placeholder in a text box where users can search products by parent SKU",
    "Parent SKU",
  ),
};

const SelectOptionsPlaceholder: {
  readonly [T in ProductSearchType]: string;
} = {
  ID: i`Search by product ID`,
  NAME: i`Search by product name`,
  SKU: i`Search by variation SKU`,
  PARENTSKU: i`Search by parent SKU`,
};

const DEFAULT_LIMIT = 10;

type Props = BaseProps & {
  readonly warehouse: PickedWarehouse;
  readonly initialData: ProductsContainerInitialData;
  readonly onRefetchInitialData: () => unknown;
};

const SortOrderMap: {
  readonly [T in ExcludeStrict<SortOrder, "not-applied">]: SortOrderType;
} = {
  asc: "ASC",
  desc: "DESC",
};

const AllProducts: React.FC<Props> = ({
  className,
  style,
  warehouse,
  initialData,
  onRefetchInitialData,
}) => {
  const styles = useStylesheet();

  const [state] = useState(new AllProductsState({ warehouse, initialData }));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { textBlack, primary } = useTheme();
  const toastStore = useToastStore();

  const [searchType, setSearchType] = useSearchType();
  const [searchTerm, setSearchTerm] = useSearchTerm();
  const [rawOffset, setOffset] = useOffset();
  const [rawLimit, setLimit] = useLimit();

  const debouncedQuery = useDebouncer(searchTerm, 800);
  const searchQuery =
    searchTerm != null && searchTerm !== "" && debouncedQuery.trim().length > 0
      ? debouncedQuery
      : undefined;

  const [filterOn, setFilterOn] = useState(false);
  const [rawStateFilter] = useStateFilter();
  const [rawEnabledFilter] = useEnabledFilter();
  const [badgesFilter] = useBadgesFilter();
  const { enabled: areFiltersEnabled, disabled: areFiltersDisabled } =
    useFiltersStatus();

  const [sortBy] = useSortBy();
  const [sortOrder] = useSortOrder();

  const stateFilter: ListingStateUrlSelection = useMemo(
    () => rawStateFilter ?? DefaultStateFilter,
    [rawStateFilter],
  );
  const enabledFilter: ListingEnabledUrlSelection = useMemo(
    () => rawEnabledFilter ?? DefaultEnabledFilter,
    [rawEnabledFilter],
  );

  const sort: ProductSort | undefined = useMemo(() => {
    if (sortBy == null || sortOrder == null || sortOrder == "not-applied") {
      return {
        field: "LAST_UPDATE",
        order: "DESC",
      };
    }
    return {
      field: sortBy,
      order: SortOrderMap[sortOrder],
    };
  }, [sortBy, sortOrder]);

  const numberOfFilters = useMemo(() => {
    return (
      (stateFilter == "ALL" ? 0 : 1) +
      (enabledFilter == "ALL" ? 0 : 1) +
      (badgesFilter == null ? 0 : badgesFilter.size)
    );
  }, [stateFilter, enabledFilter, badgesFilter]);

  useEffect(() => {
    if (rawOffset == 0 || rawOffset == null) {
      return;
    }
    void setOffset(0);
    // prevent clearing offset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const limit = rawLimit || DEFAULT_LIMIT;
  const offset = rawOffset || 0;

  const onPageChange = async (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    await setOffset(nextPage * limit);
  };

  const variables: GetProductsRequestType = useMemo(() => {
    const effectiveStateFilter = areFiltersEnabled ? stateFilter : "ALL";
    const state: GetProductsRequestType["state"] =
      effectiveStateFilter == "ALL" ? undefined : effectiveStateFilter;

    const effectiveEnabledFilter = areFiltersEnabled ? enabledFilter : "ALL";
    const isEnabled: GetProductsRequestType["isEnabled"] =
      effectiveEnabledFilter == "FALSE"
        ? false
        : effectiveEnabledFilter == "TRUE"
        ? true
        : undefined;

    const badgesQueryParams: Partial<GetProductsRequestType> = {
      hasBrand:
        badgesFilter != null && badgesFilter.has("BRANDED") ? true : undefined,
      isWishExpress:
        badgesFilter != null && badgesFilter.has("WISH_EXPRESS")
          ? true
          : undefined,
      isPromoted:
        badgesFilter != null && badgesFilter.has("YELLOW_BADGE")
          ? true
          : undefined,
      isReturnEnrolled:
        badgesFilter != null && badgesFilter.has("RETURN_ENROLLED")
          ? true
          : undefined,
      isCleanImage:
        badgesFilter != null && badgesFilter.has("CLEAN_IMAGE")
          ? true
          : undefined,
    };

    const vars = {
      offset,
      limit,
      searchType: searchQuery == null ? undefined : searchType,
      query: searchQuery == null ? undefined : searchQuery,
      warehouseId: warehouse.id,
      state,
      isEnabled,
      sort,
      ...(areFiltersEnabled ? badgesQueryParams : {}),
    };
    return vars;
  }, [
    offset,
    limit,
    searchQuery,
    searchType,
    warehouse.id,
    sort,
    enabledFilter,
    stateFilter,
    areFiltersEnabled,
    badgesFilter,
  ]);

  const {
    data: productsData,
    loading: isLoadingProducts,
    refetch: refetchProducts,
  } = useQuery<GetProductsResponseType, GetProductsRequestType>(
    GET_PRODUCTS_QUERY,
    {
      variables,
      fetchPolicy: "no-cache",
    },
  );

  useEffect(() => {
    if (!isLoadingProducts && productsData == null) {
      toastStore.negative(i`Something went wrong`);
    }
    // don't need toastStore as dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingProducts, productsData]);

  const products = productsData?.productCatalog?.productsV2 || [];

  const {
    data: countData,
    loading: isLoadingCount,
    refetch: refetchCount,
  } = useQuery<GetProductCountResponseType, GetProductCountRequestType>(
    GET_PRODUCT_COUNT_QUERY,
    {
      variables,
      fetchPolicy: "no-cache",
    },
  );

  useEffect(() => {
    if (!isLoadingCount && countData == null) {
      toastStore.negative(i`Something went wrong`);
    }
    // don't need toastStore as dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingCount, countData]);

  const count = countData?.productCatalog?.productCountV2;

  const {
    data: totalCountData,
    loading: isLoadingTotalCount,
    refetch: refetchTotalCount,
  } = useQuery<GetProductCountResponseType, GetProductCountRequestType>(
    GET_PRODUCT_COUNT_QUERY,
    {
      fetchPolicy: "no-cache",
    },
  );

  const totalCount = totalCountData?.productCatalog?.productCountV2;

  useEffect(() => {
    if (!isLoadingTotalCount && totalCountData == null) {
      toastStore.negative(i`Something went wrong`);
    }
    // don't need toastStore as dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingTotalCount, totalCountData]);

  const isSecondaryWarehouse =
    (initialData.currentMerchant?.warehouses || []).findIndex(
      ({ id: warehouseId }) => warehouseId == warehouse.id,
    ) > 0;

  return (
    <Layout.FlexColumn style={[className, style]}>
      {isSecondaryWarehouse && (
        <Layout.FlexRow
          justifyContent="flex-end"
          style={styles.deleteWarehouseButtonRow}
        >
          <DeleteWarehouseButton
            warehouse={warehouse}
            onRefetchInitialData={onRefetchInitialData}
          />
        </Layout.FlexRow>
      )}
      {isLoadingTotalCount || isLoadingCount ? (
        <LoadingIndicator />
      ) : (
        <HeaderRow
          style={styles.headerRow}
          warehouse={warehouse}
          count={count}
          totalCount={totalCount}
          productsOnScreen={products.length}
          variables={variables}
        />
      )}
      <Card>
        <Layout.FlexRow
          style={styles.controlsRow}
          justifyContent="space-between"
        >
          <TextInputWithSelect
            selectProps={{
              selectedValue: searchType,
              onSelected: async (newSearchType: ProductSearchType) => {
                await setOffset(0);
                await setSearchType(newSearchType);
              },
              options: SelectOptionsOrder.map((option) => ({
                value: option,
                text: SelectOptionsDisplay[option],
              })),
              style: { width: "unset", paddingRight: 9 },
              "data-cy": "select-table-search-type",
            }}
            textInputProps={{
              icon: "search",
              placeholder: SelectOptionsPlaceholder[searchType],
              style: styles.searchInput,
              value: searchTerm,
              onChange: async ({ text }: OnTextChangeEvent) => {
                await setSearchTerm(text);
              },
              "data-cy": "input-table-search-value",
            }}
          />
          <Layout.FlexRow>
            {state.numberOfChanges > 0 && (
              <Layout.FlexRow style={styles.unsavedRow} alignItems="center">
                <Layout.FlexColumn style={styles.unsavedTextContainer}>
                  <Layout.FlexRow>
                    <Icon
                      style={styles.warningIcon}
                      name="warning"
                      color={textBlack}
                      size={16}
                    />
                    <Text weight="semibold" style={styles.unsavedText}>
                      {ni18n(
                        state.numberOfChanges,
                        "1 Unsaved Input",
                        "{%1=number of changes} Unsaved Inputs",
                      )}
                    </Text>
                  </Layout.FlexRow>
                  {state.hasPriceError && (
                    <ErrorText>Prices must be greater than 0</ErrorText>
                  )}
                  {state.hasInventoryError && (
                    <ErrorText>Inventory must be a valid number</ErrorText>
                  )}
                </Layout.FlexColumn>
                <PrimaryButton
                  onClick={async () => {
                    setIsSubmitting(true);
                    const success = await state.submit();
                    if (success) {
                      await refetchProducts();
                      setIsSubmitting(false);
                      state.clearChanges();
                      state.resetProducts();
                      return;
                    }

                    setIsSubmitting(false);
                  }}
                  isDisabled={state.hasPriceError || state.hasInventoryError}
                >
                  {ci18n(
                    "Text on a button merchants click to save their changes on a form",
                    "Save",
                  )}
                </PrimaryButton>
              </Layout.FlexRow>
            )}
            {count != null && (
              <>
                <PageIndicator
                  style={styles.pagination}
                  totalItems={count}
                  onPageChange={onPageChange}
                  rangeStart={offset + 1}
                  rangeEnd={Math.min(count ?? 0, offset + products.length)}
                  hasNext={offset + products.length < count}
                  hasPrev={offset > 0}
                  isLoading={isLoadingCount || isSubmitting}
                  currentPage={Math.ceil(offset / limit)}
                />
                <FormSelect
                  style={styles.pageSizeToggle}
                  options={[
                    { value: `10`, text: `10` },
                    { value: `20`, text: `20` },
                    { value: `50`, text: `50` },
                    { value: `100`, text: `100` },
                  ]}
                  onSelected={async (newLimit: string) => {
                    await setLimit(parseInt(newLimit));
                  }}
                  selectedValue={limit.toString()}
                  disabled={isSubmitting}
                />
              </>
            )}
            <SecondaryButton
              onClick={() => setFilterOn(!filterOn)}
              padding="10px 16px"
              style={styles.filterParent}
              data-cy="toggle-filters-menu-button"
            >
              <Layout.FlexRow>
                <Icon
                  name="filter"
                  style={styles.filterIcon}
                  color={primary}
                  size={20}
                />
                {numberOfFilters == 0 || areFiltersDisabled
                  ? ci18n(
                      "Text in a button that opens and closes a filtering control panel for a table",
                      "Filter",
                    )
                  : ci18n(
                      "Text in a button that opens and closes a filtering control panel for a table",
                      "Filter ({%1=number of filters applied})",
                      numberOfFilters,
                    )}
              </Layout.FlexRow>
            </SecondaryButton>
          </Layout.FlexRow>
        </Layout.FlexRow>
        {filterOn && <FilterSection style={styles.filterSection} />}
        {isLoadingProducts ? (
          <LoadingIndicator />
        ) : (
          <ProductTable
            state={state}
            isSubmitting={isSubmitting}
            products={products}
            onRefetchProducts={async () => {
              setIsSubmitting(true);
              try {
                await Promise.all([
                  refetchProducts(),
                  refetchCount(),
                  refetchTotalCount(),
                ]);
              } catch {
                setIsSubmitting(false);
              }
            }}
          />
        )}
      </Card>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textBlack, primary, surfaceLighter } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        deleteWarehouseButtonRow: {
          marginBottom: 24,
        },
        headerRow: {
          marginBottom: 24,
        },
        controlsRow: {
          margin: "12px 24px",
          gap: 8,
        },
        searchInput: {
          flexShrink: 1,
        },
        pagination: {
          marginRight: 16,
        },
        pageSizeToggle: {
          width: 76,
          marginRight: 16,
        },
        unsavedRow: {
          marginRight: 32,
        },
        unsavedTextContainer: {
          marginRight: 16,
          gap: 4,
        },
        unsavedText: {
          color: textBlack,
          size: 14,
          lineHeight: "20px",
          marginLeft: 8,
        },
        filterParent: {
          ":hover": {
            // "select all divs that are children of the current div"
            // more complex nth child logic required because aphrodite only
            // respects css selectors that start with :
            ":nth-child(1n) > div": {
              filter: "brightness(100)",
            },
          },
        },
        filterIcon: {
          marginRight: 8,
        },
        filterButtonText: {
          marginLeft: 8,
          color: primary,
        },
        filterSection: {
          backgroundColor: surfaceLighter,
          padding: 24,
        },
        warningIcon: {
          minWidth: 16,
        },
      }),
    [textBlack, primary, surfaceLighter],
  );
};

export default observer(AllProducts);
