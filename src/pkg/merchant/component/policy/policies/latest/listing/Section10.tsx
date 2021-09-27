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
        {i`If a product listing or a product variation is detected to be ` +
          i`misleading, the merchant may be penalized up to ` +
          i`${formatCurrency(
            200,
            "USD"
          )}* if there were orders placed in the last ` +
          i`${30} calendar days from when the product or variation was detected as ` +
          i`misleading. Merchant may also be responsible for ${100}% of any ` +
          i`future refund on an order placed on the detected misleading product or ` +
          i`variation.`}
      </p>
      <p>
        If a merchant is found to violate this policy multiple times, the
        merchant may then be subject to other penalties, including decreased
        impressions, payment withholding, account suspension, or account
        termination.
      </p>
      <p>Merchants are allowed to dispute these penalties.</p>
      <p>
        The penalty can only be disputed and approved within {90} calendar days
        from when the penalty was created. If the penalty dispute is not
        approved within the {90} calendar day period from when the penalty was
        created, the penalty will not be reversed.
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
