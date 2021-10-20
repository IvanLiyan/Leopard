import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "aphrodite";

/* External Libraries */
import moment from "moment-timezone";

/* Legacy */
import { zendeskURL } from "@legacy/core/url";

/* Lego Components */
import Modal from "@merchant/component/core/modal/Modal";
import { Select } from "@ContextLogic/lego";
import { NumericInput } from "@ContextLogic/lego";
import { HorizontalField } from "@ContextLogic/lego";
import { Card } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";
import { Alert } from "@ContextLogic/lego";
import ModalFooter from "@merchant/component/core/modal/ModalFooter";
import { StepsIndicator } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { CheckboxField } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";

/* Merchant API */
import {
  getEarlyPaymentPolicy,
  requestEarlyPayment,
  RequestEarlyPaymentResp,
} from "@merchant/api/early-payment";

/* Type Imports */
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { EarlyPaymentPolicy } from "@merchant/api/early-payment";
import LocalizationStore from "@stores/LocalizationStore";
import { useNavigationStore } from "@stores/NavigationStore";
import { formatDatetimeLocalized } from "@toolkit/datetime";

export type RequestEarlyPaymentModalProps = BaseProps;

export type RequestEarlyPaymentContentProps = BaseProps & {
  readonly earlyPaymentPolicy: EarlyPaymentPolicy;
  readonly onClose: () => unknown;
  readonly isZh: boolean;
};

export type RequestEarlyPaymentContentWrapperProps = BaseProps & {
  readonly earlyPaymentPolicy: EarlyPaymentPolicy | null | undefined;
  readonly onClose: () => unknown;
};

export type RequestEarlyPaymentDetailProps = BaseProps & {
  readonly earlyPaymentPolicy: EarlyPaymentPolicy;
  readonly requestedAmount: number;
  readonly earlyPaymentTermType: number;
  readonly isZh: boolean;
};

