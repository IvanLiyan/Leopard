import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import numeral from "numeral";
import { useQuery } from "@apollo/client";

/* Lego Components */
import {
  Card,
  FormSelect,
  Table,
  SortOrder,
  Layout,
  TextInputWithSelect,
  PageIndicator,
  MultiSecondaryButton,
  CellInfo,
} from "@ContextLogic/lego";

/* Legacy */
import { ni18n } from "@core/toolkit/i18n";

/* Lego Toolkit */
import { css } from "@core/toolkit/styling";
import { useTheme } from "@core/stores/ThemeStore";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
} from "@core/toolkit/url";
import {
  GQLSortOrder,
  LegoSortOrder,
} from "@performance/migrated/toolkit/order-metrics";

/* Merchant Components */
import ProductColumn from "./ProductColumn";
import ProductsPriceRange from "./ProductsPriceRange";

/* Model */
import { PerformanceHealthInitialData } from "@performance/migrated/toolkit/stats";
import { ProductSearchType, SortByOrder } from "@schema";

/* Toolkit */
import { LogEventNames, Page } from "@performance/migrated/toolkit/constants";
import logger from "@performance/migrated/toolkit/logger";

/* Relative Imports */
import ProductChart from "./ProductChart";
import Skeleton from "@core/components/Skeleton";
import {
  PRODUCTS_METRICS_PERFORMANCE_TABLE_QUERY,
  ProductsMetricsPerformanceTableResponse,
  ProductsMetricsPerformanceTableRequest,
  PRODUCTS_METRICS_TABLE_COMPONENT_QUERY,
  ProductsMetricsTableComponentQueryResponse,
} from "@performance/api/productsMetricsTableQueries";
import SomethingWentWrongText from "@core/components/SomethingWentWrongText";
import debounce from "lodash/debounce";
import { PerformanceProductSortFiled } from "@schema";

type Props = BaseProps & {
  readonly initialData: PerformanceHealthInitialData;
};

