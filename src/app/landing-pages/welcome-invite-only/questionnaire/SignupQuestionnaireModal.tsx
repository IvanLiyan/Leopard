import React, { useMemo, useState, useCallback } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Layout, PrimaryButton } from "@ContextLogic/lego";
import SignupForm from "./SignupForm";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import {
  MERCHANT_LEAD_SUBMIT,
  MerchantLeadSubmissionResponseType,
  MerchantLeadSubmissionInputType,
} from "../toolkit/merchant-submission";
import { ci18n } from "@core/toolkit/i18n";
import Modal from "@core/components/modal/Modal";
import SignupSuccessModalContent from "./SignupSuccessModalContent";
import { useToastStore } from "@core/stores/ToastStore";
import { useMutation } from "@apollo/client";
import MerchantLeadSubmissionState from "./MerchantLeadSubmissionState";

type Props = BaseProps & {
  readonly isOpen: boolean;
  readonly onClose: () => unknown;
};

const SignupQuestionnaireModal: React.FC<Props> = (props: Props) => {
  const { style, className, onClose, isOpen } = props;

  const styles = useStylesheet();
  const toastStore = useToastStore();

  const [showSuccess, setShowSuccess] = useState(false);

  const [submissionState] = useState(() => new MerchantLeadSubmissionState());

  const [merchantLeadSubmit, { loading }] = useMutation<
    MerchantLeadSubmissionResponseType,
    MerchantLeadSubmissionInputType
  >(MERCHANT_LEAD_SUBMIT);

  // form validation
  const onSubmit = useCallback(async () => {
    const {
      companyLegalName,
      country,
      emailAddress,
      firstName,
      lastName,
      phoneNumber,
      websiteUrl,
      skuQuantity,
      howLongSelling,
      annualRevenue,
      productCategory,
      merchantPartner,
      canSave,
      isCNMerchant,
      merchantTypeCNOnly,
      brandRegistrationCountryCNOnly,
      registeredBeforeCNOnly,
    } = submissionState;

    // required fields
    if ((companyLegalName?.trim() || "").length < 1) {
      submissionState.isCompanyLegalNameValid = false;
    }
    if ((emailAddress?.trim() || "").length < 1) {
      submissionState.isEmailAddressValid = false;
    }
    if ((firstName?.trim() || "").length < 1) {
      submissionState.isFirstNameValid = false;
    }
    if ((lastName?.trim() || "").length < 1) {
      submissionState.isLastNameValid = false;
    }
    if ((country?.trim() || "").length < 1) {
      submissionState.isCountryValid = false;
    }
    if (!howLongSelling) {
      submissionState.isHowLongSellingValid = false;
    }
    if (!annualRevenue) {
      submissionState.isAnnualRevenueValid = false;
    }
    if (!skuQuantity) {
      submissionState.isSkuQuantityValid = false;
    }
    if ((productCategory?.trim() || "").length < 1) {
      submissionState.isProductCategoryValid = false;
    }
    if ((websiteUrl?.trim() || "").length < 1) {
      submissionState.isWebsiteUrlValid = false;
    }
    if (isCNMerchant) {
      if (!merchantTypeCNOnly) {
        submissionState.isMerchantTypeCNOnlyValid = false;
      }
      if (merchantTypeCNOnly === `Brand` && !brandRegistrationCountryCNOnly) {
        submissionState.isBrandRegistrationCountryCNOnlyValid = false;
      }
    }

    if (
      !companyLegalName ||
      !canSave ||
      !firstName ||
      !lastName ||
      !emailAddress ||
      !skuQuantity ||
      !howLongSelling ||
      !annualRevenue ||
      !productCategory ||
      !country ||
      !websiteUrl ||
      (isCNMerchant &&
        (!merchantTypeCNOnly ||
          (merchantTypeCNOnly === `Brand` && !brandRegistrationCountryCNOnly)))
    ) {
      toastStore.negative(i`Please fill in all required fields`);
      return;
    }

    const input: MerchantLeadSubmissionInputType["input"] = {
      companyLegalName,
      firstName,
      lastName,
      emailAddress,
      phoneNumber,
      websiteUrl,
      skuQuantity,
      howLongSelling,
      annualRevenue,
      productCategory,
      country,
      merchantPartnerName: merchantPartner,
      ...(isCNMerchant
        ? {
            merchantType: merchantTypeCNOnly,
            brandRegistrationCountry: brandRegistrationCountryCNOnly,
            registeredBefore: registeredBeforeCNOnly,
          }
        : {}),
    };

    const { data } = await merchantLeadSubmit({ variables: { input } });
    if (!loading) {
      const leadSubmission = data?.authentication?.merchantLeadSubmission;
      if (!leadSubmission) {
        return;
      }

      const { ok, message } = leadSubmission;
      if (ok) {
        setShowSuccess(true);
      } else {
        toastStore.negative(
          message || i`Something went wrong. Please try again.`,
        );
      }
    }
    return;
  }, [loading, merchantLeadSubmit, submissionState, toastStore]);

  return (
    <Modal open={isOpen} onClose={onClose} maxWidth="lg">
      {showSuccess ? (
        <SignupSuccessModalContent onClick={onClose} />
      ) : (
        <Layout.FlexColumn alignItems="stretch" style={[style, className]}>
          <Layout.FlexColumn alignItems="center">
            <SignupForm
              submissionState={submissionState}
              isLoading={loading}
              style={styles.formContent}
            />
            {!loading && (
              <Layout.FlexColumn
                style={styles.buttonContainer}
                alignItems="center"
              >
                <PrimaryButton
                  isDisabled={loading || !submissionState.canSave}
                  style={styles.questionnaireButton}
                  onClick={async () => {
                    await onSubmit();
                  }}
                >
                  {ci18n(
                    "Text on button that merchants click to submit the form",
                    "Submit",
                  )}
                </PrimaryButton>
              </Layout.FlexColumn>
            )}
          </Layout.FlexColumn>
        </Layout.FlexColumn>
      )}
    </Modal>
  );
};

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        buttonContainer: {
          marginBottom: 25,
          marginTop: 35,
        },
        questionnaireButton: {
          "@media (max-width: 900px)": {
            marginTop: 15,
            width: 150,
            height: 50,
          },
          "@media (min-width: 900px)": {
            marginTop: 25,
            width: 300,
            height: 50,
          },
        },
        formContent: {
          paddingLeft: 75,
          paddingRight: 75,
        },
      }),
    [],
  );
};

export default observer(SignupQuestionnaireModal);