const EarlyPaymentDetail = (props: RequestEarlyPaymentDetailProps) => {
  const styles = useStylesheet();
  const { earlyPaymentPolicy, requestedAmount, earlyPaymentTermType, isZh } =
    props;
  const nextPaymentDate = moment(earlyPaymentPolicy.next_payment_date);
  const installmentFeeRate =
    earlyPaymentPolicy.term_info_dict[earlyPaymentTermType]
      .monthly_interest_rate;

  const renderInfoTooltipMessage = function () {
    let message = "";
    if (installmentFeeRate === 0) {
      message =
        i`The Early Payment amount will be evenly deducted from each disbursement ` +
        i`during the term selected immediately after the next disbursement. ` +
        i`For a limited time to support our merchants, the applicable fee is 0.`;
    } else {
      message = isZh
        ? `请求的提前放款金额将在您的下一个结款日放款。提前放款金额将从您下一个结款日之后的、` +
          `所选还款期限期间的每个结款日中分别均等扣除；每一次扣除金额将包含一项${installmentFeeRate}%` +
          `的每月费用。`
        : i`The Early Payment amount will be evenly deducted from each disbursement ` +
          i`during the term selected immediately after the next disbursement; ` +
          i`each deduction will include a monthly fee of ${installmentFeeRate}%.`;
    }
    return message;
  };
  const renderInfoTooltip = function () {
    return (
      <Info
        style={{ float: "right", marginTop: "4px" }}
        text={renderInfoTooltipMessage()}
        size={16}
        position="top center"
        sentiment="info"
      />
    );
  };
  const renderDeductionDetail = function () {
    const repaymentDates =
      earlyPaymentPolicy.term_info_dict[earlyPaymentTermType].dates;
    const installmentNum = repaymentDates.length;
    const totalPaybackAmount =
      Math.ceil(
        requestedAmount * (100 + (installmentFeeRate * installmentNum) / 2), // Since two repayments each month
      ) / 100;
    let remainingAmount = totalPaybackAmount;

    return (
      <>
        {repaymentDates.map((deductionDate, index) => {
          let repaymentAmount =
            Math.ceil((totalPaybackAmount * 100) / installmentNum) / 100;
          if (index === installmentNum - 1) {
            repaymentAmount = remainingAmount;
          } else {
            remainingAmount -= repaymentAmount;
          }
          return (
            <React.Fragment key={deductionDate}>
              <SheetItem
                key={`${deductionDate}_deduction`}
                className={css(styles.fixedHeightSheetItem)}
                title={
                  isZh
                    ? `还款金额 ${index + 1}`
                    : i`Payback Amount ${index + 1}`
                }
              >
                {formatCurrency(repaymentAmount, earlyPaymentPolicy.currency)}
              </SheetItem>
              <SheetItem
                key={`${deductionDate}_date`}
                className={css(styles.fixedHeightSheetItem)}
                title={isZh ? "将于该结款日扣除" : i`Will be deducted on`}
              >
                {isZh
                  ? `${formatDatetimeLocalized(
                      moment(deductionDate),
                      "YYYY/MM/DD",
                    )}结款日`
                  : i`Disbursement of ${formatDatetimeLocalized(
                      moment(deductionDate),
                      "dddd, MMMM DD, YYYY",
                    )}`}
              </SheetItem>
            </React.Fragment>
          );
        })}

        <SheetItem
          className={css(styles.fixedHeightSheetItem)}
          title={() => {
            return (
              <>
                {isZh ? "还款总金额" : i`Total Payback Amount`}
                {renderInfoTooltip()}
              </>
            );
          }}
        >
          {formatCurrency(totalPaybackAmount, earlyPaymentPolicy.currency)}
        </SheetItem>
        {installmentFeeRate === 0 && (
          <SheetItem
            className={css(styles.fixedHeightSheetItem)}
            title={isZh ? "还款次数" : i`Number of Payback`}
          >
            {installmentNum}
          </SheetItem>
        )}
        {installmentFeeRate > 0 && (
          <SheetItem
            className={css(styles.fixedHeightSheetItem)}
            title={isZh ? "每月费用率" : i`Monthly Fee Rate`}
          >
            {`${installmentFeeRate}%`}
          </SheetItem>
        )}
      </>
    );
  };
  if (requestedAmount === 0) {
    return (
      <Alert
        text={
          isZh
            ? "提前放款金额不能为0"
            : i`The early payment amount cannot be zero.`
        }
        sentiment="negative"
      />
    );
  }
  return (
    <Card
      className={css(styles.card)}
      title={isZh ? "详细信息" : i`Detail Information`}
    >
      <div className={css(styles.sheetItemContainer)}>
        <SheetItem
          className={css(styles.fixedHeightSheetItem)}
          title={isZh ? "提前放款金额" : i`Early Payment Amount`}
        >
          {formatCurrency(requestedAmount, earlyPaymentPolicy.currency)}
        </SheetItem>
        <SheetItem
          className={css(styles.fixedHeightSheetItem)}
          title={isZh ? "将于该结款日支付给商户" : i`Will be paid on`}
        >
          {isZh
            ? `${formatDatetimeLocalized(nextPaymentDate, "YYYY/MM/DD")}结款日`
            : i`Disbursement of ${formatDatetimeLocalized(
                nextPaymentDate,
                "dddd, MMMM DD, YYYY",
              )}`}
        </SheetItem>
        {renderDeductionDetail()}
      </div>
    </Card>
  );
};

const RequestEarlyPaymentContentWrapper = (
  props: RequestEarlyPaymentContentWrapperProps,
) => {
  const styles = useStylesheet();
  const { earlyPaymentPolicy, onClose } = props;
  const { locale } = LocalizationStore.instance();
  const isZh = locale === "zh";

  if (earlyPaymentPolicy) {
    return (
      <RequestEarlyPaymentContent
        earlyPaymentPolicy={earlyPaymentPolicy}
        onClose={onClose}
        isZh={isZh}
      />
    );
  }
  return (
    <div className={css(styles.rowContainer)}>
      <LoadingIndicator
        className={css(styles.loadingIndicator)}
        type="spinner"
        size={70}
      />
    </div>
  );
};

