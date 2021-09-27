import React from "react";

/* Relative Imports */
import { ReauthRowValue } from "./ReauthComponents";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TextContentProps = BaseProps & {
  readonly text?: string;
};

const UpdateMaterialTextContent = (props: TextContentProps) => {
  const { text } = props;
  if (!text) {
    return null;
  }
  return <ReauthRowValue>{text}</ReauthRowValue>;
};

export default UpdateMaterialTextContent;
