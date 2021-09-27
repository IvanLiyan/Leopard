import React, { useMemo } from "react";
import { StyleSheet } from "aphrodite";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";

/* Lego Toolkit */
import { css } from "@toolkit/styling";
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";
import { zendeskURL } from "@toolkit/url";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

const EPCPolicy = ({
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
      name="epc"
      title={i`EPC`}
      sectionNumber={sectionNumber}
      dateUpdated={i`July 16, 2020`}
      linkToVersion={version == "archive" ? undefined : "archive"}
    >
      <PolicySubSection
        title={
          i`Orders tagged as “Combined Order” must be fulfilled ` +
          i`with the WishPost EPC logistics channel`
        }
        subSectionNumber={`${sectionNumber}.1`}
        currentSection={currentSection}
      >
        <p>
          EPC-eligible orders tagged as “Combined Order” in Merchant Dashboard
          must be fulfilled with the WishPost EPC logistics channel. Merchants
          may ship un-combined EPC-eligible orders directly to customers; in
          this case, merchants are required to use the WishPost logistics
          channels to comply with the Confirmed Delivery Policy.
        </p>
        <p>
          Note for EPC Blue Orders: Orders marked as “Combined Order” with the
          destination of an EPC Blue warehouse are not eligible to be
          un-combined and must be fulfilled with the WishPost EPC logistics
          channel.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360008230173")} openInNewTab>
            Learn more about EPC “Combined Orders”
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={
          i`Any orders not delivered to EPC warehouses within 168 hours ` +
          i`of the order’s released time will incur additional charges`
        }
        subSectionNumber={`${sectionNumber}.2`}
        currentSection={currentSection}
      >
        <p>
          If an EPC order is not delivered to the correct EPC warehouse within
          {168} hours of the time that the “Combined Order” is released to the
          merchant, the merchant will be charged {100}% of the EPC fees based on
          the pricing schedule, plus an additional {50}% of the EPC fees based
          on pricing schedule. The corresponding order will not be eligible for
          any EPC benefits, including insurance coverage for logistics-related
          customer refunds, end-to-end tracking logistics service, or being
          eligible for payment faster.
        </p>
        <p>
          Merchants are allowed to dispute this additional {50}% fee via the EPC
          Dispute Tool within their WishPost account.
        </p>
        <p>
          Note for EPC Blue Orders: If an EPC Blue order is not delivered to the
          correct EPC Blue warehouse assigned by Wish within {168} hours of the
          order’s released time, the order will be refunded. An EPC Order Return
          Fee of {formatCurrency(2, "CNY")} per package may be charged to the
          merchant, along with other related fees according to Wish Merchant
          Policies.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360008230173")} openInNewTab>
            Learn more about the EPC delivery requirements and EPC benefits
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Sensitive or special products must be correctly declared`}
        subSectionNumber={`${sectionNumber}.3`}
        currentSection={currentSection}
      >
        <p>
          Merchants must correctly identify and declare sensitive or special
          products in WishPost before shipping them to EPC warehouses.
        </p>
        <p>
          {i`If merchants do not correctly identify and declare sensitive or ` +
            i`special products in WishPost, but deliver such products to EPC ` +
            i`warehouses, merchants will be charged an additional ` +
            i`${formatCurrency(1, "CNY")} per package as a Sensitive Product ` +
            i`Handling Fee.`}
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360008230173")} openInNewTab>
            Learn more about sensitive or special products currently supported
            by EPC
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Merchants must accurately input the product name in both Chinese and English`}
        subSectionNumber={`${sectionNumber}.4`}
        currentSection={currentSection}
      >
        <p>
          When creating orders for EPC “Combined Orders” in a WishPost account,
          merchants must correctly fill in the product name in both Chinese and
          English to accurately and sufficiently represent the product’s
          category, material, functions, and other key product details.
          Providing vague and/or prohibited product names is not allowed, and
          may prevent the products from passing customs clearance.
        </p>
        <p>
          If merchants are found to provide vague and/or prohibited product
          names for EPC orders, merchants will be charged an EPC Order Product
          Name Correction Fee of {formatCurrency(3, "CNY")} per package.
        </p>
        <p className={subsectionEndClass}>
          <Link href={zendeskURL("360023940514")} openInNewTab>
            Learn more about vague and/or prohibited product names
          </Link>
        </p>
      </PolicySubSection>

      <PolicySubSection
        title={i`Merchants must deliver orders to the EPC warehouse assigned by Wish`}
        subSectionNumber={`${sectionNumber}.5`}
        currentSection={currentSection}
      >
        Merchants must deliver EPC orders to the EPC warehouse assigned by Wish.
        Sending inventory to any other EPC warehouse will result in an
        additional charge of {formatCurrency(5, "CNY")} per package.
      </PolicySubSection>

      <PolicySubSection
        title={i`Merchants must input a valid Wish Order ID when creating orders`}
        subSectionNumber={`${sectionNumber}.6`}
        currentSection={currentSection}
      >
        <p>
          Merchants will be charged {100}% of the EPC fees based on the pricing
          schedule, plus an additional {50}% of the EPC fees based on the
          pricing schedule, for each order created in WishPost without a valid
          Wish Order ID.
        </p>
        <p className={subsectionEndClass}>
          <Link
            href="https://s3.cn-north-1.amazonaws.com.cn/wishpost-production-wishpost-announcement/%E5%85%B3%E4%BA%8E%E6%96%B0%E7%9A%84WishPost%E4%BA%A4%E6%98%93%E7%BC%96%E5%8F%B7%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99%E9%80%9A%E5%91%8A.pdf"
            openInNewTab
          >
            Learn more about Wish Order ID input instruction and verification
            process
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
    [],
  );

export default observer(EPCPolicy);
