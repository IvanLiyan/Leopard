import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import faker from "faker/locale/en";

/* Lego Components */
import {
  Layout,
  H4,
  Text,
  Field,
  EmailInput,
  TextInput,
  Button,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { RequiredValidator } from "@toolkit/validators";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

/* Assets */
import signupBackgroundURL from "@assets/img/merchant-summit/landing/web/summit-sign-up-background.png";

type SignupProps = BaseProps & {
  readonly storeName?: string;
  readonly setStoreName: (storeName: string) => void;
  readonly email?: string;
  readonly setEmail: (email: string) => void;
  readonly setSubmitted: (submitted: boolean) => void;
};

const Signup = (props: SignupProps) => {
  const { storeName, setStoreName, email, setEmail, setSubmitted } = props;

  const styles = useStylesheet();
  const { isSmallScreen } = useDeviceStore();

  const [storeNameValid, setStoreNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);

  const submitDisabled = !emailValid || !storeNameValid;

  return (
    <Layout.FlexColumn
      style={isSmallScreen ? styles.rootMobile : styles.root}
      justifyContent="center"
      alignItems="center"
    >
      <Layout.FlexRow
        style={[
          styles.line,
          isSmallScreen ? styles.titleMobile : styles.titleWeb,
        ]}
        justifyContent="center"
        alignItems="center"
      >
        <Text style={[styles.textWhite]} weight="semibold">
          Ready to grow your business?
        </Text>
        <Text style={[styles.textWhite, styles.paddingLeft]} weight="semibold">
          Get started on
        </Text>
        <Text
          style={[styles.textWishBlue, styles.paddingLeft]}
          weight="semibold"
        >
          Wish
        </Text>
        <Text style={[styles.textWhite, styles.paddingLeft]} weight="semibold">
          today!
        </Text>
      </Layout.FlexRow>

      <H4
        style={[
          isSmallScreen ? styles.subtitleMobile : styles.subtitleWeb,
          styles.textWhite,
        ]}
      >
        Signup is fast, free and easy. New merchants generally see their first
        sale within days.
      </H4>
      <Layout.FlexColumn
        style={isSmallScreen ? styles.formMobile : styles.form}
        alignItems="center"
      >
        <Field
          style={isSmallScreen ? styles.fieldMobile : styles.field}
          title={() => <Text style={styles.textWhite}>Store Name</Text>}
        >
          <TextInput
            type="text"
            validators={[new RequiredValidator()]}
            debugValue={faker.company.companyName()}
            onValidityChanged={(isValid) => setStoreNameValid(isValid)}
            value={storeName}
            onChange={({ text }) => setStoreName(text)}
          />
        </Field>
        <Field
          style={isSmallScreen ? styles.fieldMobile : styles.field}
          title={() => <Text style={styles.textWhite}>Email Address</Text>}
        >
          <EmailInput
            debugValue={faker.internet.email()}
            onValidityChanged={(isValid) => setEmailValid(isValid)}
            required
            value={email}
            onChange={({ text }) => setEmail(text)}
          />
        </Field>
        <Button
          style={submitDisabled ? styles.disabledButton : styles.button}
          disabled={submitDisabled}
          onClick={() => setSubmitted(true)}
        >
          Get Started
        </Button>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default observer(Signup);

const useStylesheet = () => {
  const { textWhite, wishBlue, primary, secondaryDarkest } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          padding: "80px 120px",
          background: `url(${signupBackgroundURL})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "right bottom",
        },
        rootMobile: {
          padding: "80px 16px",
          backgroundColor: secondaryDarkest,
        },
        titleMobile: {
          fontSize: 28,
          textAlign: "center",
        },
        titleWeb: {
          fontSize: 40,
          textAlign: "center",
        },
        line: {
          flexWrap: "wrap",
          marginBottom: 10,
        },
        subtitleMobile: {
          fontSize: 16,
          marginBottom: 22,
          textAlign: "center",
        },
        subtitleWeb: {
          fontSize: 24,
          marginBottom: 60,
          textAlign: "center",
        },
        textWhite: { color: textWhite },
        textWishBlue: { color: wishBlue },
        paddingLeft: { paddingLeft: 8 },
        sectionContainer: {
          width: "100%",
        },
        section: {
          padding: 16,
        },
        formMobile: {
          width: "100%",
        },
        form: {
          width: "100%",
        },
        fieldMobile: {
          marginBottom: 20,
          width: "100%",
          maxWidth: 500,
        },
        field: {
          marginBottom: 30,
          width: "100%",
          maxWidth: 500,
        },
        disabledButton: {
          maxWidth: 250,
          height: 40,
          color: textWhite,
          backgroundColor: primary,
          border: "none",
          opacity: 0.8,
          ":hover": {
            cursor: "not-allowed",
          },
        },
        button: {
          maxWidth: 250,
          height: 40,
          color: textWhite,
          backgroundColor: primary,
          border: "none",
          opacity: 0.9,
          ":hover": {
            color: textWhite,
            backgroundColor: primary,
            opacity: 1,
          },
        },
      }),
    [textWhite, wishBlue, primary, secondaryDarkest]
  );
};
