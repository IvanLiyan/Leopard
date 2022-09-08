/*
 * SafetyReportingForm.tsx
 *
 * Created by Don Sirivat on Fri Mar 11 2022
 * Copyright © 2022-present ContextLogic Inc. All rights reserved.
 */
import React, { useMemo, useState } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { useMutation, useLazyQuery } from "@apollo/client";

/* Lego Components */
import {
  Layout,
  LoadingIndicator,
  PrimaryButton,
  Text,
  TextInput,
  CheckboxGroupField,
} from "@ContextLogic/lego";

/* Merchant Components */
import CardHeader from "@merchant/component/safety-reporting/common/CardHeader";

/* Lego Toolkit */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { useMountEffect } from "@ContextLogic/lego/toolkit/hooks";

/* Merchant Stores */
import { useTheme } from "@stores/ThemeStore";
import { useToastStore } from "@stores/ToastStore";

/* Toolkit */
import {
  GET_ORDER_REPORT_REASONS_QUERY,
  GetOrderReportReasonsResponseType,
  SUBMIT_SUSPICIOUS_ORDER_REPORT,
  SubmitSuspiciousOrderReportResponseType,
  SubmitSuspiciousOrderReportInputType,
} from "@toolkit/safety-reporting";

/* Types */
import { ReportOrderReasons } from "@schema/types";

/* Constants */
const ROW_HEIGHT = 93;
const DEFAULT_ERROR_MESSAGE = i`Something went wrong while submitting report. Please try again later.`;

type Props = BaseProps & {
  readonly onSuccess: () => void;
};

