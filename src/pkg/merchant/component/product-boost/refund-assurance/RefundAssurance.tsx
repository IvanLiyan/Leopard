/*
 * RefundAssurance.tsx
 *
 * Created by Jonah Dlin on Tue Mar 09 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "react-apollo";
import _ from "lodash";

/* Lego Components */
import { css } from "@toolkit/styling";
import { Markdown } from "@ContextLogic/lego";

import { useTheme } from "@stores/ThemeStore";
import {
  GetRefundAssuranceProductsCountInput,
  GetRefundAssuranceProductsCountResponse,
  GetRefundAssuranceProductsResponse,
  GET_REFUND_ASSURANCE_PRODUCTS,
  GET_REFUND_ASSURANCE_PRODUCTS_COUNT,
  PageLimitOptions,
  PickedProductPromotion,
  TabDescriptions,
} from "@toolkit/product-boost/refund-assurance";
import {
  MarketingServiceSchemaProductPromotionsArgs,
  ProductPromotionRefundAssuranceType,
} from "@schema/types";
import { useIntQueryParam, useStringQueryParam } from "@toolkit/url";
import {
  Link,
  LoadingIndicator,
  PageIndicator,
  SimpleSelect,
  Table,
  TableAction,
  TextInputWithSelect,
  ThemedLabel,
} from "@ContextLogic/lego";
import ProductImage from "@merchant/component/products/ProductImage";
import ProductDetailModal from "@merchant/component/products/ProductDetailModal";
import { useNavigationStore } from "@stores/NavigationStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import MonthlyStatsTable, {
  MonthlyStatsTableColumn,
} from "./MonthlyStatsTable";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

import { RefundAssuranceTooltip } from "@toolkit/product-boost/refund-assurance";

type RefundAssuranceColumn =
  | "PRODUCT"
  | "REFUND_RATE"
  | "REFUND_GMV"
  | "GMV"
  | "PB_SPEND"
  | "CREDIT_RECEIVED"
  | "ACTION";

type Props = BaseProps & {
  readonly refundAssuranceType: ProductPromotionRefundAssuranceType;
  readonly hiddenColumns?: ReadonlyArray<RefundAssuranceColumn>;
  readonly hiddenMonthlyStatsColumns?: ReadonlyArray<MonthlyStatsTableColumn>;
  readonly spendDiscountFactor: number;
  readonly guaranteedRefundRate: number;
};

