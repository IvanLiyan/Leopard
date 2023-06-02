import { Box, Button, Container, Stack, Text } from "@ContextLogic/atlas-ui";
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
import { observer } from "mobx-react";
import { NextPage } from "next";
import { useState } from "react";

const BankDocumentsPage: NextPage<Record<string, never>> = () => {
  const { borderPrimary, surfaceLightest } = useTheme();
  const [attachment, setAttachment] = useState<FileInput | null>(null);

  const toastStore = useToastStore();

  const router = useRouter();
  const homepage = "/home";

  const [upload] = useMutation<
    UploadBankDocumentsResponse,
    UploadBankDocumentsRequest
  >(UploadBankDocumentsMutation);

  const onSubmit = async () => {
    if (attachment == null) {
      return;
    }

    const resp = await upload({
      variables: { input: { bankDocFile: attachment } },
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
            <Box sx={{ mx: 3, mt: 3, mb: 2 }}>
              <Text variant="bodyLStrong">Bank Information</Text>
            </Box>
            <Box maxWidth={"800px"} sx={{ alignSelf: "center" }}>
              <Text>
                Please use your most recent bank statement or bank account
                certificate. The name on your statement should be the legal name
                used to sign up for your Wish Merchant account. Make sure the
                document is complete before submitting.
              </Text>
              <Box sx={{ mt: 3 }}>
                <Text>
                  Upload any bank-issued document (i.e.: bank statement)
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
                  Select a {".pdf,.jpeg,.jpg,.png"} smaller than {5}MB.
                </Text>
              </Box>
            </Box>
            <Box sx={{ mt: 2, p: 2, borderTop: `solid 1px ${borderPrimary}` }}>
              <Stack direction={"row-reverse"} spacing={1}>
                <Button
                  disabled={!attachment}
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
