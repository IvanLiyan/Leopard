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

const InfractionImpactCard: React.FC<Props> = ({
  className,
  style,
  infractionId,
}) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    data: { infractionImpacts, wssImpact },
  } = useInfraction(infractionId);

  return (
    <Card title={i`Infraction Impact`} style={[className, style]}>
      {infractionImpacts && infractionImpacts.length > 0 && (
        <Markdown
          text={`* ${infractionImpacts.join("\n\n* ")}`}
          style={styles.cardItem}
        />
      )}
      <Markdown
        text={i`Wish Standards tier impact: ${wssImpact ? "Yes" : "No"}`}
        style={styles.cardItem}
      />
    </Card>
  );
};

export default observer(InfractionImpactCard);
