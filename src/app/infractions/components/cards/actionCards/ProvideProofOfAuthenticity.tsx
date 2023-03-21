import React, { useState } from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import Button from "./ActionCardButton";
import ActionCard from "./ActionCard";
import { merchFeURL } from "@core/toolkit/router";
import { useInfractionContext } from "@infractions/InfractionContext";
import { useInfractionDetailsStylesheet } from "@infractions/styles";
import UseExistingProofModal from "./UseExistingProofModal";

const ProvideProofOfAuthenticity: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  const {
    infraction: { id: infractionId, brand, brandAuthorizations },
  } = useInfractionContext();
  const styles = useInfractionDetailsStylesheet();
  const [modalOpen, setModalOpen] = useState(false);

  const showUseExistingProofs = brandAuthorizations.length > 0;

  return (
    <>
      <UseExistingProofModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        existingProofs={brandAuthorizations}
      />
      <ActionCard
        style={[className, style]}
        title={i`Provide Proof of Authenticity`}
        ctaButtons={
          <>
            {/* @ts-expect-error PR coming to allow below secondary usage */}
            <Button
              secondary={showUseExistingProofs ? true : undefined}
              href={merchFeURL(
                `/brand-authorization/create/new?infractionId=${infractionId}`,
              )}
            >
              Submit New Proof of Authenticity
            </Button>
            {showUseExistingProofs && (
              <Button
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                Use Existing Proof of Authenticity
              </Button>
            )}
          </>
        }
      >
        <Markdown
          style={styles.cardMargin}
          text={`* ${[
            i`Contact the brand owner to receive authorization.`,
            brand?.brandName
              ? i`Provide proof of authenticity to sell ${brand.brandName} products on Wish.`
              : i`Provide proof of authenticity to sell this brand's products on Wish.`,
          ].join("\n\n* ")}`}
        />
        <Markdown
          style={styles.cardMargin}
          text={i`If we receive proof of authenticity, Wish will rescind the infraction.`}
        />
        <Markdown
          style={styles.cardMargin}
          openLinksInNewTab
          text={i`[Learn how to get proof of authenticity](${"https://www.wish.com/intellectual-property"})`}
        />
      </ActionCard>
    </>
  );
};

export default observer(ProvideProofOfAuthenticity);
