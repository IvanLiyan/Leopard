import React, { ReactNode } from "react";

/* Lego Components */
import { Accordion } from "@ContextLogic/lego";

/* Lego Toolkit */
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Relative Imports */
import {
  ReauthRow,
  ReauthRowValue,
  Entity,
  EntityTitle,
  Separator,
} from "./ReauthComponents";
import BeginPaymentFirstPageImageMaterial from "./BeginPaymentFirstPageImageMaterial";
import BeginPaymentFirstPageChoiceMaterial from "./BeginPaymentFirstPageChoiceMaterial";

import { AttachmentInfo } from "@ContextLogic/lego";
import {
  MaterialProps,
  EntityProps,
} from "@toolkit/merchant-review/material-types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type SingleEntityProps = BaseProps & {
  readonly entity: EntityProps;
  readonly imageMap: Map<string, ReadonlyArray<AttachmentInfo>>;
  readonly choiceMap: Map<string, string>;
  readonly isEntityOpen: (entityId: string) => boolean;
  readonly toggleEntityOpen: (entityId: string, isOpen: boolean) => unknown;
  readonly globalIdFn: (entityId: string, materialId: string) => string;
  readonly onImageChange: (
    globalId: string,
    value: ReadonlyArray<AttachmentInfo>,
  ) => unknown;
  readonly onChoiceChange: (globalId: string, value: string) => unknown;
  readonly onViewAttachments: (
    attachments: ReadonlyArray<AttachmentInfo>,
    viewIndex: number,
  ) => unknown;
};

const BeginPaymentFirstPageSingleEntity = (props: SingleEntityProps) => {
  const renderOneMaterial = (entity: EntityProps, material: MaterialProps) => {
    const {
      globalIdFn,
      imageMap,
      onImageChange,
      onViewAttachments,
      choiceMap,
      onChoiceChange,
    } = props;
    if (material.type == "image") {
      return (
        <BeginPaymentFirstPageImageMaterial
          entity={entity}
          material={material}
          globalIdFn={globalIdFn}
          imageMap={imageMap}
          onImageChange={onImageChange}
          onViewAttachments={onViewAttachments}
        />
      );
    } else if (material.type == "choice") {
      return (
        <BeginPaymentFirstPageChoiceMaterial
          entity={entity}
          material={material}
          globalIdFn={globalIdFn}
          choiceMap={choiceMap}
          onChoiceChange={onChoiceChange}
        />
      );
    }

    return null;
  };

  const { entity, isEntityOpen, toggleEntityOpen } = props;
  const { materials, extraKey, extraValue } = entity;
  let extraInfo: ReactNode = null;
  if (extraKey) {
    extraInfo = (
      <ReauthRow title={extraKey} titleWidth={301}>
        <ReauthRowValue>{extraValue}</ReauthRowValue>
      </ReauthRow>
    );
  }
  return (
    <>
      <Entity>
        <Accordion
          header={() => <EntityTitle>{entity.name}</EntityTitle>}
          isOpen={isEntityOpen(entity.id)}
          onOpenToggled={(isOpen) => toggleEntityOpen(entity.id, isOpen)}
          backgroundColor={palettes.textColors.White}
          headerPadding="1"
          hideLines
        >
          {extraInfo}
          {materials.map((material) => renderOneMaterial(entity, material))}
        </Accordion>
      </Entity>
      <Separator />
    </>
  );
};

export default BeginPaymentFirstPageSingleEntity;
