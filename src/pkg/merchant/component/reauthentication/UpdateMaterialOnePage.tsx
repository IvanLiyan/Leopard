import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import ImageViewer from "@merchant/component/core/modal/ImageViewer";
import { Conversation } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Relative Imports */
import { CardTitle } from "./ReauthComponents";
import UpdateMaterialMerchantMessage from "./UpdateMaterialMerchantMessage";
import UpdateMaterialAdminMessage from "./UpdateMaterialAdminMessage";

import { AttachmentInfo } from "@ContextLogic/lego";
import { ImageGroupProps } from "@merchant/component/core/modal/ImageViewer";
import { RequiredMaterialProps } from "@merchant/api/reauthentication";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type PageProps = BaseProps & {
  readonly requiredMaterial: RequiredMaterialProps;
  readonly imageMap: Map<string, ReadonlyArray<AttachmentInfo>>;
  readonly textMap: Map<string, string>;
  readonly choiceMap: Map<string, string>;
  readonly commentMap: Map<string, string>;
  readonly globalIdFn: (entityId: string, materialId: string) => string;
  readonly onViewAttachments: (
    attachments: ReadonlyArray<AttachmentInfo>,
    viewIndex: number,
  ) => unknown;
  readonly onImageMapChange: (
    globalId: string,
    value: ReadonlyArray<AttachmentInfo>,
  ) => unknown;
  readonly onTextMapChange: (globalId: string, value: string) => unknown;
  readonly onChoiceMapChange: (globalId: string, value: string) => unknown;
  readonly onCommentChange: (globalId: string, value: string) => unknown;
};

const UpdateMaterialOnePage = (props: PageProps) => {
  const styles = useStyleSheet();

  const handleClickImage = (imageGroup?: ImageGroupProps, imageId?: string) => {
    if (!imageGroup) {
      return;
    }
    const imageViewer = new ImageViewer({
      imageGroups: [imageGroup],
      selectedImageId: imageId,
    });
    imageViewer.render();
  };

  const {
    requiredMaterial,
    imageMap,
    textMap,
    choiceMap,
    commentMap,
    globalIdFn,
    onViewAttachments,
    onImageMapChange,
    onTextMapChange,
    onChoiceMapChange,
    onCommentChange,
  } = props;

  const cardTitle =
    requiredMaterial.entityName +
    " > " +
    (requiredMaterial.lastMaterial.name || "");

  return (
    <>
      <CardTitle>
        <span className={css(styles.cardTitleSpace)}>Need to update:</span>
        <span>{cardTitle}</span>
      </CardTitle>
      <Conversation>
        <UpdateMaterialMerchantMessage
          requiredMaterial={requiredMaterial}
          onClickImage={handleClickImage}
        />
        <UpdateMaterialAdminMessage
          requiredMaterial={requiredMaterial}
          imageMap={imageMap}
          textMap={textMap}
          choiceMap={choiceMap}
          commentMap={commentMap}
          globalIdFn={globalIdFn}
          onViewAttachments={onViewAttachments}
          onImageMapChange={onImageMapChange}
          onTextMapChange={onTextMapChange}
          onChoiceMapChange={onChoiceMapChange}
          onCommentChange={onCommentChange}
        />
      </Conversation>
    </>
  );
};

export default UpdateMaterialOnePage;

const useStyleSheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        cardTitleSpace: {
          marginRight: 5,
        },
      }),
    [],
  );
};
