import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { CellInfo } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import {
  OrderDetailInitialData,
  PickedWishPostShippingUpdateSchema,
} from "@toolkit/orders/detail";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly initialData: OrderDetailInitialData;
};

const WishpostShippingUpdates = ({ initialData, className, style }: Props) => {
  const styles = useStylesheet();

  const {
    fulfillment: {
      order: { wishpostShippingUpdates },
    },
  } = initialData;

  if (wishpostShippingUpdates.length == 0) {
    return null;
  }

  return (
    <Card
      title={i`WishPost Shipping Updates`}
      className={css(className, style)}
      contentContainerStyle={css(styles.root)}
    >
      <Table data={wishpostShippingUpdates}>
        <Table.Column title={i`Date`} columnKey="date.mmddyyyy" />
        <Table.Column title={i`Amount`} columnKey="amount.display" />
        <Table.Column title={i`Reason`} columnKey="reason" align="right" />
        <Table.Column
          title={i`Status`}
          columnKey="paymentDate"
          align="right"
          noDataMessage={i`To be processed`}
        >
          {({
            value: paymentDate,
          }: CellInfo<
            PickedWishPostShippingUpdateSchema["paymentDate"],
            PickedWishPostShippingUpdateSchema
          >) => {
            if (!paymentDate) {
              return i`To be processed`;
            }
            return i`Processed on ${paymentDate.mmddyyyy}`;
          }}
        </Table.Column>
      </Table>
    </Card>
  );
};

export default observer(WishpostShippingUpdates);

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        root: {},
      }),
    []
  );
