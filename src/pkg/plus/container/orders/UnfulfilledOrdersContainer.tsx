/*
 *
 * UnfulfilledOrdersContainer.tsx
 * Merchant Plus
 *
 * Created by Sola Ogunsakin on 5/16/2020, 4:35:30 PM
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import PageRoot from "@plus/component/nav/PageRoot";
import PageGuide from "@plus/component/nav/PageGuide";
import PlusWelcomeHeader from "@plus/component/nav/PlusWelcomeHeader";
import { Popover } from "@merchant/component/core";
import {
  Card,
  Button,
  Layout,
  SortOrder,
  FilterButton,
  SimpleSelect,
  PageIndicator,
  LoadingIndicator,
  RowSelectionArgs,
  TextInputWithSelect,
  MultiSecondaryButton,
} from "@ContextLogic/lego";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
  useStringArrayQueryParam,
} from "@toolkit/url";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import UnfulfilledOrdersTable from "@plus/component/orders/unfulfilled/UnfulfilledOrdersTable";
import UnfulfilledOrdersFilter from "@plus/component/orders/unfulfilled/UnfulfilledOrdersFilter";
import InsightsRow from "@plus/component/orders/unfulfilled/insights/InsightsRow";
import EmptyState from "@plus/component/orders/unfulfilled/EmptyState";
import GenerateTestOrdersModal from "@plus/component/orders/unfulfilled/generate-test-orders/GenerateTestOrdersModal";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* SVGs */
import searchImg from "@assets/img/search.svg";

import { useQuery } from "@apollo/react-hooks";

import { useApolloStore } from "@merchant/stores/ApolloStore";
import { useEnvironmentStore } from "@merchant/stores/EnvironmentStore";
import {
  ActionRequiredSort,
  ActionRequiredSearchType,
  FulfillmentSchemaActionRequiredOrdersArgs,
  FulfillmentSchemaActionRequiredOrderCountArgs,
} from "@schema/types";
import {
  OrderType,
  InitialData,
  Placeholders,
  SearchOptions,
  SearchOptionsForAdmin,
  GetOrdersResponseType,
  GetOrderCountResponseType,
  GET_ACTION_REQUIRED_COUNT,
  GET_ACTION_REQUIRED_ORDERS,
} from "@toolkit/orders/unfulfilled-orders";

import { useRequestCSVEmail } from "@toolkit/orders/bulk-fulfill";

const InputHeight = 30;
const FilterWidth = 200;

type Props = {
  readonly initialData: InitialData;
};

