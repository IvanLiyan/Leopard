/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL, zendeskSectionURL } from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const epcHeading =
  i`**For EPC orders released after October 9, 2019 00:00 UTC and before ` +
  i`November 2, 2020 00:00 UTC:**`;
const advancedLogisticsHeading =
  i`**For Advanced Logistics orders released after December 6, 2019 00:00 ` +
  i`UTC and before November 2, 2020 00:00 UTC:**`;
const highPerformingHeading =
  i`**For orders released after January 10, 2020 12:00AM UTC and before ` +
  i`November 2, 2020 00:00 UTC for certain high-performing products:**`;
const epcBody =
  i`For stores with Silver, Gold, or Platinum Merchant Standing ` +
  i`at the time the order is released to the merchant, EPC orders ` +
  i`may become eligible for payment ${10} calendar days after the ` +
  i`order is confirmed fulfilled by the tracking carrier. ` +
  i`[Learn more](${zendeskURL("360008230173")})`;
const advancedLogisticsBody =
  i`For stores with Silver, Gold, or Platinum Merchant Standing at the time ` +
  i`the order is released to the merchant, Advanced Logistics ` +
  i`Program orders may become eligible for payment ${10} calendar ` +
  i`days after the order is confirmed fulfilled by the tracking ` +
  i`carrier. [Learn more](${zendeskSectionURL("360006353574")})`;
const highPerformingBody =
  i`For stores with Silver, Gold, or Platinum Merchant Standing at the time ` +
  i`an order for certain high-performing products is released ` +
  i`to the merchant, the order may become eligible for payment ${15} ` +
  i`calendar days after the order is confirmed fulfilled by the ` +
  i`tracking carrier. [Learn more](${zendeskURL("360036683634")})`;

