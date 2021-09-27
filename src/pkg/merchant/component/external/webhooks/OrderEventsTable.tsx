import React from "react";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Markdown, Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import EventsTable from "./EventsTable";
import { observer } from "mobx-react";

const topics = [
  {
    topic: "ORDER_RELEASE",
    condition:
      i`An order is released and ready for fulfillment. Note that some ` +
      i`orders may be released more than once.`,
  },
  {
    topic: "ORDER_FULFILLMENT_DEADLINE",
    condition: i`An order's expected ship date changes.`,
  },
  {
    topic: "ORDER_ADDRESS_CHANGE",
    condition: i`The destination address for an order changes.`,
  },
  {
    topic: "ORDER_TRACKING_UPDATE",
    condition: (
      <Markdown
        text={
          i`Any of the following events:` +
          "\n\n" +
          i`* Order is marked shipped` +
          "\n\n" +
          i`* Order is confirmed fulfilled` +
          "\n\n" +
          i`* Order is confirmed delivered` +
          "\n\n" +
          i`* Order\'s tracking is cancelled` +
          "\n\n" +
          i`* Order\'s pre-existing tracking information is modified`
        }
      />
    ),
  },
  {
    topic: "ORDER_REFUND",
    condition: i`An order is refunded or a refund is removed from the order.`,
  },
];

const response = (
  <>
    {i`See the schema response as outlined here: `}
    <br />
    <Link
      href="/documentation/api/v3/reference#operation/GetOrder"
      openInNewTab
    >
      https://merchant.wish.com/documentation/api/v3/reference#operation/GetOrder
    </Link>
  </>
);

const OrderEventsTable = (props: BaseProps) => {
  const { className, style } = props;
  return (
    <EventsTable
      className={css(className, style)}
      topics={topics}
      response={response}
    />
  );
};

export default observer(OrderEventsTable);
