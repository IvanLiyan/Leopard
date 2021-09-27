import React from "react";

/* Relative Imports */
import TextSection, { TextSectionProps } from "./TextSection";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { learnMoreZendesk } from "@toolkit/url";

const CountryOfDomicileModalWhyImportant = (props: BaseProps) => {
  const { className, style } = props;

  const section: TextSectionProps = {
    title: i`Why is it important to choose the correct country/region of domicile?`,
    paragraphs:
      i`Declaring an incorrect country/region of domicile will result in incorrect` +
      i` tax treatment of your sales and prevent you from accessing additional` +
      i` merchant features and privilege, such as setting up **Tax Settings**,` +
      i` applying to become an **Authentic Brand Seller**, and more.` +
      i` ${learnMoreZendesk("360050893133")}`,
    textSectionStyles: {
      titleFontSize: 20,
      centerText: true,
    },
  };

  return <TextSection className={className} style={style} {...section} />;
};

export default CountryOfDomicileModalWhyImportant;
