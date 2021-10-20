/*
 *
 * AllProductsContainer.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/19/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";

/* Lego Toolkit */
import { useLogger } from "@toolkit/logger";
import { css, IS_SMALL_SCREEN, IS_LARGE_SCREEN } from "@toolkit/styling";

import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
  useStringEnumArrayQueryParam,
} from "@toolkit/url";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import {
  MultiSecondaryButton,
  Option,
  Popover,
  Layout,
  SimpleSelect,
  PrimaryButton,
  TextInputWithSelect,
  LoadingIndicator,
  FilterButton,
  PageIndicator,
} from "@ContextLogic/lego";

import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import { SortOrder } from "@ContextLogic/lego";

import searchImg from "@assets/img/search.svg";

/* Relative Imports */
import ProductEmptyState from "@plus/component/products/list-products/ProductEmptyState";
import WishExpressIntroductionBanner from "@plus/component/products/list-products/WishExpressIntroductionBanner";
import ConfirmDownloadModal from "@plus/component/orders/bulk-fulfill/ConfirmDownloadModal";

import AllProductsTable, {
  ProductType,
} from "@plus/component/products/list-products/AllProductsTable";
import ProductListFilter from "@plus/component/products/list-products/ProductListFilter";
import { useToastStore } from "@stores/ToastStore";

import {
  MerchantSchema,
  ProductSort,
  ProductSortField,
  ProductCatalogSchema,
  ProductSearchType,
  ProductCatalogSchemaProductsArgs,
  CommerceProductStatus,
  WarehouseShippingType,
  DownloadAllProductsCsvInput,
  DownloadAllProductsCsv,
} from "@schema/types";

const DOWNLOAD_ALL_MUTATION = gql`
  mutation {
    productCatalog {
      downloadAllProductsCsv(input: {}) {
        ok
        errorMessage
      }
    }
  }
`;

const GET_PRODUCT_LIST = gql`
  query GetProductList(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: ProductSearchType
    $sort: ProductSort
    $productStatuses: [CommerceProductStatus!]
    $shippingTypes: [WarehouseShippingType!]
  ) {
    productCatalog {
      productCount(
        query: $query
        searchType: $searchType
        productStatuses: $productStatuses
        shippingTypes: $shippingTypes
      )
      products(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        sort: $sort
        productStatuses: $productStatuses
        shippingTypes: $shippingTypes
      ) {
        id
        sales
        name
        totalInventory
        categories {
          name
        }
        enabled
        reviewStatus
        variationCount
        condition
        shipping {
          wishExpressCountryShipping: warehouseCountryShipping(
            shippingTypes: [WISH_EXPRESS]
          ) {
            countryShipping {
              enabled
              country {
                name
                code
              }
            }
          }
        }
      }
    }
  }
`;

type ResponseType = {
  readonly productCatalog: Pick<ProductCatalogSchema, "productCount"> & {
    readonly products: ReadonlyArray<ProductType>;
  };
};

const InputHeight = 35;
const FilterWidth = 250;
const PageLimitOptions = [10, 50, 100, 250];

const SearchOptions: ReadonlyArray<Option<ProductSearchType>> = [
  {
    value: "NAME",
    text: i`Product name`,
  },
  {
    value: "ID",
    text: i`Product ID`,
  },
  {
    value: "SKU",
    text: i`Product SKU`,
  },
];

const Placeholders: { [searchType in ProductSearchType]: string } = {
  ID: i`Enter a product id`,
  NAME: i`Enter a product name`,
  SKU: i`Enter a product sku`,
};

type InitialData = {
  readonly currentMerchant: Pick<MerchantSchema, "canManageShipping">;
};

type InitialProps = {
  readonly initialData: InitialData;
};

