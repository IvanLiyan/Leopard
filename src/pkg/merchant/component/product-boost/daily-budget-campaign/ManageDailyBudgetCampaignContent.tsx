import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Lego Components */
import { PageIndicator } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { TextInputWithSelect } from "@ContextLogic/lego";
import { OnTextChangeEvent, TextInputProps } from "@ContextLogic/lego";
import { PageGuide } from "@merchant/component/core";
import { FilterButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { css } from "@toolkit/styling";
import { search as searchImg } from "@assets/icons";
import { CurrencyCode } from "@toolkit/currency";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import {
  useIntQueryParam,
  useStringEnumArrayQueryParam,
  useStringEnumQueryParam,
  useStringQueryParam,
} from "@toolkit/url";

/* Merchant Components */
import DailyBudgetCampaignFilter from "@merchant/component/product-boost/daily-budget-campaign/DailyBudgetCampaignFilter";
import Header from "@merchant/component/product-boost/ProductBoostHeader";
import ProductLifetimeTable from "@merchant/component/product-boost/products/ProductLifetimeTable";

/* Merchant Store */
import { useTheme } from "@merchant/stores/ThemeStore";
import DimenStore from "@merchant/stores/DimenStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  ProductPromotionRowType,
  ProductPromotionType,
} from "@merchant/api/product-promotion";
import {
  MarketingServiceSchema,
  MarketingServiceSchemaProductPromotionsArgs,
  Maybe,
  ProductPromotionSearchType,
  ProductPromotionStatus,
} from "@schema/types";

const GET_PRODUCT_PROMOTION_LIST = gql`
  query ManageDailyBudgetCampaignContent_GetProductPromotionList(
    $query: String
    $searchType: ProductPromotionSearchType
    $promotionStatuses: [ProductPromotionStatus!]
    $offset: Int
    $limit: Int
  ) {
    marketing {
      productPromotions(
        query: $query
        searchType: $searchType
        promotionStatuses: $promotionStatuses
        offset: $offset
        limit: $limit
      ) {
        productId
        promotionStatus
        dailyPromotionBudget {
          amount
          currencyCode
        }
        lastUpdateDate {
          formatted(fmt: "%Y-%m-%d")
        }
        lifetimeStats {
          sales
          gmv {
            amount
            currencyCode
          }
          spend {
            amount
            currencyCode
          }
        }
        intenseBoost
      }
      productPromotionsCount(
        query: $query
        searchType: $searchType
        promotionStatuses: $promotionStatuses
      )
    }
  }
`;

type GetProductPromotionListResponseType = {
  readonly marketing: Maybe<
    Pick<MarketingServiceSchema, "productPromotionsCount"> & {
      readonly productPromotions: ReadonlyArray<ProductPromotionType>;
    }
  >;
};
type GetProductPromotionListRequestType = Pick<
  MarketingServiceSchemaProductPromotionsArgs,
  "query" | "searchType" | "promotionStatuses" | "offset" | "limit"
>;

const inputPlaceholderDict: { [type in ProductPromotionSearchType]: string } = {
  ID: i`Search a product ID`,
  NAME: i`Search a product name`,
  SKU: i`Search a product SKU`,
};

type ManageDailyBudgetCampaignContentProps = BaseProps & {
  readonly maxAllowedSpending: number;
  readonly currencyCode: CurrencyCode;
};

