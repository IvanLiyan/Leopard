import React, { Component } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

/* External Libraries */
import _ from "lodash";

/* Lego Components */
import { Label } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Tip } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { ThemedLabel } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import * as colors from "@toolkit/lego-legacy/DEPRECATED_colors";
import { css } from "@toolkit/styling";
import { palettes } from "@toolkit/lego-legacy/DEPRECATED_colors";
import * as illustrations from "@assets/illustrations";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

/* Toolkit */
import * as logger from "@toolkit/logger";
import { zendeskURL, zendeskCategoryURL } from "@toolkit/url";

import AppStore from "@merchant/stores/AppStore_DEPRECATED";
import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { SortOrder } from "@ContextLogic/lego";
import LocalizationStore from "@merchant/stores/LocalizationStore";

export type OrderFinesTableProps = BaseProps & {
  readonly expandedRows?: ReadonlyArray<number> | null | undefined;
  readonly onRowExpandToggled?: (
    index: number,
    shouldExpand: boolean
  ) => unknown | null | undefined;
};

type FineType = "PRODUCT" | "ORDER" | "STORE/ORDER" | "STORE";
type PolicyBadge = "NEW" | "UPDATED" | "NEITHER";
type PolicyName =
  | "manipulated_reviews_and_ratings"
  | "misleading_product"
  | "fake_tracking"
  | "late_confirmed_fulfillment"
  | "orders_from_mainland_china_not_shipped_with_wishpost"
  | "merchant_cancellation"
  | "orders_not_fulfilled_in_5_days"
  | "deceptive_fulfillment"
  | "repeat_ip_infringement"
  | "prohibited_product"
  | "modified_product"
  | "counterfeit_and/or_ip_infringement";

type FinePolicy = {
  fineType: FineType;
  policy: PolicyName;
  effective_date: number;
  fineAmount: () => string;
  disputable: boolean;
  badge: PolicyBadge;
  mixed_value: boolean;
  updated_date: number;
};

const currencyCode = "USD";

const fixedFinePolicies: ReadonlyArray<FinePolicy> = [
  {
    fineType: "PRODUCT",
    policy: "manipulated_reviews_and_ratings",
    effective_date: 1544619600,
    fineAmount: () => {
      const { locale } = LocalizationStore.instance();
      const value = 10;
      if (locale == "zh") {
        return i`每个违规订单${formatCurrency(value, currencyCode)}`;
      }
      return i`${formatCurrency(value, currencyCode)} per affected order`;
    },
    disputable: false,
    badge: "UPDATED",
    mixed_value: true,
    updated_date: 1565146800,
  },
  {
    fineType: "PRODUCT",
    policy: "misleading_product",
    effective_date: 1524007403,
    fineAmount: () => {
      const { locale } = LocalizationStore.instance();
      const value = 200;
      if (locale == "zh") {
        return (
          `若过往30天内存在订单，处以${formatCurrency(value, currencyCode)}` +
          `赔款。商户或承担此后该产品订单的100%退款责任`
        );
      }
      return (
        i`Up to ${formatCurrency(value, currencyCode)} ` +
        i`if >0 order(s) in last 30 days. Merchants may ` +
        i`be responsible for all future refunds`
      );
    },
    disputable: true,
    badge: "UPDATED",
    mixed_value: true,
    updated_date: 1565146800,
  },
  {
    fineType: "ORDER",
    policy: "fake_tracking",
    effective_date: 1529536400,
    fineAmount: () => {
      const value = 500;
      return i`Order value + ${formatCurrency(value, currencyCode)}`;
    },
    disputable: true,
    badge: "NEW",
    mixed_value: true,
    updated_date: 1529536400,
  },
  {
    fineType: "ORDER",
    policy: "late_confirmed_fulfillment",
    effective_date: 1523574800,
    fineAmount: () => {
      const value = 1;
      return i`20% of order value, or ${formatCurrency(
        value,
        currencyCode
      )}, whichever is greater`;
    },
    disputable: true,
    badge: "UPDATED",
    mixed_value: true,
    updated_date: 1562630400,
  },
];

