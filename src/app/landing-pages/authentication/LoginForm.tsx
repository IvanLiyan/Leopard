import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useMutation } from "@apollo/client";

/* External Libraries */
import faker from "faker/locale/en";
import { EventEmitter } from "fbemitter";
import Cookies from "js-cookie";

/* Lego Components */
import {
  Field,
  TextInput,
  OnTextChangeEvent,
  Layout,
  CheckboxField,
  Markdown,
  PrimaryButton,
  Ul,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { useTimer } from "@ContextLogic/lego/toolkit/hooks";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { LoginMutationInput, TwoFactorGenTokenInput } from "@schema";

/* Merchant Components */
import CaptchaInput, {
  OnCaptchaChangeEvent,
} from "@landing-pages/authentication/CaptchaInput";
import PasswordField from "@core/components/PasswordField";
import LoginCard from "@landing-pages/authentication/LoginCard";
import WechatQrInput from "@landing-pages/authentication/WechatQrInput";
import Link from "@deprecated/components/Link";

/* Merchant Stores */
import { useToastStore } from "@core/stores/ToastStore";

/* Toolkit */
import {
  LOGIN_MUTATION,
  LoginResponseType,
  LoginRequestType,
} from "@landing-pages/authentication/toolkit/login";
import {
  TWO_FACTOR_GEN_TOKEN_MUTATION,
  TwoFactorGenTokenResponseType,
  TwoFactorGenTokenRequestType,
} from "@landing-pages/authentication/toolkit/gen-token";
import { useStringQueryParam } from "@core/toolkit/url";
import { merchFeUrl, useRouter } from "@core/toolkit/router";
import { ci18n, i18n } from "@core/toolkit/i18n";

type LoginFormProps = BaseProps;

const FieldHeight = 40;

const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
  const { className, style } = props;

  const styles = useStylesheet();

  const toastStore = useToastStore();
  const router = useRouter();

  const savedUsername = Cookies.get("remember_me");
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState<string | null | undefined>(
    savedUsername || undefined,
  );

  const [password, setPassword] = useState<string | null | undefined>();

  const [rememberMe, setRememberMe] = useState(savedUsername != null);

  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [captchaCode, setCaptchaCode] = useState<string | null | undefined>();
  const [captchaToken, setCaptchaToken] = useState<string | null | undefined>();

  const [showTfaPage, setShowTfaPage] = useState(false);
  const [canUseWechatQr, setCanUseWechatQr] = useState(false);
  const [showWechatQr, setShowWechatQr] = useState(false);
  const [showBackupCode, setShowBackupCode] = useState(false);
  const [tfaToken, setTfaToken] = useState<string | null | undefined>();
  const [verificationCode, setVerificationCode] = useState("");
  const [obfuscatedPhoneNumber, setObfuscatedPhoneNumber] = useState("");
  const [allowPhoneCall, setAllowPhoneCall] = useState(false);
  const [phoneCall, setPhoneCall] = useState(false);
  const [showEmployeePrompt, setShowEmployeePrompt] = useState(false);
  const [showMerchantPrompt, setShowMerchantPrompt] = useState(false);
  const [merchantBdEmail, setMerchantBdEmail] = useState<
    string | null | undefined
  >();

  const [countDownLeft, startCountDownTimer] = useTimer({
    periodMs: 60000,
    intervalMs: 1000,
    startNow: false,
  });

  const [loginUser] = useMutation<LoginResponseType, LoginRequestType>(
    LOGIN_MUTATION,
  );

  const [genTfaToken] = useMutation<
    TwoFactorGenTokenResponseType,
    TwoFactorGenTokenRequestType
  >(TWO_FACTOR_GEN_TOKEN_MUTATION);

  const [nextUrlRaw] = useStringQueryParam("next");
  const safePrefixes = ["https://", "http://", "/"];
  // prepend a forward slash; this handles situations like `?next=product`
  // if nextUrlRaw contains a XSS exploit, the exploit will turn into a link to a non-existent page and will
  // result in a 404 instead of a vulnerability
  const nextUrl = safePrefixes.some((prefix) => nextUrlRaw.startsWith(prefix))
    ? nextUrlRaw
    : `/${nextUrlRaw}`;

  const handleLogin = async (qrTicket?: string) => {
    setIsLoading(true);

    if (username == null || username.trim().length == 0) {
      toastStore.error(i`Email is required.`);
      setIsLoading(false);
      return;
    }

    if (password == null || password.trim().length == 0) {
      toastStore.error(i`Password is required.`);
      setIsLoading(false);
      return;
    }

    const input: LoginMutationInput = {
      username,
      password,
      captchaCode,
      captchaToken,
      rememberMe,
      tfaToken,
      qrTicket,
    };

    const { data } = await loginUser({ variables: { input } });

    if (data == null || data.authentication?.login == null) {
      toastStore.error(i`Something went wrong`);
      setIsLoading(false);
      return;
    }

    const {
      authentication: {
        login: {
          loginOk,
          error,
          sessionKey,
          errorState,
          preferQr,
          wechatBound,
        },
      },
    } = data;

    if (error) {
      if (errorState == "CAPTCHA_REQUIRED") {
        setShowCaptcha(true);
      } else if (errorState == "TFA_REQUIRED") {
        const input: TwoFactorGenTokenInput = {
          username,
        };
        const { data } = await genTfaToken({ variables: { input } });
        if (data == null || data.authentication?.gen2faCode == null) {
          toastStore.error(i`Something went wrong`);
          setIsLoading(false);
          return;
        }
        const {
          obfuscatedPhoneNumber,
          allowTfaPhone,
          isInternalEmployee,
          isMerchant,
          bdEmail,
          ok,
          error: tfaError,
        } = data.authentication.gen2faCode;
        if (ok) {
          setObfuscatedPhoneNumber(obfuscatedPhoneNumber || "");
          setAllowPhoneCall(allowTfaPhone || false);
          setVerificationCode(error);
          setShowTfaPage(true);
          setShowWechatQr(preferQr || false);
          setCanUseWechatQr(wechatBound || false);
          setShowEmployeePrompt(isInternalEmployee || false);
          setShowMerchantPrompt(isMerchant || false);
          setMerchantBdEmail(bdEmail);
          setShowCaptcha(false);
          setCaptchaCode(null);
          setCaptchaToken(null);
        } else {
          toastStore.error(tfaError || i`Something went wrong`);
        }
      } else {
        toastStore.error(error);
      }

      refreshEmitter.emit("refreshCaptcha");
      setIsLoading(false);
    }

    if (loginOk) {
      if (rememberMe && sessionKey != null) {
        Cookies.set("remember_me", username);
      }

      await router.push(merchFeUrl(nextUrl || "/"));
    }
  };

  const handleResendCode = async (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (username == null) {
      return;
    }
    const sendPhoneCall = (event.target as HTMLAnchorElement).hash === "#call";
    const input: TwoFactorGenTokenInput = {
      username,
      sendPhoneCall,
    };
    const { data } = await genTfaToken({ variables: { input } });
    if (data == null || data.authentication?.gen2faCode == null) {
      toastStore.error(i`Something went wrong`);
      return;
    }
    const { obfuscatedPhoneNumber, ok, error } = data.authentication.gen2faCode;
    if (ok) {
      startCountDownTimer();
      setObfuscatedPhoneNumber(obfuscatedPhoneNumber || "");
      setPhoneCall(sendPhoneCall);
    } else {
      toastStore.error(error || i`Something went wrong`);
    }
  };

  const handleQrVerified = async (qrTicket: string) => {
    await handleLogin(qrTicket);
  };

  const canSubmit =
    username != null &&
    username.trim().length !== 0 &&
    password != null &&
    password.trim().length !== 0 &&
    (!showCaptcha ||
      (showCaptcha &&
        captchaCode != null &&
        captchaCode.trim().length !== 0 &&
        captchaToken != null)) &&
    (!showTfaPage ||
      (showTfaPage && tfaToken != null && tfaToken.trim().length !== 0));

  const [refreshEmitter] = useState(new EventEmitter());

  const captchaComponent = (
    <CaptchaInput
      style={styles.field}
      onCaptcha={({ text, captchaToken }: OnCaptchaChangeEvent) => {
        setCaptchaCode(text);
        setCaptchaToken(captchaToken);
      }}
      disabled={isLoading}
      onRefresh={() => {
        setCaptchaCode(null);
        setCaptchaToken(null);
      }}
      text={captchaCode}
      height={FieldHeight}
      refreshEmitter={refreshEmitter}
      url="/api/captcha_token"
    />
  );

  const subtitle = useMemo(() => {
    if (showWechatQr) {
      return;
    }
    return phoneCall
      ? i`A call is being made to ${obfuscatedPhoneNumber}`
      : i`A text message with a verification code was just sent to ${obfuscatedPhoneNumber}`;
  }, [showWechatQr, phoneCall, obfuscatedPhoneNumber]);

  return showTfaPage ? (
    <LoginCard
      className={className}
      style={style}
      title={showWechatQr ? i`Scan the QR code` : i`Enter a verification code`}
      subtitle={subtitle}
    >
      {showWechatQr ? (
        <>
          <Markdown
            style={styles.qrPrompt}
            text={i`Scan with your WeChat account or [enter a code instead]()`}
            onLinkClicked={() => setShowWechatQr(false)}
          />
          <WechatQrInput
            onVerified={(qrTicket: string) => void handleQrVerified(qrTicket)}
          />
        </>
      ) : (
        <>
          <Field
            style={styles.field}
            title={
              canUseWechatQr
                ? () => (
                    <Markdown
                      text={i`Enter code or [scan a QR code instead]()`}
                      onLinkClicked={() => setShowWechatQr(true)}
                    />
                  )
                : ci18n(
                    "Let the user enter the verification code",
                    "Enter code",
                  )
            }
          >
            <TextInput
              onChange={({ text }: OnTextChangeEvent) => setTfaToken(text)}
              disabled={isLoading}
              height={FieldHeight}
              debugValue="000000"
              value={tfaToken ? tfaToken : ""}
            />
          </Field>
          {showCaptcha && captchaComponent}
          <Markdown
            style={styles.resendCodePrompt}
            text={
              i`Haven't received the code? ` +
              (countDownLeft === 0
                ? i`[Resend code](${"#sms"})` +
                  (allowPhoneCall
                    ? i` or receive a [phone call](${"#call"})`
                    : "")
                : i18n(
                    "Try again in {%1=Time count down left}s",
                    countDownLeft / 1000,
                  ))
            }
            onLinkClicked={(event) => void handleResendCode(event)}
          />
          <PrimaryButton
            onClick={async () => await handleLogin()}
            isDisabled={!canSubmit}
            isLoading={isLoading}
          >
            {ci18n("A button to submit input field", "Done")}
          </PrimaryButton>
        </>
      )}
      {showBackupCode ? (
        <Layout.FlexColumn style={styles.backupCodesPrompt}>
          <Markdown
            style={styles.backupCodesParagraph}
            text={
              i`**Use Backup Codes**` +
              `\n\n` +
              i`Please use one of your Backup Codes to login if you are still ` +
              i`unable to receive the code.`
            }
          />
          {showEmployeePrompt && (
            <>
              <Markdown
                style={styles.backupCodesParagraph}
                text={
                  i`**Don't have access to your Backup Codes?**` +
                  `\n\n` +
                  i`Contact [helpdesk@wish.com](${"mailto:helpdesk@wish.com"}) with ` +
                  i`your account email to verify your identity and receive your ` +
                  i`code.`
                }
              />
              <Markdown
                style={styles.backupCodesParagraph}
                text={i`Please provide the following information:`}
              />
              <Ul>
                <Ul.Li>Verification code: {verificationCode}</Ul.Li>
              </Ul>
            </>
          )}
          {showMerchantPrompt && (
            <>
              <Markdown
                style={styles.backupCodesParagraph}
                text={
                  i`**Don't have access to your Backup Codes?**` +
                  `\n\n` +
                  i`If you do not have access to your Backup Codes, you can receive ` +
                  i`a one-time login code from your Account Manager. `
                }
              />
              <Markdown
                style={styles.backupCodesParagraph}
                text={
                  i`Contact your Account Manager at ` +
                  i`[${merchantBdEmail}](mailto:${merchantBdEmail}) with your account ` +
                  i`email to verify your identity and receive your code.`
                }
              />
              <Markdown
                style={styles.backupCodesParagraph}
                text={i`Please provide the following information:`}
              />
              <Ul>
                <Ul.Li>Verification Code: {verificationCode}</Ul.Li>
                <Ul.Li>{ci18n("photo id", "Photo ID")}</Ul.Li>
                <Ul.Li>
                  {ci18n("address for business", "Business address")}
                </Ul.Li>
                <Ul.Li>
                  External store URL (e.g. AliExpress store URL, Amazon store
                  URL)
                </Ul.Li>
              </Ul>
            </>
          )}
        </Layout.FlexColumn>
      ) : (
        (showEmployeePrompt || showMerchantPrompt) && (
          <Link
            style={[styles.backupCodesPrompt, styles.backupCodesParagraph]}
            onClick={() => setShowBackupCode(true)}
          >
            Unable to receive your code?
          </Link>
        )
      )}
    </LoginCard>
  ) : (
    <LoginCard
      className={className}
      style={style}
      title={ci18n("Login form's header", "Login")}
    >
      <Field style={styles.field} title={i`Email address or username`}>
        <TextInput
          style={styles.field}
          placeholder={i`Email address or username`}
          onChange={({ text }: OnTextChangeEvent) => setUsername(text)}
          disabled={isLoading}
          height={FieldHeight}
          debugValue={faker.internet.email()}
          value={username}
        />
      </Field>
      <PasswordField
        type="CURRENT"
        style={[styles.field, styles.passwordField]}
        placeholder={ci18n("login account password", "Password")}
        password={password}
        disabled={isLoading}
        onPasswordChange={(text: string) => setPassword(text)}
        height={FieldHeight}
        debugValue={faker.internet.password()}
      />
      <Layout.FlexRow
        style={styles.promptContainer}
        justifyContent="space-between"
      >
        <CheckboxField
          style={styles.rememberMe}
          title={ci18n("A checkbox to set remember", "Remember me")}
          onChange={() => {
            setRememberMe(!rememberMe);
          }}
          checked={rememberMe}
          fontSize={14}
        />
        <Link
          href={merchFeUrl("/forget_password")}
          style={styles.forgetPassword}
        >
          {ci18n("Forgot login account password", "Forgot password?")}
        </Link>
      </Layout.FlexRow>
      {showCaptcha && captchaComponent}
      <PrimaryButton
        onClick={async () => await handleLogin()}
        isDisabled={!canSubmit}
        isLoading={isLoading}
      >
        {ci18n("login account button", "Login")}
      </PrimaryButton>
    </LoginCard>
  );
};

export default observer(LoginForm);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        field: {
          marginBottom: 25,
          ":last-child": {
            marginBottom: 10,
          },
        },
        passwordField: {
          marginBottom: 15,
        },
        qrPrompt: {
          fontSize: 15,
          maxWidth: 280,
        },
        backupCodesPrompt: {
          fontSize: 14,
          maxWidth: 280,
          alignSelf: "center",
        },
        backupCodesParagraph: {
          marginTop: 16,
        },
        resendCodePrompt: {
          marginTop: 10,
          marginBottom: 16,
          fontSize: 14,
          maxWidth: 280,
          alignSelf: "center",
        },
        promptContainer: {
          marginBottom: 25,
        },
        loginHere: {
          marginLeft: 5,
        },
        rememberMe: {
          marginRight: 25,
        },
        forgetPassword: {
          fontSize: 14,
        },
      }),
    [],
  );
};
