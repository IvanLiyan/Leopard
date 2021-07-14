import React from "react";
import { BaseProps } from "@riptide/toolkit/types";

import Text from "@riptide/components/core/Text";

export type Props = BaseProps;

const H1: React.FC<Props> = ({ style, children }: Props) => {
  return (
    <Text
      fontWeight="BOLD"
      fontSize={28}
      lineHeight="32px"
      letterSpacing="-0.005em"
      color="BLACK"
      style={style}
    >
      {children}
    </Text>
  );
};

export default H1;
