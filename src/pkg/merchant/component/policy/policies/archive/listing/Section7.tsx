import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { zendeskURL } from "@toolkit/url";

import { PolicyProps } from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const Section7 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => (
  <PolicySubSection
    title={i`Prohibited product listings will be penalized`}
    subSectionNumber={`${sectionNumber}.7`}
    currentSection={currentSection}
  >
    <p>
      {i`If a product listing is detected to not comply with Wish’s ` +
        i`prohibited product listing policies, the merchant will be ` +
        i`penalized ${formatCurrency(
          10,
          "USD"
        )}* and the product listing will be taken down. Effective ` +
        i`January 15, 2019 00:00 GMT, the penalty amount issued will be ` +
        i`increased to ${formatCurrency(50, "USD")}* per prohibited product.`}
    </p>
    <p>
      Effective November 12, 2018, the penalty can only be disputed and approved
      within {90} calendar days from when the penalty was created. If the
      penalty dispute is not approved within the {90} calendar day period from
      when the penalty was created, the penalty will not be reversed.
    </p>
    <p>
      {i`Addendum: Effective August 6, 2019 8PM Pacific Time, if a product ` +
        i`listing is detected to not comply with Wish’s prohibited product ` +
        i`listing policies, the merchant will be penalized up to ${formatCurrency(
          10,
          "USD"
        )}* and the product listing will be taken down.`}
    </p>
    <p>
      <Link href={zendeskURL("205211777")} openInNewTab>
        Learn more about prohibited items
      </Link>
    </p>
  </PolicySubSection>
);

export default observer(Section7);
