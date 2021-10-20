import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Table } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Legacy */
import { ci18n, cni18n } from "@legacy/core/i18n";

import ProductImage from "@merchant/component/products/ProductImage";
import OrderStateLabel from "./OrderStateLabel";
import OrderPaymentStateLabel from "./OrderPaymentStateLabel";
import { ObjectId } from "@ContextLogic/lego";
import { RefundOrderModal } from "@plus/component/orders/fulfillment/modals/RefundOrderModal";
import ConfirmedDeliveryIcon from "@plus/component/orders/fulfillment/icons/ConfirmedDeliveryIcon";
import WishExpressIcon from "@plus/component/orders/fulfillment/icons/WishExpressIcon";

import { Datetime, OrderSchema, ShippingDetailsSchema } from "@schema/types";
import { CurrencyValue } from "@schema/types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { CellInfo, SortOrder, BasicColumnProps } from "@ContextLogic/lego";
import { TableProps, TableAction } from "@ContextLogic/lego";

import { weightMedium } from "@toolkit/fonts";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";

export type OrderType = Pick<
  OrderSchema,
  | "id"
  | "state"
  | "productId"
  | "hoursLeftToFulfill"
  | "quantity"
  | "canRefund"
  | "requiresConfirmedDelivery"
  | "isWishExpress"
> & {
  readonly shippingDetails: Pick<ShippingDetailsSchema, "name"> | null;
  readonly totalCost: Pick<CurrencyValue, "display">;
  readonly releasedTime: Pick<Datetime, "formatted">;
  readonly deliveryDeadline: Pick<Datetime, "mmddyyyy">;
};

type Props = BaseProps & {
  readonly orders: ReadonlyArray<OrderType> | undefined;
  readonly dateSortOrder: SortOrder;
  readonly onDateSortToggled: BasicColumnProps["onSortToggled"];
  readonly selectedRowIndeces: ReadonlyArray<number>;
  readonly onRowSelectionToggled: TableProps["onRowSelectionToggled"];
};

const OrderHistoryTable: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    orders,
    dateSortOrder,
    onDateSortToggled,
    selectedRowIndeces,
    onRowSelectionToggled,
  } = props;
  const styles = useStylesheet();
  const tableActions = useTableActions(props);

  return (
    <Table
      className={css(styles.root, className, style)}
      data={orders || []}
      actions={tableActions}
      cellPadding="8px 14px"
      highlightRowOnHover
      actionColumnWidth={200}
      rowHeight={60}
      noDataMessage={i`No orders yet`}
      canSelectRow={() => true}
      selectedRows={selectedRowIndeces}
      onRowSelectionToggled={onRowSelectionToggled}
    >
      <Table.Column
        title={i`Date`}
        columnKey="releasedTime.formatted"
        align="left"
        sortOrder={dateSortOrder}
        onSortToggled={onDateSortToggled}
      />

      <Table.Column title={i`Order ID`} columnKey="id" align="left" width={120}>
        {({ row: order }: CellInfo<OrderType["id"], OrderType>) => (
          <div className={css(styles.imageContainer)}>
            <ProductImage
              productId={order.productId}
              className={css(styles.orderImage)}
            />
            <ObjectId
              className={css(styles.orderId)}
              id={order.id}
              copyOnBodyClick={false}
              prompt={i`Copy Order ID`}
            />
          </div>
        )}
      </Table.Column>

      <Table.Column
        title={ci18n("Order state, like SHIPPED or REFUNDED", "State")}
        columnKey="state"
        align="left"
      >
        {({
          value: state,
          row: order,
        }: CellInfo<OrderType["state"], OrderType>) => (
          <div className={css(styles.stateCell)}>
            <OrderStateLabel state={state} style={{ width: 80 }} />
            {order.requiresConfirmedDelivery && (
              <ConfirmedDeliveryIcon style={{ margin: "0px 2.5px" }} />
            )}
            {order.isWishExpress && (
              <WishExpressIcon
                style={{ margin: "0px 2.5px" }}
                deliveryDeadline={order.deliveryDeadline.mmddyyyy}
              />
            )}
          </div>
        )}
      </Table.Column>
      <Table.Column
        title={i`Total Cost`}
        columnKey="totalCost.display"
        align="center"
        width={75}
      />
      <Table.Column title={i`Payment`} columnKey="paymentStatus" align="left">
        {({ value: state }) => (
          <OrderPaymentStateLabel state={state} style={{ width: 80 }} />
        )}
      </Table.Column>
    </Table>
  );
};

export default OrderHistoryTable;

const useTableActions = (props: Props): ReadonlyArray<TableAction> => {
  return useMemo((): ReadonlyArray<TableAction> => {
    const actions: ReadonlyArray<TableAction> = [
      {
        key: "view-details",
        name: i`View details`,
        canBatch: false,
        canApplyToRow: (order: OrderType) => true,
        href: ([order]: ReadonlyArray<OrderType>) => {
          return `/order/${order.id}`;
        },
      },
      {
        key: "refund",
        name: (orders: ReadonlyArray<OrderType>) =>
          cni18n(
            "VERB. Placed on a button merchants click to refund the order",
            orders.length,
            "Refund",
            "Refund orders",
          ),
        sentiment: "negative",
        canApplyToRow: ({ canRefund }: OrderType) => canRefund,
        apply: ([order]: ReadonlyArray<OrderType>) => {
          new RefundOrderModal({
            orderId: order.id,
          }).render();
        },
      },
    ];

    return actions;
  }, []);
};

const useStylesheet = () => {
  const { primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {},
        imageContainer: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
        orderImage: {
          width: 50,
        },
        orderId: {
          marginLeft: 15,
          color: primary,
          fontSize: 15,
          userSelect: "none",
          whiteSpace: "nowrap",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: weightMedium,
        },
        stateCell: {
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        },
      }),
    [primary],
  );
};
