import React from "react";

/* Lego Toolkit */
import { RequiredValidator } from "@toolkit/validators";

/* Relative Imports */
import { ReauthTextArea } from "./ReauthComponents";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type TextFieldProps = BaseProps & {
  readonly globalId: string;
  readonly textMap: Map<string, string>;
  readonly onTextMapChange: (globalId: string, value: string) => unknown;
};

const UpdateMaterialTextField = (props: TextFieldProps) => {
  const { globalId, onTextMapChange, textMap } = props;
  return (
    <ReauthTextArea // use `key` to make React think they're different TextInputs in
      // different pages, or the RequiredValidator will not work properly
      key={globalId}
      validators={[new RequiredValidator()]}
      value={textMap.get(globalId)}
      onChange={({ text }) => onTextMapChange(globalId, text)}
    />
  );
};

export default UpdateMaterialTextField;
