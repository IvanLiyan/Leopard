/* eslint-disable local-rules/unnecessary-list-usage */

import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Table } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { wishURL, zendeskURL, externalURL } from "@toolkit/url";
import { CountryCode } from "@toolkit/countries";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { CountryColumn } from "@merchant/component/core";
import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import Section1Latest from "@merchant/component/policy/policies/latest/fulfillment/Section1";
import Section5Latest from "@merchant/component/policy/policies/latest/fulfillment/Section5";
import Section6Latest from "@merchant/component/policy/policies/latest/fulfillment/Section6";
import Section8Latest from "@merchant/component/policy/policies/latest/fulfillment/Section8";
import Section9Latest from "@merchant/component/policy/policies/latest/fulfillment/Section9";
import Section11Latest from "@merchant/component/policy/policies/latest/fulfillment/Section11";
import Section1Archive from "@merchant/component/policy/policies/archive/fulfillment/Section1";
import Section5Archive from "@merchant/component/policy/policies/archive/fulfillment/Section5";
import Section6Archive from "@merchant/component/policy/policies/archive/fulfillment/Section6";
import Section8Archive from "@merchant/component/policy/policies/archive/fulfillment/Section8";
import Section9Archive from "@merchant/component/policy/policies/archive/fulfillment/Section9";
import Section11Archive from "@merchant/component/policy/policies/archive/fulfillment/Section11";

import LocalCurrencyNotice from "@merchant/component/policy/policies/common/LocalCurrencyNotice";

const PR_APLUS_LAUNCH_DATE = new Date(Date.UTC(2021, 8, 10, 2, 0, 0)).getTime();

let dadaCountries: CountryCode[];

if (Date.now() > PR_APLUS_LAUNCH_DATE) {
  dadaCountries = [
    "AR",
    "AT",
    "AU",
    "BE",
    "BR",
    "CA",
    "CH",
    "CL",
    "CO",
    "CR",
    "DK",
    "EE",
    "FI",
    "FR",
    "DE",
    "HU",
    "ID",
    "IE",
    "IT",
    "JP",
    "LU",
    "MY",
    "MX",
    "NL",
    "NO",
    "NZ",
    "PL",
    "PR",
    "PT",
    "SA",
    "KR",
    "ES",
    "TH",
    "GB",
    "US",
    "ZA",
    "RO",
    "SK",
    "LT",
    "LV",
    "SI",
    "SE",
    "CZ",
    "GR",
  ];
} else {
  dadaCountries = [
    "AR",
    "AT",
    "AU",
    "BE",
    "BR",
    "CA",
    "CH",
    "CL",
    "CO",
    "CR",
    "DK",
    "EE",
    "FI",
    "FR",
    "DE",
    "HU",
    "ID",
    "IE",
    "IT",
    "JP",
    "LU",
    "MY",
    "MX",
    "NL",
    "NO",
    "NZ",
    "PL",
    "PT",
    "SA",
    "KR",
    "ES",
    "TH",
    "GB",
    "US",
    "ZA",
    "RO",
    "SK",
    "LT",
    "LV",
    "SI",
    "SE",
    "CZ",
    "GR",
  ];
}

let countryData: { countries: CountryCode[]; threshold: string }[];

if (Date.now() > PR_APLUS_LAUNCH_DATE) {
  countryData = [
    {
      countries: dadaCountries,
      threshold: `≥ ${formatCurrency(10, "USD")}*`,
    },
    {
      countries: ["UA"],
      threshold: `≥ ${formatCurrency(4, "USD")}*`,
    },
    {
      countries: ["RU"],
      threshold: `≥ ${formatCurrency(3, "USD")}*`,
    },
  ];
} else {
  countryData = [
    {
      countries: dadaCountries,
      threshold: `≥ ${formatCurrency(10, "USD")}*`,
    },
    {
      countries: ["PR"],
      threshold: `≥ ${formatCurrency(5, "USD")}*`,
    },
    {
      countries: ["UA"],
      threshold: `≥ ${formatCurrency(4, "USD")}*`,
    },
    {
      countries: ["RU"],
      threshold: `≥ ${formatCurrency(3, "USD")}*`,
    },
  ];
}

const aSuperEconomy = i`A-Super ECONOMY`;
const aSuperStandard = i`A-Super STANDARD`;

