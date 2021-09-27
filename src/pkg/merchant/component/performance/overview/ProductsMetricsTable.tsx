import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Lego Components */
import {
  Card,
  FormSelect,
  Table,
  Layout,
  TextInputWithSelect,
  PageIndicator,
  MultiSecondaryButton,
  LoadingIndicator,
  CellInfo,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
} from "@toolkit/url";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";
import ProductsPriceRange from "@merchant/component/products/product-details/ProductsPriceRange";

/* Model */
import {
  PerformanceMetricsProductsRequestData,
  PerformanceMetricsProductsResponseData,
  PerformanceHealthInitialData,
} from "@toolkit/performance/stats";
import { ProductSearchType } from "@schema/types";

/* Toolkit */
import { LogEventNames, Page } from "@toolkit/performance/constants";
import logger from "@toolkit/performance/logger";

/* Relative Imports */
import ProductChart from "./ProductChart";

import searchImg from "@assets/img/search.svg";

const PRODUCTS_STATS_QUERY = gql`
  query ProductsStats_ProductMetricsTable(
    $offset: Int!
    $limit: Int!
    $days: Int!
    $searchType: ProductSearchType
    $query: String
  ) {
    currentMerchant {
      state
    }
    productCatalog {
      productCount(
        searchType: $searchType
        query: $query
        productStatuses: ENABLED
      )
      products(
        limit: $limit
        offset: $offset
        searchType: $searchType
        query: $query
        sort: { order: DESC, field: SALES }
        productStatuses: ENABLED
      ) {
        sku
        name
        id
        variations {
          price {
            amount
            display
          }
        }
        stats {
          totals(coreMetricsOnly: true, days: $days) {
            gmv {
              amount
              display
            }
            orders
            impressions
          }
        }
      }
    }
  }
`;

type TableData = {
  readonly name: string;
  readonly id: string;
  readonly productId: string;
  readonly price: string;
  readonly gmv: string;
  readonly orders: string;
  readonly impressions: string;
  readonly actions: string;
};

type Props = BaseProps & {
  readonly initialData: PerformanceHealthInitialData;
};

