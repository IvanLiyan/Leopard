import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { toTitleCase } from "@ContextLogic/lego/toolkit/string";
import { useTheme } from "@merchant/stores/ThemeStore";
import * as fonts from "@toolkit/fonts";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import ABSBApplicationState from "@merchant/model/brand/branded-products/ABSBApplicationState";

export type HeaderProps = BaseProps & {
  currentApplication: ABSBApplicationState;
};

const Header = ({ className, style, currentApplication }: HeaderProps) => {
  const styles = useStylesheet();

  let output = i`Authentic Brand Seller Application`;

  if (currentApplication.brandNameStepComplete && currentApplication.brand) {
    output = output + ` / ${currentApplication.brand.displayName}`;
  }

  if (
    currentApplication.authorizationTypeStepComplete &&
    currentApplication.authorizationType
  ) {
    output =
      output +
      ` / ${toTitleCase(
        currentApplication.authorizationType.replace("_", " ")
      )}`;
  }

  return <div className={css(styles.text, className, style)}>{output}</div>;
};

export default observer(Header);

const useStylesheet = () => {
  const { textLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        text: {
          color: textLight,
          fontWeight: fonts.weightMedium,
          fontSize: 16,
          lineHeight: 1.5,
        },
      }),
    [textLight]
  );
};
