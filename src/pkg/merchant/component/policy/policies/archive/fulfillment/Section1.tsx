import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section1 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`All orders must be fulfilled in ${5} calendar days`}
      subSectionNumber={`${sectionNumber}.1`}
      currentSection={currentSection}
    >
      <p>
        {i`If an order is not fulfilled in ${5} calendar days after the order is ` +
          i`released to the merchant, it will be auto-refunded and the associated ` +
          i`product may be disabled. The merchant will be penalized ` +
          i`${formatCurrency(
            50,
            "USD",
          )}* per auto-refunded order in this case.`}
      </p>
      <p className={css(styles.subsectionEnd)}>
        Addendum: Effective August 15, 2018 00:00 UTC, the merchant will also be
        penalized {formatCurrency(50, "USD")}* per auto-refunded order in this
        case.
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
    [],
  );

export default observer(Section1);
