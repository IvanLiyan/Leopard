/*
 * Wps.tsx
 *
 * Created by Jonah Dlin on Mon Apr 12 2021
 * Copyright © 2021-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import {
  Button,
  Card,
  CellInfo,
  Layout,
  Link,
  PrimaryButton,
  Table,
  Text,
} from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { OrderDetailInitialData } from "@toolkit/orders/detail";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useTheme } from "@stores/ThemeStore";
import { useNavigationStore } from "@stores/NavigationStore";

type Props = BaseProps & {
  readonly initialData: OrderDetailInitialData;
};

type TableData = {
  readonly date: string;
  readonly amount: string;
  readonly reason: string | null | undefined;
  readonly processedDatePassed: boolean;
  readonly processedDateDisplay: string | null | undefined;
  readonly paymentId: string | null | undefined;
};

const Wps: React.FC<Props> = ({ initialData, className, style }: Props) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();

  const {
    fulfillment: { order },
  } = initialData;

  const { wpsFulfillment, tracking, id: orderId, state } = order;

  if (wpsFulfillment == null) {
    return null;
  }

  const canShowActions = state !== "REFUNDED";

  const confirmedFulfillmentDate =
    tracking?.confirmedFulfillmentDate?.formatted;
  const isConfirmedShipped = confirmedFulfillmentDate != null;
  const {
    shippingLabelDownloadLink,
    paymentId,
    shipmentFee: { display: shipmentFee },
    purchaseDate,
    paymentProcessedDate,
    feeAdjustments,
    shipmentState,
  } = wpsFulfillment;
  const notPaid = shipmentState !== "PAID";

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className={css(styles.sectionHeader)} weight="semibold">
      {title}
    </Text>
  );

  const LineItem = ({
    title,
    content,
  }: {
    title: string;
    content: React.ReactNode;
  }) => (
    <Layout.FlexRow className={css(styles.lineItem)}>
      <Text className={css(styles.lineItemTitle)}>{title}</Text>
      <div className={css(styles.lineItemContent)}>{content}</div>
    </Layout.FlexRow>
  );

  const purchaseDateDisplay =
    purchaseDate == null ? "" : purchaseDate.formatted;
  const { formatted: processedDateDisplay, hasPassed: hasProcessedDatePassed } =
    paymentProcessedDate == null
      ? {
          formatted: "",
          hasPassed: false,
        }
      : paymentProcessedDate;

  const renderFeeAdjustments = () => {
    if (feeAdjustments == null || feeAdjustments.length == 0) {
      return null;
    }

    const tableData: ReadonlyArray<TableData> = feeAdjustments.map(
      ({
        creationDate: { formatted: date },
        amount: { display: amount },
        reason,
        paymentId,
        paymentProcessedDate,
      }) => ({
        date,
        amount,
        reason,
        processedDatePassed:
          paymentProcessedDate != null && paymentProcessedDate.hasPassed,
        processedDateDisplay:
          paymentProcessedDate == null
            ? undefined
            : paymentProcessedDate.formatted,
        paymentId,
      }),
    );

    return (
      <>
        <Text className={css(styles.feeAdjustmentsHeader)}>
          Wish Parcel fee adjustments
        </Text>
        <Table data={tableData} hideBorder>
          <Table.Column columnKey="date" title={i`Date`} />
          <Table.Column columnKey="amount" title={i`Amount`} align="right" />
          <Table.Column
            columnKey="reason"
            title={i`Reason`}
            noDataMessage="--"
          />
          <Table.Column
            columnKey="processedDateDisplay"
            title={i`Status`}
            noDataMessage="--"
            align="right"
          >
            {({
              row: { processedDatePassed, processedDateDisplay, paymentId },
            }: CellInfo<TableData, TableData>) =>
              processedDateDisplay == null ? (
                "--"
              ) : (
                <Layout.FlexColumn alignItems="flex-end">
                  <Text>
                    {processedDatePassed
                      ? i`Processed on`
                      : i`To be processed on`}
                  </Text>
                  {paymentId != null ? (
                    <Link
                      href={`/payment-detail/${paymentId}`}
                      title={processedDateDisplay}
                    />
                  ) : (
                    <Text>{processedDateDisplay}</Text>
                  )}
                </Layout.FlexColumn>
              )
            }
          </Table.Column>
        </Table>
      </>
    );
  };

  return (
    <Card className={css(className, style)} title={i`Wish Parcel`}>
      <Layout.FlexColumn>
        <SectionHeader title={i`Summary`} />
        <LineItem
          title={i`${1} shipping label`}
          content={<Text>{shipmentFee}</Text>}
        />
        <SectionHeader title={i`Details`} />
        <LineItem
          title={i`Purchased on`}
          content={<Text>{purchaseDateDisplay || "--"}</Text>}
        />
        <LineItem
          title={
            hasProcessedDatePassed ? i`Processed on` : i`To be processed on`
          }
          content={
            paymentId != null ? (
              <Link
                href={`/payment-detail/${paymentId}`}
                title={processedDateDisplay}
              />
            ) : (
              <Text>{processedDateDisplay || "--"}</Text>
            )
          }
        />
        {canShowActions && (
          <Layout.FlexRow className={css(styles.buttonRow)}>
            {isConfirmedShipped ? (
              <Button
                className={css(styles.button)}
                href={shippingLabelDownloadLink}
              >
                View shipping label
              </Button>
            ) : (
              <>
                <PrimaryButton
                  className={css(styles.button)}
                  popoverStyle={css(styles.buttonMargin)}
                  isDisabled={shippingLabelDownloadLink == null || notPaid}
                  popoverContent={
                    shippingLabelDownloadLink == null
                      ? i`Your shipping label is not ready for download yet. ` +
                        i`Refresh this page shortly to access the shipping label.`
                      : undefined
                  }
                  onClick={async () => {
                    if (shippingLabelDownloadLink != null) {
                      await navigationStore.download(shippingLabelDownloadLink);
                    }
                  }}
                >
                  Download shipping label
                </PrimaryButton>
                <Button
                  className={css(styles.button, styles.buttonMargin)}
                  href={`/shipping-label/create/${orderId}`}
                  disabled={notPaid}
                >
                  Edit shipping label
                </Button>
              </>
            )}
          </Layout.FlexRow>
        )}
        {renderFeeAdjustments()}
      </Layout.FlexColumn>
    </Card>
  );
};

export default observer(Wps);

const useStylesheet = () => {
  const { textBlack, borderPrimary, textDark, surfaceLight } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        sectionHeader: {
          color: textBlack,
          fontSize: 16,
          lineHeight: "20px",
          padding: "14px 24px",
        },
        lineItem: {
          padding: "14px 24px",
          borderBottom: `1px solid ${borderPrimary}`,
        },
        lineItemTitle: {
          width: 150,
          marginRight: 62,
          color: textBlack,
          fontSize: 16,
          lineHeight: "20px",
        },
        lineItemContent: {
          color: textDark,
          fontSize: 16,
          lineHeight: "20px",
        },
        buttonRow: {
          padding: 24,
        },
        button: {
          height: 40,
          boxSizing: "border-box",
        },
        buttonMargin: {
          marginLeft: 16,
        },
        feeAdjustmentsHeader: {
          borderTop: `1px solid ${borderPrimary}`,
          borderBottom: `1px solid ${borderPrimary}`,
          padding: "14px 20px",
          backgroundColor: surfaceLight,
        },
      }),
    [textBlack, borderPrimary, textDark, surfaceLight],
  );
};
