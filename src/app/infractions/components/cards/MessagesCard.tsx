/* eslint-disable no-console */
import React, { useContext, useState } from "react";
import { observer } from "mobx-react";
import { useMessages } from "@infractions/queries/messages";
import Card from "./Card";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import Conversation, {
  Attachment,
} from "@core/components/conversation/Conversation";
import { InfractionContext } from "@infractions/InfractionContext";
import { ci18n } from "@core/toolkit/i18n";

const MessagesCard: React.FC<Pick<BaseProps, "className" | "style">> = ({
  className,
  style,
}) => {
  const {
    infraction: { id },
  } = useContext(InfractionContext);
  const messages = useMessages(id);
  const [response, setResponse] = useState<string | undefined>();
  const [attachments, setAttachments] = useState<ReadonlyArray<Attachment>>([]);

  return (
    <Card title={ci18n("card title", "Messages")} style={[className, style]}>
      <Conversation
        messageGroups={messages}
        response={response}
        onResponseChange={({ text }) => {
          setResponse(text);
        }}
        onSend={() => {
          alert("send clicked");
        }}
        responseProps={{
          placeholder: "override",
          onMouseOver: () => {
            console.log("mouse over");
          },
        }}
        fileUploadProps={{
          accepts: ".pdf,.jpeg,.png",
          maxSizeMB: 5,
          attachments,
          onAttachmentsChanged: (attachments) => {
            setAttachments(attachments);
          },
          bucket: "TEMP_UPLOADS_V2",
          onSend: () => {
            alert("file upload clicked");
          },
        }}
      />
    </Card>
  );
};

export default observer(MessagesCard);
