import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { useTheme } from "@stores/ThemeStore";

import NavDot from "./NavDot";

type Props = BaseProps & {
  screen: number;
  numScreens: number;
  setScreen: (arg0: number) => unknown;
  onDone: () => unknown;
};

const Footer: React.FC<Props> = ({
  className,
  style,
  screen,
  numScreens,
  setScreen,
  onDone,
}: Props) => {
  const styles = useStylesheet();
  const lastScreen = numScreens - 1;

  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.navContainer)}>
        {[...Array(numScreens)].map((_, i) => (
          <NavDot
            selected={i === screen}
            onClick={i !== screen ? () => setScreen(i) : undefined}
          />
        ))}
      </div>
      <div className={css(styles.buttonContainer)}>
        {screen !== 0 && (
          <Button
            onClick={() => {
              setScreen(screen - 1);
            }}
          >
            Go Back
          </Button>
        )}
        {screen < lastScreen && (
          <PrimaryButton
            onClick={() => {
              setScreen(screen + 1);
            }}
            minWidth
          >
            Next
          </PrimaryButton>
        )}
        {screen === lastScreen && (
          <PrimaryButton
            onClick={() => {
              onDone();
            }}
            minWidth
          >
            Done
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};

export default observer(Footer);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          border: `1px solid ${borderPrimary}`,
          "@media (max-width: 900px)": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "24px 0px",
          },
          "@media (min-width: 900px)": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "calc(100% - 104px)",
            padding: "24px 24px 24px 80px",
          },
        },
        navContainer: {
          display: "flex",
          "@media (max-width: 900px)": {
            marginBottom: 24,
          },
          ":nth-child(1n) > :not(:last-child)": {
            marginRight: 8,
          },
        },
        buttonContainer: {
          display: "flex",
          ":nth-child(1n) > :not(:last-child)": {
            marginRight: 24,
          },
        },
      }),
    [borderPrimary],
  );
};
