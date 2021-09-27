import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section1 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => (
  <PolicySubSection
    title={i`All orders must be fulfilled in ${5} calendar days`}
    subSectionNumber={`${sectionNumber}.1`}
    currentSection={currentSection}
  >
    {i`If an order is not fulfilled in ${5} calendar days after the order is ` +
      i`released to the merchant, it will be auto-refunded and the associated ` +
      i`product may be disabled. The merchant will be penalized ` +
      i`${formatCurrency(50, "USD")}* per auto-refunded order in this case.`}
  </PolicySubSection>
);

export default observer(Section1);
