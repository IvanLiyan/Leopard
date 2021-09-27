import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

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
      title={
        i`Orders are not eligible for payment if a refund is issued ` +
        i`before the order is confirmed fulfilled`
      }
      subSectionNumber={`${sectionNumber}.1`}
      currentSection={currentSection}
    >
      <p>
        If an order is refunded before the order is confirmed fulfilled, the
        order is not eligible for payment. To be eligible for payment, the order
        must be confirmed fulfilled on Wish before the refund occurs.
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
    [],
  );

export default observer(Section1);
