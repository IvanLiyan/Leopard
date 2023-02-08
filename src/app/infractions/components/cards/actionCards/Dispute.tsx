import React, { useContext } from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import { Button } from "@ContextLogic/atlas-ui";
import ActionCard from "./ActionCard";
import { InfractionContext } from "@infractions/InfractionContext";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import { ci18n } from "@core/toolkit/i18n";

const Dispute: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const {
    infraction: { disputeStatus, disputeDeadline },
  } = useContext(InfractionContext);
  const styles = useInfractionDetailsStylesheet();

  return (
    <ActionCard
      style={[className, style]}
      title={ci18n("card title", "Dispute")}
      ctaButtons={
        <Button
          onClick={() => {
            alert("dispute clicked"); // TODO
          }}
        >
          Dispute Infraction
        </Button>
      }
    >
      <Markdown
        style={styles.cardMargin}
        text={i`You can dispute this infraction within ${90} calendar days of its creation. Successfully disputing will reverse any consequences caused by this infraction, but it won't impact any other disputes.`}
      />
      <Markdown
        style={styles.cardMarginLarge}
        text={i`Dispute status: ${disputeStatus}`}
      />
      <Markdown
        style={styles.cardMarginSmall}
        text={i`Dispute deadline: ${disputeDeadline}`}
      />
    </ActionCard>
  );
};

export default observer(Dispute);
