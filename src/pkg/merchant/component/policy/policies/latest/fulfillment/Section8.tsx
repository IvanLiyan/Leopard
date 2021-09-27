/* eslint-disable local-rules/unnecessary-list-usage */
import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { zendeskURL } from "@toolkit/url";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section8 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`Shipping from Mainland China - WishPost Only`}
      subSectionNumber={`${sectionNumber}.8`}
      currentSection={currentSection}
    >
      <p>
        WishPost is the only accepted shipping carrier for orders shipped from
        Mainland China. All other shipping carriers will not be acceptable for
        orders shipped from Mainland China, unless utilized through WishPost.
        Orders that are shipped from other regions/countries outside of Mainland
        China will be unaffected.
      </p>
      <p>
        Merchant stores detected to violate these shipping policies will be
        subject to penalties, payment withholding and/or possible suspension in
        the future.
      </p>
      <p>
        If an order has been found to be shipped from Mainland China, and was
        shipped with a carrier other than WishPost, the violating order will be
        penalized {formatCurrency(100, "USD")}*.
      </p>
      <p>
        Addendum: Merchants may only remove an Advanced Logistics Program order
        from the program for one of the qualified reasons. Order removal found
        to be based on non-qualified reasons may be penalized
        {formatCurrency(100, "USD")}* per noncompliant order. Repeated
        violations of this policy may be subject to further penalties such as
        account suspension.
      </p>
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`All Advanced Logistics Program orders that are removed by merchants ` +
          i`from the program and allowed to be shipped from warehouses outside ` +
          i`of Mainland China must be fulfilled with a ` +
          i`[Confirmed Delivery Carrier](${"/documentation/confirmeddeliveryshippingcarriers"}). ` +
          i`As such, merchants must also comply with the confirmed delivery ` +
          i`timeline requirements outlined for these orders: [Merchant Policy 5.4](${"#5.4"}) ` +
          i`and [Merchant Policy 7.5](${"#7.5"}).`
        }
        openLinksInNewTab
      />
      <p>
        For Advanced Logistics Program orders that are removed by merchants for
        reasons other than "Shipping from outside of Mainland China" (i.e. the
        order will originate from Mainland China):
      </p>
      <ul>
        <li>
          <Markdown
            text={
              i`If the order is subject to the [Confirmed Delivery Policy](${"#5.4"}), ` +
              i`merchants must fulfill the order with WishPost and select an appropriate ` +
              i`WishPost logistics channel and service level that provide last-mile tracking ` +
              i`(i.e. delivery confirmation);`
            }
            openLinksInNewTab
          />
        </li>
        <li>
          <Markdown
            text={
              i`If the order is not subject to the [Confirmed Delivery Policy](${"#5.4"}), ` +
              i`merchants may fulfill the orders with any WishPost logistics channel of ` +
              i`their choice.`
            }
            openLinksInNewTab
          />
        </li>
      </ul>
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("360009799633")} openInNewTab>
          Learn more about the policy
        </Link>
      </p>
    </PolicySubSection>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        paragraph: {
          marginBottom: 10,
        },
        subsectionEnd: {
          marginBottom: 0,
        },
      }),
    [],
  );

export default observer(Section8);
