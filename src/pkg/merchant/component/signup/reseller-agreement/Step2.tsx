import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { TextInput } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

/* Relative Imports */
import StepBase from "./StepBase";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OnTextChangeEvent } from "@ContextLogic/lego";
import LocalizationStore from "@merchant/stores/LocalizationStore";

type Step2Props = BaseProps & {
  readonly brandNames: string;
  readonly onEnterBrandNames: (names: string) => unknown;
  readonly onBack: () => unknown;
  readonly onContinue: () => Promise<unknown>;
};

const Step2 = (props: Step2Props) => {
  const styles = useStylesheet();

  const handleEnterBrandNames = (e: OnTextChangeEvent) => {
    const { onEnterBrandNames } = props;
    onEnterBrandNames(e.text);
  };

  const { className, style, brandNames, onBack, onContinue } = props;
  const exampleText = `E.g. Nike, Puma, Revlon`;
  let title1 = `List the third party brands`;
  let title2 = `that you have all necessary rights to sell`;
  const { locale } = LocalizationStore.instance();
  if (locale != "en") {
    title1 = i`List the third party brands that you have all necessary rights to sell`;
    title2 = "";
  }
  return (
    <StepBase
      className={className}
      style={style}
      titleLine1={title1}
      titleLine2={title2}
      onBack={onBack}
      onContinue={onContinue}
    >
      <TextInput
        className={css(styles.brandInput)}
        onChange={handleEnterBrandNames}
        value={brandNames}
      />
      <div className={css(styles.brandExample)}>{exampleText}</div>
    </StepBase>
  );
};

export default Step2;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        brandInput: {
          width: "80%",
          marginTop: 24,
        },
        brandExample: {
          width: "80%",
          marginTop: 8,
          fontSize: 14,
          color: palettes.textColors.LightInk,
          fontWeight: fonts.weightMedium,
        },
      }),
    []
  );
};
