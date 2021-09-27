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
      <p>
        Information provided at registration must be accurate, true, and
        correct. This includes, but is not limited to, merchant identity,
        identification document(s), and merchant’s country of domicile.
      </p>

      <p>
        If Wish suspects the information provided by a merchant during a
        merchant’s registration process is inaccurate, false, or incorrect, the
        merchant’s account may be at risk of suspension, funds withholding or
        freeze, user ban, account termination or ban, or other account use or
        access restriction, and any payments that may be due to a merchant may
        be forfeited or withheld by Wish until and unless the merchant has
        provided proof that the merchant’s registration information is accurate,
        true, and correct, including, but not limited to, proof of the
        merchant’s identity, business incorporation or registration documents,
        government issued identification document(s), and/or other proof of the
        merchant’s country of domicile.
      </p>

      <p>
        Furthermore, if any promotions or business terms that Wish offers to a
        merchant is based on inaccurate, false, or incorrect registration
        information provided by a merchant, Wish may recover from the merchant
        (via an offset, fund forfeiture, or otherwise) any amounts that Wish
        would have otherwise received had it not offered the merchant the
        promotion or business term based on the inaccurate, false, or incorrect
        registration information provided by a merchant.
      </p>

      <p>
        The above policy takes full effect starting August 29, 2021 7:00PM UTC.
      </p>
    </PolicySubSection>
  );
};

export default observer(Section1);
