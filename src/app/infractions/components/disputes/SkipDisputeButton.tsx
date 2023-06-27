import { Button } from "@ContextLogic/lego";
import { ci18n } from "@core/toolkit/i18n";
import {
  useBulkDisputeContext,
  useBulkDisputeInfractionIds,
} from "@infractions/DisputeContext";
import { observer } from "mobx-react";

const SkipDisputeButton: React.FC = () => {
  const [bulkInfractionIds] = useBulkDisputeInfractionIds();
  const { onExitDispute } = useBulkDisputeContext();
  if (bulkInfractionIds.length <= 1) {
    return null;
  }
  return (
    <Button style={{ marginRight: "10px" }} onClick={onExitDispute}>
      {ci18n("CTA text", "Skip")}
    </Button>
  );
};

export default observer(SkipDisputeButton);
