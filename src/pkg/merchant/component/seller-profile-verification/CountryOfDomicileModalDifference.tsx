import React from "react";

/* Relative Imports */
import TextSection, { TextSectionProps } from "./TextSection";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { learnMoreZendesk } from "@toolkit/url";

const CountryOfDomicileModalDifference = (props: BaseProps) => {
  const { className, style } = props;

  const section: TextSectionProps = {
    title:
      i`How is country/region of domicile different` +
      i` from country of residence or country of citizenship?`,
    paragraphs:
      i`Please note that your country of domicile is distinct from` +
      i` your country of residence or country of citizenship.` +
      i` ${learnMoreZendesk("360050893133")}`,
    textSectionStyles: {
      titleFontSize: 20,
      centerText: true,
    },
  };

  return <TextSection className={className} style={style} {...section} />;
};

export default CountryOfDomicileModalDifference;
