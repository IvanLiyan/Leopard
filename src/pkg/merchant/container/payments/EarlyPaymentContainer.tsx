import React from "react";
import { useEffect } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Legacy */
import { zendeskURL } from "@legacy/core/url";

/* Lego Components */
import { H3 } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { WelcomeHeader } from "@merchant/component/core";
import { PrimaryButton } from "@ContextLogic/lego";
import ConfirmationModal from "@merchant/component/core/modal/ConfirmationModal";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Info } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as dimen from "@toolkit/lego-legacy/dimen";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Merchant Components */
import EarlyPaymentBreakdown from "@merchant/component/payments/early-payments/EarlyPaymentBreakdown";
import RequestEarlyPaymentModal from "@merchant/component/payments/early-payment/RequestEarlyPaymentModal";

/* Merchant API */
import * as earlyPaymentsApi from "@merchant/api/early-payment";

/* Merchant Store */

/* Toolkit */
import { useLogger } from "@toolkit/logger";
import * as monitor from "@toolkit/monitor";
import { useRequest } from "@toolkit/api";
import { useLocalizationStore } from "@merchant/stores/LocalizationStore";
import { useDimenStore } from "@merchant/stores/DimenStore";
import { useUserStore } from "@merchant/stores/UserStore";
import { useNavigationStore } from "@merchant/stores/NavigationStore";

const pageBackground = colors.pageBackground;

