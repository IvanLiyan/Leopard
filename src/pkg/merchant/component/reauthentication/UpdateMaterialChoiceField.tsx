import React from "react";

/* Lego Components */
import { RadioGroup } from "@ContextLogic/lego";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ChoiceFieldProps = BaseProps & {
  readonly globalId: string;
  readonly choices?: {
    [key: string]: string;
  };
  readonly choiceMap: Map<string, string>;
  readonly onChoiceMapChange: (globalId: string, value: string) => unknown;
};

const UpdateMaterialChoiceField = (props: ChoiceFieldProps) => {
  const { globalId, choices, choiceMap, onChoiceMapChange } = props;
  if (!choices || Object.keys(choices).length == 0) {
    return null;
  }

  const userChoice = choiceMap.get(globalId) || "";
  const choiceDisplayArray = Object.keys(choices).map((key) => {
    return {
      value: key,

      text: choices[key],
    };
  });

  return (
    <RadioGroup
      onSelected={(value) => {
        onChoiceMapChange(globalId, value);
      }}
      selectedValue={userChoice}
    >
      {choiceDisplayArray.map(({ text, value }) => (
        <RadioGroup.Item key={text} text={text} value={value} />
      ))}
    </RadioGroup>
  );
};

export default UpdateMaterialChoiceField;
