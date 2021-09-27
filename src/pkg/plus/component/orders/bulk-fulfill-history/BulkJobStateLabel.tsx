import React from "react";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import { ThemedLabel, Theme } from "@ContextLogic/lego";

import { MerchantFeedJobStatus } from "@schema/types";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly status: MerchantFeedJobStatus;
};

type StatusDisplayInfo = {
  readonly theme: Theme;
  readonly text: string;
};

/* eslint-disable local-rules/unwrapped-i18n */
const InProgressDisplay: StatusDisplayInfo = {
  text: ci18n(
    "a label showing a merchant the status of a bulk CSV job, the job is in progress",
    "In progress"
  ),
  theme: "Grey",
};

const CompleteDisplay: StatusDisplayInfo = {
  text: ci18n(
    "a label showing a merchant the status of a bulk CSV job, the job has finished but may have had errors",
    "Complete"
  ),
  theme: "DarkPalaceBlue",
};

const CancelledDisplay: StatusDisplayInfo = {
  text: ci18n(
    "a label showing a merchant the status of a bulk CSV job, the job was stopped before it could complete",
    "Cancelled"
  ),
  theme: "Yellow",
};

const StatusDisplayMap: {
  [status in MerchantFeedJobStatus]: StatusDisplayInfo;
} = {
  FINISHED: CompleteDisplay,
  EXCEPTION: CompleteDisplay,
  FINISHED_AND_EMAILED: CompleteDisplay,
  NEW_AND_EMAILED: InProgressDisplay,
  RUNNING: InProgressDisplay,
  NEW: InProgressDisplay,
  PENDING: InProgressDisplay,
  CANCELLED: CancelledDisplay,
};

const BulkJobStateLabel: React.FC<Props> = (props: Props) => {
  const { status } = props;
  const { text, theme } = StatusDisplayMap[status];
  return (
    <ThemedLabel
      theme={theme}
      borderRadius={16}
      fontSize={14}
      width={120}
      style={{
        height: 24,
      }}
    >
      {text}
    </ThemedLabel>
  );
};

export default BulkJobStateLabel;
