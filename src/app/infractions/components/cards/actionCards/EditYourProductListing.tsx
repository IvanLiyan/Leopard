import React, { useState } from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import Button from "./ActionCardButton";
import ActionCard from "./ActionCard";
import { merchFeURL } from "@core/toolkit/router";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import EditYourProductListingModal from "./EditYourProductListingModal";

const EditYouProductListing: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const styles = useInfractionDetailsStylesheet();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <EditYourProductListingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
      <ActionCard
        style={[className, style]}
        title={i`Edit Your Product Listing`}
        ctaButtons={
          <Button
            onClick={() => {
              setModalOpen(true);
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
          text={i`Please note that you can only use this option to edit this listing a maximum of 4 times.`}
        />
        <Markdown
          style={styles.cardMargin}
          openLinksInNewTab
          text={i`[Read our Listings Policy](${merchFeURL("/policy#listing")})`}
        />
      </ActionCard>
    </>
  );
};

export default observer(EditYouProductListing);
