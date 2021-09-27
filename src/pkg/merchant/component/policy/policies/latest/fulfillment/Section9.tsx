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

const Section9 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`Order Cancellation Penalty Policy`}
      subSectionNumber={`${sectionNumber}.9`}
      currentSection={currentSection}
    >
      <p>
        {i`If an order is found to have been cancelled or refunded prior to ` +
          i`confirmed fulfillment, the merchant will be penalized ` +
          i`${formatCurrency(2, "USD")}* per violating order.`}
      </p>
      <p>
        Merchants are allowed to dispute these penalties within {3} business
        days after a penalty statement is generated.
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href={zendeskURL("360010281594")} openInNewTab>
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

export default observer(Section9);
