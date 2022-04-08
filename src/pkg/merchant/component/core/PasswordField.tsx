/*
 *  component/form/PasswordField.tsx
 *  Project-Lego
 *
 *  Provides a configurabled password field with options for new password,
 *  current password, or confirm password.
 *
 *  Created by Sola Ogunsakin on 11/12/18.
 *  Copyright © 2018-present ContextLogic Inc. All rights reserved.
 */
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, observable, action } from "mobx";
import { observer } from "mobx-react";
import pick from "lodash/pick";

/* Lego Components */
import { Field, TextInput, TextInputProps } from "@ContextLogic/lego";
import PasswordInput, { PasswordInputProps } from "./PasswordInput";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* SVGs */
import eyeOpen from "@assets/img/eye-open.svg";
import eyeClosed from "@assets/img/eye-closed.svg";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import NextImage from "next/image";

export type PasswordFieldType = "CURRENT" | "NEW" | "CONFIRM";

export type PasswordFieldProps = BaseProps &
  Pick<
    TextInputProps,
    | "disabled"
    | "placeholder"
    | "height"
    | "debugValue"
    | "borderColor"
    | "validationResponse"
  > &
  Pick<
    PasswordInputProps,
    "password" | "onPasswordChange" | "onValidityChanged" | "forceValidation"
  > & {
    readonly type: PasswordFieldType;
    readonly title?: string;
  };

@observer
class PasswordField extends Component<PasswordFieldProps> {
  static propDoc = PasswordInput.propDoc;

  static demoProps: PasswordFieldProps = { type: "NEW" };

  @observable
  passwordVisibleToggled = false;

  @computed
  get passwordVisible(): boolean {
    const { disabled } = this.props;
    return this.passwordVisibleToggled && disabled !== true;
  }

  @action
  toggleVisible = () => {
    const { disabled } = this.props;
    if (disabled) {
      return;
    }

    this.passwordVisibleToggled = !this.passwordVisibleToggled;
  };

  @computed
  get styles() {
    const { disabled } = this.props;
    return StyleSheet.create({
      showPassword: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        fontSize: 14,
        lineHeight: 1.43,
        userSelect: "none",
        color: palettes.textColors.DarkInk,
        fontWeight: fonts.weightSemibold,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "default" : "pointer",
      },
      eye: {
        width: 16,
        height: 16,
        marginRight: 5,
      },
    });
  }

  @computed
  get textInputProps() {
    return pick(this.props, [
      "disabled",
      "placeholder",
      "height",
      "debugValue",
      "borderColor",
      "validationResponse",
    ]);
  }

  @computed
  get passwordInputProps() {
    return pick(this.props, [
      "password",
      "onPasswordChange",
      "onValidityChanged",
      "forceValidation",
    ]);
  }

  @computed
  get type() {
    const { type } = this.props;
    return type;
  }

  renderRight = () => {
    const { passwordVisible } = this;
    return (
      <div
        className={css(this.styles.showPassword)}
        onClick={this.toggleVisible}
      >
        <NextImage
          className={css(this.styles.eye)}
          src={passwordVisible ? eyeClosed : eyeOpen}
          alt={passwordVisible ? "eye closed" : "eye open"}
        />
        {passwordVisible ? i`Hide password` : i`Show password`}
      </div>
    );
  };

  renderPassword = () => {
    const { type, passwordVisible, textInputProps, passwordInputProps } = this;
    const { password, onPasswordChange, forceValidation } = passwordInputProps;

    switch (type) {
      case "CURRENT":
      case "CONFIRM":
        return (
          <TextInput
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={({ text }) => {
              onPasswordChange && onPasswordChange(text);
            }}
            {...textInputProps}
          />
        );
      default:
        return (
          <PasswordInput
            autoComplete={type == "NEW" ? "new-password" : undefined}
            {...textInputProps}
            {...passwordInputProps}
            passwordVisible={passwordVisible}
            forceValidation={forceValidation}
          />
        );
    }
  };

  render() {
    const { className, style, title } = this.props;
    return (
      <Field
        title={title || i`Password`}
        className={css(className, style)}
        renderRightSide={this.renderRight}
      >
        {this.renderPassword()}
      </Field>
    );
  }
}

export default PasswordField;
