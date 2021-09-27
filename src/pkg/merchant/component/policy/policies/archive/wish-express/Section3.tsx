import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section3 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={
        i`Wish Express orders to the U.S. are eligible for payment only if ` +
        i`they are confirmed delivered by the carrier within ${10} working ` +
        i`days from order released date`
      }
      subSectionNumber={`${sectionNumber}.3`}
      currentSection={currentSection}
    >
      <p>
        All Wish Express orders that are not confirmed delivered by carriers
        within {10} working days from order released date will not be eligible
        for payment.
      </p>
      <p>
        Merchants are allowed to dispute payments withheld under this policy
        within {11} calendar days from receiving the penalty details.
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href="/policy#wish_express" openInNewTab>
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
    [],
  );

export default observer(Section3);
