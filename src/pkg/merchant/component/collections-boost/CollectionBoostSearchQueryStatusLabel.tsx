import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { ThemedLabel, ThemedLabelProps } from "@ContextLogic/lego";

/* Type Imports */
import { CollectionsBoostSearchQueryState } from "@merchant/api/collections-boost";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type CollectionBoostSearchQueryStatusLabelProps = BaseProps & {
  readonly state: CollectionsBoostSearchQueryState;
};

const CollectionBoostSearchQueryStatusLabel = (
  props: CollectionBoostSearchQueryStatusLabelProps
) => {
  const { state } = props;

  let themedLabelProps: ThemedLabelProps = {
    text: i`Unknown`,
    theme: "DarkRed",
  };

  switch (state) {
    case "PENDING":
      themedLabelProps = {
        text: i`Pending`,
        theme: "DarkYellow",
        popoverContent: i`Search term's bid is pending on competitiveness check`,
      };
      break;
    case "ACCEPTED":
      themedLabelProps = {
        text: i`Accepted`,
        theme: "CashGreen",
        popoverContent: i`Search term's bid is accepted, and will be promoted`,
      };
      break;
    case "REJECTED":
      themedLabelProps = {
        text: i`Rejected`,
        theme: "DarkRed",
        popoverContent: i`Search term's bid is not high enough to be promoted`,
      };
      break;
  }
  return (
    <ThemedLabel
      width={112}
      fontWeight="regular"
      position={"top center"}
      {...themedLabelProps}
    />
  );
};

export default observer(CollectionBoostSearchQueryStatusLabel);
