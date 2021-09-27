/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link, Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";
import LocalCurrencyNotice from "@merchant/component/policy/policies/common/LocalCurrencyNotice";

const ProductCompliancePolicy = ({
  className,
  sectionNumber,
  version,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();
  const subsectionEndClass = css(styles.subsectionEnd);

  return (
    <PolicySection
      className={className}
      name="product_compliance"
      title={i`Other Regulatory Compliance`}
      sectionNumber={sectionNumber}
      dateUpdated={i`June 14, 2021`}
    >
      <PolicySubSection
        title={
          i`Merchants must comply with their independent obligations ` +
          i`under the Market Surveillance Regulation (EU) 2019/1020, ` +
          i`including but not limited to, providing a Responsible ` +
          i`Person(s) for certain applicable products sold into relevant ` +
          i`markets`
        }
        subSectionNumber={`${sectionNumber}.1`}
        currentSection={currentSection}
      >
        <p>
          If a merchant is determined to be in violation of the Market
          Surveillance Regulation (EU) 2019/1020 for any reason, their products
          may be restricted for sale in the European Union (including but not
          limited to, impression blocks on applicable products/product
          categories). Additionally, their account may incur other monetary
          penalties and/or face suspension, in addition to facing other
          potential repercussions by either regulators, customs agents, and/or
          Wish under applicable Wish Merchant Policies.
        </p>
        <p>
          Products sold into the following relevant markets are subject to this
          policy:
        </p>
        <Markdown
          className={css(styles.paragraph)}
          text={i`European Union` + `  \n` + i`Northern Ireland`}
        />
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("1260805801570")} openInNewTab>
            Learn more about the Market Surveillance Regulation and Responsible
            Person
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchants must provide Wish with truthful and accurate information ` +
          i`regarding Responsible Persons`
        }
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        <p>
          If a merchant is determined to have provided inaccurate or fraudulent
          information about a Responsible Person for their products, the
          merchant’s account is subject to being penalized up to ${500}*, facing
          suspension, and/or store impression block.
        </p>
      </PolicySubSection>

      <LocalCurrencyNotice />
    </PolicySection>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        subsectionEnd: {
          marginBottom: 0,
        },
        paragraph: {
          marginBottom: 10,
        },
      }),
    [],
  );

export default observer(ProductCompliancePolicy);
