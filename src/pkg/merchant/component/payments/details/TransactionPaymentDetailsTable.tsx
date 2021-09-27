import * as React from "react";
import { StyleSheet, css } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import numeral from "numeral";

/* Legacy */
import { zendeskURL, zendeskSectionURL } from "@legacy/core/url";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import { Popover } from "@merchant/component/core";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import RefundTypePopover from "@merchant/component/payments/refunds/RefundTypePopover";

/* Merchant API */
import { getTransactions } from "@merchant/api/payment-detail";

/* Relative Imports */
import PaymentDetailsTable, {
  IDRender,
  DateRender,
} from "./PaymentDetailsTable";
import PaymentDetailsTableFetcher from "./PaymentDetailsTableFetcher";
import TransactionPaymentDetailsFilter from "./TransactionPaymentDetailsFilter";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BasicColumnProps, SortOrder } from "@ContextLogic/lego";
import { CurrencyColumnProps } from "@ContextLogic/lego";
import { PaymentDetailsColumn } from "./PaymentDetailsTable";
import { TransactionRow } from "@merchant/api/payment-detail";

type TransactionTableProps = {
  readonly type: string;
  readonly title: string;
  readonly dryrun: boolean;
  readonly paymentId: string;
  readonly currency: string;
  readonly hasWeRebate: boolean;
  readonly canSeeSalesTax: boolean;
  readonly showRefundType: boolean;
  readonly showPaymentDetail: (mtid: string) => unknown;
  readonly showRefundDetail: (row: TransactionRow) => unknown;
  readonly showWishPostShipping: boolean;
  readonly showRevShare: boolean;
};

// eslint doesn't understand the syntax `<[string, SortOrder]>`
type Sort = [string, SortOrder];

const TransactionPaymentDetailsTable = (props: TransactionTableProps) => {
  const { type, title, dryrun, paymentId, currency } = props;

  // Filter data
  const [filter, setFilter] = React.useState({
    dateFrom: "",
    dateTo: "",
    filterIDs: "",
    refundFrom: 0,
    refundTo: 100,
  });
  // Avoid making unnecessary filter for default values
  const refundFilterActive = filter.refundFrom !== 0 || filter.refundTo !== 100;
  const filterActive =
    !!(filter.dateFrom || filter.dateTo || filter.filterIDs) ||
    refundFilterActive;

  // Sorting
  const [[sort, order], setSort] = React.useState<Sort>(["none", "asc"]);

  // API request
  const request = getTransactions({
    page: 0,
    type,
    pid: paymentId,
    order,
    sort,
    date_from: filter.dateFrom,
    date_to: filter.dateTo,
    ids_to_filter: filter.filterIDs.replace(/\s/g, ""),
    refund_perc_from: refundFilterActive ? filter.refundFrom : null,
    refund_perc_to: refundFilterActive ? filter.refundTo : null,
  });

  // Table columns
  const columns = useColumns({
    sort,
    order,
    setSort,
    props,
  });

  return (
    <PaymentDetailsTableFetcher key={request.hash()} request={request}>
      {(props) => (
        <PaymentDetailsTable
          {...props}
          nextPageRequiresAPICall
          dryrun={dryrun}
          title={title}
          currency={currency}
          columns={columns as any}
          filterActive={filterActive}
          filter={(closePopup) => (
            <TransactionPaymentDetailsFilter
              initialData={filter}
              onFilter={async (args) => {
                setFilter(args);
              }}
              closePopup={closePopup}
            />
          )}
        />
      )}
    </PaymentDetailsTableFetcher>
  );
};

const useStyleSheet = () =>
  React.useMemo(
    () =>
      StyleSheet.create({
        refundTypeBox: {
          whiteSpace: "nowrap",
        },
        refundType: {
          color: "#7790A3",
        },
      }),
    [],
  );

