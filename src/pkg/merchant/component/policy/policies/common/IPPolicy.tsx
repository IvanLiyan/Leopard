import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import Section5Latest from "@merchant/component/policy/policies/latest/ip/Section5";
import Section5Archive from "@merchant/component/policy/policies/archive/ip/Section5";

import LocalCurrencyNotice from "@merchant/component/policy/policies/common/LocalCurrencyNotice";

const IPPolicy = ({
  className,
  sectionNumber,
  version,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();

  return (
    <PolicySection
      className={className}
      name="ip"
      title={i`Intellectual Property`}
      sectionNumber={sectionNumber}
      dateUpdated={i`July 16, 2020`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      <PolicySubSection>
        <p>
          Wish has a strict policy against counterfeits and intellectual
          property infringement.
        </p>
        <p className={css(styles.subsectionEnd)}>
          If Wish determines (in its sole discretion) that you are selling
          counterfeit goods, you agree that, without limiting any of Wish’s
          rights under this Agreement or at law, Wish may (in its sole
          discretion) suspend or terminate your selling privileges or cause
          payments to you to be withheld or forfeited.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Selling counterfeit products is strictly prohibited`}
        subSectionNumber={`${sectionNumber}.1`}
        currentSection={currentSection}
      >
        <p>
          <span>
            Selling products which mimic or allude to the intellectual property
            of others is prohibited. If a merchant lists counterfeit products,
            the products will be removed and their account faces penalties and
            possible suspension.
          </span>{" "}
          <Link href={zendeskURL("204531768")} openInNewTab>
            Learn more
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Selling products which infringe on another entity's ` +
          i`intellectual property is prohibited`
        }
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        <p>
          <span>
            Product images and text may not infringe on the intellectual
            property of others. This includes, but is not limited to: copyright,
            trademarks, and patents. If a merchant lists products which infringe
            on the intellectual property of others, the products will be removed
            and their account faces penalties and possible suspension.
          </span>{" "}
          <Link href={zendeskURL("204531768")} openInNewTab>
            Learn more
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Proof of authorization to sell a product is the burden of the merchant`}
        subSectionNumber={`${sectionNumber}.3`}
        currentSection={currentSection}
      >
        If a product is counterfeit or infringes on intellectual property, it is
        the burden of the merchant to provide proof they are authorized to sell
        the product.
      </PolicySubSection>

      <PolicySubSection
        title={i`Providing inaccurate or misleading proof of authorization to sell is prohibited`}
        subSectionNumber={`${sectionNumber}.4`}
        currentSection={currentSection}
      >
        If a merchant provides inaccurate or misleading proof of their
        authorization to sell a product, their account will be suspended.
      </PolicySubSection>

      {version == "archive" ? (
        <Section5Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section5Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={i`Counterfeit penalties for approved products`}
        subSectionNumber={`${sectionNumber}.6`}
        currentSection={currentSection}
      >
        Approved products are reviewed again for counterfeit and intellectual
        property infringement after the merchant changes the product name,
        product description or product images. During review, the product will
        be available for sale. If the product is found to violate Wish's policy
        after the edit, the product will be removed and all payments will be
        withheld. The merchant account may receive possible penalties and/or
        suspension.
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
      }),
    [],
  );

export default observer(IPPolicy);
