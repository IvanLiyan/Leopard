import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";
import { OrderType } from "@toolkit/orders/unfulfilled-orders";
import { zendeskURL } from "@toolkit/url";
import {
  Text,
  ThemedLabel,
  Markdown,
  Theme,
  Link,
  Layout,
} from "@ContextLogic/lego";
import { CountryCode, OrderBadge } from "@schema/types";
import { Flag, Illustration, IllustrationName } from "@merchant/component/core";
import { getCountryName } from "@toolkit/countries";
import DeliveryDeadlinePopover from "@plus/component/orders/fulfillment/icons/DeliveryDeadlinePopover";
import Ul from "@merchant/component/core/Ul";
import { useTheme } from "@stores/ThemeStore";

type Props = BaseProps & {
  readonly order: OrderType;
};

type BadgeInfo = {
  readonly icon?: IllustrationName;
  readonly country?: CountryCode | "EU" | "D";
  readonly text?: string;
  readonly popoverContent?: string | (() => React.ReactNode);
  readonly theme?: Theme;
  readonly showFullTitle?: boolean; // set true to override ellipsis and expand title
};

const OrderBadgeCell: React.FC<Props> = ({
  className,
  style,
  order: { badges, deliveryDeadline },
}: Props) => {
  const styles = useStylesheet();

  const orderBadgeMap: {
    readonly [badge in OrderBadge]: BadgeInfo;
  } = {
    FBW: {
      text: i`FBW Order`,
    },
    COMBINED: {
      text: i`Combined Order`,
    },
    LESS_THAN_TRUCK_LOAD: {
      text: i`Less-Than-Truckload`,
    },
    CHINA_POST_SUBSIDY: {
      text: i`China Post Subsidy`,
    },
    STRATEGIC_COUNTRY_REBATE: {
      text: i`Strategic Country Rebate`,
    },
    STRATEGIC_ORDER_REBATE: {
      text: i`Strategic Order Rebate`,
    },
    SE_CASHBACK: {
      text: i`SE Cashback`,
    },
    UNIFICATION_INITIATIVE: {
      text: i`Unification Initiative`,
    },
    EPC_FAST_PAYMENT: {
      text: i`EPC Fast Payment`,
    },
    APLUS_FAST_PAYMENT: {
      text: i`A+ Faster Payment Eligibility`,
    },
    PAY_CUSTOMER_VAT_REQUIRED_EU: {
      text: i`Pay Customer VAT “PC-VAT” required`,
      showFullTitle: true,
      popoverContent: () => (
        <Layout.FlexColumn className={css(styles.widePopover)}>
          <Text>
            This order bound for the European Union (EU) is required to utilize
            one of the following acceptable shipping carriers or one of the
            WishPost logistics channels that provides Delivered Duty Paid (DDP)
            service and offers support to pay Value Added Tax (VAT) and/or
            customs duties on behalf of customers. The merchant should remain
            the importer of records:
          </Text>
          <Ul className={css(styles.pcVatUl)}>
            <Ul.Li>For non-WishPost merchants:</Ul.Li>
            <Ul.Li indent={1}>
              <Link href={zendeskURL("360034845594")}>
                A list of acceptable shipping carriers that ship to the EU and
                provide DDP service
              </Link>
            </Ul.Li>
            <Ul.Li>For WishPost merchants:</Ul.Li>
            <Ul.Li indent={1}>Sunyou European Express Parcel</Ul.Li>
            <Ul.Li indent={1}>EQ-Express Parcel-HV-GC</Ul.Li>
            <Ul.Li indent={1}>EQ-Expressparcel-HV-SC</Ul.Li>
          </Ul>
          <Markdown
            text={
              i`The VAT amount collected from customers will be remitted to the merchant when ` +
              i`the merchant receives payment for this order (VAT amount will subsequently be ` +
              i`forwarded to the freight forwarder). [Learn More](${zendeskURL(
                "360034845594",
              )})`
            }
            openLinksInNewTab
          />
        </Layout.FlexColumn>
      ),
    },
    PAY_CUSTOMER_VAT_REQUIRED_UK: {
      text: i`Pay Customer VAT “PC-VAT” required`,
      showFullTitle: true,
      popoverContent: () => (
        <Layout.FlexColumn className={css(styles.widePopover)}>
          <Text>
            This order is required to utilize one of the Confirmed Delivery
            Shipping Carriers for UK-bound orders that provides Delivered At
            Place Plus (DAP+) service or one of the WishPost logistics channels
            that offer support to pay Value Added Tax (VAT) on behalf of
            customers, who will remain the importers of records:
          </Text>
          <Ul className={css(styles.pcVatUl)}>
            <Ul.Li>For non-WishPost merchants:</Ul.Li>
            <Ul.Li indent={1}>
              Please utilize one of the Confirmed Delivery Shipping Carriers for
              UK-bound orders that provides Delivered at Place Plus (DAP+).
            </Ul.Li>
            <Ul.Li>For WishPost merchants:</Ul.Li>
            <Ul.Li indent={1}>EQ-Express Parcel GC</Ul.Li>
            <Ul.Li indent={1}>EQ-Express Parcel SC</Ul.Li>
          </Ul>
          <Markdown
            text={
              i`The VAT amount collected from customers will be remitted to the merchant when ` +
              i`the merchant receives payment for this order (VAT amount will subsequently be ` +
              i`forwarded to the freight forwarder). [Learn More](${zendeskURL(
                "360034845594",
              )})`
            }
            openLinksInNewTab
          />
        </Layout.FlexColumn>
      ),
    },
    PAY_CUSTOMER_VAT_REQUIRED_LEGACY_DE: {
      text: i`Pay Customer VAT “PC-VAT” required`,
      showFullTitle: true,
      popoverContent: () => (
        <Layout.FlexColumn className={css(styles.widePopover)}>
          <Text>
            This transaction is required to utilize one of the following
            acceptable shipping carriers or WishPost Logistics channels that
            offer support to pay Value Added Tax (VAT) on behalf of customers
            (the customers remain the importers of record):
          </Text>
          <Ul className={css(styles.pcVatUl)}>
            <Ul.Li>For non-WishPost merchants:</Ul.Li>
            <Ul.Li indent={1}>DHL</Ul.Li>
            <Ul.Li indent={1}>Fedex</Ul.Li>
            <Ul.Li indent={1}>UPS</Ul.Li>
            <Ul.Li>For WishPost merchants:</Ul.Li>
            <Ul.Li indent={1}>Y-Express - General Cargo</Ul.Li>
            <Ul.Li indent={1}>Y-Express - Special Cargo</Ul.Li>
          </Ul>
          <Markdown
            text={
              i`The above -listed shipping carriers may not be required if the order’s “Origin ` +
              i`Country/Region” is set as one of the European Union countries (click “Learn ` +
              i`more” below for more details).` +
              `\n\n` +
              i`[Learn More](${zendeskURL("360034845594")})`
            }
            openLinksInNewTab
          />
        </Layout.FlexColumn>
      ),
    },
    MERCHANT_STANDING_BENEFIT: {
      text: i`Merchant Standing Benefit`,
      popoverContent: () => (
        <Markdown
          className={css(styles.popover)}
          text={
            i`**Merchant Standing Benefit**` +
            `\n\n` +
            i`As a benefit of your Merchant Standing tier, orders for this high-performing ` +
            i`product may become eligible for payment 20 calendar days after confirmed ` +
            i`fulfillment.`
          }
        />
      ),
    },
    NON_COMPLIANT_WISH_EXPRESS: {
      text: i`Non-compliant Wish Express`,
    },
    PREMIUM_SHIPPING_CARRIER_UPGRADE: {
      text: i`Premium Shipping Carrier Upgrade`,
    },
    ADVANCED_LOGISTICS: {
      text: i`Advanced Logistics Program`,
    },
    OPTIONAL_ADVANCED_LOGISTICS: {
      text: i`Optional Advanced Logistics Program `,
    },
    TRACKING_CANCELLED: {
      text: i`Tracking Number Cancelled`,
      theme: `Red`,
      popoverContent: () => (
        <Markdown
          className={css(styles.popover)}
          text={
            i`**Tracking Number Cancelled**` +
            `\n\n` +
            i`The tracking number for this order has been detected as "Cancelled". This ` +
            i`order has now been re-released for you to be fulfilled again. Please promptly ` +
            i`fulfill this order and provide a valid updated tracking number within 5 ` +
            i`calendar days from the Order Re-Release Date.` +
            `\n\n` +
            i`If the order is not fulfilled again in a timely manner with a valid updated ` +
            i`tracking number, it will be  auto-refunded and penalized $50, per Merchant ` + // eslint-disable-line local-rules/use-formatCurrency
            i`Policy 5.1. [Learn more](${zendeskURL("360056941014")})`
          }
          openLinksInNewTab
        />
      ),
    },
    TRACKING_CANCELLED_A_PLUS: {
      text: `A+ Tracking Number Cancelled`,
      theme: `Red`,
      popoverContent: () => (
        <Markdown
          className={css(styles.popover)}
          text={
            i`**A+ Tracking Number Cancelled**` +
            `\n\n` +
            i`The tracking number for this order has been detected as "Cancelled". This ` +
            i`order has now been re-released to be fulfilled again. Please promptly fulfill ` +
            i`this order and provide a new valid updated tracking number within 5 calendar ` +
            i`days from the Order Re-Released Date.` +
            `\n\n` +
            i`If the order is not fulfilled again in a timely manner with a new valid ` +
            i`updated tracking number, it will be auto-refunded and penalized $50, per ` + // eslint-disable-line local-rules/use-formatCurrency
            i`Merchant Policy 5.1. [Learn more](${zendeskURL("360056941014")})`
          }
          openLinksInNewTab
        />
      ),
    },
    CONFIRMED_DELIVERY_REQUIRED: {
      icon: "blueCheckmark",
      popoverContent: i`Confirmed delivery required`,
    },
    WISH_EXPRESS: {
      icon: "wishExpressTruck",
      popoverContent: () =>
        deliveryDeadline != null ? (
          <DeliveryDeadlinePopover
            deliveryDeadline={deliveryDeadline.mmddyyyy}
          />
        ) : undefined,
    },
    COUNTRY_BADGE_KR: {
      country: "KR",
      text: getCountryName("KR"),
    },
    COUNTRY_BADGE_NO: {
      country: "NO",
      text: getCountryName("NO"),
    },
    COUNTRY_BADGE_GB: {
      country: "GB",
      text: getCountryName("GB"),
    },
    COUNTRY_BADGE_BR: {
      country: "BR",
      text: getCountryName("BR"),
    },
    EU_VAT: {
      text: i`European Union Order`,
      showFullTitle: true,
      country: "EU",
      popoverContent: () => (
        <Layout.FlexColumn className={css(styles.widePopover)}>
          <Text
            className={css(styles.popoverText, styles.popoverBlock)}
            weight="semibold"
          >
            European Union Order
          </Text>
          <Text className={css(styles.popoverText, styles.popoverBlock)}>
            When shipping any orders bound for the European Union (EU) from
            outside of the EU AND outside of Mainland China, merchants are
            required to file additional order information (accessible via Order
            details page and API) with their shipping carriers as a part of
            customs declaration.
          </Text>
          <Layout.FlexColumn className={css(styles.popoverBlock)}>
            <Text className={css(styles.popoverText)}>
              When shipping EU-bound orders from Mainland China, merchants will
              need to ship with WishPost and may be subject to the following
              scenarios and action items:
            </Text>
            <Ul className={css(styles.popoverText, styles.popoverBlock)}>
              <Ul.Li>
                If the consignment value of the corresponding product (i.e.,
                customer-paid product price) is less than or equal to {150} EUR,
                no additional action is needed from merchants, as WishPost will
                take care of relevant logistics requirements.
              </Ul.Li>
              <Ul.Li>
                <Markdown
                  text={
                    i`If the consignment value of the corresponding product is greater than ${150} EUR, ` +
                    i`the order will also be highlighted with an additional "**Pay Customer VAT ` +
                    i`"PC-VAT" required**" flag. Merchants are required to use specific WishPost ` +
                    i`logistics channels to fulfill these orders, and may be required to file ` +
                    i`additional order information with these carriers as a part of customs ` +
                    i`declaration.`
                  }
                />
              </Ul.Li>
            </Ul>
            <Link
              openInNewTab
              className={css(styles.popoverText, styles.popoverBlock)}
              href={zendeskURL("4402433979803")}
            >
              Learn more
            </Link>
          </Layout.FlexColumn>
        </Layout.FlexColumn>
      ),
    },
    WPS_ELIGIBLE: {
      text: i`Wish Parcel`,
      popoverContent: () => (
        <Markdown
          className={css(styles.popover)}
          text={
            i`**Wish Parcel**` +
            `\n\n` +
            i`Leverage Wish Parcel to ship this order` +
            `\n\n` +
            i`- Select "Ship" from the dropdown menu in the Action columns ` +
            i`to the right.` +
            `\n\n` +
            i`- Provide necessary product logistics information.` +
            `\n\n` +
            `- Select the shipping option that best suits your needs.` +
            `\n\n` +
            i`- Download and print out the shipping label for your package.`
          }
        />
      ),
    },
  };

  const renderBadges = () => (
    <>
      {badges.map((badge) => {
        const { text, icon, country, popoverContent, theme, showFullTitle } =
          orderBadgeMap[badge];
        const flag = country != null && (
          <div className={css(styles.flagContainer)}>
            <Flag className={css(styles.flag)} countryCode={country} />
          </div>
        );
        const illustration = icon != null && (
          <Illustration className={css(styles.icon)} name={icon} alt={icon} />
        );
        const title = text != null && (
          <Text
            className={css(styles.text)}
            style={showFullTitle ? {} : { maxWidth: 122 }}
          >
            {text}
          </Text>
        );

        const classNames =
          popoverContent != null
            ? css(styles.label, styles.cursorPointer)
            : css(styles.label);

        return (
          <ThemedLabel
            className={classNames}
            key={`${country}${icon}${text}`}
            theme={theme || "LightGrey"}
            popoverContent={popoverContent}
          >
            <div className={css(styles.labelContent)}>
              {flag}
              {illustration}
              {title}
            </div>
          </ThemedLabel>
        );
      })}
    </>
  );

  return (
    <div className={css(styles.root, className, style)}>{renderBadges()}</div>
  );
};

export default observer(OrderBadgeCell);

const useStylesheet = () => {
  const { textBlack } = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          display: "flex",
          flexWrap: "wrap",
          padding: "8px 8px 0 0",
        },
        label: {
          marginLeft: 8,
          marginBottom: 8,
        },
        cursorPointer: {
          cursor: "pointer",
        },
        labelContent: {
          margin: "5px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        flagContainer: {
          height: 20,
          width: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: "50%",
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        flag: {
          height: 20,
          maxWidth: "unset",
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        icon: {
          height: 20,
          width: 20,
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        text: {
          textOverflow: "ellipsis",
          overflow: "hidden",
          fontSize: 14,
          lineHeight: "20px",
          ":not(:last-child)": {
            marginRight: 8,
          },
        },
        popover: {
          padding: 15,
          maxWidth: 250,
        },
        widePopover: {
          padding: 15,
          maxWidth: 350,
        },
        popoverText: {
          fontSize: 14,
          lineHeight: "20px",
          color: textBlack,
        },
        popoverBlock: {
          ":not(:last-child)": {
            marginBottom: 8,
          },
        },
        pcVatUl: {
          margin: "8px 0px",
        },
      }),
    [textBlack],
  );
};
