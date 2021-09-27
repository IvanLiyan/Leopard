import * as React from "react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import { getWithheld } from "@merchant/api/payment-detail";

/* Relative Imports */
import PaymentDetailsTableFetcher from "./PaymentDetailsTableFetcher";
import PaymentDetailsTable, {
  IDRender,
  DateRender,
} from "./PaymentDetailsTable";

import { BasicColumnProps } from "@ContextLogic/lego";
import { CurrencyColumnProps } from "@ContextLogic/lego";
import { PaymentDetailsColumn } from "./PaymentDetailsTable";
import { WithheldRow } from "@merchant/api/payment-detail";

type WithheldTableProps = {
  readonly type: string;
  readonly title: string;
  readonly dryrun: boolean;
  readonly paymentId: string;
  readonly currency: string;
  readonly hasWeRebate: boolean;
  readonly canSeeSalesTax: boolean;
  readonly showRefundType: boolean;
  readonly showPaymentDetail: (mtid: string) => unknown;
};

export default function WithheldPaymentDetailsTable({
  type,
  title,
  dryrun,
  paymentId,
  currency,
  canSeeSalesTax,
  showPaymentDetail,
}: WithheldTableProps) {
  const columns = useColumns({ currency, canSeeSalesTax, showPaymentDetail });

  return (
    <PaymentDetailsTableFetcher
      request={getWithheld({
        page: 0,
        type,
        pid: paymentId,
        order: "asc",
        sort: "none",
      })}
    >
      {(props) => (
        <PaymentDetailsTable
          {...props}
          nextPageRequiresAPICall
          dryrun={dryrun}
          title={title}
          currency={currency}
          columns={columns as any}
        />
      )}
    </PaymentDetailsTableFetcher>
  );
}

const useColumns = ({
  currency,
  canSeeSalesTax,
  showPaymentDetail,
}: {
  currency: string;
  canSeeSalesTax: boolean;
  showPaymentDetail: (arg0: string) => unknown;
}) => {
  const columns: ReadonlyArray<
    | PaymentDetailsColumn<WithheldRow, BasicColumnProps>
    | PaymentDetailsColumn<WithheldRow, CurrencyColumnProps>
  > = React.useMemo(
    () => [
      {
        columnKey: "date",
        title: i`Date`,
        margin: `0 0 0 10px`,
        render: ({ row: { date } }) => <DateRender date={date} />,
      },
      {
        columnKey: "id",
        title: i`Order ID`,
        render: ({ row: { id } }) => (
          <IDRender id={id} url={`/transaction/${id}`} />
        ),
      },
      {
        columnKey: "withhold_reason",
        title: i`Withheld Reason`,
      },
      {
        columnKey: "currency_code",
        title: i`Currency`,
        visible: (data) => data.show_local_currency,
      },
      {
        columnKey: "withheld_amount",
        title: i`Amount Withheld`,
        column: Table.CurrencyColumn,
        currencyCode: currency,
      },
      {
        columnKey: "withheld_tax_amount",
        title: i`Tax Withheld`,
        visible: canSeeSalesTax,
        render: ({ row }) =>
          row.show_tax
            ? formatCurrency(row.withheld_tax_amount, currency)
            : "—",
      },
      {
        columnKey: "amount_paid",
        title: i`Amount Paid`,
        align: "right",
        margin: `0 10px 0 0`,
        render: ({ row }) => (
          <Link onClick={() => showPaymentDetail(row.id)}>
            {formatCurrency(0, currency)}
          </Link>
        ),
      },
    ],
    [currency, canSeeSalesTax, showPaymentDetail]
  );

  return columns;
};
