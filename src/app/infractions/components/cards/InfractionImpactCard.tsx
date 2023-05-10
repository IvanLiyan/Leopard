import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useInfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";
import { zendeskURL } from "@core/toolkit/url";

const InfractionImpactCard: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const styles = useInfractionDetailsStylesheet();
  const {
    infraction: { infractionImpacts, wssImpact },
  } = useInfractionContext();

  const combinedInfractionImpacts = [
    ...infractionImpacts,
    i`[Wish Standards](${zendeskURL("4408084779547")}) tier impact: ${
      wssImpact ? i`Yes` : i`No`
    }`,
  ];

  if (combinedInfractionImpacts.length === 0) {
    return null;
  }

  return (
    <Card
      title={ci18n("card title", "Infraction Impact")}
      style={[className, style]}
    >
      <Markdown
        text={`* ${combinedInfractionImpacts.join("\n\n* ")}`}
        style={styles.cardMargin}
      />
    </Card>
  );
};

export default observer(InfractionImpactCard);