const unfixedFinePolicies: ReadonlyArray<FinePolicy> = [
  {
    fineType: "ORDER",
    policy: "orders_from_mainland_china_not_shipped_with_wishpost",
    effective_date: 1540250000,
    fineAmount: () => {
      const value = 100;
      return i`${formatCurrency(value, currencyCode)} / order`;
    },
    disputable: false,
    badge: "UPDATED",
    mixed_value: false,
    updated_date: 1540250000,
  },
  {
    fineType: "ORDER",
    policy: "merchant_cancellation",
    effective_date: 1539818000,
    fineAmount: () => {
      const value = 2;
      return i`${formatCurrency(value, currencyCode)}`;
    },
    disputable: true,
    badge: "UPDATED",
    mixed_value: false,
    updated_date: 1539818000,
  },
  {
    fineType: "ORDER",
    policy: "orders_not_fulfilled_in_5_days",
    effective_date: 1534374800,
    fineAmount: () => {
      const value = 50;
      return i`${formatCurrency(value, currencyCode)}`;
    },
    disputable: false,
    badge: "UPDATED",
    mixed_value: false,
    updated_date: 1534374800,
  },
  {
    fineType: "STORE/ORDER",
    policy: "deceptive_fulfillment",
    effective_date: 1534288400,
    fineAmount: () => {
      const value = 10000;
      return i`${formatCurrency(value, currencyCode)}`;
    },
    disputable: true,
    badge: "UPDATED",
    mixed_value: false,
    updated_date: 1534288400,
  },
  {
    fineType: "PRODUCT",
    policy: "repeat_ip_infringement",
    effective_date: 1526340203,
    fineAmount: () => {
      const value = 500;
      return i`${formatCurrency(value, currencyCode)}`;
    },
    disputable: true,
    badge: "UPDATED",
    mixed_value: false,
    updated_date: 1526340203,
  },
  {
    fineType: "PRODUCT",
    policy: "prohibited_product",
    effective_date: 1525130000,
    fineAmount: () => {
      const fineDollarAmount1 = formatCurrency(10, currencyCode);
      const fineDollarAmount2 = formatCurrency(250, currencyCode);
      return (
        i`${fineDollarAmount1}, or ` +
        i`${fineDollarAmount2} ` +
        i`+ order value of all orders from violating product`
      );
    },
    disputable: true,
    badge: "UPDATED",
    mixed_value: false,
    updated_date: 1565146800,
  },
  {
    fineType: "PRODUCT",
    policy: "modified_product",
    effective_date: 1448925200,
    fineAmount: () => {
      const value = 20;
      return i`${formatCurrency(value, currencyCode)}`;
    },
    disputable: true,
    badge: "UPDATED",
    mixed_value: false,
    updated_date: 1565146800,
  },
  {
    fineType: "PRODUCT",
    policy: "counterfeit_and/or_ip_infringement",
    effective_date: 1398208400,
    fineAmount: () => {
      const value = 10;
      return i`${formatCurrency(value, currencyCode)}`;
    },
    disputable: true,
    badge: "UPDATED",
    mixed_value: false,
    updated_date: 1565146800,
  },
];

@observer
class FinePolicyTable extends Component<OrderFinesTableProps> {
  @observable
  currentSortOrder: SortOrder = "desc";

  @computed
  get styles() {
    return StyleSheet.create({
      root: {},
      disputeStatus: {
        margin: 20,
      },
      fineAmountTip: {
        display: "flex",
        textAlign: "left",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 4,
        backgroundColor: palettes.textColors.White,
        padding: 15,
        opacity: 1,
      },
      fineDescription: {
        fontSize: 14,
        color: colors.text,
        padding: 20,
        background: "#F6F8F9",
      },
      fineDescriptionText: {
        marginRight: 20,
        marginBottom: 20,
        marginTop: 10,
        color: colors.text,
        fontSize: 14,
      },
      descriptionTitle: {
        color: colors.text,
        fontSize: 16,
      },
      finePolicy: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
    });
  }

  renderFineType(type: string) {
    switch (type) {
      case "PRODUCT":
        return i`Product`;
      case "ORDER":
        return i`Order`;
      case "STORE":
        return i`Store`;
      case "STORE/ORDER":
        return i`Store/Order`;
    }
  }

