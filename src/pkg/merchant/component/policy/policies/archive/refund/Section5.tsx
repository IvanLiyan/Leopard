import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
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
        i`Merchant is responsible for ${100}% of any refund on ` +
        i`an order with excessively delayed delivery`
      }
      subSectionNumber={`${sectionNumber}.5`}
      currentSection={currentSection}
    >
      <p>
        If a refund occurs because an order is not confirmed delivered by X
        calendar days after the order is placed, the merchant is responsible for{" "}
        {100}% of the cost of the refund.
      </p>
      <p>Merchants are allowed to dispute these refunds.</p>
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("204530018")} openInNewTab>
          View X for top destination countries
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
