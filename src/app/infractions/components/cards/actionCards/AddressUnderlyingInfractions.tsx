import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import ActionCard from "./ActionCard";

const AddressUnderlyingInfractions: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  return (
    <ActionCard
      style={[className, style]}
      title={i`Address Underlying Infractions`}
    >
      <Markdown
        text={i`Take action to close or resolve all underlying infractions (listed as Infraction Evidence) related to this infraction.`}
      />
    </ActionCard>
  );
};

export default observer(AddressUnderlyingInfractions);