const UnfulfilledOrdersContainer: React.FC<Props> = (props: Props) => {
  const { initialData } = props;
  const { isProd } = useEnvironmentStore();

  const {
    currentUser: { uiState },
    platformConstants: { countriesWeShipTo },
    su,
  } = initialData;
  const isSuAdmin = su?.isAdmin;

  const [query, setQuery] = useStringQueryParam("q");
  const [rawLimit, setLimit] = useIntQueryParam("limit");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [filters] = useStringArrayQueryParam("filters");
  const [dateOrderOrder, setDateSortOrder] = useStringEnumQueryParam<SortOrder>(
    "sort",
    "not-applied"
  );
  const [searchType, setSearchType] = useStringEnumQueryParam<
    ActionRequiredSearchType
  >("search_type", "ORDER_ID");
  const [selectedRowIndices, setSelectedRowIndices] = useState<Set<number>>(
    new Set()
  );
  const debouncedQuery = useDebouncer(query, 800);

  const offset = rawOffset || 0;
  const limit = rawLimit || 10;

  const sort = useMemo((): ActionRequiredSort | null => {
    if (dateOrderOrder == "asc") {
      return { field: "RELEASED_TIME", order: "ASC" };
    }
    if (dateOrderOrder == "desc") {
      return { field: "RELEASED_TIME", order: "DESC" };
    }
    return null;
  }, [dateOrderOrder]);

  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;
  const { nonBatchingClient } = useApolloStore();
  const wishExpressFilter = filters.includes("wish_express") ? true : undefined;
  const { data: ordersData, loading: ordersLoading } = useQuery<
    GetOrdersResponseType,
    FulfillmentSchemaActionRequiredOrdersArgs
  >(GET_ACTION_REQUIRED_ORDERS, {
    variables: {
      offset,
      limit,
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      sort,
      wishExpress: wishExpressFilter,
    },
    fetchPolicy: "no-cache",
  });

  const { data: orderCountData, loading: orderCountLoading } = useQuery<
    GetOrderCountResponseType,
    FulfillmentSchemaActionRequiredOrderCountArgs
  >(GET_ACTION_REQUIRED_COUNT, {
    client: nonBatchingClient,
    variables: {
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      wishExpress: wishExpressFilter,
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

  const orders = ordersData?.fulfillment.actionRequiredOrders ?? [];
  const tableCSVUrl = ordersData?.fulfillment.actionRequiredOrdersCsvUrl;
  const orderCount = ordersData?.fulfillment.actionRequiredOrders.length ?? 0;
  const totalOrderCount = orderCountData?.fulfillment.actionRequiredOrderCount;
  const disableInputs = ordersData == null;
  const hasActiveFilters = filters.length > 0;

  const searchOrderIdDebugValue: string | undefined =
    orders != null && orders.length > 0 ? orders[0].id : undefined;
  const searchProductIdDebugValue: string | undefined =
    orders != null && orders.length > 0 ? orders[0].productId : undefined;
  const searchDebugValues: {
    [searchType in ActionRequiredSearchType]: string | undefined;
  } = {
    ORDER_ID: searchOrderIdDebugValue,
    PRODUCT_ID: searchProductIdDebugValue,
    TRACKING_NUMBER: undefined,
    USER_NAME: undefined,
    TRANSACTION_ID: undefined,
  };

  const showEmptyState =
    searchQuery == null &&
    !hasActiveFilters &&
    !ordersLoading &&
    totalOrderCount != null &&
    totalOrderCount == 0;

  const handleDownload = useRequestCSVEmail({
    input: {
      sort: { field: "RELEASED_TIME", order: "ASC" },
    },
  });

  const nonProdOptions = [
    {
      text: i`Generate orders`,
      onClick: async () => {
        new GenerateTestOrdersModal({ countriesWeShipTo }).render();
      },
    },
  ];

  const actions = (
    <>
      <MultiSecondaryButton
        actions={[
          {
            text: i`Download all orders as CSV`,
            onClick: async () => {
              await handleDownload();
            },
          },
          {
            text: i`Fulfill with CSV`,
            href: "/plus/orders/bulk-fulfill",
          },
          {
            text: i`View file status`,
            href: "/plus/orders/bulk-csv-fulfill-history",
          },
          ...(!isProd ? nonProdOptions : []),
        ]}
        dropDownPosition="bottom right"
        visibleButtonCount={2}
      >
        Bulk add
      </MultiSecondaryButton>
    </>
  );

  const body = showEmptyState ? (
    <EmptyState />
  ) : (
    <Card style={{ marginTop: 20 }}>
      <Layout.FlexColumn alignItems="stretch">
        <div className={css(styles.buttonsRow)}>
          <Layout.FlexRow>
            <TextInputWithSelect
              className={css(styles.input)}
              selectProps={{
                selectedValue: searchType,
                options: isSuAdmin ? SearchOptionsForAdmin : SearchOptions,
                onSelected(item: ActionRequiredSearchType) {
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
                  setOffset(0);
                  setQuery(text);
                  setSelectedRowIndices(new Set());
                  setSearchType(searchType);
                },
                style: { ...styles.selectTextInput },
                disabled: disableInputs,
                debugValue: searchDebugValues[searchType],
              }}
            />
            {tableCSVUrl != null && orders.length > 0 && (
              <Button href={tableCSVUrl} download>
                Export table as CSV
              </Button>
            )}
          </Layout.FlexRow>
          <div className={css(styles.filterControls)}>
            <PageIndicator
              className={css(styles.pageIndicator)}
              isLoading={ordersLoading || orderCountLoading}
              rangeStart={offset + 1}
              rangeEnd={Math.min(totalOrderCount ?? 0, offset + orderCount)}
              hasNext={
                totalOrderCount != null && offset + orderCount < totalOrderCount
              }
              hasPrev={offset > 0}
              currentPage={Math.ceil(offset / limit)}
              totalItems={totalOrderCount}
              onPageChange={onPageChange}
            />
            <SimpleSelect
              options={[10, 50, 100, 250].map((v) => ({
                value: v.toString(),
                text: v.toString(),
              }))}
              onSelected={(value: string) => {
                setLimit(parseInt(value));
                setSelectedRowIndices(new Set());
              }}
              style={styles.limitSelect}
              selectedValue={limit.toString()}
              disabled={disableInputs}
            />
            <Popover
              popoverContent={
                disableInputs
                  ? undefined
                  : () => (
                      <UnfulfilledOrdersFilter className={css(styles.filter)} />
                    )
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
          <UnfulfilledOrdersTable
            className={css(styles.table)}
            orders={orders || []}
            dateSortOrder={dateOrderOrder}
            onDateSortToggled={(newSort) => {
              setDateSortOrder(newSort);
              setOffset(0);
              setSelectedRowIndices(new Set());
            }}
            selectedRowIndices={Array.from(selectedRowIndices)}
            onRowSelectionToggled={onRowSelectionToggled}
            initialData={initialData}
          />
        )}
      </Layout.FlexColumn>
    </Card>
  );

  return (
    <PageRoot>
      <PlusWelcomeHeader
        title={i`Unfulfilled Orders`}
        actions={actions}
        relaxed
      />
      <PageGuide relaxed>
        <div className={css(styles.content)}>
          <InsightsRow {...uiState} style={{ marginBottom: 25 }} />
          {body}
        </div>
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
          maxWidth: "100%",
        },
        buttonsRow: {
          margin: 15,
          display: "flex",
          "@media (max-width: 836px)": {
            flexDirection: "column",
            alignItems: "stretch",
          },
          "@media (min-width: 836px)": {
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
          "@media (max-width: 836px)": {
            marginBottom: 20,
          },
          "@media (min-width: 836px)": {
            marginRight: 20,
            minWidth: 400,
          },
        },
        selectTextInput: {
          flex: 1,
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
      }),
    [ordersLoading]
  );
};

export default observer(UnfulfilledOrdersContainer);
