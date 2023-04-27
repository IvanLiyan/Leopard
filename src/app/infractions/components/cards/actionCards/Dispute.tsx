import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import ActionCard from "./ActionCard";
import { useInfractionContext } from "@infractions/InfractionContext";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import { ci18n } from "@core/toolkit/i18n";
import { DisputeStatusDisplayText } from "@infractions/copy";
import Button from "./ActionCardButton";
import NextLink from "next/link";

const Dispute: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const {
    infraction: { id, disputeStatus, disputeDeadline },
  } = useInfractionContext();
  const styles = useInfractionDetailsStylesheet();

  const disputeUrl = `/warnings/appeal?id=${id}`;

  return (
    <ActionCard
      style={[className, style]}
      title={ci18n("card title", "Dispute")}
      ctaButtons={
        <NextLink href={disputeUrl} passHref>
          <Button href={disputeUrl} data-cy="dispute-button">
            Dispute Infraction
          </Button>
        </NextLink>
      }
    >
      <Markdown
        style={styles.cardMargin}
        text={i`You can dispute this infraction within 90 calendar days of its creation. Successfully disputing will reverse any consequences caused by this infraction, but it won't impact any other disputes.`}
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