const EarlyPaymentContainer = () => {
  const styles = useStylesheet();
  const userStore = useUserStore();
  const navigationStore = useNavigationStore();
  const { locale } = useLocalizationStore();
  const { pageGuideXForPageWithTable: pageX } = useDimenStore();

  const isZh = locale === "zh";
  const [eligibilityResponse] = useRequest(
    earlyPaymentsApi.getEligibilityForEarlyPayments()
  );
  const epStatusData = eligibilityResponse?.data;
  const notSuspended = epStatusData?.not_suspended_and_no_holds || false;
  const canSeePage = epStatusData?.can_see_page || false;
  const isMerchantOnVacation = epStatusData?.is_merchant_on_vacation || false;
  const sourceCurrency = epStatusData?.source_currency || "USD";
  const availableAmount = epStatusData?.available_ep_amount || 0;
  const isDisbDay = epStatusData?.is_disbursement_day || false;
  const closeToDisbDay = epStatusData?.close_to_disb_day || false;
  const confirmedBalance = epStatusData?.confirmed_balance || 0;
  const lowestFeeRate = epStatusData?.lowest_fee_rate || 0;
  const largestFeeRate = epStatusData?.largest_fee_rate || 0;

  const earlyPaymentsLogger = useLogger("EARLY_PAYMENT_REQUESTS");

  useEffect(() => {
    monitor.counterInc({
      monitor: "MerchantPaymentEarlyPaymentPromMon",
      metric: "early_payment_page_visit",
      labelDict: {
        locale,
      },
    });
  }, [locale]);
  if (!eligibilityResponse) {
    return (
      <div className={css(styles.loadingContainer)}>
        <LoadingIndicator type="spinner" size={70} />
      </div>
    );
  }

  const requestEarlyPaymentAlert = () => {
    earlyPaymentsLogger.info({
      merchant_user_id: userStore.loggedInMerchantUser.id,
      available_amount: availableAmount,
      is_on_vacation: isMerchantOnVacation,
      is_disbursement_day: isDisbDay,
      close_to_disb_day: closeToDisbDay,
      suspended: !notSuspended,
      confirmed_balance: confirmedBalance,
    });
    monitor.counterInc({
      monitor: "MerchantPaymentEarlyPaymentPromMon",
      metric: "request_early_payment_alert_click",
      labelDict: {
        locale,
      },
    });
    const renderRequestEarlyPaymentModal = function () {
      new RequestEarlyPaymentModal({}).render();
    };
    if (!notSuspended) {
      new ConfirmationModal(
        isZh
          ? "由于您有款项被暂扣和/或您的账号已被禁用，您现无资格请求提前放款。"
          : i`You are not eligible to request Early Payment because ` +
            i`you have payment withheld and/or your account has been disabled.`
      )
        .setHeader({
          title: isZh
            ? "款项被暂扣和/或账户被禁用"
            : i`Payments Withheld and/or Account Disabled`,
        })
        .setAction(isZh ? "关闭" : i`Close`, () => {})
        .render();
    } else if (confirmedBalance <= 0) {
      new ConfirmationModal(
        isZh
          ? "由于您账户的当前余额为负值或零，您目前并无资格请求提前放款。"
          : i`You are not eligible to request Early Payment at this time ` +
            i`because your account's Current Balance is negative or zero.`
      )
        .setHeader({
          title: isZh
            ? "账户余额为负值或零"
            : i`Negative or Zero Account Balance`,
        })
        .setCancel(isZh ? "关闭" : i`Close`)
        .setAction(isZh ? "查看账户余额" : i`See Account Balance`, () =>
          navigationStore.replace("/account-balance")
        )
        .render();
    } else if (availableAmount <= 0) {
      new ConfirmationModal(
        isZh
          ? "目前，您可请求的提前放款金额不足。鉴于可适用于提前放款的金额会随着您近期确认履行订单总成本金额而更新，" +
            "请继续履行订单，以获得更多提前放款资格。您可为未来已确认履行订单总成本的一部分金额请求提前放款。"
          : i`Currently, you do not have a sufficient amount available for requesting ` +
            i`Early Payment. As the Amount Available for Early Payment updates based on ` +
            i`the Total Cost of your recently confirmed fulfilled orders, please ` +
            i`continue to fulfill orders to be eligible for additional Early Payment. ` +
            i`You will be able to request Early Payment for up to a portion of the ` +
            i`Total Cost of your future confirmed fulfilled orders.`
      )
        .setHeader({
          title: isZh
            ? "可适用于提前放款的金额不足 "
            : i`Insufficient Amount Available for Early Payment`,
        })
        .setWidthPercentage(0.4)
        .setAction(isZh ? "关闭" : i`Close`, () => {})
        .render();
    } else if (isMerchantOnVacation) {
      new ConfirmationModal(
        isZh
          ? "您现有资格请求一项基于您近期确认履行订单总成本金额的提前放款。如需请求提前放款，请先关闭您店铺的假期模式。"
          : i`You are eligible to request an Early Payment based on the Total Cost ` +
            i`of your recently confirmed fulfilled orders. ` +
            i`To request Early Payment, turn off Vacation Mode for your store first.`
      )
        .setHeader({
          title: isZh ? "假期模式" : i`Vacation Mode`,
        })
        .setCancel(isZh ? "关闭" : i`Close`)
        .setAction(isZh ? "关闭假期模式" : i`Turn off Vacation Mode`, () => {
          window.open("/settings", "_blank");
        })
        .render();
    } else if (isDisbDay) {
      new ConfirmationModal(
        isZh
          ? "您有资格在每次结款周期中，于每个结款日（即每月1日和15日）之前请求一次提前放款。鉴于今天是结款日，请在其他日期请求提前放款。"
          : i`You are eligible to request one Early Payment per disbursement cycle ` +
            i`prior to each disbursement day (on the 1st and 15th of each month). ` +
            i`As today is a disbursement day, please ` +
            i`request an Early Payment on a different date.`
      )
        .setHeader({
          title: isZh ? "结款日" : i`Disbursement Day`,
        })
        .setAction(isZh ? "关闭" : i`Close`, () => {})
        .render();
    } else if (!closeToDisbDay) {
      new ConfirmationModal(
        isZh
          ? "您确认吗？若您在更接近下一个结款日的某时来请求提前放款，您可请求到的提前放款金额可能更大。"
          : i`Are you sure? ` +
            i`You may be able to request a larger amount of Early Payment ` +
            i`if you make the request closer to the next disbursement date.`
      )
        .setHeader({
          title: isZh ? "确认" : i`Confirmation`,
        })
        .setCancel(isZh ? "关闭" : i`Close`)
        .setAction(
          isZh ? "继续请求提前放款" : i`Continue to Request Early Payment`,
          async () => {
            await renderRequestEarlyPaymentModal();
          }
        )
        .render();
    } else {
      renderRequestEarlyPaymentModal();
    }
  };

  const logInterested = () => {
    earlyPaymentsLogger.info({
      merchant_id: userStore.loggedInMerchantUser.merchant_id,
      has_policy: false,
      type: "interested_in_enrollment",
    });
    monitor.counterInc({
      monitor: "MerchantPaymentEarlyPaymentPromMon",
      metric: "interested_in_enrollment_click",
      labelDict: {
        locale,
      },
    });
    new ConfirmationModal(
      isZh
        ? "当您的店铺有资格请求提前放款时，我们会及时通告您。在我们审核" +
          "您店铺的资格期间，请继续履行订单以更快速地获得请求提前放款的资格。"
        : i`We will let you know once your store is eligible to request Early Payments. ` +
          i`While we review your store’s eligibility, remember to continue to fulfill ` +
          i`orders to expedite your eligibility for Early Payment. `
    )
      .setHeader({
        title: isZh
          ? "感谢您对提前放款的兴趣！"
          : i`Thanks for your interest in Early Payment!`,
      })
      .setAction(i`Close`, () => {})
      .render();
  };

  if (canSeePage) {
    return (
      <div className={css(styles.root)}>
        <WelcomeHeader
          title={isZh ? "提前放款" : i`Early Payments`}
          body={() => (
            <>
              <Text weight="regular" className={css(styles.textBody)}>
                {isZh
                  ? "在此查看您的提前放款历史记录。"
                  : i`View your Early Payment history here.`}
              </Text>
              <Link
                className={css(styles.textBody)}
                openInNewTab
                href={zendeskURL("360043372513")}
              >
                <Text weight="regular">
                  {isZh ? "了解更多" : i`Learn more`}
                </Text>
              </Link>
            </>
          )}
          paddingX={pageX}
          illustration="laptopBagOfMoney"
          maxIllustrationWidth={200}
          hideBorder
        >
          <div className={css(styles.statsContainer)}>
            <div className={css(styles.column)}>
              <Text weight="medium" className={css(styles.textStatsTitle)}>
                {isZh
                  ? "可适用于提前放款的金额"
                  : i`Amount Available for Early Payment`}
              </Text>
              <Text weight="bold" className={css(styles.textStatsBody)}>
                {formatCurrency(availableAmount, sourceCurrency)}
              </Text>
            </div>
            {lowestFeeRate !== 0 && largestFeeRate !== 0 && (
              <div className={css(styles.column)}>
                <div className={css(styles.textStatsTitle)}>
                  <Text weight="medium">
                    {isZh ? "最优惠的每月费用率" : i`Best Monthly Fee Rate`}
                  </Text>
                  <Info
                    text={
                      isZh
                        ? `还款金额包含一项费用；这项费用是根据所选还款期限对应的每月费用所计算的。` +
                          `根据还款期限的不同（例如：2，3或4个月还款期限），每月费用率为${lowestFeeRate}%` +
                          `到${largestFeeRate}%不等。`
                        : i`The repayment amount includes a fee calculated based ` +
                          i`on a monthly fee for the selected repayment term. ` +
                          i`Monthly Fee Rate offers vary from ${lowestFeeRate} - ` +
                          i`${largestFeeRate}% based on the repayment term ` +
                          i`(e.g. 2, 3, 4 month terms).`
                    }
                    style={{
                      float: "left",
                      paddingRight: 4,
                      marginTop: 2,
                    }}
                    size={16}
                    position="top center"
                    sentiment="info"
                  />
                </div>
                <Text
                  weight="bold"
                  className={css(styles.textStatsBody)}
                >{`${lowestFeeRate}%`}</Text>
              </div>
            )}
          </div>
          <div className={css(styles.btnBody)}>
            <PrimaryButton
              className={css(styles.requestEpButton)}
              onClick={requestEarlyPaymentAlert}
            >
              <Text weight="semibold">
                {isZh ? "请求提前放款" : i`Request Early Payment`}
              </Text>
            </PrimaryButton>
          </div>
        </WelcomeHeader>
        <div className={css(styles.content)}>
          <EarlyPaymentBreakdown />
        </div>
      </div>
    );
  }
  const learnMoreText = i`Learn more`;
  const learnMoreLink = `[${learnMoreText}](${zendeskURL("360043372513")})`;
  return (
    <div className={css(styles.hasNoPolicyPage)}>
      <H3>{isZh ? "提前放款" : i`Early Payments`}</H3>
      <Markdown
        className={css(styles.hasNoPolicyPageTextBody)}
        text={
          isZh
            ? "有资格的商户或有机会请求收取其近期确认履行订单总成本金额的一部分作为" +
              '一项"提前放款"。请求的提前放款金额将在您的下一个结款日放款。[了解更多](${zendeskURL("360043372513")})'
            : i`Eligible merchants may request to be paid a portion of the current ` +
              i`Total Cost of their recently confirmed fulfilled orders as an Early Payment ` +
              i`included in their next payment disbursement. ${learnMoreLink}`
        }
        openLinksInNewTab
      />

      <PrimaryButton
        className={css(styles.interestedButton)}
        onClick={logInterested}
      >
        <Text weight="semibold">
          {isZh ? "我对提前放款有兴趣" : i`I am interested in Early Payment`}
        </Text>
      </PrimaryButton>
    </div>
  );
};

