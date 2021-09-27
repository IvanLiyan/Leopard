import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import gql from "graphql-tag";

/* Legacy */
import { ci18n } from "@legacy/core/i18n";

/* Lego Components */
import faker from "faker/locale/en";

import {
  H5,
  Field,
  TextInput,
  DayPickerInput,
  AttachmentInfo,
} from "@ContextLogic/lego";
import { Modal } from "@merchant/component/core/modal";
import { PrimaryButton } from "@ContextLogic/lego";
import { Button } from "@ContextLogic/lego";
import { DEPRECATEDFileInput } from "@merchant/component/core";

import {
  UpdateOrderDeliveryConfirmation,
  FulfillmentMutationUpdateDeliveryConfirmationArgs,
} from "@schema/types";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { useTheme } from "@merchant/stores/ThemeStore";
import { useToastStore } from "@merchant/stores/ToastStore";
import ApolloStore from "@merchant/stores/ApolloStore";
import LocalizationStore from "@merchant/stores/LocalizationStore";

const UPDATE_CONFIRMED_DELIVERY_MUTATION = gql`
  mutation ProductEditState_EditOrCreateProduct(
    $input: UpdateOrderDeliveryConfirmationInput!
  ) {
    fulfillment {
      updateDeliveryConfirmation(input: $input) {
        ok
        errorMessage
      }
    }
  }
`;

type MutationResponseType = {
  readonly fulfillment: {
    readonly updateDeliveryConfirmation: Pick<
      UpdateOrderDeliveryConfirmation,
      "ok" | "errorMessage"
    >;
  };
};

export type UpdateConfimedDeliveryModalProps = {
  readonly orderId: string;
  readonly onClose: () => unknown;
};

const UpdateConfimedDeliveryModalContent: React.FC<UpdateConfimedDeliveryModalProps> = observer(
  ({ onClose, orderId }: UpdateConfimedDeliveryModalProps) => {
    const [attachment, setAttachment] = useState<AttachmentInfo | undefined>(
      undefined
    );
    const [trackingUrl, setTrackingUrl] = useState<string | undefined>(
      undefined
    );
    const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(
      undefined
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const toastStore = useToastStore();
    const styles = useStylesheet();
    const hasTrackingUrl = (trackingUrl || "").trim().length > 0;
    const canSubmit =
      isSubmitting ||
      (deliveryDate != null && (attachment != null || hasTrackingUrl));
    const { locale } = LocalizationStore.instance();
    const onSubmit = async () => {
      const { client } = ApolloStore.instance();
      if (deliveryDate == null) {
        return;
      }
      setIsSubmitting(true);
      const { data } = await client.mutate<
        MutationResponseType,
        FulfillmentMutationUpdateDeliveryConfirmationArgs
      >({
        mutation: UPDATE_CONFIRMED_DELIVERY_MUTATION,
        variables: {
          input: {
            orderId,
            trackingUrl,
            dateDelivered: { unix: deliveryDate.getTime() / 1000 },
            deliveryReceiptFileUrl: attachment?.url,
          },
        },
      });
      setIsSubmitting(false);

      const ok = data?.fulfillment?.updateDeliveryConfirmation?.ok;
      const message =
        data?.fulfillment?.updateDeliveryConfirmation?.errorMessage;
      if (!ok) {
        toastStore.negative(message || i`Something went wrong`);
        return;
      }
      onClose();
      toastStore.positive(i`Confirmed delivery has been updated!`);
    };

    return (
      <div className={css(styles.root)}>
        <div className={css(styles.content)}>
          <H5 className={css(styles.header)}>
            Please upload the delivery receipt or enter the carrier tracking
            link:
          </H5>
          <Field
            title={i`Upload Delivery Receipt (Optional if entering carrier tracking link)`}
            className={css(styles.field)}
          >
            <DEPRECATEDFileInput
              bucket="TEMP_UPLOADS"
              accepts=".jpeg,.png,.pdf"
              onAttachmentsChanged={(attachments) => {
                setAttachment(
                  attachments.length == 0 ? undefined : attachments[0]
                );
              }}
              maxSizeMB={5}
              maxAttachments={1}
              disabled={isSubmitting}
              attachments={attachment ? [attachment] : []}
            />
          </Field>
          <H5 className={css(styles.header)}>
            {ci18n(
              "Meaning 'or'. Placed inbetween two options given to the user: Option A or Option B",
              "OR"
            )}
          </H5>
          <Field
            title={i`Carrier Tracking Link (Optional if uploading receipt)`}
            className={css(styles.field)}
          >
            <TextInput
              placeholder={i`Enter the carrier tracking link`}
              value={trackingUrl}
              onChange={({ text }) => setTrackingUrl(text)}
              debugValue={`https://www.fedex.com/apps/fedextrack/?tracknumbers=${faker.random.uuid()}`}
              hideCheckmarkWhenValid
              disabled={isSubmitting}
            />
          </Field>
          <H5 className={css(styles.header)}>
            Please enter the delivery date as it appears on the delivery receipt
            or tracking link:
          </H5>
          <Field title={i`Date delivered`} className={css(styles.field)}>
            <DayPickerInput
              noEdit
              value={deliveryDate}
              cannotSelectFuture
              onDayChange={(date) => setDeliveryDate(date)}
              dayPickerProps={{
                showOutsideDays: true,
              }}
              disabled={isSubmitting}
              locale={locale}
            />
          </Field>
        </div>
        <div className={css(styles.footer)}>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <PrimaryButton onClick={onSubmit} isDisabled={!canSubmit}>
            Submit
          </PrimaryButton>
        </div>
      </div>
    );
  }
);

const useStylesheet = () => {
  const { borderPrimary } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
          },
          alignItems: "stretch",
        },
        content: {
          display: "flex",
          flexDirection: "column",
          margin: "20px 40px",
          padding: "10px 0px",
          alignItems: "stretch",
        },
        field: {
          margin: "20px 0px",
        },
        sideBySide: {
          display: "flex",
          alignSelf: "stretch",
          margin: "10px 0px",
          "@media (max-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "column",
            ":nth-child(1n) > div": {
              marginBottom: 20,
            },
          },
          "@media (min-width: 900px)": {
            alignItems: "stretch",
            flexDirection: "row",
            flexWrap: "wrap",
            ":nth-child(1n) > div": {
              flexGrow: 1,
              flexBasis: 0,
              flexShrink: 1,
            },
          },
        },
        footer: {
          display: "flex",
          alignSelf: "stretch",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          borderTop: `1px solid ${borderPrimary}`,
          padding: "20px 20px",
        },
        footerButton: {
          height: 80,
          width: 100,
        },
        header: {
          fontSize: 17,
          textAlign: "center",
        },
      }),
    [borderPrimary]
  );
};
export class UpdateConfimedDeliveryModal extends Modal {
  constructor(props: Omit<UpdateConfimedDeliveryModalProps, "onClose">) {
    super((onClose) => (
      <UpdateConfimedDeliveryModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Upload Delivery Confirmation`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.5);
    this.setNoMaxHeight(true);
  }
}
