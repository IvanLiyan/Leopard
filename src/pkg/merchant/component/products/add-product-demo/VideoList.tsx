import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "react-apollo";

/* Lego Components */
import { css } from "@toolkit/styling";
import {
  H5,
  SimpleSelect,
  FilterButton,
  PageIndicator,
  LoadingIndicator,
  TextInputWithSelect,
} from "@ContextLogic/lego";

import searchImg from "@assets/img/search.svg";
import { Popover } from "@merchant/component/core";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
  useStringEnumArrayQueryParam,
} from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import {
  Placeholders,
  SearchOptions,
  InputHeight,
  PageLimitOptions,
  AddDemoResponseType,
  GET_DEMO_PRODUCTS_LIST,
} from "@toolkit/products/demo-video";
import {
  ProductVideoState,
  ProductSearchType,
  ProductCatalogSchemaProductsArgs,
} from "@schema/types";

import AddProductDemoTable from "./AddProductDemoTable";
import AddProductDemoFilter from "./AddProductDemoFilter";

const VideoList: React.FC<{}> = () => {
  const [query, setQuery] = useStringQueryParam("q");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [searchType, setSearchType] = useStringEnumQueryParam<
    ProductSearchType
  >("search_type", "NAME");
  const [pageLimit, setPageLimit] = useIntQueryParam("page_limit");
  const [states] = useStringEnumArrayQueryParam<ProductVideoState>("states");

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;

  const offset = rawOffset || 0;
  const limit = pageLimit || PageLimitOptions[0];

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  const {
    data,
    refetch: refetchProducts,
    loading: isLoadingProducts,
  } = useQuery<AddDemoResponseType, ProductCatalogSchemaProductsArgs>(
    GET_DEMO_PRODUCTS_LIST,
    {
      variables: {
        offset,
        limit,
        query: searchQuery,
        searchType: searchQuery ? searchType : null,
        videoStates: states,
        productStatuses: ["ENABLED"],
      },
      fetchPolicy: "no-cache",
    }
  );

  const totalProductCount = data?.productCatalog.productCount;
  const products = data?.productCatalog.products;
  const productCount = products?.length || 0;

  const styles = useStylesheet();

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

  const hasActiveFilters = states != null && states.length > 0;
  const disableInputs =
    searchQuery == null && !hasActiveFilters && totalProductCount == 0;

  return (
    <div className={css(styles.root)}>
      <H5>Your products</H5>
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
            totalItems={totalProductCount}
            rangeStart={offset + 1}
            rangeEnd={Math.min(totalProductCount ?? 0, offset + productCount)}
            hasNext={
              totalProductCount != null &&
              offset + productCount < totalProductCount
            }
            hasPrev={offset > 0}
            currentPage={Math.ceil(offset / limit)}
            onPageChange={onPageChange}
          />
          <SimpleSelect
            className={css(styles.limitSelect)}
            options={PageLimitOptions.map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            onSelected={(item: string) => {
              setPageLimit(parseInt(item));
              setOffset(0);
            }}
            selectedValue={limit.toString()}
            disabled={disableInputs}
          />
          <Popover
            popoverContent={
              disableInputs ? undefined : () => <AddProductDemoFilter />
            }
            position="bottom right"
          >
            <FilterButton
              className={css(styles.filterButton)}
              disabled={disableInputs}
              isActive={hasActiveFilters}
            />
          </Popover>
        </div>
      </div>
      {isLoadingProducts ? (
        <LoadingIndicator />
      ) : (
        <AddProductDemoTable
          className={css(styles.table)}
          products={products || []}
          onRefetchProducts={refetchProducts}
        />
      )}
    </div>
  );
};

export default observer(VideoList);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
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
        search: {
          flex: 1,
          "@media (min-width: 900px)": {
            maxWidth: 518,
          },
        },
        table: {},
        rightControls: {
          display: "flex",
        },
        pageIndicator: {
          margin: "0 12px",
        },
        limitSelect: {
          height: "100%",
          width: 50,
          flex: 0,
        },
        filterPopover: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
        },
        filterTitle: {
          color: textBlack,
          fontSize: 20,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        filterButton: {
          marginLeft: 12,
          height: "100%",
          boxSizing: "border-box",
        },
      }),
    [textBlack]
  );
};
