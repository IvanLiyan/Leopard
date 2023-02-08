import React, { useContext } from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import { Button } from "@ContextLogic/atlas-ui";
import ActionCard from "./ActionCard";
import { merchFeURL } from "@core/toolkit/router";
import { InfractionContext } from "@infractions/InfractionContext";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";

const ProvideProofOfAuthenticity: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const {
    infraction: { brandName },
  } = useContext(InfractionContext);
  const styles = useInfractionDetailsStylesheet();

  return (
    <ActionCard
      style={[className, style]}
      title={i`Provide Proof of Authenticity`}
      ctaButtons={
        <>
          <Button
            secondary
            onClick={() => {
              alert("submit new proof of authenticity clicked"); // TODO
            }}
          >
            Submit New Proof of Authenticity
          </Button>
          <Button
            onClick={() => {
              alert("use existing proof of authenticity clicked"); // TODO
            }}
          >
            Use Existing Proof of Authenticity
          </Button>
        </>
      }
    >
      <Markdown
        style={styles.cardMargin}
        text={`* ${[
          i`Contact the brand owner to receive authorization.`,
          i`Provide proof of authenticity to sell ${brandName} products on Wish.`,
        ].join("\n\n* ")}`}
      />
      <Markdown
        style={styles.cardMargin}
        text={i`If we receive proof of authenticity, Wish will rescind the infraction.`}
      />
      <Markdown
        style={styles.cardMargin}
        openLinksInNewTab
        text={i`[Learn how to get proof of authenticity](${merchFeURL(
          "#todo",
        )})`}
      />
    </ActionCard>
  );
};

export default observer(ProvideProofOfAuthenticity);
