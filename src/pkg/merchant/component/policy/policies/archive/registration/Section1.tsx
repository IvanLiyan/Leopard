import React from "react";
import { observer } from "mobx-react";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section1 = ({ sectionNumber, currentSection }: PolicyProps) => {
  return (
    <PolicySubSection
      title={i`Information provided at registration must be true and correct`}
      subSectionNumber={`${sectionNumber}.1`}
      currentSection={currentSection}
    >
      If the information about an account provided during registration is
      inaccurate, the account risks suspension.
    </PolicySubSection>
  );
};

export default observer(Section1);