const useColumns = ({
  sort,
  order,
  setSort,
  props,
}: {
  sort: string;
  order: SortOrder;
  setSort: (arg0: Sort) => unknown;
  props: TransactionTableProps;
}) => {
  // Calculate table style
  const { dimenStore } = AppStore.instance();
  const expand = dimenStore.screenInnerWidth < 1500;

  // Get styles
  const styles = useStyleSheet();

  const {
    type,
    currency,
    hasWeRebate,
    canSeeSalesTax,
    showRefundType,
    showPaymentDetail,
    showRefundDetail,
    showWishPostShipping,
    showRevShare,
  } = props;

  const columns: ReadonlyArray<
    | PaymentDetailsColumn<TransactionRow, BasicColumnProps>
    | PaymentDetailsColumn<TransactionRow, CurrencyColumnProps>
  > = React.useMemo(
    () => [
      {
        columnKey: "date",
        title: i`Date`,
        margin: `0 0 0 ${expand ? "-" : ""}10px`,
        render: ({ row: { date } }) => <DateRender date={date} />,
        sortOrder: sort === "id" || sort === "none" ? order : "not-applied",
        onSortToggled: (newSortOrder) => setSort(["id", newSortOrder]),
      },
      {
        columnKey: "id",
        title: i`Order ID`,
        render: ({
          row: {
            id,
            eligible_for_epc_fast_payment: eligibleForEpcFastPayment,
            advanced_logistics: advancedLogistics,
          },
        }) => (
          <div style={{ flexDirection: "row", display: "flex" }}>
            <IDRender id={id} url={`/transaction/${id}`} />
            {type === "paid" && eligibleForEpcFastPayment && (
              <Popover
                position="right"
                popoverContent={() => {
                  return (
                    <div style={{ width: 280, margin: 8 }}>
                      <Markdown
                        text={
                          advancedLogistics
                            ? i`This Advanced Logistics Program order was eligible for ` +
                              i`payment **20 calendar** days after confirmed fulfillment.`
                            : i`This EPC order was eligible for payment ` +
                              i`**20 calendar** days after confirmed fulfillment.`
                        }
                      />
                      <Link
                        openInNewTab
                        href={
                          advancedLogistics
                            ? zendeskSectionURL("360006353574")
                            : zendeskURL("360008230173")
                        }
                      >
                        Learn more
                      </Link>
                    </div>
                  );
                }}
              >
                <Illustration
                  name="epcFastPayments"
                  alt="illustration"
                  style={{
                    width: "24px",
                    height: "24px",
                    paddingLeft: "4px",
                  }}
                />
              </Popover>
            )}
          </div>
        ),
      },
      {
        columnKey: "rev_share",
        title: i`Rev Share %`,
        visible: showRevShare,
        description:
          i`Rev share % is individually calculated per order. * indicates the rev ` +
          i`share % was adjusted later. For the updated rev share number, ` +
          i`please see the Order Details page.`,
        render: ({ row }) => {
          if (row.updated_rev_share && row.original_rev_share) {
            return numeral(row.original_rev_share / 100).format("0.00%") + "*";
          } else if (row.original_rev_share) {
            return numeral(row.original_rev_share / 100).format("0.00%");
          } else if (row.calculated_rev_share) {
            return numeral(row.calculated_rev_share / 100).format("0.00%");
          }
          return "N/A";
        },
        expand,
      },
      {
        columnKey: "quantity",
        title: i`Quantity`,
        sortOrder: sort === "quantity" ? order : "not-applied",
        onSortToggled: (newSortOrder) => setSort(["quantity", newSortOrder]),
      },
      {
        columnKey: "currency_code",
        title: i`Currency`,
        description: i`Localized Currency`,
        visible: (data) => data.show_local_currency,
        expand,
        sortOrder: sort === "cost" ? order : "not-applied",
        onSortToggled: (newSortOrder) => setSort(["cost", newSortOrder]),
      },
      {
        columnKey: "price",
        title: i`Price`,
        description: i`Listed product price`,
        column: Table.CurrencyColumn,
        currencyCode: currency,
        expand,
      },
      {
        columnKey: "shipping",
        title: i`Shipping`,
        description: i`Listed shipping price`,
        column: Table.CurrencyColumn,
        currencyCode: currency,
        expand,
      },
      {
        columnKey: "cost",
        title: i`Cost`,
        description: i`Cost of product you will receive after revenue share`,
        column: Table.CurrencyColumn,
        currencyCode: currency,
        expand,
      },
      {
        columnKey: "shipping_cost",
        title: i`Shipping Cost`,
        description:
          i`Shipping cost of product you will receive ` +
          i`after revenue share`,
        column: Table.CurrencyColumn,
        currencyCode: currency,
        expand,
        sortOrder: sort === "shipping_cost" ? order : "not-applied",
        onSortToggled: (newSortOrder) =>
          setSort(["shipping_cost", newSortOrder]),
      },
      {
        columnKey: "unity_wishpost_shipping",
        title: i`WishPost Shipping`,
        visible: showWishPostShipping,
        render: ({ row }) =>
          row.is_unity_order
            ? formatCurrency(row.unity_wishpost_shipping || 0, currency)
            : "—",
        expand,
      },
      {
        columnKey: "localized_total_with_wishpost",
        title: i`Total Cost`,
        description:
          i`The Total Cost of an order is the amount ` +
          i`you will receive from Wish per transaction.`,
        column: Table.CurrencyColumn,
        currencyCode: currency,
      },
      {
        columnKey: "refund_type",
        title: i`Refund Type`,
        visible: showRefundType,
        description: () =>
          (type === "refunded" || type === "paid") && <RefundTypePopover />,
        render: ({ row }) => {
          let name = "",
            value = i`N/A`;
          if (!row.is_new_refund) {
            if (row.state === "REFUNDED") {
              name = i`Full`;
              value = "";
            }
          } else if (row.is_partial_quantity_refunded) {
            name = i`Quantity:`;
            value = `${row.refunded_quantity}/${row.quantity}`;
          } else if (row.is_partial_amount_refunded) {
            name = i`Partial:`;
            value = `${row.refunded_percentage_formatted}`;
          }
          return (
            <div className={css(styles.refundTypeBox)}>
              <span className={css(styles.refundType)}>{name}</span>{" "}
              <span>{value}</span>
            </div>
          );
        },
      },
      {
        columnKey: "refunded_amount",
        title: i`Refunded Amount`,
        description: i`Total amount refunded`,
        currencyCode: currency,
        render: ({ row }) => {
          if (row.is_new_refund) {
            return formatCurrency(row.refunded_amount_with_wishpost, currency);
          }
          return formatCurrency(row.cost_of_refund, currency);
        },
        expand,
      },
      {
        columnKey: "refunded_responsibility_perc",
        title: i`% Refunded Responsibility`,
        description: i`Percentage of refund amount you need to pay`,
        render: ({ row }) => {
          if (row.is_new_refund) {
            if (row.refunded_amount_with_wishpost > 0) {
              return (
                <Link onClick={() => showRefundDetail(row)}>
                  {numeral(row.responsibility / 100).format("0.00%")}
                </Link>
              );
            }
          } else if (row.cost_of_refund > 0) {
            return (
              <Link onClick={() => showRefundDetail(row)}>
                {numeral(row.refund_percent / 100).format("0.00%")}
              </Link>
            );
          }
          return i`N/A`;
        },
        expand,
      },
      {
        columnKey: "refund_responsility",
        title: i`Refunded Responsibility`,
        description:
          i`Refund amount that was paid. ` +
          i`Refunded Amount * Refund Responsibility %`,
        render: ({ row }) => {
          if (row.is_new_refund) {
            if (row.refunded_amount_with_wishpost > 0) {
              return formatCurrency(
                row.responsible_amount_with_wishpost,
                currency,
              );
            }
          } else if (row.cost_of_refund > 0) {
            return formatCurrency(row.refund_cost, currency);
          }
          return i`N/A`;
        },
      },
      {
        columnKey: "localized_wish_express_rebate",
        title: i`Wish Express Cash Back`,
        description: i`Cash back for shipping the Wish Express order on time`,
        visible: hasWeRebate,
        column: Table.CurrencyColumn,
        currencyCode: currency,
      },
      {
        columnKey: "paid_tax_amount",
        title: i`Tax`,
        description: i`Net tax after any refunded amount`,
        visible: canSeeSalesTax && type === "paid",
        render: ({ row }) =>
          row.show_tax
            ? formatCurrency(row.paid_tax_amount || 0, currency)
            : "—",
      },
      {
        columnKey: "deducted_tax_amount",
        title: i`Tax`,
        description:
          i`Deductions for tax of refunded orders ` +
          i`that were previously paid`,
        visible: canSeeSalesTax && type !== "paid",
        render: ({ row }) =>
          row.show_tax
            ? formatCurrency(row.deducted_tax_amount || 0, currency)
            : "—",
      },
      {
        columnKey: "paid_amount",
        title: i`Paid Amount`,
        description: i`Total amount you will receive`,
        visible: type === "paid",
        align: "right",
        margin: `0 10px 0 0`,
        render: ({ row }) => (
          <Link onClick={() => showPaymentDetail(row.id)}>
            {formatCurrency(
              row.paid_amount +
                (row.show_tax && row.paid_tax_amount ? row.paid_tax_amount : 0),
              currency,
            )}
          </Link>
        ),
      },
      {
        columnKey: "deducted_amount",
        title: i`Deducted Amount`,
        description: i`Total amount that will be deducted`,
        visible: type !== "paid",
        align: "right",
        margin: `0 10px 0 0`,
        render: ({ row }) => (
          <Link onClick={() => showRefundDetail(row)}>
            {formatCurrency(
              -(
                row.deducted_amount +
                (row.show_tax && row.deducted_tax_amount
                  ? row.deducted_tax_amount
                  : 0)
              ),
              currency,
            )}
          </Link>
        ),
      },
    ],
    [
      expand,
      sort,
      order,
      setSort,
      styles,
      type,
      currency,
      hasWeRebate,
      canSeeSalesTax,
      showRefundType,
      showPaymentDetail,
      showRefundDetail,
      showWishPostShipping,
      showRevShare,
    ],
  );
  return columns;
};

export default observer(TransactionPaymentDetailsTable);
