import React from "react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { ThemedLabel } from "@ContextLogic/lego";

import { CommerceTransactionState } from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly state: CommerceTransactionState;
  readonly isProcessing?: boolean; // processing separate from order state in BE
};

const LabelText: { [state in CommerceTransactionState]: string } = {
  APPROVED: ci18n(
    "a label showing a merchant the status of an order, this order is ready to be shipped",
    "Ready to be shipped"
  ),
  SHIPPED: ci18n(
    "a label showing a merchant the status of an order, this order has been shipped",
    "Shipped"
  ),
  REFUNDED: ci18n(
    "a label showing a merchant the status of an order, this order has been refunded",
    "Refunded"
  ),
  REQUIRE_REVIEW: ci18n(
    "a label showing a merchant the status of an order, this order is under review",
    "Under Review"
  ),
  EXCEPTION: ci18n(
    "a label showing a merchant the status of an order, an error has occured with the order",
    "Error"
  ),
  LABEL_GENERATED: ci18n(
    "a label showing a merchant the status of an order, this order's shipping label has been generated",
    "Shipping label generated"
  ),
  LABEL_DOWNLOADED: ci18n(
    "a label showing a merchant the status of an order, this order's shipping label has been downloaded",
    "Shipping label downloaded"
  ),
  DELAYING: ci18n(
    "a label showing a merchant the status of an order, this order is being delayed",
    "Delaying"
  ),
  PENDING: ci18n(
    "a label showing a merchant the status of an order, payment is pending for this order",
    "Payment Pending"
  ),
  DECLINED: ci18n(
    "a label showing a merchant the status of an order, payment has been declined for this order",
    "Payment Declined"
  ),

  // deprecated labels that should not be sent back from the BE, values required for TS
  ACKNOWLEDGED: ci18n(
    "a label showing a merchant the status of an order, an error has occured with the order",
    "Error"
  ),
  GIFT_WAITING_FOR_ACCEPT: ci18n(
    "a label showing a merchant the status of an order, an error has occured with the order",
    "Error"
  ),
  C2C_ACCEPTED: ci18n(
    "a label showing a merchant the status of an order, an error has occured with the order",
    "Error"
  ),
  C2C_DELIVERED: ci18n(
    "a label showing a merchant the status of an order, an error has occured with the order",
    "Error"
  ),
  C2C_ON_DELIVERY: ci18n(
    "a label showing a merchant the status of an order, an error has occured with the order",
    "Error"
  ),
};

const PROCESSING_LABEL_TEXT = ci18n(
  "a label showing a merchant the status of an order, this order is being processed",
  "Processing"
);

const OrderStateLabel: React.FC<Props> = (props: Props) => {
  const { style, className, state, isProcessing } = props;
  const text = LabelText[state];
  return (
    /* eslint-disable local-rules/unwrapped-i18n */
    <ThemedLabel className={css(style, className)} theme="Grey">
      {isProcessing ? PROCESSING_LABEL_TEXT : text}
    </ThemedLabel>
  );
};

export default OrderStateLabel;
