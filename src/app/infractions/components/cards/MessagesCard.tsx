/* eslint-disable no-console */
import React, { useState } from "react";
import { observer } from "mobx-react";
import { useMessages } from "@infractions/toolkit";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Conversation from "@core/components/conversation/Conversation";

type Props = Pick<BaseProps, "className" | "style"> & {
  readonly infractionId: string;
};

const InfractionDetailsCard: React.FC<Props> = ({
  className,
  style,
  infractionId,
}) => {
  const messages = useMessages(infractionId);
  const [response, setResponse] = useState<string | undefined>();

  return (
    <Card title={i`Messages`} style={[className, style]}>
      <Conversation
        messageGroups={messages}
        response={response}
        onResponseChange={({ text }) => {
          setResponse(text);
        }}
        onSubmit={() => {
          alert("submit clicked");
        }}
        responseProps={{
          placeholder: "override",
          onMouseOver: () => {
            console.log("mouse over");
          },
        }}
        onFileUpload={() => {
          alert("file upload clicked");
        }}
      />
    </Card>
  );
};

export default observer(InfractionDetailsCard);
