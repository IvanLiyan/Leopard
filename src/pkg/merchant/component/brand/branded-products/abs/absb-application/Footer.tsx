import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ABSBApplicationState from "@merchant/model/brand/branded-products/ABSBApplicationState";

type FooterProps = BaseProps & {
  readonly onContinue: () => unknown;
  readonly continueDisabled?: boolean;
  readonly cancelDisabled?: boolean;
  readonly isSubmit?: boolean;
  readonly currentApplication: ABSBApplicationState;
  readonly isLoading?: boolean;
};

const Footer = ({
  onContinue,
  continueDisabled,
  cancelDisabled,
  isSubmit,
  className,
  currentApplication,
  isLoading,
  style,
}: FooterProps) => {
  const styles = useStylesheet();

  return (
    <div className={css(styles.buttonsContainer, className, style)}>
      <Button
        className={css(styles.button)}
        onClick={() => {
          currentApplication.goPreviousStep();
        }}
        disabled={cancelDisabled}
      >
        Back
      </Button>
      <PrimaryButton
        popoverStyle={css(styles.button)}
        style={css(styles.innerContinue)}
        onClick={() => {
          onContinue();
        }}
        isDisabled={continueDisabled}
        isLoading={isLoading}
      >
        {isSubmit ? i`Submit` : i`Continue`}
      </PrimaryButton>
    </div>
  );
};
export default observer(Footer);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        buttonsContainer: {
          borderTop: `solid 1px ${borderPrimary}`,
          display: "flex",
          justifyContent: "space-between",
          alignContent: "stretch",
          alignSelf: "stretch",
        },
        button: {
          maxWidth: 200,
          margin: "20px 24px",
          flex: 1,
        },
        innerBack: {
          width: "100%",
        },
        innerContinue: {
          height: "calc(100% - 12px)",
        },
      }),
    [borderPrimary]
  );
};
