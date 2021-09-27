import React from "react";
import { observer } from "mobx-react";

/* Lego Components */
import { Link } from "@ContextLogic/lego";
import { Markdown } from "@ContextLogic/lego";

/* Lego Toolkit */
import { formatCurrency } from "@ContextLogic/lego/toolkit/currency";

import PolicySection, {
  PolicyProps,
} from "@merchant/component/policy/policies/PolicySection";
import PolicySubSection from "@merchant/component/policy/policies/PolicySubSection";

import LocalCurrencyNotice from "@merchant/component/policy/policies/common/LocalCurrencyNotice";

const CustomerSupportPolicy = ({
  className,
  sectionNumber,
  version,
  currentSection,
}: PolicyProps) => (
  <PolicySection
    className={className}
    name="customer"
    title={i`Customer Support`}
    sectionNumber={sectionNumber}
    dateUpdated={i`July 16, 2020`}
    linkToVersion={version == "archive" ? undefined : "archive"}
  >
    <PolicySubSection
      title={i`If a store has an extremely high refund rate, its account will be suspended`}
      subSectionNumber={`${sectionNumber}.1`}
      currentSection={currentSection}
    >
      <p>
        <span>
          Refund rate is the number of orders refunded over the total number of
          orders received during a time period. If this rate is extremely high,
          a store will be suspended. A refund rate of less than {5}% is normal.
        </span>{" "}
        <Link href="/cs-performance-table" openInNewTab>
          View your store's refund rate
        </Link>
      </p>
    </PolicySubSection>

    <PolicySubSection
      title={i`If a store has an extremely high chargeback ratio, its account will be suspended`}
      subSectionNumber={`${sectionNumber}.2`}
      currentSection={currentSection}
    >
      <p>
        <span>
          Chargeback ratio is the number of orders which were charged back over
          the total number of orders received during a time period. If this
          ratio is extremely high, a store will be suspended. A chargeback ratio
          of less than {0.5}% is normal.
        </span>{" "}
        <Link href="/cs-performance-table" openInNewTab>
          View your store's chargeback ratio
        </Link>
      </p>
    </PolicySubSection>

    <PolicySubSection
      title={i`Customer abuse is not tolerated`}
      subSectionNumber={`${sectionNumber}.3`}
      currentSection={currentSection}
    >
      Abusive behaviour and language towards Wish customers is strictly
      prohibited and will not be tolerated.
    </PolicySubSection>

    <PolicySubSection
      title={i`Asking a customer to pay outside of Wish is prohibited`}
      subSectionNumber={`${sectionNumber}.4`}
      currentSection={currentSection}
    >
      If a merchant asks a customer to pay them outside of Wish, their account
      will be suspended.
    </PolicySubSection>

    <PolicySubSection
      title={i`Directing a customer off Wish is prohibited`}
      subSectionNumber={`${sectionNumber}.5`}
      currentSection={currentSection}
    >
      <Markdown
        text={
          i`If a merchant directs a customer off Wish, their account is ` +
          i`at risk of suspension and/or a penalty of ${formatCurrency(
            10000,
            "USD",
          )}* per incident. Please see [Policy 5.7 - Deceptive Fulfillment Policy](${"#5.7"}) ` +
          i`for further information.`
        }
      />
    </PolicySubSection>

    <PolicySubSection
      title={i`Asking a customer for personal information is prohibited`}
      subSectionNumber={`${sectionNumber}.6`}
      currentSection={currentSection}
    >
      If a merchant asks a customer for personal information such as payment
      information, email, etc, their account will be suspended.
    </PolicySubSection>

    <PolicySubSection
      title={i`Wish customers are entitled to timely, courteous and effective support`}
      subSectionNumber={`${sectionNumber}.7`}
      currentSection={currentSection}
    >
      Where customers have the ability to contact Merchants directly or where
      Merchants have opted to provide their own customer support, it must comply
      with this section 6.
    </PolicySubSection>

    <LocalCurrencyNotice />
  </PolicySection>
);

export default observer(CustomerSupportPolicy);
