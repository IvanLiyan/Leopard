import React from "react";
import { observer } from "mobx-react";
import { Markdown } from "@ContextLogic/lego";
import {
  useInfraction,
  useInfractionDetailsStylesheet,
} from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = Pick<BaseProps, "className" | "style"> & {
  readonly infractionId: string;
};

const InfractionDetailsCard: React.FC<Props> = ({
  className,
  style,
  infractionId,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    data: { title, body, policy, faq, state, issuedDate },
  } = useInfraction(infractionId);

  return (
    <Card title={title} style={[className, style]}>
      <Markdown text={body} style={[styles.bodyText, styles.cardItem]} />
      <Markdown text={i`Related policy: ${policy}`} style={styles.cardItem} />
      <Markdown text={i`Related FAQ: ${faq}`} style={styles.cardItem} />
      <Markdown
        text={i`Infraction ID: ${infractionId}`}
        style={styles.cardItem}
      />
      <Markdown text={i`Infraction state: ${state}`} style={styles.cardItem} />
      <Markdown
        text={i`Infraction issue date: ${issuedDate}`}
        style={styles.cardItem}
      />
    </Card>
  );
};

export default observer(InfractionDetailsCard);
