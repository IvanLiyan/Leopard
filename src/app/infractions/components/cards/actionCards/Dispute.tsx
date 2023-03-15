import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import { Button, Tooltip } from "@ContextLogic/atlas-ui";
import ActionCard from "./ActionCard";
import { useInfractionContext } from "@infractions/InfractionContext";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { ci18n } from "@core/toolkit/i18n";
import { DisputeStatusDisplayText } from "@infractions/toolkit";
import { merchFeURL } from "@core/toolkit/router";

const Dispute: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const {
    infraction: { id, disputeStatus, disputeDeadline, disputeDeadlineUnix },
  } = useInfractionContext();
  const styles = useInfractionDetailsStylesheet();

  const now = Date.now() / 1000;

  // fixing in follow PR where we add logic for handling dispute type
  // eslint-disable-next-line no-constant-condition
  const disputeUrl = true
    ? `appeal?id=${id}`
    : merchFeURL(`/dispute-infraction/${id}`);

  const DisputeButton = ({ disabled }: { disabled?: boolean }) => (
    <Button href={disputeUrl} disabled={disabled}>
      Dispute Infraction
    </Button>
  );

  return (
    <ActionCard
      style={[className, style]}
      title={ci18n("card title", "Dispute")}
      ctaButtons={
        now > disputeDeadlineUnix ? (
          <Tooltip
            title={i`You cannot take this action because the dispute deadline has passed.`}
            placement="bottom"
          >
            {/* excess div required since Mui disables tooltips wrapping disabled buttons */}
            <div>
              <DisputeButton disabled />
            </div>
          </Tooltip>
        ) : (
          <DisputeButton />
        )
      }
    >
      <Markdown
        style={styles.cardMargin}
        text={i`You can dispute this infraction within ${90} calendar days of its creation. Successfully disputing will reverse any consequences caused by this infraction, but it won't impact any other disputes.`}
      />
      <Markdown
        style={styles.cardMarginLarge}
        text={i`Dispute status: ${DisputeStatusDisplayText[disputeStatus]}`}
      />
      <Markdown
        style={styles.cardMarginSmall}
        text={i`Dispute deadline: ${disputeDeadline}`}
      />
    </ActionCard>
  );
};

export default observer(Dispute);
