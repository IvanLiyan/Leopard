import React, { ReactNode } from "react";

/* Lego Components */
import { DEPRECATEDFileInput } from "@merchant/component/core";

/* Relative Imports */
import { ReauthTip, ReauthRow, ReauthRowValue } from "./ReauthComponents";

import { AttachmentInfo } from "@ContextLogic/lego";
import {
  MaterialProps,
  EntityProps,
} from "@toolkit/merchant-review/material-types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ImageMaterialProps = BaseProps & {
  readonly entity: EntityProps;
  readonly material: MaterialProps;
  readonly globalIdFn: (entityId: string, materialId: string) => string;
  readonly imageMap: Map<string, ReadonlyArray<AttachmentInfo>>;
  readonly onImageChange: (
    globalId: string,
    value: ReadonlyArray<AttachmentInfo>
  ) => unknown;
  readonly onViewAttachments: (
    attachments: ReadonlyArray<AttachmentInfo>,
    viewIndex: number
  ) => unknown;
};

const BeginPaymentFirstPageImageMaterial = (props: ImageMaterialProps) => {
  const {
    entity,
    material,
    globalIdFn,
    imageMap,
    onImageChange,
    onViewAttachments,
  } = props;
  const globalId = globalIdFn(entity.id, material.id);
  const materialValue = imageMap.get(globalId);
  let popoverContent: ReactNode = null;
  if (material.tip) {
    popoverContent = () => <ReauthTip tipText={material.tip} />;
  }
  return (
    <ReauthRow
      title={material.name || ""}
      titleWidth={301}
      popoverContent={() => popoverContent}
      popoverPosition="right center"
      key={material.id}
    >
      <ReauthRowValue>
        <DEPRECATEDFileInput
          bucket="TEMP_UPLOADS"
          accepts=".jpeg,.jpg,.png"
          maxSizeMB={11}
          maxAttachments={11}
          attachments={materialValue}
          onAttachmentsChanged={(attachments) =>
            onImageChange(globalId, attachments)
          }
          onViewAttachments={onViewAttachments}
        />
      </ReauthRowValue>
    </ReauthRow>
  );
};

export default BeginPaymentFirstPageImageMaterial;
