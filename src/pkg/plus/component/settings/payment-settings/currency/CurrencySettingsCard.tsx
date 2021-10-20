import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { Card } from "@ContextLogic/lego";
import { Accordion } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Merchant Store */
import { useTheme } from "@stores/ThemeStore";
import { CurrencyCodeDisplay } from "@merchant/component/payments/currency/CurrencyCodeDisplay";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type CurrencySettingsCardProps = BaseProps & {
  readonly currentCurrency: string;
};

export const CurrencySettingsCard = (props: CurrencySettingsCardProps) => {
  const styles = useStylesheet();
  const { currentCurrency } = props;

  const [impactSectionExpanded, setImpactSectionExpanded] = useState(true);

  const { surfaceLightest, pageBackground } = useTheme();

  return (
    <Card className={css(styles.panelCard)}>
      <Accordion
        header={i`Currency settings`}
        isOpen={impactSectionExpanded}
        onOpenToggled={setImpactSectionExpanded}
        chevronSize={14}
        backgroundColor={surfaceLightest}
        headerContainerStyle={{ backgroundColor: pageBackground }}
      >
        <table className={css(styles.currentCurrencyFooter)}>
          <tbody>
            <tr className={css(styles.info)}>
              <td className={css(styles.infoKey)}>Your local currency code</td>
              <td className={css(styles.infoValue)}>
                <CurrencyCodeDisplay currencyCode={currentCurrency} />
              </td>
            </tr>
          </tbody>
        </table>
      </Accordion>
    </Card>
  );
};

const useStylesheet = () => {
  const { textDark, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        panelCard: {
          backgroundColor: surfaceLightest,
        },
        info: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        },
        infoKey: {
          color: textDark,
          fontWeight: fonts.weightMedium,
          fontSize: 16,
          paddingLeft: 49,
        },
        infoValue: {
          fontWeight: fonts.weightNormal,
          fontSize: 16,
          color: textDark,
          paddingLeft: 49,
        },
        currentCurrencyFooter: {
          margin: "24px 0",
        },
      }),
    [textDark, surfaceLightest],
  );
};