const WithPerformanceProductsMetricsTable = (props: Props) => {
  const { className, style } = props;
  const styles = useStylesheet();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([]));
  const [pageOffsetQuery, setPageOffsetQuery] = useIntQueryParam("offset");
  const [searchTypeQuery, setSearchTypeQuery] =
    useStringEnumQueryParam<ProductSearchType>("search_type", "ID");
  const [productsPerPageQuery, setProductsPerPageQuery] =
    useIntQueryParam("limit");
  const [lastNDaysQuery, setLastNdaysQuery] = useIntQueryParam("days");
  const [searchQuery, setSearchQueryRaw] = useStringQueryParam("query");
  const [sortOrder, setSortOrder] = useState<SortByOrder>("DESC");
  const [sortField, setSortField] =
    useState<PerformanceProductSortFiled>("GMV");

  // there are no dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setSearchQuery = useCallback(debounce(setSearchQueryRaw, 300), []);

  const pageOffset = pageOffsetQuery || 0;
  const searchType = searchTypeQuery || "ID";
  const productsPerPage = productsPerPageQuery || 5;
  const lastNDays = lastNDaysQuery || 7;
  const query = searchQuery || null;

  const { data: componentData, loading: componentQueryLoading } =
    useQuery<ProductsMetricsTableComponentQueryResponse>(
      PRODUCTS_METRICS_TABLE_COMPONENT_QUERY,
    );

  const { data: tableData, loading: tableQueryLoading } = useQuery<
    ProductsMetricsPerformanceTableResponse,
    ProductsMetricsPerformanceTableRequest
  >(PRODUCTS_METRICS_PERFORMANCE_TABLE_QUERY, {
    variables: {
      offset: pageOffset,
      limit: productsPerPage,
      days: lastNDays,
      query,
      searchType: query ? searchType : undefined,
      withPerformance: true,
      sort: { order: sortOrder, field: sortField },
    },
    fetchPolicy: "no-cache",
  });

  if (componentQueryLoading) {
    return <Skeleton height={460} />;
  }

  if (componentData?.currentMerchant == null) {
    return <SomethingWentWrongText />;
  }

  const isApproved = componentData.currentMerchant.state === "APPROVED";

  const totalProducts =
    tableData == null
      ? null
      : tableData.productCatalog != null
      ? tableData.productCatalog.productCountV3
      : 0;

  const productsList =
    tableData?.productCatalog != null
      ? tableData.productCatalog.productsV3.map((product) => ({
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

  const onFieldSortToggled = (field: PerformanceProductSortFiled) => {
    return (legoSo: SortOrder) => {
      if (legoSo == "not-applied") {
        setSortField("GMV");
        setSortOrder("DESC");
      } else {
        setSortField(field);
        setSortOrder(GQLSortOrder[legoSo]);
      }
    };
  };

  const getSortOrderForField = (field: PerformanceProductSortFiled) => {
    return sortOrder && sortField === field
      ? LegoSortOrder[sortOrder]
      : "not-applied";
  };

  const onRowExpandToggled = (index: number, shouldExpand: boolean) => {
    if (shouldExpand) {
      logger({
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
    logger({
      action: "CLICK_DROPDOWN",
      event_name: "CHANGE_PRODUCTS_DISPLAY_NUMBER",
      page: Page.salesMetrics,
      old_value: productsPerPage,
      new_value: parseInt(value),
    });
    await setProductsPerPageQuery(parseInt(value));
  };

  const onSelectLastNDays = async (value: string) => {
    logger({
      action: "CLICK_DROPDOWN",
      event_name: "PRODUCTS_CHANGE_TIME_FRAME",
      page: Page.salesMetrics,
      old_value: lastNDays,
      new_value: parseInt(value),
    });
    await setLastNdaysQuery(parseInt(value));
  };

  const onPageChange = async (currentPage: number) => {
    const nextPage = Math.max(0, currentPage);
    logger({
      action: "CLICK",
      event_name: "NEXT_X_PRODUCTS",
      page: Page.salesMetrics,
      old_value: `${pageOffset + 1}-${Math.min(
        totalProducts || 0,
        pageOffset + productsPerPage,
      )} of ${totalProducts || 0}`,
      new_value: `${nextPage * productsPerPage + 1}-${Math.min(
        totalProducts || 0,
        nextPage * productsPerPage + productsPerPage,
      )} of ${totalProducts || 0}`,
    });
    await setPageOffsetQuery(nextPage * productsPerPage);
    setExpandedRows(new Set([]));
  };

  const onSearchInputChange = async (value: string) => {
    await setSearchQuery(value.trim());
    await setPageOffsetQuery(0);
    logger({
      action: "SEARCH",
      event_name: "SEARCH_PRODUCT",
      page: Page.salesMetrics,
      search_input: query,
    });
  };

  const renderChart = (row: typeof productsList[number]) => (
    <ProductChart
      productId={row.productId}
      lastNDays={lastNDays}
      totalImpressions={row.impressions}
      totalOrders={row.orders}
      className={css(styles.chart)}
    />
  );

  const logTableActionClick = (
    eventName: keyof typeof LogEventNames,
    { productId, index }: { productId: string; index: number },
  ) => {
    logger({
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
      onClick: () =>
        logTableActionClick("EDIT_PRODUCT_LISTING", { productId, index }),
      key: "editProduct",
      text: i`Edit product listing`,
      canApplyToRow: () => true,
      openInNewTab: true,
    },
    ...(isApproved
      ? [
          {
            href: `/product-boost/v2/create?product_id=${productId}`,
            onClick: () =>
              logTableActionClick("CREATE_PB_CAMPAIGN", {
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
        {tableQueryLoading ? (
          <Skeleton height={370} />
        ) : (
          <Table
            data={productsList}
            rowExpands={() => true}
            expandedRows={Array.from(expandedRows)}
            // migrated file where any's were allowed
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            renderExpanded={(row) => renderChart(row)}
            onRowExpandToggled={onRowExpandToggled}
            cellPadding="80px 0px"
            rowHeight={60}
            noDataMessage={i`No Products Found`}
            rowDataCy={(row: typeof productsList[number]) =>
              `product-metrics-row-${row.id}`
            }
          >
            <ProductColumn
              _key={"product"}
              title={ni18n(1, "Product", "Products")}
              columnKey="id"
              align="left"
              showFullName={false}
              columnDataCy={"product-column"}
            />
            <Table.ObjectIdColumn
              _key={"productId"}
              columnKey="productId"
              title={i`Product ID`}
              columnDataCy={"product-id-column"}
            />
            <Table.Column
              _key={"price"}
              title={i`Price`}
              columnKey="variations"
              align="left"
              minWidth={70}
              columnDataCy={"price-column"}
            >
              {({
                value,
              }: CellInfo<
                typeof productsList[number]["variations"],
                typeof productsList[number]
              >) => <ProductsPriceRange variations={value} />}
            </Table.Column>
            <Table.Column
              _key={"gmv"}
              columnKey="gmv"
              title={i`GMV`}
              columnDataCy={"gmv-column"}
              sortOrder={getSortOrderForField("GMV")}
              onSortToggled={onFieldSortToggled("GMV")}
            />
            <Table.Column
              _key={"orders"}
              columnKey="orders"
              title={i`Orders`}
              columnDataCy={"orders-column"}
              sortOrder={getSortOrderForField("ORDER")}
              onSortToggled={onFieldSortToggled("ORDER")}
            />
            <Table.Column
              _key={"impressions"}
              columnKey="impressions"
              title={i`Impressions`}
              columnDataCy={"impresssions-column"}
              sortOrder={getSortOrderForField("IMPRESSION")}
              onSortToggled={onFieldSortToggled("IMPRESSION")}
            />
            <Table.Column
              _key={"actions"}
              columnKey="actions"
              title={i`Actions`}
              width={100}
              columnDataCy={"actions-column"}
            >
              {({
                index,
                value,
              }: CellInfo<
                typeof productsList[number]["actions"],
                typeof productsList[number]
              >) => (
                <MultiSecondaryButton
                  actions={tableActions(value, index)}
                  visibleButtonCount={0}
                  dropDownPosition="bottom center"
                  dropDownContentWidth={255}
                />
              )}
            </Table.Column>
          </Table>
        )}
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
    [borderPrimary, pageBackground],
  );
};

export default observer(WithPerformanceProductsMetricsTable);
