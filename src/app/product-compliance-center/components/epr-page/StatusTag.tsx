import React from "react";
import { observer } from "mobx-react";
import { EprStatus } from "@product-compliance-center/api/eprQuery";
import { useTheme } from "@core/stores/ThemeStore";
import { ci18n } from "@core/toolkit/i18n";
import { Text } from "@ContextLogic/atlas-ui";

export type Props = {
  readonly status: Maybe<EprStatus>;
};

type DisplayedStatus =
  | "APPROVED"
  | "REJECTED"
  | "PENDING_REVIEW"
  | "INCOMPLETE";

const EprStatusToDisplayedStatus: {
  readonly [s in EprStatus]: DisplayedStatus;
} = {
  DELETED: "INCOMPLETE",
  ADMIN_APPROVED: "APPROVED",
  COMPLETE: "APPROVED",
  REJECTED: "REJECTED",
  IN_REVIEW: "PENDING_REVIEW",
};

const DisplayedStatusText: { readonly [s in DisplayedStatus]: string } = {
  APPROVED: ci18n("label indicating a request's status", "Approved"),
  REJECTED: ci18n("label indicating a request's status", "Rejected"),
  PENDING_REVIEW: ci18n(
    "label indicating a request's status",
    "Pending review",
  ),
  INCOMPLETE: ci18n("label indicating a request's status", "Incomplete"),
};

const StatusTag: React.FC<Props> = ({ status }) => {
  const {
    positiveLighter,
    positiveDarker,
    negativeLighter,
    negativeDarker,
    surfaceLight,
    textDark,
  } = useTheme();
  const displayedStatus: DisplayedStatus = status
    ? EprStatusToDisplayedStatus[status]
    : "INCOMPLETE";

  const DisplayedStatusBackgroundColor: {
    readonly [s in DisplayedStatus]: string;
  } = {
    APPROVED: positiveLighter,
    REJECTED: negativeLighter,
    PENDING_REVIEW: surfaceLight,
    INCOMPLETE: surfaceLight,
  };

  const DisplayedStatusTextColor: {
    readonly [s in DisplayedStatus]: string;
  } = {
    APPROVED: positiveDarker,
    REJECTED: negativeDarker,
    PENDING_REVIEW: textDark,
    INCOMPLETE: textDark,
  };

  return (
    <>
      <style jsx>{`
        div {
          display: inline-block;
          background-color: ${DisplayedStatusBackgroundColor[displayedStatus]};
          padding: 8px 16px;
          border-radius: 50vh;
        }
      `}</style>
      <div>
        <Text
          variant="bodySStrong"
          color={DisplayedStatusTextColor[displayedStatus]}
        >
          {DisplayedStatusText[displayedStatus]}
        </Text>
      </div>
    </>
  );
};

export default observer(StatusTag);