  renderPolicy(row: FinePolicy) {
    let displayPolicy = "";
    const policy = row.policy;
    const badge = row.badge;
    const effectiveDate = row.effective_date;
    const updatedDate = row.updated_date;
    switch (policy) {
      case "manipulated_reviews_and_ratings":
        displayPolicy = i`Manipulated Reviews and Ratings`;
        break;
      case "misleading_product":
        displayPolicy = i`Misleading Product`;
        break;
      case "fake_tracking":
        displayPolicy = i`Fake Tracking`;
        break;
      case "late_confirmed_fulfillment":
        displayPolicy = i`Late Confirmed Fulfillment`;
        break;
      case "orders_from_mainland_china_not_shipped_with_wishpost":
        displayPolicy =
          i`Shipping and carrier requirements for Mainland ` +
          i`China-originating orders (exceptions included)`;
        break;
      case "merchant_cancellation":
        displayPolicy = i`Merchant Cancellation`;
        break;
      case "orders_not_fulfilled_in_5_days":
        displayPolicy = i`Orders not Fulfilled in 5 Days`;
        break;
      case "deceptive_fulfillment":
        displayPolicy = i`Deceptive Fulfillment`;
        break;
      case "repeat_ip_infringement":
        displayPolicy = i`Repeat IP Infringement`;
        break;
      case "prohibited_product":
        displayPolicy = i`Prohibited Product`;
        break;
      case "modified_product":
        displayPolicy = i`Modified Product`;
        break;
      case "counterfeit_and/or_ip_infringement":
        displayPolicy = i`Counterfeit and/or IP Infringement`;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (badge == "NEW" && currentTime - effectiveDate < 1209600) {
      return (
        // eslint-disable-next-line local-rules/use-markdown
        <div className={css(this.styles.finePolicy)}>
          {displayPolicy}
          &nbsp;&nbsp;
          <ThemedLabel theme="WishBlue" style={{ width: 18 }}>
            New
          </ThemedLabel>
        </div>
      );
    } else if (badge == "UPDATED" && currentTime - updatedDate < 1209600) {
      return (
        // eslint-disable-next-line local-rules/use-markdown
        <div className={css(this.styles.finePolicy)}>
          {displayPolicy}
          &nbsp;&nbsp;
          <ThemedLabel theme="LightInk" style={{ width: 30 }}>
            Updated
          </ThemedLabel>
        </div>
      );
    }
    return <div className={css(this.styles.finePolicy)}>{displayPolicy}</div>;
  }

  renderFineAmount(finetext: string) {
    return (
      <div className={css(this.styles.root)}>
        <Label
          text={finetext}
          popoverContent={finetext}
          popoverMaxWidth={300}
          fontSize={15}
          textColor={colors.text}
          backgroundColor="transparent"
          position="right"
        />
      </div>
    );
  }

  disputeLogClick(policy: string) {
    const { userStore } = AppStore.instance();
    if (!userStore.isSu && !userStore.loggedInMerchantUser.is_admin) {
      logger.log("FINE_POLICY_PAGE_CLICK", {
        policy_name: policy,
        action: "DISPUTE_LEARN_MORE",
      });
    }
  }

  descriptionLogClick(policy: string) {
    const { userStore } = AppStore.instance();
    if (!userStore.isSu && !userStore.loggedInMerchantUser.is_admin) {
      logger.log("FINE_POLICY_PAGE_CLICK", {
        policy_name: policy,
        action: "DESCRIPTION_LEARN_MORE",
      });
    }
  }

  renderDisputeText = (policy: string) => {
    const { userStore } = AppStore.instance();
    const accountManagerEmail = userStore.loggedInMerchantUser.bd_email;
    const mailMyManager = `mailto:${accountManagerEmail}`;
    if (policy == "misleading_product") {
      return (
        <Markdown
          text={
            i`Dispute Prohibited Product ` +
            i`infraction by providing more ` +
            i`information and submitting your product listing ` +
            i`for additional review. Learn more about the ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`dispute process [here](${zendeskURL("360006214834")}).`
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
          onLinkClicked={() => this.disputeLogClick(policy)}
        />
      );
    } else if (policy == "fake_tracking") {
      return (
        <Markdown
          text={
            i`Penalties can be disputed via the Tracking ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`Dispute tool. Click [here](${zendeskURL("115003148933")}) ` +
            i`to learn more about disputing fake tracking penalties.`
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
          onLinkClicked={() => this.disputeLogClick(policy)}
        />
      );
    } else if (policy == "late_confirmed_fulfillment") {
      const lateConfirmedUrl = zendeskURL("360002714354");
      return (
        <Markdown
          text={
            i`Penalties can be disputed via the Tracking Dispute ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`tool. Click [here](${lateConfirmedUrl}) ` +
            i`to learn more about disputing late confirmed ` +
            i`fulfillment penalties.`
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
          onLinkClicked={() => this.disputeLogClick(policy)}
        />
      );
    } else if (policy == "merchant_cancellation") {
      return (
        <Markdown
          text={
            i`Merchants are allowed to dispute the penalties within ` +
            i`3 business days after a penalty statement is generated.`
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
        />
      );
    } else if (policy == "deceptive_fulfillment") {
      return (
        <Markdown
          text={
            i`Please contact your Account Manager ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`[${accountManagerEmail}](${mailMyManager}) ` +
            i` to dispute this penalty with thorough evidence.`
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
        />
      );
    } else if (policy == "repeat_ip_infringement") {
      return (
        <Markdown
          text={
            i`Dispute individual IP / counterfeit infractions by ` +
            i`providing brand authorization. Click ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`[here](${zendeskURL("206831398")}) to learn more.`
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
          onLinkClicked={() => this.disputeLogClick(policy)}
        />
      );
    } else if (policy == "prohibited_product") {
      return (
        <Markdown
          text={
            i`Dispute Prohibited Product infraction by ` +
            i`providing more information on why the product ` +
            i`is not considered prohibited per Wish policies. `
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
        />
      );
    } else if (policy == "modified_product") {
      return (
        <Markdown
          text={
            i`Please contact your Account Manager ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`[${accountManagerEmail}](${mailMyManager}) ` +
            i`to dispute this penalty.`
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
        />
      );
    } else if (policy == "counterfeit_and/or_ip_infringement") {
      return (
        <Markdown
          text={
            i`Dispute individual IP / counterfeit infractions by ` +
            i`providing brand authorization. Click ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`[here](${zendeskURL("206831398")}) to learn more.`
          }
          className={css(this.styles.disputeStatus)}
          openLinksInNewTab
          onLinkClicked={() => this.disputeLogClick(policy)}
        />
      );
    }
    return;
  };

  renderExpandedOrder = (policy: string) => {
    if (policy == "manipulated_reviews_and_ratings") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`Orders found to be affected by manipulated, compensated, ` +
              i`or false customer reviews and/or ratings will be penalized. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${zendeskURL("360013668033")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Merchants should refrain from buying their own products or asking
            friends to buy and falsely providing positive ratings. Merchant
            shouldn't pay any entity or person to buy their products to boost
            sales, ratings, and reviews.
          </Tip>
        </div>
      );
    } else if (policy == "misleading_product") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`Merchants will be penalized if their product listings ` +
              i`misrepresent items being sold or set false expectations ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`for customers. [Learn more](${zendeskURL("360003237193")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Make sure that the title, description, price, and images used to
            advertise a product or variation clearly and accurately reflect the
            item being sold. If your product has an unreasonable price point,
            conflicting customer feedback, title and main image discrepancy,
            etc., you're at risk of violating the misleading product polcy.
          </Tip>
        </div>
      );
    } else if (policy == "fake_tracking") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`If an order is fulfilled with a fake tracking number, ` +
              i`the merchant may be subject to penalties. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${zendeskURL("360006093273")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Make sure to use legitimate and accurate tracking number when
            shipping an order. Make sure to double check customer shipping
            addresses. Shipping to the wrong location or shipping empty packages
            is considered fake tracking.
          </Tip>
        </div>
      );
    } else if (policy == "late_confirmed_fulfillment") {
      const value = 100;
      const text =
        i`If an order with (merchant price + shipping price) per item ` +
        i`< ${formatCurrency(value, currencyCode)} is not ` +
        i`confirmed shipped by the carrier within ` +
        i`168 hours from the order released time, or if an order with ` +
        i`(merchant price + shipping price) per item ≥ ` +
        i`${formatCurrency(value, currencyCode)} is not ` +
        i`confirmed shipped by the carrier within 336 hours ` +
        i`from the order released time, the merchant will be penalized. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
        i`[Learn more](${zendeskURL("360002714354")})`;

      const textCn =
        "若每件产品的（商户设定产品价格 + 商户设定运费）< " +
        formatCurrency(value, currencyCode) +
        "美元且未在订单生成后" +
        "168小时内由物流服务商确认发货，或每件产品的" +
        "（商户设定产品价格 + 商户设定运费）≥ " +
        formatCurrency(value, currencyCode) +
        "美元且未在订单生成后336小时内由物流服务商确认发货，" +
        "则商户将面临赔款。" + // eslint-disable-next-line local-rules/no-links-in-i18n
        i`[了解更多](${zendeskURL("360002714354")})`;

      let displayText = "";
      const { locale } = LocalizationStore.instance();
      if (locale == "zh") {
        displayText = textCn;
      } else {
        displayText = text;
      }

      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={displayText}
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Late orders lead to poor customer shopping experience and hurt
            overall merchant performance. To provide a better customer
            experience, ship orders as soon as possible, and use a shipping
            carrier that provides valid tracking numbers and a fast confirmation
            time.
          </Tip>
        </div>
      );
    } else if (
      policy == "orders_from_mainland_china_not_shipped_with_wishpost"
    ) {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`Orders found to have not used WishPost when ` +
              i`shipping from Mainland China will be penalized. ` +
              i`In addition, certain orders removed from the Advanced ` +
              i`Logistics Program by merchants based on qualified reasons must also ` +
              i`comply with related shipping and carrier requirements. ` +
              // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${zendeskURL("360009799633")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Make sure to utilize WishPost if shipping from Mainland China.
            Through WishPost, merchants will have the opportunity to select high
            performing shipping services, resulting in better logistics,
            positive customer experiences, and success on the Wish Platform. In
            addition, certain orders removed from the Advanced Logistics Program
            by merchants based on qualified reasons are also subject to specific
            logistics requirements; for the removed orders that require delivery
            confirmation, merchants must comply with the confirmed delivery
            timeline requirements outlined in Merchant Policy 5.4 and Merchant
            Policy 7.5.
          </Tip>
        </div>
      );
    } else if (policy == "merchant_cancellation") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`If an order is found to have been cancelled or refunded ` +
              i`prior to the confirmed fulfillment date, the merchant ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`will be penalized. [Learn more](${zendeskURL("360010281594")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Provide accurate inventory for your products in order to prevent
            cancellations due to running out of inventory. Fulfill orders within
            the acceptable 168 hour confirmed fulfillment window, and utilize
            high-quality shipping carriers to ensure packages are not damaged or
            cancelled prior to fulfillment.
          </Tip>
        </div>
      );
    } else if (policy == "orders_not_fulfilled_in_5_days") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`If an order is not fulfilled in 5 calendar days, it will ` +
              i`be refunded and the associated product may be disabled, ` +
              i`and store will be penalized. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${zendeskURL("205211407")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Fulfilling orders promptly and accurately is the number one priority
            of a merchant receiving sales. Make sure to fulfill orders as
            quickly as possible in order to provide a timely service for your
            customers.
          </Tip>
        </div>
      );
    } else if (policy == "deceptive_fulfillment") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`Merchants who are reported for and/or detected to engage ` +
              i`in deliberately deceptive fulfillment behavior are subject ` +
              i`to penalties and decreased impressions. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${zendeskURL("360008005513")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            To avoid deceptive behavior, fulfill the correct orders timely with
            accurate information and top-tier shipping carriers. Refund the
            order if unable to fulfill within 168 hours. Make sure to also
            upload information for product listings that accurately describes
            the product being sold. In addition, refrain from asking customers
            to visit stores outside of Wish.
          </Tip>
        </div>
      );
    } else if (policy == "repeat_ip_infringement") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`Merchants will be penalized if they repeatedly list products ` +
              i`that infringe on others’ intellectual property. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${zendeskCategoryURL("200474797")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Merchants are encouraged to do an IP clerance check before listing
            products. For example, check for recoginzable or blurred brand
            logos, names, tags, or labels on the product image, review the title
            and description, and utilize reverse image search to identify
            potential design patent infringements.
          </Tip>
        </div>
      );
    } else if (policy == "prohibited_product") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`Merchants are prohibited from selling certain items on Wish, ` +
              i`and will be penalized when their products are detected as ` +
              i`prohibited listings. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${zendeskURL("205211777")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Before you sell on Wish, carefully read through the list and
            examples of prohibited items (click Learn more for details), and
            refrain from selling prohibited items listed in the Wish policy.
            Wish strives to foster a healthy and safe marketplace for both our
            merchants and customers, so severe violations (such as selling
            certain high-risk categories prohibited products) of the Prohibited
            Product Listings policy may be subject to increased penalty.
          </Tip>
        </div>
      );
    } else if (policy == "modified_product") {
      const listingRelativeLink = "/policy/listing#2.6";
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`Merchants will be penalized if they update or change a ` +
              i`product listing into a new product. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${listingRelativeLink})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            When modifying product image, title, or description, make sure to be
            consistent with the original listing. If there are significant
            changes, please create a new product on your Merchant Dashboard.
          </Tip>
        </div>
      );
    } else if (policy == "counterfeit_and/or_ip_infringement") {
      return (
        <div className={css(this.styles.fineDescription)}>
          <Text weight="bold" className={css(this.styles.descriptionTitle)}>
            Description
          </Text>
          <Markdown
            className={css(this.styles.fineDescriptionText)}
            text={
              i`Merchants may be penalized for listing counterfeit products ` +
              i`or products that infringe on others' intellectual property. ` + // eslint-disable-next-line local-rules/no-links-in-i18n
              i`[Learn more](${zendeskCategoryURL("200474797")})`
            }
            openLinksInNewTab
            onLinkClicked={() => this.descriptionLogClick(policy)}
          />
          <Tip
            className={css(this.styles.root, this.props.className)}
            color={palettes.coreColors.WishBlue}
            icon="tip"
          >
            Merchants are encouraged to do an IP clearance check before listing
            products. For example, check for recognizable or blurred brand
            logos, names, tags, or labels on the product image, review the title
            and description, and utilize reverse image search to identify
            potential design patent infringements.
          </Tip>
        </div>
      );
    }
  };

  renderDisputeLabel(policy: string, disputable: boolean) {
    if (!disputable) {
      return null;
    }
    return (
      <Label
        popoverContent={() => this.renderDisputeText(policy)}
        popoverMaxWidth={300}
        backgroundColor="transparent"
        textColor={colors.text}
      >
        <img
          src={illustrations.greenCheckmark}
          className={css(this.styles.root)}
          draggable={false}
        />
      </Label>
    );
  }

  render() {
    const { className, expandedRows, onRowExpandToggled } = this.props;
    let finePolicies = [...fixedFinePolicies, ...unfixedFinePolicies];
    if (["asc", "desc"].includes(this.currentSortOrder)) {
      const sortedUnfixedFinePolicies = _.sortBy(
        unfixedFinePolicies,
        (policy) => {
          if (this.currentSortOrder == "asc") {
            return policy.effective_date;
          }
          return -1 * policy.effective_date;
        }
      );
      finePolicies = [...fixedFinePolicies, ...sortedUnfixedFinePolicies];
    }
    return (
      <Table
        className={css(this.styles.root, className)}
        data={finePolicies}
        rowExpands={() => true} // all rows expand
        expandedRows={expandedRows}
        renderExpanded={(row) => this.renderExpandedOrder(row.policy)}
        onRowExpandToggled={onRowExpandToggled}
        cellPadding="8px 14px"
        highlightRowOnHover
        cellStyle={({ row }) => {
          if (row.mixed_value) {
            return {
              background: "#F6F8F9",
            };
          }
        }}
      >
        <Table.Column
          title={i`Penalty type`}
          columnKey="fineType"
          align="left"
          minWidth={112}
        >
          {({ row }) => this.renderFineType(row.fineType)}
        </Table.Column>
        <Table.Column
          title={i`Penalty policy`}
          columnKey="policy"
          align="left"
          minWidth={320}
        >
          {({ row }) => this.renderPolicy(row)}
        </Table.Column>
        <Table.DatetimeColumn
          title={i`Effective date`}
          columnKey="effective_date"
          format="MM/DD/YYYY"
          sortOrder={this.currentSortOrder}
          onSortToggled={(newSortOrder) => {
            this.currentSortOrder = newSortOrder;
          }}
          align="right"
          minWidth={120}
        />
        <Table.Column
          title={i`Penalty amount*`}
          description={() => {
            const currencyRelativeLink = "/policy/currency";
            return (
              <Markdown
                text={
                  i`This amount may be calculated ` +
                  i`in the merchant's local currency ` +
                  i`and/or be subject to ` + // eslint-disable-next-line local-rules/no-links-in-i18n
                  i`[Merchant Policy 11](${currencyRelativeLink}).`
                }
                className={css(this.styles.fineAmountTip)}
                openLinksInNewTab
              />
            );
          }}
          columnKey="fineAmount"
          align="right"
          minWidth={240}
        >
          {({ row }) => this.renderFineAmount(row.fineAmount())}
        </Table.Column>
        <Table.Column
          title={i`Disputable?`}
          columnKey="disputable"
          align="center"
          minWidth={88}
        >
          {({ row }) => this.renderDisputeLabel(row.policy, row.disputable)}
        </Table.Column>
      </Table>
    );
  }
}

export default FinePolicyTable;
