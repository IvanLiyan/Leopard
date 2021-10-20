import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Illustration } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold } from "@toolkit/fonts";

/* Store */
import { useTheme } from "@stores/ThemeStore";

/* Relative Imports */
import TextSection, {
  TextSectionStyles,
  TextSectionProps,
} from "./TextSection";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { learnMoreZendesk } from "@toolkit/url";

const CountryOfDomicileModalHowToDetermine = (props: BaseProps) => {
  const { className, style } = props;
  const theme = useTheme();
  const styles = useStylesheet(theme.borderPrimary);

  const sectionStyle: TextSectionStyles = {
    titleFontSize: 18,
    subtitleFontSize: 16,
  };
  const section1: TextSectionProps = {
    title: i`I am an individual merchant`,
    subtitle:
      i`My store is owned and operated by` + i` an unincorporated individual.`,
    paragraphs:
      i`Generally, the country/region of domicile is a country or place` +
      i` where you have a **fixed or legal address** or **permanent residence` +
      i` (home)** and to which you intend to return if currently residing elsewhere.`,
    textSectionStyles: sectionStyle,
  };

  const section2: TextSectionProps = {
    title: i`I am a business merchant`,
    subtitle: i`My store is owned and operated by a registered company.`,
    paragraphs: [
      i`Generally, the country/region of domicile is a country or state of` +
        i` incorporation or registration of a firm where it has its **legal` +
        i` address or registered office**, or which is considered by law as` +
        i` the center of its corporate affairs.`,

      i`If you need help with selecting your country/region of domicile,` +
        i` please visit our guide. ${learnMoreZendesk("360050893133")}`,
    ],
    textSectionStyles: sectionStyle,
  };

  return (
    <div className={css(styles.root, style, className)}>
      <div className={css(styles.title)}>
        How do I determine my country/region of domicile?
      </div>
      <div className={css(styles.sideBySide, styles.sectionSpace)}>
        <div className={css(styles.left)}>
          <Illustration name="manHoldingBox" alt="individual" />
        </div>
        <div className={css(styles.right)}>
          <TextSection {...section1} />
        </div>
      </div>
      <div className={css(styles.sideBySide, styles.sectionSpace)}>
        <div className={css(styles.left)}>
          <Illustration name="blueHouse" alt="company" />
        </div>
        <div className={css(styles.right)}>
          <TextSection {...section2} />
        </div>
      </div>
    </div>
  );
};

export default CountryOfDomicileModalHowToDetermine;

const useStylesheet = (borderPrimary: string) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
        },
        title: {
          fontSize: 20,
          fontWeight: weightBold,
          textAlign: "center",
        },
        sectionSpace: {
          marginTop: 40,
        },
        sideBySide: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        },
        left: {
          width: 100,
          border: `1px dashed ${borderPrimary}`,
        },
        right: {
          marginLeft: 10,
          flex: 1,
          fontSize: 16,
        },
      }),
    [borderPrimary],
  );
};
