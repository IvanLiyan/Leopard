/*
 *
 * InventoryContainer.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 5/19/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
} from "@toolkit/url";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

/* Lego Components */
import {
  Option,
  SortOrder,
  SimpleSelect,
  PageIndicator,
  PrimaryButton,
  LoadingIndicator,
  TextInputWithSelect,
} from "@ContextLogic/lego";

import searchImg from "@assets/img/search.svg";

/* Relative Imports */
import ProductEmptyState from "@plus/component/products/list-products/ProductEmptyState";
import WishExpressIntroductionBanner from "@plus/component/products/list-products/WishExpressIntroductionBanner";
import InventoryTable, {
  VariationType,
} from "@plus/component/products/inventory/InventoryTable";

import {
  VariationSort,
  ProductCatalogSchema,
  VariationSearchType,
  MerchantSchema,
  VariationSortField,
  ProductCatalogSchemaVariationsArgs,
} from "@schema/types";

const GET_PRODUCT_INVENTORY = gql`
  query InventoryContainer_GetProductInventory(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: VariationSearchType
    $sort: VariationSort
  ) {
    productCatalog {
      variationCount(query: $query, searchType: $searchType)
      variations(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        sort: $sort
      ) {
        id
        sku
        size
        color
        totalInventory(shippingType: REGULAR)
        productId
        productName
      }
    }
  }
`;

type ResponseType = {
  readonly productCatalog: Pick<ProductCatalogSchema, "variationCount"> & {
    readonly variations: ReadonlyArray<VariationType>;
  };
};

type RequestType = Pick<
  ProductCatalogSchemaVariationsArgs,
  "offset" | "limit" | "query" | "searchType" | "sort"
>;

const InputHeight = 35;
const PageLimitOptions = [10, 50, 100, 250];

const SearchOptions: ReadonlyArray<Option<VariationSearchType>> = [
  {
    value: "PRODUCT_ID",
    text: i`Product ID`,
  },
];

const Placeholders: { [searchType in VariationSearchType]: string } = {
  PRODUCT_ID: i`Enter a product id`,
  PRODUCT_NAME: i`Enter a product name`,
  SKU: i`Enter a SKU`,
};

type InitialData = {
  readonly currentMerchant: Pick<
    MerchantSchema,
    "standardWarehouseId" | "canManageShipping"
  >;
};

type InitialProps = {
  readonly initialData: InitialData;
};

const InventoryContainer: React.FC<InitialProps> = ({
  initialData,
}: InitialProps) => {
  const {
    currentMerchant: { standardWarehouseId, canManageShipping },
  } = initialData;
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [query, setQuery] = useStringQueryParam("q");
  const [sortField, setSortField] = useStringEnumQueryParam<
    VariationSortField | undefined
  >("sort_field", undefined);
  const [sortOrder, setSortOrder] = useStringEnumQueryParam<
    SortOrder | undefined
  >("sort_order", undefined);

  const [searchType, setSearchType] = useStringEnumQueryParam<
    VariationSearchType
  >("search_type", "PRODUCT_ID");
  const [pageLimit, setPageLimit] = useIntQueryParam("page_limit");

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;

  const offset = rawOffset || 0;
  const limit = pageLimit || PageLimitOptions[0];

  const sort =
    sortField != null && sortOrder != null
      ? {
          field: sortField,
          order: sortOrder.toUpperCase() as VariationSort["order"],
        }
      : null;

  const { data, loading: variationsLoading } = useQuery<
    ResponseType,
    RequestType
  >(GET_PRODUCT_INVENTORY, {
    variables: {
      offset,
      limit,
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      sort,
    },
    fetchPolicy: "no-cache",
  });

  const styles = useStylesheet({ variationsLoading });

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  const variations = data?.productCatalog.variations;
  const variationCount = data?.productCatalog.variationCount;
  const noVariations: boolean =
    !variationsLoading && searchQuery == null && variationCount == 0;

  const searchProductIdDebugValue: string | undefined =
    variations != null && variations.length > 0
      ? variations[0].productId
      : undefined;

  const searchProductNameDebugValue: string | undefined =
    variations != null && variations.length > 0
      ? variations[0].productName
      : undefined;

  const searchProductSKUDebugValue: string | undefined =
    variations != null && variations.length > 0 ? variations[0].sku : undefined;

  const searchDebugValues: {
    [searchType in VariationSearchType]: string | undefined;
  } = {
    PRODUCT_ID: searchProductIdDebugValue,
    PRODUCT_NAME: searchProductNameDebugValue,
    SKU: searchProductSKUDebugValue,
  };

  const body = noVariations ? (
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
            onSelected(item: VariationSearchType) {
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
            isLoading={variationsLoading}
            totalItems={variationCount}
            rangeStart={offset + 1}
            rangeEnd={
              variationCount ? Math.min(variationCount, offset + limit) : 0
            }
            hasNext={variationCount ? offset + limit < variationCount : false}
            hasPrev={offset >= limit}
            currentPage={Math.ceil(offset / limit)}
            onPageChange={onPageChange}
          />
          <SimpleSelect
            className={css(styles.select)}
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
        </div>
      </div>
      {variationsLoading == null ? (
        <LoadingIndicator />
      ) : (
        <InventoryTable
          variations={variations || []}
          className={css(styles.table)}
          standardWarehouseId={standardWarehouseId}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortToggled={(sortField, sortOrder) => {
            setSortField(sortField);
            setSortOrder(sortOrder);
            setOffset(0);
          }}
        />
      )}
    </>
  );

  const actions = (
    <PrimaryButton href="/plus/products/create" minWidth>
      Add a product
    </PrimaryButton>
  );
  return (
    <PageRoot>
      <PlusWelcomeHeader title={i`Inventory`} actions={actions} />
      <PageGuide>
        <div className={css(styles.root)}>{body}</div>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = ({
  variationsLoading,
}: {
  readonly variationsLoading: boolean;
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
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        },
        rightControls: {
          display: "flex",
        },
        search: {
          flex: 1,
          "@media (min-width: 900px)": {
            maxWidth: 600,
          },
        },
        emptyState: {
          marginTop: 25,
        },
        table: {
          opacity: variationsLoading ? 0.7 : 1,
        },
        wishExpressCard: {
          marginTop: 15,
        },
        pageIndicator: {
          marginRight: 8,
        },
        select: {
          height: 35,
          width: 50,
          flex: 0,
        },
      }),
    [variationsLoading]
  );

export default observer(InventoryContainer);
