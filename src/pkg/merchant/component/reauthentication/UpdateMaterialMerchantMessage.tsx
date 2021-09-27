import React, { ReactNode } from "react";

/* Lego Components */
import { Conversation } from "@ContextLogic/lego";

/* Relative Imports */
import { ReauthRow, Username, MessageTime } from "./ReauthComponents";
import UpdateMaterialImageContent from "./UpdateMaterialImageContent";
import UpdateMaterialTextContent from "./UpdateMaterialTextContent";
import UpdateMaterialChoiceContent from "./UpdateMaterialChoiceContent";

import { ImageGroupProps } from "@merchant/component/core/modal/ImageViewer";
import { RequiredMaterialProps } from "@merchant/api/reauthentication";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import LocalizationStore from "@merchant/stores/LocalizationStore";

type MerchantMessageProps = BaseProps & {
  readonly requiredMaterial: RequiredMaterialProps;
  readonly onClickImage: (
    imageGroup?: ImageGroupProps,
    imageId?: string
  ) => unknown;
};

const UpdateMaterialMerchantMessage = (props: MerchantMessageProps) => {
  const { requiredMaterial, onClickImage } = props;
  const { merchantMessage, lastMaterial } = requiredMaterial;
  const { locale } = LocalizationStore.instance();

  let content: ReactNode = null;
  if (lastMaterial.type == "image") {
    content = (
      <UpdateMaterialImageContent
        imageGroup={lastMaterial.images}
        onClickImage={onClickImage}
      />
    );
  } else if (lastMaterial.type == "text") {
    content = <UpdateMaterialTextContent text={lastMaterial.text} />;
  } else if (lastMaterial.type == "choice") {
    content = (
      <UpdateMaterialChoiceContent
        userChoice={lastMaterial.userChoice}
        choices={lastMaterial.choices}
      />
    );
  }

  return (
    <Conversation.Item locale={locale}>
      <Username username={merchantMessage.username} />
      <MessageTime messageTime={merchantMessage.time} />
      <ReauthRow title={lastMaterial.name || ""} titleWidth={300}>
        {content || "N/A"}
      </ReauthRow>
    </Conversation.Item>
  );
};

export default UpdateMaterialMerchantMessage;
