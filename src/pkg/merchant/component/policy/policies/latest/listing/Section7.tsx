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

const Section7 = ({
  className,
  sectionNumber,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySubSection
      title={i`Prohibited product listings will be penalized`}
      subSectionNumber={`${sectionNumber}.7`}
      currentSection={currentSection}
    >
      <p>
        {i`As a merchant on Wish you are responsible for ensuring the legal ` +
          i`compliance of your products in the regions you ship to and ship from. ` +
          i`If a product listing is detected to not comply with Wish’s Prohibited ` +
          i`Product Listings policies, the merchant may be penalized and the product ` +
          i`listing may be taken down. Penalties range from a). ${formatCurrency(
            10,
            "USD"
          )} ` +
          i`per violating product to b). ${formatCurrency(
            250,
            "USD"
          )} per violating product plus the total order value for all orders generated ` +
          i`by the violating product during its lifetime,  depending on the severity ` +
          i`of the violation. In addition, the merchant’s account may be suspended ` +
          i`for selling prohibited products.`}
      </p>
      <p>
        Order value is defined as 'quantity * (merchant price + merchant
        shipping)'.
      </p>
      <p>
        {i`If a package is found to contain a product that does not comply with ` +
          i`all applicable laws, including customs regulations for the origin country ` +
          i`(i.e. location of export) or destination country (i.e. location of import), ` +
          i`merchants may be penalized for the actual costs incurred by the carrier to ` +
          i`destroy the product.`}
      </p>
      <p>
        The penalty can only be disputed and approved within {90} calendar days
        from when the penalty was created. If the penalty dispute is not
        approved within the {90} calendar day period from when the penalty was
        created, the penalty will not be reversed.
      </p>
      <p>
        <Link href={zendeskURL("205211777")} openInNewTab>
          Learn more about prohibited items
        </Link>
      </p>
      <p className={css(styles.subsectionEnd)}>
        <Link href="/policy/inappropriate-reasons/1" openInNewTab>
          See the full list of prohibited products, penalty amounts, and
          examples
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

export default observer(Section7);
