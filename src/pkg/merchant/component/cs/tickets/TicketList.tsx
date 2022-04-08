import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useQuery } from "@apollo/client";

/* Lego Components */
import { css } from "@toolkit/styling";
import {
  H5,
  Layout,
  SortOrder,
  SimpleSelect,
  FilterButton,
  PageIndicator,
  LoadingIndicator,
  TextInputWithSelect,
} from "@ContextLogic/lego";

import searchImg from "@assets/img/search.svg";
import Popover from "@merchant/component/core/Popover";
import {
  useIntQueryParam,
  useStringQueryParam,
  useStringEnumQueryParam,
  useIntArrayQueryParam,
} from "@toolkit/url";
import { useTheme } from "@stores/ThemeStore";
import { useDebouncer } from "@ContextLogic/lego/toolkit/hooks";
import {
  Placeholders,
  SearchOptions,
  InputHeight,
  PageLimitOptions,
  GET_ORDER_TICKETS,
  GetOrderTicketsResponseType,
} from "@toolkit/cs/center";
import {
  TicketSearchType,
  TicketSortFieldType,
  CustomerSupportTicketType,
  CustomerSupportTicketState,
  CustomerSupportServiceSchemaTicketsArgs,
} from "@schema/types";

import TicketsTable from "./TicketsTable";
import TicketListFilter from "./TicketListFilter";
import { InitialData } from "@toolkit/cs/center";

type Props = {
  readonly title: string;
  readonly state: CustomerSupportTicketState;
  readonly type: CustomerSupportTicketType;
  readonly includeMissingTicketType?: boolean;
  readonly initialData: InitialData;
};

const TicketList: React.FC<Props> = ({
  state,
  type,
  title,
  includeMissingTicketType,
  initialData,
}: Props) => {
  const [query, setQuery] = useStringQueryParam("q");
  const [rawOffset, setOffset] = useIntQueryParam("offset");
  const [searchType, setSearchType] = useStringEnumQueryParam<TicketSearchType>(
    "search_type",
    "ID"
  );

  const [pageLimit, setPageLimit] = useIntQueryParam("limit");
  const [issueTypes] = useIntArrayQueryParam("issue_types");
  const [sortField, setSortField] =
    useStringEnumQueryParam<TicketSortFieldType>("sort_field");
  const [sortOrder, setSortOrder] = useStringEnumQueryParam<SortOrder>(
    "sort_order",
    "asc"
  );

  const debouncedQuery = useDebouncer(query, 800);
  const searchQuery = debouncedQuery.trim().length > 0 ? debouncedQuery : null;

  const offset = rawOffset || 0;
  const limit = pageLimit || PageLimitOptions[0];

  const onPageChange = (_nextPage: number) => {
    const nextPage = Math.max(0, _nextPage);
    setOffset(nextPage * limit);
  };

  const { data, loading: isLoading } = useQuery<
    GetOrderTicketsResponseType,
    CustomerSupportServiceSchemaTicketsArgs
  >(GET_ORDER_TICKETS, {
    variables: {
      offset,
      limit,
      states: [state],
      types: [type],
      includeMissingTicketType,
      query: searchQuery,
      searchType: searchQuery ? searchType : null,
      issueTypes: issueTypes ? issueTypes : undefined,
      sort:
        sortField && sortOrder
          ? { field: sortField, order: sortOrder == "asc" ? "ASC" : "DESC" }
          : undefined,
    },
    fetchPolicy: "no-cache",
  });

  const totalTicketCount = data?.cs.ticketCount;
  const tickets = data?.cs.tickets;
  const ticketCount = tickets?.length || 0;

  const styles = useStylesheet();

  const searchTicketIdDebugValue: string | undefined =
    tickets != null && tickets.length > 0 ? tickets[0].id : undefined;

  const searchUserNameDebugValue: string | undefined =
    tickets != null && tickets.length > 0 ? tickets[0].user.name : undefined;

  const searchDebugValues: {
    [searchType in TicketSearchType]: string | undefined;
  } = {
    PRODUCT_ID: undefined,
    ID: searchTicketIdDebugValue,
    TRANSACTION_ID: undefined,
    USER_NAME: searchUserNameDebugValue,
    ORDER_ID: undefined,
    SKU: undefined,
  };

  const hasActiveFilters = issueTypes != null && issueTypes.length > 0;
  const disableInputs =
    searchQuery == null && !hasActiveFilters && totalTicketCount == 0;

  return (
    <div className={css(styles.root)}>
      <H5>{title}</H5>
      <Layout.FlexRow className={css(styles.controlsRow)} alignItems="stretch">
        <TextInputWithSelect
          className={css(styles.search)}
          selectProps={{
            selectedValue: searchType,
            options: SearchOptions,
            onSelected(item: TicketSearchType) {
              setSearchType(item);
            },
          }}
          textInputProps={{
            icon: searchImg,
            placeholder: Placeholders[searchType],
            noDuplicateTokens: true,
            maxTokens: 1,
            value: query,
            height: InputHeight,
            onChange({ text }) {
              setQuery(text);
              setOffset(0);
              if (text.trim().length > 0) {
                setSearchType(searchType);
              }
            },
            debugValue: searchDebugValues[searchType],
          }}
        />
        <Layout.FlexRow>
          <PageIndicator
            style={css(styles.pageIndicator)}
            isLoading={isLoading}
            totalItems={totalTicketCount}
            rangeStart={offset + 1}
            rangeEnd={Math.min(totalTicketCount ?? 0, offset + ticketCount)}
            hasNext={
              totalTicketCount != null &&
              offset + ticketCount < totalTicketCount
            }
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
            disabled={disableInputs}
          />
          <Popover
            popoverContent={
              disableInputs
                ? undefined
                : () => <TicketListFilter initialData={initialData} />
            }
            position="bottom right"
          >
            <FilterButton
              className={css(styles.filterButton)}
              disabled={disableInputs}
              isActive={hasActiveFilters}
            />
          </Popover>
        </Layout.FlexRow>
      </Layout.FlexRow>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <TicketsTable
          className={css(styles.table)}
          state={state}
          tickets={tickets || []}
          lastUpdatedSortOrder={
            sortField == "LAST_UPDATE" ? sortOrder : undefined
          }
          createdTimeSortOrder={
            sortField == "CREATED_TIME" ? sortOrder : undefined
          }
          onSortOrderChange={(field: TicketSortFieldType, order: SortOrder) => {
            setSortField(field);
            setSortOrder(order);
            setOffset(0);
          }}
        />
      )}
    </div>
  );
};

export default observer(TicketList);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
        },
        controlsRow: {
          margin: "20px 0px",
          height: InputHeight,
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
          "@media (min-width: 900px)": {
            flexDirection: "row",
            justifyContent: "space-between",
          },
        },
        search: {
          flex: 1,
          "@media (min-width: 900px)": {
            maxWidth: 518,
          },
        },
        table: {},
        pageIndicator: {
          margin: "0 12px",
        },
        limitSelect: {
          height: "100%",
          width: 50,
          flex: 0,
        },
        filterPopover: {
          display: "flex",
          flexDirection: "column",
          padding: 20,
        },
        filterTitle: {
          color: textBlack,
          fontSize: 20,
          marginBottom: 20,
          cursor: "default",
          userSelect: "none",
        },
        filterButton: {
          marginLeft: 12,
          height: "100%",
          boxSizing: "border-box",
        },
      }),
    [textBlack]
  );
};