const useStylesheet = () => {
  const { pageGuideXForPageWithTable: pageX } = useDimenStore();

  return StyleSheet.create({
    root: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      backgroundColor: pageBackground,
    },
    content: {
      padding: `12px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
    },
    hasNoPolicyPage: {
      padding: `20px ${pageX} ${dimen.pageGuideBottom} ${pageX}`,
      display: "flex",
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: pageBackground,
    },
    textBody: {
      fontSize: 20,
      lineHeight: 1.4,
      color: colors.palettes.textColors.Ink,
      marginTop: 20,
    },
    hasNoPolicyPageTextBody: {
      padding: 20,
      fontSize: 20,
      lineHeight: 1.4,
      color: colors.palettes.textColors.Ink,
      textAlign: "center",
    },
    interestedButton: {
      /*eslint-disable-next-line local-rules/no-frozen-width*/
      width: 300,
      marginTop: 16,
      fontSize: 20,
    },
    alert: {
      marginBottom: 10,
    },
    column: {
      lineHeight: 1.4,
      flex: 0.5,
      maxWidth: "50%",
    },
    textStatsTitle: {
      fontSize: 16,
      color: colors.palettes.textColors.LightInk,
    },
    statsContainer: {
      display: "flex",
      maxWidth: 600,
      transform: "translateZ(0)",
      marginTop: 16,
    },
    textStatsBody: {
      fontSize: 20,
      color: colors.palettes.textColors.Ink,
      wordWrap: "break-word",
      userSelect: "text",
    },
    button: { fontSize: 14, marginLeft: 10 },

    rechargeBalanceTipText: {
      fontSize: 14,
      color: colors.palettes.textColors.Ink,
    },
    rechargeBalanceTip: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    btnBody: {
      backgroundColor: "#FFFFFF",
      paddingBottom: 10,
    },
    requestEpButton: {
      width: 150,
      marginTop: 16,
      fontSize: 16,
    },
    modalContent: {
      maxWidth: "100%",
      fontSize: 16,
      lineHeight: 1.5,
      color: colors.palettes.textColors.Ink,
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: 20,
    },
  });
};

export default observer(EarlyPaymentContainer);
