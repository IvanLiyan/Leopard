import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import faker from "faker/locale/en";
import { EventEmitter } from "fbemitter";

/* Lego Components */
import {
  Card,
  Link,
  PrimaryButton,
  Field,
  TextInput,
  EmailInput,
  OnTextChangeEvent,
} from "@ContextLogic/lego";

/* Merchant Components */
import SignupTOSText from "@merchant/component/signup/SignupTOSText";
import CaptchaInput, {
  OnCaptchaChangeEvent,
} from "@merchant/component/login/CaptchaInput";

import { PasswordField } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { weightBold, weightMedium } from "@toolkit/fonts";
import { StoreNameValidator, NoWishEmailsValidator } from "@toolkit/validators";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";

/* Merchant Stores */
import { useTheme } from "@merchant/stores/ThemeStore";

type StoreSignupBasicInfoProps = BaseProps & {
  readonly showCaptcha?: boolean | null | undefined;
};

const FieldHeight = 40;

const StoreSignupBasicInfo: React.FC<StoreSignupBasicInfoProps> = (
  props: StoreSignupBasicInfoProps
) => {
  const { className, style, showCaptcha } = props;

  const styles = useStylesheet();

  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState<string | null | undefined>();
  const [emailIsValid, setEmailIsValid] = useState(false);

  const [password, setPassword] = useState<string | null | undefined>();
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  const [storeName, setStoreName] = useState<string | null | undefined>();
  const [storeNameIsValid, setStoreNameIsValid] = useState(false);

  const [captcha, setCaptcha] = useState<string | null | undefined>();
  const [captchaToken, setCaptchaToken] = useState<string | null | undefined>();

  const onCreateClicked = async () => {
    setIsLoading(true);
    // GQL call here
    setIsLoading(false);
  };

  const canCreate =
    emailIsValid &&
    passwordIsValid &&
    storeNameIsValid &&
    (!showCaptcha || (showCaptcha && !!captcha && !!captchaToken));

  const refreshEmitter = new EventEmitter();

  const storeNameValidators = [new StoreNameValidator()];

  const emailValidators = [new NoWishEmailsValidator()];

  return (
    <Card className={css(className, style)}>
      <div className={css(styles.root)}>
        <section className={css(styles.title)}>
          Create your free store today
        </section>
        <div className={css(styles.content)}>
          <Field className={css(styles.field)} title={i`Your store name`}>
            <TextInput
              placeholder={i`Create a name for your store`}
              focusOnMount
              onChange={({ text }: OnTextChangeEvent) => setStoreName(text)}
              disabled={isLoading}
              height={FieldHeight}
              validators={storeNameValidators}
              onValidityChanged={(isValid) => setStoreNameIsValid(isValid)}
              debugValue={faker.company.companyName()}
              value={storeName}
            />
          </Field>
          <Field className={css(styles.field)} title={i`Email address`}>
            <EmailInput
              placeholder={i`Enter your email address`}
              onChange={({ text }: OnTextChangeEvent) => setEmail(text)}
              disabled={isLoading}
              height={FieldHeight}
              onValidityChanged={(isValid) => setEmailIsValid(isValid)}
              validators={emailValidators}
              debugValue={faker.internet.email()}
              value={email}
            />
          </Field>
          <PasswordField
            type="NEW"
            className={css(styles.field)}
            placeholder={i`Create a password`}
            password={password}
            disabled={isLoading}
            onPasswordChange={(text: string) => setPassword(text)}
            height={FieldHeight}
            onValidityChanged={(isValid) => setPasswordIsValid(isValid)}
            debugValue={faker.internet.password()}
          />
          {showCaptcha && (
            <CaptchaInput
              className={css(styles.field)}
              onCaptcha={({ text, captchaToken }: OnCaptchaChangeEvent) => {
                setCaptcha(text);
                setCaptchaToken(captchaToken);
              }}
              disabled={isLoading}
              onRefresh={() => {
                setCaptcha(null);
                setCaptchaToken(null);
              }}
              text={captcha}
              height={FieldHeight}
              refreshEmitter={refreshEmitter}
            />
          )}
          <SignupTOSText buttonText={i`Create my store`} />
          <PrimaryButton
            onClick={onCreateClicked}
            isDisabled={!canCreate}
            isLoading={isLoading}
          >
            {isLoading ? i`Creating your account` : i`Create my store`}
          </PrimaryButton>
        </div>
        <div className={css(styles.bottomPromptContainer)}>
          <div className={css(styles.prompt)}>
            <section>Already have an account?</section>
            <Link className={css(styles.loginHere)} href="/login">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default observer(StoreSignupBasicInfo);

const useStylesheet = () => {
  const { textBlack, surfaceLightest } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          padding: "0px 25px",
          backgroundColor: surfaceLightest,
        },
        title: {
          fontSize: 24,
          fontWeight: weightBold,
          lineHeight: 1.33,
          color: textBlack,
          alignSelf: "center",
          textAlign: "center",
          padding: "40px 0px",
          cursor: "default",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignSelf: "stretch",
          alignItems: "stretch",
        },
        field: {
          marginBottom: 25,
          ":last-child": {
            marginBottom: 10,
          },
        },
        bottomPromptContainer: {
          padding: "25px 0px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        },
        loginHere: {
          marginLeft: 5,
        },
        prompt: {
          fontWeight: weightMedium,
          color: textBlack,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          marginBottom: 10,
        },
        chinaFlag: {
          height: 12,
          marginRight: 5,
          borderRadius: 2,
        },
      }),
    [textBlack, surfaceLightest]
  );
};
