/*
 * EditButton.tsx
 * Merchant Plus
 *
 * Created by Lucas Liepert on 6/02/2020
 * Copyright © 2020-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { StaggeredScaleIn, LoadingIndicator } from "@ContextLogic/lego";
import { DEPRECATEDIcon as Icon } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly onEdit: () => unknown;
  readonly isLoading?: boolean;
};

const EditButton: React.FC<Props> = (props: Props) => {
  const { className, style, onEdit, isLoading } = props;
  const styles = useStylesheet(props);
  const { textLight } = useTheme();

  if (isLoading) {
    return (
      <StaggeredScaleIn animationDurationMs={400}>
        <LoadingIndicator type="spinner" size={16} color={textLight} />
      </StaggeredScaleIn>
    );
  }

  return (
    <div className={css(className, style, styles.root)} onClick={onEdit}>
      <Icon name="lightInkEdit" className={css(styles.icon)} />
      <div className={css(styles.text)}>Edit</div>
    </div>
  );
};

export default observer(EditButton);

const useStylesheet = (props: Props) => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          cursor: "pointer",
          ":hover": {
            ":nth-child(1n) > div": {
              opacity: "1 !important",
            },
          },
        },
        icon: {
          height: 15,
          marginLeft: 15,
          marginRight: 12,
          opacity: 0,
        },
        text: {
          color: textLight,
          opacity: 0.6,
        },
      }),
    [textLight],
  );
};
