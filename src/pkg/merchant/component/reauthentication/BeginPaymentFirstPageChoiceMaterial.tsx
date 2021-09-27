import React, { ReactNode } from "react";

/* Lego Components */
import { RadioGroup } from "@ContextLogic/lego";

/* Relative Imports */
import { ReauthTip, ReauthRow } from "./ReauthComponents";

import {
  MaterialProps,
  EntityProps,
} from "@toolkit/merchant-review/material-types";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ChoiceMaterialProps = BaseProps & {
  readonly entity: EntityProps;
  readonly material: MaterialProps;
  readonly globalIdFn: (entityId: string, materialId: string) => string;
  readonly choiceMap: Map<string, string>;
  readonly onChoiceChange: (globalId: string, value: string) => unknown;
};

const BeginPaymentFirstPageChoiceMaterial = (props: ChoiceMaterialProps) => {
  const { entity, material, globalIdFn, choiceMap, onChoiceChange } = props;

  const globalId = globalIdFn(entity.id, material.id);
  const materialValue = choiceMap.get(globalId) || "";
  const choices = material.choices || {};
  const choiceDisplayArray = Object.keys(choices).map((key) => {
    return {
      value: key,
      text: choices[key],
    };
  });

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
      <RadioGroup
        onSelected={(value) => {
          onChoiceChange(globalId, value);
        }}
        selectedValue={materialValue}
      >
        {choiceDisplayArray.map(({ value, text }) => (
          <RadioGroup.Item value={value} text={text} />
        ))}
      </RadioGroup>
    </ReauthRow>
  );
};

export default BeginPaymentFirstPageChoiceMaterial;
