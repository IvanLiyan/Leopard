//
//  component/modal/ConfirmationModal.ts
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/20/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//

/* eslint-disable no-console */
import React, { Component, ReactNode } from "react";
import { StyleSheet, CSSProperties } from "aphrodite";
import { observer } from "mobx-react";
import { computed, action } from "mobx";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { Markdown } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import Illustration from "@merchant/component/core/Illustration";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

import { ButtonProps } from "@ContextLogic/lego";
import { FooterActionProps } from "@merchant/component/core/modal/ModalFooter";
import { RenderFn, OnCloseFn } from "@merchant/component/core/modal/Modal";
import { IllustrationName } from "@merchant/component/core/Illustration";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { ModalFooterLayout } from "@merchant/component/core/modal/ModalFooter";

type ConfirmationModalContentProps = BaseProps & {
  readonly onClose: OnCloseFn;
  readonly illustration: IllustrationName | undefined | null;
  readonly renderContent: () => ReactNode;
  readonly onCancel: (() => unknown) | null | undefined;
  readonly padding: CSSProperties["padding"] | undefined | null;
};

export type FooterStyles = {
  readonly justifyContent: CSSProperties["justifyContent"] | undefined;
};

@observer
class ConfirmationModalContent extends Component<
  ConfirmationModalContentProps
> {
  @computed
  get styles() {
    const { padding } = this.props;

    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        padding: padding == null ? "0px 90px" : padding,
      },
      illustration: {
        height: 100,
        "@media (max-width: 900px)": {
          display: "none",
        },
        paddingTop: 28,
      },
      textContent: {
        fontSize: 16,
        lineHeight: 1.5,
        textAlign: "left",
        color: palettes.textColors.Ink,
        fontWeight: fonts.weightNormal,
        padding: "28px 0px",
      },
    });
  }

  renderContent() {
    const { renderContent } = this.props;

    const result = renderContent();
    if (typeof result === "string") {
      return (
        <Markdown className={css(this.styles.textContent)} text={result} />
      );
    }

    return result;
  }

  render() {
    const { illustration, className } = this.props;
    return (
      <div className={css(this.styles.root, className)}>
        {illustration && (
          <Illustration
            name={illustration}
            className={css(this.styles.illustration)}
            alt="illustration"
          />
        )}
        {this.renderContent()}
      </div>
    );
  }
}

export default class ConfirmationModal extends Modal {
  cancelText: string | null | undefined;
  actionText: string | null | undefined;
  onAction: (() => unknown) | null | undefined;
  onCancel: (() => unknown) | null | undefined;
  footerLayout: ModalFooterLayout = "horizontal";
  actionDisabled: (() => boolean) | null | undefined;

  illustration: IllustrationName | null | undefined;
  footerStyle: FooterStyles | null | undefined;
  contentPadding: string | number | null | undefined;

  constructor(renderFn: string | RenderFn) {
    super((onClose: OnCloseFn) => {
      if (typeof renderFn === "string") {
        return renderFn;
      }

      return renderFn(onClose);
    });

    this.setWidthPercentage(0.45);

    this.setRenderFooter(() => (
      <ModalFooter
        style={this.footerStyle}
        cancel={this.cancelButtonProps}
        action={this.actionButtonProps}
        layout={this.footerLayout}
      />
    ));
  }

  @action
  onActionClicked = async () => {
    const { onAction } = this;
    if (onAction == null) {
      return;
    }

    await onAction();
    this.close();
  };

  @computed
  get actionButtonProps(): null | FooterActionProps {
    const { actionText } = this;
    if (actionText == null) {
      return null;
    }

    let isDisabled = false;
    if (this.actionDisabled) {
      isDisabled = this.actionDisabled();
    }

    return {
      text: actionText,
      onClick: this.onActionClicked,
      isDisabled,
    };
  }

  @computed
  get cancelButtonProps(): null | ButtonProps {
    const { cancelText, onCancel } = this;
    if (cancelText == null) {
      return null;
    }

    return {
      children: cancelText,
      onClick: () => {
        if (onCancel) {
          onCancel();
        }
        this.close();
      },
    };
  }

  setFooterStyle(footerStyle: FooterStyles): ConfirmationModal {
    this.footerStyle = footerStyle;
    return this;
  }

  setCancel(
    cancelText: string,
    onCancel?: (() => unknown) | null
  ): ConfirmationModal {
    this.cancelText = cancelText;
    this.onCancel = onCancel;
    return this;
  }

  setAction(actionText: string, onAction: () => unknown): ConfirmationModal {
    this.onAction = onAction;
    this.actionText = actionText;
    return this;
  }

  setFooterLayout(layout: ModalFooterLayout): ConfirmationModal {
    this.footerLayout = layout;
    return this;
  }

  setIllustration(
    illustration: undefined | IllustrationName | null
  ): ConfirmationModal {
    this.illustration = illustration;
    return this;
  }

  setActionDisabled(disableFn: () => boolean): ConfirmationModal {
    this.actionDisabled = disableFn;
    return this;
  }

  setContentPadding(value: string | number): ConfirmationModal {
    this.contentPadding = value;
    return this;
  }

  renderContent() {
    const { actionText, onAction, onCancel, contentPadding } = this;
    if (console.assert) {
      console.assert(
        actionText != null,
        "should have an action set. otherwise use a regular Modal"
      );
    }

    if (actionText == null || onAction == null) {
      return null;
    }

    return (
      <ConfirmationModalContent
        renderContent={() => super.renderContent()}
        onClose={() => this.close()}
        onCancel={onCancel}
        illustration={this.illustration}
        padding={contentPadding}
      />
    );
  }
}
