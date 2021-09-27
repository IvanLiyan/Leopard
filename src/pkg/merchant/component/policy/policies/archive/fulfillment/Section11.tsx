import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section11 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={
        i`Orders not delivered to the Advanced Logistics Program ` +
        i`warehouse within ${168} hours of order released time will ` +
        i`incur additional charges`
      }
      subSectionNumber={`${sectionNumber}.11`}
      currentSection={currentSection}
    >
      <p>
        If an order is not delivered to the Advanced Logistics Program warehouse
        within {168} hours of the time the “Advanced Logistics Program Order” is
        released to merchants, merchants will be charged {100}% of the shipping
        fees based on pricing schedule, plus an additional {50}% of the original
        shipping fees.
      </p>
      <p>
        Merchants are allowed to dispute this additional {50}% fee by contacting
        WishPost Customer Service.
      </p>
      <p className={css(styles.subsectionEnd)}>
        Addendum: Effective November 6, 2019 00:00 Beijing Time, merchants may
        dispute the additional fee only via the EPC Dispute Tool within their
        WishPost account.
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

export default observer(Section11);
