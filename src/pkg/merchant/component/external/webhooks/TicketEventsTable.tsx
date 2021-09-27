import React, { useMemo } from "react";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import { default as EventsTable, Event } from "./EventsTable";
import { observer } from "mobx-react";
import { useDeciderKey } from "@merchant/stores/ExperimentStore";

const response = (
  <>
    {i`See ticket schema response as outlined here: `}
    <br />
    <Link
      href="/documentation/api/v3/reference#operation/getTicket"
      openInNewTab
    >
      https://merchant.wish.com/documentation/api/v3/reference#operation/getTicket
    </Link>
  </>
);

const TicketEventsTable = (props: BaseProps) => {
  const { className, style } = props;
  const {
    decision: showTicketAwaitingMerchant,
    isLoading: showTicketAwaitingMerchantLoading,
  } = useDeciderKey("wh_ticket_awaiting_merchant");

  const topics = useMemo((): Event[] => {
    const topics: Event[] = [];
    if (showTicketAwaitingMerchant && !showTicketAwaitingMerchantLoading) {
      topics.push({
        topic: "TICKET_AWAITING_MERCHANT",
        condition: i`A ticket is assigned/reassigned back to the merchant.`,
      });
    }
    return topics;
  }, [showTicketAwaitingMerchantLoading, showTicketAwaitingMerchant]);

  return (
    <EventsTable
      className={css(className, style)}
      topics={topics}
      response={response}
    />
  );
};

export default observer(TicketEventsTable);