const ManageDailyBudgetCampaignContent = (
  props: ManageDailyBudgetCampaignContentProps,
) => {
  const styles = useStyleSheet();
  const { maxAllowedSpending, currencyCode, className } = props;

  const dimenStore = DimenStore.instance();
  const pageX = dimenStore.pageGuideXForPageWithTable;
  const { primary, textBlack, textUltralight } = useTheme();

  const [offset, setOffset] = useIntQueryParam("offset");
  const [searchType, setSearchType] =
    useStringEnumQueryParam<ProductPromotionSearchType>("search_type", "ID");
  const [query, setQuery] = useStringQueryParam("query");
  const [promotionStatuses, setPromotionStatuses] =
    useStringEnumArrayQueryParam<ProductPromotionStatus>("promotion_statuses");

  const hasActiveFilters = promotionStatuses.length > 0;

  const pageSize = 10;
  const currentOffset = offset || 0;

  const [updatedMaxAllowedSpending, setUpdatedMaxAllowedSpending] =
    useState(maxAllowedSpending);

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    setOffset(nextPage * pageSize);
  };

  const {
    data,
    refetch: refetchProductPromotions,
    loading: loadingProductPromotions,
  } = useQuery<
    GetProductPromotionListResponseType,
    GetProductPromotionListRequestType
  >(GET_PRODUCT_PROMOTION_LIST, {
    variables: {
      query,
      searchType,
      promotionStatuses,
      limit: pageSize,
      offset: currentOffset,
    },
    fetchPolicy: "no-cache",
  });

  const options: { value: ProductPromotionSearchType; text: string }[] = [
    {
      value: "ID",
      text: i`Product ID`,
    },
    {
      value: "NAME",
      text: i`Product Name`,
    },
    {
      value: "SKU",
      text: i`Product SKU`,
    },
  ];

  const selectProps = {
    options,
    onSelected: (value: ProductPromotionSearchType) => {
      setSearchType(value);
      if (query.trim().length === 0) {
        return;
      }
      setOffset(0);
    },
    selectedValue: searchType,
    minWidth: 120,
    hideBorder: true,
  };

  const textInputProps: TextInputProps = {
    icon: searchImg,
    placeholder: inputPlaceholderDict[searchType],
    hideBorder: true,
    focusOnMount: false,
    value: query,
    onChange({ text }: OnTextChangeEvent) {
      setQuery(text);
      setOffset(0);
    },
    style: { minWidth: "25vw" },
  };

  if (loadingProductPromotions) {
    return <LoadingIndicator />;
  }
  const productPromotions = data?.marketing?.productPromotions || [];
  const productPromotionsCount = data?.marketing?.productPromotionsCount || 0;

  const currentStart = currentOffset + 1;
  const currentEnd = productPromotionsCount
    ? Math.min(productPromotionsCount, currentOffset + pageSize)
    : 0;
  const hasNext = currentEnd < productPromotionsCount;
  const hasPrev = currentOffset >= pageSize;
  const currentPage = currentOffset / pageSize;

  // Flatten the objects to be suitable as table data
  const aggrStats = productPromotions.reduce(
    (stats: ProductPromotionRowType[], productPromotion) => {
      const {
        productId,
        promotionStatus,
        dailyPromotionBudget,
        lastUpdateDate,
        lifetimeStats: { sales, gmv, spend },
        intenseBoost,
      } = productPromotion;
      if (
        dailyPromotionBudget.currencyCode === currencyCode &&
        gmv.currencyCode === currencyCode &&
        spend.currencyCode === currencyCode
      ) {
        // Only show data if the currency codes are in agreement. In theory,
        // this check should never fail, but we don't want to mislead merchants
        // if it ever does.
        stats.push({
          product_id: productId,
          lifetime_sales: sales,
          lifetime_gmv: gmv.amount,
          lifetime_spend: spend.amount,
          daily_max_budget: dailyPromotionBudget.amount,
          daily_budget_state: promotionStatus,
          daily_budget_update_date: lastUpdateDate?.formatted,
          intense_boost: intenseBoost,
        });
      }
      return stats;
    },
    [],
  );

  const headerBody = i`View and manage your promoted products.`;
  const statsColumns = [
    {
      columnTitle: i`Your maximum budget available`,
      columnStats: formatCurrency(updatedMaxAllowedSpending, currencyCode),
    },
  ];

  const filterButton = (
    <FilterButton
      style={[
        styles.filterButton,
        {
          padding: "5px 15px",
          textColor: hasActiveFilters ? primary : textBlack,
        },
      ]}
      isActive={hasActiveFilters}
      borderColor={hasActiveFilters ? primary : textUltralight}
      popoverPosition="bottom right"
      popoverContentWidth={350}
      popoverContent={() => {
        return (
          <DailyBudgetCampaignFilter
            productStateFilter={promotionStatuses}
            setProductStateFilter={setPromotionStatuses}
          />
        );
      }}
    />
  );

  return (
    <div className={css(className)}>
      <Header
        title={i`Promoted Products`}
        body={headerBody}
        illustration="productBoostPhone"
        statsColumns={statsColumns}
        paddingX={pageX}
      />

      <PageGuide mode="page-with-table">
        <div
          className={css(
            styles.searchContainerAndPageIndicatorRow,
            styles.topMargin,
          )}
        >
          <div className={css(styles.searchContainer)}>
            <TextInputWithSelect
              selectProps={selectProps}
              textInputProps={textInputProps}
            />
          </div>
          <div className={css(styles.controllerGroup)}>
            <PageIndicator
              className={css(styles.pageIndicator)}
              rangeStart={currentStart}
              rangeEnd={currentEnd}
              hasNext={hasNext}
              hasPrev={hasPrev}
              currentPage={currentPage}
              onPageChange={onPageChange}
              totalItems={productPromotionsCount}
            />
            {filterButton}
          </div>
        </div>
        <ProductLifetimeTable
          dailyBudgetEnabled
          maxAllowedSpending={updatedMaxAllowedSpending}
          setMaxAllowedSpending={setUpdatedMaxAllowedSpending}
          data={aggrStats}
          className={css(styles.topMargin)}
          refreshDailyBudgetCampaignsTable={refetchProductPromotions}
        />
      </PageGuide>
    </div>
  );
};

const useStyleSheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        title: {
          fontSize: 22,
          fontWeight: fonts.weightBold,
          lineHeight: 1.33,
          color: textDark,
          marginRight: 25,
          userSelect: "none",
          alignSelf: "flex-start",
        },
        topControls: {
          marginTop: 25,
          ":nth-child(1n) > *": {
            height: 30,
            margin: "0px 0px 25px 0px",
          },
        },
        searchContainerAndPageIndicatorRow: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
        },
        searchContainer: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        searchBox: {
          minWidth: 300,
        },
        pageIndicator: {
          marginRight: 25,
          alignSelf: "center",
          height: 30,
        },
        controllerGroup: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        topMargin: {
          marginTop: 10,
        },
        filterButton: {
          alignSelf: "stretch",
          height: 30,
        },
      }),
    [textDark],
  );
};

export default observer(ManageDailyBudgetCampaignContent);
