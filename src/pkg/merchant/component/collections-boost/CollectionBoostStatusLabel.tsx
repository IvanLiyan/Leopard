import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { ThemedLabel, ThemedLabelProps } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type CollectionBoostStatusLabelProps = BaseProps & {
  readonly status: string;
};

const CollectionBoostStatusLabel = (props: CollectionBoostStatusLabelProps) => {
  const { status } = props;

  let themedLabelProps: ThemedLabelProps = {
    text: i`Unknown`,
    theme: "DarkRed",
  };
  switch (status) {
    case "NEW":
      themedLabelProps = {
        text: i`New`,
        theme: "CashGreen",
      };
      break;

    case "PENDING":
      themedLabelProps = {
        text: i`Pending`,
        theme: "DarkYellow",
      };
      break;
    case "VALIDATING":
      themedLabelProps = {
        text: i`Validating`,
        theme: `Cyan`,
      };
      break;
    case "STARTED":
      themedLabelProps = {
        text: i`Started`,
        theme: "WishBlue",
      };
      break;
    case "APPROVED":
      themedLabelProps = {
        text: i`Approved`,
        theme: "CashGreen",
      };
      break;
    case "CANCELED":
      themedLabelProps = {
        text: i`Cancelled`,
        theme: "DarkRed",
      };
      break;
    case "REJECTED":
      themedLabelProps = {
        text: i`Rejected`,
        theme: "DarkRed",
      };
      break;
    case "ENDED":
      themedLabelProps = {
        text: i`Ended`,
        theme: "DarkInk",
      };
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

export default observer(CollectionBoostStatusLabel);
