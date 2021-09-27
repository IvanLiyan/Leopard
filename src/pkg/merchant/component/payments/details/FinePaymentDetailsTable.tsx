import * as React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import { getFines } from "@merchant/api/payment-detail";

/* Relative Imports */
import PaymentDetailsTableFetcher from "./PaymentDetailsTableFetcher";
import PaymentDetailsTable, {
  IDRender,
  DateRender,
} from "./PaymentDetailsTable";

import { BasicColumnProps } from "@ContextLogic/lego";
import { PaymentDetailsColumn } from "./PaymentDetailsTable";
import { FineRow } from "@merchant/api/payment-detail";

type FineTableProps = {
  readonly fineTitle: string;
  readonly feeTitle: string;
  readonly showFines: boolean;
  readonly showFees: boolean;
  readonly dryrun: boolean;
  readonly paymentId: string;
  readonly currency: string;
  readonly hasWeRebate: boolean;
  readonly canSeeSalesTax: boolean;
};

const FinePaymentDetailsTable = ({
  fineTitle,
  feeTitle,
  showFines,
  showFees,
  dryrun,
  paymentId,
  currency,
  canSeeSalesTax,
}: FineTableProps) => {
  const columns = useColumns({ currency, canSeeSalesTax });
  const request = React.useMemo(
    () => getFines({ pid: paymentId }),
    [paymentId],
  );

  const renderFines = () => {
    if (!showFines) {
      return null;
    }

    return (
      <PaymentDetailsTableFetcher request={request}>
        {({ data, ...props }) => (
          <PaymentDetailsTable
            {...props}
            dryrun={dryrun}
            title={fineTitle}
            currency={currency}
            columns={columns}
            data={
              data != null
                ? {
                    results: data.results_fine,
                    show_local_currency: data.show_local_currency,
                    num_results: data.num_results,
                  }
                : null
            }
          />
        )}
      </PaymentDetailsTableFetcher>
    );
  };

  const renderFees = () => {
    if (!showFees) {
      return null;
    }

    return (
      <PaymentDetailsTableFetcher request={request}>
        {({ data, ...props }) => (
          <PaymentDetailsTable
            {...props}
            dryrun={dryrun}
            title={feeTitle}
            currency={currency}
            columns={columns}
            data={
              data != null
                ? {
                    results: data.results_fee,
                    show_local_currency: data.show_local_currency,
                    num_results: data.num_results,
                  }
                : null
            }
          />
        )}
      </PaymentDetailsTableFetcher>
    );
  };

  return (
    <>
      {renderFines()}
      {renderFees()}
    </>
  );
};

const useColumns = ({
  currency,
  canSeeSalesTax,
}: {
  currency: string;
  canSeeSalesTax: boolean;
}) => {
  const columns: ReadonlyArray<
    PaymentDetailsColumn<FineRow, BasicColumnProps>
  > = [
    {
      columnKey: "date",
      title: i`Date`,
      margin: `0 0 0 10px`,
      render: ({ row: { date } }) => <DateRender date={date} />,
    },
    {
      columnKey: "id",
      title: i`Deduction ID`,
      render: ({ row: { id } }) => <IDRender id={id} url={`/penalty/${id}`} />,
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
      columnKey: "currency",
      title: i`Currency`,
      align: canSeeSalesTax ? "left" : "right",
      visible: (data) => data.show_local_currency,
    },
    {
      columnKey: "localized_amount",
      title: i`Amount`,
      visible: canSeeSalesTax,
      align: "right",
      margin: `0 10px 0 0`,
      render: ({ row }) => (
        <span
          style={{
            color: "red",
          }}
        >
          {formatCurrency(-row.localized_amount, currency)}
        </span>
      ),
    },
  ];

  return columns;
};

export default observer(FinePaymentDetailsTable);
