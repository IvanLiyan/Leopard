import React from "react";

/* Lego Components */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import EventsTable from "./EventsTable";
import { observer } from "mobx-react";

const PenaltyEventsTable = (props: BaseProps) => {
  const { className, style } = props;
  const response = (
    <>
      {i`See penalty schema response as outlined here: `}
      <br />
      <Link href="/documentation/api/v3/reference#tag/Penalties" openInNewTab>
        https://merchant.wish.com/documentation/api/v3/reference#tag/Penalties
      </Link>
    </>
  );
  const topics = [
    {
      topic: "POLICY_PENALTY_ISSUE",
      condition: i`A penalty is issued to the merchant.`,
    },
    {
      topic: "POLICY_PENALTY_REVERSE",
      condition: i`A penalty is reversed after the merchant successfully disputes it.`,
    },
  ];

  return (
    <EventsTable
      className={css(className, style)}
      topics={topics}
      response={response}
    />
  );
};

export default observer(PenaltyEventsTable);
