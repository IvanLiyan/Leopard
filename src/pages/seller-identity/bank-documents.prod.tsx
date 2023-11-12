import { Box, Button, Container, Stack, Text } from "@ContextLogic/atlas-ui";
import { Checkbox, TextInput } from "@ContextLogic/lego";
import { useMutation } from "@apollo/client";
import PageGuide from "@core/components/PageGuide";
import PageRoot from "@core/components/PageRoot";
import SecureFileInput from "@core/components/SecureFileInput";
import { useTheme } from "@core/stores/ThemeStore";
import { useToastStore } from "@core/stores/ToastStore";
import { useRouter } from "@core/toolkit/router";
import { FileInput } from "@schema";
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
import { useRequest } from "@core/toolkit/restApi";
import { GET_TODOS_ENDPOINT, GetTodoItemsResponse } from "@home/toolkit/todos";
import { useQuery } from "@apollo/client";
import {
  MinMaxValueValidator,
  CharacterLength,
} from "@core/toolkit/validators";

const BankDocumentsPage: NextPage<Record<string, never>> = () => {
  const { borderPrimary, surfaceLightest } = useTheme();
  const [attachment, setAttachment] = useState<FileInput | null>(null);
  const [last4digits, setLast4Digits] = useState<string>("");
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isLast4DigitsValid, setIsLast4DigitsValid] = useState(true);
  const [rejectReason, setRejectReason] = useState<
    keyof RejectReasonMap | null | undefined
  >(null);
  const { data } = useQuery<BankStatusResponseData>(
    GET_MERCHANT_BANK_VERIFICATION_STATE_REASON,
  );

  useEffect(() => {
    setRejectReason(data?.currentMerchant.bankAccountVerification.stateReason);
  }, [data?.currentMerchant.bankAccountVerification.stateReason]);

  useEffect(() => {
    const isValid =
      last4digits.length === 4 &&
      Number(last4digits) >= 0 &&
      Number(last4digits) <= 9999;
    setIsLast4DigitsValid(isValid);
  }, [last4digits]);

  const { data: todoItemsData } = useRequest<GetTodoItemsResponse>({
    url: GET_TODOS_ENDPOINT,
  });

  const toastStore = useToastStore();

  const router = useRouter();
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
    void router.push(homepage);
  };

  return (
    <PageRoot>
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
            {todoItemsData &&
              todoItemsData.results.map((item) => {
                if (item.todo_type === "BANK_ACCOUNT_VERIFICATION") {
                  return (
                    <Box sx={{ mx: 3, mt: 3, mb: 2 }}>
                      <Text sx={{ color: "red", fontWeight: "bold" }}>
                        {ci18n("reject title", "Reject: ")}
                        {formatSingleRejectReason(rejectReason)}
                      </Text>
                    </Box>
                  );
                }
              })}
            <Box sx={{ mx: 3, mt: 3, mb: 2 }}>
              <Text variant="bodyLStrong">
                {ci18n("title of bank information module", "Bank Information")}
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
              <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e)} />
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
            <Box sx={{ mt: 2, p: 2, borderTop: `solid 1px ${borderPrimary}` }}>
              <Stack direction={"row-reverse"} spacing={1}>
                <Button
                  disabled={!attachment || !confirmed || !isLast4DigitsValid}
                  primary
                  onClick={() => {
                    void onSubmit();
                  }}
                >
                  Submit
                </Button>
                <Button secondary href={homepage}>
                  Back
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </PageGuide>
    </PageRoot>
  );
};

export default observer(BankDocumentsPage);
