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
import { css } from "@core/toolkit/styling";
import { RequiredValidator } from "@core/toolkit/validators";

/* Toolkit */
import { GetCaptchaResponse } from "@landing-pages/authentication/toolkit/authentication";
import { merchFeUrl } from "@core/toolkit/router";

/* Components */
import Icon from "@core/components/Icon";
import NextImage from "@core/components/Image";
import { withRestApi, WithRestApiProps } from "@core/toolkit/restApi";

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
} & WithRestApiProps<GetCaptchaResponse, "Captcha">; // include HOC props

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
    onCaptcha: () => undefined,
    onRefresh: () => undefined,
    placeholder: `Code in the picture`,
  };

  componentDidMount() {
    const { refreshEmitter, onRefresh } = this.props;
    refreshEmitter.addListener("refreshCaptcha", () => {
      void this.props.mutateCaptcha();
      onRefresh();
    });
  }

  componentWillUnmount() {
    const { refreshEmitter } = this.props;
    refreshEmitter.removeAllListeners("refreshCaptcha");
  }

  @computed
  get captchaToken(): string | null | undefined {
    return this.props.dataCaptcha?.token;
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
        minWidth: 200,
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
    // Disable rule to make sure inputProps do not contain unrelated props
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      placeholder,
      className,
      onCaptcha,
      text,
      onRefresh,
      required,
      refreshEmitter,
      dataCaptcha,
      errorCaptcha,
      isLoadingCaptcha,
      isValidatingCaptcha,
      mutateCaptcha,
      ...inputProps
    } = this.props;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const captchaToken = this.captchaToken;
    return (
      <LoadingIndicator loadingComplete={!isLoadingCaptcha}>
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
            <NextImage
              src={merchFeUrl(`/captcha/${captchaToken}`)}
              className={css(this.styles.image)}
              draggable={false}
              alt="captcha"
            />
          )}
          <Button
            style={this.styles.refreshButton}
            onClick={() => {
              void mutateCaptcha();
              onRefresh();
            }}
            disabled={inputProps.disabled}
          >
            <Icon
              name="refresh"
              size={14}
              className={css(this.styles.refreshIcon)}
            />
          </Button>
        </div>
      </LoadingIndicator>
    );
  }
}

export default withRestApi<GetCaptchaResponse, CaptchaInputProps, "Captcha">(
  CaptchaInput,
  "Captcha",
);
