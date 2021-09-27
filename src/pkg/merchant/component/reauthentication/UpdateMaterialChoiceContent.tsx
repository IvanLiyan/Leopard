import React from "react";

/* Relative Imports */
import { ReauthRowValue } from "./ReauthComponents";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ChoiceContentProps = BaseProps & {
  readonly userChoice?: string;
  readonly choices: any;
};

const UpdateMaterialChoiceContent = (props: ChoiceContentProps) => {
  const { userChoice, choices } = props;
  if (!userChoice) {
    return null;
  }

  const choiceValue = choices[userChoice];
  if (!choiceValue) {
    return null;
  }

  return <ReauthRowValue>{choiceValue}</ReauthRowValue>;
};

export default UpdateMaterialChoiceContent;
