import React from "react";
import { observer } from "mobx-react";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Markdown from "@infractions/components/Markdown";
import ActionCard from "./ActionCard";

const PayWishPostBalance: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  return (
    <ActionCard style={[className, style]} title={i`Pay WishPost Balance`}>
      <Markdown
        text={i`To have this infraction reversed, please re-pay your WishPost account balance in full.`}
      />
    </ActionCard>
  );
};

export default observer(PayWishPostBalance);
