import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import ActionCard from "@core/components/ActionCard";
import { useInfractionDetailsStylesheet } from "@infractions/styles";

const ReviewInfractionDetails: React.FC = () => {
  const styles = useInfractionDetailsStylesheet();

  return (
    <ActionCard title={i`Review Infraction Details`}>
      <Markdown
        style={styles.cardMargin}
        text={i`Unfortunately, you cannot take any action on this infraction. Please review the related policy for this infraction (left) to avoid it in the future.`}
      />
      <Markdown
        style={styles.cardMarginLarge}
        text={i`Dispute status: Not Disputable`}
      />
    </ActionCard>
  );
};

export default observer(ReviewInfractionDetails);
