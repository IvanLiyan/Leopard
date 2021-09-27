import React, { ReactNode } from "react";

/* Lego Components */
import { Conversation } from "@ContextLogic/lego";

/* Relative Imports */
import {
  ReauthTip,
  ReauthRow,
  ReauthRowValue,
  ReauthTextArea,
  Username,
  MessageTime,
  MessageTitle,
} from "./ReauthComponents";
import UpdateMaterialChoiceField from "./UpdateMaterialChoiceField";
import UpdateMaterialImageField from "./UpdateMaterialImageField";
import UpdateMaterialTextField from "./UpdateMaterialTextField";

import { AttachmentInfo } from "@ContextLogic/lego";
import { RequiredMaterialProps } from "@merchant/api/reauthentication";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import LocalizationStore from "@merchant/stores/LocalizationStore";

type AdminMessageProps = BaseProps & {
  readonly requiredMaterial: RequiredMaterialProps;
  readonly imageMap: Map<string, ReadonlyArray<AttachmentInfo>>;
  readonly textMap: Map<string, string>;
  readonly choiceMap: Map<string, string>;
  readonly commentMap: Map<string, string>;
  readonly globalIdFn: (entityId: string, materialId: string) => string;
  readonly onViewAttachments: (
    attachments: ReadonlyArray<AttachmentInfo>,
    viewIndex: number
  ) => unknown;
  readonly onImageMapChange: (
    globalId: string,
    value: ReadonlyArray<AttachmentInfo>
  ) => unknown;
  readonly onTextMapChange: (globalId: string, value: string) => unknown;
  readonly onChoiceMapChange: (globalId: string, value: string) => unknown;
  readonly onCommentChange: (globalId: string, value: string) => unknown;
};

const UpdateMaterialAdminMessage = (props: AdminMessageProps) => {
  const {
    imageMap,
    textMap,
    choiceMap,
    commentMap,
    globalIdFn,
    onImageMapChange,
    onTextMapChange,
    onChoiceMapChange,
    onCommentChange,
    onViewAttachments,
    requiredMaterial: {
      adminMessage,
      lastMaterial,
      entityId,
      extraKey,
      extraValue,
    },
  } = props;
  const globalId = globalIdFn(entityId, lastMaterial.id);
  let field: ReactNode = null;
  if (lastMaterial.type == "image") {
    field = (
      <UpdateMaterialImageField
        globalId={globalId}
        maxImageCount={lastMaterial.maxImageCount}
        imageMap={imageMap}
        onViewAttachments={onViewAttachments}
        onImageMapChange={onImageMapChange}
      />
    );
  } else if (lastMaterial.type == "text") {
    field = (
      <UpdateMaterialTextField
        globalId={globalId}
        textMap={textMap}
        onTextMapChange={onTextMapChange}
      />
    );
  } else if (lastMaterial.type == "choice") {
    field = (
      <UpdateMaterialChoiceField
        globalId={globalId}
        choices={lastMaterial.choices}
        choiceMap={choiceMap}
        onChoiceMapChange={onChoiceMapChange}
      />
    );
  }

  const commentPlaceholder =
    i`You can state changes you have made in the uploaded files here or` +
    i` leave a message about any doubts you have.`;
  const comment = commentMap.get(globalId);

  let popoverContent: ReactNode = null;
  if (lastMaterial.tip) {
    popoverContent = () => <ReauthTip tipText={lastMaterial.tip} />;
  }

  let extraRow: ReactNode = null;
  if (extraKey) {
    extraRow = (
      <ReauthRow title={extraKey} titleWidth={300}>
        <ReauthRowValue>{extraValue}</ReauthRowValue>
      </ReauthRow>
    );
  }

  const { locale } = LocalizationStore.instance();

  return (
    <Conversation.Item locale={locale} isWish isLast>
      <Username username={i`Wish Merchant Support`} />
      <MessageTime messageTime={adminMessage.time} />
      <MessageTitle messageTitle={adminMessage.reason} />
      {extraRow}
      <ReauthRow
        title={lastMaterial.name || ""}
        titleWidth={300}
        popoverContent={() => popoverContent}
        popoverPosition="right center"
      >
        <ReauthRowValue key={globalId}>{field}</ReauthRowValue>
      </ReauthRow>
      <ReauthRow title={i`Leave a message`} titleWidth={300}>
        <ReauthRowValue>
          <ReauthTextArea // use `key` to make React think they're different TextInputs in
            // different pages, or the render will be wrong if value is empty
            key={globalId + "_comment"}
            placeholder={commentPlaceholder}
            value={comment || ""}
            onChange={({ text }) => onCommentChange(globalId, text)}
          />
        </ReauthRowValue>
      </ReauthRow>
    </Conversation.Item>
  );
};

export default UpdateMaterialAdminMessage;
