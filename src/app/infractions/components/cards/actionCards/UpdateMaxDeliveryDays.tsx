import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import ActionCard from "./ActionCard";

const UpdateMaxDeliveryDays: React.FC<
  Pick<BaseProps, "className" | "style">
> = ({ className, style }) => {
  return (
    <ActionCard style={[className, style]} title={i`Update max delivery days`}>
      <Markdown
        text={i`To avoid future infractions like this one, set a more attainable goal for max delivery days on this product, while working to consistently maintain an acceptable warehouse Late Delivery Rate for ${4} full, consecutive weeks from the affected warehouse(s).`}
      />
    </ActionCard>
  );
};

export default observer(UpdateMaxDeliveryDays);
