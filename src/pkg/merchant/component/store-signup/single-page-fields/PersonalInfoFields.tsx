import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import faker from "faker/locale/en";
import { EmailInput, Field, TextInput } from "@ContextLogic/lego";
import { PasswordField } from "@merchant/component/core";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { RequiredValidator } from "@toolkit/validators";

/* Toolkit */
import StoreSignupSinglePageState from "@merchant/model/StoreSignupSinglePageState";

/* Merchant Stores */
import { useDeviceStore } from "@stores/DeviceStore";
import { useTheme } from "@stores/ThemeStore";

type PersonalInfoFieldsProps = {
  readonly signupState: StoreSignupSinglePageState;
};

const PersonalInfoFields = (props: PersonalInfoFieldsProps) => {
  const { signupState } = props;
  const styles = useStylesheet();

  const { emailAddress, password, firstName, lastName, forceValidation } =
    signupState;
  const { isSmallScreen } = useDeviceStore();
  const { borderPrimaryDark } = useTheme();

  return (
    <>
      <Field className={css(styles.wideField)} title={i`Email Address`}>
        <EmailInput
          value={emailAddress}
          onChange={({ text }) => (signupState.emailAddress = text)}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid) =>
            (signupState.isEmailAddressValid = isValid)
          }
          debugValue={faker.internet.email()}
          borderColor={borderPrimaryDark}
          forceValidation={forceValidation}
        />
      </Field>
      <PasswordField
        type="NEW"
        className={css(styles.wideField)}
        placeholder={i`Create a password`}
        password={password}
        onPasswordChange={(text: string) => (signupState.password = text)}
        onValidityChanged={(isValid) => (signupState.isPasswordValid = isValid)}
        debugValue="password"
        borderColor={borderPrimaryDark}
        forceValidation={forceValidation}
      />
      <Field
        className={css(isSmallScreen ? styles.wideField : styles.leftField)}
        title={i`First Name`}
      >
        <TextInput
          value={firstName}
          onChange={({ text }) => (signupState.firstName = text)}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid) =>
            (signupState.isFirstNameValid = isValid)
          }
          debugValue={faker.name.firstName()}
          borderColor={borderPrimaryDark}
          forceValidation={forceValidation}
        />
      </Field>
      <Field
        className={css(isSmallScreen ? styles.wideField : styles.rightField)}
        title={i`Last Name`}
      >
        <TextInput
          value={lastName}
          onChange={({ text }) => (signupState.lastName = text)}
          validators={[new RequiredValidator()]}
          onValidityChanged={(isValid) =>
            (signupState.isLastNameValid = isValid)
          }
          debugValue={faker.name.lastName()}
          borderColor={borderPrimaryDark}
          forceValidation={forceValidation}
        />
      </Field>
    </>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        wideField: {
          display: "flex",
          flexDirection: "column",
          gridColumn: "1 / 3",
        },
        leftField: {
          display: "flex",
          flexDirection: "column",
          column: 1,
        },
        rightField: {
          display: "flex",
          flexDirection: "column",
          column: 2,
        },
      }),
    [],
  );
};

export default observer(PersonalInfoFields);
