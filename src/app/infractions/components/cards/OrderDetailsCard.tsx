import React from "react";
import { observer } from "mobx-react";
import { Markdown } from "@ContextLogic/lego";
import {
  useInfraction,
  useInfractionDetailsStylesheet,
} from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = Pick<BaseProps, "className" | "style"> & {
  readonly infractionId: string;
};

const OrderDetailsCard: React.FC<Props> = ({
  className,
  style,
  infractionId,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    data: {
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
  } = useInfraction(infractionId);

  return (
    <Card title={i`Order Details`} style={[className, style]}>
      <Markdown
        text={i`Cancellation reason: ${orderCancellationReason}`}
        style={styles.cardItem}
      />
      <Markdown text={i`Order ID: ${orderID}`} style={styles.cardItem} />
      <Markdown
        text={i`Order status: ${orderStatus}`}
        style={styles.cardItem}
      />
      <Markdown text={i`Order total: ${orderTotal}`} style={styles.cardItem} />
      <Markdown
        text={i`Wish logistics program: ${wishLogisticsProgram}`}
        style={styles.cardItem}
      />
      <Markdown
        text={i`Available for fulfillment: ${availableForFulfillmentDate}`}
        style={styles.cardItem}
      />
      <Markdown
        text={i`Confirmed fulfillment date: ${confirmedFulfillmentDate}`}
        style={styles.cardItem}
      />
      <Markdown
        text={i`Confirmed delivery date: ${confirmedDeliveryDate}`}
        style={styles.cardItem}
      />
      <Markdown
        text={i`Auto-refunded date: ${autoRefundedDate}`}
        style={styles.cardItem}
      />
      <Markdown
        text={i`Tracking status: ${trackingStatus}`}
        style={styles.cardItem}
      />
      <Markdown text={i`Tracking ID: ${trackingID}`} style={styles.cardItem} />
      <Markdown text={i`Carrier: ${carrier}`} style={styles.cardItem} />
    </Card>
  );
};

export default observer(OrderDetailsCard);
