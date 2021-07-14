import React from "react";
import { BaseProps } from "@riptide/toolkit/types";

import Text from "@riptide/components/core/Text";

export type Props = BaseProps;

const H3: React.FC<Props> = ({ style, children }: Props) => {
  return (
    <Text
      fontWeight="SEMIBOLD"
      fontSize={20}
      lineHeight="24px"
      letterSpacing="0.01em"
      color="BLACK"
      style={style}
    >
      {children}
    </Text>
  );
};

export default H3;
