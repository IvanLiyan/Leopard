import React from "react";

/* Lego Components */
import { Alert } from "@ContextLogic/lego";

/* Relative Imports */
import TextSection, { TextSectionProps } from "./TextSection";

const InfoTip = (props: TextSectionProps) => {
  const { className, style, ...textSectionProps } = props;
  const { textSectionStyles, ...otherTextSectionProps } = textSectionProps;
  const fontSize = textSectionStyles?.textFontSize;
  const finalFontSize = fontSize == null ? 14 : fontSize;
  const finalStyle = {
    ...textSectionStyles,
    textFontSize: finalFontSize,
  };

  return (
    <Alert
      iconVerticalAlignment="top"
      sentiment="info"
      className={className}
      style={style}
      text={() => (
        <TextSection
          {...otherTextSectionProps}
          textSectionStyles={finalStyle}
        />
      )}
    />
  );
};

export default InfoTip;
