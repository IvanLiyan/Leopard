import React from "react";
import { Text, TextProps } from "@ContextLogic/atlas-ui";

type Props = {
  readonly children?: TextProps["children"] | null;
};

export const SOMETHING_WENT_WRONG_TEXT = i`Something went wrong`;

const SomethingWentWrongText = ({ children }: Props) => {
  return (
    <Text variant="bodyLStrong">{children ?? SOMETHING_WENT_WRONG_TEXT}</Text>
  );
};

export default SomethingWentWrongText;
