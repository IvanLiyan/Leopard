import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import ActionCard from "@core/components/ActionCard";

const PayWishPostBalance: React.FC = () => {
  return (
    <ActionCard title={i`Pay WishPost Balance`}>
      <Markdown
        text={i`To have this infraction reversed, please re-pay your WishPost account balance in full.`}
      />
    </ActionCard>
  );
};

export default observer(PayWishPostBalance);
