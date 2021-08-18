import React from "react";
import { BaseProps } from "@riptide/toolkit/types";

import Text, { Props as TextProps } from "@riptide/components/core/Text";

export type Props = BaseProps & Partial<TextProps>;

const H2: React.FC<Props> = ({ style, children, ...textProps }: Props) => {
  return (
    <Text
      fontWeight="SEMIBOLD"
      fontSize={24}
      lineHeight="28px"
      letterSpacing="0.01em"
      color="BLACK"
      {...textProps}
      style={style}
    >
      {children}
    </Text>
  );
};

export default H2;
