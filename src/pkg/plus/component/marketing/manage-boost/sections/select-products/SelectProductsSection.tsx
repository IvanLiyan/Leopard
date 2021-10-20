/*
 *
 * SelectProductsSection.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 8/22/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import {
  H7Markdown,
  PageIndicator,
  CheckboxField,
  LoadingIndicator,
} from "@ContextLogic/lego";

import {
  useIntQueryParam,
  useBoolQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
} from "@toolkit/url";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { useApolloStore } from "@stores/ApolloStore";

import { wishExpressTruck } from "@assets/illustrations";

import { useTheme } from "@stores/ThemeStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import Section from "@plus/component/marketing/manage-boost/Section";

import SelectProductsTable from "./SelectProductsTable";

import ProductSearchBar from "@plus/component/marketing/toolkit/ProductSearchBar";

import { BoostableProduct } from "@toolkit/marketing/boost-products";
import {
  MarketingServiceSchema,
  MarketingServiceSchemaPromotableProductsArgs,
  MarketingServiceSchemaPromotableProductsCountArgs,
  ProductPromotionSearchType,
} from "@schema/types";
import BoostProductsState from "@plus/model/BoostProductsState";
import { useUserStore } from "@stores/UserStore";

const SEARCH_PROMOTABLE_PRODUCTS = gql`
  query SelectProductsSection_SearchPromotableProducts(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: ProductPromotionSearchType
    $wishExpressOnly: Boolean
  ) {
    marketing {
      promotableProducts(
        query: $query
        offset: $offset
        searchType: $searchType
        limit: $limit
        wishExpressOnly: $wishExpressOnly
      ) {
        isInTrendingCategory
        product {
          id
          name
          variationCount
          sales
          wishes
          sku
        }
      }
    }
  }
`;

const GET_PROMOTABLE_PRODUCT_COUNT = gql`
  query SelectProductsSection_GetPromotableProductCount(
    $query: String
    $searchType: ProductPromotionSearchType
    $wishExpressOnly: Boolean
  ) {
    marketing {
      promotableProductsCount(
        query: $query
        searchType: $searchType
        wishExpressOnly: $wishExpressOnly
      )
    }
  }
`;

type GetPromotableProductsResponseType = {
  readonly marketing: {
    readonly promotableProducts: ReadonlyArray<BoostableProduct>;
  };
};

type GetProductCountResponseType = {
  readonly marketing: Pick<MarketingServiceSchema, "promotableProductsCount">;
};

const InputHeight = 30;

type Props = BaseProps & {
  readonly boostState: BoostProductsState;
};

const SelectProductsSection: React.FC<Props> = (props: Props) => {
  const { className, style, boostState } = props;
  const { hasProductSelectionError } = boostState;
  const styles = useStylesheet();

  const [query, setQuery] = useStringQueryParam("q");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [wishExpress, setWishExpress] = useBoolQueryParam("wish_express");
  const [searchType, setSearchType] =
    useStringEnumQueryParam<ProductPromotionSearchType>("search_type", "NAME");

  const offset = rawOffset || 0;

  const limit = 10;

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;
  const { nonBatchingClient } = useApolloStore();
  const { isStoreUser } = useUserStore();
  const { data: productsData, loading: productsLoading } = useQuery<
    GetPromotableProductsResponseType,
    MarketingServiceSchemaPromotableProductsArgs
  >(SEARCH_PROMOTABLE_PRODUCTS, {
    variables: {
      offset,
      limit,
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      wishExpressOnly: wishExpress === true ? true : undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: productCountData, loading: productCountLoading } = useQuery<
    GetProductCountResponseType,
    MarketingServiceSchemaPromotableProductsCountArgs
  >(GET_PROMOTABLE_PRODUCT_COUNT, {
    client: nonBatchingClient,
    variables: {
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      wishExpressOnly: wishExpress === true ? wishExpress : undefined,
    },
    fetchPolicy: "cache-and-network",
  });

  const { isFreeBudgetMerchant } = boostState;
  const promotableProducts = productsData?.marketing.promotableProducts ?? [];
  const productCount = productsData?.marketing.promotableProducts.length ?? 0;
  const totalProductCount = productCountData?.marketing.promotableProductsCount;

  const displayAllBoosted =
    (searchQuery === null || searchQuery.length === 0 || wishExpress != null) &&
    promotableProducts.length === 0;

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  const searchProductNameDebugValue: string | undefined | null =
    promotableProducts.length > 0
      ? promotableProducts[0].product.name
      : undefined;
  const searchProductIdDebugValue: string | undefined | null =
    promotableProducts != null && promotableProducts.length > 0
      ? promotableProducts[0].product.id
      : undefined;
  const searchProductSkuDebugValue: string | undefined | null =
    promotableProducts != null && promotableProducts.length > 0
      ? promotableProducts[0].product.sku
      : undefined;
  const searchDebugValues: {
    [searchType in ProductPromotionSearchType]: string | undefined | null;
  } = {
    ID: searchProductIdDebugValue,
    NAME: searchProductNameDebugValue,
    SKU: searchProductSkuDebugValue,
  };

  const freeBudgetFAQLink = zendeskURL("360058530133");
  return (
    <Section
      className={css(style, className)}
      title={i`**Step 1:** Select products`}
      markdown
      contentStyle={css(styles.root)}
      hasInvalidData={hasProductSelectionError}
    >
      <div className={css(styles.topSection)}>
        <H7Markdown
          text={
            isFreeBudgetMerchant
              ? i`Boost your products’ impressions in the Wish app, and strategically` +
                i`attract prospective customers who may make purchases. [Learn more](${freeBudgetFAQLink})`
              : i`Boost your products’ impressions in the Wish app, and strategically` +
                i`attract prospective customers who may make purchases.`
          }
        />

        <div className={css(styles.buttonsRow)}>
          <div className={css(styles.inputContainer)}>
            <ProductSearchBar
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
              disabled={false}
              focusOnMount
            />
            {!isStoreUser && (
              <CheckboxField
                title=""
                icon={wishExpressTruck}
                onChange={(checked) => setWishExpress(checked)}
                checked={wishExpress}
                className={css(styles.wishExpress)}
              />
            )}
          </div>

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
        </div>
      </div>
      {productsLoading ? (
        <LoadingIndicator />
      ) : (
        <SelectProductsTable
          products={promotableProducts}
          style={{ opacity: productsLoading ? 0.5 : 1 }}
          boostState={boostState}
          displayAllBoosted={displayAllBoosted}
        />
      )}
    </Section>
  );
};

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        },
        topSection: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 20,
        },
        buttonsRow: {
          margin: "20px 0px",
          display: "flex",
          "@media (max-width: 836px)": {
            flexDirection: "column",
            alignItems: "stretch",
          },
          "@media (min-width: 836px)": {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        },
        inputContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          "@media (max-width: 836px)": {
            marginBottom: 20,
          },
          "@media (min-width: 836px)": {
            marginRight: 20,
            width: "80%",
          },
        },
        pageIndicator: {
          height: InputHeight,
        },
        wishExpress: {
          marginLeft: 10,
          border: `1px solid ${borderPrimary}`,
          borderRadius: 4,
          paddingLeft: 5,
          paddingRight: 5,
          height: InputHeight,
        },
      }),
    [borderPrimary],
  );
};

export default observer(SelectProductsSection);
