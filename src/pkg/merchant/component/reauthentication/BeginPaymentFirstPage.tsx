import React, { useState } from "react";

/* Relative Imports */
import { CardTitle } from "./ReauthComponents";
import BeginPaymentFirstPageSingleEntity from "./BeginPaymentFirstPageSingleEntity";

import { AttachmentInfo } from "@ContextLogic/lego";
import { EntityProps } from "@toolkit/merchant-review/material-types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

export type FirstPageProps = BaseProps & {
  readonly requiredEntities: ReadonlyArray<EntityProps>;
  readonly imageMap: Map<string, ReadonlyArray<AttachmentInfo>>;
  readonly choiceMap: Map<string, string>;
  readonly onViewAttachments: (
    attachments: ReadonlyArray<AttachmentInfo>,
    viewIndex: number
  ) => unknown;
  readonly onImageChange: (
    globalId: string,
    value: ReadonlyArray<AttachmentInfo>
  ) => unknown;
  readonly onChoiceChange: (globalId: string, value: string) => unknown;
  readonly globalIdFn: (entityId: string, materialId: string) => string;
};

const BeginPaymentFirstPage = (props: FirstPageProps) => {
  const [entityOpenMap, setEntityOpenMap] = useState({});

  const toggleEntityOpen = (entityId: string, isOpen: boolean) => {
    const newMap = { ...entityOpenMap };
    (newMap as any)[entityId] = isOpen;
    setEntityOpenMap(newMap);
  };

  const isEntityOpen = (entityId: string): boolean => {
    const isOpen = (entityOpenMap as any)[entityId];
    if (isOpen == undefined) {
      return true;
    }

    return isOpen;
  };

  const renderOneEntity = (entity: EntityProps) => {
    const {
      imageMap,
      choiceMap,
      globalIdFn,
      onImageChange,
      onChoiceChange,
      onViewAttachments,
    } = props;
    return (
      <BeginPaymentFirstPageSingleEntity
        key={entity.id}
        entity={entity}
        imageMap={imageMap}
        choiceMap={choiceMap}
        isEntityOpen={isEntityOpen}
        toggleEntityOpen={toggleEntityOpen}
        globalIdFn={globalIdFn}
        onImageChange={onImageChange}
        onChoiceChange={onChoiceChange}
        onViewAttachments={onViewAttachments}
      />
    );
  };

  const { requiredEntities } = props;
  return (
    <>
      <CardTitle>Payment authentication</CardTitle>
      {requiredEntities.map(renderOneEntity)}
    </>
  );
};

export default BeginPaymentFirstPage;
