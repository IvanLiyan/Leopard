import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { StaggeredScaleIn, LoadingIndicator } from "@ContextLogic/lego";
import * as icons from "@assets/icons";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@merchant/stores/ThemeStore";

type Props = BaseProps & {
  readonly onEdit: () => unknown;
  readonly isLoading?: boolean;
  readonly disabled: boolean;
};

const EditButton: React.FC<Props> = (props: Props) => {
  const { className, style, onEdit, isLoading, disabled = false } = props;
  const styles = useStylesheet();
  const { textLight } = useTheme();

  if (isLoading) {
    return (
      <StaggeredScaleIn animationDurationMs={400}>
        <LoadingIndicator type="spinner" size={16} color={textLight} />
      </StaggeredScaleIn>
    );
  }

  return (
    <div
      className={css(
        className,
        style,
        styles.root,
        disabled && styles.disabled
      )}
      onClick={disabled ? undefined : onEdit}
    >
      <div className={css(styles.icon)} />
      <div className={css(styles.text)}>Edit</div>
    </div>
  );
};

export default observer(EditButton);

const useStylesheet = () => {
  const { primary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          cursor: "pointer",
          transition: "opacity 0.3s linear",
          ":hover": {
            opacity: 0.6,
          },
        },
        disabled: {
          cursor: "not-allowed",
          opacity: 0.6,
        },
        icon: {
          height: 16,
          width: 16,
          marginRight: 6,
          mask: `url(${icons.edit}) no-repeat 50% 50%`,
          backgroundColor: primary,
        },
        text: {
          color: primary,
          height: 16,
          fontSize: 16,
          fontWeight: fonts.weightMedium,
        },
      }),
    [primary]
  );
};
