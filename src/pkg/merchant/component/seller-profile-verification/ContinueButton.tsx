import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

/* API */
import { startOver } from "@merchant/api/seller-profile-verification";

/* Lego Components */
import { PrimaryButton } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { ConfirmationModal } from "@merchant/component/core/modal";

import { useNavigationStore } from "@stores/NavigationStore";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Stores */
import { useTheme, AppTheme } from "@stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type ContinueButtonProps = BaseProps & {
  readonly text: string;
  readonly isLoading?: boolean;
  readonly isDisabled?: boolean;
  readonly onClick: () => void | (Promise<unknown> | null | undefined);
};

const ContinueButton = (props: ContinueButtonProps) => {
  const { className, style, text, onClick, isLoading, isDisabled } = props;
  const theme = useTheme();
  const styles = useStylesheet(theme);
  const navigationStore = useNavigationStore();
  const handleStartOver = async () => {
    await startOver({}).call();
    navigationStore.reload();
  };

  const handleClickStartOver = () => {
    const confirmText = i`Your previous information will be cleared. Are you sure?`;
    const modal = new ConfirmationModal(confirmText);
    modal
      .setHeader({ title: i`Start over the flow` })
      .setCancel(i`Cancel`)
      .setAction(i`Confirm`, handleStartOver)
      .render();
  };

  return (
    <div className={css(styles.root, style, className)}>
      <Link onClick={handleClickStartOver}>
        Clear previous information and start over
      </Link>
      <PrimaryButton
        onClick={onClick}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        {text}
      </PrimaryButton>
    </div>
  );
};

export default ContinueButton;

const useStylesheet = (theme: AppTheme) => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          borderTop: `1px solid ${theme.borderPrimaryDark}`,
        },
      }),
    [theme],
  );
};
