import React from "react";
import { observer } from "mobx-react";
import Markdown from "@infractions/components/Markdown";
import ActionCard from "@core/components/ActionCard";

const AddressUnderlyingInfractions: React.FC = () => {
  return (
    <ActionCard title={i`Address Underlying Infractions`}>
      <Markdown
        text={i`Take action to close or resolve all underlying infractions (listed as Infraction Evidence) related to this infraction.`}
      />
    </ActionCard>
  );
};

export default observer(AddressUnderlyingInfractions);
