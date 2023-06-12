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
import PopoverFilterButton from "./PopoverFilterButton";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import {
  CountryCode,
  SortByOrder,
  SortOrderTransactionDateField,
  WssLogisticsRefundReason,
} from "@schema";
import {
  GQLSortOrder,
  LegoSortOrder,
  LogisticsRefundReasonLabel,
  WSSCarrierOptionsQuery,
  WSSCarrierOptionsRequest,
  WSSCarrierOptionsResponse,
  WSSLogisticsRefundReasonOptionsQuery,
  WSSLogisticsRefundReasonOptionsResponse,
  WSSOrderLogisticsRefundQuery,
  WSSOrderLogisticsRefundRequest,
  WSSOrderLogisticsRefundResponse,
} from "@performance/migrated/toolkit/order-metrics";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import CarrierFilter from "./CarrierFilter";
import LogisticsRefundReasonFilter from "./LogisticsRefundReasonFilter";
import TableControl from "@core/components/TableControl";

type TableData = {
  readonly orderId?: string | null;
  readonly transactionDate: string;
  readonly program?: string | null;
  readonly refundReason?: string | null;
};

const LogisticsRefundRateTable: React.FC<BaseProps> = ({
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
  const [carriers, setCarriers] = useState<ReadonlyArray<string> | null>(null);
  const [refundReasons, setRefundReasons] =
    useState<ReadonlyArray<WssLogisticsRefundReason> | null>(null);

  const { data, loading } = useQuery<
    WSSOrderLogisticsRefundResponse,
    WSSOrderLogisticsRefundRequest
  >(WSSOrderLogisticsRefundQuery, {
    variables: {
      limit,
      offset,
      orderIds: searchInput ? [searchInput] : undefined,
      sortField: sortOrder && sortField ? sortField : undefined,
      sortOrder: sortOrder && sortField ? sortOrder : undefined,
      refundReasons,
      carriers,
    },
  });

  const { data: carrierOptionsData, loading: loadingCarrierOptionsData } =
    useQuery<WSSCarrierOptionsResponse, WSSCarrierOptionsRequest>(
      WSSCarrierOptionsQuery,
      {
        variables: {
          pageType: "LOGISTICS_REFUND",
        },
        fetchPolicy: "no-cache",
      },
    );

  const carrierOptions = (carrierOptionsData?.currentMerchant
    ?.wishSellerStandard.deepDive?.carriers ??
    []) as ReadonlyArray<CountryCode>;

  const { data: reasonOptionsData, loading: loadingReasonOptionsData } =
    useQuery<WSSLogisticsRefundReasonOptionsResponse, never>(
      WSSLogisticsRefundReasonOptionsQuery,
      {
        fetchPolicy: "no-cache",
      },
    );
  const refundReasonOptions =
    reasonOptionsData?.currentMerchant?.wishSellerStandard.deepDive
      ?.logisticsRefundReasons ?? [];

  const total =
    data?.currentMerchant?.wishSellerStandard.deepDive?.orderLogisticsRefund
      .totalCount;

  const tableData =
    data?.currentMerchant?.wishSellerStandard.deepDive?.orderLogisticsRefund.dataSlice.map<TableData>(
      (row) => {
        const date = new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }).format(new Date(row.transactionDate.unix * 1000));
        if (!row.refundReason) {
          return {
            orderId: row.orderId,
            transactionDate: date,
          };
        }
        return {
          orderId: row.orderId,
          transactionDate: date,
          program: row.carrier,
          refundReason: Object.keys(LogisticsRefundReasonLabel).includes(
            row.refundReason,
          )
            ? LogisticsRefundReasonLabel[
                row.refundReason as WssLogisticsRefundReason
              ]
            : row.refundReason,
        };
      },
    );

  const tableActions: ReadonlyArray<TableAction> = [
    {
      key: "order_details_view",
      name: i`View Order Details`,
      canBatch: false,
      canApplyToRow: () => true,
      openInNewTab: true,
      href: ([row]: ReadonlyArray<TableData>) => {
        return `/order/${row.orderId}`;
      },
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
      <H4>All refunded orders</H4>
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
          rowDataCy={(row: TableData) => `refunded-order-row-${row.orderId}`}
        >
          <Table.ObjectIdColumn
            _key="orderId"
            columnKey="orderId"
            showFull={false}
            title={ci18n(
              "Column name, order ID under a given product",
              "Order ID",
            )}
            columnDataCy={"order-id-column"}
          />
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
            _key="program"
            columnKey="program"
            title={() => (
              <Layout.FlexRow>
                {ci18n(
                  "Means the carrier used for an order, e.g. USPS, UPS",
                  "Carrier",
                )}
                <PopoverFilterButton
                  isActive={
                    !!carriers &&
                    !!carrierOptions &&
                    carriers.length < carrierOptions.length
                  }
                  count={carriers?.length}
                  popoverContent={() =>
                    loadingCarrierOptionsData ? (
                      <Spinner />
                    ) : (
                      <CarrierFilter
                        options={carrierOptions ? carrierOptions : null}
                        selected={carriers}
                        onConfirm={(data) => setCarriers(data)}
                      />
                    )
                  }
                />
              </Layout.FlexRow>
            )}
            columnDataCy={"carrier-column"}
          >
            {({ row }: CellInfo<React.ReactNode, TableData>) => {
              return row.program;
            }}
          </Table.Column>
          <Table.Column
            _key="refundReason"
            columnKey="refundReason"
            title={() => (
              <Layout.FlexRow>
                {ci18n(
                  "Column name, reason the order was refunded",
                  "Refund Reason",
                )}
                <PopoverFilterButton
                  isActive={
                    !!refundReasons &&
                    !!refundReasonOptions &&
                    refundReasons.length < refundReasonOptions.length
                  }
                  count={refundReasons?.length}
                  popoverContent={() =>
                    loadingReasonOptionsData ? (
                      <Spinner />
                    ) : (
                      <LogisticsRefundReasonFilter
                        selected={refundReasons}
                        options={refundReasonOptions}
                        onConfirm={(data) => setRefundReasons(data)}
                      />
                    )
                  }
                />
              </Layout.FlexRow>
            )}
            columnDataCy={"refund-reason-column"}
          />
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
      }),
    [],
  );
};

export default observer(LogisticsRefundRateTable);
