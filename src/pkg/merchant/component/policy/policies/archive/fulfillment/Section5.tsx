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

const Section5 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={
        i`Orders that are not confirmed shipped by the carrier ` +
        i`within the designated amount of time after order released ` +
        i`date will be penalized`
      }
      subSectionNumber={`${sectionNumber}.5`}
      currentSection={currentSection}
    >
      <span>
        {i`If an order is not confirmed shipped by the carrier within the ` +
          i`following designated amount of time after the order is released, the ` +
          i`merchant will be penalized ${20}% of the order value, or ` +
          i`${formatCurrency(1, "USD")}*, whichever is greater:`}
      </span>
      <ul>
        <li>
          Orders where (merchant price per item + shipping price per item) is
          less than {formatCurrency(100, "USD")}* that are not confirmed shipped
          within {168} hours of the order being released will be penalized.
        </li>
        <li>
          Orders where (merchant price per item + shipping price per item) is
          greater than or equal to {formatCurrency(100, "USD")}* that are not
          confirmed shipped within {336} hours of the order being released will
          be penalized.
        </li>
      </ul>
      <p>
        Order value is defined as ‘quantity * (merchant price + merchant
        shipping)’.
      </p>
      <p>
        All orders released after July 9, 2019 00:00 UTC, including orders where
        (merchant price per item + shipping price per item) is greater than or
        equal to {formatCurrency(100, "USD")}*, will be subject to this penalty
        policy.
      </p>

      <p>
        An order's penalty for late confirmed fulfillment will be reversed if
        the order is confirmed delivered by the carrier within X calendar days
        from the order released time. However, the penalty will not be reversed
        if the merchant updates the tracking number for any reason.
      </p>
      <p>
        <Link href={zendeskURL("204530018")} openInNewTab>
          'X' varies by country, which you can view here.
        </Link>
      </p>
      <p>
        Merchants are allowed to dispute these penalties via the order tracking
        dispute tool.
      </p>
      <p>
        Effective November 12, 2018, the penalty can only be disputed and
        approved within {90} calendar days from when the penalty was created. If
        the penalty dispute is not approved within the {90} calendar day period
        from when the penalty was created, the penalty will not be reversed.
      </p>
      <p>
        Addendum: Effective July 23, 2019, the penalty will not be reversed if
        the merchant updates the tracking number for any reason.
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("360002714354")} openInNewTab>
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

export default observer(Section5);
