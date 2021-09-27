import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Table } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Token } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { weightMedium } from "@toolkit/fonts";

/* External Libraries */
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Merchant Components */
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CollectionsBoostApiCollection } from "@merchant/api/collections-boost";
import { ProductCatalogSchemaProductsArgs, ProductSchema } from "@schema/types";

const GET_PRODUCT_DATA = gql`
  query CollectionsBoostCollectionRowExpand_GetProductData($query: String!) {
    productCatalog {
      products(query: $query, searchType: ID) {
        id
        sku
      }
    }
  }
`;

type LightProduct = Pick<ProductSchema, "id" | "sku">;

type RequestType = Pick<
  ProductCatalogSchemaProductsArgs,
  "query" | "searchType"
>;

type ResponseType = {
  readonly productCatalog: {
    readonly products: ReadonlyArray<LightProduct>;
  };
};

type CollectionRowExpandProps = BaseProps & {
  readonly collection: CollectionsBoostApiCollection;
};

const CollectionsBoostCollectionRowExpand = (
  props: CollectionRowExpandProps
) => {
  const { className, collection } = props;
  const { products, search_queries: searchQueries } = collection;
  const styles = useStyleSheet();

  const productIds = products.map((p) => p.product_id).join(",");
  const { data, loading } = useQuery<ResponseType, RequestType>(
    GET_PRODUCT_DATA,
    { variables: { query: productIds } }
  );

  const lightProducts = data?.productCatalog.products || [];

  return (
    <div className={css(styles.root, className)}>
      <div className={css(styles.section)}>
        <div className={css(styles.title)}>Collection's Search Terms:</div>
        <div className={css(styles.searchQueries)}>
          {searchQueries.map((q) => (
            <Token
              className={css(styles.searchQuery)}
              key={`${collection.id}_${q.search_term}`}
            >
              {q.search_term}
            </Token>
          ))}
        </div>
      </div>

      <div className={css(styles.section)}>
        <div className={css(styles.title)}>Collection's Products:</div>
        <LoadingIndicator loadingComplete={!loading}>
          <Table
            data={lightProducts}
            rowHeight={65}
            highlightRowOnHover
            overflowY="scroll"
          >
            <ProductColumn title={i`Product Details`} columnKey="id" />
            <Table.Column title={i`SKU`} columnKey="sku" />
          </Table>
        </LoadingIndicator>
      </div>
    </div>
  );
};

export default CollectionsBoostCollectionRowExpand;

const useStyleSheet = () => {
  const { pageBackground, textBlack, textWhite } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          background: pageBackground,
          padding: "15px 20px",
        },
        title: {
          color: textBlack,
          fontSize: 20,
          fontWeight: weightMedium,
          marginBottom: 20,
        },
        section: {
          margin: "24px 24px 0px 24px",
        },
        searchQueries: {
          display: "flex",
          backgroundColor: textWhite,
          padding: "10px 15px",
        },
        searchQuery: {
          display: "flex",
          marginRight: 20,
        },
      }),
    [pageBackground, textBlack, textWhite]
  );
};
