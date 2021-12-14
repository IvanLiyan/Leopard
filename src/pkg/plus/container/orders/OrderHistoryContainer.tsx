/*
 *
 * OrderHistoryContainer.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/16/2020, 4:35:30 PM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useState, useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Button,
  H4,
  Layout,
  SimpleSelectOption as Option,
  TextInput,
} from "@ContextLogic/lego";
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import {
  FilterButton,
  PageIndicator,
  LoadingIndicator,
  TextInputWithSelect,
} from "@ContextLogic/lego";
import EmptyState from "@plus/component/orders/unfulfilled/EmptyState";
import { Popover } from "@merchant/component/core";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
  useStringArrayQueryParam,
} from "@toolkit/url";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import OrderHistoryTable, {
  OrderType,
} from "@plus/component/orders/order-history/OrderHistoryTable";

import { SimpleSelect } from "@ContextLogic/lego";

import { SortOrder } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* SVGs */
import searchImg from "@assets/img/search.svg";

import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { RowSelectionArgs } from "@ContextLogic/lego";
import OrderHistoryFilter from "@plus/component/orders/order-history/OrderHistoryFilter";
import { useApolloStore } from "@stores/ApolloStore";
import {
  OrderHistorySort,
  FulfillmentSchema,
  OrderHistorySearchType,
  CommerceTransactionState,
  FulfillmentSchemaOrdersArgs,
  FulfillmentSchemaOrdersCountArgs,
} from "@schema/types";
import { useNavigationStore } from "@stores/NavigationStore";

const GET_ORDER_HISTORY = gql`
  query OrderHistoryContainer_GetOrderHistory(
    $offset: Int!
    $limit: Int!
    $query: String
    $searchType: OrderHistorySearchType
    $states: [CommerceTransactionState!]
    $sort: OrderHistorySort
    $wishExpress: Boolean
  ) {
    fulfillment {
      orders(
        offset: $offset
        limit: $limit
        query: $query
        searchType: $searchType
        states: $states
        sort: $sort
        wishExpress: $wishExpress
      ) {
        id
        state
        paymentStatus
        productId
        releasedTime {
          formatted(fmt: "%m/%d/%Y")
        }
        totalCost {
          display
        }
        hoursLeftToFulfill
        shippingDetails {
          name
        }
        quantity
        canRefund
        requiresConfirmedDelivery
        isWishExpress
        deliveryDeadline {
          mmddyyyy
        }
      }
    }
  }
`;

const GET_ORDER_HISTORY_COUNT = gql`
  query OrderHistoryContainer_GetOrderHistoryCount(
    $query: String
    $searchType: OrderHistorySearchType
    $states: [CommerceTransactionState!]
    $wishExpress: Boolean
  ) {
    fulfillment {
      ordersCount(
        query: $query
        searchType: $searchType
        states: $states
        wishExpress: $wishExpress
      )
    }
  }
`;

type GetOrdersResponseType = {
  readonly fulfillment: {
    readonly orders: ReadonlyArray<OrderType>;
  };
};

type GetOrdersRequestType = FulfillmentSchemaOrdersArgs;

type GetOrderCountResponseType = {
  readonly fulfillment: Pick<FulfillmentSchema, "ordersCount">;
};

type GetOrderCountRequestType = FulfillmentSchemaOrdersCountArgs;

const DefaultStates: ReadonlyArray<CommerceTransactionState> = [
  "SHIPPED",
  "REFUNDED",
];

const SearchOptions: ReadonlyArray<Option<OrderHistorySearchType>> = [
  {
    value: "ORDER_ID",
    text: i`Order ID`,
  },
  {
    value: "PRODUCT_ID",
    text: i`Product ID`,
  },
];

const Placeholders: { [searchType in OrderHistorySearchType]: string } = {
  ORDER_ID: i`Enter an order id`,
  PRODUCT_ID: i`Enter a product id`,
  TRACKING_NUMBER: i`Enter a tracking number`,
  USER_NAME: i`Enter a user name`,
  DISPUTE_ID: i`Enter a dispute id`,
};

const InputHeight = 30;
const FilterWidth = 300;

type Props = Record<string, never>;

