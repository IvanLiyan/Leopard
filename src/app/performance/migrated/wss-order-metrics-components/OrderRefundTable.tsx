import {
  H4,
  Layout,
  LoadingIndicator,
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
  SortByOrder,
  SortOrderTransactionDateField,
  WssQualityRefundReason,
} from "@schema";
import {
  GQLSortOrder,
  LegoSortOrder,
  QualityRefundReasonLabel,
  WSSOrderQualityRefundQuery,
  WSSOrderQualityRefundRequest,
  WSSOrderQualityRefundResponse,
  WSSQualityRefundReasonOptionsQuery,
  WSSQualityRefundReasonOptionsRequest,
  WSSQualityRefundReasonOptionsResponse,
} from "@performance/migrated/toolkit/order-metrics";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import QualityRefundReasonFilter from "./QualityRefundReasonFilter";
import TableControl from "@core/components/TableControl";

type TableData = {
  readonly orderId?: string | null;
  readonly transactionDate: string;
  readonly refundReason?: string | null;
};

type Props = BaseProps & {
  readonly productId: string;
};

const OrderRefundTable: React.FC<Props> = ({ style, className, productId }) => {
  const { locale } = useLocalizationStore();

  const [sortField, setSortField] =
    useState<SortOrderTransactionDateField | null>("TransactionDate");
  const [sortOrder, setSortOrder] = useState<SortByOrder | null>("DESC");
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const [refundReasons, setRefundReasons] =
    useState<ReadonlyArray<WssQualityRefundReason> | null>(null);

  const { data, loading } = useQuery<
    WSSOrderQualityRefundResponse,
    WSSOrderQualityRefundRequest
  >(WSSOrderQualityRefundQuery, {
    variables: {
      limit,
      offset,
      sortField: sortOrder && sortField ? sortField : undefined,
      sortOrder: sortOrder && sortField ? sortOrder : undefined,
      productId,
      refundReasons,
    },
  });

  const { data: reasonOptionsData, loading: loadingReasonOptionsData } =
    useQuery<
      WSSQualityRefundReasonOptionsResponse,
      WSSQualityRefundReasonOptionsRequest
    >(WSSQualityRefundReasonOptionsQuery, {
      variables: {
        productId,
      },
      fetchPolicy: "no-cache",
    });

  const total =
    data?.currentMerchant?.wishSellerStandard.deepDive?.orderQualityRefund
      .totalCount;
  const refundReasonOptions =
    reasonOptionsData?.currentMerchant?.wishSellerStandard.deepDive
      ?.qualityRefundReasons ?? [];

  const tableData =
    data?.currentMerchant?.wishSellerStandard.deepDive?.orderQualityRefund.dataSlice.map<TableData>(
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
          refundReason: Object.keys(QualityRefundReasonLabel).includes(
            row.refundReason,
          )
            ? QualityRefundReasonLabel[
                row.refundReason as WssQualityRefundReason
              ]
            : row.refundReason,
        };
      },
    );

  const tableActions: ReadonlyArray<TableAction> = [
    {
      key: "order_refund_view",
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
              "Transaction Date",
            )}
            sortOrder={getSortOrderForField("TransactionDate")}
            onSortToggled={onFieldSortToggled("TransactionDate")}
            columnDataCy={"transaction-date-column"}
          />
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
                    !!refundReasonOptions &&
                    !!refundReasons &&
                    refundReasonOptions.length > refundReasons.length
                  }
                  count={refundReasons?.length}
                  popoverContent={() =>
                    loadingReasonOptionsData ? (
                      <Spinner />
                    ) : (
                      <QualityRefundReasonFilter
                        options={refundReasonOptions}
                        selected={refundReasons}
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
      />
    </Layout.FlexColumn>
  );
};

export default observer(OrderRefundTable);
