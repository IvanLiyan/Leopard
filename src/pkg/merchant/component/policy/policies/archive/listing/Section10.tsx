/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { zendeskURL } from "@toolkit/url";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section10 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`Product listings that are detected to be misleading will be penalized`}
      subSectionNumber={`${sectionNumber}.10`}
      currentSection={currentSection}
    >
      <p>
        {i`If a product listing is detected to be misleading, the merchant may be ` +
          i`penalized ${formatCurrency(
            100,
            "USD"
          )}* per order and ${100}% of the ` +
          i`order value for orders placed in the last ${30} days from when the product ` +
          i`was detected as misleading, with a minimum penalty of ` +
          i`${formatCurrency(100, "USD")}* per detected misleading product.`}
      </p>
      <span>
        If the last {30} days from when the product was detected as misleading
        includes orders placed before 5/2/2018 23:59 PST:
      </span>
      <ul>
        <li>
          orders placed between 4/18/2018 00:00 PST to 5/2/2018 23:59 PST are
          penalized 100% of the order value;
        </li>
        <li>orders placed before 4/18/2018 00:00 PST are not penalized;</li>
        <li>
          the minimum penalty of {formatCurrency(100, "USD")}* per detected
          misleading product still applies.
        </li>
      </ul>
      <p>
        Effective November 12, 2018, the penalty can only be disputed and
        approved within {90} days from when the penalty was created. If the
        penalty dispute is not approved within the {90} day period from when the
        penalty was created, the penalty will not be reversed.
      </p>
      <p>
        {i`Addendum: Effective March 20, 2019 00:00 UTC, if a product variation is ` +
          i`detected to be misleading, the variation will be removed from the ` +
          i`product, and the merchant will be penalized ${formatCurrency(
            100,
            "USD"
          )}* ` +
          i`per misleading variation order and ${100}% of the order value for ` +
          i`orders placed in the last ${30} days from when the particular product ` +
          i`variation was detected as misleading, with a minimum penalty of ` +
          i`${formatCurrency(
            100,
            "USD"
          )}* per detected misleading product variation.`}
      </p>
      <p>
        Addendum 2: Effective August 6, 2019 8PM Pacific Time, if a product
        listing or a product variation is detected to be misleading, the
        merchant may be penalized up to {formatCurrency(200, "USD")}* if there
        were orders placed in the last {30} days from when the product or
        variation was detected as misleading. Merchants may also be responsible
        for {100}% of any future refund on an order placed on the detected
        misleading product or variation.
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("360003237193")} openInNewTab>
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
        subsectionEnd: {
          marginBottom: 0,
        },
      }),
    []
  );

export default observer(Section10);
