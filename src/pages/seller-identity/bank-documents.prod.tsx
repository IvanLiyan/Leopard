import { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { css } from "@core/toolkit/styling";
import { Box, Button, Stack, Text, Container } from "@ContextLogic/atlas-ui";
import {
  Layout,
  Checkbox,
  TextInput,
  LoadingIndicator,
} from "@ContextLogic/lego";
import commonStyles from "@performance-cn/styles/common.module.css";
import { useMutation } from "@apollo/client";
import Image from "@core/components/Image";
import PageHeader from "@core/components/PageHeader";
import PageGuide from "@core/components/PageGuide";
import PageRoot from "@core/components/PageRoot";
import SecureFileInput from "@core/components/SecureFileInput";
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import { useRouter, merchFeUrl } from "@core/toolkit/router";
import { FileInput, Datetime } from "@schema";
import {
  UploadBankDocumentsMutation,
  UploadBankDocumentsRequest,
  UploadBankDocumentsResponse,
} from "@seller-identity/bank-documents/toolkit";
import {
  AcceptMerchantPolicyResponseType,
  ACCEPT_MERCHANT_POLICY_MUTATION,
  MerchantTermsAgreedMutationsAcceptMerchantPolicyArgs,
} from "@seller-identity/bank-documents/agreed";
import {
  RejectReasonMap,
  formatSingleRejectReason,
} from "@seller-identity/bank-documents/state-reason-format";
import {
  GET_MERCHANT_BANK_VERIFICATION_STATE_REASON,
  BankStatusResponseData,
} from "@seller-identity/bank-documents/getinfo";
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { ci18n } from "@core/toolkit/i18n";
import { useQuery } from "@apollo/client";
import {
  MinMaxValueValidator,
  CharacterLength,
} from "@core/toolkit/validators";
import Illustration from "@core/components/Illustration";
import { useDeciderKey } from "@core/stores/ExperimentStore";

const BankDocumentsPage: NextPage<Record<string, never>> = () => {
  const { borderPrimary, surfaceLightest } = useTheme();
  const styles = useStylesheet();
  const [attachment, setAttachment] = useState<FileInput | null>(null);
  const [last4digits, setLast4Digits] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isLast4DigitsValid, setIsLast4DigitsValid] = useState(true);
  const [state, setState] = useState<string | undefined>(undefined);
  const [rejectReasonText, setRejectReasonText] = useState<string | undefined>(
    undefined,
  );
  const [dueDate, setDueDate] = useState<Datetime | undefined | null>(
    undefined,
  );
  const [rejectReason, setRejectReason] = useState<
    keyof RejectReasonMap | null | undefined
  >(null);

  const { decision: showSOXCompliance, isLoading: loadingDeky } = useDeciderKey(
    "sox_compliance_enable",
  );

  const { data, loading } = useQuery<BankStatusResponseData>(
    GET_MERCHANT_BANK_VERIFICATION_STATE_REASON,
  );

  useEffect(() => {
    if (!showSOXCompliance) return;
    setState(data?.currentMerchant.bankAccountVerification.state);
    const dueDate = data?.currentMerchant?.bankAccountVerification?.dueDate;
    setDueDate(dueDate);
    const bankAccountDocumentsArr =
      data?.currentMerchant?.bankAccountVerification?.bankAccountDocuments;
    if (bankAccountDocumentsArr && bankAccountDocumentsArr.length > 0) {
      // For multiple document reviews, only the result of the last one is displayed.
      const BankAccountDocument = bankAccountDocumentsArr.slice(-1)[0];

      const text =
        dueDate == null
          ? ""
          : BankAccountDocument.comment == ""
          ? i`${formatSingleRejectReason(rejectReason)} ` +
            i`To avoid account deactivation, resubmit your bank information by ` +
            i`${dueDate.formatted}.`
          : i`${formatSingleRejectReason(rejectReason)} Comment: ${
              BankAccountDocument.comment
            }. ` +
            i`To avoid account deactivation, resubmit your bank information by ` +
            i`${dueDate.formatted}.`;

      setRejectReasonText(text);
    }

    setRejectReason(data?.currentMerchant.bankAccountVerification.stateReason);
  }, [
    data?.currentMerchant.bankAccountVerification,
    showSOXCompliance,
    rejectReason,
  ]);

  useEffect(() => {
    const isValid =
      last4digits.length === 4 &&
      Number(last4digits) >= 0 &&
      Number(last4digits) <= 9999;
    setIsLast4DigitsValid(isValid);
  }, [last4digits]);

  const toastStore = useToastStore();
  const router = useRouter();
  const sellerProfile = "/settings#seller-profile";
  const homepage = "/home";

  const [upload] = useMutation<
    UploadBankDocumentsResponse,
    UploadBankDocumentsRequest
  >(UploadBankDocumentsMutation);

  const [merchantPolicyConsent] = useMutation<
    AcceptMerchantPolicyResponseType,
    MerchantTermsAgreedMutationsAcceptMerchantPolicyArgs
  >(ACCEPT_MERCHANT_POLICY_MUTATION, {
    variables: {
      input: {
        agreed: true,
        source: "BANK_INFORMATION_VALIDATION_FLOW",
      },
    },
  });

  const onSubmit = async () => {
    if (attachment == null || !confirmed) {
      return;
    }

    const { data } = await merchantPolicyConsent();

    if (!data) {
      toastStore.error(i`Something went wrong. Please try again.`);
      return;
    }

    const resp = await upload({
      variables: {
        input: { bankDocFile: attachment, last4Digits: last4digits },
      },
    });
    const result =
      resp.data?.currentMerchant?.bankAccountVerification?.uploadDocument;
    if (!result) {
      return;
    }
    const { ok, message } = result;

    if (!ok) {
      toastStore.error(message || i`Something went wrong. Please try again.`);
      return;
    }

    toastStore.positive(i`Your document has been uploaded`);
    void router.push(merchFeUrl(sellerProfile));
  };

  return (
    <PageRoot style={styles.root}>
      {loadingDeky || loading ? (
        <LoadingIndicator className={commonStyles.loading} />
      ) : (
        <>
          {showSOXCompliance ? (
            <>
              <PageHeader
                className={css(styles.header)}
                title={ci18n(
                  "title of bank information module",
                  "Bank Information",
                )}
                relaxed
                illustration={() => (
                  <Image
                    src="/md/images/seller-identity/bankInfoBanner.svg"
                    alt={ci18n(
                      "alt text for an image",
                      "Bank information banner",
                    )}
                    width={239}
                    height={160}
                  />
                )}
              >
                <Layout.FlexRow>
                  {dueDate && (
                    <Text className={css(styles.headerText)}>
                      {i`Submit your bank information by ` +
                        i`${dueDate.formatted}` +
                        i` to avoid account deactivation.`}
                    </Text>
                  )}
                </Layout.FlexRow>
              </PageHeader>
              <PageGuide relaxed style={styles.guide}>
                {state === "REJECTED" && (
                  <Box className={css(styles.bannerInfo)}>
                    <Illustration
                      name="bankInfoBannerBadge"
                      className={css(styles.icon)}
                      alt="bank documents info"
                    />
                    <div className={css(styles.bannerText)}>
                      <Text
                        sx={{
                          color: "textBlack",
                          fontWeight: "bold",
                          fontSize: "14px",
                          lineHeight: "18px",
                        }}
                      >
                        Resubmit your bank information
                      </Text>
                      <Text
                        sx={{
                          color: "textBlack",
                          fontSize: "14px",
                          lineHeight: "20px",
                        }}
                      >
                        {rejectReasonText}
                      </Text>
                    </div>
                  </Box>
                )}
                <Box maxWidth={"800px"} sx={{ alignSelf: "center" }}>
                  <Text className={css(styles.uploadTitle)}>
                    {ci18n(
                      "section title of the upload file about bank information",
                      "Acceptable documents",
                    )}
                  </Text>
                  <div style={{ lineHeight: "24px" }}>
                    {ci18n(
                      "tip of upload file",
                      "Upload your bank-issued document, i.e. bank statement, bank account certificate or bank account card.",
                    )}
                  </div>
                  <Box sx={{ mt: 3 }}>
                    <SecureFileInput
                      bucket="BANK_ACCOUNT_DOCUMENTS"
                      accepts=".pdf,.jpeg,.jpg,.png"
                      prompt={i`Upload bank form`}
                      maxSizeMB={5}
                      onAttachmentsChanged={(attachments) => {
                        if (attachments.length == 0) {
                          setAttachment(null);
                          return;
                        }
                        setAttachment({
                          fileName: attachments[0].fileName,
                          url: attachments[0].url,
                        });
                      }}
                      data-cy="bank-document-file-input"
                      maxAttachments={1}
                    />
                    <Text variant="bodyS">
                      {ci18n(
                        "description of the file limit",
                        "Select a PDF, JPEG, or PNG smaller than 5MB.",
                      )}
                    </Text>
                  </Box>
                </Box>
                <Box
                  sx={{
                    mt: 4,
                    pt: 4,
                    pb: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    width: 330,
                  }}
                >
                  <Text className={css(styles.uploadTitle)}>
                    {ci18n(
                      "title of last 4 digits input",
                      "Last 4 digits of bank account",
                    )}
                  </Text>
                  <TextInput
                    style={{ marginTop: "5px" }}
                    value={last4digits}
                    onChange={(value) => setLast4Digits(value.text)}
                    data-cy="input-max-quantity"
                    validators={[
                      new MinMaxValueValidator({
                        minAllowedValue: 0,
                        maxAllowedValue: 9999,
                        customMessage: i`Please enter a 4-digit number`,
                        allowBlank: true,
                      }),
                      new CharacterLength({
                        minimum: 4,
                        maximum: 4,
                        customMessage: i`Please enter a 4-digit number`,
                      }),
                    ]}
                  />
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    display: "flex",
                    width: "700px",
                  }}
                >
                  <Checkbox
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e)}
                  />
                  <Text sx={{ ml: 2 }}>
                    {ci18n(
                      "text content of back information confirm",
                      "I hereby confirm that the bank account documentation provided is indeed under the ownership of the respective merchant account, ",
                    )}
                    {ci18n(
                      "text content of back information confirm",
                      "and I have the full authority to use this account for all financial transactions related to my store.",
                    )}
                  </Text>
                </Box>
                <Box sx={{ mt: 2, pt: 4 }}>
                  <Stack direction={"row"} spacing={1}>
                    <Button
                      disabled={
                        !attachment || !confirmed || !isLast4DigitsValid
                      }
                      primary
                      onClick={() => {
                        void onSubmit();
                      }}
                    >
                      {ci18n("Submit button copy", "Submit")}
                    </Button>
                  </Stack>
                </Box>
              </PageGuide>
            </>
          ) : (
            <PageGuide relaxed>
              <Container
                disableGutters
                maxWidth="lg"
                sx={{
                  mt: 10,
                  border: `solid 1px ${borderPrimary}`,
                  borderRadius: "4px",
                  backgroundColor: surfaceLightest,
                }}
              >
                <Stack>
                  {state === "REJECTED" && (
                    <Box sx={{ mx: 3, mt: 3, mb: 2 }}>
                      <Text sx={{ color: "red", fontWeight: "bold" }}>
                        {ci18n("reject title", "Reject: ")}
                        {formatSingleRejectReason(rejectReason)}
                      </Text>
                    </Box>
                  )}
                  <Box sx={{ mx: 3, mt: 3, mb: 2 }}>
                    <Text variant="bodyLStrong">
                      {ci18n(
                        "title of bank information module",
                        "Bank Information",
                      )}
                    </Text>
                  </Box>
                  <Box maxWidth={"800px"} sx={{ alignSelf: "center" }}>
                    <Text>
                      {ci18n(
                        "description of the upload file about bank information",
                        "Please use your bank account documentation. ",
                      )}
                      {ci18n(
                        "description of the upload file about bank information",
                        "Make sure the document is valid and complete before submitting.",
                      )}
                    </Text>
                    <Box sx={{ mt: 3 }}>
                      <Text>
                        {ci18n(
                          "tip of upload file",
                          "Upload any bank-issued document (i.e.: bank statement, bank account certificate or bank account card.)",
                        )}
                      </Text>
                      <SecureFileInput
                        bucket="BANK_ACCOUNT_DOCUMENTS"
                        accepts=".pdf,.jpeg,.jpg,.png"
                        maxSizeMB={5}
                        onAttachmentsChanged={(attachments) => {
                          if (attachments.length == 0) {
                            setAttachment(null);
                            return;
                          }
                          setAttachment({
                            fileName: attachments[0].fileName,
                            url: attachments[0].url,
                          });
                        }}
                        data-cy="bank-document-file-input"
                        maxAttachments={1}
                      />
                      <Text variant="bodyS">
                        {ci18n(
                          "description of the file limit",
                          "Select a .pdf,.jpeg,.jpg,.png smaller than 5MB.",
                        )}
                      </Text>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderTop: `solid 1px ${borderPrimary}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text>
                      {ci18n(
                        "title of last 4 digits input",
                        "Last 4 digits of bank account:",
                      )}
                    </Text>
                    <TextInput
                      style={{ marginLeft: 20 }}
                      value={last4digits}
                      onChange={(value) => setLast4Digits(value.text)}
                      data-cy="input-max-quantity"
                      validators={[
                        new MinMaxValueValidator({
                          minAllowedValue: 0,
                          maxAllowedValue: 9999,
                          customMessage: i`Please enter a 4-digit number`,
                          allowBlank: true,
                        }),
                        new CharacterLength({
                          minimum: 4,
                          maximum: 4,
                          customMessage: i`Please enter a 4-digit number`,
                        }),
                      ]}
                    />
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderTop: `solid 1px ${borderPrimary}`,
                      display: "flex",
                    }}
                  >
                    <Checkbox
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e)}
                    />
                    <Text sx={{ ml: 2 }}>
                      {ci18n(
                        "text content of back information confirm",
                        "I hereby confirm that the bank account documentation provided is indeed under the ownership of the respective merchant account, ",
                      )}
                      {ci18n(
                        "text content of back information confirm",
                        "and I have the full authority to use this account for all financial transactions related to my store.",
                      )}
                    </Text>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderTop: `solid 1px ${borderPrimary}`,
                    }}
                  >
                    <Stack direction={"row-reverse"} spacing={1}>
                      <Button
                        disabled={
                          !attachment || !confirmed || !isLast4DigitsValid
                        }
                        primary
                        onClick={() => {
                          void onSubmit();
                        }}
                      >
                        {ci18n("Submit button copy", "Submit")}
                      </Button>
                      <Button secondary href={homepage}>
                        {ci18n("Back button copy", "Back")}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Container>
            </PageGuide>
          )}
        </>
      )}
    </PageRoot>
  );
};

export default observer(BankDocumentsPage);

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          background: "#fff",
        },
        header: {
          display: "flex",
          alignItems: "center",
          fontSize: "34px",
          lineHeight: "40px",
          fontWeight: 700,
        },
        headerText: { fontSize: "16px", fontWeight: 400, lineHeight: "24px" },
        bannerInfo: {
          borderRadius: "8px",
          background: "#FFC72C",
          padding: "12px",
          display: "flex",
          marginTop: "40px",
          marginBottom: "40px",
        },
        bannerText: {
          display: "flex",
          flexDirection: "column",
        },
        icon: {
          width: 24,
          height: 24,
          margin: 10,
        },
        guide: {},
        uploadTitle: {
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: "24px",
          display: "flex",
        },
        uploadText: {
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "24px",
          marginBottom: "40px",
        },
      }),
    [],
  );
};
