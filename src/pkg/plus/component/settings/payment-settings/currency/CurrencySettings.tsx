import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Relative Imports */
import { CurrencySettingsCard } from "./CurrencySettingsCard";
import { CurrencySettingsHelp } from "./CurrencySettingsHelp";

type Props = BaseProps & {
  readonly currentCurrency: string;
};

const CurrencySettings = (props: Props) => {
  const styles = useStylesheet();
  const { currentCurrency } = props;

  return (
    <div className={css(styles.wrapper)}>
      <CurrencySettingsCard currentCurrency={currentCurrency} />
      <CurrencySettingsHelp currentCurrency={currentCurrency} />
    </div>
  );
};

export default CurrencySettings;

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          flex: 1,
        },
      }),
    []
  );
