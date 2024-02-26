/* moved from
 * @plus/component/orders/bulk-fulfill-history/BulkJobStateLabel.tsx
 * by https://gist.github.com/yuhchen-wish/b80dd7fb4233edf447350a7daec083b1
 * on 1/18/2022
 */

import React from "react";

/* Legacy */
import { ci18n } from "@core/toolkit/i18n";

/* Lego Components */
import { ThemedLabel, Theme } from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly status: string;
};

type StatusDisplayInfo = {
  readonly theme: Theme;
  readonly text: string;
};

/* eslint-disable local-rules/unwrapped-i18n */
const getStatusDisplayInfo: Record<string, StatusDisplayInfo> = {
  "In Progress": {
    text: ci18n(
      "a label showing a merchant the status of a bulk CSV job, the job is in progress",
      "In progress",
    ),
    theme: "DarkPalaceBlue",
  },
  Failed: {
    text: ci18n(
      "a label showing a merchant the status of a bulk CSV job, the job was stopped before it could complete",
      "Failed",
    ),
    theme: "Red",
  },
  "Completed with errors": {
    text: ci18n(
      "a label showing a merchant the status of a bulk CSV job, the job has finished but may have had errors",
      "Completed with errors",
    ),
    theme: "Yellow",
  },
  Completed: {
    text: ci18n(
      "a label showing a merchant the status of a bulk CSV job, the job has finished but may have had errors",
      "Completed",
    ),
    theme: "LighterCyan",
  },
  default: {
    text: "Unknown status",
    theme: "Grey",
  },
};

const BulkJobStateLabel: React.FC<Props> = (props: Props) => {
  const { status } = props;
  const { text, theme } = getStatusDisplayInfo[status];
  return (
    <ThemedLabel
      theme={theme}
      fontSize={14}
      popoverMaxWidth={132}
      style={{
        height: 24,
        borderRadius: 4,
      }}
    >
      {text}
    </ThemedLabel>
  );
};

export default BulkJobStateLabel;
