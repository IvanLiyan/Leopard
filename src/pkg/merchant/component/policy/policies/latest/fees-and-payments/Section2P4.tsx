import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { zendeskURL } from "@toolkit/url";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section2P4 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => (
  <PolicySubSection
    title={i`FBW (Fulfillment by Wish) Order Payment Eligibility`}
    subSectionNumber={`${sectionNumber}.2.4`}
    currentSection={currentSection}
  >
    <span>
      FBW (Fulfillment By Wish) orders will be eligible for payment within
      {48} hours from the date the order is marked “shipped”.
    </span>{" "}
    <Link href={zendeskURL("205159548")} openInNewTab>
      Learn more
    </Link>
  </PolicySubSection>
);

export default observer(Section2P4);