const RequestEarlyPaymentContent = (props: RequestEarlyPaymentContentProps) => {
  const styles = useStylesheet();
  const navigationStore = useNavigationStore();
  const STEPS = {
    REQUEST: 0,
    CONFIRM: 1,
    RESULT: 2,
  };
  const { earlyPaymentPolicy, onClose, isZh } = props;
  const [earlyPaymentAmount, setEarlyPaymentAmount] = useState(0);
  const [actionButtonLoading, setSecondaryButtonLoading] = useState(false);
  const [earlyPaymentTermType, setEarlyPaymentTermType] = useState<number>(
    earlyPaymentPolicy.default_term,
  );
  const [step, setStep] = useState(STEPS.REQUEST);
  const [requestResult, setRequestResult] = useState<
    RequestEarlyPaymentResp | null | undefined
  >(null);
  const [confirmation, setConfirmation] = useState(false);
  useEffect(() => {
    if (earlyPaymentPolicy) {
      if (earlyPaymentPolicy.maximum_amount >= 0) {
        setEarlyPaymentAmount(Math.floor(earlyPaymentPolicy.maximum_amount));
      } else {
        setEarlyPaymentAmount(0);
      }
    }
  }, [earlyPaymentPolicy]);

  const installmentFeeRate =
    earlyPaymentPolicy.term_info_dict[earlyPaymentTermType]
      .monthly_interest_rate;

  const confirmButtonProps = {
    style: { flex: 1 },
    text: step === STEPS.RESULT ? i`OK` : i`Confirm`,
    isDisabled:
      earlyPaymentAmount === 0 || (step === STEPS.CONFIRM && !confirmation),
    isLoading: actionButtonLoading,
    popoverContent:
      // eslint-disable-next-line no-nested-ternary
      step === STEPS.CONFIRM && !confirmation
        ? isZh
          ? "您需要点击以上复选框以确认进入下一步"
          : i`You need to confirm the checkbox to proceed`
        : null,
    onClick: async () => {
      setSecondaryButtonLoading(true);
      if (step === STEPS.REQUEST) {
        setStep(STEPS.CONFIRM);
      } else if (step === STEPS.CONFIRM) {
        const resp = await requestEarlyPayment({
          request_amount: earlyPaymentAmount,
          early_payment_term_type: earlyPaymentTermType,
        }).call();
        const { data } = resp;
        if (!data) {
          return;
        }
        setRequestResult(data);
        setStep(STEPS.RESULT);
      } else {
        // RESULT
        onClose();
        navigationStore.reload();
      }
      setSecondaryButtonLoading(false);
    },
  };

  const cancelButtonProps = {
    text: step === STEPS.CONFIRM ? i`Go Back` : i`Cancel`,
    disabled: step === STEPS.RESULT,
    onClick: () => {
      // If cancel button clicked, confirmation checkbox shall be unmarked
      setConfirmation(false);
      if (step === STEPS.REQUEST) {
        onClose();
      } else if (step === STEPS.CONFIRM) {
        setStep(STEPS.REQUEST);
      }
    },
  };

  const renderSuccessMessage = () => {
    return (
      <>
        <p>
          {isZh
            ? "您的提前放款请求将在当前付款周期结束前完成处理。如果您在" +
              "同一付款周期中请求了多项提前放款，仅最近一项请求将被处理。"
            : i`Your Early Payment request will be processed by ` +
              i`the end of the current payment disbursement cycle. If you ` +
              i`submit more than one Early Payment request within the same ` +
              i`payment disbursement cycle, only the latest request will ` +
              i`be processed. `}
        </p>
        {installmentFeeRate === 0 ? (
          <p>
            The requested Early Payment amount will be included in your next
            payment disbursement. The Early Payment amount will be evenly
            deducted from each disbursement during the term selected immediately
            after the next disbursement, which you may view in your Pending
            Balance.
          </p>
        ) : (
          <p>
            {isZh
              ? `请求的提前放款金额将在您的下一个结款日放款。提前放款金额将从您下一个结款日之后的、` +
                `所选还款期限期间的每个结款日中分别均等扣除（每一次扣除金额将包含一项` +
                `${installmentFeeRate}%的每月费用）；您可在商户平台的”待确认余额”中查看提前放款金额。`
              : i`The requested Early Payment amount will be included in your next ` +
                i`payment disbursement. The Early Payment amount will be evenly ` +
                i`deducted from each disbursement during the term selected immediately after ` +
                i`the next disbursement (each deduction will include a monthly fee of ` +
                i`${installmentFeeRate}%), which you may view in your Pending Balance.`}
          </p>
        )}
      </>
    );
  };

  const renderRequestInfoMessage = () => {
    let message = "";
    if (installmentFeeRate === 0) {
      message =
        i`You are eligible to request to receive up to ${formatCurrency(
          Math.floor(earlyPaymentPolicy.maximum_amount),
          earlyPaymentPolicy.currency,
        )} of the current Total Cost of your recently confirmed fulfilled ` +
        i`orders as an Early Payment. ` +
        i`The requested Early Payment amount will be included in your ` +
        i`next payment disbursement. The Early Payment amount will be ` +
        i`evenly deducted from each disbursement during the term selected ` +
        i`immediately after the next disbursement.`;
    } else {
      message = isZh
        ? `您现有资格请求获取您近期确认履行订单的现总成本金额中最高${formatCurrency(
            Math.floor(earlyPaymentPolicy.maximum_amount),
            earlyPaymentPolicy.currency,
          )}作为提前放款金额。请求的提前放款金额将在您的下一个结款日放款。` +
          `提前放款金额将从您下一个结款日之后的、所选还款期限期间的每个结款日中分别均等扣除；` +
          `每一次扣除金额将包含一项${installmentFeeRate}%的每月费用。`
        : i`You are eligible to request to receive up to ${formatCurrency(
            Math.floor(earlyPaymentPolicy.maximum_amount),
            earlyPaymentPolicy.currency,
          )} of the current Total Cost of your recently confirmed fulfilled ` +
          i`orders as an Early Payment. ` +
          i`The requested Early Payment amount will be included in your ` +
          i`next payment disbursement. The Early Payment amount will be ` +
          i`evenly deducted from each disbursement during the term selected ` +
          i`immediately after the next disbursement. Each deduction will include ` +
          i`a monthly fee of ${installmentFeeRate}%.`;
    }

    return (
      <>
        <p className={css(styles.earlyPaymentMessage)}>{message}</p>
        <p className={css(styles.earlyPaymentMessage)}>
          {isZh
            ? "请注意：您的提前放款请求将在当前付款周期结束前完成处理。如果您在" +
              "同一付款周期中请求了多项提前放款，仅最近一项请求将被处理。"
            : i`Note: Your Early Payment request will be processed by ` +
              i`the end of the current payment disbursement cycle. If you ` +
              i`submit more than one Early Payment request within the same ` +
              i`payment disbursement cycle, only the latest request will ` +
              i`be processed. `}
        </p>
      </>
    );
  };

  const renderConfirmMessage = () => {
    let message = "";
    if (installmentFeeRate === 0) {
      message =
        i`Please review the following information and confirm that you would ` +
        i`like to receive ${formatCurrency(
          earlyPaymentAmount,
          earlyPaymentPolicy.currency,
        )} of the current Total Cost of your recently confirmed ` +
        i`fulfilled orders as an Early Payment. ` +
        i`The requested Early Payment amount will be included in ` +
        i`your next payment disbursement. The Early Payment amount ` +
        i`will be evenly deducted from each disbursement during the ` +
        i`term selected immediately after the next disbursement.`;
    } else {
      message = isZh
        ? `请检查以下信息并确认您希望获取您近期确认履行订单的现总成本中的${formatCurrency(
            earlyPaymentAmount,
            earlyPaymentPolicy.currency,
          )}来作为提前放款金额。请求的提前放款金额将在您的下一个结款日放款。` +
          `提前放款金额将从您下一个结款日之后的、所选还款期限期间的每个结款日中分别均等扣除；` +
          `每一次扣除金额将包含一项${installmentFeeRate}%的每月费用。`
        : i`Please review the following information and confirm that you would ` +
          i`like to receive ${formatCurrency(
            earlyPaymentAmount,
            earlyPaymentPolicy.currency,
          )} of the current Total Cost of your recently confirmed ` +
          i`fulfilled orders as an Early Payment. ` +
          i`The requested Early Payment amount will be included in ` +
          i`your next payment disbursement. The Early Payment amount ` +
          i`will be evenly deducted from each disbursement during the ` +
          i`term selected immediately after the next disbursement. Each ` +
          i`deduction will include a monthly fee of ${installmentFeeRate}%.`;
    }
    return (
      <>
        <p className={css(styles.earlyPaymentMessage)}>{message}</p>
        <p className={css(styles.earlyPaymentMessage)}>
          {isZh
            ? "请注意：您的提前放款请求将在当前付款周期结束前完成处理。如果您在" +
              "同一付款周期中请求了多项提前放款，仅最近一项请求将被处理。"
            : i`Note: Your Early Payment request will be processed by ` +
              i`the end of the current payment disbursement cycle. If you ` +
              i`submit more than one Early Payment request within the same ` +
              i`payment disbursement cycle, only the latest request will ` +
              i`be processed. `}
        </p>
      </>
    );
  };

  const renderStepDetail = () => {
    switch (step) {
      case STEPS.REQUEST:
        return (
          <>
            {renderRequestInfoMessage()}
            <Link
              className={css(styles.earlyPaymentMessage)}
              href={zendeskURL("360043372513")}
              openInNewTab
            >
              {isZh ? `了解更多` : i`Learn more`}
            </Link>
            <HorizontalField
              className={css(styles.horizontalField)}
              title={
                isZh
                  ? `提前放款金额（${earlyPaymentPolicy.currency}）`
                  : i`Early Payment Amount (${earlyPaymentPolicy.currency})`
              }
              titleWidth={220}
              titleAlign="start"
              centerTitleVertically
            >
              <NumericInput
                value={earlyPaymentAmount}
                onChange={({ valueAsNumber, valueAsString }) => {
                  if (valueAsNumber) {
                    if (
                      valueAsNumber >= 0 &&
                      valueAsNumber <= earlyPaymentPolicy.maximum_amount
                    ) {
                      setEarlyPaymentAmount(valueAsNumber);
                    }
                  } else if (!valueAsString) {
                    setEarlyPaymentAmount(0);
                  }
                }}
                incrementStep={1}
              />
            </HorizontalField>
            <HorizontalField
              className={css(styles.horizontalField)}
              title={isZh ? `还款期限` : i`Early Payment Term`}
              titleWidth={220}
              titleAlign="start"
              centerTitleVertically
            >
              <Select
                className={css(styles.termSelect)}
                options={Object.keys(earlyPaymentPolicy.term_info_dict)
                  .map(Number)
                  .map((key: number) => {
                    return {
                      value: key,
                      text: earlyPaymentPolicy.term_info_dict[key].name,
                    };
                  })}
                selectedValue={earlyPaymentTermType}
                onSelected={(selectedOption: number) => {
                  setEarlyPaymentTermType(selectedOption);
                }}
                position="bottom right"
              />
            </HorizontalField>
            <EarlyPaymentDetail
              earlyPaymentPolicy={earlyPaymentPolicy}
              requestedAmount={earlyPaymentAmount}
              earlyPaymentTermType={earlyPaymentTermType}
              isZh={isZh}
            />
          </>
        );
      case STEPS.CONFIRM:
        return (
          <>
            {renderConfirmMessage()}
            <Link
              className={css(styles.earlyPaymentMessage)}
              href={zendeskURL("360043372513")}
              openInNewTab
            >
              Learn more
            </Link>
            <EarlyPaymentDetail
              earlyPaymentPolicy={earlyPaymentPolicy}
              requestedAmount={earlyPaymentAmount}
              earlyPaymentTermType={earlyPaymentTermType}
              isZh={isZh}
            />
            <CheckboxField
              className={css(styles.earlyPaymentMessage)}
              wrapTitle
              title={
                isZh
                  ? "点击“确认”表示您知晓并同意，您将负责支付全部提前放款金额和以上所示的费用，且Wish可" +
                    "在必要时合理自行抵消或扣除未来款项以收取提前放款金额和相应的费用。" +
                    "您知晓您的提前放款请求在确认后将无法取消，且您或无法更改还款计划。"
                  : i`By clicking ‘Confirm’, you acknowledge and agree that you are responsible ` +
                    i`for payment of the entire Early Payment amount and the fees shown above, ` +
                    i`and that Wish shall offset or withhold future payments at Wish’s reasonable ` +
                    i`discretion as necessary to collect the Early Payment amount and applicable ` +
                    i`fees. You acknowledge that your Early Payment request cannot be cancelled ` +
                    i`after confirmation and that you may not alter your repayment schedule.`
              }
              onChange={() => setConfirmation(!confirmation)}
              checked={confirmation}
            />
          </>
        );
      case STEPS.RESULT:
        if (requestResult == null) {
          // Should not happen since we used await.
          // Add a null check to avoid lint error.
          return (
            <Alert
              title={isZh ? "失败" : i`Failed.`}
              text={
                isZh
                  ? `您的提前放款申请没有通过。`
                  : i`Your Early Payment Request Failed.`
              }
              sentiment="negative"
            />
          );
        } else if (requestResult?.succeeded) {
          return (
            <Alert
              title={i`Success!`}
              text={() => {
                return (
                  <div>
                    {renderSuccessMessage()}
                    {isZh
                      ? "若需获得更多提前放款资格，请继续履行订单。您可为未来已履行订单的总成本的一部分款额请求提前放款。"
                      : i`To be eligible for additional Early Payments, continue to fulfill ` +
                        i`orders. You will be able to request Early Payment for up to a ` +
                        i`portion of the costs of your future fulfilled orders.`}
                  </div>
                );
              }}
              sentiment="positive"
            />
          );
        }

        return (
          <Alert
            title={isZh ? "失败" : i`Failed.`}
            text={
              isZh
                ? `您的提前放款申请没有通过。原因：${requestResult.reason}`
                : i`Your Early Payment Request Failed. Failed reason: ${requestResult.reason}`
            }
            sentiment="negative"
          />
        );
    }
  };

  return (
    <div className={css(styles.contextBody)}>
      <div className={css(styles.rowContainer)}>
        <StepsIndicator
          className={css(styles.stepsIndicator)}
          steps={[
            {
              title: isZh ? "请求提前放款" : i`Request Early Payment`,
            },
            {
              title: isZh ? "确认" : i`Confirmation`,
            },
            {
              title: isZh ? "结果" : i`Result`,
            },
          ]}
          completedIndex={step}
        />
      </div>
      {renderStepDetail()}
      <ModalFooter action={confirmButtonProps} cancel={cancelButtonProps} />
    </div>
  );
};

