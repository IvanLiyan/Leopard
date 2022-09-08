//
//
//  component/modal/ModalFooter.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/20/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Button } from "@ContextLogic/lego";
import { PrimaryButton } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ButtonProps } from "@ContextLogic/lego";
import { PrimaryButtonProps } from "@ContextLogic/lego";
import { useDeviceStore } from "@stores/DeviceStore";

export type ModalFooterLayout =
  | "vertical"
  | "horizontal"
  | "vertical-consistent-width"
  | "horizontal-centered"
  | "horizontal-space-between";

export type FooterActionProps = PrimaryButtonProps & {
  readonly text: string;
};
export type FooterButtonProps = ButtonProps & { readonly text?: string | null };

export type ModalFooterProps = BaseProps & {
  readonly action?: FooterActionProps | null | undefined;
  readonly cancel?: FooterButtonProps | null | undefined;
  readonly extraFooterContent?: React.ReactNode;
  readonly layout?: ModalFooterLayout;
};

const FooterPrimaryButton = observer((props: FooterActionProps) => {
  const { text, ...buttonProps } = props;

  const { isSmallScreen } = useDeviceStore();
  const defaultPadding = `7px ${isSmallScreen ? 25 : 40}px`;

  return (
    <PrimaryButton style={{ padding: defaultPadding }} {...buttonProps}>
      {text}
    </PrimaryButton>
  );
});

const FooterButton = observer((props: FooterButtonProps) => {
  const { text, children: childrenProp, ...buttonProps } = props;
  const children = text || childrenProp;

  return <Button {...buttonProps}>{children}</Button>;
});

const ModalFooter = (props: ModalFooterProps) => {
  const styles = useStylesheet(props);

  const { action, cancel, extraFooterContent, layout, className, style } =
    props;

  const { isSmallScreen } = useDeviceStore();
  const defaultPadding = `7px ${isSmallScreen ? 25 : 40}px`;

  if (!action && !cancel && !extraFooterContent) {
    return null;
  }
  return (
    <div className={css(styles.root, className, style)}>
      <div className={css(styles.widthWrapper)}>
        {extraFooterContent}
        {cancel != null && (
          <FooterButton
            style={[styles.cancelButton, { padding: defaultPadding }]}
            {...cancel}
            hideBorder={
              layout != "horizontal" &&
              layout != "horizontal-centered" &&
              layout != "horizontal-space-between"
            }
          />
        )}
        {action != null && (
          <FooterPrimaryButton {...action} style={{ flex: 0 }} />
        )}
      </div>
    </div>
  );
};

export default observer(ModalFooter);

const useStylesheet = (props: ModalFooterProps) => {
  const { layout = "horizontal" } = props;
  let cancelButtonWidth: "100%" | "inherit" | "auto" = "inherit";
  if (layout == "vertical-consistent-width") {
    cancelButtonWidth = "100%";
  } else if (layout == "horizontal-space-between") {
    cancelButtonWidth = "auto";
  }

  return StyleSheet.create({
    root: {
      borderTop: `1px solid ${palettes.greyScaleColors.Grey}`,
      padding: "20px 25px",
      display: "flex",
      flexDirection:
        layout == "horizontal" ||
        layout == "horizontal-centered" ||
        layout == "horizontal-space-between"
          ? "row"
          : "column-reverse",
      alignItems: "center",
      justifyContent: layout == "horizontal-centered" ? "center" : "flex-end",
      backgroundColor: palettes.textColors.White,
    },
    widthWrapper: {
      display: "flex",
      flexDirection: "inherit",
      alignItems: "center",
      justifyContent:
        layout == "horizontal-space-between" ? "space-between" : "flex-end",
      width: layout == "horizontal-space-between" ? "100%" : "auto",
    },
    cancelButton: {
      marginRight:
        layout == "horizontal" ||
        layout == "horizontal-centered" ||
        layout == "horizontal-space-between"
          ? 10
          : 0,
      marginTop:
        layout == "horizontal" ||
        layout == "horizontal-centered" ||
        layout == "horizontal-space-between"
          ? 0
          : 10,
      width: cancelButtonWidth,
    },
  });
};