const RefundAssurance: React.FC<Props> = ({
  className,
  style,
  refundAssuranceType,
  hiddenColumns = [],
  hiddenMonthlyStatsColumns,
  spendDiscountFactor,
  guaranteedRefundRate,
}: Props) => {
  const styles = useStylesheet();

  const navigationStore = useNavigationStore();

  const [query, setQuery] = useStringQueryParam("q");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [pageLimit, setPageLimit] = useIntQueryParam("page_limit");
  const [searchField, setSearchField] = useStringQueryParam(
    "search_field",
    "ID",
  );

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const expandedRowsArray = useMemo(
    () => Array.from(expandedRows),
    [expandedRows],
  );
  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    const newExpandedRows = new Set(expandedRows);
    shouldExpand ? newExpandedRows.add(index) : newExpandedRows.delete(index);
    setExpandedRows(newExpandedRows);
  };

  const renderExpandedRow = ({
    refundAssurance: { monthlyStats },
  }: PickedProductPromotion) => (
    <MonthlyStatsTable
      monthlyStats={monthlyStats}
      hiddenColumns={hiddenMonthlyStatsColumns}
      spendDiscountFactor={spendDiscountFactor}
      guaranteedRefundRate={guaranteedRefundRate}
    />
  );

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery =
    debouncedQuery.trim().length == 0 ? undefined : debouncedQuery.trim();

  const offset = rawOffset || 0;
  const limit = pageLimit || PageLimitOptions[0];

  const { data: countData, loading: isLoadingCount } = useQuery<
    GetRefundAssuranceProductsCountResponse,
    GetRefundAssuranceProductsCountInput
  >(GET_REFUND_ASSURANCE_PRODUCTS_COUNT, {
    variables: {
      query: searchQuery,
      searchType: "ID",
      refundAssuranceType,
    },
  });

  const { data: productsData, loading: isLoadingProducts } = useQuery<
    GetRefundAssuranceProductsResponse,
    MarketingServiceSchemaProductPromotionsArgs
  >(GET_REFUND_ASSURANCE_PRODUCTS, {
    variables: {
      offset,
      limit,
      query: searchQuery,
      searchType: "ID",
      refundAssuranceType,
    },
  });

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  const totalCount = countData?.marketing.productPromotionsCount;
  const products = productsData?.marketing.productPromotions || [];
  const productCount = products.length;

  const tableActions = useMemo((): ReadonlyArray<TableAction> => {
    return hiddenColumns.includes("ACTION")
      ? []
      : [
          {
            key: "create-campaign",
            name: i`Create campaign`,
            canApplyToRow: () => true,
            apply: ([
              productPromotion,
            ]: ReadonlyArray<PickedProductPromotion>) => {
              navigationStore.navigate(
                `/product-boost/v2/create?product_id=${productPromotion.productId}`,
              );
            },
          },
        ];
  }, [navigationStore, hiddenColumns]);

  const firstProductId = products.length > 0 ? products[0].productId : "";

  return (
    <div className={css(styles.root, className, style)}>
      <Markdown
        className={css(styles.pageDescription)}
        text={TabDescriptions[refundAssuranceType]}
      />
      <div className={css(styles.controls)}>
        <TextInputWithSelect
          className={css(styles.input)}
          selectProps={{
            onSelected: (val: string) => {
              setSearchField(val);
            },
            selectedValue: searchField,
            options: [
              {
                value: "ID",
                text: i`Product ID`,
              },
            ],
            height: 40,
          }}
          textInputProps={{
            value: query,
            onChange: ({ text }) => {
              setQuery(text);
              setOffset(0);
            },
            placeholder: i`Product ID`,
            debugValue: firstProductId,
            height: 40,
          }}
        />
        <div className={css(styles.paginationContainer)}>
          <PageIndicator
            style={css(styles.pageIndicator)}
            isLoading={isLoadingCount}
            totalItems={totalCount}
            rangeStart={offset + 1}
            rangeEnd={Math.min(totalCount ?? 0, offset + productCount)}
            hasNext={totalCount != null && offset + productCount < totalCount}
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
          />
        </div>
      </div>
      <div className={css(styles.tableContainer)}>
        {isLoadingProducts ? (
          <LoadingIndicator />
        ) : (
          <Table
            className={css(styles.table)}
            data={products}
            actions={tableActions}
            rowExpands={() => true}
            expandedRows={expandedRowsArray}
            onRowExpandToggled={onRowExpandToggled}
            renderExpanded={renderExpandedRow}
          >
            {!hiddenColumns.includes("PRODUCT") && (
              <Table.Column
                title={i`Product`}
                columnKey="productId"
                align="left"
                width={375}
              >
                {({
                  row: {
                    productId,
                    product: { name },
                  },
                }: {
                  row: PickedProductPromotion;
                }) => (
                  <div className={css(styles.productCell)}>
                    <Link
                      className={css(styles.productCellContent)}
                      onClick={() => {
                        new ProductDetailModal(productId).render();
                      }}
                      openInNewTab
                    >
                      <ProductImage
                        productId={productId}
                        className={css(styles.productCellImage)}
                      />
                      <div className={css(styles.productCellName)}>{name}</div>
                    </Link>
                  </div>
                )}
              </Table.Column>
            )}

            {!hiddenColumns.includes("GMV") && (
              <Table.Column
                title={i`GMV`}
                columnKey="refundAssurance.topLevelStats.advancedLogisticsGmv.display"
                align="left"
                description={RefundAssuranceTooltip.PRODUCT_LEVEL_GMV_COLUMN}
              />
            )}

            {!hiddenColumns.includes("REFUND_GMV") && (
              <Table.Column
                title={i`Refund GMV`}
                columnKey="refundAssurance.topLevelStats.refundAdvancedLogisticsGmv.display"
                align="left"
                description={
                  RefundAssuranceTooltip.PRODUCT_LEVEL_REFUND_GMV_COLUMN
                }
              />
            )}

            {!hiddenColumns.includes("REFUND_RATE") && (
              <Table.Column
                title={i`Refund rate`}
                columnKey="productId"
                align="left"
                description={
                  RefundAssuranceTooltip.PRODUCT_LEVEL_REFUND_RATE_COLUMN
                }
              >
                {({
                  row: {
                    refundAssurance: {
                      topLevelStats: { refundRate },
                    },
                  },
                }: {
                  row: PickedProductPromotion;
                }) =>
                  refundRate != null
                    ? `${_.round(refundRate * 100, 1)}%`
                    : i`No Data`
                }
              </Table.Column>
            )}

            {!hiddenColumns.includes("PB_SPEND") && (
              <Table.Column
                title={i`ProductBoost spend`}
                columnKey="refundAssurance.topLevelStats.spend.display"
                align="left"
                description={RefundAssuranceTooltip.PRODUCT_LEVEL_SPEND_COLUMN}
              />
            )}

            {!hiddenColumns.includes("CREDIT_RECEIVED") && (
              <Table.Column
                title={i`ProductBoost credit received`}
                columnKey="refundAssurance.topLevelStats.creditIssued.display"
                align="left"
                description={
                  RefundAssuranceTooltip.PRODUCT_LEVEL_CREDIT_RECEIVED_COLUMN
                }
              >
                {({
                  row: {
                    refundAssurance: {
                      topLevelStats: {
                        creditIssued: { display },
                        creditIssuedStatus,
                      },
                    },
                  },
                }: {
                  row: PickedProductPromotion;
                }) =>
                  creditIssuedStatus === "PENDING" ? (
                    <ThemedLabel theme="LightGrey" text={i`Pending`} />
                  ) : (
                    display
                  )
                }
              </Table.Column>
            )}
          </Table>
        )}
      </div>
    </div>
  );
};

export default observer(RefundAssurance);

const useStylesheet = () => {
  const { pageBackground, textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          backgroundColor: pageBackground,
        },
        pageDescription: {
          fontSize: 16,
          lineHeight: 1.5,
          margin: "32px 0px 32px 0px",
          color: textBlack,
        },
        controls: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        },
        input: {
          // Want min 300 here to prevent search from shrinking
          //eslint-disable-next-line local-rules/no-frozen-width
          minWidth: 300,
          height: 40,
        },
        paginationContainer: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          height: 40,
        },
        pageIndicator: {
          margin: "0 12px",
          height: 40,
        },
        limitSelect: {
          height: "100%",
          width: 50,
          flex: 0,
        },
        tableContainer: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        table: {
          width: "100%",
        },
        productCell: {
          display: "flex",
          alignItems: "center",
          margin: "12px 0px",
          maxWidth: "100%",
        },
        productCellImage: {
          height: 56,
          minWidth: 56,
          maxWidth: 56,
          objectFit: "contain",
          borderRadius: 4,
          marginRight: 12,
        },
        productCellContent: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          overflow: "hidden",
        },
        productCellName: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }),
    [pageBackground, textBlack],
  );
};
