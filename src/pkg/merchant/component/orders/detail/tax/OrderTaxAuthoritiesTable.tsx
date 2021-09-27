import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Table, CellInfo } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import {
  GetTaxDataResponseType,
  PickOrderSalesTaxItem,
} from "@toolkit/orders/tax";

export type OrderTaxAuthoritiesTableProps = BaseProps & {
  readonly data: GetTaxDataResponseType;
};

const OrderTaxAuthoritiesTable: React.FC<OrderTaxAuthoritiesTableProps> = (
  props: OrderTaxAuthoritiesTableProps
) => {
  const { data, className, style } = props;
  const items = useMemo(
    () => data.fulfillment.order?.tax?.salesTax?.merchantRemitItems || [],
    [data.fulfillment.order?.tax?.salesTax?.merchantRemitItems]
  );
  const styles = useStylesheet();
  const saleRows: ReadonlyArray<DisplayRow> = useMemo(() => {
    const saleItems = items.filter((item) => item.isSale);
    return saleItems.map((item, index) => {
      return {
        time: index == 0 ? item.createdTime.mmddyyyy : null,
        status: index == 0 ? i`Tax collected` : null,
        country: item.taxableAddress.country.name,
        category: formatTaxTypeForDisplay(item.authority.type),
        authorityName: item.authority.name,
        amount: item.taxAmount.display,
        isRefund: item.isRefund,
        underlineRow: index == 0,
      };
    });
  }, [items]);

  const refundRows: ReadonlyArray<DisplayRow> = useMemo(() => {
    const refundItems = items.filter((item) => item.isRefund);

    const refundGroups: {
      [refundId: string]: Array<PickOrderSalesTaxItem>;
    } = {};
    for (const item of refundItems) {
      const refundId = item.refundItemId;
      if (refundId == null) {
        continue;
      }

      if (refundId in refundGroups) {
        refundGroups[refundId].push(item);
      } else {
        refundGroups[refundId] = [item];
      }
    }

    let refundRows: ReadonlyArray<DisplayRow> = [];
    for (const refundGroup of Object.values(refundGroups)) {
      const groupRows = refundGroup.map((item, index) => {
        return {
          time: index == 0 ? item.createdTime.mmddyyyy : null,
          status: index == 0 ? i`Tax refunded` : null,
          country: item.taxableAddress.country.name,
          category: formatTaxTypeForDisplay(item.authority.type),
          authorityName: item.authority.name,
          amount: item.taxAmount.display,
          isRefund: item.isRefund,
          underlineRow: index == 0,
        };
      });
      refundRows = [...refundRows, ...groupRows];
    }

    return refundRows;
  }, [items]);

  if (items.length == 0) {
    return null;
  }

  return (
    <Table
      className={css(className, style)}
      data={[...refundRows, ...saleRows]}
      cellStyle={({ row }) => {
        if (!row.underlineRow) {
          return {
            borderTop: "none",
          };
        }
      }}
    >
      <Table.Column title={i`Date`} columnKey="time" noDataMessage="" />

      <Table.Column title={i`Status`} columnKey="status" noDataMessage="" />
      <Table.Column title={i`Tax type`} columnKey="category" minWidth={80} />
      <Table.Column
        title={i`Authority name`}
        columnKey="authorityName"
        minWidth={200}
        multiline
      />
      <Table.Column title={i`Amount`} columnKey="amount" minWidth={80}>
        {({ row, value }: CellInfo<DisplayRow["amount"], DisplayRow>) => {
          return (
            <div className={css(row.isRefund && styles.refundedAmount)}>
              {row.isRefund ? `- ${value}` : value}
            </div>
          );
        }}
      </Table.Column>
    </Table>
  );
};

const useStylesheet = () => {
  const { negative } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        refundedAmount: {
          color: negative,
        },
      }),
    [negative]
  );
};

type DisplayRow = {
  readonly time: string | null | undefined;
  readonly status: string | null | undefined;
  readonly amount: string;
  readonly country: string;
  readonly category: string | null | undefined;
  readonly isRefund?: boolean;
  readonly authorityName: string;
  readonly underlineRow?: boolean;
};

const formatTaxTypeForDisplay = (
  taxType: string | null | undefined
): string | null | undefined => {
  if (taxType == null) {
    return null;
  }

  if (!taxType.includes("_")) {
    return taxType;
  }

  const text = taxType.replace(/_/g, " ");

  return text
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
    .replace(`Sales Use`, `Sales/Use`);
};

export default observer(OrderTaxAuthoritiesTable);
