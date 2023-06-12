import {
  CellInfo,
  H4,
  Layout,
  LoadingIndicator,
  SearchBox,
  SortOrder,
  Spinner,
  Table,
  TableAction,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ci18n } from "@core/toolkit/i18n";
import Flag from "@core/components/Flag";
import ProductCell from "./ProductCell";
import PopoverFilterButton from "./PopoverFilterButton";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import {
  CountryCode,
  SortByOrder,
  SortOrderTransactionDateField,
  WsssUnfulfilledReasons,
} from "@schema";
import {
  GQLSortOrder,
  LegoSortOrder,
  WSSDestinationOptionsQuery,
  WSSDestinationOptionsRequest,
  WSSDestinationOptionsResponse,
  WSSOrderFulfillmentRateQuery,
  WSSOrderFulfillmentRateRequest,
  WSSOrderFulfillmentRateResponse,
  WssUnfulfilledReasonLabel,
  WSSUnfulfilledReasonOptionsQuery,
  WSSUnfulfilledReasonOptionsResponse,
} from "@performance/migrated/toolkit/order-metrics";
import { css } from "@core/toolkit/styling";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import DestinationFilter from "./DestinationFilter";
import TableControl from "@core/components/TableControl";
import UnfulfilledReasonFilter from "./UnfulfilledReasonFilter";

type TableData = {
  readonly productName?: string | null;
  readonly productId: string;
  readonly productImg?: string | null;
  readonly orderId?: string | null;
  readonly transactionDate: string;
  readonly reason?: string | null;
  readonly destination?: string | null;
};

