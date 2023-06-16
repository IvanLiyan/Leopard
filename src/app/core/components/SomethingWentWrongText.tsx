import React from "react";
import { Text, TextProps } from "@ContextLogic/atlas-ui";

type Props = {
  readonly children?: TextProps["children"] | null;
};

const SomethingWentWrongText = ({ children }: Props) => {
  return (
    <Text variant="bodyLStrong">{children ?? i`Something went wrong.`}</Text>
  );
};

export default SomethingWentWrongText;
