/*
 *
 * BoostedProducts.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/15/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

/* Lego Toolkit */
import { css, IS_SMALL_SCREEN, IS_LARGE_SCREEN } from "@toolkit/styling";

import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
  useStringEnumArrayQueryParam,
} from "@toolkit/url";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

import { useApolloStore } from "@stores/ApolloStore";

import EmptyState from "./EmptyState";
import BalanceOverviewCard from "./BalanceOverviewCard";
import ImpressionsOverviewCard from "./impression-overview/ImpressionsOverviewCard";

import {
  FilterButton,
  SimpleSelect,
  PageIndicator,
  LoadingIndicator,
} from "@ContextLogic/lego";

import {
  ProductPromotionStatus,
  MarketingServiceSchema,
  ProductPromotionSearchType,
  MarketingServiceSchemaProductPromotionsArgs,
  MarketingServiceSchemaProductPromotionsCountArgs,
} from "@schema/types";

import BoostedProductsTable from "./BoostedProductsTable";
import BoostedProductsFilter from "./BoostedProductsFilter";
import { Popover } from "@merchant/component/core";
import { BoostedProductType } from "@toolkit/marketing/boosted-products";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { BoostedProductsInitialData } from "@toolkit/marketing/boosted-products";
import ProductSearchBar from "@plus/component/marketing/toolkit/ProductSearchBar";

type Props = BaseProps & {
  readonly initialData: BoostedProductsInitialData;
};

const GET_PRODUCT_PROMOTIONS = gql`
  query BoostedProducts_GetProductPromotions(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: ProductPromotionSearchType
    $promotionStatuses: [ProductPromotionStatus!]
  ) {
    marketing {
      productPromotions(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        promotionStatuses: $promotionStatuses
      ) {
        promotionStatus
        product {
          id
          sku
          name
          variationCount
          createTime {
            unix
          }
          isRemoved
        }
        dailyPromotionBudget {
          amount
          currencyCode
        }
        lifetimeStats {
          spend {
            amount
            display
          }
          gmv {
            amount
            display
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_PROMOTION_COUNT = gql`
  query BoostedProducts_GetProductPromotionsCount(
    $query: String
    $searchType: ProductPromotionSearchType
    $promotionStatuses: [ProductPromotionStatus!]
  ) {
    marketing {
      productPromotionsCount(
        query: $query
        searchType: $searchType
        promotionStatuses: $promotionStatuses
      )
    }
  }
