import React, { useContext, useState } from "react";
import { observer } from "mobx-react";
import Modal from "@core/components/modal/Modal";
import SecureFileInput, { Attachment } from "@core/components/SecureFileInput";
import { Text } from "@ContextLogic/atlas-ui";
import { ModalProps } from "@core/components/modal/Modal";
import ModalTitle from "@core/components/modal/ModalTitle";
import ModalFooter from "@core/components/modal/ModalFooter";
import { ci18n } from "@core/toolkit/i18n";
import { useMutation } from "@apollo/client";
import {
  RequestPaymentReleaseMutationResponse,
  RequestPaymentReleaseMutationVariables,
  REQUEST_PAYMENT_RELEASE_MUTATION,
} from "@infractions/api/requestPaymentReleaseMutation";
import { InfractionContext } from "@infractions/InfractionContext";
import { useToastStore } from "@core/stores/ToastStore";

type RequestPaymentModalContentProps = Pick<ModalProps, "open" | "onClose">;

const RequestPaymentModal: React.FC<RequestPaymentModalContentProps> = ({
  open,
  onClose,
}: RequestPaymentModalContentProps) => {
  const toastStore = useToastStore();
  const {
    infraction: { id: infractionId },
  } = useContext(InfractionContext);
  const [photoIds, setPhotoIds] = useState<ReadonlyArray<Attachment>>([]);
  const [agreements, setAgreements] = useState<ReadonlyArray<Attachment>>([]);

  const [requestPaymentRelease, { loading }] = useMutation<
    RequestPaymentReleaseMutationResponse,
    RequestPaymentReleaseMutationVariables
  >(REQUEST_PAYMENT_RELEASE_MUTATION);

  const onSend = async () => {
    try {
      const resp = await requestPaymentRelease({
        variables: {
          infractionId,
          idFiles: photoIds.map(({ url, fileName }) => ({
            url,
            fileName,
          })),
          agreementFiles: agreements.map(({ url, fileName }) => ({
            url,
            fileName,
          })),
        },
      });

      const ok =
        resp?.data?.policy?.merchantWarning?.upsertMerchantWarning?.ok ?? false;
      const message =
        resp?.data?.policy?.merchantWarning?.upsertMerchantWarning?.message;

      if (!ok) {
        toastStore.negative(message ?? i`Something went wrong.`);
      }

      onClose && onClose({}, "backdropClick");
    } catch {
      toastStore.negative(i`Something went wrong.`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} fullWidth>
      <ModalTitle
        title={ci18n(
          "modal header",
          "Request Payment Release For Your Account",
        )}
        onClose={
          onClose === undefined
            ? undefined
            : (e) => {
                onClose(e, "backdropClick");
              }
        }
      />
      <Text sx={{ margin: "36px 24px 0px" }}>
        Upload up to 5 files to show a piece of photo ID that matches the
        payment information on your account.
      </Text>
      <SecureFileInput
        accepts=".pdf,.jpeg,.png"
        maxSizeMB={5}
        maxAttachments={5}
        attachments={photoIds}
        onAttachmentsChanged={(attachments) => {
          setPhotoIds(attachments);
        }}
        bucket="TEMP_UPLOADS_V2"
        style={{ margin: "16px 24px 0px" }}
        disabled={loading}
      />
      <Text variant="bodyS" sx={{ margin: "8px 24px 0px" }}>
        Select a PDF, JPEG, or PNG smaller than 5MB.
      </Text>

      <Text variant="bodyS" sx={{ margin: "32px 24px 0px" }}>
        Optional
      </Text>
      <Text sx={{ margin: "4px 24px 0px" }}>
        Upload up to 5 files to show any signed agreement with Wish to release
        payment.
      </Text>
      <SecureFileInput
        accepts=".pdf,.jpeg,.png"
        maxSizeMB={5}
        maxAttachments={5}
        attachments={agreements}
        onAttachmentsChanged={(attachments) => {
          setAgreements(attachments);
        }}
        bucket="TEMP_UPLOADS_V2"
        style={{ margin: "16px 24px 0px" }}
        disabled={loading}
      />
      <Text variant="bodyS" sx={{ margin: "8px 24px 0px" }}>
        Select a PDF, JPEG, or PNG smaller than 5MB.
      </Text>

      <Text variant="bodySStrong" sx={{ margin: "36px 24px" }}>
        Once you submit this request for payment release, you won&apos;t be able
        to modify your payment settings. To avoid possible delays, please ensure
        your payment information is correct before proceeding.
      </Text>

      <ModalFooter
        action={{
          text: ci18n("CTA button", "Send"),
          onClick: onSend,
          isDisabled: loading,
        }}
      />
    </Modal>
  );
};

export default observer(RequestPaymentModal);
