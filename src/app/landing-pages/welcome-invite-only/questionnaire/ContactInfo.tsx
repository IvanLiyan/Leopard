import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  EmailInput,
  TextInput,
  Layout,
  Text,
  FormSelect,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import MerchantLeadSubmissionState from "./MerchantLeadSubmissionState";
import { useTheme } from "@core/stores/ThemeStore";
import { useMutation } from "@apollo/client";
import {
  ChangeLocalRequestType,
  ChangeLocalResponseType,
  CHANGE_LOCALE_MUTATION,
} from "@chrome/localeMutations";
import { useToastStore } from "@core/stores/ToastStore";
import { CountryCode, Locale } from "@schema";
import { useLocalizationStore } from "@core/stores/LocalizationStore";
import { useNavigationStore } from "@core/stores/NavigationStore";
import FormInputRow from "./FormInputRow";
import {
  getCountryCodes,
  QuestionPrompts,
} from "src/app/landing-pages/welcome-invite-only/toolkit/form-options";
import { ci18n } from "@core/toolkit/i18n";
import PhoneNumberField from "@core/components/PhoneNumberField";
import { EmailValidator } from "@ContextLogic/lego/toolkit/forms/validators";

type Props = BaseProps & {
  readonly submissionState: MerchantLeadSubmissionState;
};

const ContactInfo = (props: Props) => {
  const { className, style, submissionState } = props;
  const styles = useStylesheet();
  const { locale } = useLocalizationStore();
  const navigationStore = useNavigationStore();
  const toastStore = useToastStore();
  const hasCookies = () => {
    // Check if there are any cookies
    return document.cookie && document.cookie !== "";
  };

  const [changeLocale, { loading: isLoading }] = useMutation<
    ChangeLocalResponseType,
    ChangeLocalRequestType
  >(CHANGE_LOCALE_MUTATION);

  const onLocaleChanged = async (locale: Locale): Promise<void> => {
    if (!hasCookies()) return;
    try {
      const response = await changeLocale({ variables: { input: { locale } } });
      if (!response.data?.locale?.changeLocale?.ok) {
        toastStore.error(
          response.data?.locale?.changeLocale?.message ??
            i`Something went wrong`,
        );
        return;
      }
      navigationStore.reload({ fullReload: true }); // full reload required to load app in new language
    } catch (error) {
      toastStore.error(i`Something went wrong`);
      return undefined;
    }
  };

  return (
    <Layout.FlexColumn alignItems="stretch" style={[className, style]}>
      <FormInputRow
        onChange={(e) => (submissionState.companyLegalName = e.text)}
        title={QuestionPrompts.COMPANY_LEGAL_NAME}
        value={submissionState.companyLegalName || ""}
        onBeginEditing={() => (submissionState.isCompanyLegalNameValid = true)}
        placeholder={ci18n(
          "Placeholder in a field where merchants enter their company name",
          "Company Name",
        )}
        validationResponse={
          submissionState.isCompanyLegalNameValid
            ? null
            : i`Please enter your company name`
        }
        style={styles.row}
      />
      <Layout.FlexColumn>
        <Layout.FlexRow style={styles.row} alignItems="stretch">
          <Layout.FlexColumn style={[styles.halfRow, styles.leftInput]}>
            <Text style={styles.question} weight="semibold">
              {QuestionPrompts.FIRST_NAME}
            </Text>
            <TextInput
              style={styles.textInput}
              value={submissionState.firstName}
              onSelect={() => (submissionState.isFirstNameValid = true)}
              onChange={(e) => (submissionState.firstName = e.text)}
              validationResponse={
                submissionState.isFirstNameValid
                  ? null
                  : i`Please enter your first name`
              }
            />
          </Layout.FlexColumn>
          <Layout.FlexColumn style={styles.halfRow}>
            <Text style={styles.question} weight="semibold">
              {QuestionPrompts.LAST_NAME}
            </Text>
            <TextInput
              style={styles.textInput}
              value={submissionState.lastName}
              onChange={(e) => (submissionState.lastName = e.text)}
              onSelect={() => (submissionState.isLastNameValid = true)}
              validationResponse={
                submissionState.isLastNameValid
                  ? null
                  : i`Please enter your last name`
              }
            />
          </Layout.FlexColumn>
        </Layout.FlexRow>

        <Layout.FlexRow alignItems="stretch" style={styles.row}>
          <Layout.FlexColumn style={[styles.halfRow, styles.leftInput]}>
            <Text style={styles.question} weight="semibold">
              {QuestionPrompts.BUSINESS_EMAIL}
            </Text>
            <EmailInput
              style={styles.textInput}
              placeholder={ci18n(
                "Placeholder in a field where merchants enter their business email",
                "Business email",
              )}
              value={submissionState.emailAddress}
              onChange={({ text }) => (submissionState.emailAddress = text)}
              onValidityChanged={(isValid) =>
                (submissionState.isEmailAddressValid = isValid)
              }
              onSelect={() => (submissionState.isEmailAddressValid = true)}
              validators={[new EmailValidator()]}
              validationResponse={
                submissionState.isEmailAddressValid
                  ? null
                  : i`Please enter a valid email`
              }
            />
          </Layout.FlexColumn>
          <Layout.FlexColumn style={styles.halfRow}>
            <Text style={styles.question} weight="semibold">
              {QuestionPrompts.BUSINESS_PHONE}
            </Text>
            <PhoneNumberField
              country={submissionState.mobileCountryCode || "US"}
              phoneNumber={submissionState.phoneNumber}
              onPhoneNumber={({ country, phoneNumber }) => {
                submissionState.phoneNumber = phoneNumber;
                submissionState.mobileCountryCode = country;
              }}
              showTitle={false}
              placeholder={i`123 456 7890`}
            />
          </Layout.FlexColumn>
        </Layout.FlexRow>
      </Layout.FlexColumn>
      <Layout.FlexColumn
        alignItems="stretch"
        justifyContent="flex-start"
        style={styles.row}
      >
        <Text style={styles.question} weight="semibold">
          {QuestionPrompts.COUNTRY}
        </Text>
        <FormSelect
          showArrow
          error={!submissionState.isCountryValid}
          placeholder={ci18n("Placeholder in a select field", "Select")}
          style={styles.textInput}
          options={getCountryCodes()}
          selectedValue={submissionState.country}
          disabled={isLoading}
          onSelected={async (code: string) => {
            if (code === "CN" && locale !== "zh") {
              await onLocaleChanged("zh");
              // full reload required to load app in new language
              await navigationStore.navigate(
                `${navigationStore.currentPath}?renderModal=true`,
                { fullReload: true },
              );
            } else {
              submissionState.country = code as CountryCode;
              submissionState.isCountryValid = true;
            }
          }}
        />
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

const useStylesheet = () => {
  const { textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        row: {
          marginTop: 20,
        },
        question: {
          fontSize: 15,
          color: textDark,
        },
        textInput: {
          marginTop: 5,
        },
        halfRow: {
          flex: 1,
        },
        leftInput: {
          marginRight: 30,
        },
      }),
    [textDark],
  );
};

export default observer(ContactInfo);
