//
//  component/form/CaptchaInput.tsx
//  Project-Lego
//
//  Created by Sola Ogunsakin on 11/12/18.
//  Copyright © 2018-present ContextLogic Inc. All rights reserved.
//
import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { computed, action } from "mobx";
import { observer } from "mobx-react";

/* External Libraries */
import { EventEmitter } from "fbemitter";

/* Lego Components */
import {
  Button,
  TextInput,
  LoadingIndicator,
  TextInputProps,
  OnTextChangeEvent,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { refresh as refreshIcon } from "@assets/icons";
import { RequiredValidator } from "@toolkit/validators";

/* Merchant API */
import * as authenticationApi from "@merchant/api/authentication";

export type OnCaptchaChangeEvent = {
  readonly text: string;
  readonly captchaToken: string;
};

export type CaptchaInputProps = TextInputProps & {
  readonly required?: boolean;
  readonly onRefresh: () => unknown;
  readonly onCaptcha: (e: OnCaptchaChangeEvent) => unknown;
  readonly text?: string | null | undefined;
  readonly refreshEmitter: EventEmitter;
};

@observer
class CaptchaInput extends Component<CaptchaInputProps> {
  static defaultProps: Partial<CaptchaInputProps> = {
    required: true,
    height: 40,
    placeholder: i`Code in the picture`,
  };

  static demoProps = {
    required: true,
    text: "",
    onCaptcha: () => {},
    onRefresh: () => {},
    placeholder: `Code in the picture`,
  };

  componentDidMount() {
    const { refreshEmitter, onRefresh } = this.props;
    refreshEmitter.addListener("refreshCaptcha", () => {
      this.captchaRequest.refresh();
      onRefresh();
    });
  }

  componentWillUnmount() {
    const { refreshEmitter } = this.props;
    refreshEmitter.removeAllListeners("refreshCaptcha");
  }

  @computed
  get captchaRequest() {
    return authenticationApi.getCaptchaToken();
  }

  @computed
  get captchaToken(): string | null | undefined {
    return this.captchaRequest.response?.data?.token;
  }

  @action
  onChange = ({ text }: OnTextChangeEvent) => {
    this.props.onCaptcha({ text, captchaToken: this.captchaToken || "" });
  };

  @computed
  get validators(): TextInputProps["validators"] {
    const { required } = this.props;
    const customMessage = i`Please enter the captcha code.`;
    // Flow cannot tell that the null values are being filtered out
    // of the array.

    return required ? [new RequiredValidator({ customMessage })] : [];
  }

  @computed
  get styles() {
    const { height } = this.props;
    return StyleSheet.create({
      root: {
        display: "flex",
        alignItems: "stretch",
        flexDirection: "row",
        flexWrap: "wrap",
      },
      input: {
        marginRight: 10,
      },
      image: {
        height,
        marginRight: 10,
        marginBottom: 10,
        minWidth: 130,
      },
      refreshButton: {
        width: height,
        height,
        marginBottom: 10,
        padding: "13px",
      },
      refreshIcon: {
        width: 14,
      },
    });
  }

  render() {
    const {
      placeholder,
      className,
      onCaptcha,
      text,
      onRefresh,
      required,
      refreshEmitter,
      ...inputProps
    } = this.props;
    const captchaToken = this.captchaToken;
    return (
      <LoadingIndicator loadingComplete={this.captchaRequest.response != null}>
        <div className={css(this.styles.root, className)}>
          <TextInput
            className={css(this.styles.input)}
            {...inputProps}
            value={text}
            onChange={this.onChange}
            validators={this.validators}
            placeholder={placeholder}
            hideCheckmarkWhenValid
          />
          {captchaToken && (
            <img
              src={`/captcha/${captchaToken}`}
              className={css(this.styles.image)}
              draggable={false}
            />
          )}
          <Button
            style={this.styles.refreshButton}
            onClick={() => {
              this.captchaRequest.refresh();
              onRefresh();
            }}
            disabled={inputProps.disabled}
          >
            <img
              src={refreshIcon}
              className={css(this.styles.refreshIcon)}
              alt="refresh"
              draggable={false}
            />
          </Button>
        </div>
      </LoadingIndicator>
    );
  }
}

export default CaptchaInput;
