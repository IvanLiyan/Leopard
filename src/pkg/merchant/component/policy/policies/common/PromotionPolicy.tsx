/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { Link } from "@ContextLogic/lego";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import LocalCurrencyNotice from "@merchant/component/policy/policies/common/LocalCurrencyNotice";

const PromotionPolicy = ({
  className,
  sectionNumber,
  version,
  announcementsMap,
  currentSection,
}: PolicyProps) => {
  const styles = useStylesheet();
  const subsectionEndClass = css(styles.subsectionEnd);

  return (
    <PolicySection
      className={className}
      name="promotion"
      title={i`Product Promotion`}
      sectionNumber={sectionNumber}
      dateUpdated={i`July 16, 2020`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      <PolicySubSection>
        Wish may promote a product at any time. If a product's pricing,
        inventory, or details are inaccurate the merchant risks exposing
        themselves to the following policies.
      </PolicySubSection>

      <PolicySubSection
        title={i`Extreme price increases within one promoted product listing are prohibited`}
        subSectionNumber={`${sectionNumber}.1`}
        announcementsMap={announcementsMap}
        currentSection={currentSection}
      >
        <p>
          Merchants may increase prices for both promoted and non-promoted
          products (product price and/or shipping price) by{"  "}
          {formatCurrency(10, "USD")}* or up to {100}%, whichever is greater,
          within a {1}-week period. For a given promoted product, this price
          restriction applies independently to the product price and shipping
          price.
        </p>

        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360007954854")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Inventory cannot be lowered on promoted products, ` +
          i`except within an acceptable range`
        }
        subSectionNumber={`${sectionNumber}.2`}
        announcementsMap={announcementsMap}
        currentSection={currentSection}
      >
        <p>
          Inventory cannot be lowered on promoted products, except within an
          acceptable range.
        </p>
        <p>
          Merchants may decrease a promoted product's inventory levels every
          {14} calendar days by up to {50}% or {5}, whichever is greater.
        </p>
        <p>
          These inventory changes may be applied on a warehouse-by-warehouse
          level.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("205212507")} openInNewTab>
            Learn More
          </Link>
        </p>
      </PolicySubSection>

      {version == "archive" && (
        <PolicySubSection
          title={i`Disabling or removing a promoted product will cause the store to be penalized`}
          subSectionNumber={`${sectionNumber}.3`}
          currentSection={currentSection}
        >
          <p>
            {i`If a store disables or removes a promoted product with ` +
              i`${formatCurrency(500, "USD")}+ GMV* in the last ${9} days, ` +
              i`or if a store disables a specific country for a promoted product with ` +
              i`${formatCurrency(
                100,
                "USD"
              )}+ GMV* in the last ${9} days in that country, the store will ` +
              i`be penalized ${formatCurrency(50, "USD")}*.`}
          </p>
          <p>
            {i`If a store disables a specific country for a promoted product with ` +
              i`${formatCurrency(100, "USD")}+ GMV* in the last ${9} days in ` +
              i`that country, the store will be penalized ` +
              i`${formatCurrency(50, "USD")}*.`}
          </p>
          <p>
            {i`Addendum: Effective August 6, 2019 8PM Pacific Time, if a store ` +
              i`disables or removes a promoted product with ` +
              i`${formatCurrency(500, "USD")}+ GMV* in the last ${9} ` +
              i`days, or if a store disables a specific country for a promoted ` +
              i`product with ${formatCurrency(100, "USD")}+ GMV* in the ` +
              i`last ${9} days in that country, the store will be ` +
              i`penalized ${formatCurrency(1, "USD")}*.`}
          </p>
        </PolicySubSection>
      )}

      <PolicySubSection
        title={i`Promoted products cannot be edited`}
        subSectionNumber={`${sectionNumber}.${version == "archive" ? 4 : 3}`}
        currentSection={currentSection}
      >
        <p>
          Editing a promoted product's title, description, or images is strictly
          prohibited.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("205212507")} openInNewTab>
            Learn More
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`New variations cannot be added to promoted products`}
        subSectionNumber={`${sectionNumber}.${version == "archive" ? 5 : 4}`}
        currentSection={currentSection}
      >
        <p>
          Adding a new size/color variation to a promoted product is prohibited.
        </p>
        <p>
          <Link href={zendeskURL("205212507")} openInNewTab>
            Learn More
          </Link>
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
      }),
    []
  );

export default observer(PromotionPolicy);
