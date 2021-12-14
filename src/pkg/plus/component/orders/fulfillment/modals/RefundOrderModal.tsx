import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import faker from "faker/locale/en";
import Modal from "@merchant/component/core/modal/Modal";
import { CharacterLength, RequiredValidator } from "@toolkit/validators";

import {
  Field,
  Button,
  TextInput,
  FormSelect,
  PrimaryButton,
  LoadingIndicator,
  Layout,
  Text,
} from "@ContextLogic/lego";

import {
  RefundReasonCategory,
  BuyerFraudReasonCategory,
  FulfillmentMutationRefundOrdersArgs,
} from "@schema/types";
import { useQuery } from "@apollo/client";

import {
  GET_ORDER_DETAIL,
  REFUND_ORDERS_MUTATION,
  RefundMutationResponse,
  GetOrderDetailArgs,
  GetOrderDetailResponse,
  CancelWpsLabelResponseType,
  CancelWpsLabelInputType,
  CANCEL_WPS_LABEL_MUTATION,
} from "@toolkit/orders/refund";

import { css } from "@toolkit/styling";
import { useTheme } from "@stores/ThemeStore";
import { useToastStore } from "@stores/ToastStore";
import { useApolloStore } from "@stores/ApolloStore";
import { useNavigationStore } from "@stores/NavigationStore";
import { formatCurrency } from "@toolkit/currency";

export type RefundOrderModalProps = {
  readonly orderId: string;
  readonly onClose: () => unknown;
};

