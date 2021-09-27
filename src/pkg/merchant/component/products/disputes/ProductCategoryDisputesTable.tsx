import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

/* Lego Components */
import {
  FormSelect,
  Table,
  Layout,
  PageIndicator,
  CellInfo,
  IconButton,
  ThemedLabel,
  LoadingIndicator,
  Card,
  Popover,
  Text,
  TextInputWithSelect,
  TableAction,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  useIntQueryParam,
  useStringSetQueryParam,
  useStringQueryParam,
  wishURL,
} from "@toolkit/url";

/* Merchant Components */
import ProductCategoryDisputesFilter from "@merchant/component/products/disputes/ProductCategoryDisputesFilter";
import ProductColumn from "@merchant/component/products/columns/ProductColumn";

/* Model */
import {
  DisputeStatusLabel,
  DisputeStatusTheme,
  ProductCategoryDisputeResponseData,
  PickedProductCategoryDisputeSchema,
  getTopLevelTags,
} from "@toolkit/products/product-category-dispute";
import {
  ProductCategoryDisputeStatus,
  ProductCategoryDisputeHubDisputesArgs,
  ProductCategoryDisputeSearchType,
} from "@schema/types";

type Props = BaseProps & {
  readonly canReview: boolean;
};

// This is only used by admins
/* eslint-disable local-rules/unwrapped-i18n */
const SEARCH_OPTIONS: readonly {
  value: ProductCategoryDisputeSearchType;
  text: string;
}[] = [
  {
    value: "MERCHANT_ID",
    text: "Merchant",
  },
  {
    value: "DISPUTE_ID",
    text: "Dispute ID",
  },
  {
    value: "PRODUCT_ID",
    text: "Product ID",
  },
];
/* eslint-enable local-rules/unwrapped-i18n */

const PRODUCT_CATEGORY_DISPUTE_QUERY = gql`
  query ProductCatoryDispute_ProductCategoryDisputesTable(
    $offset: Int!
    $limit: Int!
    $states: [ProductCategoryDisputeStatus!]!
    $query: String
    $searchType: ProductCategoryDisputeSearchType
  ) {
    policy {
      productCategoryDispute {
        disputes(
          offset: $offset
          limit: $limit
          states: $states
          query: $query
          searchType: $searchType
        ) {
          id
          status
          product {
            id
          }
          merchant {
            displayName
            id
          }
          lastUpdate {
            formatted(fmt: "%b %d, %Y")
          }
          trueTagsDisputed: trueTags(state: DISPUTED) {
            id
            name
            topLevel {
              name
              id
            }
          }
          trueTagsApproved: trueTags(state: APPROVED) {
            id
            name
            topLevel {
              name
              id
            }
          }
        }
        disputeCount(states: $states, query: $query, searchType: $searchType)
      }
    }
  }
`;

type TableData = {
  readonly date: string;
  readonly disputeId: string;
  readonly product: {
    readonly id: string;
  };
  readonly merchant: {
    readonly id: string;
    readonly displayName: string;
  };
  readonly productId: string;
  readonly trueTagsDisputed: PickedProductCategoryDisputeSchema["trueTagsDisputed"];
  readonly trueTagsApproved: PickedProductCategoryDisputeSchema["trueTagsApproved"];
  readonly status: ProductCategoryDisputeStatus;
};

