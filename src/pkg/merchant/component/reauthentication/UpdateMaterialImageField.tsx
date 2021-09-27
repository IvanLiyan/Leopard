import React from "react";

/* Lego Components */
import { DEPRECATEDFileInput } from "@merchant/component/core";

import { AttachmentInfo } from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ImageFieldProps = BaseProps & {
  readonly globalId: string;
  readonly maxImageCount: number | null | undefined;
  readonly imageMap: Map<string, ReadonlyArray<AttachmentInfo>>;
  readonly onViewAttachments: (
    attachments: ReadonlyArray<AttachmentInfo>,
    viewIndex: number,
  ) => unknown;
  readonly onImageMapChange: (
    globalId: string,
    value: ReadonlyArray<AttachmentInfo>,
  ) => unknown;
};

const UpdateMaterialImageField = (props: ImageFieldProps) => {
  const {
    globalId,
    maxImageCount,
    imageMap,
    onImageMapChange,
    onViewAttachments,
  } = props;
  const attachments = imageMap.get(globalId);
  const maxCount = !maxImageCount ? 10 : maxImageCount;
  return (
    <DEPRECATEDFileInput
      bucket="TEMP_UPLOADS"
      accepts=".jpeg,.jpg,.png,.pdf"
      maxSizeMB={10}
      attachments={attachments}
      maxAttachments={maxCount}
      onAttachmentsChanged={(images) => {
        onImageMapChange(globalId, images);
      }}
      onViewAttachments={onViewAttachments}
    />
  );
};

export default UpdateMaterialImageField;
