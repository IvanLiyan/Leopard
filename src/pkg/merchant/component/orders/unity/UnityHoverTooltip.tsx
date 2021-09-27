import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";

import { css } from "@toolkit/styling";

import { Popover } from "@merchant/component/core";

import * as fonts from "@toolkit/fonts";
import { useTheme } from "@merchant/stores/ThemeStore";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type Props = BaseProps & {
  readonly contentText: string;
  readonly tipText: string;
  readonly lightText?: boolean | null | undefined;
};
const UnityHoverTooltip: React.FC<Props> = ({
  contentText,
  tipText,
  lightText,
}: Props) => {
  const styles = useStylesheet();

  const className = lightText ? css(styles.pending) : undefined;

  return (
    <Popover
      popoverContent={tipText}
      position="top center"
      popoverMaxWidth={200}
      openContentLinksInNewTab
    >
      <span className={className}>{contentText}</span>
    </Popover>
  );
};

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        pending: {
          fontWeight: fonts.weightNormal,
          color: textLight,
        },
      }),
    [textLight],
  );
};

export default UnityHoverTooltip;
