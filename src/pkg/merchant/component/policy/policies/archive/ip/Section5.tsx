import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section7 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`Penalties for counterfeit or intellectual property infringement`}
      subSectionNumber={`${sectionNumber}.5`}
      currentSection={currentSection}
    >
      <p>
        {i`All products are reviewed for counterfeit and intellectual property ` +
          i`infringement. If a product is found to violate Wish's policy, it will be ` +
          i`removed and all payments will be withheld. The merchant may be penalized ` +
          i`up to ${formatCurrency(
            10,
            "USD"
          )}* per counterfeit product. The penalty ` +
          i`can only be disputed and approved within ${90} calendar days from when the ` +
          i`penalty was created. If the penalty dispute is not approved within the ` +
          i`${90} calendar day period from when the penalty was created, the penalty ` +
          i`will not be reversed. The merchant may be penalized ` +
          i`${formatCurrency(
            10,
            "USD"
          )}* per counterfeit product. Effective January ` +
          i`15, 2019 00:00 GMT, the penalty amount issued will be increased to ` +
          i`${formatCurrency(50, "USD")}* per counterfeit product.`}
      </p>
      <p>
        Effective November 12, 2018, the penalty can only be disputed and
        approved within {90} calendar days from when the penalty was created. If
        the penalty dispute is not approved within the {90} calendar day period
        from when the penalty was created, the penalty will not be reversed.
      </p>
      <p className={css(styles.subsectionEnd)}>
        {i`Addendum: Effective August 6, 2019 8PM Pacific Time, upon review for ` +
          i`counterfeit and intellectual property infringement, if a product is ` +
          i`found to violate Wish's policy, it will be removed and all payments will ` +
          i`be withheld, and the merchant may be penalized up to ` +
          i`${formatCurrency(10, "USD")}* per counterfeit product.`}
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

export default observer(Section7);
