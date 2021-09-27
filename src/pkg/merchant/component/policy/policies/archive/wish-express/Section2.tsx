import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section2 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={
        i`Upon three U.S. Wish Express suspensions, merchants will be banned ` +
        i`from U.S. Wish Express permanently`
      }
      subSectionNumber={`${sectionNumber}.2`}
      currentSection={currentSection}
    >
      <p>
        The Suspension Policy measures Wish Express orders weekly, from Monday
        through Sunday. A merchant’s enrollment in U.S. Wish Express will be
        suspended if its On-Time Arrival Rate is less than {90}% and/or its
        Pre-Fulfillment Cancellation Rate is ≥{10}% for the most recent
        measurement period. If a merchant enrollment has previously been
        suspended three times by the Suspension Policy for U.S. Wish Express
        Orders, the merchant will be permanently removed from further enrollment
        in U.S. Wish Express.
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
    []
  );

export default observer(Section2);
