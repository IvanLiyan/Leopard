/*
 * QuestionnaireModal.tsx
 *
 * Created by Jonah Dlin on Wed Aug 24 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import {
  Divider,
  Field,
  FormSelect,
  Layout,
  PrimaryButton,
  Text,
  TextInput,
} from "@ContextLogic/lego";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useToastStore } from "@core/stores/ToastStore";
import { ci18n } from "@core/toolkit/i18n";
import { useTheme } from "@core/stores/ThemeStore";
import {
  EmailValidator,
  RequiredValidator,
} from "@ContextLogic/lego/toolkit/forms/validators";
import PhoneNumberField from "@core/components/PhoneNumberField";
import { CountryCode, MerchantLeadProductCategory } from "@schema";
import { useMutation } from "@apollo/client";
import {
  MmsCompanyRevenue,
  MmsCompanyRevenueDisplay,
  MmsCompanyRevenues,
  MmsCompanyProductCategoriesOrder,
  MmsCompanyProductCategoriesDisplay,
  SUBMIT_MMS_MERCHANT_LEAD_MUTATION,
  SubmitMmsMerchantLeadRequestType,
  SubmitMmsMerchantLeadResponseType,
  MmsCompanyRevenueRanges,
} from "@welcome-mms/toolkit/mms-welcome";
import Modal from "@core/components/Modal";
import SuccessModalContent from "./SuccessModalContent";

type Props = BaseProps & {
  readonly isOpen: boolean;
  readonly onClose: () => unknown;
};

const QuestionnaireModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const styles = useStylesheet();
  const { borderPrimary } = useTheme();
  const toastStore = useToastStore();

  const [showSuccess, setShowSuccess] = useState(false);

  const [forceValidation, setForceValidation] = useState(false);

  const [companyLegalName, setCompanyLegalName] = useState<
    string | undefined
  >();
  const [companyLegalNameValid, setCompanyLegalNameValid] = useState(false);

  const [firstName, setFirstName] = useState<string | undefined>();
  const [firstNameValid, setFirstNameValid] = useState(false);

  const [lastName, setLastName] = useState<string | undefined>();
  const [lastNameValid, setLastNameValid] = useState(false);

  const [phoneCountry, setPhoneCountry] = useState<CountryCode>("CN");
  const [phoneAreaCode, setPhoneAreaCode] = useState<string | undefined>();
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>();
  const [phoneNumberValid, setPhoneNumberValid] = useState(false);

  const [email, setEmail] = useState<string | undefined>();
  const [emailValid, setEmailValid] = useState(false);

  const [mainProducts, setMainProducts] = useState<
    MerchantLeadProductCategory | undefined
  >();
  const [hasEditedMainProducts, setHasEditedMainProducts] = useState(false);
  const [mainProductsValid, setMainProductsValid] = useState(false);
  const showMainProductsError = forceValidation || hasEditedMainProducts;

  const [annualRevenue, setAnnualRevenue] = useState<
    MmsCompanyRevenue | undefined
  >();
  const [hasEditedAnnualRevenue, setHasEditedAnnualRevenue] = useState(false);
  const [annualRevenueValid, setAnnualRevenueValid] = useState(false);
  const showAnnualRevenueError = forceValidation || hasEditedAnnualRevenue;

  const [url, setUrl] = useState<string | undefined>();
  const [urlValid, setUrlValid] = useState(false);

  const isValid = useMemo(() => {
    return (
      companyLegalNameValid &&
      firstNameValid &&
      lastNameValid &&
      urlValid &&
      phoneNumberValid &&
      emailValid &&
      mainProductsValid &&
      annualRevenueValid
    );
  }, [
    companyLegalNameValid,
    firstNameValid,
    lastNameValid,
    urlValid,
    phoneNumberValid,
    emailValid,
    mainProductsValid,
    annualRevenueValid,
  ]);

  const [submit, { loading: isLoading }] = useMutation<
    SubmitMmsMerchantLeadResponseType,
    SubmitMmsMerchantLeadRequestType
  >(SUBMIT_MMS_MERCHANT_LEAD_MUTATION);

  const onSubmit = useCallback(async () => {
    if (!isValid) {
      setForceValidation(true);
      return;
    }

    if (
      companyLegalName == null ||
      firstName == null ||
      lastName == null ||
      phoneNumber == null ||
      email == null ||
      mainProducts == null ||
      annualRevenue == null ||
      url == null
    ) {
      toastStore.negative(i`Please fill in all required fields`);
      return;
    }

    const { data } = await submit({
      variables: {
        input: {
          companyLegalName,
          firstName,
          lastName,
          phoneNumber:
            phoneAreaCode == null
              ? phoneNumber
              : `+${phoneAreaCode} ${phoneNumber}`,
          emailAddress: email,
          productCategory: mainProducts,
          annualRevenue: MmsCompanyRevenueRanges[annualRevenue],
          websiteUrl: url,
        },
      },
    });

    const ok = data?.authentication?.mmsLeadSubmission?.ok ?? false;
    const message = data?.authentication?.mmsLeadSubmission?.message;

    if (!ok) {
      toastStore.negative(message ?? i`Something went wrong`);
      return;
    }

    setShowSuccess(true);
  }, [
    isValid,
    companyLegalName,
    firstName,
    lastName,
    phoneNumber,
    phoneAreaCode,
    email,
    mainProducts,
    annualRevenue,
    url,
    toastStore,
    submit,
  ]);

  if (showSuccess) {
    return (
      <SuccessModalContent
        onClose={() => onClose()}
        name={ci18n(
          "first name and last name together",
          "{%1=first name} {%2=last name}",
          firstName,
          lastName,
        )}
      />
    );
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Layout.FlexColumn alignItems="stretch">
        <Layout.FlexColumn style={styles.content} alignItems="stretch">
          <Text style={styles.disclaimer} weight="semibold">
            Please complete the questionnaire below. Our Business Development
            team will contact you with more information about next steps.{" "}
          </Text>
          <Divider />
          <Layout.FlexColumn style={styles.form} alignItems="stretch">
            <Field
              title={ci18n(
                "Title of field collecting info from merchant",
                "Company Name",
              )}
            >
              <TextInput
                placeholder={ci18n(
                  "Placeholer of field collecting info from merchant",
                  "Company name",
                )}
                value={companyLegalName}
                onChange={({ text }) => setCompanyLegalName(text)}
                validators={[new RequiredValidator()]}
                onValidityChanged={(isValid) =>
                  setCompanyLegalNameValid(isValid)
                }
                forceValidation={forceValidation}
                disabled={isLoading}
              />
            </Field>
            <Field
              title={ci18n(
                "Title of field collecting info from merchant",
                "First Name",
              )}
            >
              <TextInput
                placeholder={ci18n(
                  "Placeholer of field collecting info from merchant",
                  "First name",
                )}
                value={firstName}
                onChange={({ text }) => setFirstName(text)}
                validators={[new RequiredValidator()]}
                onValidityChanged={(isValid) => setFirstNameValid(isValid)}
                forceValidation={forceValidation}
                disabled={isLoading}
              />
            </Field>
            <Field
              title={ci18n(
                "Title of field collecting info from merchant",
                "Last Name",
              )}
            >
              <TextInput
                placeholder={ci18n(
                  "Placeholer of field collecting info from merchant",
                  "Last name",
                )}
                value={lastName}
                onChange={({ text }) => setLastName(text)}
                validators={[new RequiredValidator()]}
                onValidityChanged={(isValid) => setLastNameValid(isValid)}
                forceValidation={forceValidation}
                disabled={isLoading}
              />
            </Field>
            <PhoneNumberField
              country={phoneCountry}
              phoneNumber={phoneNumber}
              onPhoneNumber={({ country, phoneNumber, areaCode }) => {
                setPhoneCountry(country);
                setPhoneNumber(phoneNumber);
                setPhoneAreaCode(areaCode);
              }}
              placeholder={ci18n(
                "Placeholer of field collecting info from merchant",
                "Phone number",
              )}
              onValidityChanged={(isValid) => setPhoneNumberValid(isValid)}
              forceValidation={forceValidation}
              borderColor={borderPrimary}
              disabled={isLoading}
            />
            <Field
              title={ci18n(
                "Title of field collecting info from merchant",
                "Email",
              )}
            >
              <TextInput
                placeholder={ci18n(
                  "Placeholder of field collecting email from merchant, meant to be an example email address",
                  "example@mail.com",
                )}
                value={email}
                onChange={({ text }) => setEmail(text)}
                validators={[new RequiredValidator(), new EmailValidator()]}
                onValidityChanged={(isValid) => setEmailValid(isValid)}
                forceValidation={forceValidation}
                disabled={isLoading}
              />
            </Field>
            <Field
              title={ci18n(
                "Title of field collecting info from merchant, they enter in a text field what their main products are",
                "Main Products",
              )}
            >
              <FormSelect
                showArrow
                error={!mainProducts && showMainProductsError}
                placeholder={ci18n("Placeholder on a select box", "Select")}
                options={MmsCompanyProductCategoriesOrder.map((category) => ({
                  value: category,
                  text: MmsCompanyProductCategoriesDisplay[category],
                }))}
                selectedValue={mainProducts}
                onSelected={(
                  category: MerchantLeadProductCategory | undefined,
                ) => {
                  if (!hasEditedMainProducts) {
                    setHasEditedMainProducts(true);
                  }
                  setMainProducts(category);
                  setMainProductsValid(category != null);
                }}
                disabled={isLoading}
              />
            </Field>
            <Field title={i`Company Annual Revenue`}>
              <FormSelect
                showArrow
                error={!annualRevenueValid && showAnnualRevenueError}
                placeholder={ci18n("Placeholder on a select box", "Select")}
                options={MmsCompanyRevenues.map((rev) => ({
                  value: rev,
                  text: MmsCompanyRevenueDisplay[rev],
                }))}
                selectedValue={annualRevenue}
                onSelected={(rev: MmsCompanyRevenue | undefined) => {
                  if (!hasEditedAnnualRevenue) {
                    setHasEditedAnnualRevenue(true);
                  }
                  setAnnualRevenue(rev);
                  setAnnualRevenueValid(rev != null);
                }}
                disabled={isLoading}
              />
            </Field>
            <Field title={i`Website or Product Link to Other Platforms`}>
              <TextInput
                placeholder={i`URL or product link`}
                value={url}
                onChange={({ text }) => setUrl(text)}
                validators={[new RequiredValidator()]}
                onValidityChanged={(isValid) => setUrlValid(isValid)}
                forceValidation={forceValidation}
                disabled={isLoading}
              />
            </Field>
          </Layout.FlexColumn>
        </Layout.FlexColumn>
        <Layout.FlexColumn style={styles.footer} alignItems="flex-end">
          <PrimaryButton
            onClick={async () => {
              await onSubmit();
            }}
            isLoading={isLoading}
          >
            {ci18n(
              "Text on button that merchants click to submit the form",
              "Submit",
            )}
          </PrimaryButton>
        </Layout.FlexColumn>
      </Layout.FlexColumn>
    </Modal>
  );
};

const useStylesheet = () => {
  const { borderPrimary, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          padding: "24px 24px 40px",
          gap: 16,
        },
        disclaimer: {
          fontSize: 10,
          lineHeight: "12px",
          color: textDark,
        },
        mainProductsInput: {
          minHeight: 80,
        },
        form: {
          gap: 12,
        },
        footer: {
          padding: 24,
          borderTop: `1px solid ${borderPrimary}`,
        },
      }),
    [borderPrimary, textDark],
  );
};

export default observer(QuestionnaireModal);
