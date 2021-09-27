/*
 * ConfirmationScreen.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/03/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Lego Components */
import { IllustrationName } from "@merchant/component/core";

/* Merchant Plus Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Illustration } from "@merchant/component/core";
import SettingsTip from "@plus/component/settings/toolkit/SettingsTip";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly closeModal: () => unknown;
  readonly bodyText: string;
  readonly tipText?: string;
  readonly illustration?: IllustrationName;
};

const ConfirmationScreen: React.FC<Props> = (props: Props) => {
  const {
    className,
    style,
    closeModal,
    bodyText,
    tipText,
    illustration = "greenCheckmark",
  } = props;
  const styles = useStylesheet();

  return (
    <>
      <div className={css(styles.content, className, style)}>
        <Illustration
          className={css(styles.illustration)}
          name={illustration}
          alt={i`confirmation screen`}
        />
        <Markdown text={bodyText} />
        {tipText && <SettingsTip className={css(styles.tip)} text={tipText} />}
      </div>
      <div className={css(styles.buttonContainer)}>
        <PrimaryButton
          onClick={() => {
            closeModal();
          }}
          popoverStyle={css(styles.button)}
        >
          Ok
        </PrimaryButton>
      </div>
    </>
  );
};

export default ConfirmationScreen;

const useStylesheet = () => {
  const { borderPrimaryDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "40px 72px",
        },
        illustration: {
          marginBottom: 20,
          height: 80,
          width: 80,
        },
        tip: {
          marginTop: 40,
          textAlign: "left",
        },
        buttonContainer: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          borderTop: `1px solid ${borderPrimaryDark}`,
        },
        button: {
          minWidth: 160,
        },
      }),
    [borderPrimaryDark]
  );
};
