import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Card, { Props as CardProps } from "./Card";
import { useInfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";

const OrderDetailsCard: React.FC<Omit<CardProps, "title" | "children">> = (
  props,
) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { order, type },
  } = useInfractionContext();

  if (order == null || type === "PRODUCT_HIGH_REFUND_RATIO") {
    return null;
  }

  const {
    orderCancellationReason,
    orderId,
    orderStatus,
    orderTotal,
    availableForFulfillmentDate,
    confirmedFulfillmentDate,
    confirmedDeliveryDate,
    autoRefundedDate,
    trackingStatus,
    trackingId,
    carrier,
  } = order;

  return (
    <Card title={ci18n("card title", "Order Details")} {...props}>
      {orderCancellationReason && (
        <Markdown
          text={i`Cancellation reason: ${orderCancellationReason}`}
          style={styles.cardMargin}
        />
      )}
      <Markdown text={i`Order ID: ${orderId}`} style={styles.cardMargin} />
      <Markdown
        text={i`Order status: ${orderStatus}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Order total: ${orderTotal}`}
        style={styles.cardMargin}
      />
      {availableForFulfillmentDate != null && (
        <Markdown
          text={i`Available for fulfillment: ${availableForFulfillmentDate}`}
          style={styles.cardMargin}
        />
      )}
      {confirmedFulfillmentDate != null && (
        <Markdown
          text={i`Confirmed fulfillment date: ${confirmedFulfillmentDate}`}
          style={styles.cardMargin}
        />
      )}
      {confirmedDeliveryDate != null && (
        <Markdown
          text={i`Confirmed delivery date: ${confirmedDeliveryDate}`}
          style={styles.cardMargin}
        />
      )}
      {autoRefundedDate != null && (
        <Markdown
          text={i`Auto-refunded date: ${autoRefundedDate}`}
          style={styles.cardMargin}
        />
      )}
      {trackingStatus != null && (
        <Markdown
          text={i`Tracking status: ${trackingStatus}`}
          style={styles.cardMargin}
        />
      )}
      {trackingId != null && (
        <Markdown
          text={i`Tracking ID: ${trackingId}`}
          style={styles.cardMargin}
        />
      )}
      {carrier != null && (
        <Markdown text={i`Carrier: ${carrier}`} style={styles.cardMargin} />
      )}
    </Card>
  );
};

export default observer(OrderDetailsCard);