const Section2P2 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const theme = useTheme();
  const styles = useStylesheet(theme.textLight);

  return (
    <PolicySubSection
      title={i`Order Payment Eligibility`}
      subSectionNumber={`${sectionNumber}.2.2`}
      currentSection={currentSection}
    >
      <p>
        Your shipped transactions will be eligible for payment as set out below
        or as otherwise communicated to you by Wish. Without limiting any other
        remedies, Wish may unilaterally decide to delay the remittance and
        withhold any amount payable to you until receiving the confirmation of
        delivery. Transactions that cannot be confirmed as shipped either by
        your tracking data or through our internal systems may be ineligible for
        payment. Wish will pay you for your eligible transactions twice per
        month.
      </p>
      <Markdown
        className={css(styles.paragraph)}
        text={i`**For orders marked shipped before October 11, 2017:**`}
      />
      <p>
        An order is eligible for payment as soon as the tracking carrier
        confirms the order as delivered or {5} days after the customer confirms
        delivery.
      </p>
      <p>
        If the order is not confirmed delivered, then it will be eligible for
        payment {90} days after the order was marked shipped by the merchant.
      </p>
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`**For orders marked shipped between October 11, 2017 ` +
          i`and May 28, 2020 12:00 AM UTC:**`
        }
      />
      <p>
        An order is eligible for payment as soon as the tracking carrier
        confirms the order as delivered or {5} days after the customer confirms
        delivery.
      </p>
      <span>
        Orders are also eligible for payment faster depending on the tier of the
        carrier used to ship the order.
      </span>
      <ul>
        <li>
          Tier 1: as soon as tracking carrier confirms Wish Express order as
          delivered or {45} days after the order was confirmed shipped by the
          carrier
        </li>
        <li>
          Tier 2: {45} days after order was confirmed shipped with a Tier 2
          carrier
        </li>
        <li>
          Tier 3: {75} days after order was confirmed shipped with a Tier 3
          carrier
        </li>
        <li>
          Tier 4: {90} days after order was confirmed shipped with a Tier 4
          carrier
        </li>
      </ul>
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`If an order is shipped with a carrier not listed in the ` +
          i`[Routing Guide](/shipping-dest-performance#tab=routing-guide) ` +
          i`and is not confirmed delivered, it is eligible for payment ${90} ` +
          i`calendar days after the order was confirmed fulfilled by the carrier.`
        }
        openLinksInNewTab
      />

      <p>
        If the order is not confirmed shipped by the carrier, then it will be
        eligible for payment {120} days after the order was marked shipped by
        the merchant.
      </p>

      <Markdown
        className={css(styles.paragraph)}
        text={i`**For orders marked shipped on or after May 28, 2020 12:00 AM UTC:**`}
      />
      <p>
        {i`An order is eligible for payment as soon as the tracking carrier ` +
          i`confirms the order as delivered or, if the order is not subject to the ` +
          i`Confirmed Delivery Policy, ${5} calendar days after the customer confirms ` +
          i`delivery if the order is confirmed shipped by a tracking carrier within ` +
          i`${30} calendar days from when the order is released to the merchant.`}
      </p>
      <span>
        Orders are also eligible for payment faster depending on the tier of the
        carrier used to ship the order.
      </span>
      <ul>
        <li>
          Tier 1: as soon as tracking carrier confirms Wish Express order as
          delivered or {45} days after the order was confirmed shipped by the
          carrier
        </li>
        <li>
          Tier 2: {45} days after order was confirmed shipped with a Tier 2
          carrier
        </li>
        <li>
          Tier 3: {75} days after order was confirmed shipped with a Tier 3
          carrier
        </li>
        <li>
          Tier 4: {90} days after order was confirmed shipped with a Tier 4
          carrier
        </li>
      </ul>
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`If an order is shipped with a carrier not listed in the ` +
          i`[Routing Guide](/shipping-dest-performance#tab=routing-guide) ` +
          i`and is not confirmed delivered, it is eligible for payment ${90} ` +
          i`calendar days after the order was confirmed fulfilled by the carrier.`
        }
        openLinksInNewTab
      />
      <p>
        {i`Orders must be confirmed shipped by the carrier within ${30} calendar ` +
          i`days from order release date to be eligible for payment. Merchants are ` +
          i`allowed to dispute the order payment eligibility via the order tracking ` +
          i`dispute tool. The order payment eligibility can only be disputed and ` +
          i`approved within ${90} calendar days from when the order was released to ` +
          i`the merchant. If the order tracking dispute is not approved within the ` +
          i`${90} calendar day period from when the order was released to the ` +
          i`merchant, the order will not be eligible for payment.`}
      </p>
      <p>
        <Link href="/shipping-dest-performance#tab=routing-guide" openInNewTab>
          View the list of carriers per tier
        </Link>
      </p>
      <p>
        <Link href={zendeskURL("205159548")} openInNewTab>
          See examples and learn more
        </Link>
      </p>
      <Markdown
        className={css(styles.paragraph)}
        text={`${epcHeading}\n\n${epcBody}`}
        openLinksInNewTab
      />
      <Markdown
        className={css(styles.paragraph)}
        text={`${advancedLogisticsHeading}\n\n${advancedLogisticsBody}`}
        openLinksInNewTab
      />
      <Markdown
        className={css(styles.paragraph)}
        text={`${highPerformingHeading}\n\n${highPerformingBody}`}
        openLinksInNewTab
      />
      <Markdown
        className={css(styles.disclaimer)}
        text={
          i`*An order is confirmed shipped/fulfilled when the package ` +
          i`receives its first tracking scan from the carrier.*`
        }
      />
      <Markdown
        className={css(styles.disclaimer, styles.subsectionEnd)}
        text={
          i`*An order is confirmed delivered when either the ` +
          i`tracking carrier confirms delivery or the customer confirms delivery.*`
        }
      />
    </PolicySubSection>
  );
};

const useStylesheet = (textLight: string) =>
  useMemo(
    () =>
      StyleSheet.create({
        paragraph: {
          marginBottom: 10,
        },
        disclaimer: {
          marginBottom: 10,
          color: textLight,
        },
        subsectionEnd: {
          marginBottom: 0,
        },
      }),
    [textLight]
  );

export default observer(Section2P2);
