/* eslint-disable local-rules/unwrapped-i18n */

/* eslint-disable local-rules/use-markdown */
import React from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { LoadingIndicator } from "@ContextLogic/lego";
import { Text } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { getCountryName, CountryCode } from "@toolkit/countries";

/* Merchant API */
import * as wishExpressAPI from "@merchant/api/wish-express";

/* Toolkit */
import { zendeskURL } from "@toolkit/url";

import { BaseProps } from "@ContextLogic/lego/toolkit/react";

type WishExpressTermsOfServiceProps = BaseProps;

type TableData = {
  readonly days: number;
  readonly country: string;
};
const WishExpressTermsOfService = (props: WishExpressTermsOfServiceProps) => {
  const { className, style } = props;
  const styles = useStylesheet(props);
  const verifyAddress = zendeskURL("360011856193");

  const request = wishExpressAPI.getCountryReqList();
  const countryReqList = request.response?.data?.country_req_list;

  if (!countryReqList) {
    return <LoadingIndicator />;
  }
  const data = (Object.entries(countryReqList) as [CountryCode, number][]).map(
    (entry: [CountryCode, number]): TableData => {
      const [countryCode, deadline] = entry;
      return {
        days: deadline,
        country: `${getCountryName(countryCode)} [${countryCode}]`,
      };
    }
  );

  const deliveryTable = (
    <Table
      className={css(styles.table)}
      fixLayout
      highlightRowOnHover
      data={data}
    >
      <Table.Column
        title={i`Order's Destination Country`}
        columnKey="country"
        align="left"
      />
      <Table.Column
        title={i`Delivery Requirement (Working Days)`}
        columnKey="days"
        align="left"
      />
    </Table>
  );

  return (
    <div className={css(className, style)}>
      <Text weight="bold" className={css(styles.subHeader)}>
        1. Wish Express Overview
      </Text>
      <div>
        Wish is dedicated to improving our customers’ experiences by providing
        faster deliveries. Merchants should fulfill and deliver Wish Express
        orders within the expected time frame.
      </div>
      <div className={css(styles.standAloneText)}>
        Wish Express offers participating merchants the following benefits:
      </div>
      <div className={css(styles.bulletPoints)}>
        <div className={css(styles.bullet)}>Up to 10x more impressions</div>
        <div className={css(styles.bullet)}>
          Distinctive Wish Express badge on qualifying product listings
        </div>
        <div className={css(styles.bullet)}>
          Featured in dedicated Wish Express tabs, as well as in customers’
          search results
        </div>
        <div className={css(styles.bullet)}>Faster payment eligibility</div>
        <div className={css(styles.bullet)}>and more...</div>
      </div>
      <div>
        In order to ensure the best customer experience with Wish Express
        orders, Wish requires participating merchants and product listings to
        comply with the following policies. If participating merchant stores
        and/or product listings do not meet Wish Express requirements, they are
        subject to penalties as listed below.
      </div>
      <Text weight="bold" className={css(styles.subHeader)}>
        2. Eligible Countries
      </Text>
      <div className={css(styles.introSentence)}>
        Wish currently allows merchants to offer expedited shipping in the
        following countries (subject to change):
      </div>
      <div>
        Austria, Belgium, Brazil, Canada, Croatia, Czech Republic, Denmark,
        Finland, France, Germany, Hungary, Iceland,Ireland, Italy,
        Liechtenstein, Lithuania, Luxembourg, Mexico, Monaco, Netherlands,
        Norway, Portugal, Poland, Slovakia, Slovenia, Spain, Sweden,
        Switzerland, United Kingdom of Great Britain and Northern Ireland, and
        United States of America.
      </div>
      <Text weight="bold" className={css(styles.subHeader)}>
        3. Delivery and Fulfillment Requirements for Wish Express Orders
      </Text>
      <Markdown
        text={
          i`3.1 Wish Express Confirmed Delivery Time Requirements: ` +
          i`**5 working days** from the order released date, ` +
          i`with the following exceptions:`
        }
        openLinksInNewTab
      />
      {deliveryTable}
      <Markdown
        text={i`Wish Express On-time Arrival Rate Requirements: **95%**`}
        openLinksInNewTab
      />
      <div className={css(styles.standAloneText)}>
        A Wish Express order will not be eligible for payment if the order has
        not been confirmed delivered by the carrier before the end of the fifth
        working day after the on-time delivery requirement. For example, U.S.
        Wish Express orders must be confirmed delivered by the carrier within 10
        working days.
      </div>
      <Markdown
        text={
          i`Note that: 3.1.1 Working days are defined as Monday through Friday. ` +
          i`[USPS Postal holidays](https://about.usps.com/news` +
          i`room/events)` +
          i` and ` +
          i`[EU public holidays](https://en.wikipedia.org` +
          i`/wiki/Public_holidays_in_the_European_Union)` +
          i` are not counted as working days ` +
          i`for orders with destination
              countries of United States ` +
          i`and European Union` +
          i` (EU), respectively.`
        }
        style={{ marginBottom: 10 }}
        openLinksInNewTab
      />
      <Markdown
        text={
          i`3.1.2 Wish Express On-time Arrival` +
          i` Orders are defined as Wish
              Express ` +
          i`orders that are confirmed delivered by` +
          i` the carrier ≤ 5
              working days from order released date, unless ` +
          i`delivery requirement
              specified otherwise. ` +
          i`Wish Express On-time Arrival ` +
          i`Rate is defined
              as the percentage of Wish Express orders which are` +
          i` delivered on
              time over total Wish Express orders` +
          i` in the measurement period,` +
          i` and
              is measured on a per-country basis.`
        }
        style={{ marginBottom: 10 }}
        openLinksInNewTab
      />
      <Markdown
        text={
          i`3.1.3 In cases when the merchant requests that the customer verify his` +
          i` or her shipping address for an order through the` + // eslint-disable-next-line local-rules/no-links-in-i18n
          i` [“Verify Address” feature](${verifyAddress}) the delivery requirement may be ` +
          i`extended by 48 working hours.`
        }
        style={{ marginBottom: 10 }}
        openLinksInNewTab
      />
      <div className={css(styles.standAloneText)}>
        <Markdown
          text={
            i`3.2 All Wish Express orders must be fulfilled in 5 calendar days. ` +
            i`If a Wish Express order is not fulfilled in **5 calendar days**, ` +
            i`it will be refunded automatically and the associated product may ` +
            i`be disabled; the merchant will also be penalized ${formatCurrency(
              50,
              "USD"
            )}` +
            i` per auto-refunded order.`
          }
          openLinksInNewTab
        />
      </div>
      <div className={css(styles.introSentence)}>
        <Markdown
          text={
            i`Note that all orders, including Wish Express ones, are also subject to ` +
            i` Late Confirmed Fulfillment Policy 5.5, which states that "if an order is ` +
            i`not confirmed shipped by the carrier within 168 hours of the time the order ` +
            i`is released, then the merchant will be penalized ${"20%"} of the order value, or ` +
            i`${formatCurrency(
              1,
              "USD"
            )}, whichever is greater." This policy is only applicable to confirmed ` +
            i`fulfilled orders where the merchant price per item plus the shipping price ` +
            i`per item is less than ` +
            i`${formatCurrency(
              100,
              "USD"
            )}. However, if a Wish Express order is confirmed delivered by the ` +
            i`carrier within the required arrival time frame, the penalty will be reversed.`
          }
          openLinksInNewTab
        />
        <Link href="/policy/fulfillment#5.5" openInNewTab>
          Learn more here
        </Link>
      </div>
      <div className={css(styles.introSentence)}>
        <Markdown
          text={
            i`Orders refunded due to the merchant being unable to fulfill the ` +
            i`order are considered **pre-fulfillment cancellation**, ` +
            i`which includes both auto-refunded orders due to late fulfillment **and** ` +
            i`merchant-initiated  cancellation and/or refunds prior to fulfillment ` +
            i`due to merchant’s inability to fulfill for any reason. Note that in ` +
            i`the latter situation, merchant will be penalized ${formatCurrency(
              2,
              "USD"
            )} ` +
            i`per violating order, per Wish’s ` + // eslint-disable-next-line local-rules/no-links-in-i18n
            i`[Order Cancellation Penalty Policy](/policy/fulfillment#5.9).`
          }
          openLinksInNewTab
        />
      </div>
      <div className={css(styles.introSentence)}>
        Pre-Fulfillment Cancellation Rate is defined as the percentage of Wish
        Express orders which are pre-fulfillment cancellations over total Wish
        Express orders in the measurement period (see section 4 below for
        details on measurement period), and is measured on a per-country basis.
      </div>
      <Markdown
        text={i`Wish Express Pre-Fulfillment Cancellation Rate Requirements: < **5%**`}
      />
      <Text weight="bold" className={css(styles.subHeader)}>
        4. Penalty Policies for Wish Express Orders
      </Text>
      <Text weight="bold" className={css(styles.subHeader)}>
        4.1 Suspension Policy for Wish Express Orders
      </Text>
      <div>
        4.1.1 The Suspension Policy measures Wish Express orders weekly, from
        Monday through Sunday.
      </div>
      <div>
        4.1.2 A merchant account will be suspended from Wish Express in the
        destination countries where its On-Time Arrival Rate is under 90% and/or
        the Pre-Fulfillment Cancellation Rate is ≥ 10% for the most recent
        measurement period. In both situations, merchants will receive an
        infraction warning on the suspension. Merchants may file disputes in
        response to the suspension within 11 calendar days from receiving the
        infraction details.
      </div>
      <div>
        4.1.3 If a merchant account has previously been suspended three times by
        the Suspension Policy for U.S. Wish Express, or five times for non-U.S.
        Wish Express, the merchant account will be permanently removed from Wish
        Express in the corresponding country/countries.
      </div>
      <div>
        4.1.4 The policy will be executed on a per-country level. Merchants will
        apply to and/or be suspended for each Wish Express destination country
        individually.
      </div>
      <div>
        4.1.5 Merchant can re-apply for Wish Express immediately after
        suspension, unless they exceed the allowed number of suspensions
      </div>
      <Text weight="bold" className={css(styles.subHeader)}>
        4.2 Penalties Policy for Non-Compliant Wish Express orders
      </Text>
      <div>
        4.2.1 All Wish Express orders that are not confirmed delivered by
        carriers before the end of the fifth working day after the on-time
        delivery requirement from order released date will not be eligible for
        payment.
      </div>
      <div className={css(styles.standAloneText)}>
        <Markdown
          text={
            i`4.2.2 The Penalties Policy measures Wish Express orders weekly, from ` +
            i`Monday through Sunday. Late delivery orders will be penalized by ${"20%"} of ` +
            i`the order value or ${formatCurrency(
              5,
              "USD"
            )}, whichever is greater. For confirmed shipped ` +
            i`US orders, a flat exemption of ${"1%"} Wish Express Total Order Value will be ` +
            i`applied. For the confirmed shipped orders to the rest of the countries, ` +
            i`a flat exemption of ${"2%"} of Wish Express Total Order Value will be applied ` +
            i`and calculated on a per-country basis. Merchants will be subject to ` +
            i`Late Confirmed Fulfillment Policy 5.5 and penalized for all orders not ` +
            i`confirmed shipped by carrier ` +
            i`within 168 hours. Note that this policy is only applicable to confirmed ` +
            i`fulfilled orders where the merchant price per item plus the shipping ` +
            i`price per item is less than ${formatCurrency(
              100,
              "USD"
            )}; the penalty is reversible upon ` +
            i`confirmed delivery by the carrier within required Wish Express delivery ` +
            i`time frame. For Pre-Fulfillment Cancellations, merchants will also be ` +
            i`penalized ${formatCurrency(
              50,
              "USD"
            )} per auto-refunded order not fulfilled within ${5} calendar ` +
            i`days, and ${formatCurrency(
              2,
              "USD"
            )} per violating order for merchant-initiated cancellation ` +
            i`and/or refunds prior to fulfillment due to merchant’s inability to ` +
            i`fulfill for any reason, per Wish Fulfillment Policy.`
          }
          openLinksInNewTab
        />

        <Link href="/policy/fulfillment#5.5" openInNewTab>
          Learn about Late Confirmed Fulfillment Policy 5.5
        </Link>
        <Link href="/policy/fulfillment" openInNewTab>
          Learn about Fulfillment Policy
        </Link>
      </div>
      <Markdown
        text={
          i`4.2.3 Merchants may file disputes for ` +
          i`non-compliant orders within ${11} calendar days from receiving ` +
          i`the Penalty details, with the exception that the penalties for ` +
          // eslint-disable-next-line local-rules/no-links-in-i18n
          i`[Late Confirmed Fulfillment Policy 5.5](/policy/fulfillment#5.5), ` +
          i`which can only be disputed and approved within ${90} days ` +
          i`from when the penalty was created.`
        }
        openLinksInNewTab
      />
      <div className={css(styles.standAloneText)}>
        4.2.4 Orders confirmed fulfilled by 23:59:59 UTC of the next working day
        from order released date, and fulfilled through specific qualified
        carriers, will be excluded from the penalty. Specific qualified carriers
        that will be excluded from the penalty include:
      </div>
      <Table className={css(styles.table)} fixLayout highlightRowOnHover>
        <Table.FixtureColumn title={i`Destination Country/Region`} />
        <Table.FixtureColumn title={i`Carriers`} />
        <Table.FixtureColumn title={i`Service Levels`} />
        <Table.FixtureRow>
          <Table.FixtureCell>United States</Table.FixtureCell>
          <Table.FixtureCell>USPS</Table.FixtureCell>
          <Table.FixtureCell>First-class packages</Table.FixtureCell>
        </Table.FixtureRow>
        <Table.FixtureRow>
          <Table.FixtureCell>United States</Table.FixtureCell>
          <Table.FixtureCell>USPS</Table.FixtureCell>
          <Table.FixtureCell>Priority Mail</Table.FixtureCell>
        </Table.FixtureRow>
        <Table.FixtureRow>
          <Table.FixtureCell>European Union</Table.FixtureCell>
          <Table.FixtureCell>DPD</Table.FixtureCell>
          <Table.FixtureCell>All</Table.FixtureCell>
        </Table.FixtureRow>
        <Table.FixtureRow>
          <Table.FixtureCell>European Union</Table.FixtureCell>
          <Table.FixtureCell>DHLGermany</Table.FixtureCell>
          <Table.FixtureCell>All</Table.FixtureCell>
        </Table.FixtureRow>
        <Table.FixtureRow>
          <Table.FixtureCell>European Union</Table.FixtureCell>
          <Table.FixtureCell>Colissimo</Table.FixtureCell>
          <Table.FixtureCell>All</Table.FixtureCell>
        </Table.FixtureRow>
        <Table.FixtureRow>
          <Table.FixtureCell>European Union</Table.FixtureCell>
          <Table.FixtureCell>GLS</Table.FixtureCell>
          <Table.FixtureCell>BusinessParcel</Table.FixtureCell>
        </Table.FixtureRow>
        <Table.FixtureRow>
          <Table.FixtureCell>European Union</Table.FixtureCell>
          <Table.FixtureCell>GLS</Table.FixtureCell>
          <Table.FixtureCell>BusinessSmallParcel</Table.FixtureCell>
        </Table.FixtureRow>
        <Table.FixtureRow>
          <Table.FixtureCell>European Union</Table.FixtureCell>
          <Table.FixtureCell>Hermes</Table.FixtureCell>
          <Table.FixtureCell>All</Table.FixtureCell>
        </Table.FixtureRow>
        <Table.FixtureRow>
          <Table.FixtureCell>European Union</Table.FixtureCell>
          <Table.FixtureCell>Yodel</Table.FixtureCell>
          <Table.FixtureCell>All</Table.FixtureCell>
        </Table.FixtureRow>
      </Table>
      Note that:
      <div className={css(styles.standAloneText)}>
        Non-compliant Wish Express orders are defined as orders that are not
        confirmed delivered by carriers ≤ 5 working days (unless specified
        otherwise for destination country and/or 48 working hours extension due
        to &nbsp;
        <Link href={verifyAddress} openInNewTab>
          "Verify Address"
        </Link>
        &nbsp; request) from order released date, as well as orders that are not
        fulfilled within 5 calendar days and/or confirmed shipped by the carrier
        within 168 hours. A Pre-Fulfillment Cancellation Rate ≥ 10% during the
        most recent measurement period is also considered non-compliant. These
        non-compliant orders are subject to distinct penalty types and Wish
        policies, and can accumulate independently from each other.
      </div>
      <Text weight="bold" className={css(styles.subHeader)}>
        4.3 Refund Responsibility
      </Text>
      <div>
        4.3.1 If a Wish Express order violates the Wish Express Delivery
        Requirement and is refunded for any reason, the merchant is responsible
        for 100% of the cost of a refund on that order. See “3. Delivery and
        Fulfillment Requirements for Wish Express Orders” for more information
        on the Wish Express Delivery and Fulfillment Requirement.
      </div>
      <Text weight="bold" className={css(styles.subHeader)}>
        5. Examples
      </Text>
      <div className={css(styles.introSentence)}>
        5.1 During April 2018, the on-time arrival rate of the Wish Express
        orders through recommended shipping carriers was 97%.
      </div>
      <div>
        5.2 100 U.S. Wish Express orders were released to Merchant A during July
        9, 2018 - July 15, 2018, with total order value of $2000 . 4 orders
        didn't meet the on-time arrival requirement:
      </div>
      <div className={css(styles.bulletPoints)}>
        <div className={css(styles.bullet)}>
          non-compliant order 1, delivery time is 6 working days, order value =
          $10;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 2, delivery time is 7 working days, order value =
          $20;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 3, delivery time is 8 working days, order value =
          $30;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 4, delivery time is 11 working days, order value =
          $40;
        </div>
      </div>
      <div className={css(styles.standAloneText)}>
        Merchant A’s U.S. Wish Express on-time arrival rate during this
        measurement period is 96%, which met the Wish Express On-Time Arrival
        Rate requirement. The merchant will be able to continue operating in the
        U.S. Wish Express program.
      </div>
      <div className={css(styles.introSentence)}>
        However, the merchant will be penalized for the non-compliant orders:
      </div>
      <div className={css(styles.bulletPoints)}>
        <div className={css(styles.bullet)}>
          the merchant will be subject to a penalty amount of $5 for the
          non-compliant orders 1 and 2, $6 for order 3, and $8 for order 4.
          After a flat exemption of $2000 * 1% = $20, the merchant will be
          penalized ($5+$5+$6+$8) - $20 = $4 for the non-compliant U.S. Wish
          Express orders during the measurement period July 9, 2018 - July 15,
          2018.
        </div>
        <div className={css(styles.bullet)}>
          the non-compliant order 4 is not eligible for payment because it was
          confirmed delivered more than 10 working days from order released
          date.
        </div>
      </div>
      <div className={css(styles.standAloneText)}>
        Customers also requested refund on the non-compliant order 3 and 4 and
        Wish approved the refund requests after review. For the order 3, in
        addition to $6 penalty, the order is not eligible for payment. For the
        order 4, the $8 penalty still applies, and the order is already not
        eligible for payment because it was confirmed delivered more than 10
        working days from order released date.
      </div>
      <div>
        5.3 100 U.S. Wish Express orders and 100 FR Wish Express were released
        to Merchant B during July 9, 2018 - July 15, 2018, with U.S. total order
        value of $2000 and FR total order value of $2500. 7 orders didn't meet
        the on-time arrival requirement:
      </div>
      <div className={css(styles.bulletPoints)}>
        <div className={css(styles.bullet)}>
          non-compliant order 1, destination U.S., delivery time is 6 working
          days, order value = $20;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 2, destination U.S., delivery time is 7 working
          days, order value = $30;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 3, destination U.S., delivery time is 8 working
          days, order value = $40;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 4, destination U.S. , delivery time is 11 working
          days, order value = $50;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 5, destination FR, delivery time is 8 working
          days, order value = $30;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 6, destination FR, delivery time is 9 working
          days, order value = $40;
        </div>
        <div className={css(styles.bullet)}>
          non-compliant order 7, destination FR, delivery time is 12 working
          days, order value = $50;
        </div>
      </div>
      <div className={css(styles.introSentence)}>
        Merchant B’s U.S. Wish Express on-time arrival rate during this
        measurement period is 96%, which met the Wish Express On-Time Arrival
        Rate requirement. The merchant will be able to continue operating in the
        U.S. Wish Express program.
      </div>
      <div className={css(styles.introSentence)}>
        Merchant B’s FR Wish Express on-time arrival rate during this
        measurement period is 97%, which met the Wish Express On-Time Arrival
        Rate requirement. The merchant will be able to continue operating in the
        FR Wish Express program.
      </div>
      <div className={css(styles.introSentence)}>
        However, the merchant will be penalized for the non-compliant orders:
      </div>
      <div className={css(styles.bulletPoints)}>
        <div className={css(styles.bullet)}>
          the merchant will be subject to a penalty of $5 for non-compliant
          order 1, $6 for order 2, $8 for order 3, and $10 for order 4. After a
          flat exemption of $2000 * 1% = $20 for confirmed shipped orders to
          U.S., the merchant will be penalized ($5+$6+$8+$10) - $20 = $9 for the
          non-compliant U.S. Wish Express orders during the measurement period
          July 9, 2018 - July 15, 2018.
        </div>
        <div className={css(styles.bullet)}>
          the merchant will be subject to a penalty of $6 for order 5, $8 for
          order 6, $10 for order 7. After a flat exemption of $2500 * 2% = $50
          for confirmed shipped orders to U.S., because ($6+$8+$10) &lt; $50,
          the merchant will not be penalized for the non-compliant FR Wish
          Express orders during the measurement period July 9, 2018 - July 15,
          2018.
        </div>
        <div className={css(styles.bullet)}>
          the non-compliant order 4 (destination U.S.) is not eligible for
          payment because it was confirmed delivered more than 10 working days
          from order released date
        </div>
        <div className={css(styles.bullet)}>
          the non-compliant order 7 (destination FR) is not eligible for payment
          because it was confirmed delivered more than 11 working days from
          order released date
        </div>
      </div>
      <div className={css(styles.standAloneText)}>
        5.4 From Feb. 11, 2019 to Feb. 17, 2019, Merchant C received 25 FR Wish
        Express orders, and another 25 U.S. Wish Express orders. 5 FR order and
        1 U.S. order are pre-fulfillment cancellations:
      </div>
      <div className={css(styles.bulletPoints)}>
        <div className={css(styles.bullet)}>
          Order 1, destination FR, not fulfilled in 5 calendar days, and
          therefore auto-refunded.
        </div>
        <div className={css(styles.bullet)}>
          Order 2, destination FR, not fulfilled in 5 calendar days, and
          therefore auto-refunded.
        </div>
        <div className={css(styles.bullet)}>
          Order 3, destination FR, not fulfilled in 5 calendar days, and
          therefore auto-refunded.
        </div>
        <div className={css(styles.bullet)}>
          Order 4, destination FR, cancelled and refunded by merchants in 2
          working days due to store’s inability to ship.
        </div>
        <div className={css(styles.bullet)}>
          Order 5, destination FR, cancelled and refunded by merchants in 2
          working days due to store’s inability to ship.
        </div>
        <div className={css(styles.bullet)}>
          Order 1, destination U.S., not fulfilled in 5 calendar days, and
          therefore auto-refunded.
        </div>
        <div className={css(styles.bullet)}>
          All fulfilled orders arrive on time based on Wish Express Confirmed
          Delivery Policy (within 6 working days for France and 5 working days
          for the United States).
        </div>
      </div>
      <div className={css(styles.standAloneText)}>
        The Wish Express weekly Pre-Fulfillment Cancellation Rate of Merchant C
        during this measurement period is (3+2)/25 = 20% for FR Wish Express,
        which is above the 10% threshold for account suspension for FR Wish
        Express. Merchant C will receive an infraction, and account will be
        suspended from shipping Wish Express to France. In addition, Merchant C
        will also receive the following penalties for non-compliant FR Wish
        Express orders:
      </div>
      <div className={css(styles.bulletPoints)}>
        <div className={css(styles.bullet)}>
          $50 penalty per auto-refund for the 3 orders shipped to France, which
          is a total of $50 * 3 = $150.
        </div>
        <div className={css(styles.bullet)}>
          $2 per merchant-cancelled / refunded order prior to fulfillment, which
          is a total of $2 * 2 = $4.
        </div>
      </div>
      <div className={css(styles.standAloneText)}>
        In contrast, Merchant C’s weekly Pre-Fulfillment Cancellation Rate for
        Wish Express orders shipped to the U.S. during this time period is 1/25
        = 4%, which is in compliance with Wish Express Pre-Fulfillment
        Cancellation Rate Requirement. Merchants will not be suspended from
        shipping Wish Express to the United States, but will be penalized $50
        for the 1 auto-refund due to late fulfillment. No late arrival penalty
        is applicable, as all fulfilled orders are confirmed delivered on time.
      </div>
    </div>
  );
};

export default observer(WishExpressTermsOfService);

const useStylesheet = (props: WishExpressTermsOfServiceProps) =>
  StyleSheet.create({
    subHeader: {
      fontSize: 20,
      marginBottom: 10,
      marginTop: 30,
    },
    sentenceInParagraph: {
      paddingTop: 25,
      marginBottom: 25,
    },
    subParagraphs: {
      display: "flex",
      flexDirection: "column",
      marginBottom: 25,
    },
    standAloneText: {
      marginBottom: 10,
      marginTop: 10,
    },
    introSentence: {
      marginBottom: 10,
    },
    table: {
      borderCollapse: "collapse",
      marginBottom: 25,
      marginTop: 25,
      width: "100%",
    },
    bulletPoints: {
      display: "flex",
      flexDirection: "column",
      marginLeft: 20,
    },
    bullet: {
      display: "list-item",
      listStyleType: "disc",
      listStylePosition: "inside",
    },
  });