const RefundOrderModalContent: React.FC<RefundOrderModalProps> = observer(
  ({ orderId, onClose }: RefundOrderModalProps) => {
    const [selectedRefundReason, setSelectedRefundReason] = useState<
      RefundReasonCategory | undefined
    >(undefined);
    const [selectedBuyerFraudReason, setSelectedBuyerFraudReason] = useState<
      BuyerFraudReasonCategory | undefined
    >(undefined);
    const [note, setNote] = useState<string | undefined>(undefined);
    const [noteValidatorInvalid, setNoteValidatorInvalid] = useState<boolean>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const styles = useStylesheet();

    const { data: orderDetailData } = useQuery<
      GetOrderDetailResponse,
      GetOrderDetailArgs
    >(GET_ORDER_DETAIL, {
      variables: {
        orderId,
      },
    });

    const { client } = useApolloStore();
    const toastStore = useToastStore();
    const navigationStore = useNavigationStore();

    const refundReasons =
      orderDetailData?.fulfillment?.order?.validRefundReasons.filter(
        ({ text }) => text != null,
      );
    const buyerFraudReasons =
      orderDetailData?.platformConstants?.buyerFraudReasons?.filter(
        ({ text }) => text != null,
      );

    if (refundReasons == null) {
      return <LoadingIndicator />;
    }

    const noteActingAsOtherSpecification =
      selectedBuyerFraudReason == "MERCHANT_REPORTED_OTHER";
    const noteTitle = noteActingAsOtherSpecification
      ? i`Specify “other”`
      : i`Add a note (optional)`;
    const noteBody = noteActingAsOtherSpecification
      ? i`Maximum 300 characters`
      : i`Additional notes. Maximum 300 characters`;

    const selectedRefundReasonValid = selectedRefundReason != null;
    const selectedBuyerFraudReasonValid = !(
      selectedRefundReason == "MERCHANT_REPORTED_BUYER_FRAUD" &&
      !selectedBuyerFraudReason
    );
    // we differentiate between note validity and note validator validity because
    // the note may be invalid (blank but required) before the note validator
    // has fired (we don't want to show a required error before the user has
    // had a chance to type anything)
    const noteValid =
      !(noteActingAsOtherSpecification && !note) && !noteValidatorInvalid;

    const canSubmit =
      selectedRefundReasonValid && selectedBuyerFraudReasonValid && noteValid;

    const onSubmit = async () => {
      if (selectedRefundReason == null) {
        toastStore.negative(i`Please select a reason for issuing a refund.`);
        return;
      }
      if (!selectedBuyerFraudReasonValid) {
        toastStore.negative(
          i`A buyer violation type is required when refunding due to buyer fraud.`,
        );
        return;
      }
      if (!noteValid) {
        toastStore.negative(i`Please specify the buyer violation type.`);
        return;
      }

      setIsSubmitting(true);
      try {
        const { data: refundData } = await client.mutate<
          RefundMutationResponse,
          FulfillmentMutationRefundOrdersArgs
        >({
          mutation: REFUND_ORDERS_MUTATION,
          variables: {
            input: [
              {
                orderId,
                reasonNote: note,
                reasonCategory: selectedRefundReason,
                buyerFraudReasonCategory: selectedBuyerFraudReason,
              },
            ],
          },
        });

        const errorMessages =
          refundData?.fulfillment.refundOrders.errorMessages;
        if (errorMessages != null && errorMessages.length > 0) {
          toastStore.negative(errorMessages[0].message);
          return;
        }

        const wpsFulfillment =
          orderDetailData?.fulfillment?.order?.wpsFulfillment;
        const isConfirmedFulfilled =
          orderDetailData?.fulfillment?.order?.tracking?.isTrackingConfirmed ||
          false;

        if (wpsFulfillment != null && !isConfirmedFulfilled) {
          const { data: wpsData } = await client.mutate<
            CancelWpsLabelResponseType,
            CancelWpsLabelInputType
          >({
            mutation: CANCEL_WPS_LABEL_MUTATION,
            variables: {
              input: {
                orderId,
              },
            },
          });

          const wpsOk = wpsData?.fulfillment?.cancelWpsTrackingId?.ok;
          const wpsErrorMessage =
            wpsData?.fulfillment?.cancelWpsTrackingId?.errorMessage;

          if (!wpsOk) {
            toastStore.negative(
              wpsErrorMessage ||
                i`Something went wrong refunding your shipping label`,
            );
          }
        }

        await navigationStore.reload();
        toastStore.positive(i`Order is being processed for refund`);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    };

    const refundOptions = refundReasons.map(({ reason, text }) => {
      return {
        value: reason,
        // `text` will never be null we filter above but TS doesn't know.
        text: text || "",
      };
    });

    const buyerFraudOptions = buyerFraudReasons?.map(({ reason, text }) => {
      return {
        value: reason,
        // `text` will never be null we filter above but TS doesn't know.
        text: text || "",
      };
    });

    const renderWpsSummary = () => {
      const wpsFulfillment =
        orderDetailData?.fulfillment?.order?.wpsFulfillment;

      if (wpsFulfillment == null || selectedRefundReason == null) {
        return null;
      }

      const isConfirmedFulfilled =
        orderDetailData?.fulfillment?.order?.tracking?.isTrackingConfirmed ||
        false;

      const selectedRefundReasonName = refundOptions.find(
        ({ value }) => value === selectedRefundReason,
      )?.text;

      const desc = isConfirmedFulfilled
        ? i`Your order will be refunded for the reason of “${selectedRefundReasonName}”. ` +
          i`You have previously purchased a Wish Parcel shipping label for this order, ` +
          i`which has been confirmed fulfilled using this shipping label. As such, as you ` +
          i`refund this order, the cost of purchasing the shipping label will not be ` +
          i`refunded to your account.`
        : i`Your order will be refunded for the reason of “${selectedRefundReasonName}”. ` +
          i`As you have previously purchased a Wish Parel shipping label for this order, ` +
          i`after you confirm your refund, Wish will automatically cancel your shipping ` +
          i`label and refund its cost to your account in your next payment disbursement.`;

      const shipmentFee = wpsFulfillment?.shipmentFee?.totalFee.display;
      const wpsCurrency = wpsFulfillment?.shipmentFee?.totalFee.currencyCode;

      return (
        <Layout.FlexColumn className={css(styles.wpsSummary)}>
          <Text className={css(styles.wpsDesc)}>{desc}</Text>
          <Text className={css(styles.wpsTableRow)} weight="semibold">
            Summary for your shipping label
          </Text>
          <div className={css(styles.separator, styles.wpsTableRow)} />
          <Layout.FlexRow
            className={css(styles.wpsTableRow)}
            justifyContent="space-between"
          >
            <Text>{1} shipping label</Text>
            <Text>{shipmentFee}</Text>
          </Layout.FlexRow>
          {!isConfirmedFulfilled && (
            <Layout.FlexRow
              className={css(styles.wpsTableRow)}
              justifyContent="space-between"
            >
              <Text>Refund</Text>
              <Text>{`- ${shipmentFee}`}</Text>
            </Layout.FlexRow>
          )}
          <div className={css(styles.separator, styles.wpsTableRow)} />
          <Layout.FlexRow
            className={css(styles.wpsTableRow)}
            justifyContent="space-between"
          >
            <Text weight="semibold">Total</Text>
            <Text weight="semibold">
              {isConfirmedFulfilled
                ? shipmentFee
                : formatCurrency(0, wpsCurrency)}
            </Text>
          </Layout.FlexRow>
        </Layout.FlexColumn>
      );
    };

    return (
      <div className={css(styles.root)}>
        <div className={css(styles.content)}>
          <Field
            title={i`Provide a reason for the refund`}
            className={css(styles.selectField)}
          >
            <FormSelect
              placeholder={i`Select a reason`}
              options={refundOptions}
              selectedValue={selectedRefundReason}
              onSelected={(reason: RefundReasonCategory) => {
                setSelectedRefundReason(reason);
                setSelectedBuyerFraudReason(undefined);
              }}
              disabled={isSubmitting}
              height={40}
            />
          </Field>
          {selectedRefundReason == "MERCHANT_REPORTED_BUYER_FRAUD" &&
            buyerFraudOptions != undefined && (
              <Field
                title={i`Buyer violation type`}
                className={css(styles.selectField)}
              >
                <FormSelect
                  placeholder={i`Select a reason`}
                  options={buyerFraudOptions}
                  selectedValue={selectedBuyerFraudReason}
                  onSelected={setSelectedBuyerFraudReason}
                  disabled={isSubmitting}
                  height={40}
                />
              </Field>
            )}
          <Field title={noteTitle}>
            <TextInput
              value={note}
              placeholder={noteBody}
              debugValue={faker.lorem.paragraph()}
              onChange={({ text }) => setNote(text)}
              onValidityChanged={(isValid, _) => {
                setNoteValidatorInvalid(!isValid);
              }}
              disabled={isSubmitting}
              // force validation if the field can be blank, otherwise a
              // required error will stay visible even after the merchant
              // selects a field where the note is no longer required
              forceValidation={!noteActingAsOtherSpecification}
              validators={[
                new CharacterLength({
                  maximum: 300, // referenced in translations; don't change without updating those as well
                }),
                new RequiredValidator({
                  allowBlank: !noteActingAsOtherSpecification,
                }),
              ]}
              isTextArea
            />
          </Field>
          {renderWpsSummary()}
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
  },
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
        },
        content: {
          display: "flex",
          flexDirection: "column",
          padding: "20px 20px",
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
        selectField: {
          marginBottom: 20,
        },
        wpsSummary: {
          marginTop: 16,
        },
        wpsDesc: {
          marginBottom: 16,
        },
        wpsTableRow: {
          ":not(:last-child)": {
            marginBottom: 16,
          },
        },
        separator: {
          boxSizing: "border-box",
          height: 1,
          borderBottom: `1px dashed ${borderPrimary}`,
        },
      }),
    [borderPrimary],
  );
};

// Need to remove default export to work with legacy orders page
export class RefundOrderModal extends Modal {
  constructor(props: Omit<RefundOrderModalProps, "onClose">) {
    super((onClose) => (
      <RefundOrderModalContent {...props} onClose={onClose} />
    ));

    this.setHeader({
      title: i`Refund order`,
    });

    this.setRenderFooter(() => null);
    this.setWidthPercentage(0.4);
  }
}