type ConfirmedDeliveryPolicyProps = {
  readonly sectionNumber: string;
  readonly subsectionEndClass: string;
  readonly paragraphClass: string;
  readonly currentSection?: string;
};
const confirmedDeliveryPolicy = ({
  sectionNumber,
  currentSection,
  paragraphClass,
  subsectionEndClass,
}: ConfirmedDeliveryPolicyProps) => {
  const tableColumnHeaderTitle = () => (
    <div>
      <span>Quantity * (Merchant Price + Merchant Shipping**) Threshold</span>
      <br />
      <span>(i.e., order value threshold)</span>
    </div>
  );

  return (
    <PolicySubSection
      title={
        i`Orders that qualify for the Confirmed Delivery Policy must ` +
        i`be shipped with one of our Confirmed Delivery carriers that ` +
        i`provide last mile tracking.`
      }
      subSectionNumber={`${sectionNumber}.4`}
      currentSection={currentSection}
    >
      <p>
        The Confirmed Delivery Policy affects orders that are shipped to the
        following countries with an order value above their respective
        thresholds.
      </p>
      <p>
        Order value is defined as 'quantity * (merchant price + merchant
        shipping)'.
      </p>
      <div className={paragraphClass}>
        <Table data={countryData}>
          <CountryColumn
            title={i`Countries`}
            columnKey="countries"
            width={600}
          />
          <Table.Column title={tableColumnHeaderTitle} columnKey="threshold" />
        </Table>
        <Markdown
          text={
            i`** The "Merchant Shipping" component will include an estimated ` +
            i`WishPost Shipping amount for orders bound for destination countries ` +
            i`included in Wish's unification initiative. ` +
            i`[${i`Learn more`}](${zendeskURL("360054912394")}).`
          }
          openLinksInNewTab
        />
      </div>
      <span>Requirements:</span>
      <ul>
        <li>
          Orders that qualify for the Confirmed Delivery Policy must be
          confirmed fulfilled within 7 calendar days from the order released
          time;
        </li>
        <li>
          Orders must be shipped by one of our qualified carriers with a method
          that provides last-mile tracking;
        </li>
        <li>
          Orders must be confirmed delivered by one of the qualified Confirmed
          Delivery shipping carriers within {30} calendar days of the order
          being available for fulfillment.
        </li>
      </ul>
      <p>
        Merchants that do not meet these requirements are at risk of account
        suspension.
      </p>
      <p>
        <Link href="/confirmed-delivery-policy" openInNewTab>
          Learn more about the Confirmed Delivery policy
        </Link>
      </p>
      <p className={subsectionEndClass}>
        <Link
          href="/documentation/confirmeddeliveryshippingcarriers"
          openInNewTab
        >
          View the list of qualified Confirmed Delivery shipping carriers that
          provides last-mile tracking
        </Link>
      </p>
    </PolicySubSection>
  );
};

