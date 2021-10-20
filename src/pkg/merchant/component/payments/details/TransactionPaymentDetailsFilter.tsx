import * as React from "react";
import { StyleSheet, css } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import moment from "moment/moment";

/* Lego Components */
import { DayPickerInput } from "@ContextLogic/lego";
import { FormField } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";

/* Relative Imports */
import PaymentDetailsFilter from "./PaymentDetailsFilter";

/* Merchant Store */
import LocalizationStore from "@stores/LocalizationStore";

type FilterData = {
  readonly dateFrom: string;
  readonly dateTo: string;
  readonly filterIDs: string;
  readonly refundFrom: number;
  readonly refundTo: number;
};

type TransactionFilterProps = {
  readonly initialData: FilterData;
  readonly onFilter: (arg0: FilterData) => Promise<unknown>;
  readonly closePopup: () => unknown;
};

const TransactionPaymentDetailsFilter = ({
  initialData,
  onFilter,
  closePopup,
}: TransactionFilterProps) => {
  // Filter values
  const [dateFrom, setDateFrom] = React.useState(initialData.dateFrom);
  const [dateTo, setDateTo] = React.useState(initialData.dateTo);
  const [filterIDs, setFilterIDs] = React.useState(initialData.filterIDs);
  const [refundFrom, setRefundFrom] = React.useState(initialData.refundFrom);
  const [refundTo, setRefundTo] = React.useState(initialData.refundTo);

  const styles = useStyleSheet();

  const active =
    !!(dateFrom || dateTo || filterIDs) || refundFrom !== 0 || refundTo !== 100;

  const { locale } = LocalizationStore.instance();

  return (
    <PaymentDetailsFilter
      onFilter={() =>
        onFilter({ dateFrom, dateTo, filterIDs, refundFrom, refundTo })
      }
      onCancel={() => {
        setDateFrom("");
        setDateTo("");
        setFilterIDs("");
        onFilter({
          dateFrom: "",
          dateTo: "",
          filterIDs: "",
          refundFrom: 0,
          refundTo: 100,
        });
        closePopup();
      }}
      onClose={closePopup}
      active={active}
    >
      <FormField title={i`Date From`}>
        <DayPickerInput
          value={dateFrom}
          onDayChange={(from) =>
            setDateFrom(from ? moment(from).format("MM-DD-YYYY") : "")
          }
        />
      </FormField>
      <FormField title={i`Date To`} className={css(styles.field)}>
        <DayPickerInput
          value={dateTo}
          onDayChange={(to) =>
            setDateTo(to ? moment(to).format("MM-DD-YYYY") : "")
          }
          locale={locale}
        />
      </FormField>
      <FormField title={i`Order IDs`} className={css(styles.field)}>
        <p>Enter a comma separated list of IDs</p>
        <textarea
          value={filterIDs}
          className={css(styles.textarea)}
          onChange={(e: React.SyntheticEvent<HTMLTextAreaElement>) =>
            setFilterIDs((e.target as HTMLTextAreaElement).value)
          }
        />
      </FormField>
      <FormField title={i`% Refund From`} className={css(styles.field)}>
        <NumericInput
          value={refundFrom}
          onChange={({ valueAsNumber }) => {
            const value = Math.min(Math.max(valueAsNumber || 0, 0), 100);
            setRefundFrom(value);
            if (value > refundTo) {
              setRefundTo(value);
            }
          }}
          incrementStep={1}
        />
      </FormField>
      <FormField title={i`% Refund To`} className={css(styles.field)}>
        <NumericInput
          value={refundTo}
          onChange={({ valueAsNumber }) => {
            const value = Math.min(Math.max(valueAsNumber || 0, 0), 100);
            setRefundTo(value);
            if (value < refundFrom) {
              setRefundFrom(value);
            }
          }}
          incrementStep={1}
        />
      </FormField>
    </PaymentDetailsFilter>
  );
};

const useStyleSheet = () =>
  React.useMemo(
    () =>
      StyleSheet.create({
        field: {
          paddingTop: 10,
        },
        textarea: {
          width: "100%",
          boxSizing: "border-box",
        },
      }),
    [],
  );

export default observer(TransactionPaymentDetailsFilter);
