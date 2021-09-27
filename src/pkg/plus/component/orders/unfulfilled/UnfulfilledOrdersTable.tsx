import React, { useMemo } from "react";

/* Legacy */
import { ci18n, cni18n } from "@legacy/core/i18n";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  Link,
  Table,
  CellInfo,
  SortOrder,
  TableProps,
  TableAction,
  BasicColumnProps,
} from "@ContextLogic/lego";

import { useUserStore } from "@merchant/stores/UserStore";

import OrderBadgeCell from "./OrderBadgeCell";
import TimeToFulfillLabel from "./TimeToFulfillLabel";
import ShippingAddressModal from "./ShippingAddressModal";
import OrderDestinationLabel from "./OrderDestinationLabel";

import { RefundOrderModal } from "@plus/component/orders/fulfillment/modals/RefundOrderModal";
import OrderProductColumn from "@plus/component/orders/order-history/OrderProductColumn";
import UncombineAplusOrderGeneralModal from "@merchant/component/logistics/epc/order/UncombineAplusOrderGeneralModal";

/* Legacy Components */
import * as urlModule from "@legacy/core/url";
import UncombineOrderModalView from "@legacy/view/modal/UncombineOrderModal";

import { OrderType, InitialData } from "@toolkit/orders/unfulfilled-orders";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";

const ProductColumnWidth = 280;

type Props = BaseProps & {
  readonly orders: ReadonlyArray<OrderType> | undefined;
  readonly initialData: InitialData;
  readonly dateSortOrder: SortOrder;
  readonly onDateSortToggled: BasicColumnProps["onSortToggled"];
  readonly selectedRowIndices: ReadonlyArray<number>;
  readonly onRowSelectionToggled: TableProps["onRowSelectionToggled"];
};

const UnfulfilledOrdersTable: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    orders,
    dateSortOrder,
    onDateSortToggled,
    selectedRowIndices,
    onRowSelectionToggled,
    initialData: {
      currentMerchant: { isMerchantPlus },
    },
  } = props;

  const tableActions = useTableActions(props);

  return (
    <Table
      className={css(className, style)}
      data={orders || []}
      actions={tableActions}
      cellPadding="8px 14px"
      highlightRowOnHover
      canSelectRow={() => true}
      selectedRows={selectedRowIndices}
      onRowSelectionToggled={onRowSelectionToggled}
      rowHeight={78}
      noDataMessage={i`No orders yet`}
      maxVisibleColumns={isMerchantPlus ? 5 : undefined}
    >
      <Table.Column
        title={i`Date`}
        columnKey="releasedTime.formatted"
        align="left"
        sortOrder={dateSortOrder}
        onSortToggled={onDateSortToggled}
        multiline
        width={70}
      />

      <Table.ObjectIdColumn
        title={i`Order ID`}
        columnKey="id"
        align="center"
        copyOnBodyClick
        width={ProductColumnWidth}
      />

      <Table.Column
        title={i`Days to fulfill`}
        columnKey="hoursLeftToFulfill"
        align="left"
      >
        {({
          value: hoursLeftToFulfill,
          row: order,
        }: CellInfo<OrderType["hoursLeftToFulfill"], OrderType>) => (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {hoursLeftToFulfill != null && (
              <TimeToFulfillLabel
                hoursLeftToFulfill={hoursLeftToFulfill}
                style={{ width: 50, margin: "0px 5px" }}
              />
            )}
          </div>
        )}
      </Table.Column>

      {!isMerchantPlus && (
        <Table.Column
          title={i`Warehouse`}
          columnKey="warehouse.unitId"
          align="left"
        />
      )}

      <Table.Column
        title={i`Destination`}
        columnKey="shippingDetails.country.code"
        align="left"
      >
        {({ row }: CellInfo<OrderType, OrderType>) => (
          <OrderDestinationLabel
            style={{
              maxWidth: 100,
            }}
            order={row}
          />
        )}
      </Table.Column>

      <Table.Column
        title={i`Ship to`}
        columnKey="shippingDetails.name"
        align="left"
        width={120}
      >
        {({ row }: CellInfo<string, OrderType>) => (
          <Link
            onClick={() => {
              if (row.shippingDetails != null) {
                new ShippingAddressModal({
                  orderId: row.id,
                  shippingDetails: row.shippingDetails,
                  canEditShippingAddress: row.canEditShippingAddress,
                  canRequestAddressVerification:
                    row.canRequestAddressVerification,
                  showAplusShippingAddressTooltip:
                    row.showAplusShippingAddressTooltip,
                }).render();
              }
            }}
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              width: "100%",
              textOverflow: "ellipsis",
              textDecoration: "none",
            }}
          >
            {row.shippingDetails?.name || i`Not available`}
          </Link>
        )}
      </Table.Column>

      <Table.Column
        title={i`Product`}
        columnKey="productId"
        align="left"
        width={ProductColumnWidth}
      >
        {({ row }: CellInfo<OrderType["productId"], OrderType>) => (
          <OrderProductColumn
            orderId={row.id}
            productId={row.productId}
            productName={row.productName}
            sku={row.skuAtPurchaseTime}
            quantity={row.quantity}
            style={{ maxWidth: ProductColumnWidth }}
          />
        )}
      </Table.Column>

      <Table.Column columnKey="badges" align="left">
        {({ row }: CellInfo<OrderType, OrderType>) => (
          <OrderBadgeCell
            style={{
              maxWidth: 250,
            }}
            order={row}
          />
        )}
      </Table.Column>

      <Table.Column
        title={i`Total Cost`}
        columnKey="totalCost.display"
        align="right"
        width={75}
      />
    </Table>
  );
};