const ProductCategoryDisputesTable = (props: Props) => {
  const { className, style, canReview } = props;
  const styles = useStylesheet();

  const [offsetQuery, setOffsetQuery] = useIntQueryParam("offset");
  const [limitQuery, setLimitQuery] = useIntQueryParam("limit");
  const [searchTypeQuery, setSearchTypeQuery] = useStringQueryParam(
    "search_type",
    "MERCHANT_ID"
  );
  const [query, setQuery] = useStringQueryParam("query");
  const [statesQuery, setStatesQuery] = useStringSetQueryParam<
    ProductCategoryDisputeStatus
  >("states");

  const offset = offsetQuery || 0;
  const limit = limitQuery || 10;
  const states = Array.from(statesQuery);

  const { data, loading, refetch } = useQuery<
    ProductCategoryDisputeResponseData,
    ProductCategoryDisputeHubDisputesArgs
  >(PRODUCT_CATEGORY_DISPUTE_QUERY, {
    variables: {
      offset,
      limit,
      states:
        states != null && states.length == 0
          ? ["PENDING_REVIEW", "RESOLVED_UPDATE", "RESOLVED_UNCHANGED"]
          : states,
      searchType:
        searchTypeQuery.trim() != ""
          ? (searchTypeQuery as ProductCategoryDisputeSearchType)
          : null,
      query: query.trim() != "" ? query : null,
    },
  });

  if (data?.policy.productCategoryDispute == null) {
    return null;
  }

  const dataList = (data.policy.productCategoryDispute?.disputes || []).map(
    (dispute) => ({
      date: dispute.lastUpdate.formatted,
      disputeId: dispute.id,
      product: dispute.product,
      merchant: dispute.merchant,
      productId: dispute.product.id,
      trueTagsDisputed: dispute.trueTagsDisputed,
      trueTagsApproved: dispute.trueTagsApproved,
      status: dispute.status,
    })
  );

  const totalItems = data.policy.productCategoryDispute.disputeCount || 0;

  const onPageChange = async (currentPage: number) => {
    const nextPage = Math.max(0, currentPage);
    setOffsetQuery(nextPage * limit);
    await refetch();
  };

  const onSearchInputChange = async (text: string) => {
    setQuery(text.trim());
    await refetch();
  };

  const tableActions: Array<TableAction> = [
    {
      key: "admin_review",
      name: i`Review`,
      canBatch: false,
      canApplyToRow: (row: TableData) =>
        canReview && row.status === "PENDING_REVIEW",
      href: ([row]: readonly TableData[]) =>
        `/review-product-category-dispute/${row.disputeId}`,
    },
    {
      key: "view_details",
      name: i`View details`,
      canBatch: false,
      canApplyToRow: (row: TableData) => true,
      href: ([row]: readonly TableData[]) =>
        `/product-category-dispute/${row.disputeId}`,
    },
  ];

  return (
    <Card className={css(className, style)}>
      <Layout.FlexRow
        justifyContent="space-between"
        className={css(styles.tableControls)}
      >
        <Layout.FlexRow>
          <Popover
            popoverContent={() => (
              <ProductCategoryDisputesFilter
                statesQuery={statesQuery}
                onSetStatesQuery={setStatesQuery}
                onSubmit={refetch}
                style={{ minWidth: 375 }}
              />
            )}
            position="bottom center"
            on="click"
            className={css(styles.rowButton)}
          >
            <IconButton icon="filter">Filter</IconButton>
          </Popover>
          {canReview && (
            <TextInputWithSelect
              selectProps={{
                onSelected: (value: string) => setSearchTypeQuery(value),
                options: SEARCH_OPTIONS,
                selectedValue: searchTypeQuery,
              }}
              textInputProps={{
                value: query,
                placeholder: i`Search`,
                onChange: async ({ text }) => await onSearchInputChange(text),
              }}
              className={css(styles.rowButton)}
            />
          )}
        </Layout.FlexRow>

        <Layout.FlexRow>
          <PageIndicator
            onPageChange={onPageChange}
            hasPrev={offset != 0}
            hasNext={totalItems ? offset + limit < totalItems : false}
            rangeStart={offset + 1}
            rangeEnd={totalItems ? Math.min(totalItems, offset + limit) : 0}
            totalItems={totalItems}
            currentPage={Math.ceil(offset / limit)}
            className={css(styles.rowButton)}
          />
          <FormSelect
            options={[10, 50, 100].map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            onSelected={(value: string) => setLimitQuery(parseInt(value))}
            style={{ maxWidth: 50, maxHeight: 30 }}
            selectedValue={limit.toString()}
            className={css(styles.rowButton)}
          />
        </Layout.FlexRow>
      </Layout.FlexRow>

      <LoadingIndicator loadingComplete={!loading}>
        <Table
          data={dataList}
          noDataMessage={i`No disputes`}
          actions={tableActions}
        >
          <Table.Column columnKey="date" title={i`Date submitted`} />
          {canReview && (
            <Table.LinkColumn
              title={`Merchant`}
              columnKey="merchant.id"
              href={({ row }: CellInfo<string, TableData>) =>
                wishURL(`/merchant/${row.merchant.id}`)
              }
              text={({ row }: CellInfo<string, TableData>) =>
                `${row.merchant.displayName}`
              }
              openInNewTab
            />
          )}
          <Table.ObjectIdColumn columnKey="disputeId" title={i`Dispute ID`} />
          <ProductColumn
            title={i`Product`}
            columnKey="product.id"
            align="left"
            showFullName={false}
          />

          <Table.ObjectIdColumn columnKey="productId" title={i`Product ID`} />

          <Table.Column
            columnKey="trueTagsDisputed"
            title={i`Disputed Category`}
            align="center"
          >
            {({ row }: CellInfo<string, TableData>) => (
              <>
                {row.trueTagsDisputed != null &&
                  row.trueTagsDisputed.length > 0 && (
                    <Text>{getTopLevelTags(row.trueTagsDisputed)}</Text>
                  )}
              </>
            )}
          </Table.Column>

          <Table.Column
            columnKey="trueTagsApproved"
            title={i`Updated Category`}
            align="center"
          >
            {({ row }: CellInfo<string, TableData>) => (
              <>
                {row.trueTagsApproved != null &&
                row.trueTagsApproved.length > 0 ? (
                  <Text>{getTopLevelTags(row.trueTagsApproved)}</Text>
                ) : (
                  "--"
                )}
              </>
            )}
          </Table.Column>

          <Table.Column columnKey="status" title={i`Status`} align="center">
            {({ row }: CellInfo<string, TableData>) => (
              <>
                {row.status != null && (
                  <ThemedLabel theme={DisputeStatusTheme[row.status]}>
                    {DisputeStatusLabel[row.status]}
                  </ThemedLabel>
                )}
              </>
            )}
          </Table.Column>
        </Table>
      </LoadingIndicator>
    </Card>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        tableControls: {
          padding: 24,
        },
        rowButton: {
          ":not(:last-child)": {
            marginRight: 12,
          },
        },
      }),
    []
  );
};

export default observer(ProductCategoryDisputesTable);
