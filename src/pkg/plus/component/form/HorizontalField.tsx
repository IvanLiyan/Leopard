import React from "react";

/* Lego Components */
import {
  HorizontalField as LegoHorizontalField,
  HorizontalFieldProps,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import * as fonts from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";

const HorizontalField = (props: HorizontalFieldProps) => {
  const { textBlack } = useTheme();
  const titleStyle = {
    fontSize: 14,
    fontWeight: fonts.weightSemibold,
    color: textBlack,
  };

  return (
    <LegoHorizontalField
      titleStyle={titleStyle}
      titleAlign="start"
      titleWidth={200}
      {...props}
    />
  );
};
export default HorizontalField;
