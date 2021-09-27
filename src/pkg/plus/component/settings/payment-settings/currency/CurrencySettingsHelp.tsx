/* eslint-disable local-rules/unnecessary-list-usage */
// Lints disabled:
// Using li/ul to bullet a list

import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Toolkit */
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencySettingsHelpProps = BaseProps & {
  readonly currentCurrency: string;
};

type HeaderProps = BaseProps & {
  readonly text: string;
};

const Header = (props: HeaderProps) => {
  const styles = useStylesheet();
  const { text } = props;

  return <span className={css(styles.headerText)}>{text}</span>;
};

export const CurrencySettingsHelp = (props: CurrencySettingsHelpProps) => {
  const styles = useStylesheet();
  const { surfaceLightest } = useTheme();
  const { currentCurrency } = props;

  const [impactSectionExpanded, setImpactSectionExpanded] = useState(false);

  const productLink = "/products/list";
  const taxLink = "/tax/reports";

  return (
    <Card className={css(styles.panelCard)}>
      <Accordion
        header={() => (
          <Header text={i`How does Currency Settings affect my store?`} />
        )}
        isOpen={impactSectionExpanded}
        onOpenToggled={setImpactSectionExpanded}
        chevronSize={14}
        backgroundColor={surfaceLightest}
      >
        <ul className={css(styles.bullets)}>
          <li className={css(styles.bullet)}>
            <Markdown
              text={
                i`Orders that are available for fulfillment will be ` +
                i`paid in ${currentCurrency}. The ${currentCurrency} value ` +
                i`is based on the ${currentCurrency} cost of a product as seen on the ` +
                i`[Products page](${productLink}).`
              }
            />
          </li>
          <li className={css(styles.bullet)}>
            <Markdown
              text={
                i`Taxes collected on behalf of merchants, if any, will be paid to ` +
                i`merchants in ${currentCurrency}. For the exact tax amount that ` +
                i`merchants are liable to remit to each tax authority, please visit ` +
                i`[Tax Reports](${taxLink}).`
              }
            />
          </li>
        </ul>
      </Accordion>
    </Card>
  );
};

const useStylesheet = () => {
  const { surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        headerText: {
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightMedium,
          fontSize: 16,
        },
        bullets: {
          marginTop: 20,
          marginRight: 20,
        },
        bullet: {
          marginLeft: 16,
          marginBottom: 12,
        },
        panelCard: {
          fontSize: 14,
          fontWeight: fonts.weightMedium,
          color: palettes.textColors.DarkInk,
          marginTop: -2,
          backgroundColor: surfaceLightest,
        },
      }),
    [surfaceLightest]
  );
};