export default UnfulfilledOrdersTable;

const useTableActions = (props: Props): ReadonlyArray<TableAction> => {
  const { isSuAdmin } = useUserStore();
  const { decision: showWPS, isLoading: showWPSIsLoading } = useDeciderKey(
    "md_wish_parcel_service"
  );
  return useMemo((): ReadonlyArray<TableAction> => {
    const actions: ReadonlyArray<TableAction> = [
      {
        key: "fulfill",
        name: (orders: ReadonlyArray<OrderType>) =>
          ci18n("'Fulfill' here is a VERB. Means to ship the order", "Fulfill"),
        canBatch: true,
        canApplyToRow: ({ isProcessing }: OrderType) => !isProcessing,
        isLoading: showWPSIsLoading,
        href: (orders: ReadonlyArray<OrderType>): string => {
          if (
            orders.length > 0 &&
            orders[0].badges.includes("WPS_ELIGIBLE") &&
            showWPS
          ) {
            const {
              [0]: { id },
            } = orders;
            return `/shipping-label/create/${id}`;
          }

          const orderIds = orders.map((order) => order.id).join(",");
          return `/plus/orders/fulfill/${orderIds}`;
        },
      },
      {
        key: "view-details",
        name: i`View details`,
        canBatch: false,
        canApplyToRow: (order: OrderType) => true,
        href: ([order]: ReadonlyArray<OrderType>) => `/order/${order.id}`,
      },
      {
        key: "refund",
        name: (orders: ReadonlyArray<OrderType>) =>
          cni18n(
            "VERB. Placed on a button merchants click to refund the order",
            orders.length,
            "Refund",
            "Refund orders"
          ),
        sentiment: "negative",
        // All unfulfilled orders are refundable
        canApplyToRow: ({ isProcessing }: OrderType) => !isProcessing,
        apply: ([order]: ReadonlyArray<OrderType>) => {
          new RefundOrderModal({
            orderId: order.id,
          }).render();
        },
      },
      {
        key: "uncombine",
        name: (orders: ReadonlyArray<OrderType>) => i`Uncombine`,
        canBatch: false,
        sentiment: "negative",
        canApplyToRow: ({ epc, isProcessing }: OrderType) =>
          !isProcessing && epc != null && epc.canUncombine,
        apply: ([order]: ReadonlyArray<OrderType>) => {
          const modal = new UncombineOrderModalView(
            order,
            urlModule,
            undefined,
            isSuAdmin
          );
          // If merchant_transaction_id is not provided this way the modal
          // thinks it is undefined
          /* @ts-ignore */
          modal.render((merchant_transaction_id = order.id));
        },
      },
      {
        key: "uncombine-from-a-plus",
        name: (orders: ReadonlyArray<OrderType>) =>
          i`Uncombine from Advanced Logistics`,
        canBatch: false,
        sentiment: "negative",
        canApplyToRow: ({ advancedLogistics, isProcessing }: OrderType) =>
          !isProcessing &&
          advancedLogistics != null &&
          advancedLogistics.canUncombine,
        apply: ([order]: ReadonlyArray<OrderType>) => {
          new UncombineAplusOrderGeneralModal({
            isValueOrder: order.requiresConfirmedDelivery || false,
            estimatedWishPostShipping: order.estimatedWishpostShipping?.amount,
            shipping: order.merchantShipping?.amount,
            productId: order.productId,
            orderId: order.id,
            isUnityOrder: order.isUnityOrder || false,
            currency: order.merchantCurrencyAtPurchaseTime,
          }).render();
        },
      },
      {
        key: "view-penalties",
        name: i`View penalties`,
        canBatch: false,
        canApplyToRow: ({ isProcessing, penalties }: OrderType) =>
          !isProcessing && penalties.length > 0,
        href: ([order]: ReadonlyArray<OrderType>) =>
          `/penalties/orders?order_id=${order.id}`,
      },
    ];

    return actions;
  }, [isSuAdmin, showWPS, showWPSIsLoading]);
};
