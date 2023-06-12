import {
  CellInfo,
  H4,
  Layout,
  LoadingIndicator,
  SearchBox,
  SortOrder,
  Table,
  TableAction,
  Text,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n, cni18n } from "@core/toolkit/i18n";
import ProductCell from "./ProductCell";
import { SortByOrder, SortProductRatingField } from "@schema";
import {
  GQLSortOrder,
  LegoSortOrder,
  WSSAverageUserRatingQuery,
  WSSAverageUserRatingRequest,
  WSSAverageUserRatingResponse,
} from "@performance/migrated/toolkit/order-metrics";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import TableControl from "@core/components/TableControl";

type TableData = {
  readonly productId: string;
  readonly productName?: string | null;
  readonly productImg?: string | null;
  readonly ratingCount: number;
  readonly averageRating: number;
};

type Props = BaseProps & {
  readonly formatter: (metric: number) => string;
};

const UserRatingTable: React.FC<Props> = ({ style, className, formatter }) => {
  const styles = useStylesheet();

  const [sortField, setSortField] = useState<SortProductRatingField | null>(
    "AverageRating",
  );
  const [sortOrder, setSortOrder] = useState<SortByOrder | null>("DESC");
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");

  const { data, loading } = useQuery<
    WSSAverageUserRatingResponse,
    WSSAverageUserRatingRequest
  >(WSSAverageUserRatingQuery, {
    variables: {
      limit,
      offset,
      productIds: searchInput ? [searchInput] : undefined,
      sortField: sortOrder && sortField ? sortField : undefined,
      sortOrder: sortOrder && sortField ? sortOrder : undefined,
    },
  });

  const total =
    data?.currentMerchant?.wishSellerStandard.deepDive?.productRating
      .totalCount;

  const tableData =
    data?.currentMerchant?.wishSellerStandard.deepDive?.productRating.dataSlice.map<TableData>(
      (row) => {
        return {
          productName: row.productName,
          averageRating: row.averageRating,
          ratingCount: row.receivedRatings,
          productId: row.productId,
          productImg: row.productImageUrl,
        };
      },
    );

  const tableActions: ReadonlyArray<TableAction> = [
    {
      key: "feedback_view",
      name: i`View Product Feedback`,
      canBatch: false,
      canApplyToRow: () => true,
      href: ([row]: ReadonlyArray<TableData>) => {
        return `/product/profile/${row.productId}#tab=reviews`;
      },
      openInNewTab: true,
    },
  ];

  const onFieldSortToggled = (field: SortProductRatingField) => {
    return (legoSo: SortOrder) => {
      if (legoSo == "not-applied") {
        setSortField(null);
        setSortOrder(null);
      } else {
        setSortField(field);
        setSortOrder(GQLSortOrder[legoSo]);
      }
    };
  };

  const getSortOrderForField = (field: SortProductRatingField) => {
    return sortOrder && sortField === field
      ? LegoSortOrder[sortOrder]
      : "not-applied";
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      <H4>All rated products</H4>
      <Layout.FlexRow style={styles.tableSearch}>
        <SearchBox
          icon="search"
          placeholder={i`Search by Product ID`}
          tokenize
          noDuplicateTokens
          maxTokens={1}
          defaultValue={searchInput}
          onTokensChanged={({ tokens }) => {
            if (tokens.length > 0) {
              setSearchInput(tokens[0].trim());
            } else {
              setSearchInput("");
            }
            setOffset(0);
          }}
        />
      </Layout.FlexRow>
      <LoadingIndicator loadingComplete={!loading}>
        <Table
          data={tableData}
          actions={tableActions}
          actionColumnWidth={250}
          keepColumnHeaderVisible
          rowDataCy={(row: TableData) => `rated-product-row-${row.productId}`}
        >
          <Table.Column
            _key="product"
            columnKey="productId"
            title={ci18n("Column name, shows product name and ID", "Product")}
            columnDataCy={"product-column"}
          >
            {({ row }: CellInfo<React.ReactNode, TableData>) => {
              return (
                <ProductCell
                  id={row.productId}
                  name={row.productName}
                  imgURL={row.productImg}
                />
              );
            }}
          </Table.Column>
          <Table.Column
            _key="ratingCount"
            columnKey="ratingCount"
            description={
              i`Wish uses ratings from orders that matured during the evaluation period ` +
              i`for this metric. We may exclude ratings and reviews that violate our policies.`
            }
            title={i`Number of Ratings`}
            columnDataCy={"rating-count-column"}
          />
          <Table.Column
            _key="averageRating"
            columnKey="averageRating"
            title={i`Average Product Rating`}
            sortOrder={getSortOrderForField("AverageRating")}
            onSortToggled={onFieldSortToggled("AverageRating")}
            columnDataCy={"average-rating-column"}
          >
            {({ row }: CellInfo<React.ReactNode, TableData>) => {
              return (
                <Text>
                  {cni18n(
                    "Average rating of orders for a given product",
                    row.averageRating,
                    "1 star",
                    "{%2=star rating} stars",
                    formatter(row.averageRating),
                  )}
                </Text>
              );
            }}
          </Table.Column>
        </Table>
      </LoadingIndicator>
      <TableControl
        limit={limit}
        offset={offset}
        total={total}
        onLimitChange={(limit) => setLimit(limit)}
        onOffsetChange={(offset) => setOffset(offset)}
        style={{ paddingBottom: "0px" }}
      />
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        tableSearch: {
          marginTop: 16,
          marginBottom: 24,
        },
      }),
    [],
  );
};

export default observer(UserRatingTable);
