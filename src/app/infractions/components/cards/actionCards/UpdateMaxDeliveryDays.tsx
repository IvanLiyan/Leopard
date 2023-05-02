import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import ActionCard from "@core/components/ActionCard";

const UpdateMaxDeliveryDays: React.FC = () => {
  return (
    <ActionCard title={i`Update Max Delivery Days`}>
      <Markdown
        text={i`To avoid future infractions like this one, set a more attainable goal for Max Delivery Days on this product, while working to consistently maintain an acceptable warehouse Late Delivery Rate for ${4} full, consecutive weeks from the affected warehouse(s).`}
      />
    </ActionCard>
  );
};

export default observer(UpdateMaxDeliveryDays);
