import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import { Button } from "@ContextLogic/atlas-ui";
import ActionCard from "./ActionCard";
import { merchFeURL } from "@core/toolkit/router";
import { useInfractionDetailsStylesheet } from "@infractions/toolkit";

const EditYouProductListing: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const styles = useInfractionDetailsStylesheet();

  return (
    <ActionCard
      style={[className, style]}
      title={i`Edit Your Product Listing`}
      ctaButtons={
        <Button
          onClick={() => {
            alert("edit listing clicked"); // TODO: this action once we have the PAER flow fixed
          }}
        >
          Edit Listing
        </Button>
      }
    >
      <Markdown
        style={styles.cardMargin}
        text={`* ${[
          i`Edit your product listing with compliant content.`,
          i`Remove all unauthorized content.`,
        ].join("\n\n* ")}`}
      />
      <Markdown
        style={styles.cardMargin}
        text={i`Editing the product listing will not reverse the infraction until Wish reviews and approves it.`}
      />
      <Markdown
        style={styles.cardMargin}
        openLinksInNewTab
        text={i`[Read our Listings Policy](${merchFeURL("/policy#listing")})`}
      />
    </ActionCard>
  );
};

export default observer(EditYouProductListing);
