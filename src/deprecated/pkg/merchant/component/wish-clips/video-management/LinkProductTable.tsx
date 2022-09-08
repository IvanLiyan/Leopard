import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";

/* Lego Components */
import {
  Layout,
  Text,
  Table,
  LoadingIndicator,
  PageIndicator,
  FormSelect,
  TextInputWithSelect,
  Option,
  CellInfo,
  PrimaryButton,
  Button,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";

/* Model */
import {
  PRODUCTS_QUERY,
  ProductsRequestData,
  ProductsResponseData,
  ProductsTableData,
} from "@toolkit/wish-clips/video-management";
import { ProductSearchType, SortOrderType } from "@schema/types";
import VideoCatalogState from "@merchant/model/products/VideoCatalogState";

const MAX_PRODUCTS_LINKABLE = 1;

type Props = BaseProps & {
  readonly state: VideoCatalogState;
  readonly isEdit?: boolean;
};

const SearchOptions: ReadonlyArray<Option<ProductSearchType>> = [
  {
    value: "NAME",
    text: i`Product name`,
  },
  {
    value: "SKU",
    text: i`SKU`,
  },
  {
    value: "ID",
    text: i`Product ID`,
  },
];

const SortOptions: ReadonlyArray<{
  readonly value: SortOrderType;
  readonly text: string;
}> = [
  {
    value: "DESC",
    text: i`From new to old`,
  },
  {
    value: "ASC",
    text: i`From old to new`,
  },
];

const LinkProductTable: React.FC<Props> = (props: Props) => {
  const { state, style, isEdit = false } = props;
  const styles = useStylesheet();

  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<ProductSearchType>("ID");
  const [sortOrder, setSortOrder] = useState<SortOrderType>("DESC");

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery =
    debouncedQuery && debouncedQuery.trim().length > 0 ? debouncedQuery : null;
  const limit = 20;

  const {
    data: allProductsData,
    loading: allProductsLoading,
    refetch: allProductsRefetch,
  } = useQuery<ProductsResponseData, ProductsRequestData>(PRODUCTS_QUERY, {
    variables: {
      limit,
      offset,
      sort: {
        order: sortOrder,
        field: "LAST_UPDATE",
      },
      ...(searchQuery
        ? {
            searchType,
            query: searchQuery,
          }
        : {}),
    },
  });

  const allProductsTable: ReadonlyArray<ProductsTableData> = (
    allProductsData?.productCatalog?.products || []
  ).map((product) => ({
    productName: product.name,
    productId: product.id,
    inventoryCount: product.totalInventory,
    productData: product,
  }));

  const linkedProductsTable: ReadonlyArray<ProductsTableData> = (
    state.linkedProducts || []
  ).map((product) => ({
    productName: product.name,
    productId: product.id,
    inventoryCount: product.totalInventory,
    productData: product,
  }));

  const onPageChange = async (currentPage: number) => {
    const nextPage = Math.max(0, currentPage);
    setOffset(nextPage * limit);
    allProductsRefetch();
  };

  const totalProducts = allProductsData?.productCatalog?.productCount || 0;

  const renderLinkButtons = ({
    row,
  }: CellInfo<ProductsTableData, ProductsTableData>) => {
    if (state.linkedProductIds.has(row.productId)) {
      return (
        <Button onClick={() => state.unlinkProduct(row.productId)}>
          Unlink
        </Button>
      );
    }
    return (
      <PrimaryButton
        onClick={() => state.linkProduct(row.productData)}
        isDisabled={state.linkedProductIds.size >= MAX_PRODUCTS_LINKABLE}
      >
        Link
      </PrimaryButton>
    );
  };

  return (
    <Layout.FlexColumn style={style}>
      <Layout.FlexColumn style={styles.row}>
        <Text style={styles.text}>
          Search and link 1 product to this video, so the viewer can buy
          directly while watching
        </Text>
        {isEdit && (
          <Text style={styles.smallText}>
            Please note that associating a new product to an existing video may
            require the video to be reviewed again by our Content Moderation
            Team to ensure that it is still in compliance
          </Text>
        )}
      </Layout.FlexColumn>

      {state.linkedProductIds.size > 0 && (
        <Layout.FlexColumn style={styles.linkedProducts}>
          <Table
            data={linkedProductsTable}
            noDataMessage={i`No linked products`}
          >
            <ProductColumn
              _key="productId"
              title={i`Product Info`}
              columnKey="productId"
              showFullName={false}
            />
            <Table.ObjectIdColumn
              _key="productIdString"
              columnKey="productId"
              title={i`Product ID`}
              showFull
              align="left"
            />
            <Table.Column
              _key="inventory"
              columnKey="inventoryCount"
              title={i`Inventory`}
              align="left"
            />
            <Table.Column _key="linking" columnKey="productId" align="center">
              {renderLinkButtons}
            </Table.Column>
          </Table>
        </Layout.FlexColumn>
      )}

      <Layout.FlexColumn style={styles.row}>
        <Layout.FlexRow
          justifyContent="space-between"
          style={[styles.rowItem, styles.tableControl]}
        >
          <Layout.FlexRow>
            <TextInputWithSelect
              style={styles.tableControlItem}
              selectProps={{
                style: styles.searchSelect,
                selectedValue: searchType,
                options: SearchOptions,
                onSelected(item: ProductSearchType) {
                  setSearchType(item);
                },
              }}
              textInputProps={{
                icon: "search",
                placeholder: i`Search`,
                value: query,
                onChange({ text }) {
                  setQuery(text);
                  setOffset(0);
                  setSearchType(searchType);
                },
              }}
            />
          </Layout.FlexRow>
          <Layout.FlexRow style={styles.tableControlRight}>
            <PageIndicator
              onPageChange={onPageChange}
              hasPrev={offset != 0}
              hasNext={totalProducts ? offset + limit < totalProducts : false}
              rangeStart={offset + 1}
              rangeEnd={
                totalProducts ? Math.min(totalProducts, offset + limit) : 0
              }
              totalItems={totalProducts}
              currentPage={Math.ceil(offset / limit)}
              style={styles.tableControlItem}
            />
            <FormSelect
              icon="sort"
              options={SortOptions}
              onSelected={(value: SortOrderType) => setSortOrder(value)}
              style={[styles.tableControlItem, styles.select]}
              selectedValue={sortOrder}
            />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <LoadingIndicator loadingComplete={!allProductsLoading}>
          <Table data={allProductsTable} noDataMessage={i`No products`}>
            <ProductColumn
              _key="productId"
              title={i`Product Info`}
              columnKey="productId"
              showFullName={false}
            />
            <Table.ObjectIdColumn
              _key="productIdString"
              columnKey="productId"
              title={i`Product ID`}
              showFull
              align="left"
            />
            <Table.Column
              _key="inventory"
              columnKey="inventoryCount"
              title={i`Inventory`}
              align="left"
            />
            <Table.Column _key="linking" columnKey="productId" align="center">
              {renderLinkButtons}
            </Table.Column>
          </Table>
        </LoadingIndicator>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { surfaceDarker } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        linkedProducts: {
          marginBottom: 24,
        },
        top: {
          marginTop: 16,
        },
        text: {
          size: 14,
        },
        smallText: {
          size: 12,
          color: surfaceDarker,
        },
        tableControl: {
          "@media (max-width: 900px)": {
            flexDirection: "column",
            flexAlign: "center",
          },
        },
        tableControlRight: {
          "@media (max-width: 900px)": {
            flexDirection: "column",
            flexAlign: "center",
          },
        },
        tableControlItem: {
          ":not(:last-child)": {
            marginRight: 16,
          },
          "@media (max-width: 900px)": {
            ":not(:last-child)": {
              marginRight: 0,
              marginBottom: 8,
            },
          },
        },
        searchSelect: {
          width: "50%",
        },
        select: {
          maxWidth: 200,
        },
        rowItem: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
      }),
    [surfaceDarker]
  );
};

export default observer(LinkProductTable);
