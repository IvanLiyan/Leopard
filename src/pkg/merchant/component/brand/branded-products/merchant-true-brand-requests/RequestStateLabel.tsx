import React from "react";

/* Lego Components */
import { ThemedLabel, Theme } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { TrueBrandRequestState } from "@merchant/api/brand/true-brands";

export type RequestStatusLabelProps = BaseProps & {
  readonly state: TrueBrandRequestState;
};

const RequestStateLabel = ({ state }: RequestStatusLabelProps) => {
  let text: string;
  let theme: Theme;
  let popoverContent: string | null;

  switch (state) {
    case "PENDING_REVIEW":
    case "RESUBMIT_PENDING_REVIEW":
      theme = "DarkYellow";
      text = i`Pending`;
      popoverContent = i`Pending requests can take up to 3-5 business days to to be reviewed`;
      break;
    case "RESUBMIT":
      theme = "LightInk";
      text = i`Information required`;
      popoverContent = null;
      break;
    case "COMPLETED":
      theme = "CashGreen";
      text = i`Complete`;
      popoverContent = null;
      break;
    default:
      theme = "DarkRed";
      text = i`Rejected`;
      popoverContent = null;
  }

  return (
    <ThemedLabel width={112} theme={theme} popoverContent={popoverContent}>
      {text}
    </ThemedLabel>
  );
};

export default RequestStateLabel;