const OrderFulfillmentRateTable: React.FC<BaseProps> = ({
  style,
  className,
}) => {
  const styles = useStylesheet();
  const { locale } = useLocalizationStore();

  const [sortField, setSortField] =
    useState<SortOrderTransactionDateField | null>("TransactionDate");
  const [sortOrder, setSortOrder] = useState<SortByOrder | null>("DESC");
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>("");

  // null to select all
  const [destinations, setDestinations] =
    useState<ReadonlyArray<CountryCode> | null>(null);
  const [unfulfilledReasons, setUnfulfilledReasons] =
    useState<ReadonlyArray<WsssUnfulfilledReasons> | null>(null);

  const { data, loading } = useQuery<
    WSSOrderFulfillmentRateResponse,
    WSSOrderFulfillmentRateRequest
  >(WSSOrderFulfillmentRateQuery, {
    variables: {
      limit,
      offset,
      orderIds: searchInput ? [searchInput] : undefined,
      sortField: sortOrder && sortField ? sortField : undefined,
      sortOrder: sortOrder && sortField ? sortOrder : undefined,
      destinations,
      unfulfilledReasons,
    },
  });

  const {
    data: destinationOptionsData,
    loading: loadingDestinationOptionsData,
  } = useQuery<WSSDestinationOptionsResponse, WSSDestinationOptionsRequest>(
    WSSDestinationOptionsQuery,
    {
      variables: {
        pageType: "FULFILLMENT_RATE",
      },
      fetchPolicy: "no-cache",
    },
  );

  const destinationOptions = (destinationOptionsData?.currentMerchant
    ?.wishSellerStandard.deepDive?.destinations ??
    []) as ReadonlyArray<CountryCode>;

  const { data: reasonOptionsData, loading: loadingReasonOptionsData } =
    useQuery<WSSUnfulfilledReasonOptionsResponse, never>(
      WSSUnfulfilledReasonOptionsQuery,
      {
        fetchPolicy: "no-cache",
      },
    );

  const unfulfilledReasonOptions =
    reasonOptionsData?.currentMerchant?.wishSellerStandard.deepDive
      ?.unfulfilledReasons ?? [];

  const total =
    data?.currentMerchant?.wishSellerStandard.deepDive?.orderUnfulfilled
      .totalCount;

  const tableData =
    data?.currentMerchant?.wishSellerStandard.deepDive?.orderUnfulfilled.dataSlice.map<TableData>(
      (row) => {
        return {
          productName: row.productName,
          productId: row.productId || "",
          productImg: row.productImageUrl,
          orderId: row.orderId,
          transactionDate: new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }).format(new Date(row.transactionDate.unix * 1000)),
          reason: row.unfulfilledReason
            ? WssUnfulfilledReasonLabel[row.unfulfilledReason]
            : undefined,
          destination: row.destination,
        };
      },
    );

  const tableActions: ReadonlyArray<TableAction> = [
    {
      key: "order_details_view",
      name: i`View Order Details`,
      canBatch: false,
      canApplyToRow: () => true,
      href: ([row]: ReadonlyArray<TableData>) => {
        return `/order/${row.orderId}`;
      },
      openInNewTab: true,
    },
  ];

  const onFieldSortToggled = (field: SortOrderTransactionDateField) => {
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

  const getSortOrderForField = (field: SortOrderTransactionDateField) => {
    return sortOrder && sortField === field
      ? LegoSortOrder[sortOrder]
      : "not-applied";
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      <H4>All unfulfilled orders</H4>
      <Layout.FlexRow style={styles.tableSearch}>
        <SearchBox
          icon="search"
          placeholder={i`Search by Order ID`}
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
          rowDataCy={(row: TableData) => `unfulfilled-order-row-${row.orderId}`}
        >
          <Table.ObjectIdColumn
            _key="orderId"
            columnKey="orderId"
            title={ci18n("Column name, shows order ID", "Order ID")}
            columnDataCy={"order-id-column"}
          />
          <Table.Column
            _key="product"
            columnKey="productId"
            title={ci18n("Column name, shows product name and ID", "Product")}
            columnDataCy={"product-id-column"}
          >
            {({ row }: CellInfo<React.ReactNode, TableData>) => {
              return (
                <ProductCell
                  id={row.productId}
                  name={row.productName}
                  imgURL={row.productImg}
                  showFullId
                />
              );
            }}
          </Table.Column>
          <Table.Column
            _key="transactionDate"
            columnKey="transactionDate"
            title={ci18n(
              "Column name, transaction date of the order",
              "Transaction date",
            )}
            sortOrder={getSortOrderForField("TransactionDate")}
            onSortToggled={onFieldSortToggled("TransactionDate")}
            columnDataCy={"transaction-date-column"}
          />
          <Table.Column
            _key="reason"
            columnKey="reason"
            title={() => (
              <Layout.FlexRow>
                {ci18n(
                  "Column name, why the order was not fulfilled",
                  "Reason",
                )}
                <PopoverFilterButton
                  isActive={
                    !!unfulfilledReasons &&
                    !!unfulfilledReasonOptions &&
                    unfulfilledReasons.length < unfulfilledReasonOptions.length
                  }
                  count={unfulfilledReasons?.length}
                  popoverContent={() =>
                    loadingReasonOptionsData ? (
                      <Spinner />
                    ) : (
                      <UnfulfilledReasonFilter
                        options={unfulfilledReasonOptions}
                        selected={unfulfilledReasons}
                        onConfirm={(data) => setUnfulfilledReasons(data)}
                      />
                    )
                  }
                />
              </Layout.FlexRow>
            )}
            columnDataCy={"unfulfilled-reason-column"}
          />
          <Table.Column
            _key="destination"
            columnKey="destination"
            title={() => (
              <Layout.FlexRow>
                {ci18n("Means the shipping country of an order", "Destination")}
                <PopoverFilterButton
                  isActive={
                    !!destinations &&
                    !!destinationOptions &&
                    destinations.length < destinationOptions.length
                  }
                  count={destinations?.length}
                  popoverContent={() =>
                    loadingDestinationOptionsData ? (
                      <Spinner />
                    ) : (
                      <DestinationFilter
                        options={
                          destinationOptions
                            ? (destinationOptions as CountryCode[])
                            : null
                        }
                        selected={destinations}
                        onConfirm={(data) => setDestinations(data)}
                      />
                    )
                  }
                />
              </Layout.FlexRow>
            )}
            columnDataCy={"destination-column"}
          >
            {({ row }: CellInfo<React.ReactNode, TableData>) => {
              return (
                row.destination && (
                  <Flag
                    className={css(styles.flag)}
                    aspectRatio="4x3"
                    countryCode={row.destination as CountryCode}
                    displayCountryName
                  />
                )
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
        tableControls: {
          padding: "18px 24px",
        },
        tableControl: {
          gap: 24,
        },
        pageSizeControl: {
          gap: 8,
        },
        flag: {
          width: 24,
        },
      }),
    [],
  );
};

export default observer(OrderFulfillmentRateTable);
