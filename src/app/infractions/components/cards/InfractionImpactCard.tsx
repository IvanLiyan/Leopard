import React, { useContext } from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { InfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";

const InfractionImpactCard: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { infractionImpacts, wssImpact },
  } = useContext(InfractionContext);

  return (
    <Card
      title={ci18n("card title", "Infraction Impact")}
      style={[className, style]}
    >
      {infractionImpacts && infractionImpacts.length > 0 && (
        <Markdown
          text={`* ${infractionImpacts.join("\n\n* ")}`}
          style={styles.cardMargin}
        />
      )}
      <Markdown
        text={i`Wish Standards tier impact: ${wssImpact ? "Yes" : "No"}`}
        style={styles.cardMargin}
      />
    </Card>
  );
};

export default observer(InfractionImpactCard);
