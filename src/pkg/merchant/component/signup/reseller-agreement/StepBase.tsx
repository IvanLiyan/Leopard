import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Components */
import { SecondaryButton } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as fonts from "@toolkit/fonts";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type StepBaseProps = BaseProps & {
  readonly titleLine1: string;
  readonly titleLine2?: string;
  readonly subtitle?: string;
  readonly continueDisabled?: boolean;
  readonly onBack: () => unknown;
  readonly onContinue: () => Promise<unknown>;
};

const StepBase = (props: StepBaseProps) => {
  const {
    className,
    style,
    titleLine1,
    titleLine2,
    subtitle,
    continueDisabled,
    onBack,
    onContinue,
    children,
  } = props;

  const styles = useStylesheet();

  const rootCSS = css(styles.root, style, className);
  return (
    <div className={rootCSS}>
      <div className={css(styles.upper)}>
        <div className={css(styles.textOptional)}>OPTIONAL</div>
        <div className={css(styles.textTitle)}>{titleLine1}</div>
        {titleLine2 && (
          <div className={css(styles.textTitle, styles.textTitleLine2)}>
            {titleLine2}
          </div>
        )}
        {subtitle && <div className={css(styles.textSubtitle)}>{subtitle}</div>}
        {children}
      </div>
      <div className={css(styles.buttons)}>
        <SecondaryButton
          type="default"
          text={i`Back`}
          onClick={onBack}
          padding="2px 60px"
        />
        <PrimaryButton onClick={onContinue} isDisabled={continueDisabled}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
};

export default StepBase;

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
          boxShadow: `0 2px 4px 0 ${palettes.greyScaleColors.LightGrey}`,
          border: `solid 1px ${palettes.greyScaleColors.Grey}`,
          backgroundColor: palettes.textColors.White,
        },
        upper: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 24px",
          width: "100%",
          boxSizing: "border-box",
        },
        textOptional: {
          fontSize: 14,
          lineHeight: "20px",
          marginTop: 40,
          color: palettes.textColors.LightInk,
        },
        textTitle: {
          fontSize: 24,
          lineHeight: "32px",
          marginTop: 8,
          color: palettes.textColors.Ink,
          fontWeight: fonts.weightSemibold,
          textAlign: "center",
        },
        textTitleLine2: {
          marginTop: 0,
        },
        textSubtitle: {
          fontSize: 16,
          lineHeight: "24px",
          marginTop: 8,
          color: palettes.textColors.Ink,
          textAlign: "center",
        },
        buttons: {
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          boxSizing: "border-box",
          width: "100%",
          borderTop: `solid 1px ${palettes.greyScaleColors.Grey}`,
        },
      }),
    []
  );
};