const OrderHistoryContainer: React.FC<Props> = () => {
  const [query, setQuery] = useStringQueryParam("q");
  const [rawLimit, setLimit] = useIntQueryParam("limit");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [states] = useStringArrayQueryParam("states");
  const [badges] = useStringArrayQueryParam("badges");
  const [dateOrderOrder, setDateSortOrder] = useStringEnumQueryParam<SortOrder>(
    "sort",
    "not-applied",
  );
  const [searchType, setSearchType] =
    useStringEnumQueryParam<OrderHistorySearchType>("search_type", "ORDER_ID");
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(
    new Set(),
  );

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;
  const offset = rawOffset || 0;
  const limit = rawLimit || 10;

  const sort = useMemo((): OrderHistorySort | null => {
    if (dateOrderOrder == "asc") {
      return { field: "ORDER_TIME", order: "ASC" };
    }
    if (dateOrderOrder == "desc") {
      return { field: "ORDER_TIME", order: "DESC" };
    }
    return null;
  }, [dateOrderOrder]);

  const { nonBatchingClient } = useApolloStore();

  const wishExpressFilter = badges.includes("wish_express") ? true : undefined;

  const { data: ordersData, loading: ordersLoading } = useQuery<
    GetOrdersResponseType,
    GetOrdersRequestType
  >(GET_ORDER_HISTORY, {
    variables: {
      offset,
      limit,
      sort,
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      wishExpress: wishExpressFilter,
      states:
        states.length == 0
          ? DefaultStates
          : (states as CommerceTransactionState[]),
    },
    fetchPolicy: "no-cache",
  });

  const { data: orderCountData } = useQuery<
    GetOrderCountResponseType,
    GetOrderCountRequestType
  >(GET_ORDER_HISTORY_COUNT, {
    client: nonBatchingClient,
    variables: {
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      wishExpress: wishExpressFilter,
      states:
        states.length == 0
          ? DefaultStates
          : (states as CommerceTransactionState[]),
    },
    fetchPolicy: "no-cache",
  });

  const styles = useStylesheet({ ordersLoading });

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
    setSelectedRowIndices(new Set());
  };

  const onRowSelectionToggled = ({
    index,
    selected,
  }: RowSelectionArgs<OrderType>) => {
    if (selected) {
      selectedRowIndices.add(index);
    } else {
      selectedRowIndices.delete(index);
    }
    setSelectedRowIndices(new Set(selectedRowIndices));
  };

  const orders = ordersData?.fulfillment.orders || [];
  const orderCount = orders?.length ?? 0;
  const totalOrderCount = orderCountData?.fulfillment.ordersCount;
  const disableInputs = searchQuery == null && orderCount == 0;
  const hasActiveFilters = states.length > 0 || wishExpressFilter != null;

  const showEmptyState =
    searchQuery == null &&
    !hasActiveFilters &&
    !ordersLoading &&
    totalOrderCount != null &&
    totalOrderCount == 0;

  const searchOrderIdDebugValue: string | undefined =
    orders != null && orders.length > 0 ? orders[0].id : undefined;
  const searchProductIdDebugValue: string | undefined =
    orders != null && orders.length > 0 ? orders[0].productId : undefined;

  const searchDebugValues: {
    [searchType in OrderHistorySearchType]: string | undefined;
  } = {
    ORDER_ID: searchOrderIdDebugValue,
    PRODUCT_ID: searchProductIdDebugValue,
    TRACKING_NUMBER: undefined,
    USER_NAME: undefined,
    DISPUTE_ID: undefined,
  };

  const NextJSNavigationTestSection: React.FC = () => {
    const [sQuery, setSQuery] = useStringQueryParam("sq");
    const navStore = useNavigationStore();

    // TODO [lliepert]: debug why this page's queries aren't working

    return (
      <Layout.FlexColumn
        className={css({
          borderStyle: "solid",
          padding: 10,
          margin: 10,
        })}
      >
        <H4 style={{ marginBottom: 10 }}>Testing Section</H4>
        <TextInput
          placeholder="query here"
          value={sQuery}
          onChange={({ text }) => {
            setSQuery(text);
          }}
        />
        {sQuery}
        <Button
          onClick={() => navStore.navigate("/demo/create-size-chart-container")}
        >
          Navigate to Size Chart
        </Button>
        <TextInput />
      </Layout.FlexColumn>
    );
  };

  const body = showEmptyState ? (
    <EmptyState />
  ) : (
    <>
      <NextJSNavigationTestSection />
      <div className={css(styles.buttonsRow)}>
        <TextInputWithSelect
          className={css(styles.input)}
          selectProps={{
            selectedValue: searchType,
            options: SearchOptions,
            onSelected(item: OrderHistorySearchType) {
              setSearchType(item);
            },
            disabled: disableInputs,
          }}
          textInputProps={{
            icon: searchImg,
            placeholder: Placeholders[searchType],
            noDuplicateTokens: true,
            maxTokens: 1,
            value: query,
            onChange({ text }) {
              setQuery(text);
              setOffset(0);
              if (text.trim().length > 0) {
                setSearchType(searchType);
              } else {
                setSearchType(null);
              }
              setSelectedRowIndices(new Set());
            },
            style: { ...styles.selectTextInput },
            debugValue: searchDebugValues[searchType],
            disabled: disableInputs,
          }}
        />
        <div className={css(styles.filterControls)}>
          <PageIndicator
            className={css(styles.pageIndicator)}
            isLoading={ordersLoading}
            rangeStart={offset + 1}
            rangeEnd={
              totalOrderCount
                ? Math.min(totalOrderCount, offset + orderCount)
                : offset + orderCount
            }
            hasNext={
              totalOrderCount
                ? offset + orderCount < totalOrderCount
                : orderCount <= limit
            }
            hasPrev={offset > 0}
            currentPage={Math.ceil(offset / limit)}
            totalItems={totalOrderCount}
            onPageChange={onPageChange}
          />
          <SimpleSelect
            options={[10, 50, 100, 250, 500].map((v) => ({
              value: v.toString(),
              text: v.toString(),
            }))}
            onSelected={(value: string) => {
              setLimit(parseInt(value));
              setSelectedRowIndices(new Set());
            }}
            className={css(styles.limitSelect)}
            selectedValue={limit.toString()}
            disabled={disableInputs}
          />
          <Popover
            popoverContent={
              disableInputs
                ? undefined
                : () => <OrderHistoryFilter className={css(styles.filter)} />
            }
            position="bottom right"
            contentWidth={FilterWidth}
          >
            <FilterButton
              className={css(styles.filterButton)}
              disabled={disableInputs}
              isActive={hasActiveFilters}
            />
          </Popover>
        </div>
      </div>

      {ordersLoading ? (
        <LoadingIndicator />
      ) : (
        <OrderHistoryTable
          className={css(styles.table)}
          orders={orders}
          dateSortOrder={dateOrderOrder}
          onDateSortToggled={(newSort) => {
            setDateSortOrder(newSort);
            setOffset(0);
            setSelectedRowIndices(new Set());
          }}
          selectedRowIndeces={Array.from(selectedRowIndices)}
          onRowSelectionToggled={onRowSelectionToggled}
        />
      )}
    </>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader title={i`History`} />
      <PageGuide>
        <div className={css(styles.content)}>{body}</div>
      </PageGuide>
    </PageRoot>
  );
};