const FulfillmentPolicy = ({
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
      name="fulfillment"
      title={i`Fulfillment`}
      sectionNumber={sectionNumber}
      dateUpdated={i`July 29, 2021`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      <PolicySubSection>
        Fulfilling orders promptly and accurately is the number one priority of
        a merchant receiving sales.
      </PolicySubSection>

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
        title={
          i`If a merchant has an extremely high number of orders ` +
          i`refunded by Merchant Policy 5.1, their account will be suspended`
        }
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        Auto-refund ratio is the number of orders automatically refunded due to
        Merchant Policy 5.1 over the number of orders received. If this ratio is
        extremely high, the account will be suspended.
      </PolicySubSection>

      <PolicySubSection
        title={
          i`If a merchant's fulfillment rate is extremely low, ` +
          i`their account will be suspended`
        }
        subSectionNumber={`${sectionNumber}.3`}
        currentSection={currentSection}
      >
        Fulfillment rate is the number of orders fulfilled over the number of
        orders received. If this rate is extremely low, their account will be
        suspended.
      </PolicySubSection>

      {confirmedDeliveryPolicy({
        sectionNumber,
        currentSection,
        paragraphClass: css(styles.paragraph),
        subsectionEndClass,
      })}

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

      <PolicySubSection
        title={i`Deceptive Fulfillment Policy`}
        subSectionNumber={`${sectionNumber}.7`}
        currentSection={currentSection}
      >
        <p>
          {i`Orders that are fulfilled deceptively are subject to decreased ` +
            i`impressions for your store and a penalty of ` +
            i`${formatCurrency(10000, "USD")}* per incident.`}
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360008005513")} openInNewTab>
            See examples and learn more
          </Link>
        </p>
      </PolicySubSection>

      {version == "archive" ? (
        <Section8Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section8Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      {version == "archive" ? (
        <Section9Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section9Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={
          i`Orders flagged as “Advanced Logistics Program Order” must ` +
          i`be fulfilled with required WishPost logistics channels`
        }
        subSectionNumber={`${sectionNumber}.10`}
        currentSection={currentSection}
      >
        <Markdown
          text={
            i`Eligible orders tagged as “Advanced Logistics Program Order” ` +
            i`must be fulfilled with one of the following WishPost logistics ` +
            i`channels based on whether the order is subject to the ` +
            i`[Confirmed Delivery Policy (Merchant Policy 5.4)](${"#5.4"}):`
          }
        />
        <ul>
          <li>{`${aSuperEconomy} (otype: 5001-1)`}</li>
          <li>{`${aSuperStandard} (otype: 5002-1)`}</li>
        </ul>
        <p className={subsectionEndClass}>
          If affected orders are not fulfilled with the two required logistics
          channels, merchants may be subject to penalties.
        </p>
      </PolicySubSection>

      {version == "archive" ? (
        <Section11Archive
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      ) : (
        <Section11Latest
          sectionNumber={sectionNumber}
          currentSection={currentSection}
        />
      )}

      <PolicySubSection
        title={
          i`Sensitive or special products within the Advanced Logistics ` +
          i`Program must be correctly declared`
        }
        subSectionNumber={`${sectionNumber}.12`}
        currentSection={currentSection}
      >
        <p>
          Merchants must correctly identify and declare sensitive or special
          products in WishPost before shipping them to the Advanced Logistics
          Program warehouse. Merchants must deliver general and
          sensitive/special products to the Advanced Logistics Program warehouse
          in separate packages.
        </p>
        <p className={subsectionEndClass}>
          {i`If merchants do not declare sensitive or special product type in ` +
            i`WishPost, but deliver such a product to an Advanced Logistics Program ` +
            i`warehouse, merchants will be charged an additional ` +
            i`${formatCurrency(
              1,
              "CNY"
            )} per package of Sensitive Product Handling` +
            i`Fee.`}
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Merchants must deliver orders to the correct Advanced ` +
          i`Logistics Program warehouse`
        }
        subSectionNumber={`${sectionNumber}.13`}
        currentSection={currentSection}
      >
        Merchants must deliver orders to the correct Advanced Logistics Program
        warehouse indicated in shipping address on Merchant Dashboard and
        WishPost. Sending orders to an incorrect warehouse address will result
        in an additional charge of {formatCurrency(5, "CNY")} per package.
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Orders flagged as “Pay Customer VAT “PC-VAT” required” must be ` +
          i`fulfilled with one of the acceptable shipping carriers ` +
          i`or WishPost logistics channels`
        }
        subSectionNumber={`${sectionNumber}.14`}
        currentSection={currentSection}
      >
        <p>
          Eligible orders flagged as “Pay Customer VAT “PC-VAT” required” must
          be fulfilled with one of the acceptable shipping carriers or WishPost
          logistics channels that offer support to pay Value Added Tax (VAT) on
          behalf of customers, and the customers remain the importers of record.
        </p>
        <p>
          If affected orders are not fulfilled with an acceptable shipping
          carrier or WishPost logistics channel, merchants may be subject to
          penalties.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360034845594")} openInNewTab>
            Learn more about a list of acceptable shipping carriers or WishPost
            logistics channels for “Pay Customer VAT “PC-VAT” required” orders
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Requirements for fulfilling and delivering less-than-truckload orders`}
        subSectionNumber={`${sectionNumber}.15`}
        currentSection={currentSection}
      >
        <Markdown
          text={
            i`If your large parcel products require LTL (less-than-truck-load) ` +
            i`transportation using freight shipping, the following policies apply. ` +
            i`Failing to abide by these policies may prevent orders from being ` +
            i`eligible for payment and may result in the merchant incurring certain ` +
            i`penalties:`
          }
        />
        <ul>
          <li>
            Merchants are encouraged to ship an LTL order within {5} calendar
            days after receipt of such order, and have up to {14} days after
            such order’s release to mark the LTL order as shipped. An LTL order
            not marked as shipped within {14} calendar days will be considered a
            late fulfillment and will be auto-refunded. Repeated late
            fulfillments may result in certain penalties as communicated by Wish
            to merchants.
          </li>
          <li>
            Merchants must select carriers that ensure the timely delivery of
            LTL orders, and Wish will assist with communicating to customers the
            delivery service types offered by the merchants.
          </li>
          <li>
            <Markdown
              text={
                i`Merchants must provide the delivery service level specified to the ` +
                i`customer at the time of purchase. Below are the delivery service ` +
                i`levels and their definitions:`
              }
            />
            <ul>
              <li>
                Curbside delivery: carriers will bring the parcel onto the
                sidewalk at the customer’s address.
              </li>
              <li>
                Delivery inside the nearest entrance: carriers will bring the
                parcel inside the nearest ground level entrance.
              </li>
              <li>
                Delivery to the room of choice: carriers will bring the parcel
                to the room of the customer’s choice.
              </li>
              <li>
                Whiteglove delivery: carriers will bring the parcel to the room
                of the customer’s choice, remove the outer package, and set up
                the product based on the customer’s needs.
              </li>
            </ul>
          </li>
          <li>
            If an LTL order is not confirmed fulfilled by the carrier tracking,
            the order may be ineligible for payment, and the merchant may be
            subject to certain penalties as communicated by Wish to the
            merchant. Merchants may dispute such penalty by providing evidence
            that the LTL order was fulfilled.
          </li>
          <li>
            Merchants must provide Wish with confirmation of an LTL order’s
            delivery if an LTL order is not confirmed fulfilled by carrier
            tracking within {2}
            days after the merchant marks the LTL order as shipped. Such
            confirmation of an LTL order’s delivery must be in the form of a
            delivery receipt or a carrier tracking link that indicates the
            delivery of the order.
          </li>
        </ul>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Products of Wish Pickup orders that are not retrieved ` +
          i`by customers may be relisted by Wish`
        }
        subSectionNumber={`${sectionNumber}.16`}
        currentSection={currentSection}
      >
        <Markdown
          className={css(styles.paragraph)}
          text={
            i`Certain Wish fulfillment programs* may facilitate fulfillment ` +
            i`for orders made by customers as part of the ` +
            i`[Wish Local program](${wishURL("/local")}), including (but ` +
            i`not limited to) ` +
            i`[Wish Pickup](${externalURL(
              "https://blog.local.wish.com/wish-local-how-it-works/"
            )}) orders.`
          }
          openLinksInNewTab
        />
        <Markdown
          className={css(styles.paragraph)}
          text={
            i`Should a customer place an order subject to Wish Pickup, ` +
            i`but fail to retrieve the order from the Wish Local Retailer location ` +
            i`within ${15} calendar days of the order being checked in by the ` +
            i`Wish Local Retailer, the merchant understands and agrees that ` +
            i`Wish may relist the corresponding product of the Wish Pickup order ` +
            i`on the Wish platform. The merchant may still be eligible for payment ` +
            i`for the order if the requirements outlined in ` +
            i`[Merchant Policy 9.2.2 - Order Payment Eligibility](${"/policy#fees_and_payments"}) ` +
            i`are met.`
          }
          openLinksInNewTab
        />
        <p>
          Should Wish relist the product, the merchant understands and agrees
          that, for any relisted product: (a) Wish shall not, and in no way be
          deemed to, take legal title to such product, (b) should Wish then
          complete a subsequent sale of such product, the merchant will not
          receive payment beyond any payment that the merchant had been eligible
          to receive and already received for such order, and (c) Wish may, at
          its discretion, use the same product listing, merchant identification,
          and any other information previously used by the merchant for such
          product.
        </p>

        <Markdown
          text={
            i`&ast; The following Wish fulfillment program is currently ` +
            i`subject to this policy:`
          }
        />
        <ul>
          <li>Advanced Logistics Program</li>
        </ul>
      </PolicySubSection>

      <LocalCurrencyNotice />
    </PolicySection>
  );
};

const useStylesheet = () =>
  useMemo(
    () =>
      StyleSheet.create({
        paragraph: {
          marginBottom: 10,
        },
        subsectionEnd: {
          marginBottom: 0,
        },
      }),
    []
  );

export default observer(FulfillmentPolicy);
