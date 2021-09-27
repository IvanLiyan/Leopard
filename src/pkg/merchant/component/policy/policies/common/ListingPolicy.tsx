/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Markdown } from "@ContextLogic/lego";
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { zendeskURL } from "@toolkit/url";
import { useTheme } from "@merchant/stores/ThemeStore";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import Section6Latest from "@merchant/component/policy/policies/latest/listing/Section6";
import Section7Latest from "@merchant/component/policy/policies/latest/listing/Section7";
import Section10Latest from "@merchant/component/policy/policies/latest/listing/Section10";
import Section12Latest from "@merchant/component/policy/policies/latest/listing/Section12";
import Section6Archive from "@merchant/component/policy/policies/archive/listing/Section6";
import Section7Archive from "@merchant/component/policy/policies/archive/listing/Section7";
import Section10Archive from "@merchant/component/policy/policies/archive/listing/Section10";
import Section12Archive from "@merchant/component/policy/policies/archive/listing/Section12";
import LocalCurrencyNotice from "@merchant/component/policy/policies/common/LocalCurrencyNotice";

const ListingPolicy = ({
  className,
  sectionNumber,
  version,
  announcementsMap,
  currentSection,
}: PolicyProps) => {
  const theme = useTheme();
  const styles = useStylesheet(theme.textLight);
  const subsectionEndClass = css(styles.subsectionEnd);

  return (
    <PolicySection
      className={className}
      name="listing"
      title={i`Listing Products`}
      sectionNumber={sectionNumber}
      dateUpdated={i`May 11, 2021`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      <PolicySubSection
        title={i`Information provided during product upload must be accurate`}
        subSectionNumber={`${sectionNumber}.1`}
        currentSection={currentSection}
      >
        If a merchant provides inaccurate information about the product they are
        listing, the product could be removed and the account could face
        penalties or suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Counterfeit products are strictly prohibited on Wish`}
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        Listing counterfeit products on Wish is not tolerated. If a merchant
        lists counterfeit products for sale, the products will be removed and
        their account will face penalties and possible suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Products and listings may not infringe on the intellectual property of others`}
        subSectionNumber={`${sectionNumber}.3`}
        currentSection={currentSection}
      >
        <p>
          Products and listings may not infringe on the intellectual property of
          others. This includes, but is not limited to: copyright, trademarks,
          and patents. Merchants are responsible for ensuring that their
          products and listings do not infringe and are encouraged to do an IP
          clearance check before listing products. If a merchant repeatedly
          lists products that infringe on others’ intellectual property, the
          products will be removed and their account will face possible
          penalties of {formatCurrency(500, "USD")}* or more and/or suspension.
        </p>
        <p>
          If a merchant continues to repeatedly infringe on the intellectual
          property rights of others, their account is at risk of higher
          penalties, suspension and/or termination.
        </p>
        {version == "archive" ? (
          <p>
            Effective November 12, 2018, the penalty can only be disputed and
            approved within {90} calendar days from when the penalty was
            created. If the penalty dispute is not approved within the {90}{" "}
            calendar day period from when the penalty was created, the penalty
            will not be reversed.
          </p>
        ) : (
          <p className={subsectionEndClass}>
            The penalty can only be disputed and approved within {90} calendar
            days from when the penalty was created. If the penalty dispute is
            not approved within the {90} calendar day period from when the
            penalty was created, the penalty will not be reversed.
          </p>
        )}
      </PolicySubSection>

      <PolicySubSection
        title={i`Product listings may not refer customers off of Wish`}
        subSectionNumber={`${sectionNumber}.4`}
        currentSection={currentSection}
      >
        If a merchant lists a product which encourages customers to leave Wish
        or contact a store outside of Wish, the product will be removed and the
        account risks suspension.
      </PolicySubSection>

      <PolicySubSection
        title={i`Listing duplicate products is prohibited`}
        subSectionNumber={`${sectionNumber}.5`}
        currentSection={currentSection}
      >
        Listing the same product multiple times is prohibited. Products of the
        same size should be listed as one product. Duplicate products should not
        be uploaded. If a merchant uploads duplicate products the products will
        be removed and the account risks suspension.
      </PolicySubSection>

      {version == "archive" ? (
        <Section6Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section6Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      {version == "archive" ? (
        <Section7Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section7Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={i`A product listing may not include different products of high variance`}
        subSectionNumber={`${sectionNumber}.8`}
        currentSection={currentSection}
      >
        <p>
          If a merchant includes different products of high variance in one
          listing, the product will be removed and the account risks suspension.
        </p>
        <span>High variance products refer to the following:</span>
        <ul>
          <li>Products that are fundamentally different from each other</li>
          <li>
            Products that require completely different product description
          </li>
          <li>
            Products that cannot both be described by a single product title
          </li>
          <li>One product is another product’s accessory</li>
          <li>
            A customer would not expect to find the products together on the
            detail page
          </li>
        </ul>
        <p>
          <Link href={zendeskURL("360000164134")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
        <Markdown
          className={css(styles.disclaimer, styles.subsectionEnd)}
          text={
            i`*We reserve the right to remove products that ` +
            i`violate this product variance policy.*`
          }
        />
      </PolicySubSection>

      <PolicySubSection
        title={i`Extreme price variance within one product listing is prohibited`}
        subSectionNumber={`${sectionNumber}.9`}
        currentSection={currentSection}
      >
        <p>
          Merchants may set the maximum variation price to be up to
          {formatCurrency(20, "USD")} more than the minimum variation price. A
          product listing that does not adhere to the price variance policy will
          be removed and the account risks suspension.
        </p>
        <p>
          <Link href={zendeskURL("360000164134")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
        <Markdown
          className={css(styles.disclaimer)}
          text={
            i`*We reserve the right to remove products that ` +
            i`violate this pricing variance policy.*`
          }
        />
        <Markdown
          className={css(styles.disclaimer, styles.subsectionEnd)}
          text={
            i`*If you have this need for legitimate reasons, please ` +
            i`contact your Account Manager or Merchant Support at ` +
            i`[merchant_support@wish.com](${"mailto:merchant_support@wish.com"}).*`
          }
          openLinksInNewTab
        />
      </PolicySubSection>

      {version == "archive" ? (
        <Section10Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section10Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={i`Extreme price increases within one product listing are prohibited`}
        subSectionNumber={`${sectionNumber}.11`}
        announcementsMap={announcementsMap}
        currentSection={currentSection}
      >
        <p>
          Merchants may increase prices for both promoted and non-promoted
          products (product price and/or shipping price) by {"  "}
          {formatCurrency(10, "USD")}* or up to {100}%, whichever is greater,
          within a {1}-week period. For a given product, this price restriction
          applies independently to the product price and shipping price.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360007954854")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>

      {version == "archive" ? (
        <Section12Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section12Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={i`Product Reference Price Policy`}
        subSectionNumber={`${sectionNumber}.13`}
        currentSection={currentSection}
      >
        <p>
          Listings include a field for a comparison or reference price (“MSRP
          Field”). Merchants are not required to provide a value for the MSRP
          Field. If Merchants choose to provide a value for the MSRP Field (a
          “Reference Price”), each Reference Price must comply with this Policy.
          A Reference Price must be truthful and not misleading. And Merchant
          may only include a Reference Price in a Listing if that dollar figure
          is an actual reference price of the item, which means it is either:
          (a) the Manufacturer’s Suggested Retail Price (MSRP) or similar list
          price of the product; or (b) the price at which the item was recently
          offered for sale and for a reasonable period of time.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360016868094")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Price Gouging Policy`}
        subSectionNumber={`${sectionNumber}.14`}
        currentSection={currentSection}
      >
        <p>
          {version == "archive"
            ? i`Manipulative pricing strategies are detrimental to the ` +
              i`customer experience and are not permitted on Wish. Effective ` +
              i`March 27, 2020, merchants found to be setting prices ` +
              i`significantly higher than reasonable market value for certain ` +
              i`products may be penalized up to ${formatCurrency(
                200,
                "USD",
              )}* per listing. These penalties may be disputed.`
            : i`Manipulative pricing strategies are detrimental to the customer ` +
              i`experience and are not permitted on Wish. Merchants found to be setting ` +
              i`prices significantly higher than reasonable market value for certain ` +
              i`products may be penalized up to ${formatCurrency(
                200,
                "USD",
              )}* per ` +
              i`listing. These penalties may be disputed.`}
        </p>
        <p className={subsectionEndClass}>
          <Link href="/policy/inappropriate-reasons/40" openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>

      <LocalCurrencyNotice />
    </PolicySection>
  );
};

const useStylesheet = (textLight: string) =>
  useMemo(
    () =>
      StyleSheet.create({
        subsectionEnd: {
          marginBottom: 0,
        },
        disclaimer: {
          marginBottom: 10,
          color: textLight,
        },
      }),
    [textLight],
  );

export default observer(ListingPolicy);