export default class RequestEarlyPaymentModal extends Modal {
  props: RequestEarlyPaymentModalProps;

  renderContent() {
    const earlyPaymentPolicyResp = getEarlyPaymentPolicy();
    const earlyPaymentPolicy = earlyPaymentPolicyResp.response?.data;
    return (
      <RequestEarlyPaymentContentWrapper
        earlyPaymentPolicy={earlyPaymentPolicy}
        onClose={() => this.close()}
      />
    );
  }

  constructor(props: RequestEarlyPaymentModalProps) {
    super(() => null);
    this.props = props;
    const { locale } = LocalizationStore.instance();
    const isZh = locale === "zh";
    this.setHeader({
      title: isZh ? "提前放款" : i`Early Payment`,
    });

    this.setWidthPercentage(0.7);
  }
}

const useStylesheet = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        contextBody: {
          margin: "12px 24px 0px 24px",
          display: "flex",
          flexFlow: "column",
          justifyContent: "center",
        },
        rowContainer: {
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-around",
        },
        sheetItemContainer: {
          display: "flex",
          flexFlow: "row wrap",
          alignContent: "flex-start",
        },
        loadingIndicator: {
          padding: "40px",
        },
        fixedHeightSheetItem: {
          "@media (max-width: 1300px)": {
            flexBasis: "100%",
          },
          "@media (min-width: 1300px)": {
            flexBasis: "45%",
          },
          margin: "12px 0px",
          padding: "4px 20px",
          borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
        },
        card: {
          margin: "20px 12px",
        },
        earlyPaymentMessage: {
          margin: "8px 16px",
        },
        stepsIndicator: {
          width: "60%",
          marginBottom: 20,
        },
        horizontalField: {
          margin: "0px 12px 0px 16px",
        },
        termSelect: {
          marginTop: 8,
        },
      }),
    [],
  );
};
