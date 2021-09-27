import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* External Libraries */
import momenttz from "moment-timezone";
import moment from "moment/moment";

/* Lego Components */
import { WelcomeHeader } from "@merchant/component/core";
import { Card } from "@ContextLogic/lego";
import { SheetItem } from "@merchant/component/core";
import { Link } from "@ContextLogic/lego";
import { ThemedLabel } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Alert } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as dimen from "@toolkit/lego-legacy/dimen";
import { css } from "@toolkit/styling";
import { usePathParams } from "@toolkit/url";
import {
  palettes,
  pageBackground,
} from "@toolkit/lego-legacy/DEPRECATED_colors";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant API */
import * as earlyPaymentApi from "@merchant/api/early-payment";

/* Merchant Store */
import { useStore } from "@merchant/stores/AppStore_DEPRECATED";

/* Toolkit */
import { useRequest } from "@toolkit/api";

/* Type Imports */
import { Theme } from "@ContextLogic/lego";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";
import { formatDatetimeLocalized } from "@toolkit/datetime";

const EarlyPaymentDetailContainer = () => {
  const { dimenStore } = useStore();
  const { locale } = useLocalizationStore();
  const isZh = locale === "zh";
  const styles = useStylesheet();
  const { epid } = usePathParams("/merchant-early-payment-detail/:epid");

  const [paymentDetailResp] = useRequest(
    earlyPaymentApi.getEarlyPaymentDetail({ early_payment_id: epid }),
  );
  if (!paymentDetailResp?.data) {
    return (
      <div className={css(styles.loadingContainer)}>
        <LoadingIndicator type="spinner" size={70} />
      </div>
    );
  }

  const responseData = paymentDetailResp.data;
  const ep = responseData.early_payment;
  const oneoff = responseData.oneoff_payment;
  const fines = responseData.fines;
  const reimbursementOneoff = responseData.reimbursement_fee_oneoff_payment;

  const itemTitleWidth = 175;

  // if you find this please fix the any types (legacy)
  const formatDate = (datetime: any) =>
    formatDatetimeLocalized(
      momenttz.unix(moment.utc(datetime).unix()).tz("UTC"),
      isZh ? "YYYY-MM-DD" : "dddd, MMMM DD, YYYY",
    );

  /*eslint-disable local-rules/unwrapped-i18n*/
  const getTheme = (status: string): Theme => {
    switch (status) {
      case "Delaying":
        return "DarkInk";
      case "Unpaid":
        return "DarkInk";
      case "To Be Processed":
      case "In Process":
      case "Closed":
        return "WishBlue";
      case "Paid":
        return "CashGreen";
      case "Deducted":
        return "CashGreen";
      case "Cancelled":
        return "DarkRed";
      case "Pending":
        return "DarkYellow";
      case "Open":
        return "CashGreen";
      default:
        return "LightGrey";
    }
  };
  const getStatusText = (status: string): string => {
    switch (status) {
      case "Delaying":
        return isZh ? "延后" : i`Deferred`;
      case "Pending":
        return isZh ? "待定" : i`Pending`;
      case "Deducted":
        return isZh ? "已扣款" : i`Deducted`;
      case "Cancelled":
        return isZh ? "已取消" : i`Cancelled`;
      case "Paid":
        return isZh ? "已放款" : i`Paid`;
      case "Unpaid":
        return isZh ? "未放款" : i`Unpaid`;
      case "Open":
        return isZh ? "进行中" : i`Open`;
      case "Closed":
        return isZh ? "已完成" : i`Closed`;
      default:
        return status;
    }
  };
  const getFineStatusPopoverText = (status: string): string => {
    switch (status) {
      case "Delaying":
        return isZh
          ? "”延后“状态表示此项还款将在下一个结款日之后的未来某日期扣除。"
          : i`This repayment will be deducted on a future date after the next disbursement.`;
      case "Pending":
        return isZh
          ? "“待定”状态表示此还款将在下一个结款日进行扣除。"
          : i`This repayment is ready to be deducted on the next disbursement date.`;
      case "Deducted":
        return isZh
          ? "“已扣款“状态表示此还款已经被扣除。"
          : i`This repayment has been deducted.`;
      case "Cancelled":
        return isZh
          ? "”已取消“状态表示此还款已经被取消。"
          : i`This repayment deduction is cancelled.`;
      default:
        return status;
    }
  };
  const getEpStatusPopoverText = (status: string): string => {
    switch (status) {
      case "To Be Processed":
      case "In Process":
        return isZh
          ? "此项提前放款请求将在此付款周期结束时被处理。"
          : i`This Early Payment will be processed at the end of current payment cycle.`;
      case "Open":
        return isZh
          ? "此项提前放款请求已经被提交。"
          : i`This Early Payment has been requested.`;
      case "Closed":
        return isZh
          ? "此项提前放款的金额已被放款给商户，且所有还款已经扣除。"
          : i`This Early Payment amount has been disbursed and fully paid back.`;
      case "Cancelled":
        return isZh
          ? "此项提前放款请求已被取消。"
          : i`This Early Payment and its repayment deductions are cancelled.`;
      default:
        return status;
    }
  };
  const getOneoffPaidTimeSheetItem = (oneoff: earlyPaymentApi.OneoffFine) => {
    const cnPaidTitleText = oneoff.paid
      ? "已于该日期放款（UTC）"
      : "将于该日期放款（UTC）";
    const enPaidTitleText = oneoff.paid
      ? i`Paid on (UTC)`
      : i`Will be Paid on (UTC)`;
    if (isZh) {
      return (
        <SheetItem
          className={css(styles.item)}
          title={ep.status !== "Cancelled" ? cnPaidTitleText : "放款已取消"}
        >
          {ep.status !== "Cancelled" && formatDate(oneoff.pay_date)}
        </SheetItem>
      );
    }

    return (
      <SheetItem
        className={css(styles.item)}
        title={
          ep.status !== "Cancelled" ? enPaidTitleText : i`Will not be paid`
        }
      >
        {ep.status !== "Cancelled" && formatDate(oneoff.pay_date)}
      </SheetItem>
    );
  };
  const renderToBeProcesedBanner = (ep: earlyPaymentApi.EarlyPayment) => {
    if (!ep.is_processed && ep.status !== "Cancelled") {
      return (
        <Alert
          className={css(styles.alert)}
          text={
            isZh
              ? "您的提前放款请求将在当前付款周期结束前完成处理。如果您在同一付款周期中请" +
                "求了多项提前放款，仅最近一项请求将被处理。"
              : i`Your Early Payment request will be processed by the end of the ` +
                i`current payment disbursement cycle. If you submit more than one ` +
                i`Early Payment request within the same payment disbursement cycle, ` +
                i`only the latest request will be processed`
          }
          sentiment="info"
        />
      );
    }
  };
  const getFinePaidTimeSheetItem = (fine: earlyPaymentApi.OneoffFine) => {
    if (isZh) {
      return (
        <SheetItem
          className={css(styles.item)}
          title={
            ep.status !== "Cancelled" ? "于该日期扣除（UTC）" : "扣款已取消"
          }
        >
          {ep.status !== "Cancelled" && formatDate(fine.pay_date)}
        </SheetItem>
      );
    }
    return (
      <SheetItem
        className={css(styles.item)}
        title={
          ep.status !== "Cancelled"
            ? i`Deducted on (UTC)`
            : i`Will not be deducted`
        }
      >
        {ep.status !== "Cancelled" && formatDate(fine.pay_date)}
      </SheetItem>
    );
  };

  /*eslint-enable local-rules/unwrapped-i18n*/
  return (
    <div className={css(styles.root)}>
      <div className={css(styles.header)}>
        <WelcomeHeader
          title={
            isZh ? `提前放款详情 — ${epid}` : i`Early Payment Detail — ${epid}`
          }
          hideBorder
          paddingX={dimenStore.pageGuideXForPageWithTable}
        />
      </div>
      <div className={css(styles.body)}>
        <Link href="/merchant-early-payment">
          {isZh ? "回到提前放款历史记录" : i`Back to Early Payment History`}
        </Link>
        {renderToBeProcesedBanner(ep)}
        <Card
          title={isZh ? "提前放款详情" : i`Early Payment Details`}
          className={css(styles.card)}
        >
          <div className={css(styles.sheet)}>
            <div className={css(styles.sideBySide)}>
              <SheetItem
                className={css(styles.item)}
                title={isZh ? "放款金额" : i`Payment Amount`}
              >
                {formatCurrency(ep.payment_amount, ep.currency)}
              </SheetItem>
              <SheetItem
                className={css(styles.item)}
                title={isZh ? "总还款金额" : i`Total Repayment Amount`}
              >
                {formatCurrency(ep.deduction_amount, ep.currency)}
              </SheetItem>
            </div>
            <div className={css(styles.sideBySide)}>
              <SheetItem
                className={css(styles.item)}
                title={isZh ? "提前放款请求时间（UTC）" : i`Request Time (UTC)`}
              >
                {formatDate(ep.creation_time)}
              </SheetItem>
              <SheetItem
                className={css(styles.item)}
                title={isZh ? "状态" : i`Status`}
                popoverContent={getEpStatusPopoverText(ep.status)}
              >
                <ThemedLabel theme={getTheme(ep.status)} width={120}>
                  {getStatusText(ep.status)}
                </ThemedLabel>
              </SheetItem>
            </div>
            <div className={css(styles.sideBySide)}>
              <SheetItem
                className={css(styles.item)}
                title={isZh ? "每月费用率%" : i`Monthly Fee Percentage %`}
                popoverContent={
                  isZh
                    ? "提前放款功能收取的每月费用率（即所请求的提前放款金额的百分率）。"
                    : i`The percentage of the requested Early Payment amount ` +
                      i`as a monthly fee for using the Early Payment feature.`
                }
              >
                {ep.monthly_interest_rate}
              </SheetItem>
              <SheetItem
                className={css(styles.item)}
                title={isZh ? "总还款次数" : i`Total Number of Repayments`}
              >
                {ep.num_repayments}
              </SheetItem>
            </div>
            <SheetItem
              className={css(styles.item)}
              title={isZh ? "还款期限" : i`Term`}
              popoverContent={
                isZh
                  ? "所请求的提前放款金额对应的还款期限"
                  : i`The repayment term for the requested Early Payment amount`
              }
            >
              {ep.term_name}
            </SheetItem>
            {ep.note_to_merchant && (
              <SheetItem
                className={css(styles.item)}
                title={isZh ? "备注" : i`Note`}
              >
                {ep.note_to_merchant}
              </SheetItem>
            )}
            {ep.cancel_reason_to_merchant && (
              <SheetItem
                className={css(styles.item)}
                title={isZh ? "取消原因" : i`Cancel Reason`}
              >
                {ep.cancel_reason_to_merchant}
              </SheetItem>
            )}
          </div>
        </Card>
        <Card
          title={
            isZh ? "提前放款结款详情" : i`Early Payment Disbursement Details`
          }
          className={css(styles.card)}
        >
          <div className={css(styles.sideBySide)}>
            <SheetItem
              className={css(styles.item)}
              title={isZh ? "金额" : i`Amount`}
            >
              {formatCurrency(oneoff.amount, ep.currency)}
            </SheetItem>
            <SheetItem
              className={css(styles.item)}
              title={isZh ? "状态" : i`Status`}
            >
              <ThemedLabel theme={getTheme(oneoff.status)} width={120}>
                {getStatusText(oneoff.status)}
              </ThemedLabel>
            </SheetItem>
          </div>
          <div className={css(styles.sideBySide)}>
            {getOneoffPaidTimeSheetItem(oneoff)}
            {oneoff.id && (
              <SheetItem
                className={css(styles.item)}
                title={() => {
                  if (oneoff.id) {
                    return (
                      <Link
                        href={`/oneoff-payment-detail/${oneoff.id}`}
                        openInNewTab
                      >
                        {isZh ? "更多信息" : i`More info`}
                      </Link>
                    );
                  }
                }}
              />
            )}
          </div>
        </Card>
        <Card
          title={isZh ? "还款详情" : i`Repayment Details`}
          className={css(styles.card)}
        >
          {fines.map((f) => {
            return (
              <>
                <div className={css(styles.sideBySide)}>
                  <SheetItem
                    titleWidth={itemTitleWidth}
                    className={css(styles.item)}
                    title={isZh ? "金额" : i`Amount`}
                  >
                    {formatCurrency(f.amount, ep.currency)}
                  </SheetItem>
                  <SheetItem
                    titleWidth={itemTitleWidth}
                    className={css(styles.item)}
                    title={isZh ? "状态" : i`Status`}
                    popoverContent={getFineStatusPopoverText(f.status)}
                  >
                    <ThemedLabel theme={getTheme(f.status)} width={120}>
                      {getStatusText(f.status)}
                    </ThemedLabel>
                  </SheetItem>
                  {getFinePaidTimeSheetItem(f)}
                  {f.id && (
                    <SheetItem
                      titleWidth={itemTitleWidth}
                      className={css(styles.item)}
                      title={() => {
                        if (f.id) {
                          return (
                            <Link href={`/fee/${f.id}`} openInNewTab>
                              {isZh ? "更多信息" : i`More info`}
                            </Link>
                          );
                        }
                      }}
                    />
                  )}
                </div>
              </>
            );
          })}
        </Card>
        {reimbursementOneoff && (
          <Card
            title={i`Early Payment Fee Reimbursement Details`}
            className={css(styles.card)}
          >
            <div className={css(styles.sideBySide)}>
              <SheetItem className={css(styles.item)} title={i`Amount`}>
                {formatCurrency(reimbursementOneoff.amount, ep.currency)}
              </SheetItem>
              <SheetItem className={css(styles.item)} title={i`Status`}>
                <ThemedLabel
                  theme={getTheme(reimbursementOneoff.status)}
                  width={120}
                >
                  {getStatusText(reimbursementOneoff.status)}
                </ThemedLabel>
              </SheetItem>
            </div>
            <div className={css(styles.sideBySide)}>
              {getOneoffPaidTimeSheetItem(reimbursementOneoff)}
              {reimbursementOneoff.id && (
                <SheetItem
                  className={css(styles.item)}
                  title={() => {
                    return (
                      <Link
                        href={`/oneoff-payment-detail/${reimbursementOneoff.id}`}
                        openInNewTab
                      >
                        More info
                      </Link>
                    );
                  }}
                />
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const useStylesheet = () => {
  const { dimenStore } = useStore();
  const pageX = dimenStore.pageGuideXForPageWithTable;

  return StyleSheet.create({
    root: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      backgroundColor: pageBackground,
    },
    body: { padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}` },
    card: {
      marginBottom: 20,
      marginTop: 10,
    },
    sheet: {
      display: "flex",
      flexDirection: "column",
    },
    item: {
      height: 50,
      padding: "0px 20px",
      borderBottom: `1px solid ${palettes.greyScaleColors.Grey}`,
    },
    content: {
      padding: `12px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: 30,
    },
    alert: {
      marginTop: 20,
    },
    header: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingRight: `${pageX}`,
      backgroundColor: palettes.textColors.White,
    },
    sideBySide: {
      display: "flex",
      alignItems: "stretch",
      flexDirection: "row",
      flexWrap: "wrap",
      ":nth-child(1n) > div": {
        flexGrow: 1,
        flexBasis: 0,
        flexShrink: 1,
        borderRight: `1px solid ${palettes.greyScaleColors.Grey}`,
      },
    },
  });
};

export default observer(EarlyPaymentDetailContainer);