const AllProductsContainer: React.FC<InitialProps> = ({
  initialData,
}: InitialProps) => {
  const {
    currentMerchant: { canManageShipping },
  } = initialData;
  const actionLogger = useLogger("PLUS_PRODUCT_UPLOAD");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [query, setQuery] = useStringQueryParam("q");
  const [searchType, setSearchType] =
    useStringEnumQueryParam<ProductSearchType>("search_type", "NAME");
  const [sortField, setSortField] = useStringEnumQueryParam<
    ProductSortField | undefined
  >("sort_field", undefined);
  const [sortOrder, setSortOrder] = useStringEnumQueryParam<
    SortOrder | undefined
  >("sort_order", undefined);
  const [salesStatuses] =
    useStringEnumArrayQueryParam<CommerceProductStatus>("sales_status");
  const [shippingTypes] =
    useStringEnumArrayQueryParam<WarehouseShippingType>("shipping_type");
  const [pageLimit, setPageLimit] = useIntQueryParam("page_limit");

  const toastStore = useToastStore();

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;

  const offset = rawOffset || 0;
  const limit = pageLimit || PageLimitOptions[0];

  const commerceProductStatuses: ReadonlyArray<CommerceProductStatus> =
    useMemo(() => {
      const statuses = new Set<CommerceProductStatus>([]);
      if (salesStatuses != null) {
        for (const salesStatus of salesStatuses) {
          statuses.add(salesStatus);
        }
      }
      return Array.from(statuses);
    }, [salesStatuses]);

  const warehouseShippingTypes: ReadonlyArray<WarehouseShippingType> =
    useMemo(() => {
      const types = new Set<WarehouseShippingType>([]);
      if (shippingTypes != null) {
        for (const shippingType of shippingTypes) {
          types.add(shippingType);
        }
      }
      return Array.from(types);
    }, [shippingTypes]);

  const sort =
    sortField != null && sortOrder != null
      ? {
          field: sortField,
          order: sortOrder.toUpperCase() as ProductSort["order"],
        }
      : null;

  const { data, loading: isLoadingProducts } = useQuery<
    ResponseType,
    ProductCatalogSchemaProductsArgs
  >(GET_PRODUCT_LIST, {
    variables: {
      offset,
      limit,
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      sort,
      productStatuses:
        commerceProductStatuses.length > 0 ? commerceProductStatuses : null,
      shippingTypes:
        warehouseShippingTypes.length > 0 ? warehouseShippingTypes : null,
    },
    fetchPolicy: "no-cache",
  });

  const styles = useStylesheet({ isLoadingProducts });

  useEffect(() => {
    actionLogger.info({
      action: `VIEW_PRODUCTS_LIST_PAGE`,
    });
  }, [initialData, actionLogger]);

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  const hasActiveFilters =
    commerceProductStatuses?.length > 0 || warehouseShippingTypes?.length > 0;
  const productCount = data?.productCatalog.productCount;
  const products = data?.productCatalog.products;
  const noProducts =
    !isLoadingProducts &&
    searchQuery == null &&
    !hasActiveFilters &&
    productCount == 0;

  const searchProductIdDebugValue: string | undefined =
    products != null && products.length > 0 ? products[0].id : undefined;

  const searchProductNameDebugValue: string | undefined =
    products != null && products.length > 0 ? products[0].name : undefined;

  const searchDebugValues: {
    [searchType in ProductSearchType]: string | undefined;
  } = {
    ID: searchProductIdDebugValue,
    NAME: searchProductNameDebugValue,
    SKU: undefined, // Requires variations, so don't load more data for a debug
  };

  const body = noProducts ? (
    <ProductEmptyState
      className={css(styles.emptyState)}
      canManageShipping={canManageShipping}
    />
  ) : (
    <>
      {canManageShipping && (
        <WishExpressIntroductionBanner
          className={css(styles.wishExpressCard)}
        />
      )}
      <div className={css(styles.controlsRow)}>
        <TextInputWithSelect
          className={css(styles.search)}
          selectProps={{
            selectedValue: searchType,
            options: SearchOptions,
            onSelected(item: ProductSearchType) {
              setSearchType(item);
            },
          }}
          textInputProps={{
            icon: searchImg,
            placeholder: Placeholders[searchType],
            noDuplicateTokens: true,
            maxTokens: 1,
            value: query,
            height: InputHeight,
            onChange({ text }) {
              setQuery(text);
              setOffset(0);
              if (text.trim().length > 0) {
                setSearchType(searchType);
              } else {
                setSearchType(null);
              }
            },
            debugValue: searchDebugValues[searchType],
          }}
        />
        <div className={css(styles.rightControls)}>
          <PageIndicator
            style={css(styles.pageIndicator)}
            isLoading={isLoadingProducts}
            totalItems={productCount}
            rangeStart={offset + 1}
            rangeEnd={productCount ? Math.min(productCount, offset + limit) : 0}
            hasNext={productCount ? offset + limit < productCount : false}
            hasPrev={offset >= limit}
            currentPage={Math.ceil(offset / limit)}
            onPageChange={onPageChange}
          />
          <SimpleSelect
            style={styles.select}
            options={PageLimitOptions.map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            onSelected={(item: string) => {
              setPageLimit(parseInt(item));
              setOffset(0);
            }}
            selectedValue={limit.toString()}
          />
          <Popover
            popoverContent={() => (
              <ProductListFilter
                className={css(styles.filter)}
                canManageShipping={canManageShipping}
              />
            )}
            position="bottom right"
            contentWidth={FilterWidth}
          >
            <FilterButton isActive={hasActiveFilters} />
          </Popover>
        </div>
      </div>
      {isLoadingProducts ? (
        <LoadingIndicator />
      ) : (
        <AllProductsTable
          products={products || []}
          className={css(styles.table)}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortToggled={(sortField, sortOrder) => {
            setSortField(sortField);
            setSortOrder(sortOrder);
            setOffset(0);
          }}
          canManageShipping={canManageShipping}
        />
      )}
    </>
  );

  const bulkAddEditText = ci18n(
    "Button that leads to a page where merchants add or edit products from a CSV file",
    "Bulk add/edit",
  );
  type MutationResponseType = {
    readonly productCatalog: {
      readonly downloadAllProductsCsv: Pick<
        DownloadAllProductsCsv,
        "ok" | "errorMessage"
      >;
    };
  };

  const [requestDownloadAll] = useMutation<
    MutationResponseType,
    DownloadAllProductsCsvInput
  >(DOWNLOAD_ALL_MUTATION, {
    variables: {},
  });

  const handleDownloadAll = async () => {
    const { data } = await requestDownloadAll();
    const ok = data?.productCatalog.downloadAllProductsCsv.ok;
    const errorMessage =
      data?.productCatalog.downloadAllProductsCsv.errorMessage;

    if (!ok) {
      toastStore.negative(errorMessage || i`Something went wrong`);
      return;
    }
    new ConfirmDownloadModal({
      title: i`Processing Export`,
      text:
        i`Your products are being processed into a CSV file. You will ` +
        i`receive an email with a link to download the file in ${24} hours.`,
    }).render();
  };

  const bulkButton = (
    <MultiSecondaryButton
      actions={[
        {
          text: bulkAddEditText,
          href: "/plus/products/bulk-add-edit",
          onClick: () => {
            actionLogger.info({
              action: `CLICK_ON_BULK_ADD_EDIT_FROM_PRODUCTS_LIST_PAGE`,
            });
          },
        },
        {
          text: i`Download all products`,
          onClick: handleDownloadAll,
        },
        {
          text: i`View file status`,
          href: "/plus/products/bulk-csv-add-edit-history",
        },
      ]}
      dropDownPosition="bottom right"
    >
      {bulkAddEditText}
    </MultiSecondaryButton>
  );

  const actions = (
    <Layout.GridRow templateColumns="1fr 1fr" gap={12}>
      <PrimaryButton
        style={{ height: "100%", boxSizing: "border-box" }}
        href="/plus/products/create"
        onClick={() => {
          actionLogger.info({
            action: `CLICK_ON_ADD_A_PRODUCT_FROM_PRODUCTS_LIST_PAGE`,
          });
        }}
        minWidth
      >
        Add a product
      </PrimaryButton>
      {bulkButton}
    </Layout.GridRow>
  );
  return (
    <PageRoot>
      <PlusWelcomeHeader title={i`Products`} actions={actions} />
      <PageGuide>
        <div className={css(styles.root)}>{body}</div>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = ({
  isLoadingProducts,
}: {
  readonly isLoadingProducts: boolean;
}) =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        controlsRow: {
          display: "flex",
          alignItems: "stretch",
          margin: "20px 0px",
          height: InputHeight,
          [`@media ${IS_SMALL_SCREEN}`]: {
            flexDirection: "column",
          },
          [`@media ${IS_LARGE_SCREEN}`]: {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        },
        search: {
          flex: 1,
          [`@media ${IS_LARGE_SCREEN}`]: {
            maxWidth: 600,
            marginRight: 17 + 8,
          },
        },
        rightControls: {
          display: "flex",
        },
        pageIndicator: {
          marginRight: 8,
        },
        select: {
          marginRight: 10,
          height: 35,
          width: 50,
          minWidth: 60, // required since some browsers treat flex-basis: 0% as width (included in flex 0)
          textAlignLast: "center", // `last` required for <select>, see https://stackoverflow.com/questions/45215504/text-align-not-working-on-select-control-on-chrome/45215594
          flex: 0,
        },
        filter: {
          width: FilterWidth,
        },
        emptyState: {
          marginTop: 25,
        },
        table: {
          opacity: isLoadingProducts ? 0.7 : 1,
        },
        wishExpressCard: {
          marginTop: 15,
        },
      }),
    [isLoadingProducts],
  );

export default observer(AllProductsContainer);
