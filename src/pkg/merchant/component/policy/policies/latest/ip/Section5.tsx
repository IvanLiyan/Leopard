import React from "react";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section7 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => (
  <PolicySubSection
    title={i`Penalties for counterfeit or intellectual property infringement`}
    subSectionNumber={`${sectionNumber}.5`}
    currentSection={currentSection}
  >
    All products are reviewed for counterfeit and intellectual property
    infringement. If a product is found to violate Wish's policy, it will be
    removed and all payments will be withheld. The merchant may be penalized up
    to {formatCurrency(10, "USD")}* per counterfeit product. The penalty can
    only be disputed and approved within {90} calendar days from when the
    penalty was created. If the penalty dispute is not approved within the {90}{" "}
    calendar day period from when the penalty was created, the penalty will not
    be reversed.
  </PolicySubSection>
);

export default observer(Section7);
