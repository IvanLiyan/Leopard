import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Card, { Props as CardProps } from "./Card";
import { useInfractionContext } from "@infractions/InfractionContext";

const InfractionDetailsCard: React.FC<Omit<CardProps, "title" | "children">> = (
  props,
) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { id, title, body, policy, faq, state, issuedDate },
  } = useInfractionContext();

  return (
    <Card title={props.asAccordion ? i`Infraction Details` : title} {...props}>
      <Markdown text={body} style={[styles.bodyText, styles.cardMargin]} />
      {policy && (
        <Markdown
          text={i`Related policy: ${policy}`}
          style={styles.cardMargin}
        />
      )}
      {faq && (
        <Markdown text={i`Related FAQ: ${faq}`} style={styles.cardMargin} />
      )}
      <Markdown text={i`Infraction ID: ${id}`} style={styles.cardMargin} />
      <Markdown
        text={i`Infraction state: ${state}`}
        style={styles.cardMargin}
      />
      <Markdown
        text={i`Infraction issue date: ${issuedDate}`}
        style={styles.cardMargin}
      />
    </Card>
  );
};

export default observer(InfractionDetailsCard);
