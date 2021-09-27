import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { LoadingIndicator, Text } from "@ContextLogic/lego";
import { PageIndicator } from "@ContextLogic/lego";
import { TextInputWithSelect } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { search as searchImg } from "@assets/icons";
import { useTheme } from "@merchant/stores/ThemeStore";
import * as fonts from "@toolkit/fonts";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import { useIntQueryParam, useStringQueryParam } from "@toolkit/url";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Merchant API */
import * as collectionsBoostApi from "@merchant/api/collections-boost";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import { EligibleProductsSearchType } from "@merchant/api/collections-boost";
import { LightProductDict } from "@merchant/api/product";
import { CellInfo } from "@ContextLogic/lego";
import { RowSelectionArgs } from "@ContextLogic/lego";
import { EligibleProduct } from "@merchant/api/product-boost";

const PageSize = 20;

type CollectionsProductsTableProps = BaseProps & {
  readonly selectedProducts: ReadonlyArray<LightProductDict>;
  readonly setSelectedProducts: (ps: ReadonlyArray<LightProductDict>) => void;
};

const CollectionsProductsTable = (props: CollectionsProductsTableProps) => {
  const styles = useStylesheet();
  const { selectedProducts, setSelectedProducts, className } = props;
  const [selectedRows, setSelectedRows] = useState(new Set<number>([]));

  const [currentOffsetArg, setCurrentOffsetArg] = useIntQueryParam("offset");
  const [searchOption, setSearchOption] = useStringQueryParam(
    "search_type",
    "id"
  );
  const [searchValue, setSearchValue] = useStringQueryParam("q", "");
  const debouncedSearchValue = useDebouncer(searchValue, 500);

  const currentOffset = currentOffsetArg || 0;

  // Hacky way to cast searchOption to type `EligibleProductsSearchType`
  const searchOptionParam: EligibleProductsSearchType = searchOption as any;

  const [eligibleProductsResponse] = useRequest(
    collectionsBoostApi.getCollectionsBoostEligibleProducts({
      count: PageSize,
      start: currentOffset,
      search_type: searchOptionParam,
      search_query: debouncedSearchValue,
    })
  );

  const eligibleProducts = eligibleProductsResponse?.data?.rows || [];

  const hasNext = !eligibleProductsResponse?.data?.feed_ended || false;

  const finishLoading = !!eligibleProductsResponse?.data;

  const currentEnd = currentOffset + PageSize;

  const onPageChange = (nextPage: number) => {
    nextPage = Math.max(0, nextPage);
    setCurrentOffsetArg(nextPage * PageSize);
  };

  const tableActions = [
    {
      key: "add",
      name: () => {
        return i`Add Product(s)`;
      },
      canBatch: true,
      canApplyToRow: (product: LightProductDict) =>
        !selectedProducts.some((p) => p.id === product.id) &&
        product.eligible_for_campaign === true,
      apply: (products: ReadonlyArray<LightProductDict>) => {
        setSelectedProducts([...selectedProducts, ...products]);
        setSelectedRows(new Set());
      },
    },
  ];

  const renderPageIndicator = () => {
    return (
      <PageIndicator
        className={css(styles.pageIndicator)}
        rangeStart={currentOffset + 1}
        rangeEnd={currentEnd}
        hasNext={hasNext}
        hasPrev={currentOffset >= PageSize}
        currentPage={currentOffset / PageSize}
        onPageChange={onPageChange}
      />
    );
  };

  const renderSearchBar = () => {
    return (
      <TextInputWithSelect
        selectProps={{
          options: [
            {
              value: "id",
              text: i`Product IDs`,
            },
            {
              value: "name",
              text: i`Product Name`,
            },
            {
              value: "sku",
              text: i`Product SKU`,
            },
          ],
          onSelected: (value: EligibleProductsSearchType) => {
            setSearchOption(value);
            if (searchValue.trim().length === 0) {
              return;
            }
            setCurrentOffsetArg(0);
          },
          selectedValue: searchOption as EligibleProductsSearchType,
        }}
        textInputProps={{
          icon: searchImg,
          focusOnMount: false,
          value: searchValue,
          onChange: ({ text }: OnTextChangeEvent) => {
            setSearchValue(text);
            setCurrentOffsetArg(0);
          },
          style: { minWidth: "25vw" },
        }}
      />
    );
  };

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.topControls)}>
        <div className={css(styles.searchContainer)}>{renderSearchBar()}</div>
        <div className={css(styles.controllerGroup)}>
          {renderPageIndicator()}
        </div>
      </div>
      <Alert
        className={css(styles.suggestionMessage)}
        text={i`You can enter up to ${50} comma-separated product IDs to search for multiple products.`}
        sentiment="positive"
      />
      <div className={css(styles.tableContainer)}>
        <LoadingIndicator loadingComplete={finishLoading}>
          <Table
            data={eligibleProducts}
            fixLayout
            overflowY="visible"
            highlightRowOnHover
            rowHeight={68}
            actions={tableActions}
            selectedRows={Array.from(selectedRows)}
            onRowSelectionToggled={({
              index,
              selected,
            }: RowSelectionArgs<EligibleProduct>) => {
              if (selected) {
                selectedRows.add(index);
              } else {
                selectedRows.delete(index);
              }
              setSelectedRows(new Set(selectedRows));
            }}
          >
            <ProductColumn
              showProductId
              title={i`Product ID`}
              columnKey="id"
              align="left"
              width={300}
            />
            <Table.Column
              columnKey="name"
              title={i`Product name`}
              noDataMessage={"\u2014"}
            >
              {({ value }: CellInfo<string, string>) => (
                <Text style={styles.productName}>{value}</Text>
              )}
            </Table.Column>
            <Table.Column
              columnKey="parent_sku"
              title={i`Parent SKU`}
              noDataMessage={"\u2014"}
            />
          </Table>
        </LoadingIndicator>
      </div>
    </div>
  );
};

export default observer(CollectionsProductsTable);

const useStylesheet = () => {
  const { pageBackground, primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        topControls: {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          marginTop: 25,
          ":nth-child(1n) > *": {
            marginLeft: 25,
          },
        },
        searchContainer: {
          border: `1px solid ${pageBackground}`,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        filterContainer: {
          display: "flex",
        },
        filterCheckbox: {
          marginRight: 25,
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
        tableContainer: {
          // Workaround for search type being cut off
          minHeight: 300,
        },
        tableButton: {
          marginLeft: 8,
          fontSize: 14,
          textAlign: "left",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          wordWrap: undefined,
          overflow: "hidden",
          textDecoration: undefined,
        },
        tableProductName: {
          fontSize: 14,
          color: primary,
          fontWeight: fonts.weightSemibold,
          lineHeight: 1.43,
          cursor: "pointer",
        },
        suggestionMessage: {
          margin: 10,
          fontSize: 14,
        },
        productName: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          width: "100%",
        },
      }),
    [pageBackground, primary]
  );
};
