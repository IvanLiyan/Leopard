import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section6 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={
        i`Modifying a product listing from its original product ` +
        i`to a new product is forbidden`
      }
      subSectionNumber={`${sectionNumber}.6`}
      currentSection={currentSection}
    >
      <p>
        {i`If a merchant changes a product listing into a new product, the ` +
          i`product will be removed, the account will be penalized up to ` +
          i`${formatCurrency(
            20,
            "USD"
          )}*, and the account will be at risk of ` +
          i`suspension.`}
      </p>
      <p className={css(styles.subsectionEnd)}>
        The penalty can only be disputed and approved within {90} calendar days
        from when the penalty was created. If the penalty dispute is not
        approved within the {90} calendar day period from when the penalty was
        created, the penalty will not be reversed.
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

export default observer(Section6);
