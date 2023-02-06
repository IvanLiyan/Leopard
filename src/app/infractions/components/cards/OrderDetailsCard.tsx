import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { InfractionContext } from "@infractions/InfractionContext";

const OrderDetailsCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: {
      orderCancellationReason,
      orderId: orderID,
      orderStatus,
      orderTotal,
      wishLogisticsProgram,
      availableForFulfillmentDate,
      confirmedFulfillmentDate,
      confirmedDeliveryDate,
      autoRefundedDate,
      trackingStatus,
      trackingId: trackingID,
      carrier,
    },
  } = useContext(InfractionContext);

  return (
    <Card title={i`Order Details`} style={[className, style]}>
      <Markdown
        text={i`Cancellation reason: ${orderCancellationReason}`}
        style={styles.cardMargin}
      />
      <Markdown text={i`Order ID: ${orderID}`} style={styles.cardMargin} />
      <Markdown
        text={i`Order status: ${orderStatus}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Order total: ${orderTotal}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Wish logistics program: ${wishLogisticsProgram}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Available for fulfillment: ${availableForFulfillmentDate}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Confirmed fulfillment date: ${confirmedFulfillmentDate}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Confirmed delivery date: ${confirmedDeliveryDate}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Auto-refunded date: ${autoRefundedDate}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Tracking status: ${trackingStatus}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Tracking ID: ${trackingID}`}
        style={styles.cardMargin}
      />
      <Markdown text={i`Carrier: ${carrier}`} style={styles.cardMargin} />
    </Card>
  );
};

export default observer(OrderDetailsCard);
