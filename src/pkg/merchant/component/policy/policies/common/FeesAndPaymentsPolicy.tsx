/* eslint-disable local-rules/unnecessary-list-usage */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import Section2P2Latest from "@merchant/component/policy/policies/latest/fees-and-payments/Section2P2";
import Section2P3Latest from "@merchant/component/policy/policies/latest/fees-and-payments/Section2P3";
import Section2P4Latest from "@merchant/component/policy/policies/latest/fees-and-payments/Section2P4";
import Section2P2Archive from "@merchant/component/policy/policies/archive/fees-and-payments/Section2P2";
import Section2P3Archive from "@merchant/component/policy/policies/archive/fees-and-payments/Section2P3";
import Section2P4Archive from "@merchant/component/policy/policies/archive/fees-and-payments/Section2P4";

const wishLocalText =
  i`If you are a Wish Local Retailer, please refer to ` +
  i`[Merchant Policy 9.3](${"#9.3"}) below for the Fees and Payments ` +
  i`terms related to your agreement with Wish.`;

const wishLocalMarkdown = `&ast; *${wishLocalText}*`;

const FeesAndPaymentsPolicy = ({
  className,
  sectionNumber,
  version,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();
  const subsectionEndClass = css(styles.subsectionEnd);

  return (
    <PolicySection
      className={className}
      name="fees_and_payments"
      title={i`Fees and Payments`}
      sectionNumber={sectionNumber}
      dateUpdated={i`November 2, 2020`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      <PolicySubSection>
        <Markdown text={wishLocalMarkdown} />
      </PolicySubSection>
      <PolicySubSection
        title={i`Fees:`}
        subSectionNumber={`${sectionNumber}.1`}
        currentSection={currentSection}
      >
        <p>
          Depending on the terms noted within the merchant’s Wish account or the
          terms of any other agreement the merchant may have with Wish, Wish
          will either take a percentage or a set amount of the list price
          provided to Wish by the merchant when an item sells.
        </p>
        <p>
          Should the merchant use additional services or product features
          related to the sales of items through or in connection with Wish’s
          services (e.g., ProductBoost, Fulfillment By Wish, etc.), these
          services or product features may be subject to certain additional or
          different fees as communicated by Wish. In the event Wish introduces a
          new service or product feature related to the sales of items through
          or in connection with Wish’s services, the fees for that service or
          product feature will be effective upon the launch of the service or
          product feature.
        </p>
        <Markdown
          className={css(styles.paragraph)}
          text={
            i`All fees are quoted in the manner described in ` +
            i`[Merchant Policy 11 - Currency](${"#currency"}).`
          }
        />
        <p>
          In certain situations, including but not limited to a void or invalid
          transaction, Wish may issue a debit to a merchant’s billing statement
          for the applicable fees.
        </p>
        <p className={subsectionEndClass}>
          Except as set forth in the Merchant Terms of Service or the Tax
          Policy, you are responsible for paying all fees and applicable taxes
          associated with using and selling on Wish.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Payments`}
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        Provided the merchant is in compliance with the Terms of Service and
        other Wish policies, and excluding any amounts due to refunds to
        customers, fees applied to merchant accounts, penalties issued against
        the merchant, discretionary advances or advances made through payment
        processors, or other charges or amounts that Wish is entitled to offset
        against the merchant (collectively, the “Charges”), the merchant shall
        be paid the amounts noted below.
      </PolicySubSection>
      <PolicySubSection
        title={i`Payment Amounts`}
        subSectionNumber={`${sectionNumber}.2.1`}
        currentSection={currentSection}
      >
        <p>
          <span>
            Depending on the terms noted within the merchant’s Wish account or
            the terms of any other agreement the merchant may have with Wish,
            when an item sells, Wish will pay the merchant either a percentage
            (the remaining percentage retained by Wish is called the "revenue
            share" percentage) or a set amount of the listed product price plus
            the listed shipping price (combined) as provided to Wish by the
            merchant. This information is available to the merchant in the
            Merchant Dashboard under Account &gt; Settings.
          </span>{" "}
          <Link href={zendeskURL("204531558")} openInNewTab>
            Learn more
          </Link>
        </p>
        <p>
          Payments will be a net amount reflecting the merchant’s prices (listed
          product price and listed shipping price) less any Charges.
        </p>
        <p>
          Unless otherwise agreed upon between Wish and the merchants, merchants
          are subject to the following tiered revenue share structure, effective
          July 19, 2021 7:00PM UTC:
        </p>
        <ul>
          <li>
            {5}% revenue share on Wish Express orders (across all product
            categories) bound for non-North American destinations.
          </li>
          <li>
            {10}% revenue share on Wish Express orders (across all product
            categories) bound for North American destinations.
          </li>
          <li>
            {10}% revenue share on non-Wish Express orders (across all
            destinations) for Household Supplies products.
          </li>
          <li>
            {25}% revenue share on non-Wish Express orders (across all
            destinations) for Sex Toys products.
          </li>
          <li>
            {15}% revenue share on non-Wish Express orders (across all product
            categories except for Household Supplies or Sex Toys) shipped within
            the European Union (i.e., from and to the EU), ONLY if the merchant
            falls within one of the following groups: EU domiciled, or Non-EU
            domiciled with an EU establishment
          </li>
          <li>
            {22}% revenue share on all other non-Wish Express orders (across all
            product categories except for Household Supplies or Sex Toys) bound
            for EU destinations.
          </li>
          <li>
            {15}% revenue share on non-Wish Express orders (across all product
            categories except for Household Supplies or Sex Toys) bound for
            non-EU destinations.
          </li>
        </ul>
      </PolicySubSection>

      {version == "archive" ? (
        <Section2P2Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section2P2Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      {version == "archive" ? (
        <Section2P3Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section2P3Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      {version == "archive" ? (
        <Section2P4Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section2P4Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={i`Disbursements`}
        subSectionNumber={`${sectionNumber}.2.5`}
        currentSection={currentSection}
      >
        <p>
          Wish generally will disburse payments to merchants for their eligible
          transactions twice per month. This disbursal schedule may change, at
          Wish’s reasonable discretion, if (a) the merchant is not in compliance
          with the Terms of Service or these Fees and Payment policies, (b) the
          merchant changes its payment provider during a payment cycle, (c) the
          merchant is involved in a third-party claim, legal proceeding, or
          governmental inquiry related to the merchant’s use of the Services,
          (d) Wish reasonably suspects that the merchant account has security
          vulnerabilities, has been hacked, or otherwise has been compromised,
          or (e) Wish has communicated a different disbursal schedule to the
          merchant. Upon making a payment disbursal to the merchant, it may take
          {5} - {7} business days for the funds to arrive in your merchant or
          your provider’s account.
        </p>
        <p className={subsectionEndClass}>
          Merchants' account balances available for disbursal are estimates
          based, in part, on certain information made available to Wish. Wish
          cannot guarantee that the disbursal amount made to the merchant will
          be identical to the amount visible to the merchant displayed as its
          account balance within its account, and Wish shall not be liable for
          any discrepancy between these two amounts.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Wish Local Retailer Fees and Payment Terms`}
        subSectionNumber={`${sectionNumber}.3`}
        currentSection={currentSection}
      >
        * Section {sectionNumber}.3 is only applicable to Wish Local Retailers.
      </PolicySubSection>
      <PolicySubSection
        title={i`Order Payment Eligibility`}
        subSectionNumber={`${sectionNumber}.3.1`}
        currentSection={currentSection}
      >
        <p>
          If a Wish Local Retailer sells an item on Wish (each sale a “‘Sell On
          Wish’ Transaction”) as a Wish merchant, such ‘Sell On Wish’
          Transaction will be eligible for payment as set out below or as
          otherwise communicated to the merchant by Wish. Without limiting any
          other remedies, Wish may unilaterally decide to delay the remittance
          and withhold any amount payable to the merchant until receiving the
          confirmation of fulfilled pickup and passing the {30}-day customer
          refund window. ‘Sell on Wish’ Transactions that cannot be confirmed as
          picked up either by the merchant’s Wish Local account or through our
          internal systems may be ineligible for payment. Wish will pay the
          merchant for its eligible ‘Sell On Wish’ Transactions twice per month.
        </p>
        <p>
          Each ‘Sell On Wish’ Transaction requires the merchant to confirm the
          customer pickup in its Wish Local application. In the event that a
          ‘Sell On Wish’ Transaction is not confirmed, Wish has no obligation to
          pay the merchant for such ‘Sell On Wish’ Transaction.
        </p>
        <p className={subsectionEndClass}>
          Once the customer picks up the customer’s order, the customer will
          have {30}-days to request a refund for a ‘Sell On Wish’ Transaction.
          Once the order clears the {30}-day refund window, the ‘Sell On Wish’
          Transaction will become eligible for payment on the immediate
          following payment cycle.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Fees`}
        subSectionNumber={`${sectionNumber}.3.2`}
        currentSection={currentSection}
      >
        <p>
          Depending on the terms noted within the merchant’s Wish account or the
          terms of any other agreement the merchant may have with Wish, Wish
          will either take a percentage or a set amount of the list price
          provided to Wish by the merchant when an item sells.
        </p>
        <p>
          Should the merchant use additional services or product features
          related to the sales of items through or in connection with Wish’s
          services (e.g., ProductBoost, Fulfillment by Wish, etc.), these
          services or product features may be subject to certain additional or
          different fees as communicated by Wish. In the event Wish introduces a
          new service or product feature related to the sales of items through
          or in connection with Wish’s services, the fees for that service or
          product feature will be effective upon the launch of the service or
          product feature. Unless otherwise stated, all fees are quoted in US
          Dollars (USD).
        </p>
        <p>
          In certain situations, including but not limited to a void or invalid
          transaction, Wish may issue a debit to a merchant’s billing statement
          for the applicable fees.
        </p>
        <p className={subsectionEndClass}>
          Except as set forth in the Merchant Terms of Service or the Tax
          Policy, you are responsible for paying all fees and applicable taxes
          associated with using and selling on Wish.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Payments`}
        subSectionNumber={`${sectionNumber}.3.3`}
        currentSection={currentSection}
      >
        Provided the merchant is in compliance with the Terms of Service and
        other Wish policies, and excluding any amounts due to refunds to
        customers, fees applied to merchant accounts, penalties issued against
        the merchant, discretionary advances or advances made through payment
        processors, or other charges or amounts that Wish is entitled to offset
        against the merchant (collectively, the “Charges”), the merchant shall
        be paid the amounts noted below.
      </PolicySubSection>

      <PolicySubSection
        title={i`Payment Amounts`}
        subSectionNumber={`${sectionNumber}.3.3.1`}
        currentSection={currentSection}
      >
        <Markdown
          className={css(styles.paragraph)}
          text={
            i`Depending on the terms noted within the merchant’s ` +
            i`Wish account or the terms of any other agreement the merchant ` +
            i`may have with Wish, when an item sells, Wish will pay the ` +
            i`merchant either a percentage or a set amount of the listed ` +
            i`product price plus the listed shipping price (combined) as ` +
            i`provided to Wish by the merchant. This information is available ` +
            i`to the merchant in the Merchant Dashboard Account > Settings page. ` +
            i`[Learn more](${zendeskURL("204531558")})`
          }
          openLinksInNewTab
        />
        <p className={subsectionEndClass}>
          Payments will be a net amount reflecting the merchant’s prices (listed
          product price and listed shipping price) less any Charges.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Disbursements`}
        subSectionNumber={`${sectionNumber}.3.3.2`}
        currentSection={currentSection}
      >
        <p>
          Wish generally will disburse payments to merchants for their eligible
          transactions twice per month. This disbursal schedule may change, at
          Wish’s reasonable discretion, if (a) the merchant is not in compliance
          with the Terms of Service or these Fees and Payment policies, (b) the
          merchant changes its payment provider during a payment cycle, (c) the
          merchant is involved in a third-party claim, legal proceeding, or
          governmental inquiry related to the merchant’s use of the Services,
          (d) Wish reasonably suspects that the merchant account has security
          vulnerabilities, has been hacked, or otherwise has been compromised,
          or (e) Wish has communicated a different disbursal schedule to the
          merchant. Upon making a payment disbursal to the merchant, it may take
          {5} - {7} business days for the funds to arrive in your merchant or
          your provider’s account.
        </p>
        <p className={subsectionEndClass}>
          Merchants' account balances available for disbursal are estimates
          based, in part, on certain information made available to Wish. Wish
          cannot guarantee that the disbursal amount made to the merchant will
          be identical to the amount visible to the merchant displayed as its
          account balance within its account, and Wish shall not be liable for
          any discrepancy between these two amounts.
        </p>
      </PolicySubSection>
    </PolicySection>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        subsectionEnd: {
          marginBottom: 0,
        },
        paragraph: {
          marginBottom: 10,
        },
      }),
    []
  );

export default observer(FeesAndPaymentsPolicy);