`;

type GetProductPromotionsResponseType = {
  readonly marketing: {
    readonly productPromotions: ReadonlyArray<BoostedProductType>;
  };
};

type GetProductPromotionsRequestType =
  MarketingServiceSchemaProductPromotionsArgs;

type GetProductCountResponseType = {
  readonly marketing: Pick<MarketingServiceSchema, "productPromotionsCount">;
};

type GetProductCountRequestType =
  MarketingServiceSchemaProductPromotionsCountArgs;

const InputHeight = 35;
const FilterWidth = 250;

const BoostedProducts: React.FC<Props> = (props: Props) => {
  const { className, style, initialData } = props;
  const {
    marketing: { currentMerchant: merchantProperty },
    currentMerchant: { signupTime: merchantSignupTime },
  } = initialData;
  const styles = useStylesheet();

  const [query, setQuery] = useStringQueryParam("q");
  const [rawLimit, setLimit] = useIntQueryParam("limit");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [promotionStatuses] =
    useStringEnumArrayQueryParam<ProductPromotionStatus>("statuses");
  const [searchType, setSearchType] =
    useStringEnumQueryParam<ProductPromotionSearchType>("search_type", "NAME");
  const debouncedQuery = useDebouncer(query, 800);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));
  const offset = rawOffset || 0;
  const limit = rawLimit || 10;

  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;
  const { nonBatchingClient } = useApolloStore();
  const {
    data: productsData,
    loading: productsLoading,
    refetch: refetchProducts,
  } = useQuery<
    GetProductPromotionsResponseType,
    GetProductPromotionsRequestType
  >(GET_PRODUCT_PROMOTIONS, {
    variables: {
      offset,
      limit,
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      promotionStatuses,
    },
    fetchPolicy: "no-cache",
  });

  const { data: productCountData, loading: productCountLoading } = useQuery<
    GetProductCountResponseType,
    GetProductCountRequestType
  >(GET_PRODUCT_PROMOTION_COUNT, {
    client: nonBatchingClient,
    variables: {
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      promotionStatuses,
    },
    fetchPolicy: "no-cache",
  });

  const clearExpandedRows = useCallback(() => {
    setExpandedRows(new Set([]));
  }, [setExpandedRows]);

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
    clearExpandedRows();
  };

  const promotedProducts = productsData?.marketing.productPromotions ?? [];
  const productCount = productsData?.marketing.productPromotions.length ?? 0;
  const totalProductCount = productCountData?.marketing.productPromotionsCount;
  const disableInputs = searchQuery == null && totalProductCount == 0;
  const hasActiveFilters =
    promotionStatuses != null && promotionStatuses.length > 0;

  const searchProductIdDebugValue: string | undefined | null =
    promotedProducts != null && promotedProducts.length > 0
      ? promotedProducts[0].product.id
      : undefined;
  const searchProductNameDebugValue: string | undefined | null =
    promotedProducts != null && promotedProducts.length > 0
      ? promotedProducts[0].product.name
      : undefined;
  const searchProductSkuDebugValue: string | undefined | null =
    promotedProducts != null && promotedProducts.length > 0
      ? promotedProducts[0].product.sku
      : undefined;
  const searchDebugValues: {
    [searchType in ProductPromotionSearchType]: string | undefined | null;
  } = {
    ID: searchProductIdDebugValue,
    NAME: searchProductNameDebugValue,
    SKU: searchProductSkuDebugValue,
  };

  const showEmptyState =
    searchQuery == null &&
    !productsLoading &&
    !hasActiveFilters &&
    totalProductCount != null &&
    totalProductCount == 0;

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const renderContent = () => {
    if (showEmptyState) {
      return <EmptyState />;
    }

    return (
      <>
        <div className={css(styles.controlsRow)}>
          <ProductSearchBar
            style={styles.search}
            searchType={searchType}
            onSelectSearchType={(
              selectedSearchType: ProductPromotionSearchType,
            ) => {
              setSearchType(selectedSearchType);
            }}
            query={query}
            searchDebugValues={searchDebugValues}
            onUpdateQuery={({ text }) => {
              setOffset(0);
              setQuery(text);
            }}
            disabled={disableInputs}
          />
          <div className={css(styles.rightControls)}>
            <PageIndicator
              className={css(styles.pageIndicator)}
              isLoading={productsLoading || productCountLoading}
              rangeStart={offset + 1}
              rangeEnd={Math.min(totalProductCount ?? 0, offset + productCount)}
              hasNext={
                totalProductCount != null &&
                offset + productCount < totalProductCount
              }
              hasPrev={offset > 0}
              currentPage={Math.ceil(offset / limit)}
              totalItems={totalProductCount}
              onPageChange={onPageChange}
            />
            <SimpleSelect
              options={[10, 20, 50].map((v) => ({
                value: v.toString(),
                text: v.toString(),
              }))}
              onSelected={(value: string) => {
                setLimit(parseInt(value));
              }}
              style={styles.select}
              selectedValue={limit.toString()}
              disabled={disableInputs}
            />
            <Popover
              popoverContent={
                disableInputs && !hasActiveFilters
                  ? undefined
                  : () => (
                      <BoostedProductsFilter className={css(styles.filter)} />
                    )
              }
              position="bottom right"
              contentWidth={FilterWidth}
            >
              <FilterButton
                disabled={disableInputs && !hasActiveFilters}
                isActive={hasActiveFilters}
              />
            </Popover>
          </div>
        </div>
        {productsLoading ? (
          <LoadingIndicator />
        ) : (
          <BoostedProductsTable
            promotedProducts={promotedProducts}
            expandedRows={Array.from(expandedRows)}
            onRowExpandToggled={onRowExpandToggled}
            merchantProperty={merchantProperty}
            refetchProducts={refetchProducts}
          />
        )}
      </>
    );
  };

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.overviewContainer)}>
        <ImpressionsOverviewCard
          className={css(styles.overviewCard)}
          merchantSignupTime={merchantSignupTime.unix}
        />
        <BalanceOverviewCard
          className={css(styles.overviewCard)}
          initialData={initialData}
        />
      </div>
      <div className={css(styles.content)}>{renderContent()}</div>
    </div>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "20px 0px",
        },
        overviewContainer: {
          display: "grid",
          gridGap: 20,
          maxWidth: "100%",
          [`@media ${IS_SMALL_SCREEN}`]: {
            gridTemplateColumns: "1fr",
          },
          [`@media ${IS_LARGE_SCREEN}`]: {
            gridTemplateColumns: "7fr 3fr",
            alignItems: "start",
          },
        },
        overviewCard: {
          minHeight: 205,
        },
        content: {
          marginTop: 20,
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
      }),
    [],
  );
};

export default observer(BoostedProducts);