const ProductsMetricsTable = (props: Props) => {
  const {
    className,
    style,
    initialData: {
      currentMerchant: { priceDropEnabled },
    },
  } = props;
  const styles = useStylesheet();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));
  const [pageOffsetQuery, setPageOffsetQuery] = useIntQueryParam("offset");
  const [searchTypeQuery, setSearchTypeQuery] = useStringEnumQueryParam<
    ProductSearchType
  >("search_type", "NAME");
  const [productsPerPageQuery, setProductsPerPageQuery] = useIntQueryParam(
    "limit"
  );
  const [lastNDaysQuery, setLastNdaysQuery] = useIntQueryParam("days");
  const [searchQuery, setSearchQuery] = useStringQueryParam("query");

  const pageOffset = pageOffsetQuery || 0;
  const searchType = searchTypeQuery || "NAME";
  const productsPerPage = productsPerPageQuery || 5;
  const lastNDays = lastNDaysQuery || 7;
  const query = searchQuery || null;

  const { data, loading, refetch } = useQuery<
    PerformanceMetricsProductsResponseData,
    PerformanceMetricsProductsRequestData
  >(PRODUCTS_STATS_QUERY, {
    variables: {
      offset: pageOffset,
      limit: productsPerPage,
      days: lastNDays,
      query,
      searchType: query ? searchType : undefined,
    },
  });

  if (data == null || data.currentMerchant == null) {
    return <LoadingIndicator />;
  }

  const isApproved = data.currentMerchant.state === "APPROVED";

  const totalProducts =
    data.productCatalog != null ? data.productCatalog.productCount : 0;

  const productsList =
    data.productCatalog != null
      ? data.productCatalog.products.map((product) => ({
          name: product.name,
          id: product.id,
          productId: product.id,
          variations: product.variations,
          gmv: product.stats.totals.gmv.display,
          orders: numeral(product.stats.totals.orders).format("0,0"),
          impressions: numeral(product.stats.totals.impressions).format("0,0"),
          actions: product.id,
        }))
      : [];

  const onRowExpandToggled = async (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      await logger({
        action: "EXPAND",
        event_name: "EXPAND_PRODUCTS_SALES_GRAPH",
        page: Page.salesMetrics,
        product_id: productsList != null ? productsList[index].id : undefined,
        product_id_position: index,
      });
      expandedRows.add(index);
    } else {
      expandedRows.delete(index);
    }
    setExpandedRows(new Set(expandedRows));
  };

  const onSelectProductsPerPage = async (value: string) => {
    await logger({
      action: "CLICK_DROPDOWN",
      event_name: "CHANGE_PRODUCTS_DISPLAY_NUMBER",
      page: Page.salesMetrics,
      old_value: productsPerPage,
      new_value: parseInt(value),
    });
    setProductsPerPageQuery(parseInt(value));
    await refetch();
  };

  const onSelectLastNDays = async (value: string) => {
    await logger({
      action: "CLICK_DROPDOWN",
      event_name: "PRODUCTS_CHANGE_TIME_FRAME",
      page: Page.salesMetrics,
      old_value: lastNDays,
      new_value: parseInt(value),
    });
    setLastNdaysQuery(parseInt(value));
    await refetch();
  };

  const onPageChange = async (currentPage: number) => {
    const nextPage = Math.max(0, currentPage);
    await logger({
      action: "CLICK",
      event_name: "NEXT_X_PRODUCTS",
      page: Page.salesMetrics,
      old_value: `${pageOffset + 1}-${Math.min(
        totalProducts,
        pageOffset + productsPerPage
      )} of ${totalProducts}`,
      new_value: `${nextPage * productsPerPage + 1}-${Math.min(
        totalProducts,
        nextPage * productsPerPage + productsPerPage
      )} of ${totalProducts}`,
    });
    setPageOffsetQuery(nextPage * productsPerPage);
    setExpandedRows(new Set([]));
    await refetch();
  };

  const onSearchInputChange = async (value: string) => {
    setSearchQuery(value.trim());
    await logger({
      action: "SEARCH",
      event_name: "SEARCH_PRODUCT",
      page: Page.salesMetrics,
      search_input: query,
    });
    await refetch();
  };

  const renderChart = (row: TableData) => (
    <ProductChart
      productId={row.productId}
      lastNDays={lastNDays}
      totalImpressions={row.impressions}
      totalOrders={row.orders}
      className={css(styles.chart)}
    />
  );

  const logTableActionClick = async (
    eventName: keyof typeof LogEventNames,
    { productId, index }: { productId: string; index: number }
  ) => {
    await logger({
      action: "ACTION_CLICK",
      event_name: eventName,
      page: Page.salesMetrics,
      product_id: productId,
      product_id_position: index,
    });
  };

  const tableActions = (productId: string, index: number) => [
    {
      href: "/product",
      onClick: async () =>
        await logTableActionClick("EDIT_PRODUCT_LISTING", { productId, index }),
      key: "editProduct",
      text: i`Edit product listing`,
      canApplyToRow: () => true,
      openInNewTab: true,
    },
    ...(isApproved
      ? [
          {
            href: `/product-boost/v2/create?product_id=${productId}`,
            onClick: async () =>
              await logTableActionClick("CREATE_PB_CAMPAIGN", {
                productId,
                index,
              }),
            key: "productBoost",
            text: i`Create ProductBoost campaign`,
            canApplyToRow: () => true,
            openInNewTab: true,
          },
        ]
      : []),
    ...(priceDropEnabled
      ? [
          {
            href: "/marketplace/price-drop/create-campaign",
            onClick: async () =>
              await logTableActionClick("CREATE_PD_CAMPAIGN", {
                productId,
                index,
              }),
            key: "priceDrop",
            text: i`Create Price Drop campaign`,
            canApplyToRow: () => true,
            openInNewTab: true,
          },
        ]
      : []),
    {
      href: `/product/profile/${productId}`,
      key: "viewProductPerformance",
      text: i`View Product Performance`,
      canApplyToRow: () => true,
      openInNewTab: true,
    },
  ];

  return (
    <Card className={css(styles.root, className, style)}>
      <Layout.FlexColumn alignItems="stretch">
        <div className={css(styles.filters)}>
          <div className={css(styles.filterLeft)}>
            <FormSelect
              options={[7, 30, 90].map((dayCount) => ({
                value: dayCount.toString(),
                text: i`Last ${dayCount} days`,
              }))}
              selectedValue={lastNDays.toString()}
              onSelected={onSelectLastNDays}
              className={css(styles.field)}
            />
            <TextInputWithSelect
              selectProps={{
                onSelected: (value: ProductSearchType) =>
                  setSearchTypeQuery(value),
                options: [
                  {
                    text: i`Product name`,
                    value: "NAME",
                  },
                  {
                    text: i`SKU`,
                    value: "SKU",
                  },
                  {
                    text: i`Product ID`,
                    value: "ID",
                  },
                ],
                selectedValue: searchType,
              }}
              textInputProps={{
                placeholder: i`Search`,
                icon: searchImg,
                onChange: async ({ text }) => await onSearchInputChange(text),
              }}
            />
          </div>
          <div className={css(styles.filterRight)}>
            <PageIndicator
              onPageChange={onPageChange}
              hasPrev={pageOffset != 0}
              hasNext={
                totalProducts
                  ? pageOffset + productsPerPage < totalProducts
                  : false
              }
              rangeStart={pageOffset + 1}
              rangeEnd={
                totalProducts
                  ? Math.min(totalProducts, pageOffset + productsPerPage)
                  : 0
              }
              totalItems={totalProducts}
              currentPage={Math.ceil(pageOffset / productsPerPage)}
              className={css(styles.field)}
            />
            <FormSelect
              options={[5, 10, 50].map((v) => ({
                value: v.toString(),
                text: v.toString(),
              }))}
              selectedValue={productsPerPage.toString()}
              onSelected={onSelectProductsPerPage}
              style={{ maxWidth: 50 }}
            />
          </div>
        </div>
        <LoadingIndicator loadingComplete={!loading}>
          <Table
            data={productsList}
            rowExpands={() => true}
            expandedRows={Array.from(expandedRows)}
            renderExpanded={(row) => renderChart(row)}
            onRowExpandToggled={onRowExpandToggled}
            cellPadding="80px 0px"
            rowHeight={60}
            noDataMessage={i`No Products Found`}
          >
            <ProductColumn
              title={i`Product`}
              columnKey="id"
              align="left"
              showFullName={false}
            />
            <Table.ObjectIdColumn columnKey="productId" title={i`Product ID`} />
            <Table.Column
              title={i`Price`}
              columnKey="variations"
              align="left"
              minWidth={70}
            >
              {({ value }) => <ProductsPriceRange variations={value} />}
            </Table.Column>
            <Table.Column columnKey="gmv" title={i`GMV`} />
            <Table.Column columnKey="orders" title={i`Orders`} />
            <Table.Column columnKey="impressions" title={i`Impressions`} />
            <Table.Column columnKey="actions" title={i`Actions`} width={100}>
              {({ index, value }: CellInfo<string, TableData>) => (
                <MultiSecondaryButton
                  actions={tableActions(value, index)}
                  visibleButtonCount={0}
                  dropDownPosition="bottom center"
                  dropDownContentWidth={255}
                />
              )}
            </Table.Column>
          </Table>
        </LoadingIndicator>
      </Layout.FlexColumn>
    </Card>
  );
};

const useStylesheet = () => {
  const { borderPrimary, pageBackground } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        chart: {
          flex: 1,
          border: `1px ${borderPrimary} solid`,
          borderRadius: 4,
          margin: 24,
          paddingLeft: 24,
        },
        tableExpand: {
          backgroundColor: pageBackground,
        },
        separator: {
          borderTop: `1px ${borderPrimary} solid`,
        },
        filters: {
          padding: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "@media (max-width: 1024px)": {
            flexDirection: "column",
            justifyContent: "center",
          },
        },
        filterLeft: {
          display: "flex",
          justifyContent: "flex-start",
          "@media (max-width: 1024px)": {
            flexDirection: "column",
            justifyContent: "center",
            ":nth-child(1n) > *": {
              marginBottom: 8,
            },
          },
        },
        filterRight: {
          display: "flex",
          justifyContent: "flex-end",
          "@media (max-width: 1024px)": {
            justifyContent: "space-around",
            ":nth-child(2n) > *": {
              marginLeft: 8,
            },
          },
        },
        field: {
          marginRight: 8,
          "@media (max-width: 1024px)": {
            marginRight: 0,
          },
        },
      }),
    [borderPrimary, pageBackground]
  );
};

export default observer(ProductsMetricsTable);
