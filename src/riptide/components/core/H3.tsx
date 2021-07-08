import React from "react";
import { css } from "@riptide/toolkit/styling";
import { BaseProps } from "@riptide/toolkit/types";

import Text from "@riptide/components/core/Text";

export type Props = BaseProps;

const H3: React.FC<Props> = ({ style, className, children }: Props) => {
  return (
    <Text
      fontWeight="SEMIBOLD"
      fontSize={20}
      lineHeight="24px"
      letterSpacing="0.01em"
      color="BLACK"
      className={css(style, className)}
    >
      {children}
    </Text>
  );
};

export default H3;
