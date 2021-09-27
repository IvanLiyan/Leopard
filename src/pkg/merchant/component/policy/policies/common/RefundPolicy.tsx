import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import Section1Latest from "@merchant/component/policy/policies/latest/refund/Section1";
import Section5Latest from "@merchant/component/policy/policies/latest/refund/Section5";
import Section17Latest from "@merchant/component/policy/policies/latest/refund/Section17";
import Section1Archive from "@merchant/component/policy/policies/archive/refund/Section1";
import Section5Archive from "@merchant/component/policy/policies/archive/refund/Section5";
import Section17Archive from "@merchant/component/policy/policies/archive/refund/Section17";

const RefundPolicy = ({
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
      name="refunds"
      title={i`Refund Policy`}
      sectionNumber={sectionNumber}
      dateUpdated={i`July 16, 2020`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      {version == "archive" ? (
        <Section1Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section1Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={i`Any order refunded by the merchant is not eligible for payment`}
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        <p>
          If an order is refunded by the merchant, the merchant will not be paid
          for the order.
        </p>
        <p className={subsectionEndClass}>
          Merchants are not allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund on ` +
          i`orders without valid or accurate tracking information`
        }
        subSectionNumber={`${sectionNumber}.3`}
        currentSection={currentSection}
      >
        <p>
          If an order has invalid, inaccurate or missing tracking information,
          the merchant is responsible for {100}% of the cost of a refund on that
          order.
        </p>
        <p>
          <span>
            If these refunds are for orders to Sweden, merchants cannot dispute
            these refunds.
          </span>{" "}
          <Link href={zendeskURL("360005219294")} openInNewTab>
            Learn more
          </Link>
        </p>
        <p>Otherwise, merchants are allowed to dispute these refunds.</p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("205212647")} openInNewTab>
            Learn more about providing valid tracking information
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund on ` +
          i`an order that is confirmed fulfilled after ${5} or more calendar days`
        }
        subSectionNumber={`${sectionNumber}.4`}
        currentSection={currentSection}
      >
        <p>
          If the confirmed fulfillment date is {5} calendar days or more after
          an order’s released time, the merchant is responsible for {100}% of
          the cost of a refund on that order.
        </p>
        <p className={subsectionEndClass}>
          Merchants are allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      {version == "archive" ? (
        <Section5Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section5Latest
          sectionNumber={sectionNumber}
          announcementsMap={announcementsMap}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={i`Merchant is responsible for ${100}% of any refund due to a size issue`}
        subSectionNumber={`${sectionNumber}.6`}
        currentSection={currentSection}
      >
        <p>
          If a refund occurs due to a customer sizing issue, the merchant is
          responsible for {100}% of the cost of the refund.
        </p>
        <p className={subsectionEndClass}>
          Merchants are allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund on ` +
          i`an order where merchant engages in fraudulent activity`
        }
        subSectionNumber={`${sectionNumber}.7`}
        currentSection={currentSection}
      >
        <p>
          If a merchant engages in fraudulent activity or circumvents revenue
          share, they are responsible for {100}% of the cost of any refund on
          the fraudulent orders.
        </p>
        <p className={subsectionEndClass}>
          Merchants are allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Merchant is responsible for ${100}% of any refund for items arriving damaged`}
        subSectionNumber={`${sectionNumber}.8`}
        currentSection={currentSection}
      >
        <p>
          If a refund occurs because the item arrived damaged, the merchant is
          responsible for {100}% of the cost of the refund.
        </p>
        <p className={subsectionEndClass}>
          Merchants are allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`items not matching the listings`
        }
        subSectionNumber={`${sectionNumber}.9`}
        currentSection={currentSection}
      >
        <p>
          If a refund occurs because the item received does not match the
          product listing being sold, the merchant is responsible for {100}% of
          the cost of the refund.
        </p>
        <p>
          Note: Product images should accurately depict the product being sold.
          Contradictions between the product image and product description could
          result in refunds for items not matching the listings.
        </p>
        <p className={subsectionEndClass}>
          Merchants are allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`If an account is suspended, the store is responsible for ${100}% of any refund`}
        subSectionNumber={`${sectionNumber}.10`}
        currentSection={currentSection}
      >
        <p>
          If a refund occurs while the merchant account is suspended, the
          merchant is responsible for {100}% of the cost of the refund.
        </p>
        <p className={subsectionEndClass}>
          Merchants are not allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`products with an extremely high refund ratio`
        }
        subSectionNumber={`${sectionNumber}.11`}
        currentSection={currentSection}
      >
        <p>
          Merchants will receive an infraction for each product with an
          extremely high refund ratio. The merchant is responsible for {100}% of
          the cost of refund for all orders for the product going forward and
          retroactively up to the last payment. Refund ratio is the number of
          orders refunded over the total number of orders received during a time
          period. A refund ratio of less than {5}% is acceptable.
        </p>

        <p>
          Depending on the refund ratio, products may be removed from Wish.
          Products that have a high refund ratio and are not removed from Wish
          are re-evaluated periodically. If the product is found to have a low
          refund ratio, the merchant will no longer be responsible for {100}% of
          refunds due to this policy.
        </p>

        <p>Merchants are not allowed to dispute these refunds.</p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("204630668")} openInNewTab>
            Learn about the Product Two-Tier High Refund Ratio Policy
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`products that are marked as counterfeit`
        }
        subSectionNumber={`${sectionNumber}.12`}
        currentSection={currentSection}
      >
        <p>
          Selling counterfeit products is prohibited on Wish. Products that
          infringe on intellectual property are removed and merchants are
          responsible for {100}% of the cost of refunds for the products.
        </p>
        <p className={subsectionEndClass}>
          Merchants are allowed to dispute these refunds on the corresponding
          infractions page in Merchant Dashboard.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`items that are sent to the wrong address`
        }
        subSectionNumber={`${sectionNumber}.13`}
        currentSection={currentSection}
      >
        <p>
          If a refund occurs because the item was sent to the wrong address, the
          merchant is responsible for {100}% of the cost of the refund.
        </p>
        <p className={subsectionEndClass}>
          Merchants are allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`items that are shipped incompletely`
        }
        subSectionNumber={`${sectionNumber}.14`}
        currentSection={currentSection}
      >
        <p>
          If a refund occurs because the order shipped was incomplete, the
          merchant is responsible for {100}% of the cost of the refund. An
          incomplete order is an order where the merchant did not ship the
          correct quantity of items or did not ship all parts of an item.
        </p>
        <p className={subsectionEndClass}>
          Merchants are allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`items that are returned to sender`
        }
        subSectionNumber={`${sectionNumber}.15`}
        currentSection={currentSection}
      >
        <p>
          If delivery fails and the carrier returns the item to the sender, the
          merchant is responsible for {100}% of the cost of the refund.
        </p>
        <p>Merchants are allowed to dispute these refunds.</p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("205443257")} openInNewTab>
            Learn about why items are returned to the sender
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`products with low ratings`
        }
        subSectionNumber={`${sectionNumber}.16`}
        currentSection={currentSection}
      >
        <p>
          Merchants will receive an infraction for each product with an
          extremely low rating average. The merchant is responsible for {100}%{" "}
          of the cost of refunds for all orders for the product going forward
          and retroactively up to the last payment.
        </p>

        <p>
          Depending on the average rating, products may be removed from Wish.
          Products that have a low average rating and are not removed from Wish
          are re-evaluated periodically. If the product is found to have a
          rating that is no longer low, then the merchant will no longer be
          responsible for {100}% of refunds due to this policy.
        </p>

        <p className={subsectionEndClass}>
          Merchants are not allowed to dispute these refunds.
        </p>
      </PolicySubSection>

      {version == "archive" ? (
        <Section17Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section17Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`orders shipped with unaccepted carriers`
        }
        subSectionNumber={`${sectionNumber}.18`}
        currentSection={currentSection}
      >
        <p>
          If an order is shipped with an unaccepted carrier, the merchant is
          responsible for {100}% of the cost of refunds.
        </p>
        <p>Merchants are not allowed to dispute these refunds.</p>
        <p className={subsectionEndClass}>
          <Link href="/documentation/shippingproviders" openInNewTab>
            Learn which carriers are accepted on the Wish platform
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchant is ineligible to receive payments from refunded ` +
          i`orders if the store has a high refund rate`
        }
        subSectionNumber={`${sectionNumber}.19`}
        currentSection={currentSection}
      >
        <p>
          If a merchant's store has a high refund rate, the merchant is
          responsible for {100}% of the cost of refunds for all orders going
          forward. Once the store's refund rate improves and is no longer high,
          the merchant will be responsible for refunds as per standards.
        </p>
        <p>Merchants are not allowed to dispute these refunds.</p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("235507527")} openInNewTab>
            Learn more about Merchant Two-Tier High Refund Policy
          </Link>
        </p>
      </PolicySubSection>
      <PolicySubSection
        title={
          i`Merchant is responsible for ${100}% of any refund for ` +
          i`products that are reported as dangerous or illegal in certain countries`
        }
        subSectionNumber={`${sectionNumber}.20`}
        currentSection={currentSection}
      >
        <p>
          If a merchant lists products that are considered to be dangerous or
          illegal in a country in which the products are sold, the merchant is
          responsible for {100}% of the cost of refunds for all orders from
          these specific countries.
        </p>
        <p>
          Due to the nature of these policy violations, merchants may not
          dispute these refunds.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360020887174")} openInNewTab>
            Learn more about Dangerous Product Refund Policy
          </Link>
        </p>
      </PolicySubSection>
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

export default observer(RefundPolicy);
