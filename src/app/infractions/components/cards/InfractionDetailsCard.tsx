import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { InfractionContext } from "@infractions/InfractionContext";

const InfractionDetailsCard: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { id, title, body, policy, faq, state, issuedDate },
  } = useContext(InfractionContext);

  return (
    <Card title={title} style={[className, style]}>
      <Markdown text={body} style={[styles.bodyText, styles.cardMargin]} />
      <Markdown text={i`Related policy: ${policy}`} style={styles.cardMargin} />
      <Markdown text={i`Related FAQ: ${faq}`} style={styles.cardMargin} />
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
