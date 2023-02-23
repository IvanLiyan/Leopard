import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import { Button } from "@ContextLogic/atlas-ui";
import ActionCard from "./ActionCard";
import { useInfractionDetailsStylesheet } from "@infractions/styles";

const GetProductAuthorization: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const brandName = "TODO"; // removing this card and replacing with updated copy in the description
  const styles = useInfractionDetailsStylesheet();

  return (
    <ActionCard
      style={[className, style]}
      title={i`Get Product Authorization`}
      ctaButtons={
        <Button
          onClick={() => {
            alert("submit product authorization clicked"); // TODO
          }}
        >
          Submit Product Authorization
        </Button>
      }
    >
      <Markdown
        style={styles.cardMargin}
        text={`* ${[
          i`Contact the brand owner to receive authorization.`,
          i`Provide proof of authorization to sell ${brandName} on Wish.`,
        ].join("\n\n* ")}`}
      />
      <Markdown
        style={styles.cardMargin}
        text={i`If you receive product authorization, Wish will rescind the infraction, allow you to sell this product in approved countries/regions, and make the listing available for sale.`}
      />
    </ActionCard>
  );
};

export default observer(GetProductAuthorization);
