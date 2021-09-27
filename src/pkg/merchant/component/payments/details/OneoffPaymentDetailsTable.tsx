import * as React from "react";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import { getOneoff } from "@merchant/api/payment-detail";

/* Relative Imports */
import PaymentDetailsTableFetcher from "./PaymentDetailsTableFetcher";
import PaymentDetailsTable, {
  IDRender,
  DateRender,
} from "./PaymentDetailsTable";

import { BasicColumnProps } from "@ContextLogic/lego";
import { PaymentDetailsColumn } from "./PaymentDetailsTable";
import { OneoffRow } from "@merchant/api/payment-detail";

type OneoffTableProps = {
  readonly title: string;
  readonly dryrun: boolean;
  readonly paymentId: string;
  readonly currency: string;
  readonly hasWeRebate: boolean;
  readonly canSeeSalesTax: boolean;
};

export default function OneoffPaymentDetailsTable({
  title,
  dryrun,
  paymentId,
  currency,
}: OneoffTableProps) {
  const columns = useColumns({ currency });

  return (
    <PaymentDetailsTableFetcher
      request={getOneoff({
        pid: paymentId,
      })}
    >
      {(props) => (
        <PaymentDetailsTable
          {...props}
          dryrun={dryrun}
          title={title}
          currency={currency}
          columns={columns}
        />
      )}
    </PaymentDetailsTableFetcher>
  );
}

const useColumns = ({ currency }: { currency: string }) => {
  const columns: ReadonlyArray<PaymentDetailsColumn<
    OneoffRow,
    BasicColumnProps
  >> = React.useMemo(
    () => [
      {
        columnKey: "date",
        title: i`Date`,
        margin: `0 0 0 10px`,
        render: ({ row: { date } }) => <DateRender date={date} />,
      },
      {
        columnKey: "id",
        title: i`ID`,
        render: ({ row: { id } }) => (
          <IDRender id={id} url={`/oneoff-payment-detail/${id}`} />
        ),
      },
      {
        columnKey: "reason",
        title: i`Description`,
        render: ({ row }) => (
          // Please don't repeat this, `dangerouslySetInnerHTML` is not an API anyone should
          // be using
          // eslint-disable-next-line react/no-danger, @typescript-eslint/naming-convention
          <div dangerouslySetInnerHTML={{ __html: row.reason }} />
        ),
      },
      {
        columnKey: "localized_currency",
        title: i`Currency`,
        visible: (data) => data.show_local_currency,
      },
      {
        columnKey: "localized_amount",
        title: i`Amount`,
        align: "right",
        margin: `0 10px 0 0`,
        render: ({ row }) => (
          <span
            style={{
              color: "#009900",
            }}
          >
            {formatCurrency(row.localized_amount, currency)}
          </span>
        ),
      },
    ],
    [currency]
  );

  return columns;
};
