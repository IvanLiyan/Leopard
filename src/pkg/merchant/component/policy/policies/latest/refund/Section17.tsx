import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section17 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={
        i`Merchant is responsible for ${100}% of any refund for ` +
        i`orders not delivered to the customer`
      }
      subSectionNumber={`${sectionNumber}.17`}
      currentSection={currentSection}
    >
      <p>
        If an order’s tracking information marks the order as “delivered”, but
        the customer did not receive the order, the merchant is responsible for
        {100}% of the cost of refunds.
      </p>
      <p className={css(styles.subsectionEnd)}>
        Merchants are allowed to dispute these refunds.
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

export default observer(Section17);
