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
        Starting October 22, 2018 5PM Pacific Time, WishPost will be the only
        accepted shipping carrier for orders shipping from Mainland China. All
        other shipping carriers will not be acceptable for orders shipping from
        Mainland China, unless utilized through WishPost. Orders that are
        shipped from other countries besides Mainland China will be unaffected.
      </p>
      <p>
        Merchant stores detected to violate these shipping policies will be
        subject to penalties, payment withholding and/or possible suspension in
        the future.
      </p>
      <p>
        {i`If an order has been found to be shipped from Mainland China, and was ` +
          i`shipped with a carrier other than WishPost between Monday, October 22nd, ` +
          i`2018 17:00:00 PST and January 15, 2019 00:00 GMT, the merchant will be ` +
          i`penalized ${formatCurrency(
            10,
            "USD"
          )}* per violating order. After ` +
          i`January 15, 2019 00:00 GMT, the violating order will be penalized ` +
          i`${formatCurrency(100, "USD")}*.`}
      </p>
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`Addendum: Advanced Logistics Program orders that are ` +
          i`removed by merchants from the program and allowed to be shipped ` +
          i`from warehouses outside of Mainland China must be fulfilled with a ` +
          i`[Qualified Confirmed Delivery Shipping Carrier](${"/documentation/confirmeddeliveryshippingcarriers"}).`
        }
        openLinksInNewTab
      />
      <Markdown
        className={css(styles.paragraph)}
        text={
          i`As such, merchants must also comply with the confirmed ` +
          i`delivery timeline requirements outlined for these orders: ` +
          i`[Merchant Policy 5.4](${"#5.4"}) and [Merchant Policy 7.5](${"#7.5"}).`
        }
      />
      <p>
        {i`If an above-noted order has been found to be shipped from a warehouse ` +
          i`within Mainland China, merchants will be penalized ` +
          i`${formatCurrency(100, "USD")}* per noncompliant order. Repeated ` +
          i`violations of this policy may be subject to further penalties.`}
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("360009799633")} openInNewTab>
          See examples and learn more
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
    []
  );

export default observer(Section8);
