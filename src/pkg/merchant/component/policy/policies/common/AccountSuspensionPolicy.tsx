/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import LocalCurrencyNotice from "@merchant/component/policy/policies/common/LocalCurrencyNotice";

const AccountSuspensionPolicy = ({
  className,
  sectionNumber,
  version,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySection
      className={className}
      name="account_suspension"
      title={i`Account Suspension`}
      sectionNumber={sectionNumber}
      dateUpdated={i`July 16, 2020`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      <PolicySubSection
        title={i`The following occur to accounts upon suspension:`}
        subSectionNumber={`${sectionNumber}.1`}
        currentSection={currentSection}
      >
        <ul className={css(styles.subsectionEnd)}>
          <li>Account access is restricted</li>
          <li>The store's products are no longer for sale</li>
          <li>The store's payments are withheld {3} months</li>
          <li>
            For severe violations, the store's payments are withheld permanently
          </li>
          <li>The store is responsible for {100}% of all refunds</li>
        </ul>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Reasons an account could be suspended include ` +
          i`but are not limited to the following:`
        }
      />

      <PolicySubSection
        title={i`Asking customers for their personal information`}
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        If a merchant has asked customers for their personal information
        including email address, the merchant account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Asking customers to send money`}
        subSectionNumber={`${sectionNumber}.3`}
        currentSection={currentSection}
      >
        If a merchant has requested a direct payment from the customer, the
        merchant account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Providing inappropriate customer service`}
        subSectionNumber={`${sectionNumber}.4`}
        currentSection={currentSection}
      >
        If a merchant has provided inappropriate customer service, the merchant
        account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Being disingenuous to customers`}
        subSectionNumber={`${sectionNumber}.5`}
        currentSection={currentSection}
      >
        If a merchant is being disingenuous to customers, the merchant account
        is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Asking customers to visit stores outside of Wish`}
        subSectionNumber={`${sectionNumber}.6`}
        currentSection={currentSection}
      >
        <Markdown
          text={
            i`If a merchant has asked customers to visit stores outside of Wish, the ` +
            i`merchant account is at risk of suspension and/or a penalty of ` +
            i`${formatCurrency(10000, "USD")}* per incident. Please see ` +
            i`[Policy 5.7 - Deceptive Fulfillment Policy](${"#5.7"}) for further information.`
          }
        />
      </PolicySubSection>

      <PolicySubSection
        title={i`Selling fake or counterfeit goods`}
        subSectionNumber={`${sectionNumber}.7`}
        currentSection={currentSection}
      >
        If a merchant is selling fake or counterfeit goods, the merchant account
        is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Violating Wish merchant policies`}
        subSectionNumber={`${sectionNumber}.8`}
        currentSection={currentSection}
      >
        If a merchant is taking advantage of policies Wish has set in place for
        their own profit, the merchant account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Related account is suspended`}
        subSectionNumber={`${sectionNumber}.9`}
        currentSection={currentSection}
      >
        If a merchant is linked to another merchant whose account is suspended,
        the merchant account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`High refund ratio`}
        subSectionNumber={`${sectionNumber}.10`}
        currentSection={currentSection}
      >
        If a merchant has a high refund ratio, the merchant account is at risk
        of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`High auto refund ratio`}
        subSectionNumber={`${sectionNumber}.11`}
        currentSection={currentSection}
      >
        If a merchant has a high auto refund ratio, the merchant account is at
        risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`High chargeback ratio`}
        subSectionNumber={`${sectionNumber}.12`}
        currentSection={currentSection}
      >
        If a merchant has an unacceptably high chargeback ratio, the merchant
        account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Registering for multiple merchant accounts`}
        subSectionNumber={`${sectionNumber}.13`}
        currentSection={currentSection}
      >
        If a merchant has registered for multiple accounts on Wish, the merchant
        account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Using unconfirmed tracking numbers`}
        subSectionNumber={`${sectionNumber}.14`}
        currentSection={currentSection}
      >
        If a merchant has an unacceptably high number of tracking numbers that
        cannot be confirmed, the merchant account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Sending empty packages to customers`}
        subSectionNumber={`${sectionNumber}.15`}
        currentSection={currentSection}
      >
        If a merchant is sending empty packages to customers, the merchant
        account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Using fake tracking numbers`}
        subSectionNumber={`${sectionNumber}.16`}
        currentSection={currentSection}
      >
        If a merchant is using fake tracking numbers, the merchant account is at
        risk of penalty or suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Sending packages to the wrong address`}
        subSectionNumber={`${sectionNumber}.17`}
        currentSection={currentSection}
      >
        If a merchant has an unacceptably high number of packages sent to the
        wrong address, the merchant account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`High late confirmed fulfillment rate`}
        subSectionNumber={`${sectionNumber}.18`}
        currentSection={currentSection}
      >
        If a merchant account has an unacceptably high late confirmed
        fulfillment rate, the merchant account is at risk of suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`High ratio of prohibited products and/or orders with fake tracking`}
        subSectionNumber={`${sectionNumber}.19`}
        currentSection={currentSection}
      >
        If a merchant has an unacceptably high percentage of orders from
        prohibited products and/or orders shipped with fake tracking, their
        merchant account is subject to suspension, withheld payments, and
        decreased impressions for products. Prohibited products include but are
        not limited to misleading products.
      </PolicySubSection>
      <PolicySubSection
        title={i`Merchant harassment of Wish employees or property`}
        subSectionNumber={`${sectionNumber}.20`}
        currentSection={currentSection}
      >
        Wish takes the safety of Wish employees, offices, and/or properties very
        seriously. Any form of harassment, threats, uninvited visits, refusal to
        leave Wish properties, or any such inappropriate or unlawful behavior
        towards Wish employees, offices, or properties will be penalized. If a
        merchant is found to be engaged in these inappropriate behaviors, the
        merchant’s account payments will be withheld permanently and the
        merchant will be penalized {formatCurrency(100000, "USD")}* per
        incident.
      </PolicySubSection>

      <LocalCurrencyNotice />
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
      }),
    []
  );

export default observer(AccountSuspensionPolicy);