const SafetyReportingForm: React.FC<Props> = ({
  onSuccess,
  className,
  style,
}: Props) => {
  const styles = useStylesheet();
  const toastStore = useToastStore();

  const [mTransactionId, setMTransactionId] = useState<string | null>();
  const [reportExplanation, setReportExplanation] = useState<string | null>();
  const [reportReasons, setReportReasons] = useState<ReportOrderReasons[]>([]);

  const [getReportReasons, { data: reportReasonData, loading: queryLoading }] =
    useLazyQuery<GetOrderReportReasonsResponseType, null>(
      GET_ORDER_REPORT_REASONS_QUERY,
      {
        fetchPolicy: "cache-first",
      }
    );

  const [
    submitOrderReport,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<
    SubmitSuspiciousOrderReportResponseType,
    SubmitSuspiciousOrderReportInputType
  >(SUBMIT_SUSPICIOUS_ORDER_REPORT);

  // Fetch select options on initial load
  useMountEffect(async () => {
    await getReportReasons();
  });

  const reportReasonOptions = useMemo(() => {
    const reasons = reportReasonData?.merchantSafetyInfo?.reportOrderReasons;
    if (!reasons) return [];

    const options = reasons.map((reason) => {
      return {
        value: reason.reportOrderReason,
        title: reason.reportOrderReasonText,
      };
    });

    return options;
  }, [reportReasonData]);

  const renderError = (errorMessage?: string | null | undefined) => {
    toastStore.negative(errorMessage || DEFAULT_ERROR_MESSAGE);
  };

  const submitPressed = async () => {
    // Simple form validation
    if (
      !mTransactionId?.trim() ||
      reportReasons.length == 0 ||
      !reportExplanation?.trim()
    ) {
      toastStore.negative(
        i`Please complete all fields before submitting report.`
      );
      return;
    }

    // Submit suspicious order report mutation
    const input: SubmitSuspiciousOrderReportInputType["input"] = {
      mTransactionId,
      reportReasons,
      reportExplanation,
    };

    try {
      const { data } = await submitOrderReport({ variables: { input } });

      if (data == null || (mutationError && !mutationLoading)) {
        renderError(mutationError?.message);
        return;
      }

      const {
        merchantSafety: { reportOrder },
      } = data;
      if (reportOrder == null) {
        renderError(mutationError?.message);
        return;
      }

      const { ok } = reportOrder;

      if (ok) {
        onSuccess();
      } else {
        renderError(reportOrder?.errMessage);
      }
    } catch (e) {
      toastStore.negative(
        i`Error performing request. Please verify your order ID and try again.`
      );
    }

    return;
  };

  const onReasonsToggled = (reason: ReportOrderReasons) => {
    const reasonsSet = new Set(reportReasons);
    if (reasonsSet.has(reason)) {
      reasonsSet.delete(reason);
    } else {
      reasonsSet.add(reason);
    }
    setReportReasons(Array.from(reasonsSet));
  };

  return (
    <Layout.FlexColumn style={[className, style]}>
      <Layout.FlexColumn style={styles.content}>
        <CardHeader title={i`Report a transaction`} />
        {queryLoading || mutationLoading ? (
          <LoadingIndicator />
        ) : (
          <Layout.FlexColumn style={styles.inputSection}>
            <Layout.FlexColumn style={styles.fixedHeightRow}>
              <Text style={styles.label} weight="semibold">
                Order ID
              </Text>
              <TextInput
                style={styles.textInput}
                value={mTransactionId}
                placeholder={i`Enter Order ID`}
                onChange={(e) => setMTransactionId(e.text)}
              />
            </Layout.FlexColumn>
            <Layout.FlexColumn style={styles.checkboxContainer}>
              <Text style={styles.label} weight="semibold">
                Report reason
              </Text>
              <CheckboxGroupField
                options={reportReasonOptions}
                onChecked={(option) => onReasonsToggled(option.value)}
                selected={reportReasons}
                style={styles.checkbox}
              />
            </Layout.FlexColumn>
            <Layout.FlexColumn style={styles.inputRow}>
              <Text style={styles.label} weight="semibold">
                Supporting explanation
              </Text>
              <TextInput
                placeholder={i`Describe situation`}
                isTextArea
                rows={3}
                style={styles.textInput}
                value={reportExplanation}
                onChange={(e) => setReportExplanation(e.text)}
              />
            </Layout.FlexColumn>
          </Layout.FlexColumn>
        )}
        <Layout.FlexRow
          justifyContent="flex-end"
          style={styles.buttonContainer}
        >
          {/* Hide button while processing mutation */}
          {!queryLoading && !mutationLoading && (
            <PrimaryButton style={styles.submitButton} onClick={submitPressed}>
              Submit
            </PrimaryButton>
          )}
        </Layout.FlexRow>
      </Layout.FlexColumn>
    </Layout.FlexColumn>
  );
};

export default observer(SafetyReportingForm);

const useStylesheet = () => {
  const { borderPrimary, borderPrimaryDark, textDark } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        content: {
          border: `1px solid ${borderPrimaryDark}`,
          borderRadius: 5,
          backgroundColor: "white",
          minHeight: 497,
        },
        inputSection: {
          paddingTop: 20,
          marginBottom: 10,
        },
        fixedHeightRow: {
          padding: "0px 20px",
          height: ROW_HEIGHT,
          "@media (min-width: 900px)": {
            height: ROW_HEIGHT,
          },
          "@media (max-width: 900px)": {
            height: ROW_HEIGHT * 1.1,
          },
        },
        checkboxContainer: {
          padding: "0px 20px",
          marginBottom: 25,
        },
        checkbox: {
          marginTop: 10,
          overflowY: "hidden",
        },
        inputRow: {
          padding: "0px 20px",
        },
        label: {
          fontSize: 14,
          color: textDark,
        },
        submitButton: {
          marginTop: 25,
          marginBottom: 25,
          marginRight: 18,
          width: 77,
          height: 40,
        },
        textInput: {
          marginTop: 7,
          overflowX: "hidden",
          minWidth: 100,
        },
        buttonContainer: {
          marginTop: 25,
          borderTop: `1px solid ${borderPrimary}`,
        },
      }),
    [borderPrimary, borderPrimaryDark, textDark]
  );
};