const useStylesheet = ({
  ordersLoading,
}: {
  readonly ordersLoading: boolean;
}) => {
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          paddingTop: 25,
        },
        buttonsRow: {
          marginBottom: 25,
          display: "flex",
          "@media (max-width: 988px)": {
            flexDirection: "column",
            alignItems: "stretch",
          },
          "@media (min-width: 988px)": {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        },
        filterControls: {
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          alignSelf: "stretch",
          justifyContent: "flex-end",
        },
        input: {
          height: InputHeight,
          "@media (max-width: 988px)": {
            marginBottom: 20,
          },
          "@media (min-width: 988px)": {
            marginRight: 20,
            width: "40%",
          },
        },
        pageIndicator: {
          height: InputHeight,
        },
        filterButton: {
          height: InputHeight,
        },
        filter: {
          width: FilterWidth,
        },
        table: {
          opacity: ordersLoading ? 0.7 : 1,
        },
        limitSelect: {
          margin: "0px 10px",
          flex: 0,
          minWidth: 60, // hack for Safari, which is having flexbox issues. TODO (lliepert): figure out the root cause
          textAlignLast: "center", // `last` required for <select>, see https://stackoverflow.com/questions/45215504/text-align-not-working-on-select-control-on-chrome/45215594
        },
        selectTextInput: {
          flex: 1,
        },
      }),
    [ordersLoading],
  );
};

export default observer(OrderHistoryContainer);
