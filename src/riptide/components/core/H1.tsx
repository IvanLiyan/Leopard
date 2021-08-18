import React from "react";
import { BaseProps } from "@riptide/toolkit/types";

import Text, { Props as TextProps } from "@riptide/components/core/Text";

export type Props = BaseProps & Partial<TextProps>;

const H1: React.FC<Props> = ({ style, children, ...textProps }: Props) => {
  return (
    <Text
      fontWeight="BOLD"
      fontSize={28}
      lineHeight="32px"
      letterSpacing="-0.005em"
      color="BLACK"
      {...textProps}
      style={style}
    >
      {children}
    </Text>
  );
};

export default H1;
