/* eslint-disable local-rules/unwrapped-i18n */
// See https://phab.wish.com/D69965 for why there's no i18n
import * as React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed } from "mobx";

/* Legacy */
import MerchantPaymentDetailModalView from "@legacy/view/modal/MerchantPaymentDetail";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { css } from "@toolkit/styling";
import * as fonts from "@toolkit/fonts";
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

import { CellInfo } from "@ContextLogic/lego";
import { LineItemsResp, LineItem } from "@merchant/api/account-balance";
import LocalizationStore from "@merchant/stores/LocalizationStore";
import UserStore from "@merchant/stores/UserStore";

export type LineItemsTableProps = BaseProps & {
  readonly data: LineItemsResp;
  readonly currency: string;
  readonly confirmed: boolean;
  readonly lineItemTypeEnum: {
    readonly [type: string]: number;
  };
  readonly fineTypeEnum: {
    readonly [type: string]: number;
  };
};

@observer
class LineItemsTable extends React.Component<LineItemsTableProps> {
  static defaultProps = {
    data: {
      fines: {},
      has_more: false,
      results: [],
      se_cash_order_info: {},
      total_count: 0,
    },
  };

  @computed
  get tableRows() {
    const { data } = this.props;
    return data.results;
  }

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      credit: {
        color: colors.palettes.greens.DarkCashGreen,
      },
      debit: {
        color: colors.palettes.reds.DarkerRed,
      },
      link: {
        cursor: "pointer",
        opacity: 1,
        color: colors.palettes.coreColors.DarkWishBlue,
        transition: "opacity 0.3s linear",
        ":hover": {
          opacity: 0.6,
        },
        fontWeight: fonts.weightSemibold,
      },
    });
  }

  renderCreditAmount = (lineItem: LineItem): React.ReactNode => {
    return lineItem.item_type <= 1000 ? (
      <div className={css(this.styles.credit)}>
        {formatCurrency(lineItem.amount, this.props.currency)}
      </div>
    ) : (
      ""
    );
  };

  renderDebitAmount = (lineItem: LineItem): React.ReactNode => {
    return lineItem.item_type > 1000 ? (
      <div className={css(this.styles.debit)}>
        {`-${formatCurrency(lineItem.amount, this.props.currency)}`}
      </div>
    ) : (
      ""
    );
  };

  renderPaymentDetailModal = (lineItem: LineItem) => {
    new MerchantPaymentDetailModalView({
      mtid: lineItem.order_id,
    }).render();
  };

  renderPaymentDetailModalLink = (lineItem: LineItem) => {
    return (
      <span
        className={css(this.styles.link)}
        onClick={() => this.renderPaymentDetailModal(lineItem)}
      >
        {lineItem.order_id}
      </span>
    );
  };

  renderLink = (
    url: string | null | undefined,
    content: string | null | undefined
  ) => {
    return (
      <Link openInNewTab href={url}>
        {content}
      </Link>
    );
  };

  renderDisputeLink = (lineItem: LineItem) => {
    return this.renderLink(
      lineItem.has_tracking_dispute
        ? `/tracking-dispute/${lineItem.dispute_id}`
        : `/dispute/${lineItem.dispute_id}`,
      lineItem.dispute_id
    );
  };

  renderTransactionLink = (lineItem: LineItem) => {
    return this.renderLink(
      `/transaction/${lineItem.order_id}`,
      lineItem.order_id
    );
  };

  renderWarningLink = (lineItem: LineItem) => {
    return this.renderLink(
      `/warning/view/${lineItem.warning_id}`,
      lineItem.warning_id
    );
  };

  thisMonth = (dateString: string) => {
    const date = new Date(dateString);
    const utcMonth = date.getUTCMonth();
    date.setMonth(utcMonth);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  renderDescription = (lineItem: LineItem): React.ReactNode => {
    const { data, confirmed, lineItemTypeEnum, fineTypeEnum } = this.props;
    const { locale } = LocalizationStore.instance();
    const { isPlusUser } = UserStore.instance();
    const isZh = locale === "zh";
    const fines = data.fines;
    const seCashOrderInfo = data.se_cash_order_info;
    const orderIdLink = `[${lineItem.order_id}](#order_id)`;
    const warningLink = `[${lineItem.warning_id}](/warning/view/${lineItem.warning_id})`;
    let disputeType = `dispute`;
    if (lineItem.has_tracking_dispute) {
      disputeType = `tracking-dispute`;
    } else if (
      lineItem.item_type == lineItemTypeEnum.REV_SHARE_ADJUST_PAYMENT
    ) {
      disputeType = `product-category-dispute`;
    }
    const disputeLink =
      `[${lineItem.dispute_id}](/` + disputeType + `/${lineItem.dispute_id})`;
    const transactionLink = `[${lineItem.order_id}](/transaction/${lineItem.order_id})`;
    const merchantPaymentIdLink = `[${lineItem.merchant_payment_id}](/payment-detail/${lineItem.merchant_payment_id})`;
    const oneoffLink = `[${lineItem.merchant_oneoff_payment_id}](/oneoff-payment-detail/${lineItem.merchant_oneoff_payment_id})`;
    const paymentLinkText = i`payment`;
    const fixDuplicateRefundLink = `[${paymentLinkText}](/oneoff-payment-detail/${lineItem.merchant_oneoff_payment_id})`;
    const fineLink = `[${lineItem.fine_id}](/fee/${lineItem.fine_id})`;
    const invoiceLink = `[${lineItem.fbw_invoice_id}](/fbw/invoice/view/${lineItem.fbw_invoice_id})`;
    const rebateLinkText = i`Rebate`;
    const rebateLink = `[${rebateLinkText}](/oneoff-payment-detail/${lineItem.merchant_oneoff_payment_id})`;
    const returnLinkText = i`View return details`;
    const returnLink = `[${returnLinkText}](/return-status/${lineItem.return_detail_id})`;
    let seCashOrderInfoLink = "";
    if (lineItem.item_type == lineItemTypeEnum.SE_CASH_BACK_REVERSE) {
      const seCashbackPaymentId =
        seCashOrderInfo[lineItem.order_id]?.se_cashback_payment_id;
      if (seCashbackPaymentId) {
        seCashOrderInfoLink = `[${seCashbackPaymentId}](/oneoff-payment-detail/${seCashbackPaymentId})`;
      }
    }
    const pBCampaignLink = `[${lineItem.campaign_id}](/product-boost/detail/${lineItem.campaign_id}#invoice)`;
    const cBCampaignLink = `[${lineItem.campaign_id}](/collection-boost/list/campaigns)`;
    switch (lineItem.item_type) {
      case lineItemTypeEnum.SHIPPED:
        if (confirmed) {
          return (
            <Markdown
              text={i`Order ${orderIdLink} became eligible for payment`}
              onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
            />
          );
        }

        return (
          <Markdown
            text={i`Order ${orderIdLink} was marked shipped`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );

      case lineItemTypeEnum.ONEOFF:
        return lineItem.note;
      case lineItemTypeEnum.WISH_PARCEL_SERVICE_ADJUST_PAYMENT:
        if (lineItem.fine_id !== undefined) {
          const localizedAmount = fines[lineItem.fine_id]?.localized_amount;
          if (localizedAmount && localizedAmount == lineItem.amount) {
            return (
              <Markdown
                text={i`Reimbursement of Wish Parcel Services shipping label fee for order ID ${orderIdLink}`}
                onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
              />
            );
          }
        }
        return (
          <Markdown
            text={i`Adjustment to the initial Wish Parcel Services shipping label fee for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.POLICY_VIOLATION_FINE:
        return `Policy Violation ${lineItem.fine_id}: ${lineItem.note}`;
      case lineItemTypeEnum.WITHHOLD_FUND_FINE:
        return lineItem.note;
      case lineItemTypeEnum.WISH_PARCEL_SERVICE_FEE:
        return (
          <Markdown
            text={i`Initial Wish Parcel Services shipping label fee for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.WISH_PARCEL_SERVICE_ADJUST_FEE:
        return (
          <Markdown
            text={i`Adjustment to the initial Wish Parcel Services shipping label fee for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.FBW_PAYMENT:
        if (lineItem.fbw_cost !== undefined) {
          return `Payment for FBW SKU ${
            lineItem.fbw_sku
          } with unit cost of ${formatCurrency(
            lineItem.fbw_cost
          )} and quantity of ${lineItem.fbw_quantity}`;
        }
      case lineItemTypeEnum.REV_SHARE_ADJUST_PAYMENT:
        return (
          <Markdown
            text={i`Reimbursement of rev share adjustment for order ${orderIdLink} related to dispute ${disputeLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.DISPUTE_APPROVED:
        return (
          <Markdown
            text={i`Dispute ${disputeLink} for order ${transactionLink} was approved`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.FINE_REVERSED:
        // display custom note for fine reversal LineItem if it exists
        if (lineItem.note) {
          return lineItem.note;
        }

        if (lineItem.fine_id && lineItem.fine_id in fines) {
          // For some fine/reversed fine line items, the related order id is
          // stored in the MerchantFine object, need to pass the order id to
          // line item.
          if (!lineItem.order_id || lineItem.order_id === "None") {
            const orderId = fines[lineItem.fine_id]?.order_id;
            if (orderId) {
              lineItem.order_id = orderId;
            }
          }
          // lineItem.order_id may have been updated
          const orderIdLinkForFine = `[${lineItem.order_id}](#order_id)`;

          switch (fines[lineItem.fine_id]?.fine_type) {
            case fineTypeEnum.LATE_CONFIRMED_FULFILLMENT:
              return (
                <Markdown
                  text={i`Late Confirmed Fulfillment penalty for order ID ${orderIdLinkForFine} was reversed`}
                  onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
                />
              );
            case fineTypeEnum.MERCHANT_CANCELLATION:
              return (
                <Markdown
                  text={i`Merchant Cancellation penalty for order ID ${orderIdLinkForFine} was reversed`}
                  onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
                />
              );
            case fineTypeEnum.FAKE_TRACKING:
              return (
                <Markdown
                  text={i`Fake Tracking Number penalty for order ID ${orderIdLinkForFine} was reversed`}
                  onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
                />
              );
            case fineTypeEnum.PROHIBITED_PRODUCT_FINE:
              return (
                <Markdown
                  text={i`Prohibited Product penalty for order ID ${orderIdLinkForFine} was reversed`}
                  onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
                />
              );
            case fineTypeEnum.IP_INFRINGEMENT:
              return (
                <div>
                  {i`IP Infringement Penalty`}{" "}
                  {this.renderLink(
                    `/penalty/${lineItem.fine_id}`,
                    lineItem.fine_id
                  )}
                  {i` was reversed`}{" "}
                </div>
              );
            case fineTypeEnum.INFRACTION:
              return (
                <Markdown
                  text={i`Penalty ${lineItem.fine_id} for infraction ${warningLink} was reversed`}
                  openLinksInNewTab
                />
              );
            case fineTypeEnum.MISLEADING_LISTING:
              return (
                <Markdown
                  text={i`Misleading Product penalty for infraction ${warningLink} was reversed`}
                  openLinksInNewTab
                />
              );

            default:
              return i`Penalty ${lineItem.fine_id} was reversed`;
          }
        } else if (lineItem.warning_id) {
          return (
            <Markdown
              text={i`Penalty ${lineItem.fine_id} for infraction ${warningLink} was reversed`}
              openLinksInNewTab
            />
          );
        } else {
          return `Penalty ${lineItem.fine_id} was reversed`;
        }

      case lineItemTypeEnum.CANCEL_WITHHOLD_PAYMENT:
        if (lineItem.dispute_id) {
          return (
            <>
              <Markdown
                text={i`Dispute ${disputeLink} was approved.`}
                openLinksInNewTab
              />
              <Markdown
                text={i`Wish is no longer withholding payment for order ${orderIdLink}`}
                onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
              />
            </>
          );
        }

        return (
          <Markdown
            text={i`Dispute approved. Wish is no longer withholding payment for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );

      case lineItemTypeEnum.PRODUCT_REBATE:
        return (
          <Markdown
            text={i`${rebateLink} for high quality products from ${lineItem.rebate_start_time} to ${lineItem.rebate_end_time}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.WITHHELD_RELEASED:
        return (
          <Markdown
            text={i`Partial payment for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.WISH_EXPRESS_REBATE:
        return (
          <Markdown
            text={i`Wish Express Cash Back for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.SE_CASH_BACK:
        return (
          <Markdown
            text={i`SE Cash Back for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.SE_CASH_BACK_REVERSE:
        return (
          <Markdown
            text={
              i`SE Cash Back for payment ${seCashOrderInfoLink} ` +
              i`is cancelled because the order ${transactionLink} is no longer qualified for SE Cash Back`
            }
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.MERCHANT_INCENTIVE:
        return (
          i`Early Payment for orders eligible for ` +
          i`Fast Shipping Incentive Program from ` +
          i`${lineItem.start_date} to ${lineItem.end_date}`
        );
      case lineItemTypeEnum.REGISTRATION_REFUND:
        return i`Return of Store Registration Fee`;
      case lineItemTypeEnum.REFUNDED:
        return (
          <Markdown
            text={i`Order ${orderIdLink} was refunded`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.PAYMENT:
        return (
          <Markdown
            text={i`Payment ${merchantPaymentIdLink} was sent to you`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.ONEOFF_FINE:
        return lineItem.note;
      case lineItemTypeEnum.LEGAL_SETTLEMENT_FINE:
        return (
          <div>
            {i`Legal hold`}{" "}
            {this.renderLink(`/penalty/${lineItem.fine_id}`, lineItem.fine_id)}
            {`: ${lineItem.note}`}
          </div>
        );
      case lineItemTypeEnum.LEGAL_SETTLEMENT_PAID_PENALTY:
        return (
          <div>
            {i`Legal hold`}{" "}
            {this.renderLink(`/penalty/${lineItem.fine_id}`, lineItem.fine_id)}
            {`: ${lineItem.note}`}
          </div>
        );
      case lineItemTypeEnum.LEGAL_SETTLEMENT_RESERVED_PENALTY:
        return (
          <div>
            {i`Legal hold`}{" "}
            {this.renderLink(`/penalty/${lineItem.fine_id}`, lineItem.fine_id)}
            {`: ${lineItem.note}`}
          </div>
        );
      case lineItemTypeEnum.INFRACTION_FINE:
        if (
          lineItem.fine_id !== undefined &&
          fines[lineItem.fine_id]?.fine_type ==
            fineTypeEnum.PROHIBITED_PRODUCT_FINE
        ) {
          return (
            <Markdown
              text={i`Prohibited Product Penalty for infraction ${warningLink}: ${lineItem.note}`}
              openLinksInNewTab
            />
          );
        } else if (
          lineItem.fine_id !== undefined &&
          fines[lineItem.fine_id]?.fine_type == fineTypeEnum.IP_INFRINGEMENT
        ) {
          return (
            <Markdown
              text={i`IP Infringement Penalty for infraction ${warningLink}: ${lineItem.note}`}
              openLinksInNewTab
            />
          );
        }

        return (
          <Markdown
            text={i`Penalty for infraction ${warningLink}: ${lineItem.note}`}
            openLinksInNewTab
          />
        );

      case lineItemTypeEnum.B2B_SALE_FEE:
        return (
          <Markdown
            text={i`B2B Sales Fee ${fineLink}: ${lineItem.note}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.WITHHOLD_PAYMENT: {
        let reason = "";
        if (lineItem.withhold_reason == 1) {
          reason = i`The product was marked as counterfeit product`;
        } else if (lineItem.withhold_reason == 3) {
          reason = i`False advertising was used for this product`;
        } else if (lineItem.withhold_reason == 4) {
          reason = i`The order was withheld for legal reasons`;
        } else if (lineItem.withhold_reason == 6) {
          reason = i`Wish Express order was delivered late`;
        } else if (lineItem.withhold_reason == 8) {
          reason = i`Order has violated the Warehouse Fulfillment Policy`;
        }

        return (
          <Markdown
            text={i`Withholding payment from order ${orderIdLink}. Reason: ${
              lineItem.id ? lineItem.id : ""
            } ${reason}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      }
      case lineItemTypeEnum.LOGISTIC_FEE:
        return (
          <Markdown
            text={i`Logistic shipping cost for shipping ${transactionLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.RETROACTIVE_REFUND_FOR_PROBLEM_PRODUCT:
        return (
          <>
            <Markdown
              text={i`Order ${orderIdLink} was refunded and the product had an extremely high refund ratio.`}
              onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
            />
            <Markdown
              text={i`See infraction ${warningLink}`}
              openLinksInNewTab
            />
          </>
        );
      case lineItemTypeEnum.RETROACTIVE_REFUND_FOR_LOW_RATED_PRODUCT:
        return (
          <>
            <Markdown
              text={i`Order ${orderIdLink} was refunded and the product had an extremely low rating.`}
              onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
            />
            <Markdown
              text={i`See infraction ${warningLink}`}
              openLinksInNewTab
            />
          </>
        );
      case lineItemTypeEnum.COUNTERFEIT_REFUND:
        return (
          <Markdown
            text={i`Order ${orderIdLink} was refunded`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.FBW_FEE:
        return (
          <Markdown
            text={i`FBW Fee for invoice ${invoiceLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.PROMOTION_FEE:
        return (
          <Markdown
            text={i`Promotion Fee (Free Gift) for Order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.OTHER_DEDUCTION:
        return (
          <>
            <Markdown
              text={i`Deducting payment for order ${orderIdLink}.`}
              onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
            />
            <Markdown
              text={i`View details: ${warningLink}`}
              openLinksInNewTab
            />
          </>
        );
      case lineItemTypeEnum.RETURN_LABEL_FEE:
        return (
          <>
            <Markdown
              text={i`Return label fee for order ${orderIdLink}.`}
              onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
            />
            <Markdown text={i`${returnLink}`} openLinksInNewTab />
          </>
        );
      case lineItemTypeEnum.PAID_PLACEMENT_ENROLLMENT_FEE:
        if (isPlusUser) {
          return (
            <div>
              Enrollment fee for boosted product. Product ID:{" "}
              {lineItem.product_boost_product_id}
            </div>
          );
        }

        return (
          <Markdown
            text={i`Enrollment fee for ProductBoost campaign ID ${pBCampaignLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.NEW_REFUNDED:
        if (
          lineItem.max_quantity !== undefined &&
          lineItem.refund_quantity !== undefined &&
          lineItem.refund_quantity < lineItem.max_quantity
        ) {
          return (
            <Markdown
              text={i`${lineItem.refund_quantity} out of ${lineItem.max_quantity} items was refunded for Order ${orderIdLink}`}
              onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
            />
          );
        }

        return (
          <Markdown
            text={i`Order ${orderIdLink} was refunded`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );

      case lineItemTypeEnum.PAID_PLACEMENT_IMPRESSION_FEE:
        if (isPlusUser) {
          return (
            <div>
              Impression fee for boosted product. Product ID:{" "}
              {lineItem.product_boost_product_id}
            </div>
          );
        }
        return (
          <Markdown
            text={i`Impression fee for ProductBoost campaign ID ${pBCampaignLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.COLLECTIONS_BOOST_CAMPAIGN_FEE:
        return (
          <Markdown
            text={i`Campaign fee for CollectionsBoost campaign ID ${cBCampaignLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.EXTERNAL_BOOST_FEE:
        return (
          <Markdown
            text={i`Campaign fee for External Boost date ${lineItem.start_date}`}
          />
        );
      case lineItemTypeEnum.EXTERNAL_BOOST_CPA_FEE:
        return (
          <Markdown
            text={i`External Boost Fee for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.MERCHANT_INCENTIVE_REVERSE:
        return (
          <div>
            {`Early Payment Deduction for Fast Shipping Incentive Program ` +
              `orders paid from ${lineItem.start_date} to ${lineItem.end_date}`}
          </div>
        );
      case lineItemTypeEnum.LATE_CONFIRMED_FULFILLMENT_FINE:
        return (
          <Markdown
            text={i`Late Confirmed Fulfillment penalty for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.DOUBLE_DEDUCTION_BOOK_KEEPER:
        return (
          <Markdown
            text={
              i`Fixing account balance caused by duplicate refund on disbursement 07/01/2017.` +
              i`The compensation has been made by ${fixDuplicateRefundLink}`
            }
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.WISH_EXPRESS_REBATE_REVERSE:
        return (
          <Markdown
            text={i`Order ${orderIdLink} was refunded and thus is not eligible for Secondary Warehouse Order Rebate`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.FAKE_TRACKING_FINE:
        return (
          <Markdown
            text={i`Fake Tracking Number penalty for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.UNFULFILLED_ORDER_FINE:
        return (
          <Markdown
            text={i`Order ${orderIdLink} was not fulfilled on time`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.PROMOTED_PRODUCT_DISABLE_FINE:
        return (
          <Markdown
            text={
              i`Promoted Product Penalty for disabling product completely or for a country, ` +
              i`see infraction ${warningLink} for details`
            }
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.LCL_FBW_FEE:
        return (
          <div>{`FBW Ocean Freight program fee ${lineItem.fine_id}: ${lineItem.note}`}</div>
        );
      case lineItemTypeEnum.DECEPTIVE_FULFILLMENT_FINE:
        return (
          <Markdown
            text={i`Deceptive Fulfillment penalty for infraction ID ${warningLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.MERCHANT_CANCELLATION_FINE:
        return (
          <Markdown
            text={i`Order ${orderIdLink} was refunded before confirmed fulfillment`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.FAKE_RATING_FINE:
        return (
          <Markdown
            text={i`Fake Rating penalty for infraction ID ${warningLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.MISLEADING_VARIATION_FINE:
        return (
          <Markdown
            text={i`Misleading variation penalty for infraction ID ${warningLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.CN_ORDER_NOT_SHIP_WITH_WISHPOST_FINE:
        return (
          <Markdown
            text={i`WishPost penalty for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.CHINA_POST_SUBSIDY:
        return (
          <Markdown
            text={i`China Post Subsidy for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.CHINA_POST_SUBSIDY_REVERSE:
        return (
          <Markdown
            text={i`Order ${orderIdLink} was refunded and thus is not eligible for China Post Subsidy`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.COVID19_SUBSIDY:
        return (
          <Markdown
            text={i`Strategic Country Rebate for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.COVID19_SUBSIDY_REVERSE:
        return (
          <Markdown
            text={i`Order ${orderIdLink} was refunded or confirmed shipped late and thus is not eligible for Strategic Country Rebate`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.STRATEGIC_ORDER_REBATE:
        return (
          <Markdown
            text={i`Strategic Order Rebate for order ID ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.STRATEGIC_ORDER_REBATE_REVERSE:
        return (
          <Markdown
            text={i`Order ${orderIdLink} was refunded or confirmed shipped late and thus is not eligible for Strategic Order Rebate`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.OVERPAY_PAYMENT_AMOUNT:
        return (
          <Markdown
            text={i`Overpayment amount in disbursement (Payment ID ${merchantPaymentIdLink})`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.UNDERPAY_PAYMENT_AMOUNT:
        return (
          <Markdown
            text={i`Underpayment amount in disbursement (Payment ID ${merchantPaymentIdLink})`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.CONSOLIDATE_MP_PAYMENT:
        return (
          <Markdown
            text={i`Consolidate merchant payment (OneOff payment ID ${oneoffLink})`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.CONSOLIDATE_MP_FINE:
        return (
          <Markdown
            text={i`Consolidate merchant penalty (Penalty ID ${fineLink})`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.PRODUCT_BOOST_BALANCE_REFUND:
        return (
          <Markdown
            text={i`Refund ProductBoost Balance (OneOff payment ID ${oneoffLink})`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.EARLY_PAYMENT:
        return (
          <Markdown
            text={`${isZh ? "提前放款" : i`Early payment`} ${oneoffLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.EARLY_PAYMENT_DEDUCTION:
        if (lineItem.fine_id !== undefined) {
          if (isZh) {
            return (
              <Markdown
                text={`提前放款扣款${fineLink}将在${
                  fines[lineItem.fine_id]?.delayed_deduction_disbursement_date
                }的结款日中扣除`}
                openLinksInNewTab
              />
            );
          }

          return (
            <Markdown
              text={i`Early payment deduction ${fineLink} to be deducted on disbursement of ${
                fines[lineItem.fine_id]?.delayed_deduction_disbursement_date
              }`}
              openLinksInNewTab
            />
          );
        }
      case lineItemTypeEnum.EARLY_PAYMENT_CANCELLATION:
        return (
          <Markdown
            text={`${
              isZh ? "取消提前放款" : i`Cancellation of Early payment`
            } [${lineItem.merchant_oneoff_payment_id}](/oneoff-payment-detail/${
              lineItem.merchant_oneoff_payment_id
            })`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.WISHPOST_ADJUSTMENT_PAYMENT:
        return (
          <Markdown
            text={i`Reimbursement update to WishPost Shipping for Order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.WISHPOST_ADJUSTMENT_DEDUCTION:
        return (
          <Markdown
            text={i`Reimbursement update to WishPost Shipping for Order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.INITIAL_WISHPOST_SHIPPING:
        return (
          <Markdown
            text={i`Reimbursement of WishPost Shipping you paid for shipping order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.PRODUCT_LISTING_FEE:
        if (lineItem.fine_id !== undefined) {
          const plpFeeStartDate = fines[lineItem.fine_id]?.plp_fee_start_date;
          if (plpFeeStartDate) {
            const productListingPlanLink = `[${this.thisMonth(
              plpFeeStartDate
            )} Charge](/product-listing-plan/dashboard?start_date=${plpFeeStartDate})`;
            return (
              <Markdown
                text={i`Listing Fee ${productListingPlanLink}`}
                openLinksInNewTab
              />
            );
          }
        }
      case lineItemTypeEnum.INITIAL_WISHPOST_SHIPPING_REFUND:
        return (
          <Markdown
            text={i`Refund of the WishPost Shipping for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.INITIAL_WISHPOST_SHIPPING_OFFSET:
        return (
          <Markdown
            text={i`Cancellation of the WishPost Shipping reimbursement for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.INITIAL_WISHPOST_SHIPPING_REFUND_OFFSET:
        return (
          <Markdown
            text={i`WishPost Shipping refund amount offset for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.ESTIMATED_WISHPOST_SHIPPING:
        return (
          <Markdown
            text={i`Estimated WishPost Shipping amount for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.ESTIMATED_WISHPOST_SHIPPING_REFUND:
        return (
          <Markdown
            text={i`Refund of the estimated WishPost Shipping amount for order ${orderIdLink}`}
            onLinkClicked={() => this.renderPaymentDetailModal(lineItem)}
          />
        );
      case lineItemTypeEnum.EARLY_PAYMENT_REIMBURSEMENT_FEE:
        return (
          <Markdown
            text={i`Reimbursement fee of Early Payment early deduction ${oneoffLink}`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.MARKETING_REBATE:
        return (
          <Markdown
            text={i`Promotional bonus for the order ${orderIdLink}.`}
            openLinksInNewTab
          />
        );
      case lineItemTypeEnum.MARKETING_REBATE_REVERSE:
        return (
          <Markdown
            text={i`Promotional bonus is cancelled because the order ${orderIdLink} is no longer qualified.`}
            openLinksInNewTab
          />
        );
    }

    return "";
  };

  render() {
    const { className } = this.props;
    return (
      <Table
        className={css(this.styles.root, className)}
        data={this.tableRows}
        noDataMessage={i`No Transactions Found`}
      >
        <Table.Column
          title={i`Date`}
          columnKey="date"
          align="left"
          width={200}
          multiline
        />

        <Table.Column
          title={i`Description`}
          columnKey="description"
          align="left"
          multiline
          handleEmptyRow
        >
          {({ row }: CellInfo<any, LineItem>) => this.renderDescription(row)}
        </Table.Column>

        <Table.Column
          title={i`Deposit/Credit`}
          columnKey="amount_credit"
          align="left"
          width={150}
          handleEmptyRow
        >
          {({ row }: CellInfo<any, LineItem>) => this.renderCreditAmount(row)}
        </Table.Column>

        <Table.Column
          title={i`Withdrawal/Debit`}
          columnKey="amount_debit"
          align="left"
          width={150}
          handleEmptyRow
        >
          {({ row }: CellInfo<any, LineItem>) => this.renderDebitAmount(row)}
        </Table.Column>
      </Table>
    );
  }
}
export default LineItemsTable;
